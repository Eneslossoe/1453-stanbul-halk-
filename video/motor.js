// ===== Zaman çizelgesi motoru =====
// window.TIMELINE (build/timeline.js) + SAHNELER (sahneler.js) -> renderAt(t)
const GECIS = 0.4;  // sahneler arası çapraz geçiş (sn)

const RUTBE_BOLUM = {
  'Balıkçı': [1, 'Yoksul Balıkçı', 'balikci'], 'Keşiş': [2, 'Keşiş', 'kesis'], 'Asker': [3, 'Sur Askeri', 'asker'],
  'Tüccar': [4, 'Venedikli Tüccar', 'tuccar'], 'Soylu': [5, 'Bizans Soylusu', 'soylu'], 'İmparator': [6, 'İmparator', 'imparator'],
};
// rütbenin son sahnesinde gösterilen "hayatta kalma şansı" göstergesi
const SANS = { b11: [2, 'ORTA'], k08: [2, 'ORTA'], a09: [1, 'DÜŞÜK'], t08: [3, 'YÜKSEK'], s05: [1, 'DÜŞÜK'], i07: [0, 'YOK'] };

function sahneCiz(seg, tl) {
  const fn = SAHNELER[seg.sahne];
  _gid = 0;
  const lt = clamp(tl, 0, seg.sure + 1);
  if (!fn) return `<rect width="${W}" height="${H}" fill="#333"/>` + yazi('SAHNE YOK: ' + seg.sahne, W / 2, H / 2, { fs: 60 });
  return fn(lt, seg.sure, seg.p || {}, seg);
}

function rutbeRozeti(seg, t) {
  const r = RUTBE_BOLUM[seg.bolum];
  if (!r || seg.sahne === 'rutbe_kart') return '';
  const [n, ad] = r;
  const k = 1;
  let s = `<rect x="28" y="26" width="${ad.length * 22 + 250}" height="70" rx="35" fill="rgba(20,24,48,.82)" stroke="#E2B54B" stroke-width="4"/>`;
  s += yazi(`RÜTBE ${n}/6`, 58, 62, { fs: 26, anc: 'start', renk: '#E2B54B', fw: 900 });
  s += `<line x1="212" y1="42" x2="212" y2="82" stroke="#E2B54B" stroke-width="3"/>`;
  s += yazi(ad.toLocaleUpperCase('tr'), 232, 62, { fs: 30, anc: 'start', renk: '#FFF4DC', fw: 900 });
  return op(k, s);
}

function sansGostergesi(seg, tl) {
  const v = SANS[seg.id];
  if (!v) return '';
  const t0 = seg.sure - 4.2;
  const k = ap(tl, t0, .5, easeBack);
  if (k <= 0) return '';
  const [lvl, txt] = v;
  let s = `<rect x="-300" y="-95" width="600" height="190" rx="28" fill="rgba(20,24,48,.9)" stroke="#E2B54B" stroke-width="6"/>`;
  s += yazi('HAYATTA KALMA ŞANSI', 0, -50, { fs: 34, renk: '#E2B54B', fw: 900 });
  const renkler = ['#FF5A5A', '#D9432F', '#E8A33A', '#3FAE5A'];
  for (let i = 0; i < 4; i++) {
    const dolu = i < lvl && tl > t0 + .4 + i * .2;
    s += `<rect x="${-250 + i * 128}" y="-12" width="112" height="44" rx="10" fill="${dolu ? renkler[lvl] : '#3A3F5A'}" stroke="#FFF4DC" stroke-width="3"/>`;
  }
  s += yazi(txt, 0, 70, { fs: 34, renk: renkler[lvl], fw: 900 });
  return G(tr(W - 360, H - 170, k * .9), s);
}

window.renderAt = function (T) {
  const TL = window.TIMELINE.segmentler;
  let i = TL.length - 1;
  for (let j = 0; j < TL.length; j++) if (T < TL[j].bas + TL[j].sure) { i = j; break; }
  const seg = TL[i], tl = T - seg.bas;
  let svg = sahneCiz(seg, tl);
  // çapraz geçiş: yeni sahne ilk GECIS saniyede önceki sahnenin üstüne belirir
  if (i > 0 && tl < GECIS && seg.sahne !== 'rutbe_kart' && TL[i - 1].sahne !== 'rutbe_kart') {
    const prev = TL[i - 1];
    svg = sahneCiz(prev, prev.sure + tl) + op(easeIO(tl / GECIS), svg);
  }
  // rütbe kartına giriş/çıkış: kısa beyaz flaş
  let flas = 0;
  if (seg.sahne === 'rutbe_kart' && tl < .25) flas = 1 - tl / .25;
  if (i > 0 && TL[i - 1].sahne === 'rutbe_kart' && tl < .25) flas = 1 - tl / .25;
  svg += vinyet();
  svg += rutbeRozeti(seg, tl);
  svg += sansGostergesi(seg, tl);
  if (flas > 0) svg += `<rect width="${W}" height="${H}" fill="#FFF8E8" opacity="${f(flas * 100) / 100}"/>`;
  // açılış/kapanış kararması
  const tot = window.TIMELINE.toplam;
  const kar = Math.max(1 - T / .8, (T - (tot - 1.2)) / 1.2);
  if (kar > 0) svg += `<rect width="${W}" height="${H}" fill="#000" opacity="${f(clamp(kar) * 100) / 100}"/>`;
  document.getElementById('sahne').innerHTML = svg;
  return i;
};

window.renderSahne = function (ad, tl, d, p) {
  _gid = 0;
  const seg = { sahne: ad, sure: d || 10, p: p || {}, bolum: '', id: 'test' };
  document.getElementById('sahne').innerHTML = sahneCiz(seg, tl) + vinyet();
};

// timeline'daki bir segmenti yerel zamanda çiz (önizleme için)
window.renderId = function (id, tl) {
  const seg = window.TIMELINE.segmentler.find(s => s.id === id);
  return window.renderAt(seg.bas + tl);
};
