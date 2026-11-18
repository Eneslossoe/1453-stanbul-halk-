// ===== Sahneler: Sur Askeri + Tüccar =====

// a02 — surlar ve kesit
SAHNELER.sur_kesit = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.4), t2 = B(seg, 2, 7.3);
  return parca(t, [
    [0, lt => {
      let s = gok('gun') + bulutlar(lt, { n: 5 });
      s += sur(-60, 300, 2100, 520, { kuleAra: 700, kw: 200, kuleFark: 140, seed: 12 });
      s += zemin(820, '#7E9A5A', { cizgi: true });
      s += karakter({ x: 960, y: 1060, s: 1.1, t: lt, rol: 'asker', ifade: 'kararli', poz: 'kilic', esya: 'mizrak', kalkan: true, elR: [96, -200] });
      s += etiketPop('Mızrak', 1250, 380, lt, .8, { fs: 36 }) + etiketPop('Yamalı zırh', 640, 600, lt, 1.6, { fs: 36 });
      s += baslikSerit('KARA SURLARI', 960, 110, ap(lt, 2.4, .5), { fs: 56 });
      return s;
    }],
    [t1, lt => {
      let s = gok('gun');
      // zemin profili
      s += `<path d="M-100,820 L520,820 L520,800 L1480,800 L1480,830 L1530,830 L1560,960 L1760,960 L1790,830 L2100,830 L2100,1200 L-100,1200 Z" fill="#9C8460" stroke="${OUT}" stroke-width="5"/>`;
      // hendek suyu
      const hk = ap(lt, t2 - t1 + .2, .6);
      s += `<path d="M1540,880 L1776,880 L1760,958 L1562,958 Z" fill="#3D7EA6" opacity="${.3 + .7 * hk}"/>`;
      // iç sur (sol, yüksek)
      s += burcSiralari(560, 260, 300, 540, { dw: 50, seed: 3 });
      s += `<rect x="610" y="300" width="200" height="380" fill="none"/>`;
      // dış sur (orta)
      s += burcSiralari(1150, 520, 200, 280, { dw: 40, seed: 4 });
      // ölçek: küçük askerler
      s += karakter({ x: 700, y: 262, s: .28, t: lt, rol: 'asker', esya: 'mizrak', bob: false });
      s += karakter({ x: 1250, y: 522, s: .28, t: lt, rol: 'asker', esya: 'mizrak', bob: false });
      // Osmanlı tarafı (sağ)
      s += cadir(1950, 830, .6) + sancakBayrak(1880, 830, .5, lt);
      s += yazi('ŞEHİR', 200, 760, { fs: 44, renk: '#5A3A1C', font: 'baslik' }) + yazi('DIŞARISI →', 1900, 1010, { fs: 36, renk: '#5A3A1C', font: 'baslik', anc: 'end' });
      const L1 = t2 - t1 + .3;
      s += etiketPop('1. Hendek', 1660, 720, lt, L1, { fs: 38, bg: '#CFE8F2' });
      s += etiketPop('2. Dış sur', 1250, 400, lt, L1 + 1.4, { fs: 38 });
      s += etiketPop('3. İç sur ≈ 12 m', 710, 175, lt, L1 + 3.0, { fs: 38, bg: '#FFE9B0' });
      // yükseklik oku
      if (lt > L1 + 3) s += `<line x1="500" y1="230" x2="500" y2="800" stroke="${OUT}" stroke-width="6" stroke-dasharray="14 10"/><path d="M485,250 L500,220 L515,250 Z M485,780 L500,810 L515,780 Z" fill="${OUT}"/>`;
      s += baslikSerit('ÜÇ KATLI SAVUNMA', 1400, 100, ap(lt, .2, .5), { fs: 50 });
      return s;
    }],
  ]);
};

// a03 — sayılar
SAHNELER.sayilar = (t, d, p, seg) => {
  const t1 = B(seg, 1, 1.5), t2 = B(seg, 2, 4.9), t3 = B(seg, 3, 8.8);
  let s = `<rect width="${W}" height="${H}" fill="#141A3A"/>`;
  // sur uzunluğu: harita silüeti
  if (t < t2 + .2) {
    const k = ap(t, t1, 2.5, easeIO);
    const pts = HARITA.denizSur.concat([HARITA.karaSur[0]]);
    let ic = `<polygon points="${poly(HARITA.trakya)}" fill="#26305E" stroke="#3A4580" stroke-width="5"/><polygon points="${poly(HARITA.halic)}" fill="#141A3A"/>`;
    ic += yolCiz(HARITA.karaSur, k * 2, { renk: '#E2B54B', w: 14, dash: '1 0' });
    ic += yolCiz(HARITA.denizSur, clamp(k * 2 - .4), { renk: '#E2B54B', w: 10, dash: '1 0' });
    s += op(1 - ap(t, t2 - .2, .4), haritaZoom(860, 560, 1.15, ic) + etiketPop('Kara + deniz surları: 20 km+', 960, 120, t, t1 + .8, { fs: 50, bg: '#FFE9B0' }));
  }
  if (t > t2 - .2) {
    const k1 = ap(t, t2, .3);
    // savunucular: 7 piktogram
    let sol = yazi('SAVUNUCULAR', 0, -330, { fs: 44, renk: '#9CB3E0', font: 'baslik' });
    for (let i = 0; i < 7; i++) sol += op(ap(t, t2 + .2 + i * .18, .3), piktogram(-240 + (i % 4) * 160, -150 + Math.floor(i / 4) * 170, 2, '#5B8BE0'));
    sol += op(ap(t, t2 + 1.6, .4), yazi('≈ 7.000', 0, 260, { fs: 110, renk: '#FFF4DC', font: 'baslik' }));
    s += G(tr(470, 560), op(k1, sol));
    s += `<line x1="960" y1="180" x2="960" y2="980" stroke="#3A4580" stroke-width="6"/>`;
    s += op(ap(t, t2 + .4, .4), yazi('VS', 960, 560, { fs: 90, renk: '#E2B54B', font: 'baslik', kontur: '#141A3A', kw: 20 }));
    if (t > t3 - .2) {
      let sag = yazi('OSMANLI ORDUSU', 0, -330, { fs: 44, renk: '#E89C9C', font: 'baslik' });
      const n = Math.floor(clamp((t - t3) / 1.6) * 80);
      for (let i = 0; i < n; i++) sag += piktogram(-370 + (i % 10) * 82, -240 + Math.floor(i / 10) * 62, .85, '#D9534F');
      sag += op(ap(t, t3 + 1.7, .4), yazi('80.000+', 0, 330, { fs: 110, renk: '#FFF4DC', font: 'baslik' }));
      s += G(tr(1450, 560), sag);
    }
  }
  return s;
};

