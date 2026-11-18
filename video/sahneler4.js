// ===== Sahneler: Soylu + İmparator + Sonuç =====

function tacCiz(x, y, s = 1, t = 0) { return G(tr(x, y, s), `<g transform="translate(0,380)">${sapkaCiz('tac', null, t)}</g>`); }
function kartal(x, y, s = 1, renk = '#E2B54B') {
  // stilize çift başlı kartal (Palaiologos)
  return G(tr(x, y, s), `<path d="M0,-20 Q-40,-30 -90,-90 Q-60,-20 -110,-10 Q-60,10 -80,60 Q-30,30 -20,70 L0,110 L20,70 Q30,30 80,60 Q60,10 110,-10 Q60,-20 90,-90 Q40,-30 0,-20 Z" fill="${renk}" stroke="${OUT}" stroke-width="5"/>` +
    `<circle cx="-34" cy="-62" r="18" fill="${renk}" stroke="${OUT}" stroke-width="5"/><circle cx="34" cy="-62" r="18" fill="${renk}" stroke="${OUT}" stroke-width="5"/>` +
    `<path d="M-50,-64 L-66,-58 L-50,-54 Z M50,-64 L66,-58 L50,-54 Z" fill="${OUT}"/>`);
}
function sancakBizans(x, y, s, t) {
  const w = Math.sin(t * 2) * 6;
  return G(tr(x, y, s), `<rect x="-6" y="0" width="12" height="520" fill="#8A6A3A" stroke="${OUT}" stroke-width="4"/><path d="M6,20 L220,${30 + w} L220,${330 + w} L6,320 Z" fill="#9A1A2A" stroke="${OUT}" stroke-width="5"/>` + kartal(113, 170, .9));
}
function konakIc(t) {
  let s = `<rect width="${W}" height="${H}" fill="#EDE3D0"/>`;
  s += `<rect x="0" y="0" width="${W}" height="90" fill="#C9962E"/>`;
  for (let x = 0; x < W; x += 60) s += `<rect x="${x + 10}" y="20" width="40" height="40" fill="${(x / 60) % 2 ? '#2E6B8A' : '#9A1A2A'}" opacity=".7"/>`;
  // kemerli pencere + avlu, at
  s += `<path d="M1180,760 L1180,360 A200,200 0 0 1 1580,360 L1580,760 Z" fill="#9ED0E9" stroke="${OUT}" stroke-width="7"/>`;
  s += `<svg x="1180" y="160" width="400" height="600" viewBox="1180 160 400 600"><rect x="1180" y="560" width="400" height="200" fill="#9DBB6E"/>${servi(1520, 600, .8)}${at(1330, 720, .55, { t, renk: '#8A5A3A', yele: '#3A2418', eyer: '#9A1A2A' })}</svg>`;
  s += `<path d="M1180,760 L1180,360 A200,200 0 0 1 1580,360 L1580,760 Z" fill="none" stroke="${OUT}" stroke-width="7"/>`;
  [140, 560, 1000, 1760].forEach(x => s += `<rect x="${x - 34}" y="90" width="68" height="680" fill="#E8E0D0" stroke="${OUT}" stroke-width="5"/><rect x="${x - 50}" y="90" width="100" height="40" fill="#C9962E" stroke="${OUT}" stroke-width="5"/><rect x="${x - 50}" y="740" width="100" height="40" fill="#C9962E" stroke="${OUT}" stroke-width="5"/>`);
  s += `<rect x="0" y="770" width="${W}" height="320" fill="#D9CDB8"/>`;
  for (let i = 0; i < 14; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2) s += `<rect x="${i * 140}" y="${770 + j * 105}" width="140" height="105" fill="#BBAE96"/>`;
  return s;
}

// s02 — konak
SAHNELER.konak = (t, d, p, seg) => {
  const t1 = B(seg, 1, 5.7), t2 = B(seg, 2, 10.4);
  return parca(t, [
    [0, lt => {
      let ic = konakIc(lt);
      ic += karakter({ x: 380, y: 1020, s: .65, t: lt, rol: 'sivil', ifade: 'normal', poz: 'tut', esya: 'ekmek', kafaEgim: 8, renkler: { govde: '#8A9A6A', kol: '#8A9A6A' } });
      ic += karakter({ x: 1700, y: 1020, s: .65, t: lt, rol: 'kadin', ifade: 'normal', poz: 'tut', kafaEgim: -8, yon: -1, faz: 2, renkler: { govde: '#8A9A6A', kol: '#8A9A6A' } });
      ic += karakter({ x: 860, y: 1040, s: 1.05, t: lt, rol: 'soylu', ifade: 'mutlu', poz: 'bel' });
      let s = kam(lt, t2, ic, { z0: 1.0, z1: 1.05 });
      s += etiketPop('İpek kaftan', 860, 380, lt, 1.2, { fs: 36 });
      s += etiketPop('Hizmetkârlar', 380, 560, lt, t1, { fs: 36 });
      s += etiketPop('Atlar', 1380, 300, lt, t1 + 1.2, { fs: 36 });
      s += etiketPop('Konak', 1700, 200, lt, t1 + 2.2, { fs: 36 });
      return s;
    }],
    [t2, lt => {
      let s = altinZemin({ c1: '#F7E3B0', c2: '#C99A4E', c3: '#6B4012' });
      s += karakter({ x: 380, y: 1000, s: .95, t: lt, rol: 'soylu', ifade: 'sirit', poz: 'isaret', bak: 1 });
      s += sandik(620, 1000, .9, 1);
      // banka binası
      let b = `<path d="M-280,-420 L0,-560 L280,-420 Z" fill="#E8E0D0" stroke="${OUT}" stroke-width="6"/><rect x="-280" y="-420" width="560" height="40" fill="#E8E0D0" stroke="${OUT}" stroke-width="6"/>`;
      for (let i = 0; i < 5; i++) b += `<rect x="${-250 + i * 120}" y="-380" width="50" height="340" fill="#F2EEE6" stroke="${OUT}" stroke-width="5"/>`;
      b += `<rect x="-300" y="-40" width="600" height="40" fill="#E8E0D0" stroke="${OUT}" stroke-width="6"/>`;
      b += yazi('BANCO', 0, -470, { fs: 44, renk: '#5A3A1C', font: 'baslik' });
      s += G(tr(1450, 1000), b);
      for (let i = 0; i < 6; i++) {
        const k = ((lt * .6 + i / 6) % 1);
        s += sikke(lerp(680, 1300, k), 760 - Math.sin(k * Math.PI) * 260, .9);
      }
      s += etiketPop('İtalyan bankaları', 1450, 300, lt, .5, { fs: 42, bg: '#FFE9B0' });
      s += etiketPop('(Ceneviz & Venedik)', 1450, 380, lt, .9, { fs: 32 });
      return s;
    }],
  ]);
};

