// かぞえ島 game layer, built on top of the learning engine in index.html.
// - Buddy grows with XP from correct answers.
// - Meadow: an island friend comes to play; every problem solved together fills the friendship meter; then you become friends.
//   Every 5th catch of a species is a shiny one — fixed, not random, so there is no slot-machine loop.
// - Farm: a problem you missed (or needed a hint for) is planted as a seed. Water it by solving a variant of it,
//   at most once per day; three waterings → harvest. Crops never wither.   (spaced practice of mistakes)
// - Acorns buy furniture to decorate the island; villagers send letters as friendship grows; real-time sky & season.
const GL = {
  acorns: tx('どんぐり', 'Acorns', '橡果'),
  grass: tx('のはら', 'Meadow', '草地'), farm: tx('はたけ', 'Farm', '农田'), shop: tx('どんぐり商店', 'Acorn Shop', '橡果商店'), mail: tx('ポスト', 'Mailbox', '信箱'), decorate: tx('島をかざる', 'Decorate', '装饰小岛'),
  grassTxt: tx('島のなかまが あそびに来る。いっしょに問題をといて、ともだちになろう', 'Island friends come to play — solve problems together to become friends', '岛上的伙伴会来玩，一起解题交朋友吧'),
  farmTxt: tx('まちがえたり、ヒントを使ったりした問題が、たねになるよ。水やりは、たね1つにつき1日1回まで。お休みしても、かれないよ。', 'Problems you missed or needed a hint for become seeds. Each seed can be watered once a day — and nothing wilts if you take a break.', '答错或用了提示的题会变成种子。每颗种子一天最多浇一次水，休息几天也不会枯萎。'),
  shopTxt: tx('どんぐりで家具やかざりを買う', 'Spend acorns on furniture', '用橡果买家具和装饰'),
  mailTxt: tx('島のなかまからの手紙', 'Letters from islanders', '岛民的来信'),
  decoTxt: tx('買ったものを島におく', 'Place what you bought', '把买的东西放到岛上'),
  needClear: tx('どこかの章をクリアすると、のはらに行けるよ。', 'Clear any chapter first, then the meadow opens.', '先通关任意一章，就能去草地了。'),
  wild: tx('{n} が あそびに来たよ! いっしょに考えよう', '{n} came to play! Let’s think together', '{n}来玩啦！一起想一想吧'),
  shinyWild: tx('✨ キラキラの {n} が あそびに来たよ!', '✨ A sparkly {n} came to play!', '✨ 闪闪发光的 {n} 来玩啦！'),
  fight: tx('いっしょに問題をとく', 'Solve a problem together', '一起解题'), run: tx('またね', 'See you', '下次见'),
  hit: tx('{b}と いっしょに {m}! なかよしが ふえた。', 'You and {b}: {m}! Friendship grows.', '和{b}一起：{m}！友情加深了。'), effective: tx('なかよしゲージが いっぱい! ともだちになれそう!', 'The friendship meter is full!', '友情满格啦！可以交朋友了！'),
  throwBall: tx('ともだちになろう', 'Let’s be friends', '交个朋友吧'), caught: tx('やった! {n} と ともだちになった!', 'Yay! {n} is your friend now!', '太好了！和 {n} 成为朋友了！'),
  caughtN: tx('なかよしになった回数: {k}', 'Times befriended: {k}', '交朋友次数：{k}'), roundDone: tx('この回はおしまい。島にもどって、ひと休みしよう。', 'That round is done — head back to the island and take a rest.', '这一轮结束啦，回岛上休息一下吧。'),
  newProblem: tx('はじめてとけた問題!', 'A problem solved for the first time!', '第一次解出的题！'),
  plantMe: tx('はたけにうえる', 'Plant it on my farm', '种到农田里'),
  farmEmpty: tx('まだ たねがないよ。まちがえた問題やヒントを使った問題が、ここに たねとして うえられるよ。答えたあとの「はたけにうえる」ボタンで、好きな問題をうえることもできるよ。', 'No seeds yet. Problems you miss or need a hint for get planted here — and after any answer you can tap “Plant it on my farm”.', '还没有种子。答错或用了提示的题会种在这里；答完题后点“种到农田里”，也能种自己喜欢的题。'),
  trainer: tx('たんけんカード', 'Explorer card', '探险卡'), trainerTxt: tx('ランク・今日のクエスト・バッジ', 'Rank, today’s quests, badges', '等级·今日任务·徽章'),
  farmFull: tx('はたけがいっぱいだね。たねは、たねぶくろで待っているよ。しゅうかくして場所があいたら、順番にうえるよ。', 'The farm is full. The seed waits in your seed bag and gets planted in order when a plot frees up.', '农田满了。种子在种子袋里等着，收获腾出地方后按顺序种下。'),
  bag: tx('たねぶくろ: {k}こ', 'seed bag: {k}', '种子袋：{k}颗'), waterRule: tx('ヒントを使わずに1回でとけたら、水やりができるよ', 'Solve it first try without a hint to water the plant', '不看提示一次做对，就能浇水'),
  allGrad: tx('いま行ける場所の問題は、ぜんぶおさらいを卒業したよ! 新しい場所に進んでみよう', 'Every problem in the places you’ve opened has graduated! Try a new place', '已开放地点的题都毕业了！去新地方看看吧'),
  notYet: tx('考え直してとけたね。きょうは考え方を練習できたよ。つぎは、ひとりでためしてみよう', 'You worked it out — good practice today. Next time, try it on your own', '重新想了想做出来了，今天练到了思路。下次试试自己一次做对'),
  canDo: tx('前にむずかしかった問題を、ひとりで とけた! できるようになったね。', 'You solved a problem that was hard before — all by yourself! You can do it now.', '以前觉得难的题，这次自己解出来了！你学会了。'),
  watered: tx('きょうは もう水をあげたよ。また明日!', 'Already watered today — come back tomorrow!', '今天已经浇过水了，明天再来！'),
  water: tx('💧 水やり: この問題をとこう', '💧 Watering: solve this problem', '💧 浇水：解这道题'),
  grew: tx('すくすく そだった!', 'It grew!', '长大了！'), harvest: tx('しゅうかく! {c} をゲット', 'Harvest! You got {c}', '收获！得到 {c}'),
  planted: tx('🌱 はたけに たねを うえたよ(あとで水やりしよう)', '🌱 A seed was planted on your farm (water it later)', '🌱 在农田里种下了种子（之后来浇水）'),
  stage: tx('{w}/3 回 水やり', 'watered {w}/3', '浇水 {w}/3'), ready: tx('しゅうかくできる!', 'Ready to harvest!', '可以收获了！'),
  buy: tx('かう', 'Buy', '买'), sell: tx('うる', 'Sell', '卖'), have: tx('もっている: {k}', 'Owned: {k}', '拥有：{k}'), poor: tx('どんぐりが たりないよ', 'Not enough acorns', '橡果不够'),
  bought: tx('{i} を かった!', 'Bought {i}!', '买了 {i}！'), sold: tx('{i} を うった (+{p})', 'Sold {i} (+{p})', '卖了 {i}（+{p}）'),
  decoHelp: tx('おきたいものを えらんで、地図をタップ。おいたものをタップすると しまえるよ。', 'Pick an item, then tap the map. Tap a placed item to put it away.', '选一个东西再点地图；点已放的东西可以收回。'),
  decoDone: tx('かざりおわり', 'Done decorating', '装饰完成'), nothing: tx('かざるものがないよ。どんぐり商店で買おう!', 'Nothing to place yet — buy something at the Acorn Shop!', '还没有可放的东西，去橡果商店买吧！'),
  noMail: tx('手紙はまだないよ。', 'No letters yet.', '还没有信。'), gift: tx('プレゼント: {i}', 'Gift: {i}', '礼物：{i}'),
  evo1: tx('{b}が すくすく 大きくなっていく…', '{b} is growing bigger…', '{b}在慢慢长大……'), evo2: tx('{b}が そだったよ! (レベル{s})', '{b} grew up! (Level {s})', '{b}长大了！（等级{s}）'),
  xp: tx('なかまのレベル {s} · けいけんち {x}', 'Buddy level {s} · XP {x}', '伙伴等级 {s} · 经验 {x}'),
  morning: tx('おはよう! きょうも いっしょに 考えよう。', 'Good morning! Let’s think together today.', '早上好！今天也一起动脑吧。'),
  day: tx('こんにちは! はたけと のはらも 見てみてね。', 'Hello! Check the farm and the meadow too.', '你好！也去看看农田和草地吧。'),
  evening: tx('ゆうがただね。少しだけ やっていく?', 'It’s evening. Just a little today?', '傍晚了，做一点点吗？'),
  night: tx('夜だよ。星がきれい。つかれたら また明日ね。', 'It’s night — look at the stars. If you’re tired, see you tomorrow.', '晚上了，星星真美。累了就明天见。'),
  seasons: [tx('冬', 'Winter', '冬'), tx('春', 'Spring', '春'), tx('夏', 'Summer', '夏'), tx('秋', 'Autumn', '秋')],
  dateFmt: tx('{s} · {m}月{d}日', '{s} · {m}/{d}', '{s} · {m}月{d}日'),
  again: tx('もういちど のはらへ', 'Back to the meadow', '再去草地'),
  team: tx('ともだちになった なかま', 'Friends made', '交到的朋友'), types: tx('すきなもの', 'Likes', '喜欢'),
};
const MOVE_NAMES = { count: tx('かけ算ビーム', 'Multiply Beam', '乘法光线'), shape: tx('かたちスラッシュ', 'Shape Slash', '图形斩'), frac: tx('ぶんすうカッター', 'Fraction Cutter', '分数切割'), prob: tx('サイコロロール', 'Dice Roll', '骰子翻滚'), inf: tx('むげんスター', 'Infinity Star', '无限之星') };
const TYPES = { nami: 'count', kuru: 'count', mugi: 'count', guri: 'count', hoshi: 'count', popu: 'count', rin: 'count', sora: 'count', chun: 'count', moko: 'count', tsuno: 'shape', kibi: 'frac', kaku: 'shape', piza: 'frac', koro: 'prob', mugen: 'inf' };
for (const [k, s] of Object.entries(SPECIES)) if (s.type && !TYPES[k]) TYPES[k] = s.type; // wild friends carry their own type
function farmCap() { return typeof rankFarm === 'function' ? rankFarm() : 6; }
const TYPE_NAMES = { count: tx('かぞえ', 'Count', '计数'), shape: tx('かたち', 'Shape', '图形'), frac: tx('ぶんすう', 'Fraction', '分数'), prob: tx('かくりつ', 'Chance', '概率'), inf: tx('むげん', 'Infinity', '无限') };
const cropOf = (w) => CROPS[w] || CROPS.count;
const CROPS = { drill: { e: '🍅', n: tx('トマト', 'tomato', '番茄'), p: 13 }, social: { e: '🍙', n: tx('おにぎり', 'rice ball', '饭团'), p: 13 }, count: { e: '🥕', n: tx('にんじん', 'carrot', '胡萝卜'), p: 12 }, shape: { e: '🥔', n: tx('じゃがいも', 'potato', '土豆'), p: 15 }, frac: { e: '🍉', n: tx('すいか', 'watermelon', '西瓜'), p: 12 }, prob: { e: '🌽', n: tx('とうもろこし', 'corn', '玉米'), p: 14 }, inf: { e: '🍆', n: tx('なす', 'eggplant', '茄子'), p: 16 } };
const SHOP = [
  ['sunflower', '🌻', 8, tx('ひまわりの鉢', 'potted sunflower', '向日葵花盆')], ['flowerbed', '🌷', 10, tx('花だん', 'flowerbed', '花坛')], ['mush', '🍄', 8, tx('きのこのいす', 'mushroom stool', '蘑菇凳')],
  ['tree', '🌳', 15, tx('木', 'tree', '树')], ['cactus', '🌵', 12, tx('サボテンの鉢', 'potted cactus', '仙人掌盆栽')], ['bench', '🪑', 20, tx('いす', 'chair', '椅子')],
  ['lantern', '🏮', 25, tx('ちょうちん', 'lantern', '灯笼')], ['pumpkinL', '🎃', 20, tx('かぼちゃランタン', 'pumpkin lantern', '南瓜灯')], ['snowman', '⛄', 30, tx('ゆきだるま', 'snowman', '雪人')],
  ['koi', '🎏', 35, tx('こいのぼり', 'carp streamer', '鲤鱼旗')], ['tent', '⛺', 40, tx('テント', 'tent', '帐篷')], ['fountain', '⛲', 60, tx('ふんすい', 'fountain', '喷泉')], ['wheel', '🎡', 90, tx('かんらんしゃ', 'Ferris wheel', '摩天轮')],
];
const GIFTS = { hat: ['🎩', tx('シルクハット', 'top hat', '礼帽')], bear: ['🧸', tx('ぬいぐるみ', 'teddy bear', '玩具熊')], piano: ['🎹', tx('ピアノ', 'piano', '钢琴')], globe: ['🌏', tx('地球ぎ', 'globe', '地球仪')], trophy: ['🏆', tx('トロフィー', 'trophy', '奖杯')] };
window.EXTRA_TX = [...Object.values(GL).flat(), ...Object.values(MOVE_NAMES), ...Object.values(TYPE_NAMES), ...Object.values(CROPS).map((c) => c.n), ...SHOP.map((s) => s[3]), ...Object.values(GIFTS).map((g) => g[1])];

