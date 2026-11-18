// ===== Temel yardımcılar =====
const W = 1920, H = 1080;
const OUT = '#2B2118';           // çizgi rengi
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const easeIO = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeBack = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
// a: t0'dan itibaren dur sürede 0->1 (easeOut)
const ap = (t, t0, dur = .5, e = easeOut) => e(clamp((t - t0) / dur));
// keyframe: [[t,v],...] aralarda easeIO
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
      return lerp(v0, v1, easeIO((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}
// deterministik rastgele
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const f = n => (Math.round(n * 10) / 10);
const tr = (x, y, s = 1, r = 0) => `translate(${f(x)},${f(y)})` + (r ? ` rotate(${f(r)})` : '') + (s !== 1 ? ` scale(${s})` : '');
const G = (tf, inner, extra = '') => `<g transform="${tf}" ${extra}>${inner}</g>`;
const op = (o, inner) => o >= .999 ? inner : (o <= 0.001 ? '' : `<g opacity="${f(o * 100) / 100}">${inner}</g>`);
let _gid = 0;
const uid = p => p + (++_gid);

// ===== Metin =====
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function yazi(txt, x, y, o = {}) {
  const fs = o.fs || 48, fam = o.font === 'baslik' ? 'Cinzel' : 'Nunito';
  const fw = o.fw || (o.font === 'baslik' ? 900 : 800);
  const anc = o.anc || 'middle';
  const fill = o.renk || '#fff';
  const st = o.kontur ? `stroke="${o.kontur}" stroke-width="${o.kw || fs * .16}" stroke-linejoin="round" paint-order="stroke"` : '';
  const ls = o.ls ? `letter-spacing="${o.ls}"` : '';
  return `<text x="${f(x)}" y="${f(y)}" font-family="${fam}" font-weight="${fw}" font-size="${fs}" text-anchor="${anc}" fill="${fill}" ${st} ${ls} dominant-baseline="middle">${esc(txt)}</text>`;
}
// yuvarlak etiket
function etiket(txt, x, y, o = {}) {
  const fs = o.fs || 38;
  const w = (o.w || txt.length * fs * .56) + fs * 1.1, h = fs * 1.7;
  const bg = o.bg || '#FFF4DC', fg = o.renk || OUT;
  return G(tr(x, y, o.s || 1, o.r || 0),
    `<rect x="${-w / 2 + 6}" y="${-h / 2 + 8}" width="${w}" height="${h}" rx="${h / 2}" fill="rgba(0,0,0,.25)"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${bg}" stroke="${OUT}" stroke-width="5"/>` +
    yazi(txt, 0, 3, { fs, renk: fg, fw: 900 }));
}
// beliren etiket (pop)
function etiketPop(txt, x, y, t, t0, o = {}) {
  const k = ap(t, t0, .45, easeBack);
  if (k <= 0) return '';
  return G(tr(x, y, Math.max(0.01, k)), etiket(txt, 0, 0, o));
}

// ===== Gökyüzü =====
const GOK = {
  safak: ['#1E2A4A', '#5B3F6B', '#E07A5F', '#F6C28B'],
  gun: ['#6FB1DA', '#9ED0E9', '#CFE8F2', '#EAF4F2'],
  aksam: ['#2E2A55', '#8E4A6B', '#E8855A', '#F7C873'],
  gece: ['#070B1C', '#101A3A', '#1C2B55', '#2B3D6B'],
  firtina: ['#2B3138', '#454E57', '#5E6770', '#78808A'],
  altin: ['#3B1F0E', '#7A4518', '#C98A2E', '#F2C76B'],
  mistik: ['#0B1638', '#1D2F6B', '#3F5BA8', '#8FB0E8'],
};
function gok(tur = 'gun', h = H) {
  const id = uid('gok'), c = GOK[tur] || GOK.gun;
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
    c.map((col, i) => `<stop offset="${i / (c.length - 1)}" stop-color="${col}"/>`).join('') +
    `</linearGradient></defs><rect x="-200" y="-200" width="${W + 400}" height="${h + 200}" fill="url(#${id})"/>`;
}
function yildizlar(t, n = 90, seed = 7, ymax = 600) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * ymax, rr = .8 + r() * 2.2, ph = r() * 6;
    const o = .35 + .65 * (0.5 + 0.5 * Math.sin(t * 2 + ph));
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="#FFF8E1" opacity="${f(o * 100) / 100}"/>`;
  }
  return s;
}
function bulut(x, y, s = 1, renk = '#fff', o = .9) {
  return G(tr(x, y, s), `<g fill="${renk}" opacity="${o}"><ellipse cx="0" cy="0" rx="90" ry="38"/><ellipse cx="-60" cy="12" rx="60" ry="28"/><ellipse cx="65" cy="10" rx="70" ry="30"/><ellipse cx="10" cy="-26" rx="55" ry="36"/></g>`);
}
function bulutlar(t, o = {}) {
  const r = rng(o.seed || 3), n = o.n || 6, hiz = o.hiz || 12; let s = '';
  for (let i = 0; i < n; i++) {
    const y = (o.y0 || 80) + r() * (o.yr || 260), sc = .6 + r() * .9;
    const x = ((r() * (W + 600) + t * hiz * (0.6 + r())) % (W + 600)) - 300;
    s += bulut(x, y, sc, o.renk || '#fff', o.op || .85);
  }
  return s;
}
function gunes(x, y, r = 70, renk = '#FFE3A3', t = 0) {
  return `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="${renk}" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="${renk}" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="${renk}"/>`;
}
function ay(x, y, r = 50) {
  return `<circle cx="${x}" cy="${y}" r="${r * 2}" fill="#FFF5D6" opacity=".12"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF5D6"/><circle cx="${x + r * .38}" cy="${y - r * .2}" r="${r * .92}" fill="#101A3A"/>`;
}

// ===== Su =====
function deniz(y, t, o = {}) {
  const c1 = o.renk || '#3D7EA6', c2 = o.renk2 || '#25587A', id = uid('dz');
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`;
  s += `<rect x="-200" y="${y}" width="${W + 400}" height="${H - y + 200}" fill="url(#${id})"/>`;
  const r = rng(o.seed || 11);
  const n = o.n || 26;
  for (let i = 0; i < n; i++) {
    const yy = y + 18 + r() * (H - y - 10), ww = 40 + r() * 90;
    const x = ((r() * (W + 300) + t * (14 + r() * 18)) % (W + 300)) - 150;
    s += `<path d="M${f(x)},${f(yy)} q${f(ww / 4)},-8 ${f(ww / 2)},0 t${f(ww / 2)},0" fill="none" stroke="${o.dalga || 'rgba(255,255,255,.35)'}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s;
}

// ===== Taş duvar / sur =====
function burcSiralari(x, y, w, h, o = {}) {
  // dişli üst kenar
  const dw = o.dw || 34, renk = o.renk || '#CDB58A', gol = o.golge || '#A88F64';
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${renk}" stroke="${OUT}" stroke-width="4"/>`;
  for (let i = 0; i < w / dw; i++) {
    if (i % 2 === 0) s += `<rect x="${x + i * dw}" y="${y - dw * .8}" width="${dw}" height="${dw * .8 + 2}" fill="${renk}" stroke="${OUT}" stroke-width="4"/>`;
  }
  // taş çizgileri
  const r = rng(o.seed || 5);
  for (let yy = y + 26; yy < y + h - 8; yy += 30) {
    s += `<line x1="${x + 4}" y1="${yy}" x2="${x + w - 4}" y2="${yy}" stroke="${gol}" stroke-width="2.5"/>`;
    const off = r() * 60;
    for (let xx = x + off; xx < x + w - 10; xx += 60 + r() * 30) s += `<line x1="${f(xx)}" y1="${yy}" x2="${f(xx)}" y2="${yy + 30 > y + h ? y + h : yy + 30}" stroke="${gol}" stroke-width="2.5"/>`;
  }
  // tuğla bantları (Teodosius surlarındaki kırmızı tuğla şeritleri)
  if (o.tugla !== false) for (let yy = y + h * .35; yy < y + h; yy += h * .33) s += `<rect x="${x + 2}" y="${f(yy)}" width="${w - 4}" height="10" fill="#A65A3E" opacity=".75"/>`;
  return s;
}
function kule(x, y, w, h, o = {}) {
  let s = burcSiralari(x, y, w, h, Object.assign({ dw: w / 5 }, o));
  // pencere/mazgal
  s += `<rect x="${x + w / 2 - 9}" y="${y + h * .25}" width="18" height="34" rx="9" fill="#2B2118"/>`;
  if (h > 200) s += `<rect x="${x + w / 2 - 9}" y="${y + h * .55}" width="18" height="34" rx="9" fill="#2B2118"/>`;
  return s;
}
// uzun sur: kuleler arası perde duvar
function sur(x, y, w, h, o = {}) {
  const ka = o.kuleAra || 360, kw = o.kw || 110, kh = h + (o.kuleFark || 80);
  let s = burcSiralari(x, y, w, h, o);
  for (let xx = x + (o.ofs || 60); xx < x + w - kw / 2; xx += ka) s += kule(xx, y - (kh - h), kw, kh, o);
  return s;
}
// gedik (yıkık bölüm)
function gedik(x, y, w, h, renk = '#CDB58A') {
  return `<path d="M${x},${y} l${w * .15},${h * .45} l${w * .1},-${h * .2} l${w * .2},${h * .55} l${w * .2},-${h * .3} l${w * .15},${h * .35} l${w * .2},-${h * .85} Z" fill="#3A2E24" stroke="${OUT}" stroke-width="4"/>` +
    `<g fill="${renk}" stroke="${OUT}" stroke-width="3">` +
    [0, 1, 2, 3, 4, 5].map(i => `<rect x="${x + w * (.05 + i * .16)}" y="${y + h * .9 + (i % 2) * 8}" width="${26 + (i % 3) * 8}" height="${20}" rx="4" transform="rotate(${(i * 23) % 40 - 20} ${x + w * (.05 + i * .16)} ${y + h * .9})"/>`).join('') + `</g>`;
}

// ===== Ayasofya =====
function ayasofya(x, y, s = 1, o = {}) {
  const duvar = o.renk || '#D9A27A', kubbe = o.kubbe || '#7F8E9C', koyu = '#B77E5A';
  let g = '';
  // minareler (fetih sonrası)
  if (o.minare) {
    [[-330, 0], [330, 0], [-410, 40], [410, 40]].forEach(([mx, my], i) => {
      const hh = i < 2 ? 520 : 470;
      g += `<rect x="${mx - 13}" y="${my - hh}" width="26" height="${hh}" fill="#E9D7B9" stroke="${OUT}" stroke-width="4"/>` +
        `<rect x="${mx - 20}" y="${my - hh * .62}" width="40" height="12" fill="#E9D7B9" stroke="${OUT}" stroke-width="4"/>` +
        `<path d="M${mx - 13},${my - hh} L${mx},${my - hh - 70} L${mx + 13},${my - hh} Z" fill="${kubbe}" stroke="${OUT}" stroke-width="4"/>`;
    });
  }
  // gövde
  g += `<rect x="-300" y="-150" width="600" height="150" fill="${duvar}" stroke="${OUT}" stroke-width="5"/>`;
  g += `<rect x="-360" y="-90" width="720" height="90" fill="${koyu}" stroke="${OUT}" stroke-width="5"/>`;
  // payandalar
  [-250, -150, 150, 250].forEach(px => g += `<rect x="${px - 22}" y="-250" width="44" height="250" fill="${koyu}" stroke="${OUT}" stroke-width="5"/>`);
  // yarım kubbeler
  g += `<path d="M-300,-150 A110,90 0 0 1 -90,-150 Z" fill="${kubbe}" stroke="${OUT}" stroke-width="5"/>`;
  g += `<path d="M90,-150 A110,90 0 0 1 300,-150 Z" fill="${kubbe}" stroke="${OUT}" stroke-width="5"/>`;
  // kubbe kasnağı
  g += `<rect x="-170" y="-215" width="340" height="70" fill="${duvar}" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) g += `<rect x="${-150 + i * 34}" y="-200" width="16" height="36" rx="8" fill="#5A3D2B"/>`;
  // ana kubbe
  g += `<path d="M-180,-212 A180,150 0 0 1 180,-212 Z" fill="${kubbe}" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = -3; i <= 3; i++) g += `<path d="M${i * 45},-212 Q${i * 30},-300 0,-362" fill="none" stroke="#6A7886" stroke-width="3"/>`;
  if (!o.minare && o.hac !== false) g += `<line x1="0" y1="-362" x2="0" y2="-410" stroke="${OUT}" stroke-width="6"/><line x1="-18" y1="-392" x2="18" y2="-392" stroke="${OUT}" stroke-width="6"/>`;
  if (o.minare) g += `<line x1="0" y1="-362" x2="0" y2="-400" stroke="#E2B54B" stroke-width="6"/><path d="M-12,-410 a14,14 0 1 0 18,-8 a10,10 0 1 1 -18,8" fill="#E2B54B"/>`;
  // kapılar
  for (let i = -2; i <= 2; i++) g += `<path d="M${i * 70 - 18},0 v-50 a18,18 0 0 1 36,0 v50 Z" fill="#4A3324"/>`;
  return G(tr(x, y, s), g);
}

