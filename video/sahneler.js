// ===== Sahneler: Giriş + Rütbe kartı + Balıkçı =====
const SAHNELER = {};

SAHNELER.galeri = (t) => {
  let s = gok('gun') + `<rect y="900" width="1920" height="180" fill="#A9C27A"/>`;
  const roller = ['balikci', 'kesis', 'asker', 'tuccar', 'soylu', 'imparator', 'esir', 'sivil'];
  roller.forEach((r, i) => s += karakter({ x: 130 + i * 235, y: 520, s: .95, rol: r, t, poz: 'yan' }));
  const r2 = ['yeniceri', 'basibozuk', 'sultan', 'sovalye', 'orban', 'patrik', 'kardinal', 'kadin'];
  r2.forEach((r, i) => s += karakter({ x: 130 + i * 235, y: 1040, s: .95, rol: r, t }));
  return s;
};

// g01 — şafak, ordu surların önünde
SAHNELER.acilis_ordu = (t, d, p, seg) => {
  const ic = () => {
    let s = gok('safak') + gunes(1650, 690, 80, '#FFD9A0') + bulutlar(t, { n: 5, renk: '#F7B79A', op: .55, y0: 120, yr: 200, hiz: 8 });
    // şehir silüeti (surların ardında, koyu)
    s += `<g opacity=".9">${sehirSiluet(1700, 640, .55, { seed: 3 })}</g>`;
    // surlar
    s += sur(1050, 640, 1600, 150, { kuleAra: 300, kw: 100, kuleFark: 90, seed: 2 });
    s += tepe([[-300, 790], [300, 770], [900, 800], [1500, 780], [2400, 800]], '#5E6B3E');
    // çadırlar
    const rr = rng(12);
    for (let i = 0; i < 9; i++) s += cadir(-120 + i * 140 + rr() * 30, 820 + rr() * 20, .7 + rr() * .2, rr() > .6 ? '#E8C7B0' : '#F2EEE6');
    s += sancakBayrak(260, 840, .8, t) + sancakBayrak(760, 850, .7, t + 1);
    // asker sıraları
    s += askerSirasi(-150, 900, 34, 42, t, { s: 1.0, seed: 3 });
    s += askerSirasi(-180, 980, 30, 48, t, { s: 1.25, seed: 4 });
    s += askerSirasi(-200, 1075, 26, 56, t, { s: 1.5, seed: 5 });
    return s;
  };
  let s = kam(t, d, ic(), { z0: 1.12, z1: 1.0, x0: 120, x1: -80 });
  const t1 = B(seg, 1, 3.6);
  s += op(ap(t, .3, .8) * (1 - ap(t, t1 - .3, .6)), G(tr(960, 300), yazi('29 MAYIS 1453', 0, 0, { fs: 130, font: 'baslik', renk: '#FFF4DC', kontur: '#1B2147', kw: 16, ls: 6 }) + yazi('ŞAFAK VAKTİ', 0, 110, { fs: 54, renk: '#F6C28B', kontur: '#1B2147', kw: 10, ls: 10 })));
  s += etiketPop('~80.000 asker', 520, 760, t, t1 + 4.5, { fs: 40 });
  return s;
};

// g02 — şehir panoraması + nüfus
SAHNELER.sehir_panorama = (t, d, p, seg) => {
  const t1 = B(seg, 1, 5.7);
  let ic = gok('gun') + gunes(300, 200, 60, '#FFF1C2') + bulutlar(t, { n: 6 });
  ic += sehirSiluet(960, 740, 1.05, { seed: 21 });
  ic += burcSiralari(-100, 760, 2200, 70, { dw: 30, tugla: false });
  ic += deniz(830, t, { n: 30 });
  ic += gemi(1500, 900, .5, { t, yelken: '#F2E6CC' }) + sandal(400, 960, .7, t);
  let s = kam(t, d, ic, { z0: 1.0, z1: 1.08, cy: 600 });
  s += etiketPop('KONSTANTİNOPOLİS', 960, 120, t, .5, { fs: 52, bg: '#1B2147', renk: '#FFF4DC' });
  // nüfus sayacı
  const k = ap(t, t1 + .8, 2.8, easeIO);
  if (t > t1 - .2) {
    const n = lerp(500000, 45000, k);
    let pn = `<rect x="-330" y="-120" width="660" height="250" rx="26" fill="rgba(20,24,48,.88)" stroke="#E2B54B" stroke-width="6"/>`;
    pn += yazi('NÜFUS', 0, -78, { fs: 34, renk: '#E2B54B', fw: 900, ls: 4 });
    pn += yazi(sayi(Math.round(n / 1000) * 1000), 0, -10, { fs: 84, renk: '#FFF4DC', font: 'baslik' });
    for (let i = 0; i < 10; i++) pn += op(i === 0 ? 1 : 1 - ap(t, t1 + 1 + i * .22, .3), piktogram(-270 + i * 60, 100, .9, i === 0 ? '#E2B54B' : '#9CB3E0'));
    pn += yazi(k < .5 ? 'VI. yüzyıl' : '1453', 290, -78, { fs: 26, renk: '#9CB3E0', anc: 'end' });
    s += G(tr(960, 860, easeBack(ap(t, t1 - .2, .5))), pn);
  }
  return s;
};

