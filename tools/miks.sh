#!/usr/bin/env bash
# Anlatım + müzik + efekt -> build/final_ses.wav ; video + ses -> cikti/1453_istanbul_halki.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -v error -i build/anlatim.wav -i build/muzik.wav -i build/sfx.wav -filter_complex \
"[0:a]highpass=f=60,bass=g=3.5:f=130:w=0.8,equalizer=f=320:t=q:w=1.4:g=-1.5,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-24dB:ratio=3.5:attack=4:release=90:makeup=2.5,volume=1.6,aformat=sample_fmts=fltp:channel_layouts=stereo[v];\
[v][1:a][2:a]amix=inputs=3:normalize=0:duration=longest[m];[m]loudnorm=I=-14:TP=-1.5:LRA=11[o]" \
  -map "[o]" -ar 48000 -c:a pcm_s16le build/final_ses.wav
if [ -f build/video_sessiz.mp4 ]; then
  ffmpeg -y -v error -i build/video_sessiz.mp4 -i build/final_ses.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 24 -tune animation -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart cikti/1453_istanbul_halki.mp4
  echo "TAMAM: cikti/1453_istanbul_halki.mp4"
fi