// s03 — yardım isteniyor, servet saklanıyor
SAHNELER.hazine_gom = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.0);
  return parca(t, [
    [0, lt => {
      let s = altinZemin({ c1: '#E7C9F0', c2: '#8A5AA8', c3: '#2A1A3A' });
      s += karakter({ x: 520, y: 1000, s: 1.0, t: lt, rol: 'imparator', ifade: 'endise', poz: 'sun', elR: [140, -190] });
      s += balon(['Şehir için', 'yardım edin!'], 640, 330, { fs: 42, k: ap(lt, .4, .4), kuyruk: -120 });
      s += karakter({ x: 1250, y: 1000, s: .9, t: lt, rol: 'soylu', ifade: 'sirit', poz: 'bel', bak: 1, yon: -1 });
      s += karakter({ x: 1560, y: 1000, s: .85, t: lt, rol: 'soylu', ifade: 'endise', poz: 'tut', bak: 1, yon: -1, faz: 2, renkler: { govde: '#6A2A3A', kol: '#6A2A3A' } });
      return s;
    }],
    [t1, lt => {
      let s = gok('gece') + yildizlar(lt) + ay(1600, 150, 50);
      s += tepe([[-100, 760], [900, 740], [2100, 760]], '#2A3A2E');
      s += servi(300, 770, 1.3, '#1E3A28') + agac(1600, 770, 1.2, '#2E4A30');
      s += `<rect width="${W}" height="${H}" fill="#0A1030" opacity=".3"/>`;
      // çukur
      const kz = ap(lt, .2, 3, easeIO);
      s += `<ellipse cx="1080" cy="900" rx="${f(150 * kz + 20)}" ry="${f(40 * kz + 6)}" fill="#1A120C" stroke="${OUT}" stroke-width="4"/>`;
      s += `<path d="M1260,900 Q1320,${860 - kz * 50} 1400,900 Z" fill="#5A3D26" stroke="${OUT}" stroke-width="4"/>`;
      s += sandik(1080, lerp(900, 960, ap(lt, 3.2, 1)), .8, 0);
      // kürek
      const kurek = Math.sin(lt * 4) * 20;
      s += karakter({ x: 800, y: 1000, s: .85, t: lt, rol: 'soylu', ifade: 'sirit', poz: 'tut', bak: Math.sin(lt * 1.3) > 0 ? 1 : -1, elR: [70, -120 + kurek * .5], elL: [20, -140 + kurek * .5] });
      s += G(tr(800 + 70 * .85, 1000 - 120 * .85, 1, 40 + kurek), `<rect x="-6" y="-20" width="12" height="200" fill="#8B5A2B" stroke="${OUT}" stroke-width="3"/><path d="M-30,180 L30,180 L24,250 Q0,270 -24,250 Z" fill="#8D96A0" stroke="${OUT}" stroke-width="4"/>`);
      s += etiketPop('Servet saklanıyor...', 960, 160, lt, .6, { fs: 46, bg: '#FFE9B0' });
      return s;
    }],
  ]);
};

function cadirIc() {
  let s = `<rect width="${W}" height="${H}" fill="#9A1A2A"/>`;
  for (let x = -100; x < W + 100; x += 160) s += `<path d="M960,-200 L${x},780" stroke="#B3262E" stroke-width="60"/>`;
  s += `<rect x="0" y="0" width="${W}" height="70" fill="#E2B54B"/>`;
  for (let x = 0; x < W; x += 80) s += `<path d="M${x},70 L${x + 40},110 L${x + 80},70 Z" fill="#E2B54B"/>`;
  s += `<rect x="0" y="780" width="${W}" height="300" fill="#7A2A2A"/>`;
  s += `<rect x="160" y="820" width="${W - 320}" height="240" fill="#A84A3A" stroke="#E2B54B" stroke-width="10"/>`;
  for (let i = 0; i < 8; i++) s += `<path d="M${280 + i * 200},940 l40,-50 l40,50 l-40,50 Z" fill="#E2B54B" opacity=".7"/>`;
  return s;
}
// s04 — Notaras ve Sultan
SAHNELER.notaras_sultan = (t, d, p, seg) => {
  const t1 = B(seg, 1, 7.0), t3 = B(seg, 3, 11.4), t4 = B(seg, 4, 14.0);
  let s = cadirIc();
  s += karakter({ x: 1420, y: 1010, s: 1.05, t, rol: 'sultan', ifade: t > t4 ? 'sinirli' : 'normal', poz: t > t3 ? 'isaret' : 'bel', yon: -1, elR: t > t3 ? [150, -230] : undefined });
  s += sandik(900, 1010, 1.0, 1);
  s += karakter({ x: 520, y: 1010, s: 1.0, t, rol: 'soylu', ifade: t > t4 ? 'korku' : 'endise', poz: 'sun', kafaEgim: t < t3 ? 10 : 0, renkler: { govde: '#3A4A6A', kol: '#3A4A6A', sakal: '#8A8680' }, titre: t > t4 + 1 });
  s += etiketPop('Lukas Notaras', 520, 300, t, .8, { fs: 38 });
  s += etiketPop('Sultan II. Mehmed', 1420, 220, t, 1.6, { fs: 38 });
  // hatırlatma: Latin külahı
  if (t > t1 - .2 && t < t3 + .2) {
    const k = ap(t, t1 - .2, .5, easeBack) * (1 - ap(t, t3 - .3, .4));
    let r = `<circle r="200" fill="#F4E6C4" stroke="#7A5A2A" stroke-width="8"/>`;
    r += `<g transform="translate(-80,30) scale(.4) translate(0,330)">${sapkaCiz('galero', null, t)}</g>` + yazi('≠', 0, 0, { fs: 80, renk: '#7A5A2A', font: 'baslik' }) + `<g transform="translate(80,40) scale(.4) translate(0,330)">${sapkaCiz('kavuk', null, t)}</g>`;
    r += yazi('Hatırladın mı?', 0, -120, { fs: 36, renk: '#5A3A1C' }) + yazi('"Latin külahı" sözü', 0, 130, { fs: 30, renk: '#5A3A1C' });
    if (k > 0) s += G(tr(960, 400, k), r);
  }
  if (t > t3) s += etiketPop('Anlatılana göre...', 960, 140, t, t3, { fs: 38 });
  s += balon(['Bu kadar servetin vardı da,', 'neden imparatoruna ve', 'şehrine vermedin?'], 1180, 420, { fs: 40, k: ap(t, t4 - .2, .4), kuyruk: 160 });
  return s;
};

