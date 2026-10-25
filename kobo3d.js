// kobo3d.js — workshop rooms with depth, drawn as SVG projections (no WebGL needed): wooden joints that come apart only in the free
// direction (kumiki), and the pop-up card whose step is a parallelogram of the cut length. Loaded last; it runs the first key check.

const KO3 = {
  kumi: tx('[組木|くみき]', 'Wooden joints', '组木'), kumiTxt: tx('くぎを使わない木の組み方。どの木が、どの向きに動く?', 'Joints with no nails: which piece moves, and which way?', '不用钉子的木结构：哪块木头能往哪边动？'),
  kumiKey: tx('形の島「サイコロ工場」のマスターバッジ(立体を頭の中で動かせるしるし)をもらったら', 'Once you earn the “Dice Factory” mastery badge on the Shape Isle (you can turn solids in your head)', '拿到形岛「骰子工厂」的大师徽章（能在脑中转动立体）后'),
  pick: tx('木をタップして えらび、矢じるしで動かそう。', 'Tap a piece to pick it, then move it with the arrows.', '点一块木头选中，再用箭头移动。'),
  khint1: tx('うすく光っている木が、いま動ける木だよ。', 'The faintly glowing pieces can move now.', '微微发光的木头现在能动。'), khint2: tx('えらんだ木が動ける向きの矢じるしが 緑になったよ。', 'The arrows that work for the piece you picked are now green.', '选中的木头能走的方向，箭头变绿了。'),
  turn: tx('見る向きをかえる', 'Turn the view', '换个角度看'), bump: tx('ぶつかって 動かない。', 'It bumps into something.', '撞到了，动不了。'), off: tx('はずれた!', 'It came off!', '拿下来了！'),
  kdone: tx('ばらばらにできた! {k}手。', 'Taken apart in {k} moves!', '拆开了！用了{k}步。'), kmin: tx('いちばん少ない手数は {m}手。', 'The fewest is {m} moves.', '最少{m}步。'),
  k1: tx('ありつぎ', 'Dovetail', '燕尾榫'), k2: tx('いげた', 'Crossed frame', '井字架'), k3: tx('サイコロ組木', 'Dice puzzle', '骰子组木'),
  w1: tx('はばの広い頭が、細い首の所で ひっかかる。引っぱっても ぬけないが、横(板のあつみの向き)には すっと ぬける。大工さんは、力のかかる向きに ぬけないよう、この形を使う(ここでは、ななめの面を 四角い ブロックで かんたんにしているよ)。', 'The wide head catches at the narrow neck: pulling will not get it out, but it slides out sideways (across the board). Carpenters use this shape so a joint cannot come out in the direction it is pulled (here the slanted sides are simplified into square blocks).', '宽的头卡在窄的脖子处：往外拉拉不出来，但能沿木板厚度方向滑出来。木匠用这个形状，让榫头在受力方向上拔不出来（这里把斜面简化成了方块）。'),
  w2: tx('切りこみに はめると、上の木が 下の木を おさえる。上の木から 取らないと、下の木は 動けない。組むときは 反対に、下の木から ならべる。', 'Notched together, the upper sticks hold the lower ones down. Take the top ones off first; to build it, lay the bottom ones first.', '开槽嵌在一起后，上面的木条压住下面的。要先拿上面的，下面的才能动；组装时反过来，先放下面的。'),
  w3: tx('一つの木だけが はじめに動ける「かぎ」の木。それを ずらすと、つぎの木の通り道が あく。くぎを使わずに、動ける向きを 1つずつ ふさいで止めている。', 'Only one “key” piece can move at first. Moving it opens a path for the next. No nails: each piece is stopped by blocking its directions one by one.', '一开始只有一块「钥匙」木头能动。挪开它，下一块的路就通了。不用钉子，靠把每个方向一一堵住来固定。'),
  // pop-up card
  card: tx('とびだすカード', 'Pop-up card', '立体贺卡'), cardTxt: tx('切りこみを入れて、とびだす だんを作ろう', 'Cut slits and make steps pop up', '剪开口子，做出会弹起来的台阶'),
  flat: tx('ひらいた紙: 赤=切る、点線=折る(だんの まん中は 反対に折る)', 'Flat sheet: red = cut, dashed = fold (the middle of each step folds the other way)', '展开的纸：红线＝剪，虚线＝折（台阶中间反着折）'),
  cardKey: tx('形の島「サイコロ工場」で、平らな紙(展開図)が 立体になるしくみを学んだら', 'Once you have learned at “Dice Factory” (Shape Isle) how a flat net becomes a solid', '在形岛「骰子工厂」学会平面展开图怎样变成立体后'),
  angle: tx('カードの開き方', 'How far open', '打开的角度'), addTab: tx('だんを ふやす', 'Add a step', '加一个台阶'), delTab: tx('だんを へらす', 'Remove a step', '减一个台阶'),
  len: tx('切りこみの長さ', 'Slit length', '口子长度'), pos: tx('場所', 'Position', '位置'), wid: tx('はば', 'Width', '宽度'), sticker: tx('シール', 'Sticker', '贴纸'),
  over: tx('切りこみが長すぎて、カードを閉じると はみ出すよ(二つ折りにしたカードの、おくゆきの半分まで)。', 'The slit is too long: it will stick out when the card is closed (keep it to half the depth of the folded card).', '口子太长了，合上卡片时会露出来（最多到对折后卡片深度的一半）。'),
  clash: tx('だんが かさなっているよ。場所をずらそう。', 'Two steps overlap — move one.', '台阶重叠了，挪开一点。'),
  cWhy: tx('切りこみの長さが、とびだす だんの 高さと おくゆきになる。横から見ると、開いている間 だんは 平行四辺形で、直角に開いたときは 正方形になる。閉じると だんは 切りこみの2倍の所まで のびるので、二つ折りにしたカードの おくゆきの半分より長いと はみ出す。', 'The slit length becomes both the height and the depth of the step. Seen from the side, while the card is open the step is a parallelogram, and a square when the card is at a right angle. Closed, the step reaches twice the slit length, so a slit longer than half the depth of the folded card sticks out.', '口子的长度，就是弹出台阶的高度和深度。从侧面看，卡片打开时台阶是平行四边形，开到直角时是正方形。合上时台阶会伸到口子长度的2倍处，所以口子超过对折后卡片深度的一半就会露出来。'),
};

