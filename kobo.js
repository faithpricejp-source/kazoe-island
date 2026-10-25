// kobo.js — こうぼう (the workshop): a free sketchbook, a paint lab (real-paint mixing via vendor/spectral.js) and the Chinese-rings puzzle.
// The workshop opens after 5 new problems solved anywhere (2 of the 7 dots are lit as a welcome gift); each later room opens when she has
// learned what it uses ("you learned X, so Y opens"), never "do N problems to buy Y" — an activity framed as the means to another one
// loses interest (Lepper, Sagotsky, Dafoe & Greene 1982). Nothing made here earns points or acorns: children who already liked drawing drew
// less once they expected a reward for it (Lepper, Greene & Nisbett 1973). Unlocks are sticky like unlockLv.
// Drawings are kept as small JPEGs under their own localStorage key (not in S) and capped, so the save itself stays small.

const KOB = {
  kobo: tx('こうぼう', 'Workshop', '工坊'), koboTxt: tx('絵をかいたり、ふしぎなパズルをといたり', 'Draw, mix paint, solve puzzles', '画画、调色、解机关'),
  locked: tx('とびらは まだ しまっている', 'The door is still closed', '门还关着'),
  lockTxt: tx('島のどこかで、まだといたことのない問題を あと{k}問とくと、とびらが開くよ。', 'Solve {k} more problems you have never solved before, anywhere on the island, and the door opens.', '在岛上任何地方，再解出{k}道没做过的题，门就会打开。'),
  gift: tx('はじめの2つは、ようこそのプレゼント。', 'The first 2 are a welcome gift.', '前2个是欢迎礼物。'),
  opened: tx('🔓 こうぼうのとびらが開いた!', '🔓 The workshop door is open!', '🔓 工坊的门打开了！'),
  roomOpen: tx('🔓 「{r}」が使えるようになった!', '🔓 “{r}” is open!', '🔓 「{r}」可以用了！'), ringsMore: tx('🔓 九連環を {n}つの輪で できるようになった!', '🔓 Chinese rings: you can now try {n} rings!', '🔓 九连环可以挑战{n}个环了！'),
  rooms: tx('へや', 'Rooms', '房间'), gallery: tx('わたしの作品', 'My works', '我的作品'), noWorks: tx('まだ作品はないよ。スケッチブックで かいてみよう。', 'No works yet — try the sketchbook.', '还没有作品，去画板画一张吧。'),
  // rooms
  sketch: tx('スケッチブック', 'Sketchbook', '画板'), sketchTxt: tx('すきなものを すきなように', 'Draw whatever you like', '想画什么就画什么'),
  paint: tx('えのぐ研究所', 'Paint lab', '颜料研究所'), paintTxt: tx('色をまぜて、新しい色を作る', 'Mix paints into new colours', '混合颜料，调出新颜色'),
  paintKey: tx('研究所は 実験をする所。理科の島で 場所を1つ やりとげた人なら 入れるよ。', 'The lab is for experimenters — once you have finished a place on the Science Isle, you can come in.', '研究所是做实验的地方。在理科岛完成过一个地点的人就能进来。'),
  rings: tx('[九連環|きゅうれんかん]', 'Chinese rings', '九连环'), ringsTxt: tx('輪を ぜんぶ ぼうから外そう', 'Get every ring off the bar', '把所有环都从杆上取下来'),
  ringsKey: tx('{n}つの輪: {why}', '{n} rings: {why}', '{n}个环：{why}'),
  key5: tx('数えの島「分かれ道の森」で「場合分け」を身につけたら', 'once you have learned case-splitting in “Forest of Forks” (Counting Isle)', '在数数岛「岔路森林」学会分类讨论后'),
  key7: tx('「分かれ道の森」のマスターバッジ(場合分けが とくいになったしるし)をもらったら', 'once you earn the “Forest of Forks” mastery badge (case-splitting has become easy)', '拿到「岔路森林」的大师徽章（分类讨论已经熟练）后'),
  key9: tx('7つの輪を 自分でといたら', 'once you have solved 7 rings yourself', '自己解开7个环后'),
  // sketchbook
  pen: tx('ペン', 'Pen', '笔'), crayon: tx('クレヨン', 'Crayon', '蜡笔'), eraser: tx('けしゴム', 'Eraser', '橡皮'), splat: tx('スパッタリング', 'Spatter', '喷溅'),
  soft: tx('にじみ', 'Soft blur', '晕染'), mirror: tx('左右うつし', 'Mirror', '左右对称'), undo: tx('もどす', 'Undo', '撤销'), clear: tx('ぜんぶけす', 'Clear', '全部擦掉'),
  done: tx('できた!', 'Done!', '画好了！'), saved: tx('作品に入れたよ', 'Saved to your works', '已放进作品集'), full: tx('作品がいっぱい。古いものをけしてから入れてね。', 'Your works are full — remove an old one first.', '作品满了，先删掉一张旧的再放。'),
  labTools: tx('えのぐ研究所で見つけた ぬり方も使えるよ。「左右うつし」は、紙を半分に折って絵の具をうつす デカルコマニーに にているよ。', 'Techniques from the paint lab work here too. “Mirror” is like decalcomania: folding the paper to copy wet paint to the other half.', '颜料研究所里学到的画法这里也能用。「左右对称」就像对折印画：把纸对折，把颜料印到另一半。'),
  sure: tx('ほんとうに ぜんぶけす?', 'Really clear everything?', '真的全部擦掉吗？'), yes: tx('けす', 'Clear', '擦掉'), no: tx('やめる', 'Keep', '不擦'),
  // gallery
  hang: tx('おうちにかざる', 'Hang at home', '挂到家里'), hung: tx('おうちにかざってあるよ', 'Hanging at home', '已挂在家里'), dl: tx('画像でほぞん', 'Save as image', '存成图片'),
  gone: tx('この作品は もう けされているよ。', 'This work has already been removed.', '这张作品已经被删掉了。'),
  gotItem: tx('🎁 「{n}」を おうちに かざれるよ', '🎁 You can put “{n}” in your house', '🎁 「{n}」可以摆进家里了'),
  savedDl: tx('「ダウンロード」フォルダに ほぞんしたよ', 'Saved in your Downloads folder', '已存到「下载」文件夹'),
  del: tx('けす', 'Remove', '删除'), delSure: tx('この作品をけす?', 'Remove this work?', '删除这张作品？'),
  // paint lab
  tubes: tx('えのぐ', 'Paints', '颜料'), mixArea: tx('パレット', 'Palette', '调色盘'), drops: tx('{k}てき', '{k} drops', '{k}滴'), wash: tx('あらう', 'Wash', '洗掉'),
  keep: tx('この色をスケッチブックで使う', 'Use this colour in the sketchbook', '把这个颜色拿到画板用'), kept: tx('スケッチブックの色に入れたよ', 'Added to your sketchbook colours', '已加入画板的颜色'),
  challenge: tx('この色を作ってみよう', 'Can you make this colour?', '试着调出这个颜色'), target: tx('お手本', 'Target', '目标'), yours: tx('いまの色', 'Your colour', '现在的颜色'),
  close: tx('おしい! あとすこし。', 'So close!', '差一点点！'), match: tx('ぴったり! 「{c}」ができた!', 'Perfect! You made “{c}”!', '一模一样！调出了「{c}」！'),
  hint: tx('ヒント', 'Hint', '提示'), next: tx('つぎの色', 'Next colour', '下一个颜色'), found: tx('見つけた色 {k} / {n}', 'Colours found {k} / {n}', '找到的颜色 {k} / {n}'),
  ink: { white: tx('しろ', 'white', '白'), black: tx('くろ', 'black', '黑'), red: tx('あか', 'red', '红'), yellow: tx('きいろ', 'yellow', '黄'), blue: tx('あお', 'blue', '蓝') },
  h1: tx('使うえのぐは {k}しゅるい。', 'It uses {k} paints.', '要用{k}种颜料。'), h2: tx('使うのは {list}。', 'It uses {list}.', '要用{list}。'), h3: tx('{list} を、この数ずつ。', '{list} — this many drops each.', '{list}，各用这么多滴。'),
  whyT: tx('なぜ まぜると色がかわるの?', 'Why does mixing change the colour?', '为什么混在一起颜色会变？'),
  why: tx('えのぐは、光の中の いくつかの色を[吸|す]いとって、のこった光を はね返している。この青のえのぐは赤っぽい光を、この黄色のえのぐは青っぽい光を よく吸いとる。まぜると、どちらにも吸いとられにくい緑の光が のこって目にとどく。まぜた色が 明るくなるか暗くなるかは、えのぐの種類と量しだい(ここのえのぐは、本物に近づけた けいさん)。',
    'Paint swallows some colours of light and bounces back what is left. This blue paint swallows reddish light well, and this yellow swallows bluish light. Mixed, the green light that neither swallows much is left to reach your eye. Whether a mix ends up lighter or darker depends on the paints and how much of each (these paints are a calculation made to behave like real ones).',
    '颜料会吸收光里的一部分颜色，把剩下的光反射回来。这里的蓝颜料很会吸收偏红的光，黄颜料很会吸收偏蓝的光。混在一起，两种都不太吸收的绿光留下来，到达眼睛。混出来是变亮还是变暗，要看颜料的种类和用量（这里的颜料是模拟真颜料算出来的）。'),
  // rings
  moves: tx('{k}手', '{k} moves', '{k}步'), reset: tx('はじめから', 'Start over', '重新开始'), howMany: tx('輪の数', 'Rings', '环的数量'),
  rule: tx('きまり: いちばん右の輪は いつでも動かせる。ほかの輪は「すぐ右の輪が ぼうにかかっていて、それより右が ぜんぶ外れている」ときだけ 動かせる。', 'Rule: the rightmost ring can always move. Any other ring can move only when the ring just to its right is on the bar and every ring further right is off.', '规则：最右边的环随时可以动。其他环只有在「紧挨着它右边的环挂在杆上，再往右的环全都取下」时才能动。'),
  cant: tx('いまは動かせない。すぐ右の輪を見てみよう。', 'Can’t move it now — look at the ring just to its right.', '现在动不了。看看紧挨着它右边的环。'),
  rh1: tx('外したい輪より 右がわだけを見よう。いちばん左の輪を外すには、そのすぐ右の輪だけが かかっていて、それより右が ぜんぶ外れている形が いる。', 'Look only to the right of the ring you want off. To take off the leftmost ring, the ring just to its right must be on and every ring further right off.', '只看想取下的环右边。要取下最左边的环，需要紧挨它右边的环挂着，再往右的全部取下。'),
  rh3: tx('光っている輪が、いま動かせる輪だよ。', 'The glowing rings are the ones you can move now.', '发光的环就是现在能动的环。'),
  rh2: tx('その形を作るのは、輪が1つ少ない九連環を といているのと同じ。小さいのから とけば、大きいのも とける。', 'Making that shape is the same as solving a puzzle with one ring fewer. Solve the small one and the big one follows.', '做出这个形状，就等于解一个少一个环的九连环。先解小的，大的也就会了。'),
  rsolved: tx('ぜんぶ外れた! {n}つの輪を {k}手で といたよ。', 'All off! {n} rings in {k} moves.', '全部取下了！{n}个环用了{k}步。'),
  rbest: tx('いちばん少ない手数は {m}手。', 'The fewest possible is {m} moves.', '最少需要{m}步。'), rperfect: tx('🌟 いちばん少ない手数で といた!', '🌟 Solved in the fewest moves!', '🌟 用最少的步数解开了！'),
  rtable: tx('きろく', 'Records', '记录'), rmine: tx('あなた', 'You', '你'), rmin: tx('いちばん少ない', 'Fewest', '最少'),
  rpattern: tx('輪が1つふえると、手数はどうなっている? 表の数を くらべてみよう。', 'When one more ring is added, what happens to the moves? Compare the numbers in the table.', '每多一个环，步数怎么变？比一比表里的数。'),
};
// paints for the lab: magenta-leaning red and cyan-leaning blue so that red+blue gives a real purple (checked with spectral.js)
const INKS = { white: '#ffffff', black: '#222222', red: '#e4004f', yellow: '#ffe100', blue: '#0068b7' };
// colours to discover: [name, recipe]; the target is computed from the recipe, so it can be matched exactly
const MIXES = [
  [tx('みどり', 'green', '绿'), { blue: 1, yellow: 1 }], [tx('だいだい', 'orange', '橙'), { red: 1, yellow: 1 }], [tx('むらさき', 'purple', '紫'), { red: 1, blue: 1 }],
  [tx('ももいろ', 'pink', '粉红'), { red: 1, white: 2 }], [tx('みずいろ', 'sky blue', '天蓝'), { blue: 1, white: 2 }], [tx('きみどり', 'yellow-green', '黄绿'), { blue: 1, yellow: 3 }],
  [tx('はいいろ', 'grey', '灰'), { black: 1, white: 2 }], [tx('ちゃいろ', 'brown', '棕'), { red: 1, yellow: 1, blue: 1 }], [tx('こんいろ', 'navy', '藏青'), { blue: 2, black: 1 }],
];
const SKETCH_COLS = ['#2b2b2b', '#e53935', '#fb8c00', '#fdd835', '#9ccc65', '#43a047', '#4fc3f7', '#1e63c8', '#8e44ad', '#f48fb1', '#8d6e63', '#ffffff'];
const WORKS_KEY = KEY + '-works', WORKS_MAX = 40;

