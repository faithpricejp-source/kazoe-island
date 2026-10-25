// kobo2.js — more workshop rooms (needs kobo.js): the secret box with her own yosegi pattern, woodblock printing, folded-paper cutting,
// and coloured light. Each teaches one mechanism: panels that hold each other (box), relief printing reverses left/right and prints the
// surface you did not carve (hanga), every fold becomes a line of symmetry (kirigami), light adds up to white while filters take away (lamp).

const KO2 = {
  // secret box
  box: tx('ひみつ箱', 'Secret box', '秘密箱'), boxTxt: tx('寄木のもようを作って、からくりの箱をあけよう', 'Design a yosegi pattern, then open the trick box', '设计寄木花纹，再打开机关箱'),
  boxKey: tx('白地図の島「都道府県の港」で 都道府県の形(神奈川県も)を見分けられるようになったら。寄木細工は 神奈川県の箱根の伝統工芸だよ。', 'Once you can tell the prefecture shapes (Kanagawa too) at “Prefecture Port” on the Map Isle. Yosegi woodwork is a traditional craft of Hakone in Kanagawa.', '在白地图岛「都道府县港」学会认出都道府县的形状（包括神奈川县）后。寄木细工是神奈川县箱根的传统工艺。'),
  pattern: tx('[寄木|よせぎ]のもよう', 'Yosegi pattern', '寄木花纹'), patTip: tx('三角をタップすると 木の色がかわる。もようは くり返して ならべると 大きなもようになる。', 'Tap a triangle to change the wood. Repeat the tile and a big pattern appears.', '点三角形换木头颜色。小图案重复排列，就成了大花纹。'),
  tile: tx('ならべ方', 'Tiling', '排列方式'), same: tx('同じ向き', 'Same way', '同一方向'), flip: tx('かがみうつし', 'Mirrored', '镜像'),
  puzzle: tx('からくり', 'The trick', '机关'), level: tx('板を{k}回動かす箱', 'Box with {k} panel moves', '要动{k}次板的箱子'),
  boxRule: tx('板には 1〜4の番号がある。どの板も、1つ前の番号の板を 追いこせないし、その板から 1マスより 後ろに はなれることも できない(1ばんの板だけは 前に板がない)。', 'The panels are numbered 1 to 4. A panel can never get ahead of the panel numbered before it, and can never fall more than one step behind it (panel 1 has no panel before it).', '板上有1到4的编号。每块板都不能超过编号在它前面的那块板，也不能落后那块板超过一格（1号板前面没有板）。'),
  stuck: tx('ガタッ…{b}ばんの板に ひっかかって動かない。', 'Clunk… it is caught on panel {b}.', '咔哒……卡在{b}号板上动不了。'),
  lid: tx('ふたを あける', 'Open the lid', '打开盖子'), boxOpen: tx('あいた! 板を{k}回動かして ひみつ箱をあけたよ。', 'Open! You opened the secret box in {k} moves.', '打开了！动了{k}次板就打开了秘密箱。'),
  letter: tx('{f}からの手紙: 「1まいずつ 少しずつ ずらすと、となりの板が動けるようになる。これが からくりのしくみだよ。」', 'A letter from {f}: “Move one panel a little at a time and the next one can move. That is the whole trick.”', '{f}的来信：“一块一块慢慢挪，旁边的板就能动了。这就是机关的原理。”'),
  boxMin: tx('いちばん少ない手数は {m}回。', 'The fewest is {m} moves.', '最少要{m}次。'), how: tx('しくみ', 'How it works', '原理'),
  // woodblock
  hanga: tx('はんが工房', 'Print shop', '版画工坊'), hangaTxt: tx('木の板をほって、インクをつけて、すってみよう', 'Carve a block, ink it, print it', '刻木板、上墨、拓印'),
  hangaKey: tx('理科の島「かがみの池」で、鏡にうつると 左右がどうなるかを学んだら', 'Once you have learned at “Mirror Pond” (Science Isle) what a mirror does to left and right', '在理科岛「镜池」学会镜子会把左右怎样之后'),
  carve: tx('ほる', 'Carve', '刻'), ink: tx('インクをつける', 'Ink it', '上墨'), print: tx('紙をのせて する', 'Print', '拓印'), again: tx('もう一度ほる', 'Carve more', '再刻'),
  sankaku: tx('[三角刀|さんかくとう](細い線)', 'V-gouge (thin)', '三角刀（细线）'), maru: tx('[丸刀|まるとう]', 'U-gouge', '圆刀'), hira: tx('[平刀|ひらとう](広くけずる)', 'Flat chisel (wide)', '平刀（大面积）'),
  printed: tx('すれた! 左右が反対で、ほった所は白く のこったね。', 'Printed! Left and right are swapped, and what you carved stayed white.', '印好了！左右反了，刻掉的地方留白了。'),
  hWhy: tx('インクがつくのは、ほらずに のこした面だけ。ほった線は へこんでいて インクがつかないので 白くなる。紙を版木に のせて うらからこするので、すった絵は 左右が反対になる。', 'Ink only sits on the surface you did not carve. Carved lines are lower, get no ink and stay white. The paper lies face-down on the block, so the print is the mirror image.', '墨只沾在没刻的表面上。刻掉的线凹下去，沾不到墨，所以留白。纸是扣在版上从背面擦的，所以印出来左右相反。'),
  quiz: tx('この版木をすると、どれになる?', 'Which print will this block make?', '这块版印出来是哪一个？'), qOk: tx('せいかい! ', 'Right! ', '对了！'),
  qMirror: tx('すると 左右が反対になるよ。', 'Printing swaps left and right.', '印出来左右会相反。'), qColor: tx('インクがつくのは ほっていない所。ほった文字は 白くのこるよ。', 'Ink goes on the part you did not carve; the carved letter stays white.', '墨沾在没刻的地方，刻掉的字是白的。'),
  qWhy: tx('左右が反対で、ほった文字が白くなる。', 'Mirrored, and the carved letter is white.', '左右相反，刻掉的字是白的。'),
  nextQ: tx('つぎの もんだい', 'Next one', '下一题'),
  // kirigami
  kiri: tx('きりがみ', 'Paper cutting', '剪纸'), kiriTxt: tx('折って切って ひらくと…?', 'Fold, cut, unfold…?', '折一折、剪一剪、打开看看……'),
  kiriKey: tx('形の島で 場所を1つ やりとげて、形をよく見る目が ついたら', 'Once you have finished a place on the Shape Isle and have an eye for shapes', '在形岛完成一个地点、练出看形状的眼睛后'),
  fold: tx('折り方', 'Fold', '折法'), f2: tx('半分(1回)', 'In half (once)', '对折（1次）'), f4: tx('4つ折り(2回)', 'In four (twice)', '四折（2次）'), f8: tx('三角に3回', 'Triangle (3 times)', '三角折（3次）'),
  edge: tx('もう それ以上は 動かないよ。', 'It will not go any further.', '已经不能再往那边动了。'),
  newPaper: tx('新しい紙で はじめるよ。', 'Starting on a new sheet.', '换一张新纸开始。'),
  cutTip: tx('折った紙の上を なぞると、そこが切りとられるよ。', 'Trace on the folded paper to cut that part out.', '在折好的纸上描一圈，那块就会被剪掉。'),
  open: tx('ひらく', 'Unfold', '打开'), refold: tx('折りなおす', 'Fold again', '重新折'), axes: tx('折り目の線(対称の軸)を見る', 'Show the fold lines (lines of symmetry)', '看折痕（对称轴）'),
  kWhy: tx('折り目は 対称の[軸|じく]になる。この折り方で かならずできる軸は、半分に折ると1本、4つ折りで2本、三角に3回折ると4本(もようによっては、もっと軸がふえることもある)。1か所 切っただけでも、ひらくと 紙が重なっていた まい数(2・4・8まい)だけ、かがみうつしに ふえる。', 'Each fold becomes a line of symmetry. This fold always gives at least 1 line (in half), 2 (in four) or 4 (triangle) — some patterns have even more. One cut is copied as a mirror image once for every layer of paper: 2, 4 or 8 times.', '折痕会成为对称轴。这种折法一定会有的对称轴：对折1条、四折2条、三角折4条（有的图案还会更多）。只剪一处，打开后会按纸叠的层数（2、4、8层）镜像复制。'),
  // lamp
  lamp: tx('ひかりのランプ', 'Light lamp', '彩色灯笼'), lampTxt: tx('色の光を かさねてみよう', 'Overlap coloured lights', '把彩色的光叠在一起'),
  lampKey: tx('理科の島「かがみの池」で光を学んで、えのぐ研究所で 色を1つ 作れたら', 'Once you have studied light at “Mirror Pond” and made a colour in the paint lab', '在理科岛「镜池」学过光、又在颜料研究所调出一种颜色后'),
  lights: tx('光を かさねる', 'Overlap lights', '叠加光'), films: tx('セロハンを かさねる', 'Stack cellophane', '叠加玻璃纸'),
  dragTip: tx('光の まるを ドラッグして かさねてみよう。', 'Drag the circles of light so they overlap.', '拖动光圈让它们重叠。'), filmTip: tx('白いライトの前に セロハンを かさねよう。', 'Put cellophane sheets in front of the white light.', '在白色灯前叠上玻璃纸。'),
  make: tx('作ってみよう', 'Try to make', '试着做出'), twoFilms: tx('セロハンを2まい以上 かさねて作ろう', 'Use two or more sheets', '叠两张以上玻璃纸来做'), madeIt: tx('できた! 「{c}」', 'You made “{c}”!', '做出来了！「{c}」'),
  lWhy: tx('光は かさねるほど 明るくなる。赤と緑の光で黄色、3つ ぜんぶで白。セロハンは 光の一部を 通さないので、かさねるほど 暗くなる。このゲームの黄色と青のセロハンでは 緑だけが のこり、赤と青では ほとんど通らない。本物のセロハンでは、どの光を通すかで 色が少しかわるよ。', 'Lights add up and get brighter: red + green light is yellow, all three make white. Cellophane blocks part of the light, so stacking sheets makes it darker. With this game’s yellow and blue sheets only green gets through; red and blue let almost nothing through. Real cellophane varies with which light it lets through.', '光越叠越亮：红光加绿光是黄色，三种一起是白色。玻璃纸会挡住一部分光，所以越叠越暗。这个游戏里的黄、蓝玻璃纸叠在一起只剩绿光，红加蓝几乎什么都透不过。真的玻璃纸透过哪些光会有点不同。'),
  red: tx('赤', 'red', '红'), green: tx('緑', 'green', '绿'), blue: tx('青', 'blue', '蓝'), yellow: tx('黄', 'yellow', '黄'),
  cYellow: tx('黄色', 'yellow', '黄色'), cMagenta: tx('赤むらさき', 'magenta', '品红'), cCyan: tx('水色', 'cyan', '青色'), cWhite: tx('白', 'white', '白色'),
  cGreen: tx('緑', 'green', '绿色'), cRed: tx('赤', 'red', '红色'), cBlack: tx('ほとんど黒', 'almost black', '几乎是黑色'),
};

