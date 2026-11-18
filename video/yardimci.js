// ===== Sahne yardımcıları =====
// cümle başlangıcı (sahne içi yerel saniye)
function B(seg, i, def) {
  if (seg && seg.cumleler && seg.cumleler[i]) return seg.cumleler[i].bas - seg.bas;
  return def !== undefined ? def : i * 3;
}
// yavaş kamera hareketi
function kam(t, d, inner, o = {}) {
  const k = easeIO(clamp(t / Math.max(d, .1)));
  const z = lerp(o.z0 || 1, o.z1 || 1.06, k);
  const cx = o.cx || 960, cy = o.cy || 540;
  const dx = lerp(o.x0 || 0, o.x1 || 0, k), dy = lerp(o.y0 || 0, o.y1 || 0, k);
  return `<g transform="translate(${f(cx + dx)},${f(cy + dy)}) scale(${(z).toFixed(4)}) translate(${-cx},${-cy})">${inner}</g>`;
}
// sarsıntı (t0 anından itibaren sönümlenen)
function sars(t, anlar, guc = 18) {
  let x = 0, y = 0;
  for (const a of anlar) {
    const dt = t - a;
    if (dt >= 0 && dt < .7) { const e = (1 - dt / .7); x += Math.sin(dt * 70) * guc * e; y += Math.cos(dt * 55) * guc * .7 * e; }
  }
  return `translate(${f(x)},${f(y)})`;
}
// alt sahneler arası geçiş: parcalar = [[t0, fn], ...]
function parca(t, parcalar, fade = .45) {
  let i = 0;
  for (let j = 0; j < parcalar.length; j++) if (t >= parcalar[j][0]) i = j;
  const [t0, fn] = parcalar[i];
  const lt = t - t0;
  let s = fn(lt);
  if (i > 0 && lt < fade) {
    const [p0, pfn] = parcalar[i - 1];
    s = pfn(t - p0) + op(easeIO(lt / fade), s);
  }
  return s;
}
// konuşma / düşünce balonu
function balon(satirlar, x, y, o = {}) {
  const fs = o.fs || 40, lh = fs * 1.25;
  const w = o.w || Math.max(...satirlar.map(s => s.length)) * fs * .55 + fs * 1.6;
  const h = satirlar.length * lh + fs * 1.1;
  const k = o.k === undefined ? 1 : o.k;
  if (k <= 0) return '';
  const kx = o.kuyruk === undefined ? -w * .25 : o.kuyruk;
  let s = '';
  if (o.dusunce) {
    s += `<circle cx="${kx * .6}" cy="${h / 2 + 36}" r="14" fill="#FFFDF5" stroke="${OUT}" stroke-width="4"/><circle cx="${kx * .8}" cy="${h / 2 + 66}" r="8" fill="#FFFDF5" stroke="${OUT}" stroke-width="4"/>`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#FFFDF5" stroke="${OUT}" stroke-width="5"/>`;
  } else {
    s += `<path d="M${kx - 26},${h / 2 - 4} L${kx - 40},${h / 2 + 56} L${kx + 22},${h / 2 - 4} Z" fill="#FFFDF5" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="28" fill="#FFFDF5" stroke="${OUT}" stroke-width="5"/>`;
    s += `<path d="M${kx - 22},${h / 2 - 3} L${kx + 18},${h / 2 - 3}" stroke="#FFFDF5" stroke-width="8"/>`;
  }
  satirlar.forEach((l, i) => s += yazi(l, 0, -h / 2 + fs * .55 + lh * (i + .5), { fs, renk: o.renk || OUT, fw: 800 }));
  return G(tr(x, y, easeBack(clamp(k))), s);
}
// alıntı bandı (tarihî söz)
function alinti(satirlar, x, y, k, o = {}) {
  if (k <= 0) return '';
  const fs = o.fs || 44, lh = fs * 1.3, w = o.w || 1500, h = satirlar.length * lh + 90;
  let s = `<rect x="${-w / 2 + 10}" y="${-h / 2 + 12}" width="${w}" height="${h}" rx="18" fill="rgba(0,0,0,.35)"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="18" fill="#F4E6C4" stroke="#7A5A2A" stroke-width="7"/>` +
    yazi('“', -w / 2 + 50, -h / 2 + 48, { fs: 120, renk: '#B88A2A', font: 'baslik' });
  satirlar.forEach((l, i) => s += yazi(l, 0, -h / 2 + 45 + lh * (i + .5), { fs, renk: '#3A2412', fw: 800 }));
  if (o.kaynak) s += yazi(o.kaynak, w / 2 - 30, h / 2 - 22, { fs: 26, renk: '#7A5A2A', anc: 'end', fw: 700 });
  const kk = easeOut(clamp(k));
  return `<g transform="translate(${x},${y + (1 - kk) * 40})" opacity="${f(kk * 100) / 100}">${s}</g>`;
}
// büyük başlık şeridi
function baslikSerit(txt, x, y, k, o = {}) {
  if (k <= 0) return '';
  const fs = o.fs || 72, w = o.w || txt.length * fs * .72 + 120;
  const kk = easeBack(clamp(k));
  return G(tr(x, y, kk), `<rect x="${-w / 2}" y="${-fs * .85}" width="${w}" height="${fs * 1.7}" rx="12" fill="${o.bg || '#1B2147'}" stroke="#E2B54B" stroke-width="6"/>` +
    yazi(txt, 0, 4, { fs, renk: o.renk || '#FFF4DC', font: 'baslik', ls: 2 }));
}
// at (yan görünüm, sağa bakar)
function at(x, y, s = 1, o = {}) {
  const t = o.t || 0, renk = o.renk || '#F2EEE6', yele = o.yele || '#B8B0A0';
  const a = o.yuru ? Math.sin(t * 7) * 16 : 0;
  const bac = (bx, faz) => `<path d="M${bx},-150 L${bx + (o.yuru ? Math.sin(t * 7 + faz) * 18 : 0)},-6" stroke="${OUT}" stroke-width="30" stroke-linecap="round"/><path d="M${bx},-150 L${bx + (o.yuru ? Math.sin(t * 7 + faz) * 18 : 0)},-6" stroke="${renk}" stroke-width="21" stroke-linecap="round"/><rect x="${bx - 14 + (o.yuru ? Math.sin(t * 7 + faz) * 18 : 0)}" y="-16" width="28" height="16" rx="4" fill="#4A3324"/>`;
  let g = bac(-110, 0) + bac(90, Math.PI);
  g += `<path d="M-170,-170 Q-200,-120 -190,-60" fill="none" stroke="${yele}" stroke-width="22" stroke-linecap="round"/>`; // kuyruk
  g += `<ellipse cx="0" cy="-190" rx="170" ry="72" fill="${renk}" stroke="${OUT}" stroke-width="6"/>`;
  g += bac(-70, Math.PI) + bac(130, 0);
  g += `<path d="M120,-220 L190,-330 L250,-310 L200,-190 Z" fill="${renk}" stroke="${OUT}" stroke-width="6"/>`; // boyun
  g += `<path d="M180,-345 Q250,-360 290,-300 Q300,-270 270,-262 Q240,-270 196,-280 Z" fill="${renk}" stroke="${OUT}" stroke-width="6"/>`; // kafa
  g += `<path d="M190,-350 L200,-382 L214,-348 Z" fill="${renk}" stroke="${OUT}" stroke-width="5"/>`;
  g += `<circle cx="236" cy="-322" r="7" fill="${OUT}"/>`;
  g += `<path d="M186,-340 Q150,-300 130,-220" fill="none" stroke="${yele}" stroke-width="20" stroke-linecap="round"/>`;
  if (o.eyer) g += `<path d="M-60,-258 Q0,-280 60,-258 L50,-200 L-50,-200 Z" fill="${o.eyer}" stroke="${OUT}" stroke-width="5"/>`;
  return G(tr(x, y + (o.yuru ? Math.abs(Math.sin(t * 7)) * -6 : 0), s), g);
}
// melek
function melek(x, y, s = 1, t = 0, o = {}) {
  const kanat = Math.sin(t * 3) * 6;
  let g = `<circle cx="0" cy="-200" r="220" fill="#FFF3C4" opacity=".25"/>`;
  g += `<path d="M-30,-200 Q-200,${-330 + kanat} -260,-150 Q-180,-170 -120,-110 Q-150,-140 -30,-130 Z" fill="#FFFDF5" stroke="#C9B37A" stroke-width="5"/>`;
  g += `<path d="M30,-200 Q200,${-330 + kanat} 260,-150 Q180,-170 120,-110 Q150,-140 30,-130 Z" fill="#FFFDF5" stroke="#C9B37A" stroke-width="5"/>`;
  g += `<path d="M-60,-170 L-90,0 L90,0 L60,-170 Q0,-190 -60,-170 Z" fill="#F7F1E0" stroke="#C9B37A" stroke-width="5"/>`;
  g += `<circle cx="0" cy="-230" r="56" fill="#F6D9B8" stroke="#C9B37A" stroke-width="5"/>`;
  g += `<ellipse cx="0" cy="-300" rx="50" ry="13" fill="none" stroke="#FFD25A" stroke-width="8"/>`;
  g += `<path d="M-20,-232 q6,6 12,0 M8,-232 q6,6 12,0" fill="none" stroke="#8A6A3A" stroke-width="4"/>`;
  if (o.kilic) g += `<g transform="translate(80,-150) rotate(-30)"><rect x="-6" y="-200" width="12" height="200" fill="#FFF8D8" stroke="#C9B37A" stroke-width="4"/><rect x="-26" y="-6" width="52" height="12" fill="#FFD25A"/></g>`;
  return `<g transform="${tr(x, y, s)}" opacity="${o.op === undefined ? 1 : o.op}">${g}</g>`;
}
// kapı (çift kanat, büyük)
function buyukKapi(x, y, s = 1, aci = 0, o = {}) {
  // aci 0 kapalı, 1 tamamen açık
  const gw = 220, gh = 520;
  let g = `<path d="M${-gw - 40},0 L${-gw - 40},${-gh} Q0,${-gh - 160} ${gw + 40},${-gh} L${gw + 40},0 Z" fill="#6B5A48" stroke="${OUT}" stroke-width="6"/>`;
  g += `<path d="M${-gw},0 L${-gw},${-gh + 20} Q0,${-gh - 120} ${gw},${-gh + 20} L${gw},0 Z" fill="${o.ic || '#1A120C'}"/>`;
  if (o.isik) g += `<path d="M${-gw},0 L${-gw},${-gh + 20} Q0,${-gh - 120} ${gw},${-gh + 20} L${gw},0 Z" fill="#FFE9B0" opacity="${o.isik}"/>`;
  const kanat = (yon) => {
    const w = gw * (1 - aci * .85);
    const x0 = yon < 0 ? -gw : gw - w;
    let k = `<rect x="${x0}" y="${-gh + 10}" width="${w}" height="${gh - 10}" fill="#8B5A2B" stroke="${OUT}" stroke-width="5"/>`;
    for (let i = 1; i < 5; i++) k += `<line x1="${x0}" y1="${-gh + i * gh / 5}" x2="${x0 + w}" y2="${-gh + i * gh / 5}" stroke="#5A3A1C" stroke-width="5"/>`;
    k += `<circle cx="${yon < 0 ? x0 + w - 24 : x0 + 24}" cy="${-gh / 2}" r="12" fill="#E2B54B" stroke="${OUT}" stroke-width="3"/>`;
    return k;
  };
  g += kanat(-1) + kanat(1);
  if (o.surgu) g += `<rect x="${-gw - 20}" y="${-gh / 2 - 20}" width="${gw * 2 + 40}" height="34" rx="8" fill="#5A3A1C" stroke="${OUT}" stroke-width="5"/>`;
  if (o.catlak) g += `<path d="M-40,${-gh + 60} l30,60 l-24,40 l40,70 l-30,60 l26,80" fill="none" stroke="${OUT}" stroke-width="6"/><path d="M60,${-gh + 120} l-30,50 l30,60 l-20,60" fill="none" stroke="${OUT}" stroke-width="6"/>`;
  return G(tr(x, y, s), g);
}
// iç mekân: kemerli duvar
function kemerler(y, n, renk = '#D9C29A', koyu = '#B89E72', o = {}) {
  let s = `<rect x="-100" y="${y - 520}" width="${W + 200}" height="620" fill="${renk}"/>`;
  const w = (W + 200) / n;
  for (let i = 0; i < n; i++) {
    const x = -100 + i * w;
    s += `<path d="M${x + w * .15},${y + 100} L${x + w * .15},${y - 260} A${w * .35},${w * .35} 0 0 1 ${x + w * .85},${y - 260} L${x + w * .85},${y + 100} Z" fill="${o.ic || koyu}" stroke="${OUT}" stroke-width="5"/>`;
    s += `<rect x="${x - 18}" y="${y - 300}" width="36" height="400" fill="${renk}" stroke="${OUT}" stroke-width="5"/>`;
  }
  return s;
}
// mozaik altın zemin
function altinZemin(o = {}) {
  const id = uid('az');
  return `<defs><radialGradient id="${id}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="${o.c1 || '#F7D57A'}"/><stop offset=".6" stop-color="${o.c2 || '#C98F2E'}"/><stop offset="1" stop-color="${o.c3 || '#6B3F12'}"/></radialGradient></defs><rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="url(#${id})"/>`;
}
function zemin(y, renk = '#B89A6A', o = {}) {
  let s = `<rect x="-200" y="${y}" width="${W + 400}" height="${H - y + 200}" fill="${renk}"/>`;
  if (o.cizgi) s += `<line x1="-200" y1="${y}" x2="${W + 200}" y2="${y}" stroke="${OUT}" stroke-width="5"/>`;
  if (o.karo) for (let x = -100; x < W + 100; x += 160) s += `<path d="M${x},${y} L${x - 260},${H + 50}" stroke="${o.karo}" stroke-width="4"/>`;
  return s;
}
function tepe(pts, renk, o = {}) {
  // pts: [[x,y],...] üst kenar; alt kenar ekran dışı
  let d = `M${pts[0][0]},${H + 200} L${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    d += ` Q${(x0 + x1) / 2},${Math.min(y0, y1) - (o.yumus || 30)} ${x1},${y1}`;
  }
  d += ` L${pts[pts.length - 1][0]},${H + 200} Z`;
  return `<path d="${d}" fill="${renk}" ${o.cizgi === false ? '' : `stroke="${OUT}" stroke-width="5"`}/>`;
}
// küçük piktogram insan (infografik)
function piktogram(x, y, s = 1, renk = '#3F6FB5') {
  return G(tr(x, y, s), `<circle cx="0" cy="-58" r="14" fill="${renk}"/><path d="M-18,-40 Q0,-48 18,-40 L20,0 L-20,0 Z" fill="${renk}"/>`);
}
// onay / çarpı işareti
function tik(x, y, s = 1, k = 1) {
  if (k <= 0) return '';
  return G(tr(x, y, s * easeBack(clamp(k))), `<circle r="34" fill="#3FAE5A" stroke="${OUT}" stroke-width="5"/><path d="M-16,0 L-4,14 L18,-12" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`);
}
function carpi(x, y, s = 1, k = 1) {
  if (k <= 0) return '';
  return G(tr(x, y, s * easeBack(clamp(k))), `<circle r="34" fill="#D9432F" stroke="${OUT}" stroke-width="5"/><path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`);
}
function ok(x1, y1, x2, y2, k = 1, o = {}) {
  if (k <= 0) return '';
  const x = lerp(x1, x2, k), y = lerp(y1, y2, k);
  const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const renk = o.renk || '#D9432F', w = o.w || 14;
  return `<line x1="${x1}" y1="${y1}" x2="${f(x)}" y2="${f(y)}" stroke="${OUT}" stroke-width="${w + 8}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${f(x)}" y2="${f(y)}" stroke="${renk}" stroke-width="${w}" stroke-linecap="round"/>` +
    G(tr(x, y, 1, a), `<path d="M-6,-${w * 2} L${w * 2.4},0 L-6,${w * 2} Z" fill="${renk}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`);
}
// eğri ok (kesik çizgi, yol)
function yol(pts, k, o = {}) {
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return `<path d="${d}" fill="none" stroke="${o.renk || '#B3262E'}" stroke-width="${o.w || 10}" stroke-dasharray="${o.dash || '22 14'}" stroke-linecap="round" stroke-linejoin="round" style="clip-path: none" pathLength="${f(len)}" stroke-dashoffset="0" opacity="${k > 0 ? 1 : 0}"/>`.replace('stroke-dashoffset="0"', '') ;
}
// yol üzerinde konum
function yolNokta(pts, k) {
  let len = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); len += l; }
  let d = clamp(k) * len;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) { const kk = d / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], kk), lerp(pts[i][1], pts[i + 1][1], kk), Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; }
    d -= seg[i];
  }
  const n = pts.length - 1; return [pts[n][0], pts[n][1], 0];
}
// yolun k kadarını çiz
function yolCiz(pts, k, o = {}) {
  if (k <= 0) return '';
  const out = [pts[0]];
  let len = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); len += l; }
  let d = clamp(k) * len;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) { const kk = d / seg[i]; out.push([lerp(pts[i][0], pts[i + 1][0], kk), lerp(pts[i][1], pts[i + 1][1], kk)]); break; }
    out.push(pts[i + 1]); d -= seg[i];
  }
  const dd = 'M' + out.map(p => f(p[0]) + ',' + f(p[1])).join(' L');
  return `<path d="${dd}" fill="none" stroke="${o.renk || '#B3262E'}" stroke-width="${o.w || 10}" stroke-dasharray="${o.dash || '24 14'}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// sayaç
function sayi(n) { return Math.round(n).toLocaleString('tr-TR'); }

// ===== İstanbul haritası (parşömen) =====
const HARITA = {
  trakya: [[0, 0], [1480, 0], [1470, 150], [1450, 300], [1405, 430], [1365, 500], [1345, 622], [1300, 700], [1200, 765], [1000, 805], [800, 835], [600, 860], [400, 880], [0, 905]],
  halic: [[1368, 498], [1200, 430], [1000, 380], [800, 330], [600, 268], [420, 198], [230, 132], [215, 168], [420, 252], [600, 318], [800, 384], [1000, 438], [1200, 500], [1342, 596]],
  asya: [[1640, 0], [1920, 0], [1920, 1080], [1810, 1080], [1710, 905], [1665, 780], [1625, 600], [1605, 400], [1612, 200]],
  karaSur: [[432, 254], [425, 330], [415, 450], [408, 560], [402, 680], [396, 790], [392, 878]],
  denizSur: [[432, 254], [600, 320], [800, 386], [1000, 440], [1200, 502], [1342, 600], [1300, 700], [1200, 765], [1000, 805], [800, 835], [600, 860], [392, 878]],
  galataSur: [[1080, 405], [1365, 500], [1395, 410], [1250, 300], [1120, 330]],
  // yerler
  ayasofya: [1215, 655], blaherna: [470, 290], pantokrator: [800, 520], romanos: [404, 600], altinKapi: [400, 862], kerkoporta: [438, 300],
  galataKule: [1235, 345], zincirA: [1290, 588], zincirB: [1322, 482], dolmabahce: [1455, 230], kasimpasa: [880, 352], cadir: [270, 600],
};
function poly(pts) { return pts.map(p => p.join(',')).join(' '); }
function harita(t, o = {}) {
  let s = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#9CC3CF"/>`;
  // dalga çizgileri
  const r = rng(77);
  for (let i = 0; i < 60; i++) {
    const x = r() * W, y = r() * H;
    s += `<path d="M${f(x)},${f(y)} q14,-7 28,0 t28,0" fill="none" stroke="#7FAAB8" stroke-width="3" opacity=".7"/>`;
  }
  s += `<polygon points="${poly(HARITA.trakya)}" fill="#EAD9B0" stroke="#7A5A2A" stroke-width="6"/>`;
  s += `<polygon points="${poly(HARITA.asya)}" fill="#EAD9B0" stroke="#7A5A2A" stroke-width="6"/>`;
  s += `<polygon points="${poly(HARITA.halic)}" fill="#9CC3CF" stroke="#7A5A2A" stroke-width="6"/>`;
  if (o.koyler) {
    const kk = o.koyler;
    [[620, 520, 110, 70], [720, 720, 130, 60], [930, 620, 90, 60], [560, 400, 80, 50], [1040, 720, 70, 40], [520, 760, 70, 45]].forEach(([x, y, a, b], i) => {
      s += `<ellipse cx="${x}" cy="${y}" rx="${a * kk}" ry="${b * kk}" fill="#9DBB6E" stroke="#6E8A48" stroke-width="4"/>`;
      for (let j = 0; j < 5; j++) s += `<line x1="${x - a * .6 * kk}" y1="${y - b * .5 + j * b * .25}" x2="${x + a * .6 * kk}" y2="${y - b * .5 + j * b * .25}" stroke="#7E9C55" stroke-width="3" opacity="${kk}"/>`;
    });
    [[1000, 560], [760, 470], [1110, 640], [600, 640], [880, 790], [1180, 720], [480, 520]].forEach(([x, y], i) => {
      for (let j = 0; j < 4; j++) s += `<rect x="${x + (j % 2) * 24 - 20}" y="${y + Math.floor(j / 2) * 22 - 18}" width="18" height="16" fill="#C2694A" stroke="#7A3A24" stroke-width="2" opacity="${kk}"/>`;
    });
    // yıkık saraylar
    [[1150, 690], [680, 580]].forEach(([x, y]) => s += `<g opacity="${kk}"><rect x="${x - 26}" y="${y - 20}" width="10" height="34" fill="#A89070"/><rect x="${x - 6}" y="${y - 6}" width="10" height="20" fill="#A89070"/><rect x="${x + 14}" y="${y - 26}" width="10" height="40" fill="#A89070"/></g>`);
  }
  // surlar
  s += `<polyline points="${poly(HARITA.denizSur)}" fill="none" stroke="#8C6A48" stroke-width="7" stroke-dasharray="16 6"/>`;
  s += `<polyline points="${poly(HARITA.karaSur)}" fill="none" stroke="${o.surRenk || '#6B4A2E'}" stroke-width="${o.surKalin || 16}" stroke-linecap="round"/>`;
  s += `<polyline points="${poly(HARITA.karaSur)}" fill="none" stroke="#C9A06E" stroke-width="6" stroke-dasharray="10 18"/>`;
  s += `<polygon points="${poly(HARITA.galataSur)}" fill="rgba(179,38,46,.12)" stroke="#8C6A48" stroke-width="5" stroke-dasharray="12 6"/>`;
  // Ayasofya simgesi
  const [ax, ay] = HARITA.ayasofya;
  s += G(tr(ax, ay, .16), ayasofya(0, 0, 1, { hac: true }));
  s += G(tr(HARITA.galataKule[0], HARITA.galataKule[1]), `<rect x="-9" y="-40" width="18" height="40" fill="#C9A06E" stroke="#5A3A1C" stroke-width="3"/><path d="M-12,-40 L0,-60 L12,-40 Z" fill="#7F8E9C" stroke="#5A3A1C" stroke-width="3"/>`);
  if (o.cadirlar !== false) {
    const rr = rng(5);
    for (let i = 0; i < 26; i++) s += G(tr(110 + rr() * 250, 300 + rr() * 560, .22), cadir(0, 0, 1, rr() > .7 ? '#E8C7B0' : '#F2EEE6'));
  }
  if (o.etiketler !== false) {
    const L = (txt, x, y, fs = 30, renk = '#5A3A1C') => yazi(txt, x, y, { fs, renk, font: 'baslik', fw: 700 });
    s += L('KONSTANTİNOPOLİS', 860, 640, 40, '#5A3A1C');
    s += L('HALİÇ', 720, 300, 30, '#2E5A6A');
    s += L('GALATA', 1180, 420, 28);
    s += L('BOĞAZ', 1535, 330, 30, '#2E5A6A');
    s += L('MARMARA', 900, 960, 40, '#2E5A6A');
    s += L('ANADOLU', 1770, 520, 30);
    if (o.cadirlar !== false) s += L('OSMANLI ORDUGÂHI', 230, 960, 26, '#7A1E26');
  }
  return s;
}
// haritaya zoom
function haritaZoom(cx, cy, z, inner) {
  return `<g transform="translate(960,540) scale(${z.toFixed(4)}) translate(${-cx},${-cy})">${inner}</g>`;
}

