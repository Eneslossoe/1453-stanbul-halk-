#!/usr/bin/env python3
"""Sentez müzik + ses efektleri + miks.
build/timeline.json + build/anlatim.wav -> build/muzik.wav, build/sfx.wav, build/final_ses.wav
Tüm sesler burada sıfırdan üretilir (telifsiz).
"""
import json, os, wave
import numpy as np
from scipy import signal

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rs = np.random.default_rng(1453)


def oku_wav(p):
    with wave.open(p) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        return x.reshape(-1, w.getnchannels()) if w.getnchannels() > 1 else x


def yaz_wav(p, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = x[:, None]
    with wave.open(p, 'wb') as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def hz(nota):
    # nota: MIDI numarası
    return 440.0 * 2 ** ((nota - 69) / 12)


def zarf(n, a, r):
    e = np.ones(n, np.float32)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'low')
    return signal.lfilter(b, a, x, axis=0).astype(np.float32)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'high')
    return signal.lfilter(b, a, x, axis=0).astype(np.float32)


def bp(x, f1, f2, order=2):
    b, a = signal.butter(order, [f1 / (SR / 2), f2 / (SR / 2)], 'band')
    return signal.lfilter(b, a, x, axis=0).astype(np.float32)


def gurultu(n):
    return rs.standard_normal(n).astype(np.float32)


# ---------- müzik enstrümanları ----------
def ped(notalar, sure, parlak=1.0, detune=0.004):
    """Yumuşak pad akoru (stereo)."""
    n = int(sure * SR); t = np.arange(n) / SR
    out = np.zeros((n, 2), np.float32)
    for nota in notalar:
        f0 = hz(nota)
        for ch, dt in ((0, -detune), (1, detune)):
            f = f0 * (1 + dt)
            v = np.zeros(n, np.float32)
            for h in range(1, 7):
                if f * h > 5000: break
                v += np.sin(2 * np.pi * f * h * t + rs.uniform(0, 6.28)).astype(np.float32) / h ** (2.2 - .6 * parlak)
            out[:, ch] += v * (0.8 + 0.2 * np.sin(2 * np.pi * 0.13 * t + nota)).astype(np.float32)
    return out / max(1, len(notalar)) * 0.5


def koro(notalar, sure, vokal=(700, 1100, 2600)):
    """Formant ağırlıklı 'aaa' korosu."""
    n = int(sure * SR); t = np.arange(n) / SR
    out = np.zeros((n, 2), np.float32)
    for k, nota in enumerate(notalar):
        for ses in range(3):
            f0 = hz(nota) * (1 + rs.uniform(-.004, .004))
            vib = 1 + 0.004 * np.sin(2 * np.pi * (5 + ses * .4) * t + rs.uniform(0, 6))
            faz = 2 * np.pi * np.cumsum(f0 * vib) / SR
            v = np.zeros(n, np.float32)
            for h in range(1, 30):
                fh = f0 * h
                if fh > 4500: break
                g = sum(np.exp(-((fh - F) / 160) ** 2) * w for F, w in zip(vokal, (1, .7, .25))) + 0.02
                v += (np.sin(h * faz) * g / h ** .5).astype(np.float32)
            pan = (ses - 1) * 0.4
            out[:, 0] += v * (1 - pan) * .5; out[:, 1] += v * (1 + pan) * .5
    return out / max(1, len(notalar) * 3) * 0.7