// ---------- state ----------
function gameInit() {
  for (const [k, v] of Object.entries({ acorns: 0, xp: 0, caught: {}, farm: [], items: {}, placed: [], hearts: {}, mail: [], greeted: '', daily: { date: '', solved: {} }, hist: {} })) if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(v));
  if (!S.starter) { S.starter = 1; S.items.sunflower = (S.items.sunflower || 0) + 2; S.items.bench = (S.items.bench || 0) + 1; }
}
gameInit();
HOOK.reset = () => { gameInit(); LEARN_INIT(); BATTLE = null; DECO = null; };
const itemInfo = (id) => { const s = SHOP.find((x) => x[0] === id); if (s) return { e: s[1], n: s[3], p: s[2] }; const c = Object.entries(CROPS).find(([k]) => 'crop_' + k === id); if (c) return { e: c[1].e, n: c[1].n, p: c[1].p }; const g = GIFTS[id.replace('gift_', '')]; return g ? { e: g[0], n: g[1], p: 0 } : { e: '❔', n: tx('?', '?', '?'), p: 0 }; };
function buddyStage() { return S.xp >= 60 ? 3 : S.xp >= 20 ? 2 : 1; }
function phase() { const h = new Date().getHours(); return h < 5 ? 'night' : h < 10 ? 'morning' : h < 17 ? 'day' : h < 19 ? 'evening' : 'night'; }
function season() { const m = new Date().getMonth() + 1; return m <= 2 || m === 12 ? 0 : m <= 5 ? 1 : m <= 8 ? 2 : 3; }
function toast(t) { $$('.toast').forEach((x) => x.remove()); const d = document.createElement('div'); d.className = 'toast'; d.innerHTML = t; document.body.appendChild(d); setTimeout(() => d.classList.add('out'), 2200); setTimeout(() => d.remove(), 2800); }