// s05 — soylunun sonu
SAHNELER.soylu_son = (t, d, p, seg) => {
  const t1 = B(seg, 1, 5.9), t2 = B(seg, 2, 10.8);
  return parca(t, [
    [0, lt => {
      const kar = ap(lt, 2.2, 2, easeIO);
      let s = `<rect width="${W}" height="${H}" fill="#3A2A4A"/>`;
      s += `<circle cx="960" cy="560" r="460" fill="#5A4A6A" opacity=".5"/>`;
      s += karakter({ x: 960, y: 980, s: 1.0, t: lt, rol: 'soylu', ifade: lt < 2 ? 'mutlu' : 'uzgun', poz: lt < 2 ? 'kaldir' : 'yan', renkler: { govde: '#3A4A6A', kol: '#3A4A6A', sakal: '#8A8680' } });
      if (lt > 2) {
        s += op(ap(lt, 2.2, .6), karakter({ x: 640, y: 1000, s: .7, t: lt, rol: 'soylu', ifade: 'uzgun', renkler: { govde: '#4A5A7A', kol: '#4A5A7A', sakal: null, sapka: null }, faz: 1 }));
        s += op(ap(lt, 2.4, .6), karakter({ x: 1280, y: 1000, s: .7, t: lt, rol: 'soylu', ifade: 'uzgun', renkler: { govde: '#4A5A7A', kol: '#4A5A7A', sakal: null, sapka: null }, faz: 2 }));
      }
      // takvim
      if (lt > 1.2 && lt < 3.4) {
        const g = Math.floor((lt - 1.2) / .4);
        s += G(tr(1560, 300, easeBack(ap(lt, 1.2, .3))), `<rect x="-110" y="-120" width="220" height="240" rx="12" fill="#F4E6C4" stroke="${OUT}" stroke-width="6"/><rect x="-110" y="-120" width="220" height="60" rx="12" fill="#B3262E" stroke="${OUT}" stroke-width="6"/>` + yazi('HAZİRAN', 0, -90, { fs: 30, renk: '#fff' }) + yazi(String(Math.min(1 + g, 4)), 0, 30, { fs: 110, renk: OUT, font: 'baslik' }));
      }
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${f(kar * .55 * 100) / 100}"/>`;
      s += etiketPop('Birkaç gün sonra...', 960, 140, lt, 1.0, { fs: 42 });
      s += etiketPop('Notaras ve oğulları idam edildi', 960, 260, lt, 3.4, { fs: 44, bg: '#FFD9CF' });
      return s;
    }],
    [t1, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#2A2238"/>`;
      s += G(tr(1300, 520, easeBack(ap(lt, .2, .5))), `<path d="M0,-300 L280,200 L-280,200 Z" fill="#F2C230" stroke="${OUT}" stroke-width="12" stroke-linejoin="round"/>` + yazi('!', 0, 40, { fs: 300, renk: OUT, font: 'baslik' }));
      s += karakter({ x: 520, y: 1000, s: 1.0, t: lt, rol: 'soylu', ifade: 'korku', poz: 'kaldir', titre: true });
      s += etiketPop('EN TEHLİKELİ RÜTBELERDEN BİRİ', 960, 120, lt, .5, { fs: 50, bg: '#FFD9CF', renk: '#9A1A1A' });
      if (lt > t2 - t1) s += etiketPop('Yeni düzende eski güçlere yer yok', 820, 960, lt, t2 - t1, { fs: 40 });
      return s;
    }],
  ]);
};

// ===== İmparator =====
function tahtOdasi(t) {
  let s = altinZemin({ c1: '#F7D57A', c2: '#B8862E', c3: '#4A2A10' });
  for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) s += `<rect x="${i * 220 + (j % 2) * 110}" y="${j * 160}" width="12" height="12" fill="#FFF3C4" opacity=".35" transform="rotate(45 ${i * 220 + (j % 2) * 110} ${j * 160})"/>`;
  // perdeler
  s += `<path d="M0,0 L340,0 Q260,400 300,1080 L0,1080 Z" fill="#5B1F6E" stroke="${OUT}" stroke-width="6"/><path d="M${W},0 L${W - 340},0 Q${W - 260},400 ${W - 300},1080 L${W},1080 Z" fill="#5B1F6E" stroke="${OUT}" stroke-width="6"/>`;
  s += sancakBizans(420, 140, .9, t) + G(`translate(${W},0) scale(-1,1)`, sancakBizans(420, 140, .9, t + 1));
  // taht
  s += `<rect x="760" y="360" width="400" height="460" rx="30" fill="#E2B54B" stroke="${OUT}" stroke-width="7"/><rect x="800" y="400" width="320" height="380" rx="20" fill="#9A1A2A" stroke="${OUT}" stroke-width="5"/>`;
  s += kartal(960, 520, .9, '#E2B54B');
  s += `<rect x="0" y="880" width="${W}" height="200" fill="#6B3A5A"/><rect x="560" y="880" width="800" height="200" fill="#9A1A2A" stroke="#E2B54B" stroke-width="8"/>`;
  return s;
}
// i02 — taht
SAHNELER.imparator_taht = (t, d, p, seg) => {
  const t1 = B(seg, 1, 1.2), t2 = B(seg, 2, 4.0), t3 = B(seg, 3, 8.7);
  return parca(t, [
    [0, lt => {
      let s = kam(lt, t2, tahtOdasi(lt) + karakter({ x: 960, y: 1000, s: 1.1, t: lt, rol: 'imparator', ifade: 'mutlu', poz: 'salla' }), { z0: 1.0, z1: 1.06 });
      s += baslikSerit('XI. KONSTANTİNOS PALAİOLOGOS', 960, 110, ap(lt, t1, .5), { fs: 50 });
      return s;
    }],
    [t2, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#1B1430"/>`;
      const k = ap(lt, .3, 3, easeIO);
      s += `<rect x="200" y="520" width="1520" height="40" rx="20" fill="#3A3060"/><rect x="200" y="520" width="${f(1520 * k)}" height="40" rx="20" fill="#E2B54B"/>`;
      [[0, 'MÖ 27', 'Augustus'], [.24, '330', 'Konstantinopolis'], [1, '1453', 'Son imparator']].forEach(([kx, yil, ad], i) => {
        const x = 200 + kx * 1520;
        if (k >= kx - .01) s += G(tr(x, 540, easeBack(ap(lt, .3 + kx * 3, .4))), `<circle r="34" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/>` + yazi(yil, 0, -90, { fs: 48, renk: '#FFF4DC', font: 'baslik' }) + yazi(ad, 0, 90, { fs: 34, renk: '#C9B8E8' }));
      });
      if (k >= .99) s += tacCiz(1720, 330, .45, lt);
      s += op(ap(lt, 2.2, .5), yazi('≈ 1.500 YIL', 960, 800, { fs: 90, renk: '#E2B54B', font: 'baslik' }));
      s += yazi('ROMA İMPARATORLUĞU', 960, 160, { fs: 56, renk: '#FFF4DC', font: 'baslik' });
      return s;
    }],
    [t3, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#1B1430"/>`;
      const k = ap(lt, .2, 2.4, easeIO);
      const r = lerp(430, 46, k);
      s += `<circle cx="960" cy="560" r="${f(r)}" fill="#5B1F6E" stroke="#E2B54B" stroke-width="8"/>`;
      if (k < .6) s += op(1 - k / .6, yazi('İMPARATORLUK', 960, 560, { fs: 64, renk: '#FFF4DC', font: 'baslik' }));
      for (let i = 0; i < 3; i++) { const rr = ((lt * 160 + i * 140) % 420); s += `<circle cx="960" cy="560" r="${f(r + rr)}" fill="none" stroke="#E2B54B" stroke-width="3" opacity="${f((1 - rr / 420) * .5 * 100) / 100}"/>`; }
      if (k > .8) {
        s += etiketPop('Konstantinopolis', 960, 690, lt, 2.4, { fs: 44 });
        s += `<circle cx="760" cy="760" r="20" fill="#5B1F6E" stroke="#E2B54B" stroke-width="5"/>` + etiketPop('+ Mora', 760, 840, lt, 2.8, { fs: 34 });
      }
      return s;
    }],
  ]);
};

