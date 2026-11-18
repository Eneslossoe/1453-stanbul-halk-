// ===== Özgün karakterimiz ve figürler =====
// Ayak ortası (0,0); ölçek 1'de boy ~400px. Büyük yuvarlak kafa, kulaklar, al yanaklar, tepede kıvrık perçem.

const TEN = '#F3C79A', TEN_K = '#E0A878';

const ROLLER = {
  sivil:    { govde: '#C9B79C', etek: -40, kol: '#C9B79C' },
  balikci:  { govde: '#8B6B4A', etek: -40, kol: '#8B6B4A', yama: true, kemer: '#C9A86B', sapka: 'hasir' },
  kesis:    { govde: '#24201F', etek: -6, kol: '#24201F', sapka: 'kalimavki', sakal: '#A8A49C', kenar: '#3D3633' },
  asker:    { govde: '#8D96A0', etek: -40, kol: '#8D96A0', alt: '#A3322B', zirh: true, sapka: 'migfer', pelerin: '#7A1E26' },
  tuccar:   { govde: '#7A1F2B', etek: -6, kol: '#7A1F2B', kurk: '#D9C29A', sapka: 'bareta', kemer: '#3A2418', kese: true },
  soylu:    { govde: '#1F5F6B', etek: -6, kol: '#1F5F6B', altin: true, sapka: 'skiadion', sakal: '#4A3426', kisa: true },
  imparator:{ govde: '#5B1F6E', etek: -6, kol: '#5B1F6E', loros: true, sapka: 'tac', sakal: '#3B2A20', kisa: true, pelerin: '#6E2A82', cizme: '#B5182B' },
  esir:     { govde: '#B8A68A', etek: -40, kol: '#B8A68A', yirtik: true, ip: true },
  yeniceri: { govde: '#2F4A7A', etek: -6, kol: '#2F4A7A', sapka: 'bork', biyik: '#3B2A20', kemer: '#B3262E', ten: '#E8B98C' },
  basibozuk:{ govde: '#7A5A3A', etek: -40, kol: '#9C4A2E', sapka: 'sarik_kucuk', biyik: '#3B2A20', ten: '#E2AE80' },
  sultan:   { govde: '#A3222B', etek: -6, kol: '#A3222B', altin: true, sapka: 'kavuk', sakal: '#4A3426', biyik: '#4A3426', kisa: true, pelerin: '#7A1820' },
  sovalye:  { govde: '#B7C0C9', etek: -40, kol: '#B7C0C9', haclı: true, sapka: 'salet', alt: '#F2EEE6' },
  orban:    { govde: '#6E5238', etek: -40, kol: '#C9B79C', onluk: '#7B5434', sapka: 'kel', biyik: '#5A3A24', ten: '#EDBB8E' },
  patrik:   { govde: '#24201F', etek: -6, kol: '#24201F', sapka: 'kalimavki', sakal: '#EDEAE4', hac: true },
  kardinal: { govde: '#B3262E', etek: -6, kol: '#B3262E', sapka: 'galero' },
  kadin:    { govde: '#6F7FA8', etek: -6, kol: '#6F7FA8', sapka: 'maforion', basortu: '#C9B79C' },
  venedikli:{ govde: '#2E3E6E', etek: -6, kol: '#2E3E6E', sapka: 'bareta', kurk: '#D9C29A' },
};

// göz kırpma: her ~3.7 sn'de 0.13 sn
function kirp(t) { const p = ((t % 3.7) + 3.7) % 3.7; return p < .13 ? Math.sin(p / .13 * Math.PI) : 0; }

const IFADE = {
  normal:  { kas: [0, 0], agiz: 'gulumse' },
  mutlu:   { kas: [-6, 0], agiz: 'kahkaha' },
  endise:  { kas: [-12, 6], agiz: 'dalga', ter: true },
  korku:   { kas: [-18, -2], agiz: 'o_buyuk', ter: true, gozB: 1.12, gozK: .65 },
  kararli: { kas: [10, -6], agiz: 'duz' },
  sinirli: { kas: [14, -8], agiz: 'dis' },
  uzgun:   { kas: [-12, 8], agiz: 'uzgun', gozyasi: true },
  saskin:  { kas: [-18, -14], agiz: 'o', gozB: 1.1, gozK: .8 },
  sirit:   { kas: [-4, -2], agiz: 'sirit' },
  uykulu:  { kas: [2, 2], agiz: 'duz', uyku: true },
};