// ---------- HUD (date + acorns) ----------
HOOK.top = () => {
  const ph = { morning: '🌤', day: '☀️', evening: '🌇', night: '🌙' }[phase()], d = new Date();
  $('#acorns').innerHTML = `🌰 <span class="acorn-n">${S.acorns}</span>`; $('#acorns').title = T(GL.acorns).replace(/<[^>]+>/g, '');
  $('#cal').innerHTML = `${ph} ${T(GL.dateFmt, { s: T(GL.seasons[season()]), m: d.getMonth() + 1, d: d.getDate() })}`;
};

// ---------- every correct answer feeds the game ----------
HOOK.correct = (p, info) => {
  const before = buddyStage(), d = today();
  if (S.daily.date !== d) S.daily = { date: d, solved: {} };
  const again = S.daily.solved[p.id] || 0, firstEver = (S.prob[p.id] || {}).n === 1; S.daily.solved[p.id] = again + 1;
  const gain = (again ? 1 : 5) + (firstEver ? 3 : 0); S.acorns += gain;
  if (!again) { S.xp += 2; const ch = chById(p.ch);
    if (ch) { const h0 = S.hearts[ch.host] || 0, h1 = Math.min(5, h0 + 0.5); S.hearts[ch.host] = h1; for (const t of [2, 4]) if (h0 < t && h1 >= t) sendLetter(ch.host, t, ch.id); } }
  const hist = S.hist[p.id] || (S.hist[p.id] = { struggled: '', mastered: '' });
  if (info.wrong || info.hinted) { if (!hist.struggled) hist.struggled = d; plantSeed(p); }
  else if (hist.struggled && hist.struggled !== d && !hist.mastered) { hist.mastered = d; setTimeout(() => toast(`🎉 ${T(GL.canDo)}`), 900); }
  if (firstEver) setTimeout(() => toast(`✨ ${T(GL.newProblem)} 🌰 +${gain}`), 200);
  save(); HOOK.top();
  if (buddyStage() > before) setTimeout(evolve, 900);
};
function evolve() {
  const b = T(SPECIES[S.buddy].name), s = buddyStage();
  modal(`<div class="evo">${critter(S.buddy, 120, { stage: s - 1, still: true })}</div><p id="evotxt" style="font-weight:800;margin:0">${T(GL.evo1, { b })}</p>`, [{ t: '▶', fn: () => modal(`<div class="sparkle">${critter(S.buddy, 130, { stage: s, happy: true })}</div><h2>${T(GL.evo2, { b, s })}</h2>`, [{ t: T(L.close) }]) }]);
  snd('done');
}
function sendLetter(host, level, chId) {
  const gift = level === 2 ? ['hat', 'bear', 'globe'][Object.keys(S.hearts).length % 3] : ['piano', 'trophy'][Object.keys(S.hearts).length % 2];
  S.mail.unshift({ from: host, level, ch: chId, gift: 'gift_' + gift, read: false, date: today() });
  S.items['gift_' + gift] = (S.items['gift_' + gift] || 0) + 1;
}
function letterText(m) {
  const n = T(SPECIES[m.from].name), ch = (m.ch && chById(m.ch)) || ALLCH.find((c) => c.host === m.from), topic = ch ? T(ch.place) : '';
  if (m.level === 0) { const it = itemInfo(m.item || 'bench'); return LANGTXT(`{name}へ<br><br>島に ${it.e}${T(it.n)} を おいてくれたね! 通るたびに、なんだか うれしくなるよ。<br>お店にも また来てね。<br><br>${n}より`, `Dear {name},<br><br>You put ${it.e} ${T(it.n)} on the island! It makes me happy every time I walk by.<br>Come visit the shop again.<br><br>From ${n}`, `亲爱的{name}：<br><br>你在岛上放了${it.e}${T(it.n)}！每次经过都觉得好开心。<br>欢迎再来店里玩。<br><br>${n}`).replace(/\{name\}/g, esc(S.name)); }
  return m.level === 2
    ? LANGTXT(`{name}へ<br><br>いつも「${topic}」で いっしょに考えてくれて ありがとう! まちがえても、あきらめないで 考えなおすところが すてきだよ。<br>お礼に プレゼントを おくるね。<br><br>${n}より`, `Dear {name},<br><br>Thank you for thinking with me at ${topic}! I love how you keep going even after a mistake.<br>Here’s a little present.<br><br>From ${n}`, `亲爱的{name}：<br><br>谢谢你一直在「${topic}」和我一起动脑！你做错了也不放弃、重新思考，这一点特别棒。<br>送你一份小礼物。<br><br>${n}`).replace(/\{name\}/g, esc(S.name))
    : LANGTXT(`{name}へ<br><br>「${topic}」で、いっしょに たくさん考えたね! またきみと話せて、うれしいよ。<br>とっておきの[宝物|たからもの]を あげるね。<br><br>${n}より`, `Dear {name},<br><br>We’ve done a lot of thinking together at ${topic}! I’m always happy to talk with you.<br>Here is my special treasure.<br><br>From ${n}`, `亲爱的{name}：<br><br>我们在「${topic}」一起想了好多题！每次和你聊天我都很开心。<br>把我的宝贝送给你。<br><br>${n}`).replace(/\{name\}/g, esc(S.name));
}

