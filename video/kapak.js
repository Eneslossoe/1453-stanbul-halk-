// YouTube kapak görseli (1920x1080 çizilir, 1280x720'ye küçültülür)
SAHNELER.kapak = (t) => {
  const t0 = 1;
  // sol: gri, yağmurlu balıkçı
  let sol = gok('firtina') + `<rect width="${W}" height="${H}" fill="#3A4048" opacity=".3"/>`;
  sol += burcSiralari(-50, 420, 1100, 400, { dw: 50, seed: 3 }) + gedik(300, 420, 300, 200);
  sol += zemin(820, '#5A5A50', { cizgi: true });
  const r = rng(3);
  for (let i = 0; i < 70; i++) { const x = r() * 1100, y = r() * 1080; sol += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 14)}" y2="${f(y + 46)}" stroke="#C9D6E2" stroke-width="3" opacity=".6"/>`; }
  sol += karakter({ x: 470, y: 1140, s: 1.75, t: t0, rol: 'balikci', ifade: 'korku', poz: 'tut', esya: 'ekmek', bob: false });
  // sağ: altın, imparator
  let sag = altinZemin({ c1: '#FFE9A8', c2: '#E2A43A', c3: '#8A3A12' });
  for (let i = 0; i < 16; i++) sag += `<path d="M1450,500 L${1450 + Math.cos(i / 16 * 6.283) * 1600},${500 + Math.sin(i / 16 * 6.283) * 1600} L${1450 + Math.cos((i + .5) / 16 * 6.283) * 1600},${500 + Math.sin((i + .5) / 16 * 6.283) * 1600} Z" fill="#FFF3C4" opacity=".18"/>`;
  sag += ayasofya(1500, 820, .9);
  sag += karakter({ x: 1440, y: 1150, s: 1.75, t: t0, rol: 'imparator', ifade: 'kararli', poz: 'kilic', esya: 'kilic', kilicAci: -10, bob: false });
  let s = sol;
  s += `<g><clipPath id="kapakSag"><polygon points="1000,0 1920,0 1920,1080 860,1080"/></clipPath><g clip-path="url(#kapakSag)">${sag}</g></g>`;
  s += `<polygon points="985,0 1015,0 875,1080 845,1080" fill="#FFF4DC"/>`;
  // başlık
  s += yazi('1453', 960, 190, { fs: 250, font: 'baslik', renk: '#FFF4DC', kontur: '#1B2147', kw: 26, ls: 8 });
  s += G(tr(960, 395, 1, -2), `<rect x="-520" y="-62" width="1040" height="124" rx="16" fill="#D9241C" stroke="#1B2147" stroke-width="8"/>` + yazi('İSTANBUL HALKI OLSAYDIN?', 0, 6, { fs: 70, renk: '#fff', fw: 900 }));
  s += etiket('BALIKÇI', 300, 1000, { fs: 56, bg: '#C9D6E2', r: -4 });
  s += etiket('İMPARATOR', 1640, 1000, { fs: 56, bg: '#FFE9A8', r: 4 });
  return s;
};