// i03 — hazine boş, gümüş eritiliyor
function kadeh(x, y, s = 1) { return G(tr(x, y, s), `<path d="M-40,-80 L40,-80 Q40,-20 0,-10 Q-40,-20 -40,-80 Z" fill="#D8DEE4" stroke="${OUT}" stroke-width="4"/><rect x="-6" y="-12" width="12" height="40" fill="#D8DEE4" stroke="${OUT}" stroke-width="3"/><ellipse cx="0" cy="30" rx="30" ry="9" fill="#D8DEE4" stroke="${OUT}" stroke-width="3"/>`); }
SAHNELER.gumus_erit = (t, d, p, seg) => {
  const t1 = B(seg, 1, 1.5), t2 = B(seg, 2, 6.6);
  return parca(t, [
    [0, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#3A2A3A"/><rect y="800" width="${W}" height="280" fill="#2A1E2A"/>`;
      s += sandik(1100, 900, 1.6, 1, true);
      s += `<path d="M970,640 L1050,700 M1010,640 L1000,710 M1240,650 L1180,710" stroke="#C9C9C9" stroke-width="2" opacity=".6"/>`;
      s += karakter({ x: 620, y: 1000, s: 1.0, t: lt, rol: 'imparator', ifade: 'uzgun', poz: 'yan' });
      s += etiketPop('HAZİNE: BOŞ', 1100, 360, lt, .2, { fs: 56, bg: '#FFD9CF', renk: '#9A1A1A' });
      return s;
    }],
    [t1, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#2A1E2A"/>` + zemin(860, '#3A2A2A');
      // kazan
      s += ates(960, 900, 2.2, lt);
      s += `<path d="M780,620 L1140,620 L1110,840 Q960,880 810,840 Z" fill="#4A4A52" stroke="${OUT}" stroke-width="7"/><ellipse cx="960" cy="620" rx="180" ry="36" fill="#E8E8F0" stroke="${OUT}" stroke-width="6"/>`;
      for (let i = 0; i < 4; i++) {
        const k = clamp((lt - .3 - i * .7) / .8);
        if (k > 0 && k < 1) s += kadeh(lerp(400 + i * 60, 960, k), lerp(200, 600, k) - Math.sin(k * Math.PI) * 120, .9);
      }
      // sikkeler çıkar → askerler
      if (lt > 2.4) {
        for (let i = 0; i < 6; i++) { const k = ((lt - 2.4) * .7 + i / 6) % 1; s += sikke(lerp(1100, 1600, k), 600 - Math.sin(k * Math.PI) * 240, .8, '#D8DEE4'); }
        s += karakter({ x: 1650, y: 1000, s: .7, t: lt, rol: 'asker', ifade: 'mutlu', poz: 'tut', yon: -1 });
      }
      s += karakter({ x: 260, y: 1000, s: .75, t: lt, rol: 'imparator', ifade: 'kararli', poz: 'isaret' });
      s += etiketPop('Kilise gümüşleri eritiliyor', 960, 160, lt, .3, { fs: 44 });
      s += etiketPop('Asker maaşı', 1650, 400, lt, 2.8, { fs: 38, bg: '#DDF2C4' });
      return s;
    }],
    [t2, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#9CC3CF"/>`;
      s += `<path d="M0,0 L700,0 L760,300 L620,600 L700,1080 L0,1080 Z" fill="#EAD9B0" stroke="#7A5A2A" stroke-width="6"/>`;
      s += `<path d="M1500,0 L1920,0 L1920,1080 L1460,1080 L1540,700 L1420,400 Z" fill="#EAD9B0" stroke="#7A5A2A" stroke-width="6"/>`;
      s += yazi('BATI', 330, 500, { fs: 64, renk: '#5A3A1C', font: 'baslik' }) + yazi('KONSTANTİNOPOLİS', 1680, 520, { fs: 30, renk: '#5A3A1C', font: 'baslik' });
      s += `<circle cx="1520" cy="560" r="20" fill="#5B1F6E" stroke="#E2B54B" stroke-width="5"/>`;
      s += ok(1460, 420, 820, 300, ap(lt, .2, .8), { renk: '#5B1F6E' });
      s += parsomen(1150, 260, .3) + parsomen(1000, 300, .25);
      // birkaç gemi
      for (let i = 0; i < 3; i++) { const k = ap(lt, 1 + i * .3, 4, easeIO); s += gemi(lerp(800, 1300, k), 720 + i * 90, .35, { t: lt, faz: i, yelken: '#F2E6CC' }); }
      s += etiketPop('Gelen yardım: birkaç gemi, bir avuç asker', 960, 980, lt, 1.8, { fs: 40, bg: '#FFE9B0' });
      return s;
    }],
  ]);
};

// i04 — teslim teklifi ve cevap
SAHNELER.teklif_mektup = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.6), t2 = B(seg, 2, 7.5), t3 = B(seg, 3, 9.8), t4 = B(seg, 4, 14.6);
  return parca(t, [
    [0, lt => {
      let s = tahtOdasi(lt);
      s += karakter({ x: 1400, y: 1010, s: .95, t: lt, rol: 'yeniceri', ifade: 'normal', poz: 'sun', yon: -1 });
      const k = ap(lt, .4, 1.2, easeIO);
      s += G(tr(lerp(1290, 760, k), 820, .9), parsomen(0, 0, .25) + muhur(0, 40, .45));
      s += karakter({ x: 560, y: 1010, s: 1.0, t: lt, rol: 'imparator', ifade: 'endise', poz: 'tut' });
      if (lt > t1 - .2) {
        const kk = ap(lt, t1 - .2, .5, easeBack);
        let pn = `<rect x="-560" y="-210" width="1120" height="420" rx="24" fill="#F4E6C4" stroke="#7A5A2A" stroke-width="8"/>`;
        pn += yazi("SULTAN'IN TEKLİFİ", 0, -150, { fs: 46, renk: '#5A3A1C', font: 'baslik' });
        pn += `<circle cx="-330" cy="20" r="80" fill="#5B1F6E" stroke="${OUT}" stroke-width="5"/>` + yazi('Şehri', -330, 5, { fs: 34, renk: '#fff' }) + yazi('teslim et', -330, 45, { fs: 28, renk: '#fff' });
        pn += ok(-220, 20, 160, 20, ap(lt, t1 + .4, .6), { renk: '#3FAE5A' });
        pn += sandik(-30, 110, .6, 1);
        pn += `<circle cx="330" cy="20" r="80" fill="#3FAE5A" stroke="${OUT}" stroke-width="5"/>` + yazi('Mora', 330, 5, { fs: 38, renk: '#fff' }) + yazi('hüküm sür', 330, 45, { fs: 26, renk: '#fff' });
        s += G(tr(960, 330, kk), pn);
      }
      return s;
    }],
    [t2, lt => {
      let s = `<rect width="${W}" height="${H}" fill="#24183A"/>`;
      for (let i = 0; i < 14; i++) s += `<path d="M960,1080 L${960 + Math.cos(Math.PI + i / 13 * Math.PI) * 1600},${1080 + Math.sin(Math.PI + i / 13 * Math.PI) * 1600} L${960 + Math.cos(Math.PI + (i + .5) / 13 * Math.PI) * 1600},${1080 + Math.sin(Math.PI + (i + .5) / 13 * Math.PI) * 1600} Z" fill="#5B1F6E" opacity=".3"/>`;
      s += karakter({ x: 960, y: 1180, s: 1.35, t: lt, rol: 'imparator', ifade: 'kararli', poz: 'bel' });
      s += alinti(['Bu şehri teslim etmek, ne bana', 'ne de burada yaşayan herhangi birine düşer.'], 960, 220, ap(lt, t3 - t2 - .1, .6), { fs: 46, w: 1400 });
      s += alinti(['Hepimiz, kendi isteğimizle', 'ölmeye karar verdik.'], 960, 470, ap(lt, t4 - t2 - .1, .6), { fs: 46, w: 1000, kaynak: '— Dukas’ın aktarımıyla' });
      return s;
    }],
  ]);
};