// ---------- map: sky, places, decorations ----------
const PLACES = [
  { id: 'grass', x: 75, y: 79, e: '🌾', go: () => showBattle() },
  { id: 'farm', x: 35, y: 83, e: '🧺', go: () => showFarm() },
  { id: 'shop', x: 58, y: 47, e: '🏪', go: () => showShop() },
  { id: 'mail', x: 22, y: 54, e: '📮', go: () => showMail() },
];
let DECO = null; // selected item id while decorating
HOOK.afterMap = () => {
  const map = $('.map'); if (!map) return;
  const unread = S.mail.filter((m) => !m.read).length, ready = S.farm.filter((f) => f.w >= 3).length, thirsty = S.farm.filter((f) => f.w < 3 && f.last !== today()).length;
  const badge = { mail: unread, farm: ready || thirsty };
  map.insertAdjacentHTML('beforeend', S.placed.map((it, i) => `<span class="deco" data-pi="${i}" style="left:${it.x}%;top:${it.y}%">${itemInfo(it.id).e}</span>`).join('') +
    PLACES.map((pl) => `<button class="place" data-place="${pl.id}" style="left:${pl.x}%;top:${pl.y}%" type="button" aria-label="${T(GL[pl.id]).replace(/<[^>]+>/g, '')}">${pl.e}${badge[pl.id] ? `<i>${badge[pl.id]}</i>` : ''}<span class="plate">${T(GL[pl.id])}</span></button>`).join(''));
  const buddy = $('.map > div[style*="left:12%"]'); if (buddy) buddy.innerHTML = critter(S.buddy, 48, { stage: buddyStage() });
  $$('[data-place]', map).forEach((b) => b.onclick = () => PLACES.find((p) => p.id === b.dataset.place).go());
  // activity cards under the map
  const cards = [['trainer', '🏅', GL.trainerTxt, () => (typeof unlockLv === 'function' ? `Lv ${unlockLv()}` : '')], ['grass', '🌾', GL.grassTxt, () => `${T(GL.caughtN, { k: Object.values(S.caught).reduce((a, b) => a + b, 0) })}`], ['farm', '🧺', GL.farmTxt, () => `${S.farm.length} / ${farmCap()}`], ['shop', '🏪', GL.shopTxt, () => `🌰 ${S.acorns}`], ['mail', '📮', GL.mailTxt, () => unread ? `✉️ ${unread}` : ''], ['decorate', '🪴', GL.decoTxt, () => `${Object.entries(S.items).filter(([k, v]) => v > 0 && !k.startsWith('crop_')).reduce((a, [, v]) => a + v, 0)}`]];
  map.insertAdjacentHTML('afterend', `<div class="board-list acts">${cards.map(([id, e, t, extra]) => `<button class="chcard" data-act="${id}" type="button"><span class="bigemo">${e}</span><span class="t">${T(GL[id])}</span><span class="s">${T(t)} <span class="st">${extra()}</span></span></button>`).join('')}</div>
    <div class="panel xpbar"><span>${critter(S.buddy, 40, { stage: buddyStage(), still: true })}</span><div style="flex:1;min-width:0"><b style="color:var(--ink)">${T(GL.xp, { s: buddyStage(), x: S.xp })}</b><div class="bar"><i style="width:${buddyStage() === 3 ? 100 : Math.round((S.xp - (buddyStage() === 1 ? 0 : 20)) / (buddyStage() === 1 ? 20 : 40) * 100)}%"></i></div></div></div>`);
  $$('[data-act]').forEach((b) => b.onclick = () => (b.dataset.act === 'decorate' ? startDecorate() : b.dataset.act === 'trainer' ? showTrainer() : PLACES.find((p) => p.id === b.dataset.act).go()));
  if (S.greeted !== today()) { S.greeted = today(); save(); setTimeout(() => toast(`${critter(S.buddy, 34, { stage: buddyStage(), still: true })} ${T(GL[phase()])}`), 500); }
  if (DECO !== null) decorateUI();
};
function startDecorate() { DECO = ''; showMap(); }
function decorateUI() {
  const map = $('.map'), owned = Object.entries(S.items).filter(([k, v]) => v > 0 && !k.startsWith('crop_'));
  map.classList.add('decorating');
  map.insertAdjacentHTML('beforebegin', `<div class="panel decobar"><div class="tdesc">${owned.length ? T(GL.decoHelp) : T(GL.nothing)}</div><div class="chipbar">${owned.map(([k, v]) => `<button class="chip ${DECO === k ? 'on' : ''}" data-deco="${k}" type="button">${itemInfo(k).e} ${T(itemInfo(k).n)} ×${v}</button>`).join('')}</div><button class="btn" id="decodone" type="button">${T(GL.decoDone)}</button></div>`);
  $$('[data-deco]').forEach((b) => b.onclick = () => { DECO = b.dataset.deco; snd('pop'); showMap(); });
  $('#decodone').onclick = () => { DECO = null; showMap(); };
  map.addEventListener('click', (e) => {
    const placed = e.target.closest('.deco');
    if (placed) { const it = S.placed.splice(+placed.dataset.pi, 1)[0]; S.items[it.id] = (S.items[it.id] || 0) + 1; save(); snd('pop'); showMap(); return; }
    if (!DECO || e.target.closest('button')) return;
    if (!(S.items[DECO] > 0)) return;
    const r = map.getBoundingClientRect(); S.placed.push({ id: DECO, x: +((e.clientX - r.left) / r.width * 100).toFixed(1), y: +((e.clientY - r.top) / r.height * 100).toFixed(1) });
    const placedId = DECO; S.items[DECO]--; if (!S.items[DECO]) DECO = '';
    if (!S.decoLetter) { S.decoLetter = 1; S.mail.unshift({ from: 'kibi', level: 0, item: placedId, gift: 'gift_bear', read: false, date: today() }); S.items.gift_bear = (S.items.gift_bear || 0) + 1; }
    save(); snd('pop'); showMap();
  }, true);
}