// ---------- secret box ----------
const WOODS = ['#f3e6c4', '#e0b866', '#b5651d', '#6b4226', '#8f9e5c'];
const BOX_PRESET = [0, 3, 3, 0, 2, 1, 1, 2, 2, 1, 1, 2, 0, 3, 3, 0, 0, 3, 3, 0, 2, 1, 1, 2, 2, 1, 1, 2, 0, 3, 3, 0];   // 4×4 cells × 2 triangles
const BOX_N = 4, BOX_LEVELS = [1, 2, 3];   // 4 panels; each slides 1, 2 or 3 steps
// panels are caught on their neighbours: panel j may be at most one step behind panel j−1 and never ahead of it
const boxOk = (pos) => pos.every((p, j) => j === 0 || (pos[j - 1] - p >= 0 && pos[j - 1] - p <= 1));
const boxCan = (pos, j, dir, d) => { const q = pos.slice(); q[j] += dir; return q[j] >= 0 && q[j] <= d && boxOk(q); };
const BX = { d: 1, pos: null, moves: 0, open: false, flash: null };
// which panel stops panel j moving by dir: the one before it, or else the one after it
const boxBlocker = (pos, j, dir) => { const q = pos.slice(); q[j] += dir; if (q[j] < 0 || q[j] > BX.d) return null; return j > 0 && !(q[j - 1] - q[j] >= 0 && q[j - 1] - q[j] <= 1) ? j - 1 : j + 1; };
function yosegiSVG(pat, cells, size, flip) {   // cells×cells grid repeating the 4×4 tile
  const u = size / cells; let out = '';
  for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) {
    const fx = flip && Math.floor(x / 4) % 2, fy = flip && Math.floor(y / 4) % 2, tcx = fx ? 3 - x % 4 : x % 4, tcy = fy ? 3 - y % 4 : y % 4, i = (tcy * 4 + tcx) * 2;
    // the two triangles of a tile cell (split by its "/" diagonal), mirrored together with the tile
    const tri = (T3) => T3.map(([px, py]) => `${(x + (fx ? 1 - px : px)) * u},${(y + (fy ? 1 - py : py)) * u}`).join(' ');
    out += `<polygon points="${tri([[0, 0], [1, 0], [0, 1]])}" fill="${WOODS[pat[i]]}" stroke="#00000018" stroke-width=".5"/><polygon points="${tri([[1, 0], [1, 1], [0, 1]])}" fill="${WOODS[pat[i + 1]]}" stroke="#00000018" stroke-width=".5"/>`; }
  return out;
}
function koboBox() {
  const st = S.kobo.box; if (!st.pat) st.pat = BOX_PRESET.slice(); if (st.flip == null) st.flip = 1;
  if (!BX.pos || BX.pos.length !== BOX_N) { BX.pos = Array(BOX_N).fill(0); BX.moves = 0; BX.open = false; }
  const d = BX.d, all = BX.pos.every((p) => p === d), step = 34 / d;
  // top view: lid in the middle, 4 panels around it, each shifted along its side by its position
  const pnl = (j) => { const o = BX.pos[j] * step; const r = [[60 + o, 20, 180, 36], [244, 60 + o, 36, 180], [60 - o, 244, 180, 36], [20, 60 - o, 36, 180]][j];
    return `<g><rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="4" fill="url(#yg)" stroke="${BX.flash === j ? '#ff3d3d' : '#6b4226'}" stroke-width="${BX.flash === j ? 6 : 2}"/>
      <circle cx="${r[0] + r[2] / 2}" cy="${r[1] + r[3] / 2}" r="13" fill="#fffdf5" stroke="#6b4226"/><text x="${r[0] + r[2] / 2}" y="${r[1] + r[3] / 2 + 6}" text-anchor="middle" font-size="17" font-weight="900" fill="#3b3346">${j + 1}</text>
      ${[-1, 1].map((dir) => { const c = [[150 + dir * 34, 2], [298, 150 + dir * 34], [150 + dir * 34, 298], [2, 150 + dir * 34]][j];   // arrows sit outside the middle of each panel
        const rot = j % 2 ? (dir > 0 ? 90 : -90) : (dir > 0 ? 0 : 180), real = j >= 2 ? -dir : dir;   // panels 2 and 3 run the other way round the box
        return `<g data-bp="${j}|${real}" style="cursor:pointer" transform="translate(${c[0]} ${c[1]}) rotate(${rot})"><circle r="22" fill="transparent"/><circle r="15" fill="#ffe9b0" stroke="#a8743f"/><path d="M-4 -6 L5 0 L-4 6Z" fill="#6b4226"/></g>`; }).join('')}</g>`; };
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>📦 ${T(KO2.box)}</h2><span class="pill">${T(KOB.moves, { k: BX.moves })}</span></div>
   <div class="stack"><div class="panel"><h3>🪵 ${T(KO2.pattern)}</h3><p class="muted" style="margin-top:0">${T(KO2.patTip)}</p>
    <div class="row" style="gap:16px;flex-wrap:wrap;justify-content:center"><svg viewBox="0 0 160 160" width="160" height="160" id="ytile" style="touch-action:manipulation">${yosegiSVG(st.pat, 4, 160, false)}</svg>
     <svg viewBox="0 0 240 240" width="200" height="200" style="border-radius:8px">${yosegiSVG(st.pat, 12, 240, !!st.flip)}</svg></div>
    <div class="row" style="justify-content:center;gap:6px"><span class="muted">${T(KO2.tile)}:</span><button class="pill ${st.flip ? '' : 'on'}" data-flip="0" type="button">${T(KO2.same)}</button><button class="pill ${st.flip ? 'on' : ''}" data-flip="1" type="button">${T(KO2.flip)}</button></div></div>
   <div class="panel"><h3>🔐 ${T(KO2.puzzle)}</h3><p style="margin-top:0">${T(KO2.boxRule)}</p>
    <div class="row" style="justify-content:center;gap:6px">${BOX_LEVELS.map((k) => `<button class="pill ${k === d ? 'on' : ''}" data-bl="${k}" type="button">${T(KO2.level, { k: k * BOX_N })}${st.done[k] != null ? ' ✓' : ''}</button>`).join('')}</div>
    <svg viewBox="-20 -20 340 340" style="width:100%;max-width:340px;display:block;margin:auto;touch-action:manipulation"><defs><pattern id="yg" width="40" height="40" patternUnits="userSpaceOnUse">${yosegiSVG(st.pat, 4, 40, false)}</pattern></defs>
     <rect x="60" y="60" width="180" height="180" rx="6" fill="${BX.open ? '#3b2a1a' : 'url(#yg)'}" stroke="#6b4226" stroke-width="3"/>${BX.open ? `<text x="150" y="160" text-anchor="middle" font-size="48">💌</text>` : ''}${[0, 1, 2, 3].map(pnl).join('')}</svg>
    <div class="row" style="justify-content:center;gap:8px">${all && !BX.open ? `<button class="btn" id="lid" type="button">🔓 ${T(KO2.lid)}</button>` : ''}<button class="btn ghost" id="brs" type="button">🔄 ${T(KOB.reset)}</button></div></div></div>`);
  $('#bk').onclick = () => showKobo(null);
  $$('#ytile polygon').forEach((p, i) => p.onclick = () => { st.pat[i] = (st.pat[i] + 1) % WOODS.length; save(); koboBox(); });
  $$('[data-flip]').forEach((b) => b.onclick = () => { st.flip = +b.dataset.flip; save(); koboBox(); });
  $$('[data-bl]').forEach((b) => b.onclick = () => { BX.d = +b.dataset.bl; BX.pos = null; koboBox(); });
  $('#brs').onclick = () => { BX.pos = null; koboBox(); };
  $$('[data-bp]').forEach((g) => g.onclick = () => { const [j, dir] = g.dataset.bp.split('|').map(Number);
    if (BX.open) return; if (!boxCan(BX.pos, j, dir, d)) { const b = boxBlocker(BX.pos, j, dir); toast(b == null ? T(KO2.edge) : T(KO2.stuck, { b: b + 1 })); snd('soft'); BX.flash = b; koboBox(); BX.flash = null; return; } BX.pos[j] += dir; BX.moves++; snd('step'); koboBox(); });
  const lid = $('#lid'); if (lid) lid.onclick = () => { BX.open = true; const k = d * BOX_N, first = st.done[d] == null; st.done[d] = st.done[d] == null ? BX.moves : Math.min(st.done[d], BX.moves); save(); snd('done'); confetti();
    const fr = friendsList(), f = SPECIES[fr[Math.floor(Math.random() * fr.length)]] || SPECIES[S.buddy];
    modal(`<h3>${T(KO2.boxOpen, { k: BX.moves })}</h3><p>${T(KO2.letter, { f: T(f.name) })}</p><p class="muted">${T(KO2.boxMin, { m: k })}</p>`, [{ t: T(L.close) }]);
    if (first) koboGive('box' + d); koboBox(); };
}
BOX_LEVELS.forEach((d) => { const k = d * BOX_N; KOBO_ITEMS['box' + d] = { n: tx(`ひみつ箱(${k}回)`, `Secret box (${k})`, `秘密箱（${k}次）`), face: () => `<svg viewBox="0 0 40 40" width="80%" height="80%"><defs><pattern id="ygi${d}" width="20" height="20" patternUnits="userSpaceOnUse">${yosegiSVG(S.kobo.box.pat || BOX_PRESET, 4, 20, false)}</pattern></defs><path d="M6 14 L20 7 L34 14 L34 30 L20 37 L6 30Z" fill="url(#ygi${d})" stroke="#6b4226" stroke-width="1.5"/><path d="M6 14 L20 21 L34 14 M20 21 L20 37" stroke="#6b4226" stroke-width="1.2" fill="none"/></svg>` }; });

// ---------- woodblock printing ----------
const HG = { tool: 6, stage: 'carve', mask: null, undo: [], q: null, qRes: null };   // qRes: the chosen option {m, w}, translated when drawn
const HANGA_GLYPHS = ['F', 'R', 'J', 'P', 'G', 'K', 'あ', 'の', 'ぬ', 'さ', 'き', 'ち'];
function hangaQuiz() { const rnd = LEARN.rngOf('hq' + Date.now()), g = HANGA_GLYPHS[Math.floor(rnd() * HANGA_GLYPHS.length)];
  const opts = LEARN.tools(rnd, 1).shuffle([{ m: 1, w: 1 }, { m: 0, w: 1 }, { m: 1, w: 0 }, { m: 0, w: 0 }]); return { g, opts }; }
const glyph = (g, bg, fg, mirror, size) => `<svg viewBox="0 0 80 80" width="${size}" height="${size}" style="border-radius:8px"><rect width="80" height="80" fill="${bg}"/><text x="40" y="58" text-anchor="middle" font-size="54" font-weight="900" fill="${fg}" ${mirror ? 'transform="translate(80 0) scale(-1 1)"' : ''}>${g}</text></svg>`;
function koboHanga() {
  if (!HG.q) HG.q = hangaQuiz();
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>🪵 ${T(KO2.hanga)}</h2></div>
   <div class="stack"><div class="panel"><div class="row" style="flex-wrap:wrap;gap:12px;justify-content:center">
     <canvas id="blk" width="600" height="600" style="width:min(100%,320px);border-radius:10px;touch-action:none;cursor:crosshair"></canvas>
     ${HG.stage === 'printed' ? `<canvas id="prt" width="600" height="600" style="width:min(100%,320px);border-radius:4px;box-shadow:0 4px 10px rgba(0,0,0,.15)"></canvas>` : ''}</div>
    ${HG.stage === 'printed' ? `<p style="text-align:center;font-weight:800">${T(KO2.printed)}</p>` : ''}
    <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap;margin-top:8px">${HG.stage === 'carve' ? `${[[6, KO2.sankaku], [14, KO2.maru], [30, KO2.hira]].map(([w, n]) => `<button class="pill ${HG.tool === w ? 'on' : ''}" data-ht="${w}" type="button">${T(n)}</button>`).join('')}
      <button class="btn ghost" id="hu" type="button">↩️ ${T(KOB.undo)}</button><button class="btn" id="hink" type="button">🖌 ${T(KO2.ink)}</button>`
      : HG.stage === 'inked' ? `<button class="btn" id="hprint" type="button">🗞 ${T(KO2.print)}</button><button class="btn ghost" id="hback" type="button">${T(KO2.again)}</button>`
      : `<button class="btn" id="hsave" type="button">✨ ${T(KOB.done)}</button><button class="btn ghost" id="hback" type="button">${T(KO2.again)}</button>`}</div></div>
    <div class="panel"><h3>🔬 ${T(KO2.how)}</h3><p>${T(KO2.hWhy)}</p></div>
    <div class="panel"><h3>❓ ${T(KO2.quiz)}</h3><div class="row" style="justify-content:center">${glyph(HG.q.g, '#d9b38c', '#a8743f', false, 96)}</div>
     <div class="row" style="justify-content:center;gap:10px;margin-top:8px;flex-wrap:wrap">${HG.q.opts.map((o, i) => `<button class="panel" data-hq="${i}" type="button" style="padding:4px;border:0;cursor:pointer">${glyph(HG.q.g, o.w ? '#222' : '#fff', o.w ? '#fff' : '#222', o.m, 72)}</button>`).join('')}</div>
     ${HG.qRes ? `<p style="text-align:center;font-weight:800">${HG.qRes.m && HG.qRes.w ? T(KO2.qOk) + T(KO2.qWhy) : [!HG.qRes.m && T(KO2.qMirror), !HG.qRes.w && T(KO2.qColor)].filter(Boolean).join(' ')}</p><div class="row" style="justify-content:center"><button class="btn ghost" id="hq2" type="button">${T(KO2.nextQ)}</button></div>` : ''}</div></div>`);
  const cv = $('#blk'), g = cv.getContext('2d');
  if (!HG.mask) { HG.mask = document.createElement('canvas'); HG.mask.width = HG.mask.height = 600; }
  const mk = HG.mask.getContext('2d');
  const tint = (col) => { const c = document.createElement('canvas'); c.width = c.height = 600; const x = c.getContext('2d'); x.drawImage(HG.mask, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, 600, 600); return c; };
  const draw = () => { g.globalCompositeOperation = 'source-over'; g.fillStyle = HG.stage === 'carve' ? '#d9b38c' : '#222'; g.fillRect(0, 0, 600, 600);
    if (HG.stage === 'carve') { g.strokeStyle = '#c9a27e'; g.lineWidth = 2; for (let y = 20; y < 600; y += 38) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(200, y + 12, 400, y - 12, 600, y + 4); g.stroke(); } }
    g.drawImage(tint(HG.stage === 'carve' ? '#a8743f' : '#d9b38c'), 0, 0); };
  draw();
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 600 / r.height]; };
  let last = null;
  if (HG.stage === 'carve') {
    onePointer(cv, (e) => { HG.undo.push(mk.getImageData(0, 0, 600, 600)); if (HG.undo.length > 10) HG.undo.shift(); last = pos(e); },
      (e) => { if (!last) return; const p = pos(e); mk.strokeStyle = '#fff'; mk.lineCap = 'round'; mk.lineWidth = HG.tool; mk.beginPath(); mk.moveTo(...last); mk.lineTo(...p); mk.stroke(); last = p; draw(); }, () => { last = null; });
  }
  if (HG.stage === 'printed') { const p = $('#prt').getContext('2d'); p.fillStyle = '#222'; p.fillRect(0, 0, 600, 600); p.save(); p.translate(600, 0); p.scale(-1, 1); p.drawImage(tint('#fffdf5'), 0, 0); p.restore(); }
  $('#bk').onclick = () => showKobo(null);
  $$('[data-ht]').forEach((b) => b.onclick = () => { HG.tool = +b.dataset.ht; koboHanga(); });
  const on = (id, f) => { const b = $(id); if (b) b.onclick = f; };
  on('#hu', () => { const u = HG.undo.pop(); if (u) { mk.putImageData(u, 0, 0); draw(); } });
  on('#hink', () => { HG.stage = 'inked'; snd('pop'); koboHanga(); });
  on('#hprint', () => { HG.stage = 'printed'; snd('done'); koboHanga(); });
  on('#hback', () => { HG.stage = 'carve'; koboHanga(); });
  on('#hsave', () => koboSaveWork($('#prt'), () => { HG.mask = null; HG.undo = []; HG.stage = 'carve'; koboHanga(); }));
  $$('[data-hq]').forEach((b) => b.onclick = () => { const o = HG.q.opts[+b.dataset.hq];
    HG.qRes = o;
    snd(o.m && o.w ? 'ok' : 'soft'); koboHanga(); });
  on('#hq2', () => { HG.q = hangaQuiz(); HG.qRes = null; koboHanga(); });
}