// i05 — son ayin
SAHNELER.son_ayin = (t, d, p, seg) => {
  const t1 = B(seg, 1, 4.0), t2 = B(seg, 2, 9.7);
  let s = ayasofyaIc(t, { isik: '#C98A3A', orta: '#6B4018', koyu: '#1A0E06', kubbe: '#8A6A3A', pencere: '#3A2A4A', kemer: '#2A1A0A', taban: '#3A2E22', huzme: false });
  s += `<rect width="${W}" height="${H}" fill="#0A0620" opacity=".35"/>`;
  for (let i = 0; i < 26; i++) { const x = 60 + i * 72, y = 860 + (i % 3) * 20; s += `<rect x="${x - 6}" y="${y}" width="12" height="44" fill="#F2E6CC"/>` + ates(x, y + 2, .14, t + i) + `<circle cx="${x}" cy="${y - 10}" r="40" fill="#FFB547" opacity=".1"/>`; }
  s += karakter({ x: 380, y: 1060, s: .7, t, rol: 'kesis', ifade: 'normal', poz: 'dua', faz: 1 });
  s += karakter({ x: 600, y: 1060, s: .7, t, rol: 'kardinal', ifade: 'normal', poz: 'dua', faz: 2, renkler: { sapka: null } });
  s += karakter({ x: 1320, y: 1060, s: .7, t, rol: 'kesis', ifade: 'uzgun', poz: 'dua', faz: 3, renkler: { sakal: '#5A4A3A' } });
  s += karakter({ x: 1540, y: 1060, s: .7, t, rol: 'kardinal', ifade: 'uzgun', poz: 'dua', faz: 4, renkler: { sapka: null } });
  s += karakter({ x: 960, y: 1060, s: .95, t, rol: 'imparator', ifade: t > t2 ? 'uzgun' : 'normal', poz: t > t2 ? 'dua' : 'yan', kafaEgim: t > t2 ? 14 : 0 });
  s += baslikSerit('28 MAYIS 1453 — SON AYİN', 960, 110, ap(t, .3, .5), { fs: 50 });
  s += etiketPop('Ortodoks + Katolik yan yana', 960, 240, t, t1, { fs: 40 });
  s += etiketPop('Helallik', 960, 560, t, t2, { fs: 44, bg: '#FFE9B0' });
  return s;
};

// i06 — son hücum
SAHNELER.son_hucum = (t, d, p, seg) => {
  const t1 = B(seg, 1, 10.3);
  let s = gok('safak') + gunes(1500, 720, 80, '#FFB08A');
  s += burcSiralari(-50, 300, 2100, 520, { dw: 60, seed: 50 });
  s += gedik(1150, 300, 600, 420);
  s += zemin(820, '#5E5040', { cizgi: true });
  for (let i = 0; i < 6; i++) s += duman(1100 + i * 140, 600, (t + i * .5) % 3, 0, { sure: 3, renk: '#6A6058', boy: 1.8, seed: i + 20 });
  const tacDus = 2.0, kilicCek = 4.0, kos = 6.0;
  const tacYok = t > tacDus;
  // taç yerde
  if (tacYok) {
    const k = ap(t, tacDus, .8, easeOut);
    s += tacCiz(lerp(700, 560, k), lerp(560, 1000, k) - Math.sin(k * Math.PI) * 120, .55, t);
  }
  const kx = t < kos ? 700 : lerp(700, 1500, ap(t, kos, 3.5, easeIO));
  const sol = 1 - ap(t, kos + 2.2, 1.5);
  s += op(sol, karakter({ x: kx, y: 1000, s: lerp(1.0, .7, ap(t, kos, 3.5)), t, rol: 'imparator', renkler: tacYok ? { sapka: null, pelerin: null } : {}, ifade: t < tacDus ? 'uzgun' : 'kararli', poz: t > kilicCek ? 'kilic' : 'yan', esya: t > kilicCek ? 'kilic' : null, yuru: t > kos }));
  // yoğun duman örtüsü
  const ort = ap(t, kos + 1.5, 2.5);
  s += `<rect width="${W}" height="${H}" fill="#8A8078" opacity="${f(ort * .5 * 100) / 100}"/>`;
  for (let i = 0; i < 10; i++) s += `<circle cx="${1100 + (i % 5) * 170}" cy="${700 + Math.floor(i / 5) * 160 + Math.sin(t + i) * 10}" r="${f(150 * ort)}" fill="#A69C92" opacity="${f(ort * .8 * 100) / 100}"/>`;
  if (t > t1) s += tacCiz(560, 1000, .55, t) + etiketPop('...ve bir daha görülmedi', 960, 200, t, t1, { fs: 48 });
  s += etiketPop('Nişanlar çıkarıldı', 400, 200, t, tacDus + .3, { fs: 38 });
  return s;
};