// g03 — surların içindeki köyler
SAHNELER.sehir_koyler = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.6);
  let ic = harita(t, { koyler: ap(t, .3, 1.2), etiketler: true });
  let s = haritaZoom(lerp(780, 820, ap(t, 0, d, easeIO)), 560, lerp(1.25, 1.45, ap(t, 0, d, easeIO)), ic);
  s += etiketPop('Bağlar', 640, 330, t, .9, { fs: 34, bg: '#DDEBC4' });
  s += etiketPop('Bostanlar', 520, 800, t, 1.6, { fs: 34, bg: '#DDEBC4' });
  s += etiketPop('Yıkık saraylar', 1250, 820, t, 2.5, { fs: 34 });
  if (t > t1) {
    const k = .5 + .5 * Math.sin((t - t1) * 5);
    s += `<rect x="20" y="20" width="1880" height="1040" rx="20" fill="none" stroke="#E2B54B" stroke-width="${f(8 + k * 6)}" opacity=".8"/>`;
    s += baslikSerit('SURLARIN İÇİNDE KÖYLER', 960, 140, ap(t, t1, .5), { fs: 60 });
  }
  return s;
};

// g04 — soru: sen olsaydın?
SAHNELER.soru_karakter = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.0), t2 = B(seg, 2, 7.3);
  let s = altinZemin({ c1: '#FBE3A6', c2: '#E8A85A', c3: '#8A4A22' });
  // ışın
  for (let i = 0; i < 16; i++) s += `<path d="M960,620 L${960 + Math.cos(i / 16 * Math.PI * 2 + t * .1) * 1600},${620 + Math.sin(i / 16 * Math.PI * 2 + t * .1) * 1600} L${960 + Math.cos((i + .5) / 16 * Math.PI * 2 + t * .1) * 1600},${620 + Math.sin((i + .5) / 16 * Math.PI * 2 + t * .1) * 1600} Z" fill="#FFF3D0" opacity=".14"/>`;
  s += baslikSerit("1453'TE İSTANBUL HALKINDAN OLSAYDIN?", 960, 110, ap(t, .2, .6), { fs: 58 });
  // merdiven t1'den sonra
  const km = ap(t, t1, .7);
  if (km > 0) s += op(km, merdiven(1080, 960, .85, t > t2 ? 1 : 0, t));
  // karakter yürüyerek gelir
  const kx = t < t1 ? lerp(-200, 960, ap(t, 0, 1.6, easeOut)) : lerp(960, 640, ap(t, t1, .8, easeIO));
  let kxF = kx, ky = 960, ks = 1.15;
  if (t > t2) { // ilk basamağa zıpla
    const k = ap(t, t2 + .2, .7, easeIO);
    kxF = lerp(640, 1080 + 75 * .85, k); ky = lerp(960, 960, k) - Math.sin(k * Math.PI) * 160; ks = lerp(1.15, .62, k);
  }
  s += karakter({ x: kxF, y: ky, s: ks, t, rol: 'sivil', ifade: t < 1.6 ? 'normal' : (t < t2 ? 'saskin' : 'mutlu'), yuru: t < 1.6, poz: t > t1 && t < t2 ? 'isaret' : 'yan', bak: t > t1 ? 1 : 0 });
  if (t > 1.7 && t < t2 + .2) s += G(tr(kxF + 150, ky - 520, easeBack(ap(t, 1.7, .4)) * (1 + .05 * Math.sin(t * 6))), soruIsareti(0, 0, 1));
  if (t > t2) s += ok(560, 620, 1060, 840, ap(t, t2, .5), { renk: '#3FAE5A' }) + etiketPop('En alttan başla!', 470, 560, t, t2, { fs: 40, bg: '#DDF2C4' });
  return s;
};