// a04 — Giustiniani
SAHNELER.giustiniani = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.0), t2 = B(seg, 2, 4.0);
  let ic = gok('gun') + bulutlar(t, { n: 4 });
  ic += deniz(640, t, { n: 16 });
  const ceneviz = `<rect x="-60" y="-210" width="120" height="80" fill="#fff" stroke="${OUT}" stroke-width="3"/><rect x="-10" y="-210" width="20" height="80" fill="#B3262E"/><rect x="-60" y="-180" width="120" height="20" fill="#B3262E"/>`;
  ic += gemi(1550, 760, .9, { t, kurek: true, isaret: ceneviz, yelken: '#F2EEE6' });
  ic += zemin(820, '#B8A07A', { cizgi: true });
  if (t > t2 - .2) ic += op(ap(t, t2, .6), askerSirasi(1050, 900, 12, 70, t, { s: 1.3, renk: '#9AA3AD', renk2: '#C9CED4', sapka: '#B7C0C9', seed: 6 }));
  ic += karakter({ x: 800, y: 1040, s: 1.1, t, rol: 'sovalye', ifade: 'kararli', poz: 'bel' });
  ic += G(tr(560, 1040), `<line x1="0" y1="0" x2="0" y2="-560" stroke="#6B4A2E" stroke-width="10"/><g transform="translate(0,-540)"><path d="M0,0 L200,${10 + Math.sin(t * 4) * 6} L200,130 L0,120 Z" fill="#fff" stroke="${OUT}" stroke-width="5"/><rect x="85" y="5" width="30" height="122" fill="#B3262E"/><rect x="0" y="48" width="200" height="30" fill="#B3262E"/></g>`);
  ic += karakter({ x: 220, y: 1060, s: .8, t, rol: 'asker', ifade: 'mutlu', poz: 'salla', faz: 2 });
  let s = kam(t, d, ic, { z0: 1.0, z1: 1.05 });
  s += baslikSerit('GIOVANNI GIUSTINIANI LONGO', 960, 110, ap(t, t1 - .3, .5), { fs: 48 });
  s += etiketPop('Cenevizli paralı asker', 960, 210, t, t1 + .3, { fs: 34 });
  s += etiketPop('700 asker', 1400, 520, t, t2 + .4, { fs: 44, bg: '#FFE9B0' });
  s += etiketPop('Savunmanın beyni', 800, 330, t, t2 + 2.0, { fs: 38 });
  return s;
};

// a05 — Orban'ın topu
SAHNELER.orban_topu = (t, d, p, seg) => {
  const t1 = B(seg, 1, 1.4), t2 = B(seg, 2, 4.6), t3 = B(seg, 3, 6.2), t4 = B(seg, 4, 9.7);
  const atis1 = 4.3, atis2 = t4 + .2;
  const ucus = .6;
  let s = gok('gun') + bulutlar(t, { n: 4, y0: 40, yr: 120 });
  s += tepe([[-100, 760], [900, 780], [2100, 760]], '#8FA36A', { cizgi: false });
  // sur (sağda)
  s += sur(1300, 430, 800, 420, { kuleAra: 420, kw: 160, kuleFark: 120, seed: 14, ofs: 120 });
  const h1 = ap(t, atis1 + ucus, .2), h2 = ap(t, atis2 + ucus, .2);
  if (h1 > 0) s += gedik(1480, 430, 200, 200 * h1);
  if (h2 > 0) s += gedik(1640, 430, 260, 300 * h2);
  s += zemin(850, '#7E9A5A', { cizgi: true });
  // top ve Orban
  const geri = Math.max(kf(t, [[atis1, 0], [atis1 + .08, 60], [atis1 + .8, 0]]), kf(t, [[atis2, 0], [atis2 + .08, 60], [atis2 + .8, 0]]));
  s += topCiz(260, 900, 1.4, { geri });
  s += karakter({ x: 140, y: 1020, s: .75, t, rol: 'orban', ifade: t > atis1 - .3 && t < atis1 + 1 ? 'korku' : 'sirit', poz: 'kilic', esya: 'cekic', faz: 1 });
  // gülleler
  [atis1, atis2].forEach(a => {
    if (t > a && t < a + ucus) { const k = (t - a) / ucus; s += gulle(lerp(660, 1560, k), lerp(740, 640, k) - Math.sin(k * Math.PI) * 140, 34); }
    s += patlama(660, 740, t, a, 1.1) + duman(700, 720, t, a, { boy: 1.4, sure: 3 });
    s += patlama(1580, 620, t, a + ucus, 1.2) + duman(1580, 640, t, a + ucus, { boy: 1.2, renk: '#C9B48A', sure: 2.5 });
    // taş parçaları
    if (t > a + ucus && t < a + ucus + 1.4) {
      const k = (t - a - ucus) / 1.4; const r = rng(Math.round(a * 10));
      for (let i = 0; i < 8; i++) s += tas(1580 + (r() - .3) * 400 * k, 620 + k * k * 500 - r() * 200 * k, .5 + r() * .4);
    }
  });
  s = G(sars(t, [atis1, atis1 + ucus, atis2, atis2 + ucus], 22), s);
  s += etiketPop('Usta Orban', 260, 300, t, t1 + .8, { fs: 40 });
  s += op(1 - ap(t, t3, .3), etiketPop('Gülle: yüzlerce kilo!', 960, 160, t, t2, { fs: 44, bg: '#FFE9B0' }));
  s += op(1 - ap(t, t4, .3), etiketPop('Günde sadece birkaç atış', 960, 160, t, t3, { fs: 44 }));
  s += etiketPop('Bin yıllık sur yıkılıyor', 1500, 200, t, t4 + 1.2, { fs: 40, bg: '#FFD9CF' });
  return s;
};

