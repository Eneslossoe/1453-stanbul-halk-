// ===== Sahneler: Balıkçı (son) + Keşiş =====

// nested svg ile kırpılmış panel
function panel(x, y, w, h, inner, o = {}) {
  return `<g transform="translate(${f(x)},${f(y)})"><svg width="${w}" height="${h}" viewBox="${o.vb || `0 0 ${w} ${h}`}" preserveAspectRatio="xMidYMid slice">${inner}</svg>` +
    (o.cerceve !== false ? `<rect width="${w}" height="${h}" fill="none" stroke="${o.renk || '#E2B54B'}" stroke-width="8"/>` : '') + `</g>`;
}
function canKulesi(x, y, s, t, calsin) {
  const a = calsin ? Math.sin(t * 5) * 25 : 0;
  let g = `<rect x="-60" y="-420" width="120" height="420" fill="#D7B08A" stroke="${OUT}" stroke-width="5"/>`;
  g += `<path d="M-50,-300 L-50,-380 A50,50 0 0 1 50,-380 L50,-300 Z" fill="#3A2A1C"/>`;
  g += `<path d="M-75,-420 L0,-500 L75,-420 Z" fill="#8C6D5A" stroke="${OUT}" stroke-width="5"/>`;
  g += `<g transform="translate(0,-372) rotate(${f(a)})"><path d="M-30,60 Q-30,0 0,0 Q30,0 30,60 Z" fill="#C9962E" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="66" r="8" fill="#8A5A12"/></g>`;
  if (calsin) for (let i = 0; i < 3; i++) {
    const k = ((t * 1.5 + i / 3) % 1);
    g += `<path d="M${90 + k * 120},${-400 - k * 30} q30,40 0,80" fill="none" stroke="#FFF4DC" stroke-width="7" opacity="${f((1 - k) * 100) / 100}"/>`;
    g += `<path d="M${-90 - k * 120},${-400 - k * 30} q-30,40 0,80" fill="none" stroke="#FFF4DC" stroke-width="7" opacity="${f((1 - k) * 100) / 100}"/>`;
  }
  return G(tr(x, y, s), g);
}
function ayasofyaIc(t, o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="${o.zemin || '#C9A46A'}"/>`;
  const id = uid('ai');
  s += `<defs><radialGradient id="${id}" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="${o.isik || '#FFE9B0'}"/><stop offset=".5" stop-color="${o.orta || '#C9963E'}"/><stop offset="1" stop-color="${o.koyu || '#5A3A18'}"/></radialGradient></defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  // kubbe
  s += `<path d="M260,520 A700,560 0 0 1 1660,520 Z" fill="${o.kubbe || '#D9AE5A'}" stroke="${OUT}" stroke-width="6"/>`;
  for (let i = 0; i < 20; i++) {
    const a = Math.PI + i / 19 * Math.PI, x = 960 + Math.cos(a) * 640, y = 520 + Math.sin(a) * 500;
    s += `<rect x="${f(x - 12)}" y="${f(y - 4)}" width="24" height="40" rx="12" fill="${o.pencere || '#FFF3C4'}" stroke="${OUT}" stroke-width="3" transform="rotate(${f(a * 180 / Math.PI + 90)} ${f(x)} ${f(y)})"/>`;
  }
  s += `<circle cx="960" cy="140" r="90" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/><circle cx="960" cy="140" r="60" fill="none" stroke="#8A5A12" stroke-width="5"/>`;
  // ışık hüzmeleri
  if (o.huzme !== false) for (let i = 0; i < 6; i++) {
    const x = 520 + i * 170;
    s += `<path d="M${x},230 L${x + 40},230 L${x + 220 + Math.sin(t + i) * 10},1080 L${x + 60},1080 Z" fill="#FFF3C4" opacity="${o.huzmeOp || .16}"/>`;
  }
  // kemerler / galeriler
  s += `<rect x="-20" y="520" width="${W + 40}" height="40" fill="#B8863A" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${40 + i * 215},900 L${40 + i * 215},660 A85,85 0 0 1 ${210 + i * 215},660 L${210 + i * 215},900 Z" fill="${o.kemer || '#6B4A22'}" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i <= 9; i++) s += `<rect x="${i * 215 + 10}" y="560" width="34" height="380" fill="#9C8A70" stroke="${OUT}" stroke-width="4"/>`;
  s += `<rect x="-20" y="900" width="${W + 40}" height="200" fill="${o.taban || '#8A7458'}"/>`;
  for (let x = -40; x < W + 80; x += 120) s += `<path d="M${x},900 L${x - 160},1100" stroke="#76624A" stroke-width="4"/>`;
  return s;
}

// b08 — alarm, Ayasofya'ya koşu
SAHNELER.alarm_ayasofya = (t, d, p, seg) => {
  const t2 = B(seg, 2, 6.3);
  let ic = gok('safak') + bulutlar(t, { n: 4, renk: '#F7B79A', op: .5 });
  ic += ayasofya(1250, 820, 1.25);
  ic += canKulesi(260, 860, .95, t, true);
  ic += zemin(800, '#B89A6A', { cizgi: true });
  ic += kalabalik(-200 + ((t * 120) % 200), 990, 11, 170, t, { s: .55, yuru: true, ifadeler: ['korku', 'endise', 'saskin'], seed: 33 });
  const kx = lerp(-120, 820, ap(t, t2 - 1.5, 3.5, easeIO));
  ic += karakter({ x: kx, y: 1060, s: .85, t, rol: 'balikci', ifade: 'korku', yuru: true, yalinayak: true, poz: 'kaldir' });
  let s = kam(t, d, ic, { z0: 1.0, z1: 1.08, x1: -40 });
  s += op(ap(t, .3, .4), etiket('DONG! DONG!', 420, 230, { fs: 46, bg: '#FFE9B0', r: Math.sin(t * 5) * 4 }));
  s += etiketPop('ALARM!', 420, 330, t, B(seg, 1, 3.8), { fs: 50, bg: '#FFD9CF', renk: '#9A1A1A' });
  s += etiketPop('AYASOFYA', 1250, 260, t, t2, { fs: 46, bg: '#1B2147', renk: '#FFF4DC' });
  return s;
};

// b09 — kehanet: melek inecek
SAHNELER.ayasofya_melek = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.2), t2 = B(seg, 2, 8.6);
  let s = ayasofyaIc(t);
  // melek (düşünce görüntüsü)
  const mk = ap(t, t1 + .3, 1.2);
  if (mk > 0) s += melek(960, lerp(300, 520, mk), .9, t, { op: mk * .75, kilic: true });
  s += kalabalik(80, 1050, 10, 190, t, { s: .55, poz: 'dua', ifadeler: ['endise', 'korku', 'uzgun'], seed: 51 });
  s += karakter({ x: 960, y: 1080, s: .9, t, rol: 'balikci', ifade: mk > .3 ? 'saskin' : 'endise', poz: 'dua', bak: 0, yalinayak: true });
  s += etiketPop('Kehanet', 960, 120, t, t1, { fs: 44, bg: '#FFF3C4' });
  if (t > t2) {
    // kapılar kapanır (yanlarda)
    const k = ap(t, t2, 1.2, easeIO);
    s += `<rect x="${-460 + 460 * k}" y="0" width="460" height="${H}" fill="#6B4A2A" stroke="${OUT}" stroke-width="8"/><rect x="${W - 460 * k}" y="0" width="460" height="${H}" fill="#6B4A2A" stroke="${OUT}" stroke-width="8"/>`;
    for (let i = 1; i < 6; i++) s += `<line x1="${-460 + 460 * k}" y1="${i * 180}" x2="${460 * k}" y2="${i * 180}" stroke="#4A3018" stroke-width="6"/><line x1="${W - 460 * k}" y1="${i * 180}" x2="${W - 460 * k + 460}" y2="${i * 180}" stroke="#4A3018" stroke-width="6"/>`;
    s += etiketPop('Kapılar kapatıldı', 960, 240, t, t2 + .8, { fs: 40 });
  }
  return s;
};

// b10 — kapılar kırılır, esaret
SAHNELER.kapi_kirilir = (t, d, p, seg) => {
  const t1 = B(seg, 1, 1.4), t2 = B(seg, 2, 2.8), t3 = B(seg, 3, 9.4);
  return parca(t, [
    [0, lt => {
      let s = ayasofyaIc(lt, { huzmeOp: .08, isik: '#C9A46A', orta: '#8A6A3A', koyu: '#2A1A0A' });
      s += melek(960, 520, .9, lt, { op: .5 * (1 - ap(lt, 0, 1.2)) });
      s += soruIsareti(960, 320, 1.2 * ap(lt, .4, .4, easeBack));
      const ac = ap(lt, t1, .5, easeOut);
      s += G(sars(lt, [t1]), buyukKapi(960, 1000, .95, ac * .9, { catlak: lt > t1 - .3, isik: ac * .8 }));
      if (ac > .3) s += askerSirasi(700, 1000, 6, 90, lt, { s: 1.6, seed: 4 });
      s += karakter({ x: 300, y: 1060, s: .85, t: lt, rol: 'balikci', ifade: lt > t1 ? 'korku' : 'endise', poz: lt > t1 ? 'kaldir' : 'dua', yalinayak: true, titre: lt > t1 });
      return s;
    }],
    [t2, lt => {
      let s = gok('aksam') + zemin(760, '#9C8460', { cizgi: true });
      s += `<g opacity=".8">${sehirSiluet(960, 760, .8, { seed: 9 })}</g>`;
      for (let i = 0; i < 4; i++) s += duman(300 + i * 450, 520, lt % 3 + i * .3, 0, { sure: 3.2, renk: '#6A6058', boy: 1.2, seed: i });
      // esir kafilesi
      const kx = -200 + lt * 40;
      const roller = ['esir', 'kadin', 'esir', 'esir', 'kadin', 'esir'];
      for (let i = 0; i < 6; i++) {
        const biz = i === 3;
        s += karakter({ x: kx + i * 230, y: 1000, s: biz ? .8 : .62, t: lt, faz: i, rol: biz ? 'esir' : roller[i], ifade: 'uzgun', poz: 'bagli', yuru: true, renkler: biz ? { sapka: 'hasir' } : (roller[i] === 'kadin' ? { govde: '#8A7A6A', kol: '#8A7A6A' } : {}) });
      }
      s += `<path d="M${kx - 100},840 ${[0, 1, 2, 3, 4, 5].map(i => `L${kx + i * 230},880`).join(' ')} L${kx + 1300},860" fill="none" stroke="#C9A86B" stroke-width="7"/>`;
      s += alinti(['Kılıç zoruyla alınan şehrin halkı', 'ganimet sayılıyor'], 960, 190, ap(lt, .5, .6), { fs: 46, w: 1100 });
      if (lt > t3 - t2) s += etiketPop('Esir düştün', 960 + 0, 560, lt, t3 - t2, { fs: 46, bg: '#FFD9CF' });
      return s;
    }],
  ]);
};

// b11 — dönüş
SAHNELER.donus = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.1), t2 = B(seg, 2, 7.1);
  let ic = gok('safak') + gunes(1500, 560, 90, '#FFE3A3') + bulutlar(t, { n: 4, renk: '#F7C9A9', op: .6 });
  ic += `<g opacity="${f(ap(t, t2, 1) * 100) / 100}">${sehirSiluet(960, 600, .7, { seed: 5 })}</g>`;
  ic += deniz(600, t, { renk: '#5A86A8', renk2: '#2E4E70' });
  if (t > t2) for (let i = 0; i < 3; i++) ic += sandal(300 + i * 500, 700 + (i % 2) * 40, .5, t + i);
  ic += `<path d="M-100,820 Q600,780 1200,810 Q1600,830 2100,800 L2100,1200 L-100,1200 Z" fill="#D9C08E" stroke="${OUT}" stroke-width="5"/>`;
  // kulübe (sağda, onarılmış)
  let k = `<rect x="-200" y="-260" width="400" height="260" fill="#A7754A" stroke="${OUT}" stroke-width="6"/><path d="M-240,-250 L0,-390 L240,-260 Z" fill="#7A5A3A" stroke="${OUT}" stroke-width="6"/><rect x="-50" y="-150" width="100" height="150" fill="#3A2A1C"/>`;
  ic += G(tr(1500, 900, .9), k);
  const kx = lerp(-150, 1180, ap(t, .5, d - 2, easeIO));
  ic += karakter({ x: kx, y: 960, s: .9, t, rol: 'balikci', ifade: t > t1 + 1 ? 'mutlu' : 'uzgun', yuru: true, yalinayak: true, esya: 'ag', poz: 'tut' });
  let s = kam(t, d, ic, { z0: 1.06, z1: 1.0 });
  // kırık zincir
  if (t > t1 - .2 && t < t2 + 1) {
    const k2 = ap(t, t1, .6);
    s += op(1 - ap(t, t2, .8), G(tr(960, 260), zincirHalka(-60 - k2 * 40, 0, 2, -20 - k2 * 30) + zincirHalka(60 + k2 * 40, 0, 2, 20 + k2 * 30) +
      etiket('Fidye', -260, 130, { fs: 36 }) + etiket("Sultan'ın kararı", 260, 130, { fs: 36 })));
  }
  s += etiketPop('Yeni başkentin balıkçıya ihtiyacı var', 960, 120, t, t2 + .5, { fs: 38, bg: '#DDF2C4' });
  return s;
};

// ===== Keşiş =====
function manastirArka(t, o = {}) {
  let s = gok(o.gok || 'gun') + bulutlar(t, { n: 4, y0: 40, yr: 120 });
  // Pantokrator: çok kubbeli kilise
  let k = '';
  [[-380, .8], [0, 1], [380, .8]].forEach(([x, sc]) => {
    k += `<rect x="${x - 170 * sc}" y="${-300 * sc}" width="${340 * sc}" height="${300 * sc}" fill="#C98A6A" stroke="${OUT}" stroke-width="5"/>`;
    for (let i = 0; i < 4; i++) k += `<rect x="${x - 140 * sc + i * 80 * sc}" y="${-260 * sc}" width="${30 * sc}" height="${60 * sc}" rx="${15 * sc}" fill="#5A3A28"/>`;
    for (let r = 0; r < 4; r++) k += `<line x1="${x - 170 * sc}" y1="${-300 * sc + 60 * sc + r * 60 * sc}" x2="${x + 170 * sc}" y2="${-300 * sc + 60 * sc + r * 60 * sc}" stroke="#A86A4A" stroke-width="4"/>`;
    k += `<rect x="${x - 80 * sc}" y="${-380 * sc}" width="${160 * sc}" height="${80 * sc}" fill="#C98A6A" stroke="${OUT}" stroke-width="5"/>`;
    k += `<path d="M${x - 90 * sc},${-378 * sc} A${90 * sc},${80 * sc} 0 0 1 ${x + 90 * sc},${-378 * sc} Z" fill="#7F8E9C" stroke="${OUT}" stroke-width="5"/>`;
    k += `<line x1="${x}" y1="${-458 * sc}" x2="${x}" y2="${-500 * sc}" stroke="${OUT}" stroke-width="5"/><line x1="${x - 14}" y1="${-484 * sc}" x2="${x + 14}" y2="${-484 * sc}" stroke="${OUT}" stroke-width="5"/>`;
  });
  s += G(tr(960, 720, 1), k);
  s += servi(260, 760, 1.4) + servi(1660, 760, 1.5) + servi(1560, 760, 1.1);
  s += zemin(720, '#CDB58A', { cizgi: true });
  // revak
  for (let i = 0; i < 8; i++) s += `<path d="M${-40 + i * 270},1100 L${-40 + i * 270},880 A110,110 0 0 1 ${180 + i * 270},880 L${180 + i * 270},1100" fill="none" stroke="#8A6A48" stroke-width="22" opacity=".0"/>`;
  return s;
}

// k02 — manastır hayatı
SAHNELER.manastir = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.5);
  let ic = manastirArka(t);
  ic += karakter({ x: 1450, y: 1000, s: .7, t, rol: 'kesis', ifade: 'normal', poz: 'tut', esya: 'mum', faz: 2, yon: -1 });
  ic += karakter({ x: 760, y: 1020, s: 1.0, t, rol: 'kesis', ifade: 'normal', poz: 'tut', esya: 'parsomen' });
  let s = kam(t, d, ic, { z0: 1.0, z1: 1.06 });
  s += baslikSerit('PANTOKRATOR MANASTIRI', 960, 110, ap(t, .4, .5), { fs: 52 });
  const ik = [['Dua', 360, '🙏'], ['Oruç', 960, ''], ['El yazmaları', 1560, '']];
  s += etiketPop('Dua', 330, 300, t, t1 + .8, { fs: 40, bg: '#FFF3C4' });
  s += etiketPop('Oruç', 960 - 40, 300, t, t1 + 1.6, { fs: 40, bg: '#FFF3C4' });
  s += etiketPop('El yazması kitaplar', 1500, 300, t, t1 + 2.6, { fs: 40, bg: '#FFF3C4' });
  return s;
};

// k03 — Kiliselerin Birliği
SAHNELER.birlik_ilani = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.4), t2 = B(seg, 2, 8.5), t3 = B(seg, 3, 11.7);
  return parca(t, [
    [0, lt => {
      let s = manastirArka(lt, { gok: 'aksam' });
      s += karakter({ x: 700, y: 1000, s: .95, t: lt, rol: 'kesis', ifade: 'endise', poz: 'bel' });
      s += karakter({ x: 1200, y: 1000, s: .85, t: lt, rol: 'kesis', ifade: 'sinirli', yon: -1, faz: 1, renkler: { sakal: '#5A4A3A' } });
      s += balon(['Duydun mu?!'], 1200, 420, { fs: 40, k: ap(lt, .4, .4), kuyruk: 20 });
      return s;
    }],
    [t1, lt => {
      let s = gok('gun') + ayasofya(960, 900, 1.15) + zemin(880, '#B89A6A', { cizgi: true });
      // iki haç birleşir
      const k = ap(lt, 1.2, 1.4, easeIO);
      const latin = `<rect x="-14" y="-90" width="28" height="180" fill="#B3262E" stroke="${OUT}" stroke-width="5"/><rect x="-60" y="-50" width="120" height="26" fill="#B3262E" stroke="${OUT}" stroke-width="5"/>`;
      const orto = `<rect x="-14" y="-90" width="28" height="180" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/><rect x="-60" y="-50" width="120" height="26" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/><rect x="-40" y="-80" width="80" height="18" fill="#E2B54B" stroke="${OUT}" stroke-width="4"/><rect x="-44" y="40" width="88" height="18" fill="#E2B54B" stroke="${OUT}" stroke-width="4" transform="rotate(-18 0 49)"/>`;
      s += G(tr(lerp(560, 890, k), 330, 1.5), latin) + G(tr(lerp(1360, 1030, k), 330, 1.5), orto);
      s += yazi('KATOLİK', 560, 520, { fs: 40, renk: '#fff', kontur: OUT }) + yazi('ORTODOKS', 1360, 520, { fs: 40, renk: '#fff', kontur: OUT });
      if (k > .2) s += ok(700, 520, 840, 420, k, { renk: '#B3262E', w: 8 }) + ok(1220, 520, 1080, 420, k, { renk: '#E2B54B', w: 8 });
      if (k >= 1) s += `<circle cx="960" cy="330" r="${f(150 + Math.sin(lt * 4) * 8)}" fill="none" stroke="#FFF3C4" stroke-width="8" opacity=".8"/>`;
      s += baslikSerit('KİLİSELERİN BİRLİĞİ — 12 ARALIK 1452', 960, 100, ap(lt, .2, .5), { fs: 46 });
      return s;
    }],
    [t2, lt => {
      let s = altinZemin({ c1: '#E7C9F0', c2: '#8A5AA8', c3: '#2A1A3A' });
      s += karakter({ x: 520, y: 1000, s: 1.0, t: lt, rol: 'imparator', ifade: 'endise', poz: 'isaret', bak: 1 });
      s += ok(760, 600, 1500, 600, ap(lt, .4, .8), { renk: '#E2B54B' });
      [0, 1, 2].forEach(i => s += gemi(1300 + i * 200, 900 + (i % 2) * 40, .45, { t: lt, faz: i, bayrak: '#B3262E', yelken: '#F2E6CC' }));
      s += etiketPop("Batı'dan yardım?", 1450, 380, lt, .8, { fs: 46 });
      return s;
    }],
    [t3, lt => {
      let s = gok('aksam') + zemin(800, '#9C8460', { cizgi: true });
      s += kalabalik(60, 1000, 9, 210, lt, { s: .6, poz: 'kaldir', ifadeler: ['sinirli', 'sinirli', 'endise'], seed: 71, zipla: true });
      s += karakter({ x: 960, y: 1060, s: .95, t: lt, rol: 'kesis', ifade: 'sinirli', poz: 'kaldir', zipla: true });
      s += etiketPop('BİRLİĞE HAYIR!', 960, 260, lt, .3, { fs: 64, bg: '#FFD9CF', renk: '#9A1A1A', r: -3 });
      return s;
    }],
  ]);
};

// k04 — Latin külahı / Türk sarığı
SAHNELER.latin_kulahi = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.7);
  let s = altinZemin({ c1: '#E8B07A', c2: '#9C4A2A', c3: '#3A140A' });
  const egim = kf(t, [[0, 0], [t1 + 1.5, 0], [t1 + 3, 12]]) + Math.sin(t * 2) * 1.5;
  let ter = `<rect x="-12" y="-420" width="24" height="420" fill="#8A6A3A" stroke="${OUT}" stroke-width="5"/><path d="M-120,0 L120,0 L80,-40 L-80,-40 Z" fill="#8A6A3A" stroke="${OUT}" stroke-width="5"/>`;
  let kol = `<rect x="-420" y="-12" width="840" height="24" rx="10" fill="#C9962E" stroke="${OUT}" stroke-width="5"/><circle r="22" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/>`;
  const kefe = (x, ic) => `<g transform="translate(${x},0) rotate(${-egim})"><line x1="0" y1="0" x2="-110" y2="220" stroke="${OUT}" stroke-width="4"/><line x1="0" y1="0" x2="110" y2="220" stroke="${OUT}" stroke-width="4"/><path d="M-140,220 Q0,290 140,220 Z" fill="#C9962E" stroke="${OUT}" stroke-width="5"/>${ic}</g>`;
  const kulah = `<g transform="translate(0,215) scale(.75) translate(0,330)">${sapkaCiz('galero', null, t)}</g>`;
  const sarik = `<g transform="translate(0,215) scale(.75) translate(0,330)">${sapkaCiz('kavuk', null, t)}</g>`;
  kol += kefe(-400, kulah) + kefe(400, sarik);
  s += G(tr(960, 900), ter + G(`translate(0,-420) rotate(${egim})`, kol));
  s += yazi('LATİN KÜLAHI', 960 - 400, 900 - 420 + 330 - egim * 7, { fs: 36, renk: '#FFF4DC', kontur: OUT });
  s += yazi('TÜRK SARIĞI', 960 + 400, 900 - 420 + 330 + egim * 7, { fs: 36, renk: '#FFF4DC', kontur: OUT });
  s += alinti(['Şehrin ortasında Latin külahı görmektense,', 'Türk sarığı görmeyi yeğlerim.'], 960, 180, ap(t, t1 - .1, .6), { fs: 46, w: 1300, kaynak: '— Lukas Notaras’a atfedilir (Dukas)' });
  return s;
};

// k05 — keşişler surlarda, ikona
SAHNELER.kesis_sur = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.1), t2 = B(seg, 2, 6.4);
  return parca(t, [
    [0, lt => {
      let s = gok('gun') + bulutlar(lt, { n: 4 });
      s += sur(-50, 380, 2100, 380, { kuleAra: 640, kw: 160, kuleFark: 100, seed: 4 });
      s += zemin(760, '#8A9A5A', { cizgi: true });
      for (let i = 0; i < 3; i++) s += karakter({ x: ((lt * 90 + i * 330) % 1300) - 100, y: 990 - i * 6, s: .62, t: lt, faz: i, rol: 'kesis', ifade: 'kararli', poz: 'tasi', esya: 'tas', yuru: true, renkler: i === 1 ? { sakal: '#5A4A3A' } : {} });
      // yaralı asker
      s += `<g transform="translate(1500,980) rotate(-80)">${karakter({ x: 0, y: 0, s: .6, t: lt, rol: 'asker', ifade: 'uzgun', bob: false })}</g>`;
      s += `<rect x="1440" y="850" width="120" height="16" fill="#F2EEE6" stroke="${OUT}" stroke-width="3"/>`;
      s += karakter({ x: 1700, y: 1000, s: .8, t: lt, rol: 'kesis', ifade: 'endise', poz: 'tut', yon: -1 });
      s += karakter({ x: 520, y: 1040, s: .9, t: lt, rol: 'kesis', ifade: 'kararli', poz: 'bel' });
      s += etiketPop('Taş taşıma', 380, 300, lt, t1, { fs: 36 }) + etiketPop('Yaralılara bakım', 1560, 640, lt, t1 + 1.2, { fs: 36 });
      return s;
    }],
    [t2 - .1, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#1B1430"/>`;
      for (let i = 0; i < 18; i++) s += `<path d="M960,500 L${960 + Math.cos(i / 18 * 6.283 + lt * .2) * 1400},${500 + Math.sin(i / 18 * 6.283 + lt * .2) * 1400} L${960 + Math.cos((i + .5) / 18 * 6.283 + lt * .2) * 1400},${500 + Math.sin((i + .5) / 18 * 6.283 + lt * .2) * 1400} Z" fill="#E2B54B" opacity=".12"/>`;
      s += `<circle cx="960" cy="500" r="${f(260 + Math.sin(lt * 3) * 10)}" fill="#FFE9B0" opacity=".25"/>`;
      s += ikona(960, 520, 2.2 * easeBack(ap(lt, .1, .7)));
      s += baslikSerit('ŞEHRİN EN KUTSAL İKONASI', 960, 120, ap(lt, .5, .5), { fs: 50 });
      s += etiket('Hodegetria (Yol Gösteren Meryem)', 960, 960, { fs: 36 });
      return s;
    }],
  ]);
};