// ===== Basit kilise / ev / servi =====
function kilise(x, y, s = 1, renk = '#D7B08A') {
  return G(tr(x, y, s), `<rect x="-70" y="-90" width="140" height="90" fill="${renk}" stroke="${OUT}" stroke-width="4"/>` +
    `<rect x="-38" y="-130" width="76" height="42" fill="${renk}" stroke="${OUT}" stroke-width="4"/>` +
    `<path d="M-40,-128 A40,40 0 0 1 40,-128 Z" fill="#8C6D5A" stroke="${OUT}" stroke-width="4"/>` +
    `<line x1="0" y1="-168" x2="0" y2="-195" stroke="${OUT}" stroke-width="4"/><line x1="-9" y1="-184" x2="9" y2="-184" stroke="${OUT}" stroke-width="4"/>` +
    `<path d="M-12,0 v-34 a12,12 0 0 1 24,0 v34 Z" fill="#4A3324"/>`);
}
function ev(x, y, s = 1, renk = '#E3C9A3', cati = '#B5583C', w = 120, h = 90) {
  return G(tr(x, y, s), `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${renk}" stroke="${OUT}" stroke-width="4"/>` +
    `<path d="M${-w / 2 - 12},${-h} L0,${-h - 50} L${w / 2 + 12},${-h} Z" fill="${cati}" stroke="${OUT}" stroke-width="4"/>` +
    `<rect x="-14" y="-46" width="28" height="46" fill="#5A3D2B"/><rect x="${w / 2 - 36}" y="${-h + 22}" width="22" height="22" fill="#5A3D2B"/>`);
}
function servi(x, y, s = 1, renk = '#2F5A3A') {
  return G(tr(x, y, s), `<rect x="-5" y="-20" width="10" height="20" fill="#5A3D2B"/><path d="M0,-200 C30,-150 34,-60 22,-20 L-22,-20 C-34,-60 -30,-150 0,-200 Z" fill="${renk}" stroke="${OUT}" stroke-width="4"/>`);
}
function agac(x, y, s = 1, renk = '#5E8C46') {
  return G(tr(x, y, s), `<rect x="-9" y="-70" width="18" height="70" fill="#6B4A2E" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="-110" r="62" fill="${renk}" stroke="${OUT}" stroke-width="4"/><circle cx="-38" cy="-86" r="36" fill="${renk}" stroke="${OUT}" stroke-width="4"/><circle cx="40" cy="-88" r="38" fill="${renk}" stroke="${OUT}" stroke-width="4"/>`);
}
function sutun(x, y, s = 1) {
  return G(tr(x, y, s), `<rect x="-22" y="-260" width="44" height="260" fill="#C9A06E" stroke="${OUT}" stroke-width="4"/>` +
    [0, 1, 2, 3, 4].map(i => `<rect x="-26" y="${-240 + i * 50}" width="52" height="8" fill="#9C7650"/>`).join('') +
    `<rect x="-34" y="-280" width="68" height="22" fill="#C9A06E" stroke="${OUT}" stroke-width="4"/>`);
}
function sehirSiluet(x, y, s = 1, o = {}) {
  let g = '';
  const r = rng(o.seed || 21);
  // arka evler
  for (let i = 0; i < 22; i++) {
    const xx = -900 + i * 85 + r() * 30;
    g += ev(xx, 10, .7 + r() * .3, ['#E3C9A3', '#D9B58C', '#EAD6B8', '#CFAE86'][i % 4], ['#B5583C', '#A04A34', '#C2694A'][i % 3]);
  }
  g += kilise(-640, 0, 1.1); g += kilise(560, 0, 1.0, '#CFA27F'); g += kilise(760, 5, .8);
  g += servi(-470, 10, 1.1); g += servi(-430, 12, .9); g += servi(400, 10, 1); g += servi(870, 10, 1.2);
  g += sutun(-250, 10, 1);
  g += ayasofya(80, 0, o.ayaS || .85, { minare: o.minare });
  for (let i = 0; i < 16; i++) {
    const xx = -940 + i * 125 + r() * 40;
    g += ev(xx, 60, .9 + r() * .3, ['#EAD6B8', '#E3C9A3', '#D9B58C'][i % 3], ['#B5583C', '#C2694A', '#A04A34'][i % 3]);
  }
  return G(tr(x, y, s), g);
}