// ---- state, keys ----
function koboInit() { if (!S.kobo) S.kobo = { fs: 0, keys: {}, rings: {}, mixed: [], found: {}, mi: 0 }; for (const k of ['got', 'box', 'kumi', 'lamp', 'card']) if (!S.kobo[k]) S.kobo[k] = k === 'box' ? { pat: null, done: {} } : {}; }
koboInit();
{ const r0 = HOOK.reset; HOOK.reset = () => { if (r0) r0(); koboInit(); KOBO_FRESH.forEach((f) => f()); }; }
const ringsMin = (n) => (n % 2 ? (2 ** (n + 1) - 1) / 3 : (2 ** (n + 1) - 2) / 3);   // fewest moves (checked by BFS in tests/verify_kobo.mjs)
const KOBO_OPEN = 5, KOBO_GIFT = 2;
// each key: is it earned now? (checked against her real progress; once earned it stays)
const KEYS = {
  open: () => S.kobo.fs >= KOBO_OPEN,
  paint: () => Object.keys(S.cleared || {}).some((c) => /^r\d+$/.test(c)),
  r5: () => !!(S.cleared || {}).c4, r7: () => !!(S.badges || {}).c4, r9: () => S.kobo.rings[7] != null,
};
const KEY_MSG = { r5: () => T(KOB.ringsMore, { n: 5 }), r7: () => T(KOB.ringsMore, { n: 7 }), r9: () => T(KOB.ringsMore, { n: 9 }) };
// rooms: { id, e, n, d, key (null = open with the door), why (what she needs to have learned), show }; kobo2.js / kobo3d.js add theirs
const KOBO_ROOMS = [];
// things made or solved here that can stand in the house: id → { n, face() } (furniture id 'kobo:<id>'); given once each
const KOBO_ITEMS = {};
function koboGive(id) { if (S.kobo.got[id]) return false; S.kobo.got[id] = today(); S.furn['kobo:' + id] = (S.furn['kobo:' + id] || 0) + 1; save(); setTimeout(() => toast(T(KOB.gotItem, { n: T(KOBO_ITEMS[id].n) })), 1400); return true; }
function koboHas(k) { return !!S.kobo.keys[k]; }
function koboCheck(quiet) {
  const got = []; for (const [k, f] of Object.entries(KEYS)) if (!S.kobo.keys[k] && f()) { S.kobo.keys[k] = today(); got.push(k); }
  if (!got.length) return; save(); if (quiet) return;
  if (got.includes('open')) setTimeout(() => { confetti(); toast(T(KOB.opened)); }, 900);
  const msgs = got.filter((k) => k !== 'open' && koboHas('open')).flatMap((k) => (KEY_MSG[k] ? [KEY_MSG[k]()] : KOBO_ROOMS.filter((r) => r.key === k).map((r) => T(KOB.roomOpen, { r: T(r.n) }))));
  msgs.forEach((m, i) => setTimeout(() => toast(m), 1800 + i * 2600));
}
const ringsMax = () => (koboHas('r9') ? 9 : koboHas('r7') ? 7 : koboHas('r5') ? 5 : 3);
EVT.sub('solve', ({ first }) => { koboInit(); if (first) { S.kobo.fs++; save(); } koboCheck(); });