// ---------- kirigami: cut the folded wedge, unfold by the fold's symmetry group ----------
const KG = { n: 4, cuts: [], open: false, axes: false, col: '#ff8fb1' };
const KIRI_PAPER = ['#ff8fb1', '#ffd84d', '#7fd3ff', '#9fe08a', '#b9a5f6', '#ff9f43'];
// paper is the square [-1,1]²; the folded wedge is the part you can draw on; mirrors generate every copy of a cut
const KIRI = { 2: { wedge: [[0, -1], [1, -1], [1, 1], [0, 1]], gens: [([x, y]) => [-x, y]] },
  4: { wedge: [[0, 0], [1, 0], [1, 1], [0, 1]], gens: [([x, y]) => [-x, y], ([x, y]) => [x, -y]] },
  8: { wedge: [[0, 0], [1, 0], [1, 1]], gens: [([x, y]) => [-x, y], ([x, y]) => [x, -y], ([x, y]) => [y, x]] } };
function kiriGroup(n) {   // all transforms made from the mirrors, found by their action on a test point
  const test = [0.31, 0.17], seen = new Map([[test.map((v) => v.toFixed(4)).join(), (p) => p]]); let frontier = [(p) => p];
  while (frontier.length) { const nf = []; for (const f of frontier) for (const g of KIRI[n].gens) { const h = (p) => g(f(p)), k = h(test).map((v) => v.toFixed(4)).join(); if (!seen.has(k)) { seen.set(k, h); nf.push(h); } } frontier = nf; }
  return [...seen.values()];
}
const KIRI_AXES = { 2: [[[0, -1], [0, 1]]], 4: [[[0, -1], [0, 1]], [[-1, 0], [1, 0]]], 8: [[[0, -1], [0, 1]], [[-1, 0], [1, 0]], [[-1, -1], [1, 1]], [[-1, 1], [1, -1]]] };
function kiriSVG(full, size) {   // full: the unfolded sheet; otherwise the folded wedge, zoomed
  const W = KIRI[KG.n].wedge, pts = (P) => P.map((p) => p.join(',')).join(' '), grp = full ? kiriGroup(KG.n) : [(p) => p];
  // each copy of a cut only reaches the paper of its own layer: clip it to that layer's wedge (cutting beside the folded paper cuts nothing)
  const clips = grp.map((f, i) => `<clipPath id="kw${full ? 1 : 0}${i}"><polygon points="${pts(W.map(f))}"/></clipPath>`).join('');
  const holes = KG.cuts.flatMap((c) => grp.map((f, i) => `<polygon points="${pts(c.map(f))}" fill="#000" clip-path="url(#kw${full ? 1 : 0}${i})"/>`)).join('');
  const vb = full ? '-1.1 -1.1 2.2 2.2' : (() => { const xs = W.map((p) => p[0]), ys = W.map((p) => p[1]); return `${Math.min(...xs) - 0.05} ${Math.min(...ys) - 0.05} ${Math.max(...xs) - Math.min(...xs) + 0.1} ${Math.max(...ys) - Math.min(...ys) + 0.1}`; })();
  return `<svg viewBox="${vb}" width="${size}" height="${size}" id="${full ? 'kfull' : 'kfold'}" style="touch-action:none;background:#fffaf0;border-radius:8px"><defs>${clips}<mask id="km${full ? 1 : 0}"><rect x="-2" y="-2" width="4" height="4" fill="#fff"/>${holes}</mask></defs>
    ${full ? `<rect x="-1" y="-1" width="2" height="2" fill="${KG.col}" mask="url(#km1)"/>` : `<polygon points="${pts(W)}" fill="${KG.col}" mask="url(#km0)" stroke="#0002" stroke-width=".01"/>`}
    ${full && KG.axes ? KIRI_AXES[KG.n].map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3b3346" stroke-width=".012" stroke-dasharray=".05 .04"/>`).join('') : ''}</svg>`;
}
function koboKiri() {
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>✂️ ${T(KO2.kiri)}</h2></div>
   <div class="stack"><div class="panel">
    <div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap"><span class="muted">${T(KO2.fold)}:</span>${[[2, KO2.f2], [4, KO2.f4], [8, KO2.f8]].map(([n, t]) => `<button class="pill ${KG.n === n ? 'on' : ''}" data-kn="${n}" type="button">${T(t)}</button>`).join('')}
     ${KIRI_PAPER.map((c) => `<button data-kc="${c}" type="button" aria-label="${c}" style="width:28px;height:28px;border-radius:6px;border:3px solid ${c === KG.col ? '#3b3346' : '#fff'};background:${c}"></button>`).join('')}</div>
    <div class="row" style="justify-content:center;margin-top:8px">${KG.open ? kiriSVG(true, 320) : kiriSVG(false, 300)}</div>
    <p class="muted" style="text-align:center">${KG.open ? '' : T(KO2.cutTip)}</p>
    <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap">${KG.open ? `<button class="btn ghost" id="kref" type="button">📄 ${T(KO2.refold)}</button><button class="pill ${KG.axes ? 'on' : ''}" id="kax" type="button">📏 ${T(KO2.axes)}</button><button class="btn" id="ksave" type="button">✨ ${T(KOB.done)}</button>`
      : `<button class="btn ghost" id="kun" type="button">↩️ ${T(KOB.undo)}</button><button class="btn" id="kop" type="button">🌸 ${T(KO2.open)}</button>`}</div></div>
    ${KG.open ? `<div class="panel"><h3>🔬 ${T(KO2.axes)}</h3><p>${T(KO2.kWhy)}</p></div>` : ''}</div>`);
  $('#bk').onclick = () => showKobo(null);
  $$('[data-kn]').forEach((b) => b.onclick = () => { if (KG.cuts.length && KG.n !== +b.dataset.kn) toast(T(KO2.newPaper)); KG.n = +b.dataset.kn; KG.cuts = []; KG.open = false; koboKiri(); });
  $$('[data-kc]').forEach((b) => b.onclick = () => { KG.col = b.dataset.kc; koboKiri(); });
  const on = (id, f) => { const b = $(id); if (b) b.onclick = f; };
  on('#kun', () => { KG.cuts.pop(); koboKiri(); }); on('#kop', () => { KG.open = true; snd('done'); koboKiri(); });
  on('#kref', () => { KG.open = false; koboKiri(); }); on('#kax', () => { KG.axes = !KG.axes; koboKiri(); });
  on('#ksave', () => { const svg = $('#kfull'); svgToCanvas(svg, 600, (cv) => koboSaveWork(cv, () => { KG.cuts = []; KG.open = false; koboKiri(); })); });
  const sv = $('#kfold'); if (!sv) return;
  const pt = (e) => { const p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(sv.getScreenCTM().inverse()); return [+q.x.toFixed(3), +q.y.toFixed(3)]; };
  let cur = null, poly = null;
  onePointer(sv, (e) => { cur = [pt(e)]; poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); poly.setAttribute('fill', 'none'); poly.setAttribute('stroke', '#3b3346'); poly.setAttribute('stroke-width', '.012'); poly.setAttribute('stroke-dasharray', '.03 .02'); sv.appendChild(poly); },
    (e) => { if (!cur) return; const p = pt(e), l = cur[cur.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 0.015) { cur.push(p); poly.setAttribute('points', cur.map((q) => q.join(',')).join(' ')); } },
    () => { if (cur && cur.length > 2) { KG.cuts.push(cur); snd('pop'); } cur = null; koboKiri(); });
}

