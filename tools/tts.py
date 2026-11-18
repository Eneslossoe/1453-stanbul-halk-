#!/usr/bin/env python3
"""Seslendirme: senaryo.json -> build/ses/*.wav, build/anlatim.wav, build/timeline.{json,js}, build/altyazi.srt

Kullanım: python3 tools/tts.py --model /yol/tr_TR-fettah-medium.onnx [--hiz 1.0]
Her cümle ayrı sentezlenir; böylece altyazı zamanlamaları cümle düzeyinde birebir doğru olur.
"""
import argparse, json, os, re, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR_OUT = 48000

ON_BOSLUK = 0.25      # segment başı sessizlik (sn)
SON_BOSLUK = 0.45     # segment sonu sessizlik
CUMLE_ARASI = 0.18    # aynı segmentte cümleler arası ek sessizlik
KART_ON = 0.55        # rütbe kartlarında whoosh için önde boşluk
KART_SON = 0.9


def cumlelere_bol(metin):
    # Nokta/ünlem/soru/iki nokta sonrası böl; "XI." gibi kısaltmaları koru
    korunan = re.sub(r'\b([IVX]+)\. ', r'\1§ ', metin.strip())
    parcalar = re.split(r'(?<=[.!?:])\s+(?=[A-ZÇĞİÖŞÜ0-9])', korunan)
    return [p.replace('§', '.') for p in parcalar if p]


def resample(x, sr_in, sr_out):
    if sr_in == sr_out:
        return x
    n = int(round(len(x) * sr_out / sr_in))
    t_in = np.arange(len(x)) / sr_in
    t_out = np.arange(n) / sr_out
    return np.interp(t_out, t_in, x).astype(np.float32)


def srt_zaman(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def altyazi_parcala(metin, bas, son, maks=84):
    """Uzun cümleyi virgüllerden, karakter sayısına orantılı sürelerle böl."""
    if len(metin) <= maks:
        return [(bas, son, metin)]
    kelimeler = metin.split()
    satirlar, cur = [], ""
    for k in kelimeler:
        aday = (cur + " " + k).strip()
        if len(aday) > maks and cur:
            satirlar.append(cur)
            cur = k
        else:
            cur = aday
            if k.endswith((',', ';')) and len(cur) > maks * 0.45:
                satirlar.append(cur)
                cur = ""
    if cur:
        satirlar.append(cur)
    toplam = sum(len(s) for s in satirlar)
    out, t = [], bas
    for s in satirlar:
        d = (son - bas) * len(s) / toplam
        out.append((t, t + d, s))
        t += d
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--hiz', type=float, default=1.0, help='length_scale (büyük = yavaş)')
    a = ap.parse_args()

    senaryo = json.load(open(os.path.join(KOK, 'senaryo', 'senaryo.json'), encoding='utf-8'))
    ses = PiperVoice.load(a.model)
    sr_in = ses.config.sample_rate
    cfg = SynthesisConfig(length_scale=a.hiz, noise_scale=0.6, noise_w_scale=0.75)

    os.makedirs(os.path.join(KOK, 'build', 'ses'), exist_ok=True)
    tum = []
    zaman = 0.0
    timeline = []
    srt = []

    for seg in senaryo['segmentler']:
        kart = seg['sahne'] == 'rutbe_kart'
        on = KART_ON if kart else ON_BOSLUK
        son_b = KART_SON if kart else SON_BOSLUK
        goster = cumlelere_bol(seg['metin'])
        oku = cumlelere_bol(seg.get('ses', seg['metin']))
        if len(goster) != len(oku):
            raise SystemExit(f"{seg['id']}: 'ses' ve 'metin' cümle sayısı farklı")

        parca = [np.zeros(int(on * SR_OUT), np.float32)]
        t_local = on
        cumleler = []
        for i, (g, o) in enumerate(zip(goster, oku)):
            chunks = list(ses.synthesize(o, syn_config=cfg))
            x = np.concatenate([c.audio_float_array for c in chunks]).astype(np.float32)
            x = resample(x, sr_in, SR_OUT)
            # baş/son sessizliği kırp
            env = np.abs(x) > 0.01
            if env.any():
                i0 = max(0, np.argmax(env) - int(0.02 * SR_OUT))
                i1 = min(len(x), len(x) - np.argmax(env[::-1]) + int(0.06 * SR_OUT))
                x = x[i0:i1]
            d = len(x) / SR_OUT
            cumleler.append({'metin': g, 'bas': round(zaman + t_local, 3), 'son': round(zaman + t_local + d, 3)})
            parca.append(x)
            t_local += d
            if i < len(goster) - 1:
                ara = CUMLE_ARASI + (0.12 if g.endswith(':') else 0.0)
                parca.append(np.zeros(int(ara * SR_OUT), np.float32))
                t_local += ara
        parca.append(np.zeros(int(son_b * SR_OUT), np.float32))
        t_local += son_b
        seg_audio = np.concatenate(parca)
        dur = len(seg_audio) / SR_OUT

        with wave.open(os.path.join(KOK, 'build', 'ses', seg['id'] + '.wav'), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_OUT)
            w.writeframes((np.clip(seg_audio, -1, 1) * 32767).astype(np.int16).tobytes())

        timeline.append({
            'id': seg['id'], 'bolum': seg['bolum'], 'sahne': seg['sahne'], 'p': seg.get('p', {}),
            'sfx': seg.get('sfx', []), 'bas': round(zaman, 3), 'sure': round(dur, 3),
            'konusma_bas': round(zaman + on, 3), 'konusma_son': round(zaman + t_local - son_b, 3),
            'metin': seg['metin'], 'cumleler': cumleler,
        })
        for c in cumleler:
            srt.extend(altyazi_parcala(c['metin'], c['bas'], c['son']))
        tum.append(seg_audio)
        zaman += dur
        print(f"{seg['id']:4s} {dur:6.2f}s  toplam {zaman/60:5.2f} dk")

    full = np.concatenate(tum)
    with wave.open(os.path.join(KOK, 'build', 'anlatim.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_OUT)
        w.writeframes((np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes())

    data = {'baslik': senaryo['baslik'], 'toplam': round(zaman, 3), 'segmentler': timeline}
    json.dump(data, open(os.path.join(KOK, 'build', 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(KOK, 'build', 'timeline.js'), 'w', encoding='utf-8') as f:
        f.write('window.TIMELINE = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    with open(os.path.join(KOK, 'cikti', 'altyazi.srt'), 'w', encoding='utf-8') as f:
        for i, (b, s, m) in enumerate(srt, 1):
            f.write(f"{i}\n{srt_zaman(b)} --> {srt_zaman(s)}\n{m}\n\n")
    print(f"TOPLAM: {zaman:.1f} sn = {zaman/60:.2f} dk, {len(srt)} altyazı satırı")


if __name__ == '__main__':
    main()