// ===== Osmanlı ordugâhı =====
function cadir(x, y, s = 1, renk = '#F2EEE6', serit = '#B3262E') {
  return G(tr(x, y, s), `<path d="M-90,0 L0,-120 L90,0 Z" fill="${renk}" stroke="${OUT}" stroke-width="4"/>` +
    `<path d="M-45,-60 L45,-60" stroke="${serit}" stroke-width="10"/><path d="M-12,0 L0,-40 L12,0 Z" fill="#5A3D2B"/>` +
    `<line x1="0" y1="-120" x2="0" y2="-170" stroke="${OUT}" stroke-width="4"/><path d="M0,-170 L44,-158 L0,-146 Z" fill="${serit}" stroke="${OUT}" stroke-width="3"/>`);
}
function sancakBayrak(x, y, s = 1, t = 0, renk = '#B3262E', hilal = true) {
  const w = Math.sin(t * 5) * 8;
  return G(tr(x, y, s), `<line x1="0" y1="0" x2="0" y2="-260" stroke="#5A3D2B" stroke-width="8"/>` +
    `<path d="M4,-255 Q60,${-270 + w} 120,${-250 - w} L120,${-170 - w} Q60,${-190 + w} 4,-175 Z" fill="${renk}" stroke="${OUT}" stroke-width="4"/>` +
    (hilal ? `<path d="M52,-226 a20,20 0 1 0 22,28 a15,15 0 1 1 -22,-28" fill="#F5EFE0"/>` : '') +
    `<circle cx="0" cy="-262" r="8" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`);
}
// uzaktan asker kalabalığı (silüet)
function askerSirasi(x, y, n, aralik, t, o = {}) {
  const r = rng(o.seed || 9); let s = '';
  const renk = o.renk || '#3A2E3F', sap = o.sapka || '#F2EEE6';
  for (let i = 0; i < n; i++) {
    const xx = x + i * aralik + r() * aralik * .4, b = Math.sin(t * 3 + i) * 2;
    s += `<g transform="translate(${f(xx)},${f(y + b)}) scale(${o.s || 1})">` +
      `<line x1="16" y1="-70" x2="16" y2="-150" stroke="#6B5B4A" stroke-width="3"/>` +
      `<path d="M-14,0 L-12,-46 Q0,-56 12,-46 L14,0 Z" fill="${r() > .5 ? renk : (o.renk2 || '#7A2630')}"/>` +
      `<circle cx="0" cy="-58" r="12" fill="#E8B98C"/>` +
      `<path d="M-11,-64 Q0,-${88 + r() * 8} 11,-64 Z" fill="${r() > .3 ? sap : '#B3262E'}"/></g>`;
  }
  return s;
}