// Rütbe kartı
SAHNELER.rutbe_kart = (t, d, p) => {
  const n = p.n || 1;
  let s = `<rect width="${W}" height="${H}" fill="#141A3A"/>`;
  // desen
  for (let x = 0; x < W + 120; x += 120) for (let y = 0; y < H + 120; y += 120) {
    s += `<path d="M${x},${y - 30} L${x + 30},${y} L${x},${y + 30} L${x - 30},${y} Z" fill="none" stroke="#2A3366" stroke-width="4"/>`;
  }
  s += `<rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="#E2B54B" stroke-width="8"/><rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="#E2B54B" stroke-width="3"/>`;
  // merdiven
  const mx = 120, my = 960, ms = .8;
  s += op(ap(t, 0, .3), merdiven(mx, my, ms, n, t, { karakter: true }));
  // karakter basamağa iner
  const bx = mx + ((n - 1) * 150 + 75) * ms, by = my - (n - 1) * 95 * ms;
  const k = ap(t, .15, .55, easeOut);
  s += karakter({ x: bx, y: lerp(by - 700, by, k), s: .55, t, rol: p.rol, ifade: 'mutlu', poz: k < 1 ? 'kaldir' : 'salla', esya: p.rol === 'asker' ? 'mizrak' : null });
  // başlık
  const kb = ap(t, .35, .6, easeBack);
  s += G(tr(1390, 430, Math.max(.01, kb)), yazi(`RÜTBE ${n}`, 0, -40, { fs: 64, renk: '#E2B54B', font: 'baslik', ls: 8 }));
  const kt = ap(t, 1.3, .6, easeBack);
  const unvan = (p.unvan || '').toLocaleUpperCase('tr');
  s += G(tr(1390, 590, Math.max(.01, kt)), yazi(unvan, 0, 0, { fs: unvan.length > 12 ? 92 : 120, renk: '#FFF4DC', font: 'baslik', kontur: '#8A5A12', kw: 10 }));
  s += `<rect x="${1390 - 300 * kt}" y="680" width="${600 * kt}" height="6" fill="#E2B54B"/>`;
  return s;
};