// a06 — tüneller
SAHNELER.tunel = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.6), t2 = B(seg, 2, 6.3), t3 = B(seg, 3, 9.6);
  return parca(t, [
    [0, lt => {
      let s = gok(lt < 1.8 ? 'gun' : 'gece') + (lt > 1.8 ? yildizlar(lt) : '');
      s += sur(-50, 380, 2100, 400, { kuleAra: 620, kw: 160, seed: 21 });
      s += gedik(820, 380, 300, 220);
      s += zemin(780, lt > 1.8 ? '#2A3A2E' : '#7E9A5A', { cizgi: true });
      if (lt > 1.8) s += `<rect width="${W}" height="${H}" fill="#0A1030" opacity=".4"/>` + mesale(700, 640, 1.2, lt);
      s += karakter({ x: lt < 1.8 ? 960 : lerp(500, 900, ap(lt, 1.8, 1.5)), y: 1020, s: .9, t: lt, rol: 'asker', ifade: 'kararli', poz: lt < 1.8 ? 'kilic' : 'tasi', esya: lt < 1.8 ? 'mizrak' : 'tas', kalkan: lt < 1.8, yuru: lt > 1.8 });
      return s;
    }],
    [t1, lt => {
      let s = gok('gece') + yildizlar(lt, 50, 3, 380);
      // yeryüzü
      s += `<rect x="-100" y="420" width="${W + 200}" height="700" fill="#6B4A2E"/>`;
      for (let i = 0; i < 5; i++) s += `<path d="M-100,${520 + i * 110} Q500,${500 + i * 110 + (i % 2) * 30} 1000,${530 + i * 110} T2100,${510 + i * 110}" fill="none" stroke="#5A3D26" stroke-width="10"/>`;
      s += `<line x1="-100" y1="420" x2="2100" y2="420" stroke="${OUT}" stroke-width="6"/>`;
      s += burcSiralari(520, 130, 260, 290, { dw: 40, seed: 7 });
      s += cadir(1700, 420, .9) + sancakBayrak(1500, 420, .6, lt);
      // Osmanlı tüneli
      const k = ap(lt, .3, t3 - t1 - .3, easeIO);
      const ux = lerp(1650, 820, k);
      s += `<path d="M1650,420 L1650,700 L${f(ux)},700" fill="none" stroke="#2A1A0E" stroke-width="90" stroke-linejoin="round"/>`;
      for (let x = 1600; x > ux + 60; x -= 120) s += `<line x1="${x}" y1="660" x2="${x}" y2="742" stroke="#8B5A2B" stroke-width="10"/>`;
      s += karakter({ x: ux + 40, y: 740, s: .32, t: lt, rol: 'basibozuk', ifade: 'kararli', poz: 'kilic', esya: 'cekic', yon: -1 });
      // karşı tünel
      if (lt > t3 - t1) {
        const k2 = ap(lt, t3 - t1, 1.4, easeIO);
        const bx = lerp(560, ux - 80, k2);
        s += `<path d="M560,420 L560,700 L${f(bx)},700" fill="none" stroke="#2A1A0E" stroke-width="90" stroke-linejoin="round"/>`;
        s += karakter({ x: bx - 30, y: 740, s: .32, t: lt, rol: 'asker', ifade: 'kararli', poz: 'tut', esya: 'mum' });
        if (k2 >= 1) s += patlama(ux - 30, 690, lt, t3 - t1 + 1.4, .6) + duman(ux - 30, 690, lt, t3 - t1 + 1.5, { boy: .6, renk: '#8A7A6A' }) + unlem(ux - 30, 560, .6);
      }
      s += etiketPop('Lağımcılar', 1400, 860, lt, t2 - t1, { fs: 40, bg: '#FFD9CF' });
      s += etiketPop('Karşı tünel', 560, 860, lt, t3 - t1 + .3, { fs: 40, bg: '#CFE8F2' });
      s += baslikSerit('YERİN ALTINDA SAVAŞ', 960, 90, ap(lt, .3, .5), { fs: 48 });
      return s;
    }],
  ]);
};