// sokak arka planı
function sokak(t, o = {}) {
  let s = gok(o.gok || 'gun');
  const r = rng(o.seed || 61);
  for (let i = 0; i < 9; i++) s += ev(80 + i * 230, 760, 1.6 + r() * .4, ['#E3C9A3', '#D9B58C', '#EAD6B8'][i % 3], ['#B5583C', '#A04A34', '#C2694A'][i % 3]);
  s += zemin(760, '#B8A07A', { cizgi: true });
  for (let x = -60; x < W + 60; x += 110) s += `<path d="M${x},760 L${x - 140},1100" stroke="#A08860" stroke-width="4"/>`;
  return s;
}

// k06 — ikona düşer, dolu fırtınası
SAHNELER.ikona_alay = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.9), t2 = B(seg, 2, 7.1), t3 = B(seg, 3, 10.5);
  const firt = ap(t, t2 - .6, 1.0, easeIO);
  let s = sokak(t) + op(firt, gok('firtina') + `<rect width="${W}" height="${H}" fill="#1A2030" opacity=".35"/>`);
  if (firt > 0) {
    const r = rng(8);
    s += `<g opacity="${f(firt * 100) / 100}">`;
    for (let i = 0; i < 80; i++) { const x = r() * W, sp = 600 + r() * 400, y = ((t * sp + r() * H) % (H + 100)) - 50; s += `<circle cx="${f(x + (y * .15))}" cy="${f(y)}" r="${f(5 + r() * 5)}" fill="#F4F8FF" stroke="#AAB8CC" stroke-width="2"/>`; }
    s += `</g>`;
    // şimşek
    if (t > t2 - .6 && t < t2 - .3) s += `<rect width="${W}" height="${H}" fill="#fff" opacity=".7"/><path d="M1300,0 L1240,200 L1300,200 L1220,420" fill="none" stroke="#FFF8C4" stroke-width="14"/>`;
  }
  // alay
  const dus = ap(t, .5, .6, easeOut);
  const ix = 960, iy = lerp(560, 930, dus);
  s += karakter({ x: 640, y: 1000, s: .8, t, rol: 'kesis', ifade: t < .5 ? 'normal' : (t < t1 ? 'korku' : 'endise'), poz: t > t1 ? 'tut' : 'kaldir', titre: t > t1 && t < t2, renkler: { sakal: '#5A4A3A' }, faz: 1 });
  s += karakter({ x: 1280, y: 1000, s: .8, t, rol: 'kesis', ifade: t < .5 ? 'normal' : (t < t1 ? 'korku' : 'endise'), poz: t > t1 ? 'tut' : 'kaldir', titre: t > t1 && t < t2, yon: -1 });
  s += G(tr(ix, iy, 1.1, dus * 78), ikona(0, -100, 1));
  s += karakter({ x: 1640, y: 1040, s: .85, t, rol: 'kesis', ifade: t < .5 ? 'normal' : (t > t3 ? 'uzgun' : 'saskin'), poz: 'yan', esya: 'mum', yon: -1, faz: 2 });
  s += karakter({ x: 260, y: 1040, s: .7, t, rol: 'kadin', ifade: t > t3 ? 'uzgun' : 'korku', faz: 3 });
  if (t > .7 && t < t1) s += unlem(960, 320, 1);
  if (t < t2 - .3) s += etiketPop('Kurşun gibi ağır!', 960, 340, t, t1 + .4, { fs: 44 });
  s += etiketPop('Dolu fırtınası', 960, 160, t, t2, { fs: 44, bg: '#DDE6F2' });
  s += etiketPop('Kötü alamet...', 960, 250, t, t3, { fs: 44, bg: '#FFD9CF' });
  return G(sars(t, [.9], 10), s);
};

