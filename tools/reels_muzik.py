#!/usr/bin/env python3
"""Reels için müzik + efekt + miks: build/reels/{anlatim,muzik,sfx,final_ses}.wav"""
import json, os, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import muzik as M  # noqa: E402

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(KOK, 'build', 'reels')
tl = json.load(open(os.path.join(R, 'timeline.json'), encoding='utf-8'))
SR = M.SR; N = int(tl['toplam'] * SR) + SR
ses = M.oku_wav(os.path.join(R, 'anlatim.wav'))
# tempolu, gerilimli taban: savaş davulu + pad
m = M.bolum_muzik('asker', tl['toplam'] + 1)[:N]
m = np.pad(m, ((0, max(0, N - len(m))), (0, 0)))
m /= (np.sqrt(np.mean(m ** 2)) + 1e-9); m *= 0.028
aktif = M.hareketli_ort(np.clip(M.hareketli_ort(np.abs(ses), int(.2 * SR)) / 0.03, 0, 1), int(.4 * SR))
duck = np.ones(N, np.float32); duck[:len(aktif)] = 1 - 0.65 * aktif
m *= duck[:, None]
son = int(tl['toplam'] * SR); fade = int(1.5 * SR)
m[son - fade:son] *= np.linspace(1, 0, fade)[:, None]; m[son:] = 0
e = np.zeros((N, 2), np.float32)
for o in tl['ogeler']:
    for ad, ofs in o.get('sfx', []):
        x = M.sfx(ad); a = int((o['bas'] + ofs) * SR); b = min(N, a + len(x))
        e[a:b] += x[:b - a] * (0.22 * M.SFX_SEVIYE.get(ad, 1.0))
M.yaz_wav(os.path.join(R, 'muzik.wav'), m); M.yaz_wav(os.path.join(R, 'sfx.wav'), e)
zincir = ("[0:a]highpass=f=60,bass=g=3.5:f=130:w=0.8,equalizer=f=320:t=q:w=1.4:g=-1.5,equalizer=f=3000:t=q:w=1.2:g=2,"
          "acompressor=threshold=-24dB:ratio=3.5:attack=4:release=90:makeup=2.5,volume=1.6,aformat=sample_fmts=fltp:channel_layouts=stereo[v];"
          "[v][1:a][2:a]amix=inputs=3:normalize=0:duration=longest[m];[m]loudnorm=I=-14:TP=-1.5:LRA=9[o]")
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(R, 'anlatim.wav'), '-i', os.path.join(R, 'muzik.wav'), '-i', os.path.join(R, 'sfx.wav'),
                '-filter_complex', zincir, '-map', '[o]', '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(R, 'final_ses.wav')], check=True)
print('reels sesi hazır')
