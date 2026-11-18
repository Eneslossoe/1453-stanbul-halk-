// ===== Reels (dikey 1080x1920) düzeni =====
// Uzun videodaki sahneleri ortadaki pencerede yeniden kullanır; üstte başlık + rütbe bandı, altta büyük altyazı.
const DW = 1080, DH = 1920;
const PEN_Y = 420, PEN_H = 780;               // sahne penceresi

function dikeyArka(T) {
  let s = `<rect width="${DW}" height="${DH}" fill="#141A3A"/>`;
  for (let x = 0; x < DW + 120; x += 120) for (let y = 0; y < DH + 120; y += 120)
    s += `<path d="M${x},${y - 30} L${x + 30},${y} L${x},${y + 30} L${x - 30},${y} Z" fill="none" stroke="#202A58" stroke-width="4"/>`;
  const id = uid('dg');
  s += `<defs><radialGradient id="${id}" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#2A3570" stop-opacity=".9"/><stop offset="1" stop-color="#0A0F28" stop-opacity=".2"/></radialGradient></defs><rect width="${DW}" height="${DH}" fill="url(#${id})"/>`;
  return s;
}

function altyaziCiz(o, T) {
  const A = o.altyazi || [];
  let p = null;
  for (const a of A) if (T >= a.bas - 0.05) p = a;
  if (!p || T > o.konusma_son + 0.25) return '';
  const k = ap(T, p.bas - 0.05, .14, easeOut);
  const txt = p.metin.toLocaleUpperCase('tr');
  const vurgu = /\d|RÜTBE|SULTAN|İMPARATOR|BİN|ESİR|KAÇ|GÖRÜLMEZ|PATRİK|TOP/.test(txt);
  const fs = txt.length > 15 ? 76 : 88;
  return G(tr(DW / 2, 1335, lerp(1.18, 1, k)), yazi(txt, 0, 0, { fs, renk: vurgu ? '#FFD25A' : '#FFFFFF', kontur: '#0A0F28', kw: 18, fw: 900 }));
}

function miniMerdiven(r, T) {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const x = DW / 2 + (i - 2.5) * 150, akt = r === i + 1, gecti = r > i + 1;
    s += `<circle cx="${x}" cy="1510" r="${akt ? 58 : 48}" fill="${akt ? '#E2B54B' : (gecti ? '#5A5070' : '#2A3366')}" stroke="${akt ? '#FFF4DC' : '#E2B54B'}" stroke-width="${akt ? 6 : 3}"/>`;
    s += `<g transform="translate(${x},1530) scale(${akt ? .3 : .24}) translate(0,330)" opacity="${akt ? 1 : (gecti ? .45 : .8)}">${sapkaCiz(RUTBE_SAPKA[i], null, T)}</g>`;
  }
  return s;
}

window.renderDikey = function (T) {
  const R = window.REELS.ogeler;
  let i = R.length - 1;
  for (let j = 0; j < R.length; j++) if (T < R[j].bas + R[j].sure) { i = j; break; }
  const o = R[i], lt = T - o.bas;
  const seg = window.TIMELINE.segmentler.find(s => s.id === o.gorsel.id);
  const t0 = (o.gorsel.cumle != null ? B(seg, o.gorsel.cumle) : 0) + (o.gorsel.ofs || 0);
  _gid = 0;
  const sahne = sahneCiz(seg, Math.max(0, t0 + lt)) + vinyet();
  // giriş vuruşu (punch-in)
  const z = (o.zoom || 1) * (1 + 0.07 * (1 - easeOut(clamp(lt / .4))));
  const vbH = 1080 / z, vbW = vbH * DW / PEN_H, vbX = (o.odak || 960) - vbW / 2, vbY = 540 - vbH / 2;
  let s = dikeyArka(T);
  // üst başlık
  s += yazi("1453'TE İSTANBUL'DA", DW / 2, 175, { fs: 66, font: 'baslik', renk: '#FFF4DC', kontur: '#0A0F28', kw: 12, ls: 2 });
  s += yazi('OLSAYDIN?', DW / 2, 255, { fs: 66, font: 'baslik', renk: '#E2B54B', kontur: '#0A0F28', kw: 12, ls: 4 });
  // rütbe bandı (değişince pop)
  const yeni = i === 0 || R[i - 1].bant !== o.bant;
  const kb = yeni ? ap(lt, 0, .35, easeBack) : 1;
  const bw = o.bant.length * 30 + 120;
  s += G(tr(DW / 2, 350, Math.max(.01, kb)), `<rect x="${-bw / 2}" y="-40" width="${bw}" height="80" rx="40" fill="#D9241C" stroke="#FFF4DC" stroke-width="5"/>` + yazi(o.bant, 0, 3, { fs: 44, renk: '#fff', fw: 900 }));
  // sahne penceresi
  s += `<rect x="0" y="${PEN_Y}" width="${DW}" height="${PEN_H}" fill="#141A3A"/>`;
  s += `<svg x="0" y="${PEN_Y}" width="${DW}" height="${PEN_H}" viewBox="${f(vbX)} ${f(vbY)} ${f(vbW)} ${f(vbH)}" preserveAspectRatio="xMidYMid slice">${sahne}</svg>`;
  s += `<line x1="0" y1="${PEN_Y - 3}" x2="${DW}" y2="${PEN_Y - 3}" stroke="#E2B54B" stroke-width="6"/><line x1="0" y1="${PEN_Y + PEN_H + 3}" x2="${DW}" y2="${PEN_Y + PEN_H + 3}" stroke="#E2B54B" stroke-width="6"/>`;
  // altyazı
  s += altyaziCiz(o, T);
  // mini merdiven / sonda çağrı
  if (o.rutbe) s += miniMerdiven(o.rutbe, T);
  if (i === R.length - 1) {
    const k = ap(lt, 1.6, .4, easeBack);
    if (k > 0) s += G(tr(DW / 2, 1510, k * (1 + .04 * Math.sin(T * 8))), `<rect x="-330" y="-56" width="660" height="112" rx="56" fill="#D9241C" stroke="#FFF4DC" stroke-width="6"/><path d="M-268,-24 L-232,0 L-268,24 Z" fill="#fff"/>` + yazi('TAM VİDEO KANALDA', 20, 4, { fs: 46, renk: '#fff', fw: 900 }));
  } else if (i === 0) {
    s += op(ap(lt, .6, .4), miniMerdiven(0, T));
  }
  // kararma
  const tot = window.REELS.toplam;
  const kar = Math.max(1 - T / .3, (T - (tot - .5)) / .5);
  if (kar > 0) s += `<rect width="${DW}" height="${DH}" fill="#000" opacity="${f(clamp(kar) * 100) / 100}"/>`;
  document.getElementById('sahne').innerHTML = s;
  return i;
};
