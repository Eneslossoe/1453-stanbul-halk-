// Kare kare render: node tools/render.js <cikti.mp4> <bas_sn> <son_sn> [fps]
// Her kare: window.renderAt(t) -> JPEG ekran görüntüsü -> ffmpeg (H.264)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const [out, basS, sonS, fpsS] = process.argv.slice(2);
  const fps = parseInt(fpsS || '30', 10);
  const f0 = Math.round(parseFloat(basS) * fps), f1 = Math.round(parseFloat(sonS) * fps);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +(process.env.GEN || 1920), height: +(process.env.YUK || 1080) }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('SAYFA HATASI:', e.message));
  await page.goto('file://' + path.resolve(__dirname, '../video/' + (process.env.SAYFA || 'index.html')));
  await page.evaluate(() => window.hazir);
  const t0 = Date.now();
  for (let i = f0; i < f1; i++) {
    await page.evaluate(([T, fn]) => window[fn](T), [i / fps, process.env.FONK || 'renderAt']);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - f0) % 300 === 0) console.error(`[${path.basename(out)}] ${i - f0}/${f1 - f0} kare, ${((i - f0) / ((Date.now() - t0) / 1000 + 1e-9)).toFixed(1)} kare/sn`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.error(`[${path.basename(out)}] bitti: ${f1 - f0} kare, ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
})();