// i07 — Mermer İmparator efsanesi
SAHNELER.mermer_imparator = (t, d, p, seg) => {
  const t1 = B(seg, 1, 3.2), t2 = B(seg, 2, 6.2), t3 = B(seg, 3, 7.6);
  return parca(t, [
    [0, lt => {
      let s = gok('firtina') + zemin(780, '#5E5040', { cizgi: true });
      s += `<rect width="${W}" height="${H}" fill="#C9C2B8" opacity=".55"/>`;
      s += tacCiz(960, 980, .7, lt) + soruIsareti(960, 520, 1.1 * easeBack(ap(lt, .4, .4)));
      s += etiketPop('Cesedi kesin olarak bulunamadı', 960, 180, lt, .6, { fs: 44 });
      return s;
    }],
    [t1, lt => {
      const id = 'mermerF';
      let s = `<defs><filter id="${id}"><feColorMatrix type="matrix" values="0.28 0.5 0.12 0 0.32  0.28 0.5 0.12 0 0.32  0.28 0.5 0.12 0 0.36  0 0 0 1 0"/></filter></defs>`;
      s += gok('mistik') + yildizlar(lt, 70, 12, 520);
      // yer kesiti ve mağara
      s += `<rect x="-100" y="640" width="${W + 200}" height="500" fill="#2A2048"/><line x1="-100" y1="640" x2="${W + 100}" y2="640" stroke="${OUT}" stroke-width="6"/>`;
      s += `<ellipse cx="960" cy="900" rx="360" ry="150" fill="#120C2A" stroke="#5A4A8A" stroke-width="6"/><ellipse cx="960" cy="900" rx="300" ry="110" fill="#3F5BA8" opacity=".25"/>`;
      // Altın Kapı (zafer takı)
      let k = `<rect x="-420" y="-380" width="840" height="380" fill="#E8DDC4" stroke="${OUT}" stroke-width="6"/>`;
      [[-280, 100], [0, 150], [280, 100]].forEach(([x, w]) => k += `<path d="M${x - w / 2},0 L${x - w / 2},${-220 - w * .3} A${w / 2},${w / 2} 0 0 1 ${x + w / 2},${-220 - w * .3} L${x + w / 2},0 Z" fill="#1A1438" stroke="${OUT}" stroke-width="5"/>`);
      k += `<rect x="-440" y="-400" width="880" height="34" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/>`;
      [-420, -150, 150, 420].forEach(x => k += `<rect x="${x - 40}" y="-470" width="80" height="470" fill="#D9CDB0" stroke="${OUT}" stroke-width="5"/>`);
      s += G(tr(960, 640, .85), k);
      s += etiketPop('Altın Kapı', 1540, 420, lt, .3, { fs: 38 });
      // melek ve mermerleşme
      const ts = t3 - t1;
      if (lt > ts - .5) s += melek(1300, lerp(-100, 420, ap(lt, ts - .5, 1.5, easeOut)), .6, lt, { op: .9 * (1 - ap(lt, ts + 5, 1)) });
      const mer = ap(lt, ts + 1.2, 1.4);
      const iner = ap(lt, ts + 3.0, 2.2, easeIO);
      const ky = lerp(640, 960, iner);
      const imp = karakter({ x: 960, y: ky, s: .7, t: lt, rol: 'imparator', renkler: { sapka: null, pelerin: null }, ifade: mer > .5 ? 'uykulu' : 'kararli', poz: mer > .5 ? 'dua' : 'yan', bob: mer < .5 });
      s += op(1 - mer, imp) + op(mer, `<g filter="url(#${id})">${imp}</g>`);
      if (mer > 0) s += `<ellipse cx="960" cy="${ky - 150}" rx="${f(160 + Math.sin(lt * 3) * 10)}" ry="200" fill="#DDE6FF" opacity="${f(mer * .18 * 100) / 100}"/>`;
      s += baslikSerit('MERMER İMPARATOR', 960, 150, ap(lt, t2 - t1, .6), { fs: 70, bg: '#1D2F6B' });
      if (lt > ts + 5.5) s += etiketPop('Bir gün uyanıp şehri geri alacağına inanılır...', 960, 470, lt, ts + 5.5, { fs: 38, bg: '#DDE6FF' });
      return s;
    }],
  ]);
};

// ===== Sonuç =====
SAHNELER.fatih_giris = (t, d, p, seg) => {
  const t1 = B(seg, 1, 7.7), t2 = B(seg, 2, 12.2);
  return parca(t, [
    [0, lt => {
      let s = gok('gun') + bulutlar(lt, { n: 4 });
      s += burcSiralari(-50, 300, 2100, 520, { dw: 60, seed: 60 });
      s += `<path d="M1180,820 L1180,520 A170,170 0 0 1 1520,520 L1520,820 Z" fill="#9ED0E9" stroke="${OUT}" stroke-width="7"/>`;
      s += zemin(820, '#B8A07A', { cizgi: true });
      const ax = lerp(-300, 1000, ap(lt, 0, t1 - .5, easeOut));
      s += askerSirasi(ax - 900, 1000, 10, 80, lt, { s: 1.5, seed: 8 });
      s += sancakBayrak(ax - 500, 1000, .9, lt) + sancakBayrak(ax - 800, 1000, .8, lt + 1);
      // atlı sultan
      s += karakter({ x: ax + 20, y: 880, s: .7, t: lt * .2, rol: 'sultan', ifade: 'kararli', poz: 'tut', bob: false });
      s += at(ax, 1020, .85, { t: lt, yuru: lt < t1 - .5, renk: '#F2EEE6', eyer: '#9A1A2A' });
      s += baslikSerit('SULTAN II. MEHMED', 960, 110, ap(lt, .5, .5), { fs: 52 });
      s += etiketPop('21 yaşında', 960, 210, lt, 1.2, { fs: 40, bg: '#FFE9B0' });
      return s;
    }],
    [t1 - .1, lt => {
      let s = gok('aksam') + bulutlar(lt, { n: 3, renk: '#F7C9A9', op: .6 });
      // minare yükselir (tek)
      const mk = ap(lt, 1.6, 2.2, easeOut);
      const mh = 520 * mk;
      s += `<rect x="1347" y="${f(880 - mh)}" width="26" height="${f(mh)}" fill="#E9D7B9" stroke="${OUT}" stroke-width="4"/>`;
      if (mk > .9) s += `<path d="M1347,${f(880 - mh)} L1360,${f(810 - mh)} L1373,${f(880 - mh)} Z" fill="#7F8E9C" stroke="${OUT}" stroke-width="4"/>`;
      s += ayasofya(960, 880, 1.15, { hac: false });
      // tepe: haç solar, hilal belirir
      const hk = ap(lt, .6, .8);
      s += op(1 - hk, `<line x1="960" y1="${880 - 362 * 1.15}" x2="960" y2="${880 - 410 * 1.15}" stroke="${OUT}" stroke-width="7"/><line x1="940" y1="${880 - 392 * 1.15}" x2="980" y2="${880 - 392 * 1.15}" stroke="${OUT}" stroke-width="7"/>`);
      s += op(hk, `<line x1="960" y1="${880 - 362 * 1.15}" x2="960" y2="${880 - 400 * 1.15}" stroke="#E2B54B" stroke-width="7"/><path d="M946,${880 - 414 * 1.15} a16,16 0 1 0 20,-9 a11,11 0 1 1 -20,9" fill="#E2B54B" stroke="${OUT}" stroke-width="2"/>`);
      s += zemin(880, '#B8A07A', { cizgi: true });
      s += etiketPop('Ayasofya Camii', 960, 140, lt, .9, { fs: 44 });
      s += etiketPop('(916 yıllık kilise)', 960, 230, lt, 1.4, { fs: 32 });
      if (lt > t2 - t1) {
        const k = ap(lt, t2 - t1, .6, easeBack);
        s += G(tr(960, 560, k), yazi('FATİH', 0, 0, { fs: 220, renk: '#E2B54B', font: 'baslik', kontur: '#3A1A0A', kw: 22, ls: 12 }));
      }
      return s;
    }],
  ]);
};