// b02 — Haliç kıyısında kulübe
SAHNELER.balikci_kulube = (t, d, p, seg) => {
  const t2 = B(seg, 2, 4.5);
  let ic = gok('gun') + bulutlar(t, { n: 5, y0: 60, yr: 160 });
  // karşı kıyı (Galata tepeleri)
  ic += tepe([[-100, 520], [400, 470], [900, 500], [1400, 450], [2100, 500]], '#8FA36A', { cizgi: false });
  for (let i = 0; i < 12; i++) ic += ev(120 + i * 150, 520 + (i % 3) * 8, .35, '#E3C9A3', '#B5583C');
  ic += deniz(560, t, { n: 22 });
  ic += sandal(1480, 740, .9, t) + sandal(300, 650, .5, t + 1);
  // kıyı
  ic += `<path d="M-100,780 Q500,740 1100,770 Q1500,790 2100,760 L2100,1200 L-100,1200 Z" fill="#D9C08E" stroke="${OUT}" stroke-width="5"/>`;
  // ağ direkleri
  ic += `<line x1="1180" y1="900" x2="1180" y2="640" stroke="#6B4A2E" stroke-width="12"/><line x1="1520" y1="900" x2="1520" y2="640" stroke="#6B4A2E" stroke-width="12"/>`;
  ic += `<path d="M1180,650 Q1350,${760 + Math.sin(t * 2) * 6} 1520,650 L1520,760 Q1350,${850 + Math.sin(t * 2) * 6} 1180,760 Z" fill="rgba(160,140,100,.35)" stroke="#8A7A5A" stroke-width="4"/>`;
  for (let i = 1; i < 8; i++) ic += `<line x1="${1180 + i * 42}" y1="${655 + Math.sin(i / 8 * Math.PI) * 100}" x2="${1180 + i * 42}" y2="${765 + Math.sin(i / 8 * Math.PI) * 90}" stroke="#8A7A5A" stroke-width="3"/>`;
  // kulübe
  let k = `<rect x="-230" y="-300" width="460" height="300" fill="#9C6B3E" stroke="${OUT}" stroke-width="6"/>`;
  for (let x = -230; x < 230; x += 46) k += `<line x1="${x}" y1="-300" x2="${x + 4}" y2="0" stroke="#7A4E2A" stroke-width="5"/>`;
  k += `<path d="M-270,-290 L-20,-440 L270,-300 Z" fill="#7A5A3A" stroke="${OUT}" stroke-width="6"/>`;
  k += `<path d="M30,-400 L80,-372 L60,-340 Z" fill="#3A2A1C"/>`; // çatı deliği
  k += `<path d="M-60,0 L-60,-170 L60,-170 L60,0 Z" fill="#3A2A1C" stroke="${OUT}" stroke-width="5"/>`;
  k += `<rect x="120" y="-220" width="70" height="60" fill="#3A2A1C" stroke="${OUT}" stroke-width="5"/>`;
  ic += G(tr(560, 880), k);
  // damla + kova
  const dk = (t * 1.3) % 1;
  ic += `<ellipse cx="625" cy="${f(560 + dk * 250)}" rx="8" ry="12" fill="#8FD0F0" stroke="${OUT}" stroke-width="3"/>`;
  ic += `<path d="M590,880 L600,830 L660,830 L670,880 Z" fill="#8D96A0" stroke="${OUT}" stroke-width="4"/>`;
  // karakter kapıdan çıkıp gerinir
  const ck = ap(t, .3, 1.2);
  const kx = lerp(560, 860, ck);
  ic += karakter({ x: kx, y: 900, s: .95, t, rol: 'balikci', ifade: t < B(seg, 1, 1.1) + 1.5 ? 'uykulu' : 'mutlu', poz: t > 1.5 && t < 4 ? 'gerin' : 'yan', yalinayak: true, yuru: ck > 0 && ck < 1 });
  let s = kam(t, d, ic, { z0: 1.05, z1: 1.0 });
  s += etiketPop('HALİÇ', 960, 480, t, B(seg, 1, 1.1), { fs: 40, bg: '#CFE8F2' });
  s += etiketPop('Tek oda', 420, 440, t, t2 + .2, { fs: 34 });
  s += etiketPop('Akıtan çatı', 760, 330, t, t2 + 1.0, { fs: 34 });
  s += etiketPop('Ağlar', 1350, 560, t, t2 + 2.2, { fs: 34 });
  return s;
};