def tel(nota, sure=1.8, parlak=1.0):
    """Mızraplı tel (ud/kanun benzeri) - toplamsal sentez."""
    n = int(sure * SR); t = np.arange(n) / SR
    f0 = hz(nota); v = np.zeros(n, np.float32)
    for h in range(1, 12):
        fh = f0 * h * (1 + 0.0004 * h * h)
        if fh > 9000: break
        tau = 0.9 / (1 + 0.7 * (h - 1)) * (0.6 + 0.4 * parlak)
        v += (np.sin(2 * np.pi * fh * t) * np.exp(-t / tau) / h ** (1.1 - .2 * parlak)).astype(np.float32)
    v[:int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return v * 0.35


def davul(guc=1.0, ton=1.0):
    n = int(0.6 * SR); t = np.arange(n) / SR
    f = 95 * ton * np.exp(-t * 6) + 48 * ton
    v = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    v += lp(gurultu(n), 1800) * np.exp(-t * 40) * 0.5
    return (v * guc * 0.8).astype(np.float32)


def tek(guc=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR
    v = bp(gurultu(n), 900, 4000) * np.exp(-t * 35) * 0.9 + np.sin(2 * np.pi * 380 * t) * np.exp(-t * 30) * 0.3
    return (v * guc * 0.6).astype(np.float32)


def can(f0=196.0, sure=6.0, guc=1.0):
    n = int(sure * SR); t = np.arange(n) / SR
    oran = [0.5, 1.0, 1.19, 1.5, 2.0, 2.52, 2.98, 4.07, 5.4]
    dek = [4.0, 3.2, 2.4, 2.0, 1.6, 1.2, 1.0, .7, .5]
    v = np.zeros(n, np.float32)
    for o, d, a in zip(oran, dek, [.5, 1, .6, .5, .45, .35, .3, .2, .15]):
        v += (np.sin(2 * np.pi * f0 * o * t) * np.exp(-t / d) * a).astype(np.float32)
    v += bp(gurultu(n), 2000, 6000) * np.exp(-t * 60) * .3
    return v * 0.25 * guc


# ---------- ses efektleri ----------
def sfx(ad):
    if ad == 'whoosh':
        n = int(0.8 * SR); t = np.arange(n) / SR
        x = gurultu(n); out = np.zeros(n, np.float32)
        for i, (f1, f2) in enumerate([(300, 900), (700, 2000), (1500, 4000), (700, 2000)]):
            seg = bp(x, f1, f2) * np.exp(-((t - (.15 + i * .12)) / .12) ** 2)
            out += seg
        return np.stack([out * .6, np.roll(out, 400) * .6], 1)
    if ad == 'dalga':
        n = int(9 * SR); t = np.arange(n) / SR
        x = lp(gurultu(n), 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.18 * t) ** 2) * zarf(n, 1.5, 2.5)
        return np.stack([x, lp(gurultu(n), 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.18 * t + 1) ** 2) * zarf(n, 1.5, 2.5)], 1) * .5
    if ad == 'zincir':
        n = int(2.2 * SR); out = np.zeros(n, np.float32); t = np.arange(int(.25 * SR)) / SR
        for k in range(14):
            st = int(rs.uniform(0, 1.8) * SR)
            c = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * rs.uniform(20, 40)) for f in rs.uniform(1800, 6000, 4))
            out[st:st + len(t)] += c.astype(np.float32) * rs.uniform(.1, .25)
        return np.stack([out, np.roll(out, 300)], 1) * .7
    if ad in ('top', 'top_uzak'):
        n = int(3.5 * SR); t = np.arange(n) / SR
        boom = lp(gurultu(n), 300 if ad == 'top' else 160, 4) * np.exp(-t * 1.6) * 3
        boom += np.sin(2 * np.pi * (45 + 40 * np.exp(-t * 8)) * t) * np.exp(-t * 2.5) * .9
        if ad == 'top':
            boom += bp(gurultu(n), 800, 5000) * np.exp(-t * 25) * 1.2
        g = 1.0 if ad == 'top' else .45
        return np.stack([boom, boom], 1).astype(np.float32) * g
    if ad == 'tas':
        n = int(2 * SR); out = np.zeros(n, np.float32); t = np.arange(int(.12 * SR)) / SR
        for k in range(40):
            st = int((rs.uniform(0, 1) ** 1.6) * 1.7 * SR)
            out[st:st + len(t)] += bp(gurultu(len(t)), rs.uniform(200, 600), rs.uniform(1500, 4000)) * np.exp(-t * 40) * rs.uniform(.2, .6)
        return np.stack([out, np.roll(out, 500)], 1) * .8
    if ad == 'can':
        x = can(rs.choice([174.6, 196.0, 220.0]), 5.5, 1.0)
        return np.stack([x, x * .9], 1)
    if ad == 'kapi':
        n = int(1.6 * SR); t = np.arange(n) / SR
        x = bp(gurultu(n), 150, 2500) * np.exp(-t * 6) * 1.4 + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 9)
        x2 = np.zeros(n, np.float32); st = int(.18 * SR)
        x2[st:] = x[:n - st] * .6
        y = (x + x2).astype(np.float32)
        return np.stack([y, y], 1) * .8
    if ad == 'gok':
        n = int(5 * SR); t = np.arange(n) / SR
        x = bp(gurultu(n), 1000, 6000) * np.exp(-t * 18) * 1.2
        rumble = lp(gurultu(n), 140, 4) * (1 + np.sin(2 * np.pi * 1.3 * t)) * np.exp(-t * .7) * 3
        y = (x + rumble).astype(np.float32)
        return np.stack([y, np.roll(y, 800)], 1) * .7
    if ad == 'kazma':
        n = int(4 * SR); out = np.zeros(n, np.float32); t = np.arange(int(.2 * SR)) / SR
        for k in range(7):
            st = int((0.2 + k * .55) * SR)
            hit = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 30) for f in (1200, 2650, 3900)) * .2 + lp(gurultu(len(t)), 500) * np.exp(-t * 25) * .8
            out[st:st + len(t)] += hit.astype(np.float32)
        return np.stack([out, out], 1) * .6
    if ad == 'savas':
        n = int(9 * SR); t = np.arange(n) / SR
        kalab = bp(gurultu(n), 300, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * .7 * t) * np.sin(2 * np.pi * .23 * t)) * zarf(n, 1, 3) * .9
        out = np.stack([kalab, np.roll(kalab, 2000)], 1)
        tt = np.arange(int(.15 * SR)) / SR
        for k in range(16):
            st = int(rs.uniform(0, 8.5) * SR); ch = k % 2
            clang = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 25) for f in rs.uniform(1500, 5000, 3)) * .15
            out[st:st + len(tt), ch] += clang.astype(np.float32)
        for k in range(4):
            st = int(rs.uniform(.5, 7) * SR); d = davul(.7)
            out[st:st + len(d)] += d[:, None] * .6
        return out * .8
    if ad == 'para':
        n = int(1.2 * SR); out = np.zeros(n, np.float32); t = np.arange(int(.3 * SR)) / SR
        for k in range(10):
            st = int(rs.uniform(0, .8) * SR)
            out[st:st + len(t)] += sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 18) for f in rs.uniform(3000, 7000, 3)).astype(np.float32) * .12
        return np.stack([out, np.roll(out, 200)], 1)
    if ad == 'koro':
        x = koro([50, 57, 62, 65], 7.0) * zarf(int(7 * SR), 2.5, 3)[:, None]
        return x * 1.6
    if ad == 'davul':
        n = int(3.2 * SR); out = np.zeros(n, np.float32)
        for tt, g in ((0, 1), (.8, .7), (1.6, 1), (2.2, .5)):
            d = davul(g); st = int(tt * SR); out[st:st + len(d)] += d[:n - st]
        return np.stack([out, out], 1) * .9
    raise ValueError(ad)