// ===== Rütbe merdiveni =====
const RUTBE_SAPKA = ['hasir', 'kalimavki', 'migfer', 'bareta', 'skiadion', 'tac'];
const RUTBE_ROL = ['balikci', 'kesis', 'asker', 'tuccar', 'soylu', 'imparator'];
function merdiven(x, y, s, aktif, t, o = {}) {
  let g = '';
  for (let i = 0; i < 6; i++) {
    const sx = i * 150, sy = -i * 95;
    const parla = i + 1 === aktif;
    const gecti = i + 1 < aktif;
    g += `<rect x="${sx}" y="${sy}" width="150" height="${95 * (i + 1)}" fill="${parla ? '#E2B54B' : (gecti ? '#8C7A55' : '#3A4170')}" stroke="${OUT}" stroke-width="5"/>`;
    g += yazi(String(i + 1), sx + 75, sy + 50, { fs: 44, renk: parla ? '#1B2147' : '#FFF4DC', font: 'baslik' });
    if (o.sapkalar !== false && !(parla && o.karakter)) {
      g += `<g transform="translate(${sx + 75},${sy - 10}) scale(.32) translate(0,330)" opacity="${parla ? 1 : .85}">${sapkaCiz(RUTBE_SAPKA[i], null, t)}</g>`;
    }
  }
  return G(tr(x, y, s), g);
}