// bölgesel harita
function bolgeHarita() {
  let s = `<rect width="${W}" height="${H}" fill="#9CC3CF"/>`;
  s += `<polygon points="0,0 1100,0 1100,200 1000,330 930,420 960,470 880,520 700,560 600,640 500,760 420,900 300,1080 0,1080" fill="#EAD9B0" stroke="#7A5A2A" stroke-width="6"/>`;
  s += `<polygon points="985,490 1100,470 1300,420 1500,330 1920,280 1920,1080 500,1080 560,960 700,860 800,720 900,620 980,560" fill="#EAD9B0" stroke="#7A5A2A" stroke-width="6"/>`;
  const L = (txt, x, y, fs, renk) => yazi(txt, x, y, { fs, renk, font: 'baslik' });
  s += L('KARADENİZ', 1450, 150, 44, '#2E5A6A') + L('MARMARA', 800, 640, 30, '#2E5A6A') + L('EGE', 450, 1000, 34, '#2E5A6A');
  s += L('BALKANLAR', 420, 330, 52, '#7A5A2A') + L('ANADOLU', 1420, 760, 56, '#7A5A2A');
  s += `<circle cx="965" cy="482" r="26" fill="#9A1A2A" stroke="${OUT}" stroke-width="5"/>` + L('İSTANBUL', 965, 420, 34, '#5A1A1A');
  return s;
}
SAHNELER.yeniden_iskan = (t, d, p, seg) => {
  const t1 = B(seg, 1, 1.4), t2 = B(seg, 2, 4.6), t3 = B(seg, 3, 10.3);
  let s = bolgeHarita();
  const gruplar = [
    { ad: 'Türkler', x: 1640, y: 520, renk: '#F2EEE6', g: '#B3262E' },
    { ad: 'Rumlar', x: 380, y: 520, renk: '#2E3E6E', g: '#2E3E6E' },
    { ad: 'Ermeniler', x: 1280, y: 900, renk: '#6A3A2A', g: '#8A4A2A' },
    { ad: 'Yahudiler', x: 560, y: 860, renk: '#3A5A8A', g: '#5A7A9A' },
  ];
  gruplar.forEach((gr, i) => {
    const t0 = t2 + i * 1.1;
    s += ok(gr.x, gr.y, lerp(gr.x, 965, .82), lerp(gr.y, 482, .82), ap(t, t0, 1.0, easeIO), { renk: gr.g, w: 12 });
    if (t > t0) {
      for (let j = 0; j < 3; j++) s += piktogram(gr.x - 60 + j * 60, gr.y + 70, 1.1 * easeBack(ap(t, t0, .4)), gr.g);
      s += etiketPop(gr.ad, gr.x, gr.y + 120, t, t0 + .2, { fs: 34 });
    }
  });
  s += baslikSerit('ŞEHİR YENİDEN DOLUYOR', 960, 90, ap(t, t1, .5), { fs: 50 });
  if (t > t3 - .2) {
    s += `<rect x="1300" y="${H - 420}" width="640" height="440" fill="rgba(20,24,48,.0)"/>`;
    s += karakter({ x: 1790, y: 1070, s: .7, t, rol: 'sivil', ifade: 'mutlu', poz: 'tut', esya: 'parsomen', yon: -1, renkler: { govde: '#2E6B4A', kol: '#2E6B4A' } });
    s += balon(['Kaçanlar,', 'evinize dönün!'], 1640, 640, { fs: 40, k: ap(t, t3, .4), kuyruk: 110 });
  }
  return s;
};

SAHNELER.istanbul_buyur = (t, d, p, seg) => {
  const t1 = B(seg, 1, 6.3), t2 = B(seg, 2, 8.6);
  const k = ap(t, .4, 5.4, easeIO);
  let s = gok('aksam') + gunes(1600, 640, 90, '#FFD9A0') + bulutlar(t, { n: 3, renk: '#F7C9A9', op: .6 });
  // büyüyen şehir
  const r = rng(91);
  let evler = '';
  const n = Math.floor(10 + k * 60);
  for (let i = 0; i < 70; i++) { const x = r() * 2000 - 40, y = 760 + r() * 120, sc = .5 + r() * .5; if (i < n) evler += ev(x, y, sc, ['#E3C9A3', '#D9B58C', '#EAD6B8'][i % 3], ['#B5583C', '#C2694A', '#A04A34'][i % 3]); }
  const camiler = [[400, .6], [1450, .55], [760, .5], [1750, .45]];
  camiler.forEach(([x, sc], i) => { if (k > .25 + i * .18) s += G(tr(x, 760, sc * easeOut(clamp((k - .25 - i * .18) * 5))), ayasofya(0, 0, 1, { minare: true, renk: '#E8DDC4', kubbe: '#8A98A6' })); });
  s += ayasofya(1060, 780, .6, { minare: true });
  s += evler;
  s += deniz(900, t, { n: 16 });
  let pn = `<rect x="-330" y="-110" width="660" height="220" rx="26" fill="rgba(20,24,48,.88)" stroke="#E2B54B" stroke-width="6"/>`;
  pn += yazi(k < .5 ? '1453' : '~1550', 0, -64, { fs: 34, renk: '#E2B54B', fw: 900 });
  pn += yazi(sayi(Math.round(lerp(40000, 400000, k) / 1000) * 1000) + (k > .99 ? '+' : ''), 0, 20, { fs: 84, renk: '#FFF4DC', font: 'baslik' });
  s += op(1 - ap(t, t2 - .2, .4), G(tr(960, 200), pn));
  if (t > t1) s += op(ap(t, t1, .5) * (1 - ap(t, t2 - .2, .3)), yazi('Halk arasındaki adı...', 960, 420, { fs: 56, renk: '#FFF4DC', kontur: OUT, kw: 10 }));
  if (t > t2) {
    const kk = ap(t, t2, .7, easeBack);
    s += G(tr(960, 400, kk), yazi('İSTANBUL', 0, 0, { fs: 200, renk: '#E2B54B', font: 'baslik', kontur: '#3A1A0A', kw: 20, ls: 10 }));
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + t, rr = 520 + Math.sin(t * 3 + i) * 30; s += `<circle cx="${f(960 + Math.cos(a) * rr)}" cy="${f(400 + Math.sin(a) * rr * .35)}" r="8" fill="#FFF3C4" opacity=".8"/>`; }
  }
  return s;
};

