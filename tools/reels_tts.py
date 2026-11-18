#!/usr/bin/env python3
"""Reels seslendirmesi: senaryo/reels.json -> build/reels/anlatim.wav + build/reels/timeline.{json,js}
Kullanım: python3 tools/reels_tts.py --model /yol/tr_TR-dfki-medium.onnx [--hiz 0.95]
"""
import argparse, json, os, sys, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts import resample, cumlelere_bol, SR_OUT  # noqa: E402

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAS_BOSLUK, ARA, SON_BOSLUK = 0.35, 0.28, 1.8


def parcalara_bol(metin, maks=18):
    """Altyazı için 2-3 kelimelik parçalar."""
    k = metin.split(); out, cur = [], ''
    for w in k:
        aday = (cur + ' ' + w).strip()
        if cur and (len(aday) > maks or cur.endswith((',', ':', '?', '!', '.'))):
            out.append(cur); cur = w
        else:
            cur = aday
    if cur: out.append(cur)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--hiz', type=float, default=0.95)
    a = ap.parse_args()
    sen = json.load(open(os.path.join(KOK, 'senaryo', 'reels.json'), encoding='utf-8'))
    ses = PiperVoice.load(a.model)
    cfg = SynthesisConfig(length_scale=a.hiz, noise_scale=0.6, noise_w_scale=0.75)
    os.makedirs(os.path.join(KOK, 'build', 'reels'), exist_ok=True)
    parca = [np.zeros(int(BAS_BOSLUK * SR_OUT), np.float32)]
    t = BAS_BOSLUK; ogeler = []
    for i, o in enumerate(sen['ogeler']):
        cumleler = cumlelere_bol(o['metin'])
        bas = t; altyazi = []
        for c in cumleler:
            x = np.concatenate([ch.audio_float_array for ch in ses.synthesize(c, syn_config=cfg)]).astype(np.float32)
            x = resample(x, ses.config.sample_rate, SR_OUT)
            env = np.abs(x) > 0.01
            if env.any():
                i0 = max(0, np.argmax(env) - int(0.02 * SR_OUT)); i1 = min(len(x), len(x) - np.argmax(env[::-1]) + int(0.05 * SR_OUT))
                x = x[i0:i1]
            d = len(x) / SR_OUT
            # parçalar: karakter sayısına orantılı zaman
            pp = parcalara_bol(c); top = sum(len(p) for p in pp); tt = t
            for p in pp:
                dd = d * len(p) / top; altyazi.append({'metin': p, 'bas': round(tt, 3), 'son': round(tt + dd, 3)}); tt += dd
            parca.append(x); t += d
            parca.append(np.zeros(int(0.12 * SR_OUT), np.float32)); t += 0.12
        son = t
        ara = SON_BOSLUK if i == len(sen['ogeler']) - 1 else ARA
        parca.append(np.zeros(int(ara * SR_OUT), np.float32)); t += ara
        ogeler.append(dict(o, bas=round(bas if i else 0.0, 3), sure=round(t - (bas if i else 0.0), 3), konusma_son=round(son, 3), altyazi=altyazi))
    full = np.concatenate(parca)
    with wave.open(os.path.join(KOK, 'build', 'reels', 'anlatim.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_OUT)
        w.writeframes((np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes())
    data = {'baslik': sen['baslik'], 'toplam': round(t, 3), 'ogeler': ogeler}
    json.dump(data, open(os.path.join(KOK, 'build', 'reels', 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(KOK, 'build', 'reels', 'timeline.js'), 'w', encoding='utf-8').write('window.REELS = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    for o in ogeler: print(f"{o['bas']:6.2f}  {o['sure']:5.2f}  {o['metin']}")
    print(f"TOPLAM: {t:.1f} sn")


if __name__ == '__main__':
    main()
