#!/usr/bin/env bash
# Tüm videoyu bölümlere ayırıp paralel render eder, sonra birleştirir.
# Kullanım: tools/render_hepsi.sh [paralel=3] [fps=30] [sadece_bu_parcalar...]
set -euo pipefail
cd "$(dirname "$0")/.."
P=${1:-3}; FPS=${2:-30}; shift 2 || true
mkdir -p build/parcalar
python3 - "$FPS" > build/parcalar/liste.txt <<'PY'
import json, sys
fps = int(sys.argv[1])
tl = json.load(open('build/timeline.json', encoding='utf-8'))
b = []
for s in tl['segmentler']:
    if not b or b[-1][0] != s['bolum']: b.append([s['bolum'], s['bas']])
sinir = [x[1] for x in b] + [tl['toplam']]
for i in range(len(b)):
    f0 = round(sinir[i] * fps); f1 = round(sinir[i + 1] * fps)
    print(f"{i:02d} {f0 / fps:.6f} {f1 / fps:.6f}")
PY
cat build/parcalar/liste.txt
SECILI="$*"
while read -r i bas son; do
  if [ -z "$SECILI" ] || [[ " $SECILI " == *" $i "* ]]; then echo "$i $bas $son"; fi
done < build/parcalar/liste.txt | xargs -P "$P" -L 1 bash -c 'node tools/render.js build/parcalar/p$0.mp4 $1 $2 '"$FPS"
: > build/parcalar/concat.txt
while read -r i bas son; do echo "file 'p$i.mp4'" >> build/parcalar/concat.txt; done < build/parcalar/liste.txt
ffmpeg -y -v error -f concat -safe 0 -i build/parcalar/concat.txt -c copy build/video_sessiz.mp4
echo "TAMAM: build/video_sessiz.mp4"