// b03 — balık tut, pazarda sat
SAHNELER.balikci_pazar = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.2);
  return parca(t, [
    [0, lt => {
      let s = gok('gun') + bulutlar(lt, { n: 4 }) + gunes(1600, 160, 60, '#FFF1C2');
      s += deniz(600, lt, { n: 30 });
      s += sandal(900, 760, 1.4, lt);
      s += karakter({ x: 900, y: 735, s: .8, t: lt, rol: 'balikci', ifade: 'mutlu', poz: lt > 1.8 ? 'kaldir' : 'tut', esya: lt > 1.8 ? null : 'ag' });
      // zıplayan balıklar
      [[600, 0, '#7FA6B8', 'Palamut'], [1250, 1.0, '#6E9AA0', 'Uskumru']].forEach(([x, ph, c, ad], i) => {
        const k = ((lt + ph) % 2) / 2;
        const y = 820 - Math.sin(k * Math.PI) * 260;
        s += balik(x + k * 120, y, 1.2, c);
        s += etiketPop(ad, x + 60, 560, lt, .6 + i * .9, { fs: 36, bg: '#CFE8F2' });
      });
      if (lt > 1.8) s += balik(900, 360, 1.2, '#7FA6B8');
      return s;
    }],
    [t1 - .1, lt => {
      let s = gok('gun') + `<rect x="0" y="560" width="${W}" height="520" fill="#C8A878"/>`;
      s += kemerler(560, 5, '#D9C29A', '#8A6A48');
      s += `<rect x="0" y="700" width="${W}" height="400" fill="#BFA070" stroke="${OUT}" stroke-width="5"/>`;
      // tezgâh
      s += `<path d="M980,540 L1700,540 L1740,620 L940,620 Z" fill="#C2694A" stroke="${OUT}" stroke-width="5"/><path d="M980,540 L1700,540" stroke="#F2E6CC" stroke-width="16" stroke-dasharray="60 60"/>`;
      s += `<rect x="960" y="700" width="760" height="40" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/><rect x="980" y="740" width="30" height="200" fill="#6B4A2E"/><rect x="1670" y="740" width="30" height="200" fill="#6B4A2E"/>`;
      s += ekmek(1080, 680, 1) + ekmek(1190, 685, .9) + ekmek(1135, 650, .9);
      s += `<path d="M1330,700 Q1400,740 1470,700 Z" fill="#8B5A2B" stroke="${OUT}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${1350 + (i % 3) * 30}" cy="${684 - Math.floor(i / 3) * 18}" rx="14" ry="10" fill="#4A5A2A" stroke="${OUT}" stroke-width="3"/>`).join('');
      s += karakter({ x: 1580, y: 940, s: .8, t: lt, rol: 'sivil', ifade: 'normal', renkler: { govde: '#6F7FA8', kol: '#6F7FA8' }, yon: -1, poz: 'tut' });
      s += karakter({ x: 620, y: 960, s: 1.0, t: lt, rol: 'balikci', ifade: lt > 2.5 ? 'mutlu' : 'normal', poz: 'tut', esya: lt < 2.2 ? 'balik' : 'ekmek', yalinayak: true });
      s += ok(760, 560, 1000, 560, ap(lt, .8, .6), { renk: '#3FAE5A' }) + ok(1000, 620, 760, 620, ap(lt, 1.6, .6), { renk: '#E2B54B' });
      s += etiketPop('Balık', 880, 500, lt, .9, { fs: 34 });
      s += etiketPop('Arpa ekmeği + zeytin', 1300, 470, lt, 1.8, { fs: 34 });
      return s;
    }],
  ]);
};

// b04 — Haliç zinciri
SAHNELER.zincir = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.6), t2 = B(seg, 2, 7.1);
  const zk = ap(t, 0, d, easeIO);
  let ic = harita(t, { etiketler: true });
  const [ax, ay] = HARITA.zincirA, [bx, by] = HARITA.zincirB;
  const kz = ap(t, t1 + .3, 2.2, easeIO);
  if (kz > 0) ic += zincirHat(ax, ay, lerp(ax, bx, kz), lerp(ay, by, kz), .55, 10);
  // sandal zincire gelir
  if (t > t2 - .5) {
    const k = ap(t, t2 - .5, 1.5, easeOut);
    ic += sandal(lerp(1180, 1270, k), lerp(470, 515, k), .22, t);
  }
  let s = haritaZoom(lerp(1100, 1280, zk), lerp(520, 540, zk), lerp(1.3, 2.6, zk), ic);
  s += baslikSerit('NİSAN 1453', 960, 120, ap(t, .2, .5), { fs: 56 });
  s += etiketPop('Dev zincir', 1500, 330, t, t1 + 1.2, { fs: 40 });
  s += op(ap(t, t2 + .5, .4), G(tr(1200, 760), carpi(0, 0, 1.6, 1)) + etiket('Açık denize çıkış yok!', 1200, 870, { fs: 38, bg: '#FFD9CF' }));
  return s;
};