# ---------- bölüm müzikleri ----------
HICAZ = [62, 63, 66, 67, 69, 70, 72, 74]   # D Hicaz (Re-Mib-Fa#-Sol-La-Sib-Do-Re)
DM = [62, 64, 65, 67, 69, 70, 72, 74]       # D minör


def bolum_muzik(tur, sure):
    n = int(sure * SR); t = np.arange(n) / SR
    out = np.zeros((n, 2), np.float32)
    # akor dizisi
    diz = {
        'giris': [[38, 45, 50, 53], [34, 41, 50, 53], [36, 43, 48, 55], [33, 45, 49, 52]],
        'balikci': [[50, 57, 62, 66], [48, 55, 60, 63], [50, 57, 62, 66], [46, 53, 58, 62]],
        'kesis': [[38, 50, 57], [38, 50, 55], [38, 50, 57], [38, 50, 58]],
        'asker': [[38, 45, 50, 53], [39, 46, 51, 54], [38, 45, 50, 53], [36, 43, 48, 51]],
        'tuccar': [[50, 54, 57, 62], [48, 55, 58, 63], [50, 54, 57, 62], [55, 58, 62, 67]],
        'soylu': [[46, 53, 58, 62], [45, 52, 57, 61], [43, 50, 55, 58], [45, 52, 57, 61]],
        'imparator': [[38, 45, 50, 53], [34, 46, 50, 53], [31, 43, 50, 55], [33, 45, 49, 52]],
        'sonuc': [[50, 57, 62, 66], [47, 54, 59, 62], [43, 55, 59, 62], [45, 57, 61, 64]],
    }[tur]
    blok = 8.0
    i = 0; st = 0.0
    while st < sure:
        d = min(blok + 2, sure - st + 2)
        notalar = diz[i % len(diz)]
        if tur in ('kesis', 'imparator'):
            x = koro(notalar, d) * 1.2
        else:
            x = ped(notalar, d, parlak=1.2 if tur in ('tuccar', 'sonuc', 'balikci') else .8)
        x *= zarf(len(x), 2.0, 2.0)[:, None]
        a = int(st * SR); b = min(n, a + len(x))
        out[a:b] += x[:b - a]
        st += blok; i += 1
    # ison (dron)
    dron_g = {'giris': .5, 'kesis': .6, 'asker': .5, 'imparator': .5}.get(tur, .25)
    dr = (np.sin(2 * np.pi * hz(38) * t) * .6 + np.sin(2 * np.pi * hz(45) * t) * .3 + np.sin(2 * np.pi * hz(50) * t) * .2).astype(np.float32)
    dr *= (0.8 + 0.2 * np.sin(2 * np.pi * .07 * t)).astype(np.float32)
    out += dr[:, None] * dron_g * 0.25
    # tel melodisi
    if tur in ('balikci', 'tuccar', 'sonuc', 'soylu', 'giris'):
        aralik = {'balikci': .62, 'tuccar': .38, 'sonuc': .5, 'soylu': .9, 'giris': 1.2}[tur]
        olcek = HICAZ if tur in ('tuccar', 'giris', 'soylu') else (DM if tur == 'balikci' else [62, 64, 66, 67, 69, 71, 73, 74])
        k = 0; tt = 1.0; idx = 3
        while tt < sure - 2:
            if rs.random() < .82:
                idx = int(np.clip(idx + rs.choice([-2, -1, -1, 1, 1, 2]), 0, len(olcek) - 1))
                nota = olcek[idx] + (12 if tur == 'tuccar' and rs.random() < .3 else 0)
                x = tel(nota, 1.8, 1.2 if tur == 'tuccar' else .9) * (0.7 + 0.3 * rs.random())
                a = int(tt * SR); b = min(n, a + len(x)); pan = rs.uniform(-.4, .4)
                out[a:b, 0] += x[:b - a] * (1 - pan) * .55; out[a:b, 1] += x[:b - a] * (1 + pan) * .55
            tt += aralik * (2 if k % 8 == 7 else 1); k += 1
    # davul deseni
    if tur in ('giris', 'asker'):
        bpm = 72 if tur == 'giris' else 88
        vur = 60 / bpm
        tt = 0.5; k = 0
        while tt < sure - 1:
            d = davul(.9 if k % 4 == 0 else .55, 1.0)
            a = int(tt * SR); b = min(n, a + len(d)); out[a:b] += d[:b - a, None] * .5
            if k % 2 == 1:
                tk = tek(.5); a2 = int((tt + vur / 2) * SR); b2 = min(n, a2 + len(tk))
                if a2 < n: out[a2:b2] += tk[:b2 - a2, None] * .4
            tt += vur; k += 1
    return out


