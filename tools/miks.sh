#!/usr/bin/env bash
# Anlatım + müzik + efekt -> build/final_ses.wav ; video + ses -> cikti/1453_istanbul_halki.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -v error -i build/anlatim.wav -i build/muzik.wav -i build/sfx.wav -filter_complex \
"[0:a]highpass=f=70,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,aformat=sample_fmts=fltp:channel_layouts=stereo,aecho=0.8:0.5:35:0.08[v];\
[v][1:a][2:a]amix=inputs=3:normalize=0:duration=longest[m];[m]loudnorm=I=-14:TP=-1.5:LRA=11[o]" \
  -map "[o]" -ar 48000 -c:a pcm_s16le build/final_ses.wav
if [ -f build/video_sessiz.mp4 ]; then
  ffmpeg -y -v error -i build/video_sessiz.mp4 -i build/final_ses.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart cikti/1453_istanbul_halki.mp4
  echo "TAMAM: cikti/1453_istanbul_halki.mp4"
fi