// b05 — Boğazkesen (Rumeli Hisarı)
function rumeliHisari(x, y, s = 1) {
  let g = '';
  g += `<path d="M-300,0 L-300,-120 L-80,-260 L120,-200 L320,-60 L320,0 Z" fill="#C9B48A" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 18; i++) g += `<rect x="${-300 + i * 35}" y="${-130 - Math.max(0, Math.min(140, 140 - Math.abs(i - 7) * 20))}" width="18" height="18" fill="#C9B48A" stroke="${OUT}" stroke-width="3"/>`;
  [[-250, -110, 70, 220], [-60, -250, 90, 300], [260, -60, 80, 230]].forEach(([tx, ty, tw, th]) => {
    g += `<rect x="${tx - tw / 2}" y="${ty - th + 40}" width="${tw}" height="${th}" fill="#D4C09A" stroke="${OUT}" stroke-width="5"/>`;
    g += `<path d="M${tx - tw / 2 - 10},${ty - th + 42} L${tx},${ty - th - 60} L${tx + tw / 2 + 10},${ty - th + 42} Z" fill="#7F8E9C" stroke="${OUT}" stroke-width="5"/>`;
    g += `<rect x="${tx - 8}" y="${ty - th + 90}" width="16" height="30" rx="8" fill="${OUT}"/>`;
  });
  return G(tr(x, y, s), g);
}
SAHNELER.bogazkesen = (t, d, p, seg) => {
  const t1 = B(seg, 1, 5.7), t2 = B(seg, 2, 6.8);
  let ic = gok('gun') + bulutlar(t, { n: 4, y0: 40, yr: 140 });
  ic += tepe([[1100, 520], [1500, 420], [2100, 470]], '#7E9A5A');
  ic += tepe([[-200, 380], [300, 330], [700, 520], [900, 640]], '#8FA36A');
  ic += rumeliHisari(360, 560, 1.0);
  ic += deniz(600, t, { n: 26 });
  // gemi geçmeye çalışır
  const gx = lerp(1700, 980, ap(t, t2 - 1.5, 3.5, easeOut));
  const vurus = t2 + 1.2;
  const bat = ap(t, vurus + .3, 2.5, easeIO);
  ic += `<g transform="translate(0,${f(bat * 160)}) rotate(${f(bat * 22)} ${f(gx)} 760)" opacity="${f((1 - bat * .6) * 100) / 100}">${gemi(gx, 760, .8, { t, bayrak: '#B3262E', yelken: '#F2E6CC' })}</g>`;
  // top atışı hisardan
  const atis = t2 + .4;
  if (t > atis && t < vurus) { const k = (t - atis) / (vurus - atis); ic += gulle(lerp(560, gx - 20, k), lerp(430, 700, k) - Math.sin(k * Math.PI) * 120, 18); }
  ic += patlama(560, 430, t, atis, .5) + duman(560, 430, t, atis, { boy: .6 });
  ic += patlama(gx - 20, 700, t, vurus, .7) + duman(gx, 700, t, vurus, { boy: .8 });
  if (t > vurus + .2) ic += `<ellipse cx="${gx}" cy="830" rx="${200 * bat}" ry="${30 * bat}" fill="none" stroke="#fff" stroke-width="5" opacity="${1 - bat}"/>`;
  let s = G(sars(t, [vurus]), kam(t, d, ic, { z0: 1.0, z1: 1.06 }));
  s += etiketPop('1452', 360, 140, t, .8, { fs: 40 });
  s += op(ap(t, t1 - .1, .3), baslikSerit('BOĞAZKESEN', 960, 110, ap(t, t1 - .1, .5), { fs: 62 }) + etiket('(Rumeli Hisarı)', 960, 200, { fs: 32 }));
  return s;
};

// b06 — gündüz bombardıman, gece onarım
SAHNELER.gece_onarim = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.0), t2 = B(seg, 2, 6.1);
  const gece = ap(t, t2 - .4, .8, easeIO);
  let s = gok('gun') + op(gece, gok('gece') + yildizlar(t) + ay(1650, 160, 50));
  s += tepe([[-100, 760], [800, 740], [2100, 760]], gece > .5 ? '#2A3A2E' : '#7E9A5A', { cizgi: false });
  // sur ve gedik
  const surIc = sur(-50, 420, 2100, 360, { kuleAra: 620, kw: 160, kuleFark: 110, seed: 8 });
  s += surIc;
  const hasar = ap(t, t1 + .6, .3);
  if (hasar > 0) s += gedik(780, 420, 360, 280 * hasar);
  // gündüz gülleler
  [t1 + .3, t1 + 1.2].forEach((tt, i) => {
    if (t > tt - .5 && t < tt) { const k = (t - (tt - .5)) / .5; s += gulle(lerp(1900, 900 + i * 120, k), lerp(200, 520, k), 26); }
    s += patlama(900 + i * 120, 520, t, tt, .8) + duman(900 + i * 120, 520, t, tt);
  });
  // gece onarım: fıçılar ve kazıklar
  if (gece > 0) {
    s += op(gece, `<rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="#0A1030" opacity=".45"/>`);
    const n = Math.floor(clamp((t - t2) / 6) * 6);
    for (let i = 0; i < n; i++) s += fici(820 + (i % 3) * 100, 700 - Math.floor(i / 3) * 90, .95);
    for (let i = 0; i < 5; i++) if (t > t2 + 1 + i * .8) s += `<path d="M${790 + i * 80},${710} L${800 + i * 80},${500} L${815 + i * 80},${710}" fill="#8B5A2B" stroke="${OUT}" stroke-width="4"/>`;
    s += mesale(600, 560, 1.2, t) + mesale(1300, 560, 1.2, t + 1);
    s += kalabalik(200, 1000, 4, 120, t, { s: .55, ifadeler: ['kararli', 'endise'], poz: 'tasi', seed: 9 });
    s += kalabalik(1360, 1000, 4, 130, t, { s: .55, ifadeler: ['kararli', 'endise'], poz: 'tasi', seed: 19 });
  }
  // karakter taş taşıyor
  const kx = lerp(-150, 640, ap(t, .2, 3.5, easeOut));
  s += karakter({ x: kx, y: 1000, s: .8, t, rol: 'balikci', ifade: gece > .5 ? 'kararli' : 'endise', poz: 'tasi', esya: 'tas', yuru: t < 3.7, yalinayak: true });
  if (gece < .5) s += etiketPop('Gündüz: top atışı', 1400, 300, t, t1, { fs: 36 });
  if (gece > .9) s += etiketPop('Gece: onarım', 1300, 240, t, t2 + .3, { fs: 40, bg: '#1B2147', renk: '#FFF4DC' });
  if (t > t2 + 2) s += etiketPop('Toprak dolu fıçılar', 960, 360, t, t2 + 3, { fs: 34 });
  return G(sars(t, [t1 + .3, t1 + 1.2], 10), s);
};

// b07 — kıtlık
SAHNELER.ekmek_kitlik = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.6);
  let s = `<rect width="${W}" height="${H}" fill="#6B4A32"/>`;
  for (let x = 0; x < W; x += 80) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#5A3D28" stroke-width="5"/>`;
  s += `<rect x="0" y="760" width="${W}" height="320" fill="#4A3322"/>`;
  // masa ve küçülen ekmek
  s += `<rect x="260" y="700" width="560" height="40" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/><rect x="290" y="740" width="30" height="180" fill="#6B4A2E"/><rect x="760" y="740" width="30" height="180" fill="#6B4A2E"/>`;
  const kuc = 1 - ap(t, .3, t1 + 1.5, easeIO) * .7;
  s += ekmek(540, 670, 1.3 * kuc);
  s += karakter({ x: 260, y: 960, s: .7, t, rol: 'balikci', ifade: 'endise', poz: 'yan', yalinayak: true });
  s += karakter({ x: 830, y: 960, s: .7, t, rol: 'kadin', ifade: 'uzgun', yon: -1, renkler: { govde: '#7A6A9A', kol: '#7A6A9A' } });
  s += karakter({ x: 640, y: 980, s: .45, t, rol: 'sivil', ifade: 'uzgun', faz: 2 });
  s += etiket('Erzak ↓', 540, 480, { fs: 48, bg: '#FFD9CF' });
  // sağ: nöbetini bırakan asker
  if (t > t1 - .3) {
    let r = gok('aksam');
    r += burcSiralari(0, 380, 960, 320, { dw: 40, seed: 3 });
    r += zemin(700, '#5E6B3E');
    const k = ap(t, t1, 4, easeIO);
    r += karakter({ x: lerp(480, 820, k), y: lerp(380, 940, k), s: .6, t, rol: 'asker', ifade: 'endise', yuru: true, esya: 'mizrak', yon: 1 });
    r += op(ap(t, t1 + 1, .4), etiket('Nöbet yeri boş', 300, 300, { fs: 34 }));
    r += op(ap(t, t1 + 1.6, .4), balon(['Ailem aç...'], 760, 300, { fs: 34, kuyruk: 40 }));
    const kx = lerp(W, 960, ap(t, t1 - .3, .6, easeOut));
    s += `<g transform="translate(${f(kx)},0)"><rect x="0" y="0" width="960" height="1080" fill="#000"/><svg width="960" height="1080" viewBox="0 0 960 1080">${r}</svg><line x1="0" y1="0" x2="0" y2="1080" stroke="#E2B54B" stroke-width="10"/></g>`;
  }
  return s;
};