// ===== Gemiler =====
function gemi(x, y, s = 1, o = {}) {
  const govde = o.govde || '#7B4A2A', yelken = o.yelken || '#F2E6CC', t = o.t || 0;
  const sall = Math.sin(t * 1.6 + (o.faz || 0)) * 2.5;
  let g = `<path d="M-160,-10 L160,-10 L120,50 L-120,50 Z" fill="${govde}" stroke="${OUT}" stroke-width="5"/>` +
    `<path d="M-150,0 L150,0" stroke="#5A331C" stroke-width="5"/>`;
  if (o.kurek) for (let i = -5; i <= 5; i++) g += `<line x1="${i * 22}" y1="30" x2="${i * 22 - 18 + Math.sin(t * 3 + i) * 8}" y2="80" stroke="#5A331C" stroke-width="5"/>`;
  g += `<line x1="0" y1="-10" x2="0" y2="-230" stroke="#5A331C" stroke-width="8"/>`;
  g += `<path d="M-90,-210 Q0,-180 90,-210 L100,-60 Q0,-40 -100,-60 Z" fill="${yelken}" stroke="${OUT}" stroke-width="5"/>`;
  if (o.isaret) g += o.isaret;
  if (o.bayrak) g += `<path d="M0,-230 L48,-220 L0,-206 Z" fill="${o.bayrak}" stroke="${OUT}" stroke-width="3"/>`;
  return G(tr(x, y, s, sall), g);
}
function sandal(x, y, s = 1, t = 0) {
  const sall = Math.sin(t * 2) * 3;
  return G(tr(x, y, s, sall), `<path d="M-110,-20 Q0,10 110,-20 L80,25 L-80,25 Z" fill="#8B5A33" stroke="${OUT}" stroke-width="5"/><path d="M-95,-12 Q0,14 95,-12" fill="none" stroke="#5A331C" stroke-width="4"/>`);
}