// k07 — Gennadios patrik oluyor
SAHNELER.gennadios = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.1), t2 = B(seg, 2, 5.1);
  return parca(t, [
    [0, lt => {
      let s = manastirArka(lt, { gok: 'aksam' });
      s += `<rect width="${W}" height="${H}" fill="#3A1A0A" opacity=".35"/>`;
      s += ates(500, 720, 2.2, lt) + ates(1400, 720, 1.8, lt + 1) + duman(960, 300, lt % 2.5, 0, { sure: 2.5, renk: '#4A403A', boy: 2 });
      s += sandik(960, 1000, 1.2, 0);
      s += etiketPop('Yağma', 960, 820, lt, .4, { fs: 44, bg: '#FFD9CF' });
      return s;
    }],
    [t1, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#1B2147"/>`;
      s += unlem(960, 540, 1.6 * easeBack(ap(lt, 0, .4)));
      s += yazi('İLGİNÇ OLAN ŞU...', 960, 800, { fs: 60, renk: '#E2B54B', font: 'baslik' });
      return s;
    }],
    [t2, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#E3CFA6"/>` + kemerler(980, 6, '#E3CFA6', '#7A2A2A');
      s += zemin(980, '#8A3A2A');
      for (let i = 0; i < 12; i++) s += `<rect x="${i * 170}" y="1000" width="140" height="60" fill="#A84A3A" opacity=".6"/>`;
      s += karakter({ x: 1300, y: 1010, s: 1.05, t: lt, rol: 'sultan', ifade: 'normal', poz: 'sun', esya: null, yon: -1, elR: [70, -170] });
      // asa: sultan uzatır, patriğe geçer
      const k = ap(lt, 1.5, 1.2, easeIO);
      const ax = lerp(1220, 860, k);
      s += `<g transform="translate(${f(ax)},${f(820)})"><line x1="0" y1="200" x2="0" y2="-260" stroke="#E2B54B" stroke-width="12"/><path d="M0,-260 q-40,-14 -34,-56" fill="none" stroke="#E2B54B" stroke-width="12"/><path d="M-12,-240 h24" stroke="#E2B54B" stroke-width="10"/></g>`;
      s += karakter({ x: 640, y: 1010, s: 1.05, t: lt, rol: 'patrik', ifade: k >= 1 ? 'saskin' : 'normal', poz: 'tut' });
      s += etiketPop('Sultan II. Mehmed', 1300, 330, lt, .4, { fs: 36 });
      s += etiketPop('Gennadios Skolarios', 640, 330, lt, 1.0, { fs: 36 });
      s += baslikSerit('RUM ORTODOKS PATRİĞİ (1454)', 960, 110, ap(lt, 3.2, .5), { fs: 50 });
      return s;
    }],
  ]);
};