const POZ = {
  yan:     { L: [-72, -78], R: [72, -78] },
  kaldir:  { L: [-108, -300], R: [108, -300] },
  salla:   { L: [-72, -78], R: [112, -292], sal: true },
  isaret:  { L: [-72, -78], R: [160, -205] },
  dua:     { L: [-16, -150], R: [16, -150] },
  tasi:    { L: [-62, -398], R: [62, -398] },
  tut:     { L: [-46, -118], R: [46, -118] },
  kilic:   { L: [-72, -78], R: [96, -236] },
  bel:     { L: [-58, -100], R: [58, -100], dirsek: 46 },
  gerin:   { L: [-120, -330], R: [120, -330] },
  bagli:   { L: [-12, -120], R: [12, -120] },
  ac:      { L: [-150, -190], R: [150, -190] },
  sun:     { L: [-40, -150], R: [70, -170] },
};

function agizCiz(tip, t) {
  switch (tip) {
    case 'kahkaha': return `<path d="M-30,-224 Q0,-224 30,-224 Q28,-186 0,-184 Q-28,-186 -30,-224 Z" fill="#7A2A2A" stroke="${OUT}" stroke-width="4"/><path d="M-16,-196 Q0,-206 16,-196 Q8,-186 0,-186 Q-8,-186 -16,-196Z" fill="#E86A6A"/>`;
    case 'dalga': return `<path d="M-24,-212 q8,-8 16,0 t16,0 t16,0" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
    case 'o_buyuk': return `<ellipse cx="0" cy="-206" rx="16" ry="${20 + Math.sin(t * 20) * 2}" fill="#5A1E1E" stroke="${OUT}" stroke-width="4"/>`;
    case 'o': return `<ellipse cx="0" cy="-208" rx="11" ry="13" fill="#5A1E1E" stroke="${OUT}" stroke-width="4"/>`;
    case 'duz': return `<line x1="-20" y1="-210" x2="20" y2="-210" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
    case 'dis': return `<path d="M-26,-204 Q0,-222 26,-204 L22,-196 Q0,-210 -22,-196 Z" fill="#fff" stroke="${OUT}" stroke-width="4"/>`;
    case 'uzgun': return `<path d="M-22,-200 Q0,-220 22,-200" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
    case 'sirit': return `<path d="M-30,-218 Q0,-196 30,-222" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
    default: return `<path d="M-20,-218 Q0,-202 20,-218" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
  }
}

function sapkaCiz(tip, r, t) {
  switch (tip) {
    case 'hasir': return `<path d="M-150,-318 Q0,-350 150,-318 Q0,-300 -150,-318 Z" fill="#D9B76A" stroke="${OUT}" stroke-width="5"/><path d="M-70,-322 Q-60,-398 0,-404 Q60,-398 70,-322 Z" fill="#D9B76A" stroke="${OUT}" stroke-width="5"/><path d="M-66,-336 Q0,-346 66,-336" fill="none" stroke="#9C7A3A" stroke-width="7"/>`;
    case 'kalimavki': return `<path d="M-84,-318 L-78,-402 L78,-402 L84,-318 Z" fill="#1A1716" stroke="${OUT}" stroke-width="5"/><rect x="-92" y="-410" width="184" height="14" rx="6" fill="#1A1716" stroke="${OUT}" stroke-width="4"/><path d="M84,-330 Q118,-250 104,-170 L88,-200 Q96,-260 76,-320 Z" fill="#1A1716" stroke="${OUT}" stroke-width="4"/>`;
    case 'migfer': return `<path d="M-96,-292 Q-100,-380 0,-410 Q100,-380 96,-292 Z" fill="#9AA3AD" stroke="${OUT}" stroke-width="5"/><rect x="-100" y="-300" width="200" height="18" rx="8" fill="#7D8792" stroke="${OUT}" stroke-width="4"/><rect x="-6" y="-292" width="12" height="54" rx="5" fill="#7D8792" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="-412" r="8" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`;
    case 'bareta': return `<path d="M-90,-316 Q-96,-392 -10,-400 Q86,-398 92,-316 Z" fill="#1E1E24" stroke="${OUT}" stroke-width="5"/><rect x="-96" y="-326" width="192" height="20" rx="9" fill="#2C2C34" stroke="${OUT}" stroke-width="4"/>`;
    case 'skiadion': return `<path d="M-130,-318 Q0,-338 130,-318 Q0,-304 -130,-318 Z" fill="#4A2058" stroke="${OUT}" stroke-width="5"/><path d="M-70,-322 Q-84,-470 0,-478 Q84,-470 70,-322 Z" fill="#5B2A6E" stroke="${OUT}" stroke-width="5"/><path d="M-72,-340 Q0,-352 72,-340" fill="none" stroke="#E2B54B" stroke-width="9"/><circle cx="0" cy="-480" r="9" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`;
    case 'tac': return `<path d="M-82,-318 L-86,-392 Q0,-430 86,-392 L82,-318 Z" fill="#E2B54B" stroke="${OUT}" stroke-width="5"/>` +
      `<path d="M-84,-340 L84,-340" stroke="#B88A2A" stroke-width="6"/>` +
      [-56, -20, 20, 56].map((x, i) => `<circle cx="${x}" cy="${-370 - (i % 2) * 6}" r="9" fill="${i % 2 ? '#2E7D5B' : '#B3262E'}" stroke="${OUT}" stroke-width="3"/>`).join('') +
      `<line x1="0" y1="-418" x2="0" y2="-458" stroke="#E2B54B" stroke-width="9"/><line x1="-16" y1="-442" x2="16" y2="-442" stroke="#E2B54B" stroke-width="9"/>` +
      // pendilia (inci sarkıtlar)
      [-88, 88].map(x => `<line x1="${x}" y1="-330" x2="${x * 1.02}" y2="${-250 + Math.sin(t * 3) * 3}" stroke="#F4F0E6" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/>`).join('');
    case 'bork': return `<path d="M-74,-318 Q-80,-470 0,-486 Q60,-470 66,-318 Z" fill="#F2EEE6" stroke="${OUT}" stroke-width="5"/>` +
      `<path d="M50,-440 Q120,-400 128,-250 Q104,-260 92,-300 Q80,-380 40,-420 Z" fill="#E8E2D6" stroke="${OUT}" stroke-width="4"/>` +
      `<rect x="-80" y="-336" width="160" height="22" rx="8" fill="#E2B54B" stroke="${OUT}" stroke-width="4"/><path d="M-14,-336 L0,-372 L14,-336 Z" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`;
    case 'sarik_kucuk': return `<path d="M-96,-306 Q-100,-380 0,-394 Q100,-380 96,-306 Q0,-330 -96,-306 Z" fill="#E3D7BF" stroke="${OUT}" stroke-width="5"/><path d="M-90,-330 Q0,-360 90,-330" fill="none" stroke="#B8A888" stroke-width="5"/>`;
    case 'kavuk': return `<ellipse cx="0" cy="-352" rx="128" ry="70" fill="#F7F3EA" stroke="${OUT}" stroke-width="5"/>` +
      `<path d="M-118,-340 Q0,-300 118,-340 M-122,-364 Q0,-330 122,-366 M-110,-388 Q0,-360 110,-392" fill="none" stroke="#D9D2C2" stroke-width="5"/>` +
      `<path d="M-40,-410 Q0,-460 40,-410 Z" fill="#B3262E" stroke="${OUT}" stroke-width="4"/>` +
      `<path d="M30,-404 Q60,-470 40,-500 Q72,-470 52,-404 Z" fill="#F7F3EA" stroke="${OUT}" stroke-width="3"/><circle cx="38" cy="-410" r="9" fill="#2E7D5B" stroke="${OUT}" stroke-width="3"/>`;
    case 'salet': return `<path d="M-100,-290 Q-104,-392 0,-410 Q104,-392 100,-290 L120,-280 L-120,-280 Z" fill="#B7C0C9" stroke="${OUT}" stroke-width="5"/><path d="M-96,-300 L96,-300" stroke="#8D96A0" stroke-width="6"/><path d="M0,-410 Q30,-470 70,-450" fill="none" stroke="#B3262E" stroke-width="12" stroke-linecap="round"/>`;
    case 'galero': return `<ellipse cx="0" cy="-330" rx="160" ry="26" fill="#B3262E" stroke="${OUT}" stroke-width="5"/><path d="M-80,-336 Q-80,-400 0,-404 Q80,-400 80,-336 Z" fill="#B3262E" stroke="${OUT}" stroke-width="5"/><path d="M-130,-320 Q-150,-220 -140,-150 M130,-320 Q150,-220 140,-150" fill="none" stroke="#B3262E" stroke-width="7"/>`;
    case 'maforion': return `<path d="M-112,-200 Q-120,-380 0,-384 Q120,-380 112,-200 L96,-170 Q100,-290 0,-300 Q-100,-290 -96,-170 Z" fill="#6E2A3A" stroke="${OUT}" stroke-width="5"/>`;
    case 'kel': return `<ellipse cx="0" cy="-350" rx="40" ry="12" fill="#fff" opacity=".35"/>`;
    default: return '';
  }
}

function kolCiz(sx, sy, hx, hy, renk, dir, poz, tenRenk) {
  // dirsek dışarı doğru bükülsün
  const mx = (sx + hx) / 2 + (sx < 0 ? -1 : 1) * (dir || 22), my = (sy + hy) / 2 + 10;
  const d = `M${sx},${sy} Q${f(mx)},${f(my)} ${f(hx)},${f(hy)}`;
  return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="36" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${renk}" stroke-width="27" stroke-linecap="round"/>` +
    `<circle cx="${f(hx)}" cy="${f(hy)}" r="16" fill="${tenRenk}" stroke="${OUT}" stroke-width="4"/>`;
}

function karakter(o) {
  const t = o.t || 0, faz = o.faz || 0;
  const R = Object.assign({}, ROLLER[o.rol || 'sivil'], o.renkler || {});
  const ten = o.ten || R.ten || TEN;
  const ifade = IFADE[o.ifade || 'normal'] || IFADE.normal;
  const poz = POZ[o.poz || 'yan'] || POZ.yan;
  const bob = o.bob === false ? 0 : Math.sin(t * 2.4 + faz) * 4 + (o.zipla ? -Math.abs(Math.sin(t * 6 + faz)) * 26 : 0);
  const titre = o.titre ? Math.sin(t * 40) * 2.5 : 0;
  const kirpma = (ifade.uyku ? .75 : 0) + kirp(t + faz * 1.7) * (ifade.uyku ? .25 : 1);
  const bak = o.bak || 0;
  let s = '';

  // pelerin (arkada)
  if (R.pelerin) s += `<path d="M-50,-170 Q-110,-90 -96,-4 L96,-4 Q110,-90 50,-170 Z" fill="${R.pelerin}" stroke="${OUT}" stroke-width="5"/>`;
  if (o.arka) s += o.arka;
  // bacaklar / ayakkabı
  const cizme = R.cizme || '#4A3324';
  if (R.etek > -20) {
    s += `<ellipse cx="-26" cy="-6" rx="26" ry="12" fill="${cizme}" stroke="${OUT}" stroke-width="4"/><ellipse cx="26" cy="-6" rx="26" ry="12" fill="${cizme}" stroke="${OUT}" stroke-width="4"/>`;
  } else {
    const yur = o.yuru ? Math.sin(t * 9 + faz) * 14 : 0;
    s += `<rect x="${-34 + yur}" y="-52" width="24" height="48" rx="10" fill="${R.alt || '#5A4632'}" stroke="${OUT}" stroke-width="4"/>` +
      `<rect x="${10 - yur}" y="-52" width="24" height="48" rx="10" fill="${R.alt || '#5A4632'}" stroke="${OUT}" stroke-width="4"/>` +
      `<ellipse cx="${-24 + yur}" cy="-6" rx="22" ry="11" fill="${o.yalinayak ? ten : cizme}" stroke="${OUT}" stroke-width="4"/><ellipse cx="${24 - yur}" cy="-6" rx="22" ry="11" fill="${o.yalinayak ? ten : cizme}" stroke="${OUT}" stroke-width="4"/>`;
  }
  // gövde
  const hem = R.etek;
  s += `<path d="M-50,-176 Q-58,-120 ${R.etek > -20 ? -74 : -64},${hem} L${R.etek > -20 ? 74 : 64},${hem} Q58,-120 50,-176 Q0,-190 -50,-176 Z" fill="${R.govde}" stroke="${OUT}" stroke-width="5"/>`;
  if (R.alt && R.etek <= -20) s += `<path d="M-60,-74 L-64,${hem} L64,${hem} L60,-74 Z" fill="${R.alt}" stroke="${OUT}" stroke-width="4"/>`;
  if (R.zirh) for (let y = -160; y < -80; y += 16) s += `<path d="M-52,${y} Q0,${y + 8} 52,${y}" fill="none" stroke="#6E7782" stroke-width="4"/>`;
  if (R.yama) s += `<rect x="-38" y="-120" width="28" height="26" fill="#A7865F" stroke="${OUT}" stroke-width="3" transform="rotate(-8 -24 -107)"/><rect x="16" y="-82" width="26" height="22" fill="#6E5238" stroke="${OUT}" stroke-width="3" transform="rotate(10 29 -71)"/>`;
  if (R.yirtik) s += `<path d="M-64,${hem} l14,-16 l12,16 l14,-14 l12,14 l16,-18 l10,18" fill="none" stroke="${OUT}" stroke-width="4"/>`;
  if (R.kemer) s += `<rect x="-56" y="-100" width="112" height="14" fill="${R.kemer}" stroke="${OUT}" stroke-width="3"/>`;
  if (R.kese) s += `<path d="M30,-88 Q24,-50 44,-46 Q64,-50 58,-88 Z" fill="#8A5A2B" stroke="${OUT}" stroke-width="4"/>`;
  if (R.kurk) s += `<path d="M-54,-178 Q0,-150 54,-178 L50,-150 Q0,-128 -50,-150 Z" fill="${R.kurk}" stroke="${OUT}" stroke-width="4"/>`;
  if (R.altin) {
    s += `<path d="M-6,-170 L-6,${hem}" stroke="#E2B54B" stroke-width="12"/><path d="M${R.etek > -20 ? -72 : -62},${hem - 10} L${R.etek > -20 ? 72 : 62},${hem - 10}" stroke="#E2B54B" stroke-width="10"/>`;
    for (let i = 0; i < 6; i++) s += `<circle cx="${-40 + (i % 3) * 40 + (i > 2 ? 20 : 0)}" cy="${-130 + Math.floor(i / 3) * 50}" r="5" fill="#E2B54B"/>`;
  }
  if (R.loros) {
    s += `<path d="M-50,-170 L40,-60 L40,-40 L-56,-150 Z" fill="#E2B54B" stroke="${OUT}" stroke-width="4"/><path d="M-16,-60 L-16,${hem}" stroke="#E2B54B" stroke-width="26"/>`;
    for (let i = 0; i < 5; i++) s += `<circle cx="${-36 + i * 18}" cy="${-150 + i * 22}" r="5" fill="${i % 2 ? '#B3262E' : '#2E7D5B'}"/>`;
    for (let y = -40; y > hem - 0 - 200 && y < hem; y += 26) s += `<circle cx="-16" cy="${y}" r="5" fill="#B3262E"/>`;
  }
  if (R.haclı) s += `<rect x="-8" y="-168" width="16" height="96" fill="#B3262E"/><rect x="-40" y="-140" width="80" height="16" fill="#B3262E"/>`;
  if (R.onluk) s += `<path d="M-40,-150 L40,-150 L48,-40 L-48,-40 Z" fill="${R.onluk}" stroke="${OUT}" stroke-width="4"/>`;
  if (R.hac) s += `<path d="M-6,-150 h12 v20 h18 v12 h-18 v34 h-12 v-34 h-18 v-12 h18 Z" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`;
  if (R.ip) s += `<path d="M-30,-128 Q0,-110 30,-128 M-30,-114 Q0,-96 30,-114" fill="none" stroke="#C9A86B" stroke-width="7"/>`;

  // kollar
  const sall = poz.sal ? Math.sin(t * 9) * 18 : 0;
  let [lx, ly] = poz.L, [rx, ry] = poz.R;
  if (o.elL) [lx, ly] = o.elL;
  if (o.elR) [rx, ry] = o.elR;
  rx += sall; ry += Math.abs(sall) * .3;
  const kolR = R.kol;
  let kollar = kolCiz(-46, -164, lx, ly, kolR, poz.dirsek, o.poz, ten) + kolCiz(46, -164, rx, ry, kolR, poz.dirsek, o.poz, ten);
  // eldeki eşya (sağ el)
  let esya = '';
  if (o.esya === 'mizrak') esya = `<line x1="${rx}" y1="${ry + 120}" x2="${rx}" y2="${ry - 260}" stroke="#6B4A2E" stroke-width="10"/><path d="M${rx - 14},${ry - 255} L${rx},${ry - 310} L${rx + 14},${ry - 255} Z" fill="#B7C0C9" stroke="${OUT}" stroke-width="4"/>`;
  if (o.esya === 'kilic') esya = `<g transform="translate(${rx},${ry}) rotate(${o.kilicAci || -20})"><rect x="-6" y="-200" width="12" height="190" fill="#D8DEE4" stroke="${OUT}" stroke-width="4"/><rect x="-28" y="-14" width="56" height="12" rx="5" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/><rect x="-6" y="-2" width="12" height="30" fill="#6B4A2E"/></g>`;
  if (o.esya === 'asa') esya = `<line x1="${rx}" y1="${ry + 140}" x2="${rx}" y2="${ry - 200}" stroke="#E2B54B" stroke-width="9"/><path d="M${rx},${ry - 200} q-30,-10 -26,-40" fill="none" stroke="#E2B54B" stroke-width="9"/>`;
  if (o.esya === 'cekic') esya = `<g transform="translate(${rx},${ry}) rotate(${Math.sin(t * 6) * 20 - 30})"><rect x="-5" y="-110" width="10" height="110" fill="#6B4A2E"/><rect x="-30" y="-130" width="60" height="30" rx="4" fill="#6E7782" stroke="${OUT}" stroke-width="4"/></g>`;
  if (o.esya === 'ag') esya = `<path d="M${lx},${ly} Q0,${ly + 70} ${rx},${ry} " fill="rgba(160,140,100,.35)" stroke="#9C8A6A" stroke-width="4"/><path d="M${lx + 20},${ly + 6} L${rx - 20},${ry + 6} M${lx + 10},${ly + 30} L${rx - 10},${ry + 30}" stroke="#9C8A6A" stroke-width="3"/>`;
  if (o.esya === 'tas') esya = tas(0, Math.min(ly, ry) + 6, 1.3);
  if (o.esya === 'ekmek') esya = ekmek(rx, ry - 10, .7);
  if (o.esya === 'balik') esya = balik(rx + 10, ry, .8);
  if (o.esya === 'parsomen') esya = parsomen(rx + 30, ry - 20, .25);
  if (o.esya === 'kese') esya = `<path d="M${rx - 22},${ry - 10} Q${rx - 30},${ry + 44} ${rx},${ry + 48} Q${rx + 30},${ry + 44} ${rx + 22},${ry - 10} Z" fill="#8A5A2B" stroke="${OUT}" stroke-width="4"/>` + sikke(rx, ry - 20, .5);
  if (o.esya === 'ikona') esya = ikona(0, ly - 70, .6);
  if (o.esya === 'mum') esya = `<rect x="${rx - 7}" y="${ry - 60}" width="14" height="56" fill="#F2E6CC" stroke="${OUT}" stroke-width="3"/>` + ates(rx, ry - 58, .2, t);
  if (o.esya === 'kalkan_on') esya = '';
  let kalkan = '';
  if (o.kalkan) kalkan = G(tr(lx - 10, ly - 30), `<circle r="66" fill="#A3322B" stroke="${OUT}" stroke-width="6"/><circle r="56" fill="none" stroke="#E2B54B" stroke-width="6"/><rect x="-7" y="-40" width="14" height="80" fill="#E2B54B"/><rect x="-32" y="-7" width="64" height="14" fill="#E2B54B"/>`);

  // kafa
  let k = '';
  k += `<circle cx="-97" cy="-258" r="18" fill="${ten}" stroke="${OUT}" stroke-width="5"/><circle cx="97" cy="-258" r="18" fill="${ten}" stroke="${OUT}" stroke-width="5"/>`;
  k += `<circle cx="0" cy="-262" r="100" fill="${ten}" stroke="${OUT}" stroke-width="5"/>`;
  if (!R.sapka || R.sapka === 'kel') k += `<path d="M-8,-360 q-6,-30 18,-34 q20,-2 16,18 q-4,12 -16,8" fill="none" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/>`;
  if (R.sapka === 'maforion') k += '';
  // yanaklar
  k += `<circle cx="-62" cy="-226" r="15" fill="#E8776A" opacity=".35"/><circle cx="62" cy="-226" r="15" fill="#E8776A" opacity=".35"/>`;
  // sakal
  if (R.sakal) {
    const uz = R.kisa ? 0 : 1;
    k += `<path d="M-92,-248 Q-96,${-160 + uz * 40} 0,${-140 + uz * 70} Q96,${-160 + uz * 40} 92,-248 Q60,-206 0,-202 Q-60,-206 -92,-248 Z" fill="${R.sakal}" stroke="${OUT}" stroke-width="5"/>`;
  }
  // gözler
  const gb = ifade.gozB || 1, gk = ifade.gozK || 1;
  const ry_ = 25 * gb * (1 - kirpma * .92);
  [-36, 36].forEach(ex => {
    k += `<ellipse cx="${ex}" cy="-276" rx="${21 * gb}" ry="${f(Math.max(1.5, ry_))}" fill="#fff" stroke="${OUT}" stroke-width="4"/>`;
    if (kirpma < .6) k += `<circle cx="${ex + bak * 8}" cy="${-271}" r="${10.5 * gk}" fill="${OUT}"/><circle cx="${ex + bak * 8 + 3}" cy="${-275}" r="${3.2 * gk}" fill="#fff"/>`;
  });
  // kaşlar
  const [di, dd] = ifade.kas;
  k += `<path d="M-16,${-310 + di} Q-36,${-318 + (di + dd) / 2} -58,${-308 + dd}" fill="none" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/>`;
  k += `<path d="M16,${-310 + di} Q36,${-318 + (di + dd) / 2} 58,${-308 + dd}" fill="none" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/>`;
  // burun
  k += `<ellipse cx="0" cy="-242" rx="14" ry="10" fill="${TEN_K}" stroke="${OUT}" stroke-width="3"/>`;
  // bıyık
  if (R.biyik) k += `<path d="M0,-232 Q-28,-238 -46,-214 Q-24,-222 0,-222 Q24,-222 46,-214 Q28,-238 0,-232 Z" fill="${R.biyik}" stroke="${OUT}" stroke-width="3"/>`;
  // ağız
  k += agizCiz(o.agiz || ifade.agiz, t);
  if (ifade.ter) k += `<path d="M88,-320 q10,18 0,26 q-10,-8 0,-26 Z" fill="#8FD0F0" stroke="${OUT}" stroke-width="3" transform="translate(0,${f((t * 30) % 30)})"/>`;
  if (ifade.gozyasi) k += `<ellipse cx="-44" cy="${-246 + ((t * 40) % 50)}" rx="6" ry="9" fill="#8FD0F0" stroke="${OUT}" stroke-width="2"/>`;
  // şapka
  k += sapkaCiz(R.sapka, null, t);
  if (o.ekKafa) k += o.ekKafa;

  const kafaEgim = o.kafaEgim || 0;
  const govdeS = kollar + esya;
  s = s + (o.kolArka ? '' : '') + G(`rotate(${kafaEgim} 0 -170)`, k) + govdeS + kalkan;
  if (o.on) s += o.on;
  const sx = (o.s || 1) * (o.yon || 1), sy = (o.s || 1) * (o.sy || 1);
  return `<g transform="translate(${f((o.x || 0) + titre)},${f((o.y || 0) + bob)}) scale(${sx},${sy}) rotate(${o.egim || 0})">${s}</g>`;
}

// kalabalık: farklı renklerde basit halk
const HALK_RENK = ['#6F7FA8', '#A86F5A', '#7E9A6A', '#B89A5A', '#8A6AA0', '#C9B79C', '#9C5A4A', '#5A7A8A'];
const TENLER = ['#F3C79A', '#E8B98C', '#F6D2AE', '#DDA97E', '#EEC49C'];
function kalabalik(x, y, n, aralik, t, o = {}) {
  const r = rng(o.seed || 44); let s = '';
  const ifadeler = o.ifadeler || ['endise', 'korku', 'normal', 'saskin'];
  for (let i = 0; i < n; i++) {
    const kadin = r() > .55;
    const renk = HALK_RENK[Math.floor(r() * HALK_RENK.length)];
    s += karakter({
      x: x + i * aralik + (r() - .5) * aralik * .5, y: y + (r() - .5) * (o.yd || 20), s: (o.s || .4) * (.85 + r() * .3), t, faz: r() * 6,
      rol: kadin ? 'kadin' : 'sivil', renkler: kadin ? { govde: renk, kol: renk } : { govde: renk, kol: renk },
      ten: TENLER[Math.floor(r() * TENLER.length)], ifade: ifadeler[Math.floor(r() * ifadeler.length)],
      poz: o.poz || (r() > .7 ? 'kaldir' : 'yan'), yon: r() > .5 ? 1 : -1, yuru: o.yuru, zipla: o.zipla,
    });
  }
  return s;
}