// a07 — son saldırı dalgaları
SAHNELER.dalgalar = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.1);
  const dal = [t1 + .2, t1 + 1.9, t1 + 3.4];
  let s = gok('gece') + yildizlar(t) + ay(300, 140, 40);
  s += sur(-50, 300, 2100, 330, { kuleAra: 560, kw: 150, kuleFark: 110, seed: 30 });
  for (let i = 0; i < 9; i++) s += karakter({ x: 100 + i * 220, y: 302, s: .32, t, faz: i, rol: 'asker', ifade: 'kararli', esya: 'mizrak', bob: true });
  s += karakter({ x: 960, y: 306, s: .42, t, rol: 'asker', ifade: 'korku', esya: 'mizrak', kalkan: true });
  s += mesale(400, 200, .9, t) + mesale(1500, 200, .9, t + 1);
  s += zemin(630, '#2A3020', { cizgi: true });
  s += `<rect width="${W}" height="${H}" fill="#0A1030" opacity=".3"/>`;
  // merdivenler
  [500, 1300].forEach(x => s += `<g transform="rotate(-8 ${x} 640)"><line x1="${x - 30}" y1="640" x2="${x - 30}" y2="290" stroke="#8B5A2B" stroke-width="10"/><line x1="${x + 30}" y1="640" x2="${x + 30}" y2="290" stroke="#8B5A2B" stroke-width="10"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${x - 30}" y1="${600 - i * 55}" x2="${x + 30}" y2="${600 - i * 55}" stroke="#8B5A2B" stroke-width="8"/>`).join('')}</g>`);
  // dalgalar
  const tipler = [
    { rol: 'basibozuk', ad: '1. Başıbozuklar', renk: '#FFE9B0' },
    { rol: 'basibozuk', ad: '2. Anadolu askerleri', renk: '#FFD9CF', renkler: { govde: '#9C2A2A', kol: '#9C2A2A' } },
    { rol: 'yeniceri', ad: '3. Yeniçeriler', renk: '#CFE8F2' },
  ];
  tipler.forEach((tp, j) => {
    if (t < dal[j]) return;
    const k = ap(t, dal[j], 1.0, easeOut);
    const y = lerp(1300, 1040 - j * 0, k) - j * 0;
    for (let i = 0; i < 7; i++) s += karakter({ x: 140 + i * 270 + j * 60, y: y - (2 - j) * 60, s: .5 - (2 - j) * .06, t, faz: i + j, rol: tp.rol, renkler: tp.renkler, ifade: 'sinirli', poz: 'kilic', esya: 'kilic', yuru: true, yon: -1 });
    s += etiketPop(tp.ad, 330 + j * 630, 540, t, dal[j] + .1, { fs: 38, bg: tp.renk });
  });
  s += op(ap(t, .3, .5) * (1 - ap(t, t1 - .2, .4)), baslikSerit('29 MAYIS GECESİ', 960, 520, 1, { fs: 64 }));
  return G(sars(t, [dal[0], dal[1], dal[2]], 8), s);
};

// a08 — Giustiniani yaralanır, Kerkoporta
SAHNELER.giustiniani_yarali = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.8), t2 = B(seg, 2, 7.3);
  return parca(t, [
    [0, lt => {
      let s = gok('safak') + zemin(780, '#5E6B3E', { cizgi: true });
      s += sur(-50, 330, 2100, 450, { kuleAra: 600, kw: 160, seed: 31 });
      s += duman(1500, 300, lt % 2.4, 0, { sure: 2.4, renk: '#6A6058', boy: 1.6 });
      const k = ap(lt, .4, t1 + 3, easeIO);
      const x = lerp(1300, 300, k);
      s += `<g transform="translate(${f(x)},940) rotate(-78)">${karakter({ x: 0, y: 0, s: .7, t: lt, rol: 'sovalye', ifade: 'uzgun', bob: false })}</g>`;
      s += `<rect x="${f(x - 70)}" y="884" width="70" height="14" fill="#F2EEE6" stroke="${OUT}" stroke-width="3"/>`;
      s += karakter({ x: x - 230, y: 1040, s: .62, t: lt, rol: 'asker', ifade: 'endise', poz: 'tut', yuru: true, yon: -1, faz: 1 });
      s += karakter({ x: x + 230, y: 1040, s: .62, t: lt, rol: 'asker', ifade: 'endise', poz: 'tut', yuru: true, yon: -1 });
      s += etiketPop('Giustiniani yaralandı!', 960, 140, lt, .5, { fs: 48, bg: '#FFD9CF' });
      if (lt > t1 - .5) {
        for (let i = 0; i < 5; i++) s += karakter({ x: 1900 - ((lt - t1 + .5) * 380 + i * 260) % 2200, y: 1050 - (i % 2) * 30, s: .55, t: lt, faz: i, rol: 'asker', ifade: 'korku', poz: 'kaldir', yuru: true, yon: -1 });
        s += etiketPop('Savunma dağılıyor', 960, 240, lt, t1, { fs: 42 });
      }
      return s;
    }],
    [t2, lt => {
      let s = gok('safak') + zemin(860, '#5E6B3E', { cizgi: true });
      s += burcSiralari(-50, 200, 2100, 660, { dw: 60, seed: 40 });
      // küçük kapı
      const ac = ap(lt, .8, 2, easeIO);
      s += `<path d="M840,860 L840,560 A120,120 0 0 1 1080,560 L1080,860 Z" fill="#1A120C" stroke="${OUT}" stroke-width="7"/>`;
      s += `<path d="M840,860 L840,560 A120,120 0 0 1 1080,560 L1080,860 Z" fill="#FFE3A3" opacity="${f(ac * .7 * 100) / 100}"/>`;
      s += `<path d="M${840 + ac * 150},860 L${840 + ac * 150},${560 + ac * 6} L1080,560 L1080,860 Z" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/>`;
      s += `<circle cx="${1050}" cy="720" r="12" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`;
      s += baslikSerit('KERKOPORTA', 960, 140, ap(lt, .3, .5), { fs: 60 });
      s += etiketPop('Açık mı unutuldu? (rivayet)', 960, 280, lt, 1.6, { fs: 40 });
      return s;
    }],
  ]);
};

// a09 — sancak
SAHNELER.sancak = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.1), t2 = B(seg, 2, 6.0);
  return parca(t, [
    [0, lt => {
      let s = gok('safak') + gunes(1500, 700, 90, '#FFD9A0') + bulutlar(lt, { n: 4, renk: '#F7B79A', op: .5 });
      s += sur(-50, 470, 2100, 440, { kuleAra: 700, kw: 260, kuleFark: 160, seed: 41, ofs: 760 });
      s += zemin(900, '#5E6B3E', { cizgi: true });
      const k = ap(lt, .2, 2.2, easeIO);
      // kule tepesinde sancak
      const by = lerp(560, 310, k);
      s += karakter({ x: 830, y: by + 10, s: .55, t: lt, rol: 'yeniceri', ifade: 'kararli', poz: 'kaldir', bob: false });
      s += sancakBayrak(890, lerp(560, 310, ap(lt, 1.6, 1.0)), 1.1, lt);
      s += etiketPop('Ulubatlı Hasan', 890, 120, lt, t1, { fs: 44, bg: '#FFE9B0' });
      s += etiketPop('(Türk geleneği)', 890, 200, lt, t1 + .4, { fs: 30 });
      return s;
    }],
    [t2, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#2A2238"/>`;
      s += karakter({ x: 960, y: 900, s: 1.0, t: lt, rol: 'asker', ifade: 'uzgun', poz: 'yan', renkler: { sapka: null } });
      s += G(tr(960, 960), `<path d="M-96,-12 Q-100,-100 0,-130 Q100,-100 96,-12 Z" fill="#9AA3AD" stroke="${OUT}" stroke-width="5" transform="translate(-260,0) rotate(-20)"/>`);
      // iki kader
      s += G(tr(520, 380, easeBack(ap(lt, .8, .5))), `<circle r="110" fill="#3A2A3A" stroke="#E2B54B" stroke-width="6"/><path d="M-12,-70 h24 v40 h40 v24 h-40 v80 h-24 v-80 h-40 v-24 h40 Z" fill="#D9D2C2"/>` + yazi('Ölüm', 0, 160, { fs: 46, renk: '#FFF4DC' }));
      s += G(tr(1400, 380, easeBack(ap(lt, 1.6, .5))), `<circle r="110" fill="#3A2A3A" stroke="#E2B54B" stroke-width="6"/>` + zincirHalka(-30, 0, 1.6, 30) + zincirHalka(30, 0, 1.6, -30) + yazi('Esaret', 0, 160, { fs: 46, renk: '#FFF4DC' }));
      s += yazi('ya da', 960, 380, { fs: 50, renk: '#E2B54B', font: 'baslik' });
      return s;
    }],
  ]);
};