// k08 — keşiş için sonuç
SAHNELER.kesis_sonuc = (t, d, p, seg) => {
  const t1 = B(seg, 1, 6.7);
  let s = ayasofyaIc(t, { isik: '#FFE3B0', orta: '#B8863A', koyu: '#3A2410', huzmeOp: .12 });
  // kilise yerine ikonostasis: mumlar
  for (let i = 0; i < 14; i++) s += `<rect x="${200 + i * 110}" y="820" width="14" height="70" fill="#F2E6CC" stroke="${OUT}" stroke-width="3"/>` + ates(207 + i * 110, 822, .18, t + i);
  s += karakter({ x: 1300, y: 1060, s: .8, t, rol: 'kesis', ifade: 'normal', poz: 'dua', yon: -1, faz: 1, renkler: { sakal: '#5A4A3A' } });
  s += karakter({ x: 1560, y: 1060, s: .75, t, rol: 'kesis', ifade: 'normal', poz: 'dua', faz: 2 });
  s += karakter({ x: 760, y: 1070, s: 1.0, t, rol: 'kesis', ifade: 'mutlu', poz: 'tut', esya: 'mum' });
  s += etiketPop('Kilise yaşamaya devam ediyor', 960, 140, t, .6, { fs: 44, bg: '#DDF2C4' });
  if (t > t1) s += G(tr(420, 420), muhur(0, 0, 2 * easeBack(ap(t, t1, .5))) ) + etiketPop("Sultan'ın eliyle", 420, 560, t, t1 + .3, { fs: 36 });
  return s;
};
