// Tek kare önizleme:  node tools/kare.js <cikti.png> sahne:<ad>@<t>[:<sure>]  veya  t:<global_sn>
// Birden çok: node tools/kare.js <klasor> sahne:a@1 sahne:b@3 t:120 ...
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [hedef, ...istekler] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('SAYFA HATASI:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('KONSOL:', m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '../video/index.html'));
  await page.evaluate(() => window.hazir);
  const coklu = istekler.length > 1 || fs.existsSync(hedef) && fs.statSync(hedef).isDirectory();
  if (coklu) fs.mkdirSync(hedef, { recursive: true });
  for (const ist of istekler) {
    let ad;
    if (ist.startsWith('id:')) {
      const [id, tl] = ist.slice(3).split('@');
      await page.evaluate(([id, tl]) => window.renderId(id, tl), [id, parseFloat(tl)]);
      ad = id + '@' + tl;
    } else if (ist.startsWith('t:')) {
      const T = parseFloat(ist.slice(2));
      await page.evaluate(T => window.renderAt(T), T);
      ad = 't' + T.toFixed(1);
    } else {
      const m = ist.match(/^sahne:([^@]+)@([\d.]+)(?::([\d.]+))?(?::(.*))?$/);
      const p = m[4] ? JSON.parse(m[4]) : {};
      await page.evaluate(([a, t, d, p]) => window.renderSahne(a, t, d, p), [m[1], parseFloat(m[2]), m[3] ? parseFloat(m[3]) : 10, p]);
      ad = m[1] + '@' + m[2];
    }
    const out = coklu ? path.join(hedef, ad.replace(/[^\w@.-]/g, '_') + '.png') : hedef;
    await page.screenshot({ path: out });
    console.log(out);
  }
  await browser.close();
})();