// ---- works (small JPEGs under their own key) ----
function worksAll() { try { return JSON.parse(localStorage.getItem(WORKS_KEY) || '[]'); } catch (e) { return []; } }
function worksPut(list) { try { localStorage.setItem(WORKS_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
const workImg = (id) => (worksAll().find((w) => w.id === id) || {}).img;
function koboSavedDl() { toast('💾 ' + T(KOB.savedDl)); }   // called by the Mac app when a download has been written
// one finger at a time: a second finger or a resting palm must not join or end the stroke (astra R11-01)
function onePointer(el, down, move, up) { let id = null;
  el.onpointerdown = (e) => { if (id != null) return; id = e.pointerId; try { el.setPointerCapture(id); } catch (_) { /* synthetic events */ } down(e); };
  el.onpointermove = (e) => { if (e.pointerId === id) move(e); };
  el.onpointerup = el.onpointercancel = el.onlostpointercapture = (e) => { if (e.pointerId !== id) return; id = null; up(e); }; }
// unsaved drafts in every room; cleared when the save is reset so an old drawing never comes back in a new game (R11-03)
const KOBO_FRESH = [];
function downloadURL(url, name) { const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }

// ---- screens ----
let KROOM = null;   // which room is open (null = the workshop hall)
function showKobo(room) {
  koboInit(); koboCheck(true); KROOM = room === undefined ? KROOM : room; rerender = () => showKobo();
  if (!koboHas('open')) return koboLocked();
  const cur = KOBO_ROOMS.find((r) => r.id === KROOM); if (cur && (!cur.key || koboHas(cur.key))) return cur.show();
  KROOM = null;
  const card = (r) => { const open = !r.key || koboHas(r.key); return `<button class="chcard ${open ? '' : 'locked'}" data-room="${r.id}" type="button"><span class="bigemo">${open ? r.e : '🔒'}</span><span class="t">${T(r.n)}</span><span class="s">${open ? T(r.d) : T(r.why)}</span></button>`; };
  const works = worksAll();
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>🎨 ${T(KOB.kobo)}</h2></div>
   <div class="stack"><div class="board-list">
    ${KOBO_ROOMS.map(card).join('')}</div>
    <div class="panel"><h3>🖼 ${T(KOB.gallery)} <span class="muted">${works.length} / ${WORKS_MAX}</span></h3>${works.length ? `<div class="row" style="flex-wrap:wrap;gap:10px">${works.slice().reverse().map((w) => {
      const hung = (S.room || []).some((r) => r.id === 'art:' + w.id);
      return `<div class="panel" style="padding:6px;width:150px;text-align:center"><img src="${w.img}" alt="" style="width:100%;border-radius:8px;border:1px solid #e6dcc8"><div class="muted" style="font-size:.75rem">${w.t}</div>
        ${hung ? `<div class="muted" style="font-size:.8rem">🏠 ${T(KOB.hung)}</div>` : `<button class="btn ghost" data-hang="${w.id}" type="button" style="font-size:.85rem;padding:6px 10px;min-height:36px">🏠 ${T(KOB.hang)}</button>`}
        <div class="row" style="justify-content:center;gap:4px;margin-top:4px"><button class="pill" data-dl="${w.id}" type="button" style="font-size:.8rem">💾 ${T(KOB.dl)}</button><button class="pill" data-del="${w.id}" type="button" style="font-size:.8rem">🗑</button></div></div>`; }).join('')}</div>` : `<p class="muted">${T(KOB.noWorks)}</p>`}</div></div>`);
  $('#bk').onclick = () => { KROOM = null; showMap(); };
  $$('[data-room]').forEach((b) => b.onclick = () => { const r = KOBO_ROOMS.find((x) => x.id === b.dataset.room); if (r.key && !koboHas(r.key)) { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); return; } showKobo(r.id); });
  $$('[data-hang]').forEach((b) => b.onclick = () => { if (!workImg(b.dataset.hang)) { toast(T(KOB.gone)); showKobo(null); return; } S.furn['art:' + b.dataset.hang] = 1; save(); PLACING = 'art:' + b.dataset.hang; KROOM = null; showHouse(); });
  $$('[data-dl]').forEach((b) => b.onclick = () => { const w = worksAll().find((x) => x.id === b.dataset.dl); if (w) downloadURL(w.img, `kazoe-${w.id}.jpg`); });
  $$('[data-del]').forEach((b) => b.onclick = () => modal(`<p>${T(KOB.delSure)}</p><img src="${workImg(b.dataset.del)}" alt="" style="width:160px;border-radius:8px">`, [{ t: T(KOB.del), cls: 'berry', fn: () => {
    const id = b.dataset.del; if (!worksPut(worksAll().filter((w) => w.id !== id))) { toast(T(KOB.full)); return; } S.room = (S.room || []).filter((r) => r.id !== 'art:' + id); delete S.furn['art:' + id]; save(); showKobo(); } }, { t: T(KOB.no) }]));
}
function koboLocked() {
  const lit = Math.min(KOBO_OPEN, S.kobo.fs) + KOBO_GIFT, all = KOBO_OPEN + KOBO_GIFT;
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>🎨 ${T(KOB.kobo)}</h2></div>
   <div class="stack"><div class="panel" style="text-align:center"><div style="font-size:4rem">🚪🔒</div><h3>${T(KOB.locked)}</h3>
    <div style="font-size:2rem;letter-spacing:.15em">${Array.from({ length: all }, (_, i) => (i < lit ? '🎨' : '⚪')).join('')}</div>
    <p>${T(KOB.lockTxt, { k: KOBO_OPEN - Math.min(KOBO_OPEN, S.kobo.fs) })}</p><p class="muted">${T(KOB.gift)}</p></div>
    <div class="board-list" style="opacity:.6">${KOBO_ROOMS.map((r) => [r.e, r.n, r.d]).map(([e, n, d]) => `<div class="chcard locked"><span class="bigemo">${e}</span><span class="t">${T(n)}</span><span class="s">${T(d)}</span></div>`).join('')}</div></div>`);
  $('#bk').onclick = () => showMap();
}

// ---- sketchbook ----
const SK = { tool: 'pen', col: SKETCH_COLS[0], size: 10, mirror: false, undo: [] };
function koboSketch() {
  const lab = koboHas('paint'), cols = [...SKETCH_COLS, ...(S.kobo.mixed || [])];
  const tools = [['pen', '✏️', KOB.pen], ['crayon', '🖍', KOB.crayon], ...(lab ? [['splat', '🪥', KOB.splat], ['soft', '💧', KOB.soft]] : []), ['eraser', '🧽', KOB.eraser]];
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>🖍 ${T(KOB.sketch)}</h2></div>
   <div class="stack"><div class="panel" style="padding:10px">
    <canvas id="cv" width="1000" height="750" style="width:min(100%,760px,calc(58vh * 4 / 3));display:block;margin:0 auto;background:#fff;border-radius:12px;border:2px solid #e6dcc8;touch-action:none;cursor:crosshair"></canvas>
    <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px;justify-content:center">${cols.map((c) => `<button data-col="${c}" type="button" aria-label="${c}" style="width:34px;height:34px;border-radius:50%;border:3px solid ${c === SK.col ? '#3b3346' : '#e6dcc8'};background:${c}"></button>`).join('')}</div>
    <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px;justify-content:center">${tools.map(([id, e, n]) => `<button class="pill ${SK.tool === id ? 'on' : ''}" data-tool="${id}" type="button">${e} ${T(n)}</button>`).join('')}
     ${[4, 10, 24].map((s) => `<button class="pill ${SK.size === s ? 'on' : ''}" data-size="${s}" type="button" aria-label="${s}"><span style="display:inline-block;width:${s / 1.6 + 4}px;height:${s / 1.6 + 4}px;border-radius:50%;background:#3b3346"></span></button>`).join('')}
     ${lab ? `<button class="pill ${SK.mirror ? 'on' : ''}" id="mir" type="button">🦋 ${T(KOB.mirror)}</button>` : ''}</div>
    ${lab ? `<p class="muted" style="text-align:center;margin:6px 0 0">${T(KOB.labTools)}</p>` : ''}
    <div class="row" style="justify-content:center;gap:8px;margin-top:10px"><button class="btn ghost" id="und" type="button">↩️ ${T(KOB.undo)}</button><button class="btn ghost" id="clr" type="button">🗑 ${T(KOB.clear)}</button><button class="btn" id="fin" type="button">✨ ${T(KOB.done)}</button></div></div></div>`);
  const cv = $('#cv'), g = cv.getContext('2d');
  if (SK.img) g.putImageData(SK.img, 0, 0); else { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); }
  const keep = () => { SK.img = g.getImageData(0, 0, cv.width, cv.height); };
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
  const rnd = LEARN.rngOf('sk' + Date.now());
  const dab = (x, y, px, py) => {   // one piece of a stroke from (px,py) to (x,y)
    const col = SK.tool === 'eraser' ? '#ffffff' : SK.col, s = SK.size;
    if (SK.tool === 'splat') { g.fillStyle = col; for (let i = 0; i < 10; i++) { const a = rnd() * 6.283, d = rnd() * s * 3; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 1 + rnd() * s / 3, 0, 6.283); g.fill(); } return; }
    if (SK.tool === 'soft') { const gr = g.createRadialGradient(x, y, 0, x, y, s * 2); gr.addColorStop(0, col + '40'); gr.addColorStop(1, col + '00'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, s * 2, 0, 6.283); g.fill(); return; }
    g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    if (SK.tool === 'crayon') { g.globalAlpha = 0.55; for (let i = 0; i < 3; i++) { const j = () => (rnd() - 0.5) * s * 0.6; g.lineWidth = s * 0.8; g.beginPath(); g.moveTo(px + j(), py + j()); g.lineTo(x + j(), y + j()); g.stroke(); } g.globalAlpha = 1; return; }
    g.lineWidth = SK.tool === 'eraser' ? s * 2 : s; g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.stroke();
  };
  let last = null;
  const draw = (x, y) => { const [px, py] = last || [x, y]; dab(x, y, px, py); if (SK.mirror && SK.tool !== 'eraser') dab(cv.width - x, y, cv.width - px, py); last = [x, y]; };
  onePointer(cv, (e) => { SK.undo.push(g.getImageData(0, 0, cv.width, cv.height)); if (SK.undo.length > 10) SK.undo.shift(); last = null; draw(...pos(e)); },
    (e) => { if (last) draw(...pos(e)); }, () => { if (last) { last = null; keep(); } });
  $('#bk').onclick = () => { keep(); showKobo(null); };
  $$('[data-col]').forEach((b) => b.onclick = () => { keep(); SK.col = b.dataset.col; if (SK.tool === 'eraser') SK.tool = 'pen'; koboSketch(); });
  $$('[data-tool]').forEach((b) => b.onclick = () => { keep(); SK.tool = b.dataset.tool; koboSketch(); });
  $$('[data-size]').forEach((b) => b.onclick = () => { keep(); SK.size = +b.dataset.size; koboSketch(); });
  const mir = $('#mir'); if (mir) mir.onclick = () => { keep(); SK.mirror = !SK.mirror; koboSketch(); };
  $('#und').onclick = () => { const u = SK.undo.pop(); if (u) { g.putImageData(u, 0, 0); keep(); } };
  $('#clr').onclick = () => modal(`<p>${T(KOB.sure)}</p>`, [{ t: T(KOB.yes), cls: 'berry', fn: () => { SK.undo = []; SK.img = null; koboSketch(); } }, { t: T(KOB.no) }]);
  $('#fin').onclick = () => {
    const list = worksAll(); if (list.length >= WORKS_MAX) { toast(T(KOB.full)); return; }
    const sm = document.createElement('canvas'); sm.width = 400; sm.height = 300; sm.getContext('2d').drawImage(cv, 0, 0, 400, 300);
    const id = Date.now().toString(36), w = { id, t: today(), img: sm.toDataURL('image/jpeg', 0.75) }; list.push(w);
    if (!worksPut(list)) { toast(T(KOB.full)); return; }
    const big = cv.toDataURL('image/png'); snd('done'); confetti();
    modal(`<h3>${T(KOB.saved)}</h3><img src="${w.img}" alt="" style="width:100%;max-width:320px;border-radius:10px">`, [
      { t: '💾 ' + T(KOB.dl), fn: () => downloadURL(big, `kazoe-${id}.png`) },
      { t: '🏠 ' + T(KOB.hang), fn: () => { S.furn['art:' + id] = 1; save(); PLACING = 'art:' + id; SK.img = null; SK.undo = []; KROOM = null; showHouse(); } },
      { t: T(KOB.no), fn: () => { SK.img = null; SK.undo = []; koboSketch(); } }]);
  };
}

// ---- paint lab ----
const PL = { drops: {}, hint: 0, res: '' };   // res: '' | 'close' | 'match'
const mixHex = (rec) => { const parts = Object.entries(rec).filter(([, k]) => k > 0); if (!parts.length) return null; return spectral.mix(...parts.map(([c, k]) => [new spectral.Color(INKS[c]), k])).toString(); };
const hexRGB = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
// distance in (approximate) CIELAB, so "close" means close to the eye
function labOf(h) { const lin = (v) => { v /= 255; return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92; }; const [r, g, b] = hexRGB(h).map(lin);
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116), X = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047), Y = f(r * 0.2126 + g * 0.7152 + b * 0.0722), Z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)]; }
const dE = (a, b) => { const p = labOf(a), q = labOf(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
function koboPaint() {
  const [nm, rec] = MIXES[S.kobo.mi % MIXES.length], tgt = mixHex(rec), cur = mixHex(PL.drops), nFound = Object.keys(S.kobo.found).length;
  const used = Object.keys(rec), list = used.map((c) => T(KOB.ink[c])).join('・');
  const hints = [T(KOB.h1, { k: used.length }), T(KOB.h2, { list }), T(KOB.h3, { list: used.map((c) => `${T(KOB.ink[c])} ${rec[c]}`).join('・') })];
  const sw = (c, label) => `<div style="text-align:center"><div style="width:110px;height:110px;border-radius:50%;margin:auto;background:${c || '#fff'};border:3px dashed ${c ? 'transparent' : '#d8cdb8'};box-shadow:inset 0 -8px 0 rgba(0,0,0,.08)"></div><b>${T(label)}</b></div>`;
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>🎨 ${T(KOB.paint)}</h2><span class="pill">${T(KOB.found, { k: nFound, n: MIXES.length })}</span></div>
   <div class="stack"><div class="panel"><h3>${T(KOB.challenge)}</h3><div class="row" style="justify-content:center;gap:24px">${sw(tgt, KOB.target)}${sw(cur, KOB.yours)}</div>
    ${PL.res ? `<p style="text-align:center;font-weight:800">${PL.res === 'match' ? T(KOB.match, { c: T(nm) }) : T(KOB.close)}</p>` : ''}
    <h3>${T(KOB.tubes)}</h3><div class="row" style="flex-wrap:wrap;gap:8px;justify-content:center">${Object.keys(INKS).map((c) => `<button class="panel" data-ink="${c}" type="button" style="padding:8px;width:84px;border:0;cursor:pointer"><div style="width:44px;height:44px;border-radius:50%;margin:auto;background:${INKS[c]};border:2px solid #d8cdb8"></div><b>${T(KOB.ink[c])}</b><div class="muted">${T(KOB.drops, { k: PL.drops[c] || 0 })}</div></button>`).join('')}</div>
    <div class="row" style="justify-content:center;gap:8px;margin-top:10px"><button class="btn ghost" id="wash" type="button">🚿 ${T(KOB.wash)}</button><button class="btn ghost" id="hint" type="button">💡 ${T(KOB.hint)}</button>${cur ? `<button class="btn ghost" id="keepc" type="button">🖍 ${T(KOB.keep)}</button>` : ''}<button class="btn ghost" id="nextc" type="button">➡️ ${T(KOB.next)}</button></div>
    ${PL.hint ? `<p class="muted" style="text-align:center">${hints.slice(0, PL.hint).join('<br>')}</p>` : ''}</div>
    ${nFound ? `<div class="panel"><h3>🔬 ${T(KOB.whyT)}</h3><p>${T(KOB.why)}</p><div class="row" style="flex-wrap:wrap;gap:6px">${MIXES.map(([n, r], i) => S.kobo.found[i] ? `<span class="pill" style="background:${mixHex(r)};color:${labOf(mixHex(r))[0] < 55 ? '#fff' : '#3b3346'}">${T(n)}</span>` : '').join('')}</div></div>` : ''}</div>`);
  $('#bk').onclick = () => showKobo(null);
  $$('[data-ink]').forEach((b) => b.onclick = () => { const c = b.dataset.ink; PL.drops[c] = Math.min(9, (PL.drops[c] || 0) + 1); snd('pop');
    const now = mixHex(PL.drops), d = dE(now, tgt);
    if (d < 3) { const first = !S.kobo.found[S.kobo.mi % MIXES.length]; S.kobo.found[S.kobo.mi % MIXES.length] = today(); save(); PL.res = 'match'; snd('done'); if (first) confetti(); }
    else PL.res = d < 12 ? 'close' : '';
    koboPaint(); });
  $('#wash').onclick = () => { PL.drops = {}; PL.res = ''; koboPaint(); };
  $('#hint').onclick = () => { PL.hint = Math.min(3, PL.hint + 1); koboPaint(); };
  $('#nextc').onclick = () => { S.kobo.mi = (S.kobo.mi + 1) % MIXES.length; save(); PL.drops = {}; PL.hint = 0; PL.res = ''; koboPaint(); };
  const kc = $('#keepc'); if (kc) kc.onclick = () => { const c = cur.toLowerCase(); S.kobo.mixed = [...(S.kobo.mixed || []).filter((x) => x !== c), c].slice(-12); save(); toast(T(KOB.kept)); };
}

// ---- Chinese rings: ring 1 is the rightmost; ring k (k>1) moves only if ring k-1 is on and rings 1..k-2 are off ----
const RG = { n: 3, on: null, moves: 0, hint: 0 };
const ringMovable = (on, k) => k === 0 || (on[k - 1] && on.slice(0, k - 1).every((v) => !v));   // 0-based: index 0 = ring 1
function koboRings() {
  const max = ringsMax(); if (RG.n > max) RG.n = 3; if (!RG.on || RG.on.length !== RG.n) { RG.on = Array(RG.n).fill(true); RG.moves = 0; }
  const n = RG.n, W = 70 * n + 90, rec = S.kobo.rings;
  // drawn left (ring n) to right (ring 1); the bar runs from the handle on the left past ring 1 on the right
  const ringSVG = RG.on.map((on, k) => { const x = W - 60 - k * 70, y = on ? 60 : 118, glow = RG.hint >= 3 && ringMovable(RG.on, k), col = ['#ff6f91', '#ffb347', '#ffd84d', '#7dc26a', '#2fb0c6', '#8b6fd6', '#ff8f45', '#e0566f', '#5fbfd8'][k];
    return `<g data-ring="${k}" style="cursor:pointer">${glow ? `<ellipse cx="${x}" cy="${y}" rx="34" ry="30" fill="#fff59d" opacity=".8"/>` : ''}<line x1="${x}" y1="${y + 22}" x2="${x}" y2="150" stroke="#a8743f" stroke-width="4"/><ellipse cx="${x}" cy="${y}" rx="26" ry="22" fill="none" stroke="${col}" stroke-width="9"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="800" fill="#3b3346">${k + 1}</text></g>`; }).join('');
  const rows = Array.from({ length: max - 2 }, (_, i) => i + 3).map((m) => `<tr><td>${m}</td><td>${rec[m] != null ? rec[m] : '–'}</td><td>${rec[m] != null ? ringsMin(m) : '?'}</td></tr>`).join('');
  const lockRows = [[5, 'r5', KOB.key5], [7, 'r7', KOB.key7], [9, 'r9', KOB.key9]].filter(([, k]) => !koboHas(k)).map(([m, , why]) => `<div class="muted">🔒 ${T(KOB.ringsKey, { n: m, why: T(why) })}</div>`).join('');
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">← ${T(KOB.kobo)}</button><h2>⛓ ${T(KOB.rings)}</h2><span class="pill">${T(KOB.moves, { k: RG.moves })}</span></div>
   <div class="stack"><div class="panel"><p style="margin-top:0">${T(KOB.rule)}</p>
    <svg viewBox="0 0 ${W} 170" style="width:100%;max-width:${Math.min(760, W * 1.2)}px;display:block;margin:auto;touch-action:manipulation">
     <rect x="10" y="${60 - 5}" width="${W - 20}" height="10" rx="5" fill="#9aa5b1"/><rect x="0" y="40" width="34" height="40" rx="8" fill="#a8743f"/><rect x="10" y="148" width="${W - 20}" height="8" rx="4" fill="#d9b38c"/>${ringSVG}</svg>
    <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><span class="muted">${T(KOB.howMany)}:</span>${Array.from({ length: max - 2 }, (_, i) => i + 3).map((m) => `<button class="pill ${m === n ? 'on' : ''}" data-n="${m}" type="button">${m}</button>`).join('')}
     <button class="btn ghost" id="rst" type="button">🔄 ${T(KOB.reset)}</button><button class="btn ghost" id="rh" type="button">💡 ${T(KOB.hint)}</button></div>
    ${RG.hint ? `<p class="muted">${[T(KOB.rh1), T(KOB.rh2), T(KOB.rh3)].slice(0, RG.hint).join('<br>')}</p>` : ''}${lockRows}</div>
    <div class="panel"><h3>📒 ${T(KOB.rtable)}</h3><table style="width:100%;text-align:center"><tr><th>${T(KOB.howMany)}</th><th>${T(KOB.rmine)}</th><th>${T(KOB.rmin)}</th></tr>${rows}</table><p class="muted">${T(KOB.rpattern)}</p></div></div>`);
  $('#bk').onclick = () => showKobo(null);
  $$('[data-n]').forEach((b) => b.onclick = () => { RG.n = +b.dataset.n; RG.on = null; RG.hint = 0; koboRings(); });
  $('#rst').onclick = () => { RG.on = null; koboRings(); };
  $('#rh').onclick = () => { RG.hint = Math.min(3, RG.hint + 1); koboRings(); };
  $$('[data-ring]').forEach((el) => el.onclick = () => { const k = +el.dataset.ring;
    if (!ringMovable(RG.on, k)) { el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 400); toast(T(KOB.cant)); return; }
    RG.on[k] = !RG.on[k]; RG.moves++; snd('pop');
    if (RG.on.every((v) => !v)) { const m = ringsMin(n), best = rec[n] == null ? RG.moves : Math.min(rec[n], RG.moves); rec[n] = best; save(); snd('done'); confetti(); koboCheck();
      modal(`<h3>${T(KOB.rsolved, { n, k: RG.moves })}</h3><p>${RG.moves === m ? T(KOB.rperfect) : T(KOB.rbest, { m })}</p>`, [{ t: T(KOB.reset), fn: () => { RG.on = null; koboRings(); } }]); }
    koboRings(); });
}

window.addEventListener('storage', (e) => { if (e.key === WORKS_KEY && $('[data-del]')) showKobo(null); });
KOBO_FRESH.push(() => { Object.assign(SK, { img: null, undo: [] }); Object.assign(PL, { drops: {}, hint: 0, res: '' }); Object.assign(RG, { n: 3, on: null, moves: 0, hint: 0 }); KROOM = null; });
KOBO_ROOMS.push({ id: 'sketch', e: '🖍', n: KOB.sketch, d: KOB.sketchTxt, key: null, show: koboSketch }, { id: 'rings', e: '⛓', n: KOB.rings, d: KOB.ringsTxt, key: null, show: koboRings },
  { id: 'paint', e: '🎨', n: KOB.paint, d: KOB.paintTxt, key: 'paint', why: KOB.paintKey, show: koboPaint });

// ---- hooks: the workshop on the map and in the activity list ----
{ const m0 = HOOK.afterMap; HOOK.afterMap = () => { if (m0) m0(); const map = $('.map'); if (!map) return; const op = koboHas('open');
  map.insertAdjacentHTML('beforeend', `<button class="place" data-kobo="1" style="left:90%;top:52%" type="button" aria-label="${T(KOB.kobo).replace(/<[^>]+>/g, '')}">${op ? '🎨' : '🔒'}<span class="plate">${T(KOB.kobo)}</span></button>`);
  $('[data-kobo]', map).onclick = () => showKobo(null);
  const acts = $('.acts'); if (acts) { acts.insertAdjacentHTML('beforeend', `<button class="chcard ${op ? '' : 'locked'}" data-kobo2="1" type="button"><span class="bigemo">${op ? '🎨' : '🔒'}</span><span class="t">${T(KOB.kobo)}</span><span class="s">${T(KOB.koboTxt)}</span></button>`); $('[data-kobo2]').onclick = () => showKobo(null); } }; }
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(KOB).flatMap((v) => (v.ja ? [v] : Object.values(v))), ...MIXES.map((m) => m[0])];