// ===== Top / gülle / duman / ateş =====
function topCiz(x, y, s = 1, o = {}) {
  const geri = o.geri || 0;
  return G(tr(x, y, s), `<g transform="translate(${-geri},0)"><rect x="-40" y="-40" width="300" height="12" fill="#5A3D2B"/>` +
    `<path d="M-60,-120 L260,-150 L270,-60 L-60,-40 Z" fill="#B08D57" stroke="${OUT}" stroke-width="6"/>` +
    `<rect x="40" y="-140" width="18" height="98" fill="#8A6A3A" stroke="${OUT}" stroke-width="4"/><rect x="150" y="-148" width="18" height="100" fill="#8A6A3A" stroke="${OUT}" stroke-width="4"/>` +
    `<ellipse cx="265" cy="-105" rx="18" ry="46" fill="#2B2118"/></g>` +
    `<path d="M-90,0 L-60,-40 L240,-40 L270,0 Z" fill="#6B4A2E" stroke="${OUT}" stroke-width="5"/>`);
}
function gulle(x, y, r = 30) { return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="#8C8577" stroke="${OUT}" stroke-width="4"/><circle cx="${f(x - r * .3)}" cy="${f(y - r * .3)}" r="${r * .3}" fill="#B0AA9C"/>`; }
function duman(x, y, t, t0, o = {}) {
  const k = clamp((t - t0) / (o.sure || 2.5));
  if (k <= 0 || k >= 1) return '';
  const r = rng(o.seed || 31); let s = '';
  for (let i = 0; i < (o.n || 9); i++) {
    const a = r() * Math.PI * 2, d = (40 + r() * 140) * easeOut(k) * (o.boy || 1);
    const rr = (30 + r() * 50) * (0.5 + k) * (o.boy || 1);
    s += `<circle cx="${f(x + Math.cos(a) * d)}" cy="${f(y + Math.sin(a) * d * .6 - k * 80)}" r="${f(rr)}" fill="${o.renk || '#D8D2C6'}" opacity="${f((1 - k) * .9 * 100) / 100}"/>`;
  }
  return s;
}
function patlama(x, y, t, t0, s = 1) {
  const k = clamp((t - t0) / .35);
  if (t < t0 || t > t0 + .6) return '';
  const o = 1 - clamp((t - t0 - .25) / .35);
  const r = 40 + 160 * easeOut(k);
  let p = '';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    p += `${f(Math.cos(a) * r * (i % 2 ? .55 : 1))},${f(Math.sin(a) * r * (i % 2 ? .55 : 1))} `;
  }
  return G(tr(x, y, s), `<g opacity="${f(o * 100) / 100}"><polygon points="${p}" fill="#FFB547" stroke="#E0582A" stroke-width="8"/><circle r="${f(r * .35)}" fill="#FFF3C4"/></g>`);
}
function ates(x, y, s = 1, t = 0) {
  const a = Math.sin(t * 13) * 6, b = Math.cos(t * 9) * 5;
  return G(tr(x, y, s), `<path d="M-40,0 C-50,-40 -20,-60 ${-10 + a},-110 C0,-70 20,-80 ${10 + b},-130 C40,-80 55,-40 40,0 Z" fill="#F08A2C" stroke="${OUT}" stroke-width="4"/>` +
    `<path d="M-20,0 C-25,-25 -5,-40 ${a * .6},-70 C15,-40 28,-25 20,0 Z" fill="#FFD25A"/>`);
}
function mesale(x, y, s = 1, t = 0) {
  return G(tr(x, y, s), `<rect x="-6" y="0" width="12" height="90" fill="#6B4A2E" stroke="${OUT}" stroke-width="3"/>` + ates(0, 4, .45, t) +
    `<circle cx="0" cy="-20" r="90" fill="#FFB547" opacity=".12"/>`);
}

// ===== Nesneler =====
function fici(x, y, s = 1) {
  return G(tr(x, y, s), `<path d="M-38,-90 Q-50,-45 -38,0 L38,0 Q50,-45 38,-90 Z" fill="#9A6A3C" stroke="${OUT}" stroke-width="4"/><line x1="-44" y1="-25" x2="44" y2="-25" stroke="#4A3324" stroke-width="6"/><line x1="-44" y1="-65" x2="44" y2="-65" stroke="#4A3324" stroke-width="6"/>`);
}
function tas(x, y, s = 1) { return G(tr(x, y, s), `<path d="M-40,0 L-46,-30 L-20,-50 L24,-48 L46,-24 L40,0 Z" fill="#B8A88A" stroke="${OUT}" stroke-width="4"/><path d="M-20,-30 L10,-34" stroke="#8E7E62" stroke-width="3"/>`); }
function ekmek(x, y, s = 1) { return G(tr(x, y, s), `<ellipse cx="0" cy="0" rx="50" ry="30" fill="#C98A3E" stroke="${OUT}" stroke-width="4"/><path d="M-26,-14 l10,14 M-4,-18 l10,14 M18,-16 l10,14" stroke="#8E5A22" stroke-width="4"/>`); }
function balik(x, y, s = 1, renk = '#7FA6B8') {
  return G(tr(x, y, s), `<path d="M-50,0 Q-10,-28 34,0 Q-10,28 -50,0 Z" fill="${renk}" stroke="${OUT}" stroke-width="4"/><path d="M30,0 L60,-20 L60,20 Z" fill="${renk}" stroke="${OUT}" stroke-width="4"/><circle cx="-30" cy="-4" r="4" fill="${OUT}"/>`);
}
function sikke(x, y, s = 1, renk = '#E2B54B') { return G(tr(x, y, s), `<circle r="26" fill="${renk}" stroke="${OUT}" stroke-width="4"/><circle r="16" fill="none" stroke="#B88A2A" stroke-width="3"/>`); }
function sandik(x, y, s = 1, acik = 0, bos = false) {
  return G(tr(x, y, s), `<rect x="-90" y="-80" width="180" height="80" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/>` +
    (acik && !bos ? `<g>${[[-50, -86], [-10, -96], [30, -88], [60, -80], [-30, -100], [10, -110]].map(([a, b]) => sikke(a, b, .8)).join('')}</g>` : '') +
    `<path d="M-90,-80 L-90,${-110 - acik * 40} Q0,${-140 - acik * 60} 90,${-110 - acik * 40} L90,-80 Z" fill="#9C6A36" stroke="${OUT}" stroke-width="5"/>` +
    `<rect x="-14" y="-90" width="28" height="30" fill="#E2B54B" stroke="${OUT}" stroke-width="4"/>`);
}
function zincirHalka(x, y, s = 1, r = 0) {
  return G(tr(x, y, s, r), `<ellipse rx="26" ry="14" fill="none" stroke="${OUT}" stroke-width="13"/><ellipse rx="26" ry="14" fill="none" stroke="#8D96A0" stroke-width="7"/>`);
}
function zincirHat(x1, y1, x2, y2, s = 1, sark = 30) {
  let out = '';
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / (40 * s)));
  for (let i = 0; i <= n; i++) {
    const k = i / n, x = lerp(x1, x2, k), y = lerp(y1, y2, k) + Math.sin(k * Math.PI) * sark;
    const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    out += zincirHalka(x, y, s * .8, ang + (i % 2 ? 0 : 0)) .replace('ry="14"', i % 2 ? 'ry="5"' : 'ry="14"');
  }
  return out;
}
function ikona(x, y, s = 1) {
  return G(tr(x, y, s), `<rect x="-70" y="-100" width="140" height="190" rx="6" fill="#C9962E" stroke="${OUT}" stroke-width="5"/>` +
    `<rect x="-56" y="-86" width="112" height="162" fill="#7A2E3A"/>` +
    `<circle cx="-8" cy="-34" r="34" fill="#E2B54B" opacity=".9"/><circle cx="-8" cy="-30" r="20" fill="#C8956A"/>` +
    `<path d="M-48,76 Q-40,-6 -8,-6 Q30,-6 40,76 Z" fill="#2E3E6E"/><circle cx="22" cy="10" r="14" fill="#C8956A"/><circle cx="22" cy="6" r="22" fill="none" stroke="#E2B54B" stroke-width="4"/>`);
}
function parsomen(x, y, s = 1, w = 300, h = 380, yazilar = []) {
  let g = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#F1E1BC" stroke="${OUT}" stroke-width="5"/>` +
    `<rect x="${-w / 2 - 14}" y="${-h / 2 - 16}" width="${w + 28}" height="28" rx="14" fill="#D9C08E" stroke="${OUT}" stroke-width="5"/>` +
    `<rect x="${-w / 2 - 14}" y="${h / 2 - 12}" width="${w + 28}" height="28" rx="14" fill="#D9C08E" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 8; i++) g += `<line x1="${-w / 2 + 30}" y1="${-h / 2 + 50 + i * 38}" x2="${w / 2 - 30 - (i % 3) * 30}" y2="${-h / 2 + 50 + i * 38}" stroke="#9C8150" stroke-width="5" stroke-linecap="round"/>`;
  return G(tr(x, y, s), g);
}
function muhur(x, y, s = 1, renk = '#B3262E') {
  return G(tr(x, y, s), `<circle r="40" fill="${renk}" stroke="${OUT}" stroke-width="4"/><circle r="28" fill="none" stroke="#7A1018" stroke-width="4"/><path d="M-12,4 a14,14 0 1 0 16,-16 a10,10 0 1 1 -16,16" fill="#F2D9A0"/>`);
}
function soruIsareti(x, y, s = 1) { return yazi('?', x, y, { fs: 160 * s, renk: '#FFD25A', kontur: OUT, kw: 14 * s, font: 'baslik' }); }
function unlem(x, y, s = 1) { return yazi('!', x, y, { fs: 160 * s, renk: '#FF6B4A', kontur: OUT, kw: 14 * s, font: 'baslik' }); }

// Kâğıt dokusu / vinyet katmanı (motor tarafından üste eklenir)
function vinyet() {
  const id = uid('vn');
  return `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}