// ---------- meadow: a friend comes to play ----------
function battlePool() { return ALLCH.filter((c) => S.cleared[c.id]).flatMap((c) => PROBLEMS[c.id].map((d, i) => ({ c: c.id, i, sets: d.sets.length, id: d.id }))); }
// pick a problem: skip the last few used, prefer ones the child found hard (more wrong / hinted attempts)
function pickBattleProblem(pool) {
  if (typeof LEARN !== 'undefined') return LEARN.pickOne(S, today(), (BATTLE && BATTLE.recent) || [], (BATTLE && BATTLE.id) + ':' + ((BATTLE && BATTLE.round) || 0));
  const recent = (BATTLE && BATTLE.recent) || [], cand = pool.filter((q) => !recent.includes(q.id)), list = cand.length ? cand : pool;
  const w = list.map((q) => { const r = S.prob[q.id] || { n: 0, first: 0, wrong: 0 }; return 1 + r.wrong + (r.n - r.first); });
  let x = Math.random() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < list.length; i++) { x -= w[i]; if (x <= 0) return list[i]; } return list[list.length - 1];
}
const hitLine = (m) => T(GL.hit, { b: T(SPECIES[S.buddy].name), m: T(MOVE_NAMES[m.world]) }) + (m.last ? T(GL.effective) : '');
let BATTLE = null; // one encounter; survives language re-renders, cleared by Back / Run / finishing
function showBattle(resume) {
  const pool = battlePool();
  if (!pool.length) { modal(`${critter('kaku', 70)}<p>${T(GL.needClear)}</p>`, [{ t: T(L.close) }]); return; }
  if ((!resume || !BATTLE) && typeof LEARN !== 'undefined' && !LEARN.pickOne(S, today(), [], 'probe')) { modal(`${critter('hoshi', 70, { happy: true })}<p>${T(GL.allGrad)}</p>`, [{ t: T(L.map), fn: showMap }]); return; }
  if (!resume || !BATTLE) {
    const all = Object.keys(SPECIES), fresh = all.filter((k) => !S.caught[k]);
    const src = fresh.length && Math.random() < 0.7 ? fresh : all, sp = typeof pickEncounter === 'function' ? pickEncounter() : src[Math.floor(Math.random() * src.length)];
    BATTLE = { id: Date.now(), sp, ticket: !!(typeof pickEncounter === 'function' && pickEncounter.ticket), shiny: ((S.caught[sp] || 0) + 1) % 5 === 0, maxHp: 3, hp: 3, round: 0, phase: 'intro', q: null, lastWorld: 'count', recent: [], msg: null };
  }
  const B = BATTLE; rerender = () => showBattle(true);
  const shinyStyle = B.shiny ? 'filter:hue-rotate(160deg) saturate(1.4)' : '';
  const leave = () => { BATTLE = null; showMap(); };
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>🌾 ${T(GL.grass)}</h2></div>
    <div class="arena"><div class="foe"><div class="hpbox"><b>${T(SPECIES[B.sp].name)}${B.shiny ? ' ✨' : ''}</b> <span class="typ">${T(TYPE_NAMES[TYPES[B.sp] || 'count'])}</span><div class="hp">💛<i id="hpbar" style="width:${(B.maxHp - B.hp) / B.maxHp * 100}%"></i></div></div><div class="pad-grass" id="wild">${B.phase === 'caught' ? '<span class="ball">🤝</span>' : critter(B.sp, 110, {}).replace('<svg ', `<svg style="${shinyStyle}" `)}</div></div>
      <div class="me"><div class="pad-grass">${critter(S.buddy, 90, { stage: buddyStage() })}</div><div class="hpbox"><b>${T(SPECIES[S.buddy].name)}</b> Lv${buddyStage()}</div></div>
      <div class="textbox"><span id="btxt"></span><div class="row" id="bbtns" style="margin-top:8px"></div></div></div><div class="stack" id="qstage"></div>`);
  $('#bk').onclick = leave;
  const btns = (list) => { $('#bbtns').innerHTML = list.map((b, i) => `<button class="btn ${i ? 'ghost' : ''}" data-b="${i}" type="button">${b.t}</button>`).join(''); $$('[data-b]').forEach((x) => x.onclick = () => list[+x.dataset.b].fn()); };
  const say2 = (t) => typeLine($('#btxt'), t);
  const ask = () => { const q = B.q; const p = LEARN.serve(S, q.c, q.i, 'bt:' + B.id + ':' + B.round); btns([{ t: T(GL.run), fn: leave }]);
    runTask(p, { shell: false, ctx: 'bt:' + B.id + ':' + B.round, index: B.round, total: B.maxHp, onDone: hit }); };
  const fight = () => { B.q = pickBattleProblem(pool); if (!B.q) { BATTLE = null; modal(`${critter('hoshi', 70, { happy: true })}<p>${T(GL.allGrad)}</p>`, [{ t: T(L.map), fn: showMap }]); return; } B.recent = [...B.recent, B.q.id].slice(-3); B.lastWorld = (chById(B.q.c) || {}).world || 'count'; B.phase = 'q'; ask(); $('#qstage').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); };
  const hit = () => { B.round++; B.hp--; B.phase = B.hp > 0 ? 'hit' : 'down'; $('#qstage').innerHTML = ''; window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    const w = $('#wild'); w.classList.remove('hurt'); void w.offsetWidth; w.classList.add('hurt'); snd('step'); $('#hpbar').style.width = ((B.maxHp - B.hp) / B.maxHp * 100) + '%';
    B.msg = { world: B.lastWorld, last: B.hp === 0 }; say2(hitLine(B.msg)); actions(); };
  // the friendship is committed first (so leaving during the animation never loses it); the result is shown only if still on this battle
  const catchIt = () => { if (B.phase === 'caught') return; B.phase = 'caught'; S.caught[B.sp] = (S.caught[B.sp] || 0) + 1; S.acorns += 15; if (B.ticket && S.tickets > 0) S.tickets--; save(); if (typeof EVT !== 'undefined') EVT.emit('catch', { sp: B.sp }); HOOK.top();
    $('#bbtns').innerHTML = ''; $('#wild').innerHTML = `<span class="ball">🤝</span>`; snd('step'); const me = B;
    setTimeout(() => { if (BATTLE !== me) { toast(T(GL.caught, { n: T(SPECIES[me.sp].name) })); return; } snd('done'); confetti(); BATTLE = null; rerender = showMap;
      modal(`${critter(me.sp, 110, { happy: true }).replace('<svg ', `<svg style="${me.shiny ? 'filter:hue-rotate(160deg) saturate(1.4)' : ''}" `)}<h2>${T(GL.caught, { n: T(SPECIES[me.sp].name) + (me.shiny ? ' ✨' : '') })}</h2><p style="margin:0">${T(GL.caughtN, { k: S.caught[me.sp] })} · 🌰 +15</p><p class="muted" style="margin:0">${T(GL.roundDone)}</p>`, [{ t: T(L.map), fn: showMap }, { t: '🌾 ' + T(GL.again), fn: () => showBattle(), cls: 'ghost' }]); }, REDUCED ? 100 : 1800); };
  const actions = () => { if (B.phase === 'down') btns([{ t: '🤝 ' + T(GL.throwBall), fn: catchIt }]); else btns([{ t: T(GL.fight), fn: fight }, { t: T(GL.run), fn: leave }]); };
  if (B.phase === 'intro') { say2(T(B.shiny ? GL.shinyWild : GL.wild, { n: T(SPECIES[B.sp].name) })); snd('pop'); actions(); }
  else if (B.phase === 'q') { say2(T(B.shiny ? GL.shinyWild : GL.wild, { n: T(SPECIES[B.sp].name) })); ask(); }
  else if (B.phase === 'caught') { say2(T(GL.caught, { n: T(SPECIES[B.sp].name) })); }
  else { say2(B.msg ? hitLine(B.msg) : ''); actions(); }
}

// ---------- farm ----------
HOOK.missed = (p) => plantSeed(p, true);
function plantSeed(p, quiet) {
  if (S.farm.some((f) => f.pid === p.id)) return false;
  if (S.farm.length >= farmCap()) { if (!S.seedBag.some((b) => b.pid === p.id)) { S.seedBag.push({ pid: p.id, ch: p.ch, idx: p.idx }); save(); } if (!quiet) setTimeout(() => toast(T(GL.farmFull)), 400); return false; }
  S.farm.push({ uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), pid: p.id, ch: p.ch, idx: p.idx, w: 0, last: '' }); save();
  if (!quiet) setTimeout(() => toast(T(GL.planted)), 400); return true;
}
function showFarm() {
  rerender = showFarm; const t = today(); S.farm.forEach((f) => { if (!f.uid) f.uid = f.pid + '_' + Math.random().toString(36).slice(2, 6); if (S.retired && S.retired[f.pid]) f.w = 3; });
  const plot = (f, i) => { if (!f) return `<div class="plot empty"></div>`; const ch = chById(f.ch), crop = cropOf((ch && ch.world) || 'count');
    const glyph = f.w >= 3 ? crop.e : ['🟤', '🌱', '🌿'][f.w];
    return `<button class="plot ${f.last === t ? 'wet' : ''} ${f.w >= 3 ? 'ripe' : ''}" data-plot="${i}" type="button"><span class="crop">${glyph}</span><small>${f.w >= 3 ? T(GL.ready) : T(GL.stage, { w: f.w })}${f.last === t && f.w < 3 ? ' 💧' : ''}</small><small class="muted">${ch ? T(ch.place) : ''}</small></button>`; };
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>🧺 ${T(GL.farm)}</h2></div>
    <div class="talk"><div>${critter('guri', 70)}</div><div class="bubble"><span class="who" style="background:#4c9a3f">${T(SPECIES.guri.name)}</span><div class="say">${S.farm.length ? T(GL.farmTxt) : T(GL.farmEmpty)}</div></div></div>
    <div class="field-grid">${range(farmCap()).map((i) => plot(S.farm[i], i)).join('')}</div>
    <p class="muted" style="text-align:center">💡 ${T(GL.waterRule)}${S.seedBag.length ? ` · 👜 ${T(GL.bag, { k: S.seedBag.length })}` : ''}</p>`);
  $('#bk').onclick = showMap;
  $$('[data-plot]').forEach((b) => b.onclick = () => { const f = S.farm[+b.dataset.plot], now = today();
    if (f.w >= 3) { const ch = chById(f.ch), w = (ch && ch.world) || 'count'; S.farm.splice(S.farm.indexOf(f), 1); const nx = S.seedBag[0]; if (nx && plantSeed({ id: nx.pid, ch: nx.ch, idx: nx.idx }, true)) S.seedBag.shift(); S.items['crop_' + w] = (S.items['crop_' + w] || 0) + 1; S.acorns += 10; save(); HOOK.top(); confetti(); snd('done'); toast(T(GL.harvest, { c: cropOf(w).e + ' ' + T(cropOf(w).n) }) + ' · 🌰 +10'); showFarm(); return; }
    if (f.last === now) { toast(T(GL.watered)); return; }
    openPlot(f, now); });
}
// one watering problem per plot per day (same numbers after a language switch or reload); it grows only on an independent solve
const PLOTP = {};
function openPlot(f, now) {
  rerender = () => openPlot(f, now);
  const key = f.uid + ':' + now, seed = 'farm:' + key;
  let p = PLOTP[key];
  if (!p) { if (f.pick && f.pick.d === now) p = LEARN.variant(f.ch, f.idx, seed, f.pick); else { p = LEARN.serve(S, f.ch, f.idx, seed, { noScaffold: true }); f.pick = { d: now, level: p.level, scaffold: p.scaffold }; save(); } PLOTP[key] = p; }
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>${T(GL.water)}</h2></div><p class="muted" style="margin:0">💡 ${T(GL.waterRule)}</p><div class="stack" id="qstage"></div>`);
  $('#bk').onclick = showFarm;
  runTask(p, { shell: false, ctx: 'farm:' + f.uid + ':' + now, index: f.w, total: 3, onDone: (r) => { const done = today(), ff = S.farm.find((x) => x.uid === f.uid);   // look the plot up again: another tab may have replaced S
    if (!r || r.wrong || r.hinted || p.scaffold || !LEARN.independentToday(S, p, done)) toast('🌱 ' + T(GL.notYet));
    else if (ff && ff.last !== done) { const f = ff; f.w++; f.last = done; save(); if (typeof EVT !== 'undefined') EVT.emit('water', {}); toast('💧 ' + T(GL.grew)); }
    showFarm(); } });
}
HOOK.solvedUI = (p) => { // let the child choose to grow any problem, not only missed ones
  const row = $('#fb .fb.ok .row'); if (!row || S.farm.some((f) => f.pid === p.id) || S.farm.length >= farmCap()) return;
  row.insertAdjacentHTML('afterbegin', `<button class="btn ghost" id="plantme" type="button">🌱 ${T(GL.plantMe)}</button>`);
  $('#plantme').onclick = () => { if (plantSeed(p, true)) { toast(T(GL.planted)); $('#plantme').remove(); } };
};

// ---------- shop ----------
function showShop() {
  rerender = showShop; const crops = Object.entries(S.items).filter(([k, v]) => k.startsWith('crop_') && v > 0);
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>🏪 ${T(GL.shop)}</h2><span class="pill">🌰 ${S.acorns}</span></div>
    <div class="talk"><div>${critter('kibi', 70)}</div><div class="bubble"><span class="who" style="background:#8a5a3c">${T(SPECIES.kibi.name)}</span><div class="say">${T(GL.shopTxt)}</div></div></div>
    <div class="panel"><h3>${T(GL.buy)}</h3><div class="shopgrid">${SHOP.map(([id, e, price, n]) => `<button class="shopitem" data-buy="${id}" type="button" ${S.acorns < price ? 'aria-disabled="true"' : ''}><span class="bigemo">${e}</span><b>${T(n)}</b><span>🌰 ${price}</span><small class="muted">${T(GL.have, { k: S.items[id] || 0 })}</small></button>`).join('')}</div></div>
    ${crops.length ? `<div class="panel"><h3>${T(GL.sell)}</h3><div class="shopgrid">${crops.map(([k, v]) => `<button class="shopitem" data-sell="${k}" type="button"><span class="bigemo">${itemInfo(k).e}</span><b>${T(itemInfo(k).n)} ×${v}</b><span>+🌰 ${itemInfo(k).p}</span></button>`).join('')}</div></div>` : ''}`);
  $('#bk').onclick = showMap;
  $$('[data-buy]').forEach((b) => b.onclick = () => { const [id, , price, n] = SHOP.find((s) => s[0] === b.dataset.buy); if (S.acorns < price) { toast(T(GL.poor)); return; } S.acorns -= price; S.items[id] = (S.items[id] || 0) + 1; save(); HOOK.top(); snd('ok'); toast(T(GL.bought, { i: T(n) })); showShop(); });
  $$('[data-sell]').forEach((b) => b.onclick = () => { const k = b.dataset.sell, info = itemInfo(k); S.items[k]--; S.acorns += info.p; save(); HOOK.top(); snd('pop'); toast(T(GL.sold, { i: T(info.n), p: info.p })); showShop(); });
}

// ---------- mail ----------
function showMail() {
  rerender = showMail;
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>📮 ${T(GL.mail)}</h2></div>
    <div class="stack">${S.mail.length ? S.mail.map((m, i) => `<button class="chcard ${m.read ? '' : 'unread'}" data-mail="${i}" type="button">${critter(m.from, 56, { still: true })}<span class="t">${m.read ? '📄' : '✉️'} ${T(SPECIES[m.from].name)}</span><span class="s">${m.date} · ${'❤️'.repeat(m.level)}</span></button>`).join('') : `<div class="panel">${T(GL.noMail)}</div>`}</div>`);
  $('#bk').onclick = showMap;
  $$('[data-mail]').forEach((b) => b.onclick = () => { const m = S.mail[+b.dataset.mail]; m.read = true; save();
    modal(`<div class="letter">${letterText(m)}</div><p style="margin:0">${T(GL.gift, { i: itemInfo(m.gift).e + ' ' + T(itemInfo(m.gift).n) })}</p>`, [{ t: T(L.close), fn: showMail }]); });
}