// ---------- kumiki: rigid voxel pieces that slide one unit at a time ----------
const KDIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const box = (x0, x1, y0, y1, z0, z1, not = []) => { const out = []; for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) if (!not.some((c) => c[0] === x && c[1] === y && c[2] === z)) out.push([x, y, z]); return out; };
const KUMI = [
  { n: KO3.k1, why: KO3.w1, pieces: [   // tail (head wider than its neck) and socket board
    { col: '#e0b866', cells: [...box(0, 5, -3, -1, 0, 1), ...box(2, 3, 0, 1, 0, 1), ...box(1, 4, 2, 3, 0, 1)] },
    { col: '#b5651d', cells: [...box(0, 1, 0, 1, 0, 1), ...box(4, 5, 0, 1, 0, 1), ...box(0, 0, 2, 3, 0, 1), ...box(5, 5, 2, 3, 0, 1), ...box(0, 5, 4, 4, 0, 1)] }] },   // one board: its two sides join at the back (astra R11-04)
  { n: KO3.k2, why: KO3.w2, pieces: [   // two lower sticks notched on top, two upper sticks notched underneath, on a table
    { col: '#d9b38c', fixed: true, cells: box(-1, 6, -1, 6, -1, -1) },
    { col: '#e0b866', cells: box(0, 5, 1, 1, 0, 1, [[1, 1, 1], [4, 1, 1]]) }, { col: '#e0b866', cells: box(0, 5, 4, 4, 0, 1, [[1, 4, 1], [4, 4, 1]]) },
    { col: '#b5651d', cells: box(1, 1, 0, 5, 0, 1, [[1, 1, 0], [1, 4, 0]]) }, { col: '#b5651d', cells: box(4, 4, 0, 5, 0, 1, [[4, 1, 0], [4, 4, 0]]) }] },
  { n: KO3.k3, why: KO3.w3, pieces: [   // a 3×3×3 cube in three pieces (found by search: only one piece can move first, 6 moves at best)
    { col: '#e0b866', cells: [[0, 2, 1], [0, 2, 0], [0, 1, 1], [0, 1, 2], [0, 2, 2], [0, 0, 1], [0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 0, 1], [2, 0, 2]] },
    { col: '#b5651d', cells: [[2, 2, 2], [1, 2, 2], [1, 1, 2], [2, 1, 2], [2, 2, 1], [2, 2, 0], [2, 1, 0], [1, 1, 0], [0, 1, 0]] },
    { col: '#8f9e5c', cells: [[1, 2, 1], [1, 2, 0], [1, 1, 1], [2, 1, 1], [1, 0, 1], [1, 0, 2], [0, 0, 2]] }] },
];
const kkey = (c) => c.join(',');
const kumiCells = (P, off, i) => P[i].cells.map((c) => c.map((v, k) => v + off[i][k]));
function kumiCan(P, st, i, d) {   // can piece i slide one unit along d? (st: {off, out})
  if (P[i].fixed || st.out[i]) return false; const occ = new Set();
  P.forEach((p, j) => { if (j !== i && !st.out[j]) kumiCells(P, st.off, j).forEach((c) => occ.add(kkey(c))); });
  const no = st.off[i].map((v, k) => v + d[k]); return no.every((v) => Math.abs(v) <= 6) && !P[i].cells.some((c) => occ.has(kkey(c.map((v, k) => v + no[k]))));
}
function kumiMove(P, st, i, d) {   // returns the new state; a piece whose box no longer overlaps the rest's box is "off"
  const t = { off: st.off.map((o, j) => (j === i ? o.map((v, k) => v + d[k]) : o)), out: st.out.slice() };
  const bb = (cs) => [0, 1, 2].map((k) => [Math.min(...cs.map((c) => c[k])), Math.max(...cs.map((c) => c[k]))]);
  const rest = [].concat(...P.map((p, j) => (j === i || t.out[j] ? [] : kumiCells(P, t.off, j))));
  if (rest.length) { const a = bb(kumiCells(P, t.off, i)), b = bb(rest); if ([0, 1, 2].some((k) => a[k][1] < b[k][0] || a[k][0] > b[k][1])) t.out[i] = true; }
  return t;
}
const kumiDone = (P, st) => P.filter((p, i) => !p.fixed && !st.out[i]).length <= (P.some((p) => p.fixed) ? 0 : 1);
// isometric drawing; view v turns the puzzle by v quarter-turns about the vertical axis
const isoRot = (c, v) => { let [x, y, z] = c; for (let i = 0; i < v; i++) [x, y] = [-y, x]; return [x, y, z]; };
function kumiSVG(P, st, sel, v, size, interactive, movable) {   // movable: per piece, glow it (hint)
  const U = 16, faces = [], occ = new Map();
  P.forEach((p, i) => { if (!st.out[i]) kumiCells(P, st.off, i).forEach((c) => occ.set(kkey(isoRot(c, v)), i)); });
  const pr = ([x, y, z]) => [(x - y) * 0.866 * U, (x + y) * 0.5 * U - z * U];
  const shade = (hex, f) => '#' + [1, 3, 5].map((k) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(k, k + 2), 16) * f))).toString(16).padStart(2, '0')).join('');
  [...occ.entries()].map(([k, i]) => [k.split(',').map(Number), i]).sort((a, b) => a[0][0] + a[0][1] + a[0][2] - (b[0][0] + b[0][1] + b[0][2])).forEach(([[x, y, z], i]) => {
    const col = P[i].col, st2 = sel === i ? ' stroke="#ff3d7f" stroke-width="2"' : movable && movable[i] ? ' stroke="#ffe066" stroke-width="2"' : ' stroke="#00000040" stroke-width=".7"', q = (pts) => pts.map((p) => pr(p).map((n) => n.toFixed(1)).join(',')).join(' ');
    if (occ.get(kkey([x, y, z + 1])) !== i) faces.push(`<polygon data-pc="${i}" points="${q([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]])}" fill="${shade(col, 1.08)}"${st2}/>`);
    if (occ.get(kkey([x + 1, y, z])) !== i) faces.push(`<polygon data-pc="${i}" points="${q([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]])}" fill="${shade(col, 0.82)}"${st2}/>`);
    if (occ.get(kkey([x, y + 1, z])) !== i) faces.push(`<polygon data-pc="${i}" points="${q([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]])}" fill="${shade(col, 0.66)}"${st2}/>`); });
  const all = [...occ.keys()].map((k) => pr(k.split(',').map(Number))), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const vb = all.length ? [Math.min(...xs) - 3 * U, Math.min(...ys) - 3 * U, Math.max(...xs) - Math.min(...xs) + 6 * U, Math.max(...ys) - Math.min(...ys) + 6 * U] : [0, 0, 10, 10];
  return `<svg viewBox="${vb.map((n) => n.toFixed(1)).join(' ')}" width="${size}" height="${size}" ${interactive ? 'id="kumi" style="touch-action:manipulation;cursor:pointer"' : ''}>${faces.join('')}</svg>`;
}
const KM = { lv: 0, st: null, sel: null, v: 0, moves: 0, hint: 0 };
function koboKumi() {
  const L3 = KUMI[KM.lv], P = L3.pieces; if (!KM.st) { KM.st = { off: P.map(() => [0, 0, 0]), out: P.map(() => false) }; KM.moves = 0; KM.sel = null; }
  // arrows drawn along the projected axes of the current view
  const arrow = (d, i) => { const r = isoRot(d, KM.v), sx = (r[0] - r[1]) * 0.866, sy = (r[0] + r[1]) * 0.5 - r[2], m = Math.hypot(sx, sy) || 1;
    const ux = sx / m, uy = sy / m, ok = KM.hint >= 2 && KM.sel != null && kumiCan(P, KM.st, KM.sel, d), tip = [ux * 9, uy * 9], back = [ux * 2, uy * 2], nx = -uy * 5, ny = ux * 5;
    return `<button class="pill" data-kd="${i}" type="button" ${KM.sel == null ? 'disabled' : ''} style="${ok ? 'background:#b9f6ca' : ''}"><svg viewBox="-12 -12 24 24" width="34" height="34"><line x1="${-ux * 9}" y1="${-uy * 9}" x2="${back[0]}" y2="${back[1]}" stroke="#3b3346" stroke-width="2.6" stroke-linecap="round"/><polygon points="${tip.join(',')} ${back[0] + nx},${back[1] + ny} ${back[0] - nx},${back[1] - ny}" fill="#ff6f91"/></svg></button>`; };
  const done = S.kobo.kumi;
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>🪵 ${T(KO3.kumi)}</h2><span class="pill">${T(KOB.moves, { k: KM.moves })}</span></div>
   <div class="stack"><div class="panel"><div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap">${KUMI.map((k, i) => `<button class="pill ${i === KM.lv ? 'on' : ''}" data-kl="${i}" type="button">${i + 1}. ${T(k.n)}${done[i] != null ? ' ✓' : ''}</button>`).join('')}</div>
    <p class="muted" style="text-align:center">${T(KO3.pick)}</p><div class="row" style="justify-content:center">${kumiSVG(P, KM.st, KM.sel, KM.v, 300, true, KM.hint >= 1 ? P.map((p, i) => KDIRS.some((d) => kumiCan(P, KM.st, i, d))) : null)}</div>
    ${KM.hint ? `<p class="muted" style="text-align:center">${[T(KO3.khint1), T(KO3.khint2)].slice(0, KM.hint).join('<br>')}</p>` : ''}
    <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap">${KDIRS.map(arrow).join('')}<button class="pill" id="kv" type="button">🔄 ${T(KO3.turn)}</button><button class="pill" id="kh" type="button">💡 ${T(KOB.hint)}</button><button class="btn ghost" id="krs" type="button">${T(KOB.reset)}</button></div></div>
    ${done[KM.lv] != null ? `<div class="panel"><h3>🔬 ${T(KO2.how)}</h3><p>${T(L3.why)}</p></div>` : ''}</div>`);
  $('#bk').onclick = () => showKobo(null);
  $$('[data-kl]').forEach((b) => b.onclick = () => { KM.lv = +b.dataset.kl; KM.st = null; KM.hint = 0; koboKumi(); });
  $$('#kumi [data-pc]').forEach((p) => p.onclick = () => { KM.sel = +p.dataset.pc; if (P[KM.sel].fixed) KM.sel = null; snd('pop'); koboKumi(); });
  $('#kv').onclick = () => { KM.v = (KM.v + 1) % 4; koboKumi(); };
  $('#kh').onclick = () => { KM.hint = Math.min(2, KM.hint + 1); koboKumi(); };
  $('#krs').onclick = () => { KM.st = null; koboKumi(); };
  $$('[data-kd]').forEach((b) => b.onclick = () => { if (KM.sel == null) return; const d = KDIRS[+b.dataset.kd];
    if (!kumiCan(P, KM.st, KM.sel, d)) { toast(T(KO3.bump)); snd('soft'); return; }
    const was = KM.st.out[KM.sel]; KM.st = kumiMove(P, KM.st, KM.sel, d); KM.moves++; snd('step');
    if (KM.st.out[KM.sel] && !was) { toast(T(KO3.off)); KM.sel = null; }
    if (kumiDone(P, KM.st)) { const first = done[KM.lv] == null; done[KM.lv] = first ? KM.moves : Math.min(done[KM.lv], KM.moves); save(); snd('done'); confetti();
      modal(`<h3>${T(KO3.kdone, { k: KM.moves })}</h3><p>${T(KO3.kmin, { m: KUMI_MIN[KM.lv] })}</p><p>${T(L3.why)}</p>`, [{ t: T(L.close) }]); if (first) koboGive('kumi' + KM.lv); }
    koboKumi(); });
}
const KUMI_MIN = [2, 7, 6];   // fewest moves to take each puzzle apart (checked by BFS in tests/verify_kobo.mjs)
KUMI.forEach((k, i) => { KOBO_ITEMS['kumi' + i] = { n: k.n, face: () => kumiSVG(k.pieces.filter((p) => !p.fixed), { off: k.pieces.map(() => [0, 0, 0]), out: k.pieces.map(() => false) }, null, 0, '80%', false) }; });

// ---------- pop-up card: oblique view; floor goes towards you, the back half opens to angle θ ----------
const CW = 12, CD = 8;   // card width, depth of each half (grid units)
const CR = { tabs: [{ x0: 3, x1: 9, L: 3, who: null }], ang: 90 };
function cardSVG(size) {
  const U = 20, th = CR.ang * Math.PI / 180, u = [Math.cos(th), Math.sin(th)];   // back plane direction in (y, z)
  const P = ([x, y, z]) => [40 + x * U + y * U * 0.45, 230 - z * U + y * U * 0.32].map((n) => n.toFixed(1)).join(',');
  const quad = (a, b, c, d, fill, extra = '') => `<polygon points="${[a, b, c, d].map(P).join(' ')}" fill="${fill}" stroke="#6b5a48" stroke-width="1"${extra}/>`;
  const onBack = (t) => [t * u[0], t * u[1]];
  let floor = quad([0, 0, 0], [CW, 0, 0], [CW, CD, 0], [0, CD, 0], '#fff7e6'), backP = quad([0, ...onBack(0)], [CW, ...onBack(0)], [CW, ...onBack(CD)], [0, ...onBack(CD)], '#ffe9c7');
  let holes = '', tabs = '';
  for (const t of CR.tabs) {
    const B = onBack(t.L), F = [t.L, 0], Tt = [B[0] + F[0], B[1] + F[1]];
    holes += quad([t.x0, 0, 0], [t.x1, 0, 0], [t.x1, t.L, 0], [t.x0, t.L, 0], '#e8d6b8') + quad([t.x0, 0, 0], [t.x1, 0, 0], [t.x1, ...onBack(t.L)], [t.x0, ...onBack(t.L)], '#e8d6b8');
    tabs += quad([t.x0, ...B], [t.x1, ...B], [t.x1, ...Tt], [t.x0, ...Tt], '#ffd6e0') + quad([t.x0, ...Tt], [t.x1, ...Tt], [t.x1, ...F], [t.x0, ...F], '#ffb3c7');
    if (t.who && SPECIES[t.who]) { const p1 = P([t.x0, ...Tt]).split(',').map(Number), p2 = P([t.x1, ...F]).split(',').map(Number), w = Math.abs(p2[0] - p1[0]), h = Math.abs(p2[1] - p1[1]), s = Math.min(w, h) * 0.85;
      if (s > 12) tabs += critter(t.who, 100, { still: true, happy: true }).replace(/^<svg[^>]*?viewBox/, `<svg x="${((p1[0] + p2[0]) / 2 - s / 2).toFixed(1)}" y="${((p1[1] + p2[1]) / 2 - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" viewBox`); }
  }
  const order = CR.ang < 90 ? floor + holes + tabs + backP : backP + floor + holes + tabs;   // a closing card hides the steps behind its back half
  return `<svg viewBox="-50 55 490 295" width="${size}" id="cardsvg" style="max-width:100%;background:#eaf6fb;border-radius:10px">${order}</svg>`;
}
const cardWarn = () => [CR.tabs.some((t) => 2 * t.L > CD) && T(KO3.over), CR.tabs.some((a, i) => CR.tabs.some((b, j) => i < j && a.x0 < b.x1 && b.x0 < a.x1)) && T(KO3.clash)].filter(Boolean);
// the same card flat: red = cut, dashed = fold (the middle of each step folds the other way)
function cardFlat() { const U = 12, o = 6, y = (v) => o + (CD + v) * U;   // v: distance from the middle fold, + towards you
  return `<svg viewBox="0 0 ${CW * U + 2 * o} ${2 * CD * U + 2 * o}" width="${CW * 12 + 12}" style="background:#fffaf0;border-radius:6px"><rect x="${o}" y="${o}" width="${CW * U}" height="${2 * CD * U}" fill="#ffe9c7" stroke="#6b5a48"/>
    <line x1="${o}" y1="${y(0)}" x2="${o + CW * U}" y2="${y(0)}" stroke="#6b5a48" stroke-dasharray="4 3"/>
    ${CR.tabs.map((t) => `<line x1="${o + t.x0 * U}" y1="${y(-t.L)}" x2="${o + t.x0 * U}" y2="${y(t.L)}" stroke="#e53935" stroke-width="2.2"/><line x1="${o + t.x1 * U}" y1="${y(-t.L)}" x2="${o + t.x1 * U}" y2="${y(t.L)}" stroke="#e53935" stroke-width="2.2"/>
      <line x1="${o + t.x0 * U}" y1="${y(-t.L)}" x2="${o + t.x1 * U}" y2="${y(-t.L)}" stroke="#2f80ed" stroke-dasharray="3 2"/><line x1="${o + t.x0 * U}" y1="${y(t.L)}" x2="${o + t.x1 * U}" y2="${y(t.L)}" stroke="#2f80ed" stroke-dasharray="3 2"/>
      <line x1="${o + t.x0 * U}" y1="${y(0)}" x2="${o + t.x1 * U}" y2="${y(0)}" stroke="#ff9f43" stroke-width="2" stroke-dasharray="2 2"/>`).join('')}</svg>`; }
function koboCard() {
  const fr = friendsList(), w = cardWarn();
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>💌 ${T(KO3.card)}</h2></div>
   <div class="stack"><div class="panel"><div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">${cardSVG(400)}<div style="text-align:center">${cardFlat()}<div class="muted" style="font-size:.8rem">${T(KO3.flat)}</div></div></div>
    <label class="row" style="justify-content:center;gap:8px"><span>${T(KO3.angle)}</span><input type="range" min="0" max="180" step="5" value="${CR.ang}" id="cang" style="width:220px"><b>${CR.ang}°</b></label>
    ${w.map((m) => `<p style="color:#c0392b;font-weight:800;text-align:center">⚠️ ${m}</p>`).join('')}
    ${CR.tabs.map((t, i) => `<div class="panel" style="padding:8px;margin-top:6px"><div class="row" style="gap:6px;flex-wrap:wrap;align-items:center"><b>#${i + 1}</b>
      <span>${T(KO3.len)} <button class="pill" data-ct="${i}|L|-1" type="button">−</button> ${t.L} <button class="pill" data-ct="${i}|L|1" type="button">＋</button></span>
      <span>${T(KO3.pos)} <button class="pill" data-ct="${i}|x|-1" type="button">◀</button><button class="pill" data-ct="${i}|x|1" type="button">▶</button></span>
      <span>${T(KO3.wid)} <button class="pill" data-ct="${i}|w|-1" type="button">−</button> ${t.x1 - t.x0} <button class="pill" data-ct="${i}|w|1" type="button">＋</button></span>
      <span>${T(KO3.sticker)} <select data-cs="${i}"><option value="">—</option>${fr.map((k) => `<option value="${k}" ${t.who === k ? 'selected' : ''}>${T(SPECIES[k].name).replace(/<[^>]+>/g, '')}</option>`).join('')}</select></span></div></div>`).join('')}
    <div class="row" style="justify-content:center;gap:8px;margin-top:8px">${CR.tabs.length < 3 ? `<button class="btn ghost" id="cadd" type="button">＋ ${T(KO3.addTab)}</button>` : ''}${CR.tabs.length > 1 ? `<button class="btn ghost" id="cdel" type="button">− ${T(KO3.delTab)}</button>` : ''}<button class="btn" id="csave" type="button">✨ ${T(KOB.done)}</button></div></div>
    <div class="panel"><h3>🔬 ${T(KO2.how)}</h3><p>${T(KO3.cWhy)}</p></div></div>`);
  $('#bk').onclick = () => showKobo(null);
  $('#cang').oninput = (e) => { CR.ang = +e.target.value; $('#cardsvg').outerHTML = cardSVG(400); e.target.nextElementSibling.textContent = CR.ang + '°'; };
  $$('[data-ct]').forEach((b) => b.onclick = () => { const [i, f, s] = b.dataset.ct.split('|'), t = CR.tabs[+i], d = +s;
    if (f === 'L') t.L = Math.max(1, Math.min(CD, t.L + d));
    if (f === 'x' && t.x0 + d >= 0 && t.x1 + d <= CW) { t.x0 += d; t.x1 += d; }
    if (f === 'w' && t.x1 + d > t.x0 && t.x1 + d <= CW) t.x1 += d;
    snd('pop'); koboCard(); });
  $$('[data-cs]').forEach((s) => s.onchange = () => { CR.tabs[+s.dataset.cs].who = s.value || null; koboCard(); });
  const on = (id, f) => { const b = $(id); if (b) b.onclick = f; };
  on('#cadd', () => { CR.tabs.push({ x0: 0, x1: 2, L: 2, who: null }); koboCard(); }); on('#cdel', () => { CR.tabs.pop(); koboCard(); });
  on('#csave', () => svgToCanvas($('#cardsvg'), 600, (cv) => koboSaveWork(cv, () => koboCard())));
}

KOBO_FRESH.push(() => { Object.assign(KM, { st: null, sel: null, moves: 0, hint: 0 }); CR.tabs = [{ x0: 3, x1: 9, L: 3, who: null }]; CR.ang = 90; });

// ---------- keys and rooms; then the first check, now that every room file is loaded ----------
Object.assign(KEYS, { card: () => !!(S.cleared || {}).g4, kumi: () => !!(S.badges || {}).g4 });
KOBO_ROOMS.push({ id: 'card', e: '💌', n: KO3.card, d: KO3.cardTxt, key: 'card', why: KO3.cardKey, show: koboCard }, { id: 'kumi', e: '🪵', n: KO3.kumi, d: KO3.kumiTxt, key: 'kumi', why: KO3.kumiKey, show: koboKumi });
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(KO3)];
koboCheck(true);