BOLUM_TUR = {'Giriş': 'giris', 'Balıkçı': 'balikci', 'Keşiş': 'kesis', 'Asker': 'asker', 'Tüccar': 'tuccar',
             'Soylu': 'soylu', 'İmparator': 'imparator', 'Sonuç': 'sonuc'}


def main():
    tl = json.load(open(os.path.join(KOK, 'build', 'timeline.json'), encoding='utf-8'))
    toplam = tl['toplam']; N = int(toplam * SR) + SR
    ses = oku_wav(os.path.join(KOK, 'build', 'anlatim.wav'))
    # bölümler
    bolumler = []
    for s in tl['segmentler']:
        if not bolumler or bolumler[-1][0] != s['bolum']:
            bolumler.append([s['bolum'], s['bas'], s['bas'] + s['sure']])
        else:
            bolumler[-1][2] = s['bas'] + s['sure']
    muzik = np.zeros((N, 2), np.float32)
    XF = 2.5
    for ad, b0, b1 in bolumler:
        print('müzik:', ad, round(b1 - b0, 1), 'sn')
        x = bolum_muzik(BOLUM_TUR[ad], b1 - b0 + XF * 2)
        x *= zarf(len(x), XF, XF)[:, None]
        a = max(0, int((b0 - XF) * SR)); off = 0 if b0 - XF >= 0 else int((XF - b0) * SR)
        b = min(N, a + len(x) - off)
        muzik[a:b] += x[off:off + b - a]
    # müzik seviyesini normalize et
    muzik /= (np.sqrt(np.mean(muzik ** 2)) + 1e-9)
    muzik *= 0.075
    # konuşmaya göre kısma (ducking)
    env = np.abs(ses)
    win = int(.25 * SR)
    env = np.convolve(env, np.ones(win) / win, mode='same')
    aktif = np.clip(env / 0.03, 0, 1)
    aktif = np.convolve(aktif, np.ones(int(.5 * SR)) / int(.5 * SR), mode='same')
    duck = np.ones(N, np.float32)
    duck[:len(aktif)] = 1 - 0.45 * aktif
    muzik *= duck[:, None]
    # rütbe kartlarında küçük vurgu: müziği biraz yükselt
    # efektler
    efekt = np.zeros((N, 2), np.float32)
    for s in tl['segmentler']:
        for ad, ofs in s['sfx']:
            x = sfx(ad)
            a = int((s['bas'] + ofs) * SR); b = min(N, a + len(x))
            efekt[a:b] += x[:b - a] * 0.55
    # sonda müziği kıs
    fade = int(3 * SR); son = int(toplam * SR)
    muzik[son - fade:son] *= np.linspace(1, 0, fade)[:, None]; muzik[son:] = 0
    yaz_wav(os.path.join(KOK, 'build', 'muzik.wav'), muzik)
    yaz_wav(os.path.join(KOK, 'build', 'sfx.wav'), efekt)
    print('müzik + efekt yazıldı')


if __name__ == '__main__':
    main()