// ---------- coloured light ----------
const LIGHTS = { r: [255, 0, 0], g: [0, 255, 0], b: [0, 0, 255] };
const FILMS = { red: [1, 0, 0], yellow: [1, 1, 0], blue: [0, 0.55, 1], green: [0, 1, 0] };   // how much of each light a cellophane lets through
const LAMP_GOALS = [['yellow', KO2.cYellow, 'L', ['r', 'g']], ['magenta', KO2.cMagenta, 'L', ['r', 'b']], ['cyan', KO2.cCyan, 'L', ['g', 'b']], ['white', KO2.cWhite, 'L', ['r', 'g', 'b']],
  ['fgreen', KO2.cGreen, 'F', ['yellow', 'blue']], ['fred', KO2.cRed, 'F', ['red', 'yellow']], ['fblack', KO2.cBlack, 'F', ['red', 'blue']]];
const filmColor = (set) => [0, 1, 2].map((i) => Math.round(255 * set.reduce((a, f) => a * FILMS[f][i], 1)));
const LP = { mode: 'L', spots: { r: [110, 120], g: [300, 300], b: [490, 120] }, films: [] };   // apart at first: nothing counts until she moves them
function lampCovers(pt) { return Object.entries(LP.spots).filter(([, [x, y]]) => Math.hypot(pt[0] - x, pt[1] - y) < 110).map(([k]) => k).sort().join(''); }
function lampMade() {   // which light goals exist somewhere on the wall right now (sampled)
  if (LP.mode === 'F') return LP.films.length < 2 ? [] : LAMP_GOALS.filter((g) => g[2] === 'F' && filmColor(g[3]).join() === filmColor(LP.films).join()).map((g) => g[0]);
  const seen = new Set(); for (let x = 0; x < 600; x += 8) for (let y = 0; y < 400; y += 8) seen.add(lampCovers([x, y]));
  return LAMP_GOALS.filter((g) => g[2] === 'L' && seen.has(g[3].slice().sort().join(''))).map((g) => g[0]);
}
function koboLamp() {
  const made = lampMade(), fresh = made.filter((k) => !S.kobo.lamp[k]); fresh.forEach((k) => { S.kobo.lamp[k] = today(); }); if (fresh.length) { save(); snd('ok'); toast(T(KO2.madeIt, { c: T(LAMP_GOALS.find((g) => g[0] === fresh[0])[1]) })); }
  const goals = LAMP_GOALS.filter((g) => g[2] === LP.mode);
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>💡 ${T(KO2.lamp)}</h2></div>
   <div class="stack"><div class="panel"><div class="row" style="justify-content:center;gap:6px"><button class="pill ${LP.mode === 'L' ? 'on' : ''}" data-lm="L" type="button">🔦 ${T(KO2.lights)}</button><button class="pill ${LP.mode === 'F' ? 'on' : ''}" data-lm="F" type="button">🎞 ${T(KO2.films)}</button></div>
    <p class="muted" style="text-align:center">${T(LP.mode === 'L' ? KO2.dragTip : KO2.filmTip)}</p>
    <canvas id="wall" width="600" height="400" style="width:100%;max-width:600px;display:block;margin:auto;border-radius:12px;touch-action:none;background:#111"></canvas>
    ${LP.mode === 'F' ? `<div class="row" style="justify-content:center;gap:8px;margin-top:8px">${Object.keys(FILMS).map((f) => `<button class="pill ${LP.films.includes(f) ? 'on' : ''}" data-film="${f}" type="button"><span style="display:inline-block;width:18px;height:18px;border-radius:4px;background:rgb(${filmColor([f]).join(',')})"></span> ${T(KO2[f])}</button>`).join('')}</div>` : ''}
    <h3>${T(LP.mode === 'F' ? KO2.twoFilms : KO2.make)}</h3><div class="row" style="flex-wrap:wrap;gap:6px">${goals.map(([k, n]) => `<span class="pill" style="${S.kobo.lamp[k] ? 'background:#ffe680' : ''}">${S.kobo.lamp[k] ? '✓ ' : ''}${T(n)}</span>`).join('')}</div></div>
    ${Object.keys(S.kobo.lamp).length ? `<div class="panel"><h3>🔬 ${T(KO2.how)}</h3><p>${T(KO2.lWhy)}</p></div>` : ''}</div>`);
  const cv = $('#wall'), g = cv.getContext('2d');
  const draw = () => { g.globalCompositeOperation = 'source-over'; g.fillStyle = '#111'; g.fillRect(0, 0, 600, 400);
    if (LP.mode === 'L') { g.globalCompositeOperation = 'lighter'; for (const [k, [x, y]] of Object.entries(LP.spots)) { g.fillStyle = `rgb(${LIGHTS[k].join(',')})`; g.beginPath(); g.arc(x, y, 110, 0, 6.283); g.fill(); } }
    else { g.fillStyle = `rgb(${filmColor(LP.films).join(',')})`; g.beginPath(); g.arc(300, 200, 140, 0, 6.283); g.fill(); g.globalCompositeOperation = 'source-over'; g.font = '40px sans-serif'; g.fillText('🔦', 20, 380); } };
  draw();
  $('#bk').onclick = () => showKobo(null);
  $$('[data-lm]').forEach((b) => b.onclick = () => { LP.mode = b.dataset.lm; koboLamp(); });
  $$('[data-film]').forEach((b) => b.onclick = () => { const f = b.dataset.film; LP.films = LP.films.includes(f) ? LP.films.filter((x) => x !== f) : [...LP.films, f]; snd('pop'); koboLamp(); });
  if (LP.mode !== 'L') return;
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 400 / r.height]; };
  let drag = null;
  onePointer(cv, (e) => { const p = pos(e); drag = Object.keys(LP.spots).reverse().find((k) => Math.hypot(p[0] - LP.spots[k][0], p[1] - LP.spots[k][1]) < 110) || null; },
    (e) => { if (!drag) return; const p = pos(e); LP.spots[drag] = [Math.max(0, Math.min(600, p[0])), Math.max(0, Math.min(400, p[1]))]; draw(); }, () => { if (drag) { drag = null; koboLamp(); } });
}

// ---------- shared: save a canvas as a work; render an SVG element to a canvas ----------
function koboSaveWork(cv, after) {
  const list = worksAll(); if (list.length >= WORKS_MAX) { toast(T(KOB.full)); return; }
  const sm = document.createElement('canvas'); sm.width = 400; sm.height = Math.round(400 * cv.height / cv.width); const sg = sm.getContext('2d'); sg.fillStyle = '#fff'; sg.fillRect(0, 0, sm.width, sm.height); sg.drawImage(cv, 0, 0, sm.width, sm.height);
  const id = Date.now().toString(36), w = { id, t: today(), img: sm.toDataURL('image/jpeg', 0.75) }; list.push(w); if (!worksPut(list)) { toast(T(KOB.full)); return; }
  const big = cv.toDataURL('image/png'); snd('done'); confetti();
  modal(`<h3>${T(KOB.saved)}</h3><img src="${w.img}" alt="" style="width:100%;max-width:320px;border-radius:10px">`, [
    { t: '💾 ' + T(KOB.dl), fn: () => { downloadURL(big, `kazoe-${id}.png`); after(); } },
    { t: '🏠 ' + T(KOB.hang), fn: () => { S.furn['art:' + id] = 1; save(); PLACING = 'art:' + id; KROOM = null; showHouse(); } },
    { t: T(L.close), fn: after }]);
}
function svgToCanvas(svg, size, done) {
  const c = svg.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.setAttribute('width', size); c.setAttribute('height', size);
  const img = new Image(); img.onload = () => { const cv = document.createElement('canvas'); cv.width = cv.height = size; const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, size, size); g.drawImage(img, 0, 0, size, size); done(cv); };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(c));
}

KOBO_FRESH.push(() => { Object.assign(BX, { pos: null, moves: 0, open: false }); Object.assign(HG, { stage: 'carve', mask: null, undo: [], q: null, qRes: null }); Object.assign(KG, { cuts: [], open: false }); Object.assign(LP, { mode: 'L', spots: { r: [110, 120], g: [300, 300], b: [490, 120] }, films: [] }); });

// ---------- keys and rooms ----------
Object.assign(KEYS, {
  box: () => !!(S.cleared || {}).m1, hanga: () => !!(S.cleared || {}).r8,
  kiri: () => Object.keys(S.cleared || {}).some((c) => /^g\d+$/.test(c)), lamp: () => !!(S.cleared || {}).r8 && Object.keys(S.kobo.found || {}).length > 0,
});
KOBO_ROOMS.push({ id: 'box', e: '📦', n: KO2.box, d: KO2.boxTxt, key: 'box', why: KO2.boxKey, show: koboBox }, { id: 'hanga', e: '🪵', n: KO2.hanga, d: KO2.hangaTxt, key: 'hanga', why: KO2.hangaKey, show: koboHanga },
  { id: 'kiri', e: '✂️', n: KO2.kiri, d: KO2.kiriTxt, key: 'kiri', why: KO2.kiriKey, show: koboKiri }, { id: 'lamp', e: '💡', n: KO2.lamp, d: KO2.lampTxt, key: 'lamp', why: KO2.lampKey, show: koboLamp });
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(KO2)];