// ===== Tüccar =====
function venedikLiman(t, o = {}) {
  let s = gok(o.gok || 'gun') + bulutlar(t, { n: 4, y0: 40, yr: 120 });
  s += deniz(640, t, { n: 18 });
  const venFlag = `<rect x="2" y="-226" width="70" height="44" fill="#B3262E" stroke="${OUT}" stroke-width="3"/><circle cx="37" cy="-204" r="12" fill="#E2B54B"/>`;
  s += gemi(1450, 760, .85, { t, isaret: venFlag, yelken: '#F2E6CC' }) + gemi(1800, 800, .7, { t, faz: 1, isaret: venFlag, yelken: '#EBDDC2' });
  // iskele
  s += `<rect x="900" y="800" width="560" height="30" fill="#8B5A2B" stroke="${OUT}" stroke-width="4"/>` + [0, 1, 2, 3].map(i => `<rect x="${930 + i * 140}" y="830" width="20" height="120" fill="#6B4A2E"/>`).join('');
  // kampanile + depo
  s += `<rect x="140" y="260" width="120" height="560" fill="#C98A6A" stroke="${OUT}" stroke-width="5"/><rect x="160" y="300" width="80" height="80" fill="#5A3A28"/><path d="M130,260 L200,150 L270,260 Z" fill="#7F8E9C" stroke="${OUT}" stroke-width="5"/>`;
  s += `<rect x="300" y="480" width="520" height="340" fill="#E3C9A3" stroke="${OUT}" stroke-width="5"/><path d="M280,480 L560,370 L840,480 Z" fill="#B5583C" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 3; i++) s += `<path d="M${350 + i * 160},820 L${350 + i * 160},640 A55,55 0 0 1 ${460 + i * 160},640 L${460 + i * 160},820 Z" fill="#5A3A28" stroke="${OUT}" stroke-width="4"/>`;
  s += zemin(820, '#C8B08A', { cizgi: true });
  return s;
}
function mal(tip, x, y, s = 1) {
  switch (tip) {
    case 'ipek': return G(tr(x, y, s), `<rect x="-60" y="-40" width="120" height="80" rx="30" fill="#C2185B" stroke="${OUT}" stroke-width="4"/><rect x="-60" y="-80" width="120" height="50" rx="24" fill="#7B1FA2" stroke="${OUT}" stroke-width="4"/>`);
    case 'baharat': return G(tr(x, y, s), `<path d="M-50,40 Q-60,-30 -20,-50 L20,-50 Q60,-30 50,40 Z" fill="#C9A06E" stroke="${OUT}" stroke-width="4"/><ellipse cx="0" cy="-50" rx="26" ry="10" fill="#D9531E" stroke="${OUT}" stroke-width="3"/>`);
    case 'sarap': return G(tr(x, y, s), `<path d="M-30,-60 Q-60,0 -20,60 L20,60 Q60,0 30,-60 Z" fill="#B5583C" stroke="${OUT}" stroke-width="4"/><rect x="-14" y="-80" width="28" height="22" fill="#B5583C" stroke="${OUT}" stroke-width="4"/>`);
    case 'kurk': return G(tr(x, y, s), `<path d="M-70,30 Q-60,-50 0,-40 Q60,-50 70,30 Q0,50 -70,30 Z" fill="#8A6A48" stroke="${OUT}" stroke-width="4"/><path d="M-40,0 q10,-10 20,0 M0,-10 q10,-10 20,0 M30,5 q10,-10 20,0" fill="none" stroke="#5A3A24" stroke-width="4"/>`);
  }
  return '';
}
// t02 — Venedik mahallesi
SAHNELER.venedik_mahalle = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.2), t2 = B(seg, 2, 6.2), t3 = B(seg, 3, 9.6);
  let ic = venedikLiman(t);
  ic += karakter({ x: 960, y: 1020, s: 1.0, t, rol: 'tuccar', ifade: t > t2 ? 'mutlu' : 'sirit', poz: 'tut', esya: 'kese' });
  if (t > t3 - .2) {
    ic += karakter({ x: 1500, y: 1040, s: .7, t, rol: 'sivil', ifade: 'sinirli', poz: 'bel', yon: -1, renkler: { govde: '#6F7FA8', kol: '#6F7FA8' } });
    ic += karakter({ x: 1700, y: 1040, s: .65, t, rol: 'kadin', ifade: 'sinirli', yon: -1, faz: 2 });
  }
  let s = kam(t, d, ic, { z0: 1.0, z1: 1.05 });
  s += etiketPop('Venedik mahallesi', 560, 320, t, t1, { fs: 36 });
  s += etiketPop('Kilise', 200, 560, t, t1 + 1.0, { fs: 34 });
  s += etiketPop('İskele', 1180, 880, t, t1 + 2.0, { fs: 34 });
  [['ipek', 'İpek'], ['baharat', 'Baharat'], ['sarap', 'Şarap'], ['kurk', 'Kürk']].forEach(([m, ad], i) => {
    const k = ap(t, t2 + i * .55, .4, easeBack);
    if (k > 0) s += G(tr(330 + i * 420, 400, k), `<circle r="95" fill="#FFF4DC" stroke="${OUT}" stroke-width="5"/>` + mal(m, 0, 0, .9) + yazi(ad, 0, 135, { fs: 38, renk: '#fff', kontur: OUT }));
  });
  s += etiketPop('Pek sevilmiyorsunuz... ama size muhtaçlar', 960, 120, t, t3 + .3, { fs: 36, bg: '#FFD9CF' });
  return s;
};

// t03 — Galata: gündüz/gece
SAHNELER.galata = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.3), t2 = B(seg, 2, 5.0);
  return parca(t, [
    [0, lt => {
      let ic = harita(lt, { etiketler: true });
      const s0 = haritaZoom(1240, 410, lerp(1.6, 2.2, ap(lt, 0, 3, easeIO)), ic + G(tr(1235, 330), `<line x1="0" y1="0" x2="0" y2="-90" stroke="${OUT}" stroke-width="5"/><rect x="0" y="-90" width="60" height="40" fill="#fff" stroke="${OUT}" stroke-width="3"/><rect x="24" y="-90" width="12" height="40" fill="#B3262E"/><rect x="0" y="-76" width="60" height="12" fill="#B3262E"/>`));
      let s = s0 + etiketPop('CENEVİZ GALATASI', 960, 120, lt, .5, { fs: 46, bg: '#1B2147', renk: '#FFF4DC' });
      s += etiketPop('Resmen TARAFSIZ', 960, 940, lt, t1, { fs: 46, bg: '#FFE9B0' });
      return s;
    }],
    [t2, lt => {
      // sol: gündüz satış
      let a = gok('gun') + gunes(800, 140, 50, '#FFF1C2') + zemin(700, '#C8B08A', { cizgi: true });
      a += cadir(780, 720, .9) + karakter({ x: 300, y: 980, s: .7, t: lt, rol: 'tuccar', renkler: { govde: '#2E6B4A', kol: '#2E6B4A' }, ifade: 'sirit', poz: 'tut' });
      a += mal('baharat', 470, 920, .8) + karakter({ x: 680, y: 980, s: .7, t: lt, rol: 'yeniceri', ifade: 'normal', yon: -1, poz: 'tut', faz: 1 });
      a += yazi('GÜNDÜZ', 480, 180, { fs: 56, renk: '#fff', kontur: OUT, font: 'baslik' });
      // sağ: gece surda
      let b = gok('gece') + yildizlar(lt, 40, 9, 300) + ay(800, 120, 40);
      b += burcSiralari(-20, 560, 1000, 600, { dw: 50, seed: 2 });
      b += karakter({ x: 480, y: 562, s: .7, t: lt, rol: 'tuccar', renkler: { govde: '#2E6B4A', kol: '#2E6B4A', sapka: 'migfer' }, ifade: 'kararli', esya: 'mizrak', bak: -1 });
      b += yazi('GECE', 480, 180, { fs: 56, renk: '#fff', kontur: OUT, font: 'baslik' });
      let s = panel(0, 0, 960, 1080, a, { cerceve: false }) + panel(960, 0, 960, 1080, b, { cerceve: false });
      s += `<rect x="952" y="0" width="16" height="1080" fill="#E2B54B"/>`;
      s += etiketPop('...söylenir', 960, 1000, lt, 1.5, { fs: 40 });
      return s;
    }],
  ]);
};

// t04 — gemiler güvende (sanıyorsun)
SAHNELER.gemiler_guvende = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.1);
  let ic = gok('aksam') + bulutlar(t, { n: 3, renk: '#F7C9A9', op: .6 });
  ic += tepe([[-100, 500], [500, 420], [1100, 470], [2100, 430]], '#6E7E4A');
  if (t > t1) ic += op(ap(t, t1, 1), `<path d="M300,470 Q600,400 900,450 L900,520 L300,520 Z" fill="#1A1020" opacity=".45"/>` + askerSirasi(320, 470, 12, 46, t, { s: .6 }));
  ic += deniz(560, t, { renk: '#4A7AA0', renk2: '#2A4A6A' });
  ic += zincirHat(-100, 620, 2100, 600, .5, 30);
  const venFlag = `<rect x="2" y="-226" width="70" height="44" fill="#B3262E" stroke="${OUT}" stroke-width="3"/><circle cx="37" cy="-204" r="12" fill="#E2B54B"/>`;
  ic += gemi(500, 790, .8, { t, isaret: venFlag }) + gemi(1500, 800, .8, { t, faz: 2, isaret: venFlag });
  ic += `<rect x="-100" y="900" width="2200" height="200" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/>`;
  ic += karakter({ x: 960, y: 1040, s: .9, t, rol: 'tuccar', ifade: t > t1 ? 'endise' : 'mutlu', poz: 'bel', bak: t > t1 ? -1 : 0 });
  let s = kam(t, d, ic, { z0: 1.0, z1: t > t1 ? 1.12 : 1.04, cy: 520 });
  s += etiketPop('Zincirin arkasında: güvende ✓', 960, 140, t, .6, { fs: 44, bg: '#DDF2C4' });
  if (t > t1) s += soruIsareti(1180, 560, .8 * easeBack(ap(t, t1 + .3, .4)));
  return s;
};

// t05 — gemiler karadan
SAHNELER.gemiler_karadan = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.8), t2 = B(seg, 2, 6.0);
  return parca(t, [
    [0, lt => {
      let s = gok('safak') + tepe([[-100, 480], [600, 420], [1300, 470], [2100, 440]], '#6E7E4A');
      s += deniz(540, lt, { renk: '#4A7AA0', renk2: '#2A4A6A' });
      const k = ap(lt, t1 - .5, 2, easeOut);
      for (let i = 0; i < 4; i++) s += gemi(lerp(2300, 700 + i * 360, k), 700 + (i % 2) * 50, .65, { t: lt, faz: i, kurek: true, bayrak: '#B3262E', yelken: '#E8D8C0' });
      s += `<rect x="-100" y="920" width="2200" height="200" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/>`;
      s += karakter({ x: 380, y: 1060, s: .95, t: lt, rol: 'tuccar', ifade: lt > .4 ? 'korku' : 'uykulu', poz: lt > .6 ? 'kaldir' : 'yan', titre: lt > .6 });
      s += baslikSerit('22 NİSAN 1453', 960, 110, ap(lt, .2, .5), { fs: 56 });
      if (lt > t1) s += etiketPop("Osmanlı gemileri Haliç'te!", 1100, 300, lt, t1, { fs: 46, bg: '#FFD9CF' });
      return s;
    }],
    [t2, lt => {
      let s = gok('gece') + yildizlar(lt) + ay(1650, 140, 45);
      s += tepe([[-100, 760], [300, 560], [900, 400], [1500, 560], [2100, 760]], '#3A4A30', { yumus: 60 });
      s += `<rect x="-100" y="900" width="900" height="300" fill="#2A4A6A"/><rect x="1300" y="900" width="900" height="300" fill="#2A4A6A"/>`;
      s += yazi('BOĞAZ', 1750, 980, { fs: 40, renk: '#9CC3CF', font: 'baslik' }) + yazi('HALİÇ', 170, 980, { fs: 40, renk: '#9CC3CF', font: 'baslik' });
      // tepe yolu
      const yolP = [[1720, 860], [1500, 700], [1200, 520], [960, 445], [700, 520], [420, 700], [200, 860]];
      s += yolCiz(yolP, 1, { renk: '#E2B54B', w: 6, dash: '10 12' });
      // kızaklar
      for (let i = 0; i < 18; i++) { const [x, y] = yolNokta(yolP, i / 17); s += `<rect x="${f(x - 30)}" y="${f(y - 4)}" width="60" height="10" rx="5" fill="#8B5A2B" stroke="${OUT}" stroke-width="2"/>`; }
      // gemiler
      for (let i = 0; i < 4; i++) {
        const k = clamp(lt / 7 - i * .22);
        if (k <= 0) continue;
        const [x, y, a] = yolNokta(yolP, k);
        s += G(tr(x, y - 24, .42, a * 180 / Math.PI + 180), `<g transform="scale(-1,1)">${gemi(0, 0, 1, { t: lt, bayrak: '#B3262E', yelken: '#E8D8C0' })}</g>`);
      }
      s += etiketPop('≈ 70 gemi', 960, 250, lt, .6, { fs: 50, bg: '#FFE9B0' });
      s += etiketPop('Yağlanmış kızaklar', 1350, 420, lt, 2.2, { fs: 38 });
      s += etiketPop("Galata'nın arkasındaki tepeler", 960, 120, lt, 4, { fs: 38 });
      return s;
    }],
  ]);
};

// t06 — kaçış
SAHNELER.kacis_gemi = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.1), t2 = B(seg, 2, 6.9);
  let s = gok('aksam') + sehirSiluet(1300, 600, .7, { seed: 8 });
  for (let i = 0; i < 4; i++) s += duman(900 + i * 300, 350, (t + i * .7) % 3, 0, { sure: 3, renk: '#4A403A', boy: 1.5, seed: i + 3 });
  s += deniz(620, t, { renk: '#4A6A90', renk2: '#2A3A5A' });
  const venFlag = `<rect x="2" y="-226" width="70" height="44" fill="#B3262E" stroke="${OUT}" stroke-width="3"/><circle cx="37" cy="-204" r="12" fill="#E2B54B"/>`;
  const gx = lerp(520, -500, ap(t, t2, 6, easeIO));
  // güverte kafaları
  let kafalar = '';
  for (let i = 0; i < 7; i++) kafalar += `<circle cx="${-120 + i * 40}" cy="-26" r="18" fill="${TENLER[i % 5]}" stroke="${OUT}" stroke-width="3"/>`;
  s += G(`translate(${f(gx - 520)},0)`, gemi(520, 780, 1.0, { t, isaret: venFlag + (t > t1 ? kafalar : ''), yelken: '#F2E6CC' }));
  if (t > t2) s += G(`translate(${f((gx - 520) * .8)},0)`, gemi(1000, 830, .7, { t, faz: 2, isaret: kafalar, bayrak: '#fff', yelken: '#EBDDC2' }));
  s += `<rect x="900" y="880" width="1100" height="220" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/>`;
  // karakter koşar ve atlar
  const k = ap(t, .4, t1 - .2, easeIO);
  let kx = lerp(1700, 1000, k), ky = 1000;
  if (t > t1) { const j = ap(t, t1, .8, easeIO); kx = lerp(1000, 560, j) + (gx - 520); ky = lerp(1000, 770, j) - Math.sin(j * Math.PI) * 220; }
  s += karakter({ x: kx, y: ky, s: t > t1 + .8 ? .55 : .8, t, rol: 'tuccar', ifade: t > t1 + .8 ? 'mutlu' : 'korku', poz: 'kaldir', yuru: t < t1, yon: -1 });
  s += etiketPop('Kaçış!', 1300, 300, t, t1, { fs: 52, bg: '#DDF2C4' });
  s += etiketPop('Bazı gemiler kaçmayı başardı', 960, 120, t, t2 + .5, { fs: 42 });
  return s;
};

// t07 — Minotto
SAHNELER.minotto = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.6);
  const kar = ap(t, t1, 1.2);
  let s = `<rect width="${W}" height="${H}" fill="#2A2238"/>`;
  s += `<circle cx="960" cy="520" r="420" fill="#4A3A5A" opacity=".6"/>`;
  s += karakter({ x: 960, y: 980, s: 1.15, t, rol: 'venedikli', ifade: 'uzgun', poz: 'bagli', renkler: { sakal: '#9C9A94', kisa: true } });
  s += `<path d="M900,860 Q960,880 1020,860 M900,880 Q960,900 1020,880" fill="none" stroke="#C9A86B" stroke-width="7"/>`;
  s += baslikSerit('BALYOS GIROLAMO MINOTTO', 960, 120, ap(t, .3, .5), { fs: 46 });
  s += `<rect width="${W}" height="${H}" fill="#000" opacity="${f(kar * .55 * 100) / 100}"/>`;
  s += etiketPop('Yakalanıp idam edildi', 960, 860, t, t1 + .3, { fs: 48, bg: '#FFD9CF' });
  return s;
};

// t08 — ahitname
SAHNELER.ahitname = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.7), t2 = B(seg, 2, 5.8), t3 = B(seg, 3, 8.8);
  return parca(t, [
    [0, lt => {
      let s = gok('gun') + tepe([[-100, 640], [600, 560], [1300, 600], [2100, 580]], '#8FA36A');
      for (let i = 0; i < 10; i++) s += ev(200 + i * 170, 700, .7, '#E3C9A3', '#B5583C');
      // Galata kulesi + beyaz bayrak
      s += `<rect x="900" y="200" width="140" height="500" fill="#C9A06E" stroke="${OUT}" stroke-width="6"/><path d="M880,200 L970,40 L1060,200 Z" fill="#7F8E9C" stroke="${OUT}" stroke-width="6"/>`;
      for (let i = 0; i < 3; i++) s += `<rect x="955" y="${280 + i * 120}" width="30" height="50" rx="15" fill="${OUT}"/>`;
      s += `<line x1="970" y1="40" x2="970" y2="-60" stroke="${OUT}" stroke-width="6"/><path d="M970,-60 Q1040,${-70 + Math.sin(lt * 4) * 8} 1110,-50 L1110,10 Q1040,${0 + Math.sin(lt * 4) * 8} 970,10 Z" fill="#fff" stroke="${OUT}" stroke-width="4" transform="translate(0,${f(ap(lt, .3, 1) * 100)})"/>`;
      s += deniz(820, lt, { n: 12 });
      s += etiketPop('Galata savaşmadan teslim oldu', 960, 960, lt, .8, { fs: 42 });
      return s;
    }],
    [t1, lt => {
      let s = altinZemin({ c1: '#F7E3B0', c2: '#C99A4E', c3: '#6B4012' });
      s += parsomen(960, 560, 1.6, 560, 520);
      s += yazi('AHİTNAME', 960, 270, { fs: 54, renk: '#5A3A1C', font: 'baslik' });
      s += yazi('1 Haziran 1453', 960, 340, { fs: 32, renk: '#7A5A2A' });
      const mk = ap(lt, .6, .35, easeOut);
      if (mk > 0) s += G(tr(1300, 840, lerp(2.4, 1.4, mk)), `<g opacity="${mk}">${muhur(0, 0, 1)}</g>`);
      const tt = t2 - t1;
      s += tik(380, 440, 1.3, ap(lt, tt, .4)) + op(ap(lt, tt, .3), yazi('Mallar korunacak', 380, 530, { fs: 38, renk: '#fff', kontur: OUT }));
      s += tik(380, 700, 1.3, ap(lt, tt + .9, .4)) + op(ap(lt, tt + .9, .3), yazi('Ticaret serbest', 380, 790, { fs: 38, renk: '#fff', kontur: OUT }));
      if (lt > t3 - t1) {
        const r = rng(4);
        for (let i = 0; i < 14; i++) s += sikke(1500 + (r() - .5) * 600, ((lt - (t3 - t1)) * 500 + r() * 900) % 1100 - 60, .9);
        s += karakter({ x: 1250, y: 1060, s: .8, t: lt, rol: 'tuccar', ifade: 'mutlu', poz: 'kaldir', zipla: true });
      }
      return s;
    }],
  ]);
};