SAHNELER.ozet_tablo = (t, d, p, seg) => {
  const t1 = B(seg, 1, 5.9), t2 = B(seg, 2, 7.5), t3 = B(seg, 3, 9.2), t4 = B(seg, 4, 11.0);
  let s = `<rect width="${W}" height="${H}" fill="#141A3A"/>`;
  for (let x = 0; x < W + 120; x += 120) for (let y = 0; y < H + 120; y += 120) s += `<path d="M${x},${y - 30} L${x + 30},${y} L${x},${y + 30} L${x - 30},${y} Z" fill="none" stroke="#222A55" stroke-width="4"/>`;
  s += baslikSerit('KİM OLDUĞUN = KADERİN', 960, 100, ap(t, .3, .5), { fs: 56 });
  const liste = [
    ['balikci', 'Balıkçı', 'Eve dönüş?', '#E8A33A', t3],
    ['kesis', 'Keşiş', 'Yeni düzen', '#E8A33A', t2],
    ['asker', 'Sur askeri', 'Ölüm / esaret', '#D9432F', 1.2],
    ['tuccar', 'Tüccar', 'Kaçabildi', '#3FAE5A', t1],
    ['soylu', 'Soylu', 'İdam', '#D9432F', 1.8],
    ['imparator', 'İmparator', 'Tek son', '#7A1018', t4],
  ];
  liste.forEach(([rol, ad, sonuc, renk, ta], i) => {
    const x = 180 + i * 312;
    const spot = t > t4 ? (rol === 'imparator' ? 1 : .35) : 1;
    let g = `<rect x="${x - 120}" y="780" width="240" height="60" rx="10" fill="#2A3366" stroke="#E2B54B" stroke-width="4"/>` + yazi(ad, x, 812, { fs: 32, renk: '#FFF4DC' });
    g += karakter({ x, y: 780, s: .6, t, faz: i, rol, ifade: t > ta ? (renk === '#3FAE5A' ? 'mutlu' : (renk === '#E8A33A' ? 'normal' : 'uzgun')) : 'normal', esya: rol === 'asker' ? 'mizrak' : null });
    if (t > ta) g += G(tr(x, 930, easeBack(ap(t, ta, .4))), `<rect x="-130" y="-38" width="260" height="76" rx="38" fill="${renk}" stroke="${OUT}" stroke-width="5"/>` + yazi(sonuc, 0, 3, { fs: 32, renk: '#fff' }));
    s += op(spot, g);
  });
  if (t > t4) s += `<ellipse cx="${180 + 5 * 312}" cy="700" rx="200" ry="420" fill="#FFF3C4" opacity=".12"/>`;
  return s;
};

SAHNELER.kapanis_abone = (t, d, p, seg) => {
  const t1 = B(seg, 1, 2.0), t2 = B(seg, 2, 3.2), t4 = B(seg, 4, 10.9);
  let s = altinZemin({ c1: '#FBE3A6', c2: '#E8A85A', c3: '#8A4A22' });
  for (let i = 0; i < 16; i++) s += `<path d="M960,600 L${960 + Math.cos(i / 16 * 6.283 + t * .1) * 1600},${600 + Math.sin(i / 16 * 6.283 + t * .1) * 1600} L${960 + Math.cos((i + .5) / 16 * 6.283 + t * .1) * 1600},${600 + Math.sin((i + .5) / 16 * 6.283 + t * .1) * 1600} Z" fill="#FFF3D0" opacity=".14"/>`;
  const cx = t < t2 ? 960 : lerp(960, 520, ap(t, t2, .7, easeIO));
  // dönen şapkalar
  if (t < t2 + .5) for (let i = 0; i < 6; i++) {
    const a = i / 6 * 6.283 + t * .8;
    s += op(1 - ap(t, t2, .5), `<g transform="translate(${f(cx + Math.cos(a) * 360)},${f(560 + Math.sin(a) * 200)}) scale(.38) translate(0,330)">${sapkaCiz(RUTBE_SAPKA[i], null, t)}</g>`);
  }
  s += karakter({ x: cx, y: 1000, s: 1.05, t, rol: 'sivil', ifade: t > t4 ? 'mutlu' : 'saskin', poz: t > t4 ? 'salla' : (t < t2 ? 'yan' : 'isaret'), bak: t > t2 ? 1 : 0 });
  s += balon(['Sen hangisi olmak isterdin?'], 960, 160, { fs: 46, k: ap(t, .2, .4) * (1 - ap(t, t2 - .2, .3)), kuyruk: 0 });
  if (t > t1 && t < t2 + .2) s += etiketPop('Yorumlara yaz!', 1500, 420, t, t1, { fs: 42, bg: '#DDF2C4' });
  if (t > t2) {
    const k = ap(t, t2 + .2, .6, easeBack);
    let pn = `<rect x="-420" y="-330" width="840" height="660" rx="30" fill="#141A3A" stroke="#E2B54B" stroke-width="8"/>`;
    pn += yazi('SIRADAKİ BÖLÜM', 0, -270, { fs: 44, renk: '#E2B54B', font: 'baslik' });
    pn += sur(-400, -60, 800, 120, { kuleAra: 300, kw: 80, kuleFark: 50, seed: 2 });
    pn += karakter({ x: 0, y: 200, s: .8, t, rol: 'yeniceri', ifade: 'kararli', poz: 'kilic', esya: 'kilic' });
    pn += yazi("1453'te bir Osmanlı", 0, 250, { fs: 40, renk: '#FFF4DC', fw: 900 }) + yazi('askeri olsaydın?', 0, 300, { fs: 40, renk: '#FFF4DC', fw: 900 });
    s += G(tr(1340, 470, k * .95), pn);
  }
  if (t > t4 - .3) {
    const tik = t4 + 1.2;
    const abone = t > tik;
    const cx2 = lerp(1500, 1080, ap(t, t4, 1.0, easeIO)), cy2 = lerp(1080, 1000, ap(t, t4, 1.0, easeIO));
    let b = `<rect x="-230" y="-60" width="460" height="120" rx="60" fill="${abone ? '#5A5A64' : '#D9241C'}" stroke="${OUT}" stroke-width="6"/>` + yazi(abone ? 'ABONE OLUNDU' : 'ABONE OL', -20, 4, { fs: abone ? 42 : 52, renk: '#fff', fw: 900 });
    b += G(tr(180, 0, 1, abone ? Math.sin(t * 18) * 18 * (1 - ap(t, tik, 1.2)) : 0), `<path d="M-22,14 Q-22,-26 0,-28 Q22,-26 22,14 L28,20 L-28,20 Z" fill="#FFD25A" stroke="${OUT}" stroke-width="4"/><circle cy="26" r="6" fill="#FFD25A" stroke="${OUT}" stroke-width="3"/>`);
    const bs = 1 - (t > tik && t < tik + .15 ? .08 : 0);
    s += G(tr(960, 1000 - 0, easeBack(ap(t, t4 - .3, .5)) * bs), b);
    s += G(tr(cx2, cy2), `<path d="M0,0 L0,64 L16,50 L28,78 L40,72 L28,46 L48,46 Z" fill="#fff" stroke="${OUT}" stroke-width="4"/>`);
  }
  return s;
};
