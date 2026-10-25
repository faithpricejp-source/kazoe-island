// progress.js — long-term goals: trainer rank, habitats, daily quests & stamp card, mastery badges,
// a wardrobe for the buddy, and a house to upgrade and furnish (friends drop by to visit).
// Rank points come only from learning and collecting (graduated problems, first solves, cleared chapters, friends, stamps, badges),
// never from replaying problems she already knows.
const EVT = { on: {}, sub(n, f) { (this.on[n] = this.on[n] || []).push(f); }, emit(n, d) { (this.on[n] || []).forEach((f) => { try { f(d); } catch (e) { console.error(e); } }); } };

const PG = {
  rankUp: tx('ランクアップ! Lv {lv}「{t}」', 'Rank up! Lv {lv} “{t}”', '升级！Lv {lv}「{t}」'), unlocked: tx('できるようになったこと', 'New unlocks', '新解锁'),
  next: tx('つぎのランクまで あと {k} ポイント', '{k} points to the next rank', '距离下一级还差 {k} 点'), nextGet: tx('つぎのランクで:', 'At the next rank:', '下一级解锁：'),
  how: tx('ポイントのため方: 問題を卒業 +10 ・ 新しい問題をとく +2 ・ 場所をクリア +5 ・ 新しい友だち +4 ・ スタンプ +6 ・ バッジ +15', 'Points: graduate a problem +10 · first solve +2 · clear a place +5 · new friend +4 · stamp +6 · badge +15', '积分：题目毕业 +10 · 第一次解出 +2 · 通关一个地点 +5 · 新朋友 +4 · 印章 +6 · 徽章 +15'),
  quests: tx('今日のクエスト', 'Today’s quests', '今日任务'), questDone: tx('クエスト達成! スタンプを1こゲット', 'Quests complete! You got a stamp', '任务完成！得到1个印章'),
  stamps: tx('スタンプカード', 'Stamp card', '印章卡'), stampTip: tx('スタンプ5こでチケット1まい。チケットがあると、行ける場所の めずらしい友だちが のはらに来てくれる(季節に関係なく)。ともだちになったときに使うので、「またね」しても なくならないよ。まだ行ける場所にいないときは、取っておけるよ。', '5 stamps = 1 ticket. With a ticket, a rare friend from a place you can visit comes to the meadow (any season). It is used only when you become friends — saying “see you” keeps it. If none is in your places yet, it waits.', '5个印章换1张券。有券时，已开放地点的稀有朋友会来草地（不分季节）。交上朋友时才用掉，说“下次见”不会浪费。暂时没有可遇到的稀有朋友时，券会保留。'),
  ticket: tx('レアともだちチケット', 'Rare-friend ticket', '稀有朋友券'), ticketGot: tx('🎫 レアともだちチケットをゲット!', '🎫 You got a rare-friend ticket!', '🎫 得到一张稀有朋友券！'), ticketUsed: tx('🎫 チケットで、めずらしい友だちが来たよ! チケットは ともだちになったときに使うよ', '🎫 Your ticket brought a rare friend! It’s used only when you become friends', '🎫 稀有券引来了稀有朋友！交上朋友时才会用掉券'),
  badges: tx('マスターバッジ', 'Mastery badges', '大师徽章'), badgeTip: tx('その場所をクリアして、おさらいを進めるともらえるよ。', 'Clear a place and keep up its reviews to earn it.', '通关一个地点并坚持复习就能拿到。'), badgeLeft: tx('あと{k}問', '{k} to go', '还差{k}题'), questTip: tx('3つのうち{k}つできたら、スタンプ1こ。毎日ぜんぶやらなくても大じょうぶ。スタンプはへらないよ。', 'Do any {k} of the 3 for a stamp. You don’t have to do them every day — stamps never go away.', '3个里完成{k}个就得1个印章。不用每天都做，印章不会减少。'), badgeGot: tx('🏅 マスターバッジ「{p}」をゲット!', '🏅 Mastery badge “{p}”!', '🏅 得到大师徽章「{p}」！'),
  areas: tx('友だちのすむ場所', 'Where friends live', '朋友们住的地方'), lockedLv: tx('Lv {lv} で行ける', 'Opens at Lv {lv}', 'Lv {lv} 开放'), when: tx('会える時', 'When', '出没时间'),
  wardrobe: tx('きせかえ', 'Wardrobe', '换装'), dressWho: tx('だれをおしゃれにする? (服は1回買えば、どの友だちも着られるよ)', 'Who shall we dress? (Buy an outfit once and any friend can wear it.)', '给谁打扮？（衣服买一次，所有朋友都能穿）'), makeBuddy: tx('パートナーにする', 'Make partner', '设为伙伴'), isBuddy: tx('いまのパートナー', 'Current partner', '当前伙伴'), wear: tx('身につける', 'Put on', '戴上'), off: tx('はずす', 'Take off', '脱下'), buy: tx('買う', 'Buy', '买'), owned: tx('もってる', 'Owned', '已有'), needLv: tx('Lv {lv} から', 'From Lv {lv}', 'Lv {lv} 起'), noAcorn: tx('どんぐりが足りないよ', 'Not enough acorns', '橡果不够'),
  slots: { head: tx('あたま', 'Head', '头'), face: tx('かお', 'Face', '脸'), body: tx('ふく', 'Outfit', '衣服') },
  house: tx('おうち', 'My house', '我的家'), houseTxt: tx('かぐを置いて、友だちをまねこう', 'Furnish it and friends will visit', '摆家具，邀请朋友来玩'), furniture: tx('かぐやさん', 'Furniture shop', '家具店'),
  upgrade: tx('おうちを大きくする', 'Make the house bigger', '扩建房子'), upgraded: tx('🏡 おうちが大きくなった!', '🏡 Your house got bigger!', '🏡 房子变大了！'), place: tx('置く', 'Place', '摆放'), tapCell: tx('置きたいマスをタップ', 'Tap a square to place it', '点一个格子摆放'), remove: tx('かたづける', 'Put away', '收起来'),
  visitors: tx('今日あそびに来た友だち', 'Friends visiting today', '今天来玩的朋友'), noVisit: tx('まだだれも来ていない。のはらで ともだちになると あそびに来るよ', 'No one yet — friends you make in the meadow will come to visit', '还没人来。在草地交到朋友后他们会来玩'),
  wall: tx('かべ', 'Wall', '墙'), floor: tx('ゆか', 'Floor', '地板'),
};
const HOUSES = [
  { e: '⛺', n: tx('テント', 'Tent', '帐篷'), w: 4, h: 3, cost: 0, lv: 1 },
  { e: '🛖', n: tx('ログハウス', 'Log cabin', '小木屋'), w: 5, h: 3, cost: 180, lv: 3 },
  { e: '🏠', n: tx('おうち', 'House', '房子'), w: 5, h: 4, cost: 800, lv: 5 },
  { e: '🏡', n: tx('にわつきのおうち', 'House with a garden', '带院子的房子'), w: 6, h: 4, cost: 1500, lv: 8 },
  { e: '🏰', n: tx('おしろ', 'Castle', '城堡'), w: 7, h: 5, cost: 3000, lv: 11 },
];
const RANKS = [
  [0, tx('たまご', 'Egg', '蛋蛋')], [12, tx('ひよこ', 'Chick', '小鸡')], [35, tx('みならい', 'Apprentice', '见习生')],
  [90, tx('ぼうけんか', 'Adventurer', '冒险家')], [140, tx('たんけん家', 'Explorer', '探险家')], [200, tx('はかせの助手', 'Professor’s Helper', '博士助手')],
  [270, tx('ベテラン', 'Veteran', '老手')], [350, tx('エース', 'Ace', '王牌')], [440, tx('島のヒーロー', 'Island Hero', '岛屿英雄')],
  [540, tx('マスター', 'Master', '大师')], [650, tx('グランドマスター', 'Grandmaster', '宗师')], [780, tx('チャンピオン', 'Champion', '冠军')],
  [920, tx('でんせつ', 'Legend', '传说')], [1080, tx('ほしのでんせつ', 'Star Legend', '星之传说')], [1250, tx('むげんのでんせつ', 'Infinite Legend', '无限传说')],
];
const AREAS = [
  { id: 'meadow', e: '🌼', n: tx('はなばたけ', 'Flower meadow', '花田'), lv: 1, sp: ['sakuran', 'tanpopon', 'churi', 'chocho', 'happa', 'ichigoro', 'momomo', 'remon', 'donguri', 'budoun', 'kokemaru', 'takenon'] },
  { id: 'forest', e: '🌲', n: tx('ふかい森', 'Deep forest', '深林'), lv: 2, sp: ['kinoko', 'momiji', 'risu', 'harinezu', 'fukuron', 'minomu', 'suzurin', 'nemuno', 'kabochan'] },
  { id: 'beach', e: '🏖', n: tx('うみべと池', 'Beach & pond', '海边和池塘'), lv: 4, sp: ['suiren', 'umiushi', 'kurage', 'asagao', 'ajisai', 'hotarun', 'sabo', 'himawan'] },
  { id: 'snow', e: '❄️', n: tx('ゆきやま', 'Snowy mountain', '雪山'), lv: 6, sp: ['shimaena', 'yukinko', 'kapi', 'hiiragi', 'tsubaki', 'tsukimi', 'fuwatan'] },
  { id: 'sky', e: '🌈', n: tx('そらのにわ', 'Sky garden', '天空花园'), lv: 9, sp: ['niji', 'kurova', 'barari', 'lessa'] },
];
// wardrobe: [id, slot, price, rank, name, svg]
const WEAR = [
  ['ribbon', 'head', 40, 1, tx('リボン', 'Ribbon', '蝴蝶结'), '<path d="M68 22 L58 16 L58 28Z M68 22 L78 16 L78 28Z" fill="#ff6f91" stroke="#c94467" stroke-width="1.4"/><circle cx="68" cy="22" r="3.2" fill="#ff9fb8" stroke="#c94467" stroke-width="1"/>'],
  ['flowercrown', 'head', 80, 2, tx('花かんむり', 'Flower crown', '花环'), [24, 36, 50, 64, 76].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 26 : 30}" r="5" fill="${['#ffb3c7', '#ffe066', '#b3d9ff', '#ffe066', '#ffb3c7'][i]}" stroke="#d98aa0" stroke-width="1"/><circle cx="${x}" cy="${i % 2 ? 26 : 30}" r="1.6" fill="#fff"/>`).join('')],
  ['straw', 'head', 120, 3, tx('むぎわらぼうし', 'Straw hat', '草帽'), '<ellipse cx="50" cy="30" rx="38" ry="7" fill="#f2d16b" stroke="#c9a53a" stroke-width="1.6"/><path d="M32 30 Q32 12 50 12 Q68 12 68 30Z" fill="#f2d16b" stroke="#c9a53a" stroke-width="1.6"/><path d="M32 26 L68 26" stroke="#e05a5a" stroke-width="3"/>'],
  ['beret', 'head', 150, 4, tx('ベレーぼう', 'Beret', '贝雷帽'), '<path d="M24 32 Q22 14 50 14 Q80 14 78 30 Q60 26 24 32Z" fill="#7b5cd6" stroke="#4f3a9a" stroke-width="1.6"/><path d="M50 14 L50 9" stroke="#4f3a9a" stroke-width="2.4" stroke-linecap="round"/>'],
  ['beanie', 'head', 150, 5, tx('ニットぼう', 'Knit hat', '毛线帽'), '<path d="M22 36 Q22 10 50 10 Q78 10 78 36Z" fill="#ff8a65" stroke="#c4583a" stroke-width="1.6"/><rect x="21" y="30" width="58" height="8" rx="4" fill="#fff3e0" stroke="#c4583a" stroke-width="1.2"/><circle cx="50" cy="8" r="6" fill="#fff3e0" stroke="#c4583a" stroke-width="1.2"/>'],
  ['witch', 'head', 260, 7, tx('まほうつかいのぼうし', 'Wizard hat', '魔法帽'), '<ellipse cx="50" cy="31" rx="30" ry="6" fill="#4a3c8c" stroke="#2c2260" stroke-width="1.6"/><path d="M36 30 L54 -2 L64 30Z" fill="#4a3c8c" stroke="#2c2260" stroke-width="1.6" stroke-linejoin="round"/><path d="M52 14 l1.5 3 3.2 .5 -2.3 2.2 .6 3.2 -3 -1.6 -3 1.6 .6 -3.2 -2.3 -2.2 3.2 -.5Z" fill="#ffd84d"/>'],
  ['tiara', 'head', 400, 10, tx('ティアラ', 'Tiara', '公主冠'), '<path d="M32 30 L36 18 L43 26 L50 12 L57 26 L64 18 L68 30Z" fill="#ffe680" stroke="#d9a400" stroke-width="1.6" stroke-linejoin="round"/><circle cx="50" cy="20" r="3" fill="#7fd3ff"/><circle cx="38" cy="25" r="2" fill="#ff8fb1"/><circle cx="62" cy="25" r="2" fill="#ff8fb1"/>'],
  ['glasses', 'face', 60, 2, tx('まるめがね', 'Round glasses', '圆眼镜'), '<circle cx="38" cy="57" r="9" fill="none" stroke="#5a4636" stroke-width="2.4"/><circle cx="62" cy="57" r="9" fill="none" stroke="#5a4636" stroke-width="2.4"/><path d="M47 56 Q50 53 53 56" stroke="#5a4636" stroke-width="2.4" fill="none"/>'],
  ['sunglasses', 'face', 140, 4, tx('サングラス', 'Sunglasses', '墨镜'), '<path d="M27 52 L49 52 L47 62 Q38 66 29 62Z M51 52 L73 52 L71 62 Q62 66 53 62Z" fill="#2e2e3a" stroke="#111" stroke-width="1.4"/><path d="M30 54 L36 54" stroke="#fff" stroke-width="1.5" opacity=".7"/>'],
  ['blush', 'face', 50, 1, tx('ハートほっぺ', 'Heart cheeks', '爱心腮红'), '<path d="M28 68 c-3 -4 -8 0 0 5 c8 -5 3 -9 0 -5Z M72 68 c-3 -4 -8 0 0 5 c8 -5 3 -9 0 -5Z" fill="#ff5c8a"/>'],
  ['bowtie', 'body', 70, 1, tx('ちょうネクタイ', 'Bow tie', '领结'), '<path d="M50 72 L40 66 L40 78Z M50 72 L60 66 L60 78Z" fill="#e53950" stroke="#a8243a" stroke-width="1.2"/><circle cx="50" cy="72" r="2.6" fill="#ff8a9b"/>'],
  ['apron', 'body', 120, 3, tx('エプロン', 'Apron', '围裙'), '<path d="M34 70 L66 70 L70 90 Q50 96 30 90Z" fill="#fff" stroke="#e08aa0" stroke-width="1.6"/><path d="M34 70 L30 62 M66 70 L70 62" stroke="#e08aa0" stroke-width="2"/><circle cx="50" cy="82" r="4" fill="#ffb3c7"/>'],
  ['raincoat', 'body', 180, 4, tx('レインコート', 'Raincoat', '雨衣'), '<path d="M22 70 Q50 64 78 70 L82 90 Q50 98 18 90Z" fill="#ffd84d" stroke="#d9a400" stroke-width="1.6"/><circle cx="50" cy="76" r="1.8" fill="#d9a400"/><circle cx="50" cy="84" r="1.8" fill="#d9a400"/>'],
  ['kimono', 'body', 300, 6, tx('ゆかた', 'Yukata', '浴衣'), '<path d="M20 70 Q50 62 80 70 L84 92 Q50 99 16 92Z" fill="#7fb0ff" stroke="#4c7ad0" stroke-width="1.6"/><path d="M40 66 L50 82 L60 66" stroke="#fff" stroke-width="2.4" fill="none"/><rect x="18" y="80" width="64" height="6" fill="#ff8fb1"/>' + [[30, 74], [70, 76], [36, 90], [64, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')],
  ['dress', 'body', 350, 8, tx('おひめさまドレス', 'Princess dress', '公主裙'), '<path d="M30 70 Q50 64 70 70 L86 94 Q50 100 14 94Z" fill="#ffc2dd" stroke="#e07aa8" stroke-width="1.6"/><path d="M18 90 Q26 86 34 92 Q42 86 50 92 Q58 86 66 92 Q74 86 82 90" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M44 70 L50 76 L56 70" fill="#fff"/>'],
  ['cape', 'body', 450, 11, tx('ヒーローマント', 'Hero cape', '英雄披风'), '<path d="M26 66 Q50 72 74 66 L90 98 L10 98Z" fill="#e53950" stroke="#a8243a" stroke-width="1.6" opacity=".92"/><circle cx="50" cy="70" r="4" fill="#ffd84d" stroke="#d9a400" stroke-width="1"/>'],
];
// furniture for the house: [id, emoji, price, rank, name]
const FURN = [
  ['bed', '🛏️', 60, 1, tx('ベッド', 'Bed', '床')], ['chair', '🪑', 30, 1, tx('いす', 'Chair', '椅子')], ['lamp', '🪔', 30, 1, tx('ランプ', 'Lamp', '灯')], ['plant', '🪴', 25, 1, tx('はちうえ', 'Potted plant', '盆栽')],
  ['books', '📚', 50, 2, tx('本だな', 'Bookshelf', '书架')], ['bear', '🧸', 40, 2, tx('ぬいぐるみ', 'Teddy', '玩偶熊')], ['clock', '🕰️', 60, 2, tx('とけい', 'Clock', '钟')], ['frame', '🖼️', 45, 2, tx('絵', 'Painting', '画')],
  ['sofa', '🛋️', 120, 3, tx('ソファ', 'Sofa', '沙发')], ['tv', '📺', 140, 3, tx('テレビ', 'TV', '电视')], ['cake', '🎂', 70, 3, tx('ケーキ', 'Cake', '蛋糕')], ['radio', '📻', 80, 3, tx('ラジオ', 'Radio', '收音机')],
  ['piano', '🎹', 220, 4, tx('ピアノ', 'Piano', '钢琴')], ['globe', '🌏', 120, 4, tx('地球ぎ', 'Globe', '地球仪')], ['fish', '🐠', 150, 5, tx('すいそう', 'Aquarium', '鱼缸')], ['telescope', '🔭', 200, 5, tx('ぼうえんきょう', 'Telescope', '望远镜')],
  ['tree', '🎄', 180, 6, tx('ツリー', 'Holiday tree', '圣诞树')], ['harp', '🪕', 240, 7, tx('バンジョー', 'Banjo', '班卓琴')], ['fountain', '⛲', 400, 8, tx('ふんすい', 'Fountain', '喷泉')], ['trophy', '🏆', 500, 9, tx('トロフィー', 'Trophy', '奖杯')],
  ['rocket', '🚀', 600, 10, tx('ロケットのもけい', 'Model rocket', '火箭模型')], ['crystal', '🔮', 700, 12, tx('まほうのすいしょう', 'Magic crystal', '魔法水晶')],
];
const WALLS = ['#fff4e6', '#ffe3ec', '#e3f2ff', '#eaf7e1', '#f3e8ff', '#fff9c4'], FLOORS = ['#d9b38c', '#c9a27e', '#b3d1e6', '#e8c9d6', '#c8e0b4', '#a89888'];

function pgInit() { for (const [k, v] of Object.entries({ wearOf: {}, rank: 1, stamps: 0, tickets: 0, badges: {}, qd: { date: '', c: {}, done: false }, wear: {}, owned: {}, house: 0, room: [], wall: 0, floor: 0, furn: {} })) if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(v)); }
pgInit();
// every friend can be dressed: outfits are bought once and any friend can wear them (the old single-buddy outfit moves over)
if (S.wear && Object.values(S.wear).some(Boolean) && !S.wearOf[S.buddy]) S.wearOf[S.buddy] = { ...S.wear };
function wearOf(id) { return (S.wearOf && S.wearOf[id]) || null; }
let WSEL = null;   // which friend the wardrobe is dressing
const friendsList = () => [S.buddy, ...Object.keys(S.caught || {}).filter((k) => S.caught[k] > 0 && k !== S.buddy && SPECIES[k])];
{ const r0 = HOOK.reset; HOOK.reset = () => { if (r0) r0(); pgInit(); }; }

// ---- rank ----
function rankPoints() {
  const n = (o) => Object.values(o || {}).filter((v) => v).length;
  return Object.keys(S.retired || {}).length * 10 + Object.values(S.vocab || {}).filter((v) => v.done).length * 3 + Object.values(S.prob || {}).filter((r) => r.n > 0).length * 2 + Object.keys(S.cleared || {}).length * 5
    + Object.values(S.caught || {}).filter((v) => v > 0).length * 4 + (S.stamps || 0) * 6 + n(S.badges) * 15;
}
function rankInfo() { const pts = rankPoints(); let lv = 1; RANKS.forEach(([t], i) => { if (pts >= t) lv = i + 1; }); const next = RANKS[lv] ? RANKS[lv][0] : null; return { lv, pts, title: RANKS[lv - 1][1], next, prev: RANKS[lv - 1][0] }; }
function unlocksAt(lv) {
  const out = [];
  AREAS.filter((a) => a.lv === lv).forEach((a) => out.push(`${a.e} ${T(a.n)}`));
  HOUSES.filter((h) => h.lv === lv && h.cost).forEach((h) => out.push(`${h.e} ${T(h.n)}`));
  if (lv === 3 || lv === 7) out.push(`🧺 ${T(GL.farm)} +2`);
  WEAR.filter((w) => w[3] === lv).forEach((w) => out.push(`👒 ${T(w[4])}`));
  FURN.filter((f) => f[3] === lv).forEach((f) => out.push(`${f[1]} ${T(f[4])}`));
  return out;
}
const unlockLv = () => Math.max(S.rank || 1, rankInfo().lv);   // what she has unlocked stays unlocked even if a problem un-graduates
function rankFarm() { const lv = unlockLv(); return 6 + (lv >= 3 ? 2 : 0) + (lv >= 7 ? 2 : 0); }
function checkRank() {
  const r = rankInfo(); if (r.lv <= (S.rank || 1)) return; const from = S.rank || 1; S.rank = r.lv; save();
  const got = []; for (let l = from + 1; l <= r.lv; l++) got.push(...unlocksAt(l));
  snd('done'); confetti();
  modal(`<div class="sparkle">${critter(S.buddy, 110, { stage: buddyStage(), happy: true })}</div><h2>${T(PG.rankUp, { lv: r.lv, t: T(r.title) })}</h2>${got.length ? `<p style="margin:0"><b>${T(PG.unlocked)}</b></p><p style="margin:0">${got.join('<br>')}</p>` : ''}`, [{ t: T(L.close) }]);
}
// ---- mastery badges: 70% of a place's problems graduated (a word place counts its words) ----
const gradOf = (c) => { if (c.grad) return c.grad(); const ps = PROBLEMS[c.id] || []; return { g: ps.filter((d) => S.retired && S.retired[d.id]).length, n: ps.length }; };
function checkBadges() {
  for (const c of ALLCH) { if (S.badges[c.id] || !S.cleared[c.id]) continue; const { g, n } = gradOf(c); if (!n) continue;
    if (g / n >= 0.7) { S.badges[c.id] = today(); save(); setTimeout(() => toast(T(PG.badgeGot, { p: T(c.place) })), 1600); } }
}
// ---- daily quests: chosen once per day from what is actually possible today; any 2 of the 3 earn the day's stamp ----
const QUESTS = {
  practice: { n: 3, t: tx('ちがう問題を3問とく(ヒントを使ってもOK)', 'Solve 3 different problems (hints are fine)', '解出3道不同的题（可以看提示）') },
  clean: { n: 1, t: tx('1問、ヒントなし・1回で とく(新しい問題か おさらい)', 'Solve 1 on your own, first try (a new one or a review)', '独立一次做对1道（新题或复习题）') },
  fresh: { n: 2, t: tx('まだといたことのない問題を{n}問とく', 'Solve {n} problem(s) you’ve never solved', '解出{n}道从没做过的题') },
  review: { n: 1, t: tx('今日のおさらいを終える', 'Finish today’s review', '完成今天的复习') },
  water: { n: 2, t: tx('{n}つのたねに水やりする', 'Water {n} seed(s)', '给{n}颗种子浇水') },
  catch: { n: 1, t: tx('のはらで ともだちを1人ふやす', 'Make 1 friend in the meadow', '在草地交1个朋友') },
  grad: { n: 1, t: tx('1問、おさらいを卒業する', 'Graduate 1 problem from review', '让1道题从复习毕业') },
};
function questsToday() {
  const d = today(); if (S.qd && S.qd.date === d && S.qd.ids) return S.qd.ids;
  const dn = LEARN.dayNum(d), open = ALLCH.filter((c) => chOpen(c)), unsolved = open.flatMap((c) => PROBLEMS[c.id]).filter((q) => !(S.prob[q.id] && S.prob[q.id].n)).length;
  const thirsty = (S.farm || []).filter((f) => f.w < 3 && f.last !== d).length, reviewable = Object.keys(S.cleared || {}).length && S.review.date !== d && LEARN.pickReview(S, d, 3).length;
  const nearGrad = Object.entries(S.card || {}).some(([id, c]) => c.ok === 2 && !S.retired[id] && c.last !== d && c.due <= dn + 0 && !(S.dayFail || {})[id]);
  const n = {}, cand = ['practice'];
  if (unsolved || reviewable) cand.push('clean');
  if (unsolved) { cand.push('fresh'); n.fresh = Math.min(2, unsolved); }
  if (reviewable) cand.push('review');
  if (thirsty) { cand.push('water'); n.water = Math.min(2, thirsty); }
  if (LEARN.pickOne(S, d, [], 'quest')) cand.push('catch');
  if (nearGrad) cand.push('grad');
  const R = LEARN.tools(LEARN.rngOf('quest|' + d), 1), ids = ['practice', ...R.shuffle(cand.filter((k) => k !== 'practice')).slice(0, 2)];
  S.qd = { date: d, ids, n, c: {}, seen: {}, done: false }; save(); return ids;
}
const questN = (k) => (S.qd.n && S.qd.n[k]) || QUESTS[k].n;
const questText = (k) => T(QUESTS[k].t, { n: questN(k) });
const questNeed = () => Math.min(2, questsToday().length);
function questBump(k, by = 1) {
  const qs = questsToday(), d = today(); if (!qs.includes(k)) return; S.qd.c[k] = Math.min(questN(k), (S.qd.c[k] || 0) + by);
  const done = qs.filter((q) => (S.qd.c[q] || 0) >= questN(q)).length;
  if (!S.qd.done && done >= questNeed()) {
    S.qd.done = true; S.qClaimed = S.qClaimed || {};
    if (!S.qClaimed[d]) { S.qClaimed[d] = 1; S.stamps = (S.stamps || 0) + 1; S.acorns += 20;   // one stamp per calendar day, even if the clock is moved back
      if (S.stamps % 5 === 0) { S.tickets = (S.tickets || 0) + 1; setTimeout(() => toast(T(PG.ticketGot)), 2200); }
      setTimeout(() => { toast(`💮 ${T(PG.questDone)} · 🌰 +20`); snd('done'); }, 1200); }
  }
  save();
}
EVT.sub('solve', ({ p, ctx, clean, first, retired }) => { questsToday(); if (!S.qd.seen[p.id]) { S.qd.seen[p.id] = 1; questBump('practice'); }
  if (clean && (first || LEARN.REVIEW_CTX.test(ctx))) questBump('clean'); if (first) questBump('fresh'); if (retired) questBump('grad'); });
EVT.sub('review', () => questBump('review'));
EVT.sub('water', () => questBump('water'));
EVT.sub('catch', () => questBump('catch'));

// ---- habitats: which wild friends can appear (unlocked area, season, time of day); a ticket brings a rare one ----
const areaOf = (k) => AREAS.find((a) => a.sp.includes(k));
function areaOpen(a) { return unlockLv() >= a.lv; }
function pickEncounter() {
  const lv = unlockLv(), open = (k) => { const a = areaOf(k); return !a || lv >= a.lv; };
  const core = Object.keys(SPECIES).filter((k) => !WILD[k]); pickEncounter.ticket = false;
  // a ticket brings a rare friend from an open area (any season); it is spent only when the friend is caught
  if (S.tickets > 0) { const rare = Object.keys(WILD).filter((k) => open(k) && (WILD[k].rare || 1) >= 2 && !S.caught[k]); const pool = rare.length ? rare : Object.keys(WILD).filter((k) => open(k) && (WILD[k].rare || 1) >= 2);
    if (pool.length) { pickEncounter.ticket = true; setTimeout(() => toast(T(PG.ticketUsed)), 300); return pool[Math.floor(Math.random() * pool.length)]; } }
  const wild = wildNow(season(), phase()).filter(open), all = [...core, ...wild], fresh = all.filter((k) => !S.caught[k]);
  const list = fresh.length && Math.random() < 0.7 ? fresh : all, w = list.map(wildWeight); let x = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) { x -= w[i]; if (x <= 0) return list[i]; } return list[list.length - 1];
}

// ---- wardrobe on the buddy ----
function critterAcc(wear) { if (!wear) return ''; return ['body', 'face', 'head'].map((s) => { const it = WEAR.find((w) => w[0] === wear[s]); return it ? it[5] : ''; }).join(''); }
function buy(price, lv, fn) { if (unlockLv() < lv) return false; if (S.acorns < price) { toast(T(PG.noAcorn)); return false; } S.acorns -= price; fn(); save(); HOOK.top(); snd('ok'); return true; }

// ---- trainer card ----
function showTrainer() {
  rerender = showTrainer; checkRank(); const r0 = rankInfo(), lvU = unlockLv(), r = { ...r0, lv: lvU, title: RANKS[lvU - 1][1], prev: RANKS[lvU - 1][0], next: RANKS[lvU] ? RANKS[lvU][0] : null }, qs = questsToday();
  const pct = r.next ? Math.max(0, Math.min(100, Math.round((r.pts - r.prev) / (r.next - r.prev) * 100))) : 100, nextUn = r.next ? unlocksAt(r.lv + 1) : [];
  const badgeList = ALLCH.map((c) => { const { g, n } = gradOf(c), need = Math.ceil(n * 0.7);
    return `<span class="pill" style="opacity:${S.badges[c.id] ? 1 : 0.55}" title="${T(c.place).replace(/<[^>]+>/g, '')}">${S.badges[c.id] ? '🏅' : '⚪'} ${c.icon || ''} ${T(c.place)}${S.badges[c.id] ? '' : ` · ${T(PG.badgeLeft, { k: Math.max(0, need - g) })}`}</span>`; }).join(' ');
  const areaRows = AREAS.map((a) => { const got = a.sp.filter((k) => S.caught[k]).length, op = areaOpen(a);
    return `<div class="panel" style="padding:10px;opacity:${op ? 1 : 0.6}"><b>${a.e} ${T(a.n)}</b> <span class="muted">${op ? `${got} / ${a.sp.length}` : T(PG.lockedLv, { lv: a.lv })}</span>
      <div class="dex" style="margin-top:6px">${a.sp.map((k) => S.caught[k] ? `<div class="dexc">${critter(k, 54, { still: true })}<span class="n">${T(SPECIES[k].name)}</span><span class="muted">${wildWhen(k)}</span></div>`
        : `<div class="dexc unk"><svg width="54" height="54" viewBox="0 0 100 100" aria-hidden="true"><path d="M14 62 C14 36 30 28 50 28 C70 28 86 36 86 62 C86 82 72 92 50 92 C28 92 14 82 14 62Z" fill="#d9d4e6"/></svg><span class="n">？</span><span class="muted">${op ? wildWhen(k) : ''}${(WILD[k].rare || 1) >= 2 ? ' ✨' : ''}</span></div>`).join('')}</div></div>`; }).join('');
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>🏅 ${T(GL.trainer)}</h2><span class="pill">🌰 ${S.acorns}</span></div>
   <div class="stack">
    <div class="panel"><div class="row" style="align-items:center;gap:14px"><span>${critter(S.buddy, 90, { stage: buddyStage(), happy: true })}</span><div style="flex:1;min-width:0">
      <h3 style="margin:0">${esc(S.name || '')} · Lv ${r.lv}「${T(r.title)}」</h3><div class="bar" style="margin:6px 0"><i style="width:${pct}%"></i></div>
      <span class="muted">${r.next ? T(PG.next, { k: r.next - r.pts }) : '★'}</span>${nextUn.length ? `<div class="muted">${T(PG.nextGet)} ${nextUn.join(' ・ ')}</div>` : ''}</div></div>
      <p class="muted" style="margin:8px 0 0">${T(PG.how)}</p></div>
    <div class="panel"><h3>💮 ${T(PG.quests)}</h3><p class="muted" style="margin:0 0 6px">${T(PG.questTip, { k: questNeed() })}</p>${qs.map((k) => { const c = S.qd.c[k] || 0, n = questN(k); return `<div class="row" style="justify-content:space-between"><span>${c >= n ? '✅' : '⬜'} ${questText(k)}</span><b>${c} / ${n}</b></div>`; }).join('')}</div>
    <div class="panel"><h3>🎴 ${T(PG.stamps)}</h3><div style="font-size:1.8rem;letter-spacing:.2em">${[0, 1, 2, 3, 4].map((i) => (i < S.stamps % 5 ? '💮' : '⚪')).join('')}</div>
      <p class="muted" style="margin:4px 0">${T(PG.stampTip)}</p><b>🎫 ${T(PG.ticket)} × ${S.tickets || 0}</b></div>
    <div class="panel"><h3>🏅 ${T(PG.badges)}</h3><p class="muted" style="margin:0 0 6px">${T(PG.badgeTip)}</p><div>${badgeList}</div></div>
    <div class="panel"><h3>👒 ${T(PG.wardrobe)}</h3>${wardrobeHTML()}</div>
    <div class="panel"><h3>🗺 ${T(PG.areas)}</h3>${areaRows}</div>
   </div>`);
  $('#bk').onclick = showMap; bindWardrobe();
}
function wardrobeHTML() {
  const lv = unlockLv(), fr = friendsList(); if (!WSEL || !fr.includes(WSEL)) WSEL = S.buddy; const cur = wearOf(WSEL) || {};
  const pick = `<div class="muted">${T(PG.dressWho)}</div><div class="row" style="flex-wrap:wrap;gap:6px;margin:4px 0 8px">${fr.map((k) => `<button class="chip ${k === WSEL ? 'on' : ''}" data-wsel="${k}" type="button" style="display:inline-flex;align-items:center;gap:4px">${critter(k, 34, { still: true })}${T(SPECIES[k].name)}${k === S.buddy ? ' ⭐' : ''}</button>`).join('')}</div>
    <div class="row" style="align-items:center;gap:10px">${critter(WSEL, 90, { still: true, happy: true })}${WSEL !== S.buddy ? `<button class="btn ghost" id="mkbuddy" type="button">⭐ ${T(PG.makeBuddy)}</button>` : `<span class="muted">⭐ ${T(PG.isBuddy)}</span>`}</div>`;
  return pick + ['head', 'face', 'body'].map((slot) => `<div style="margin:6px 0"><b>${T(PG.slots[slot])}</b><div class="row" style="flex-wrap:wrap;gap:8px;margin-top:4px">${WEAR.filter((w) => w[1] === slot).map(([id, , price, need, name]) => {
    const own = S.owned[id], on = cur[slot] === id, locked = lv < need;
    return `<div class="panel" style="padding:6px;width:118px;text-align:center;opacity:${locked ? 0.45 : 1}"><svg viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">${critter(WSEL, 64, { stage: 1, still: true, noAcc: true }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}${WEAR.find((w) => w[0] === id)[5]}</svg>
      <div style="font-size:.85rem;font-weight:800">${T(name)}</div>${locked ? `<div class="muted">🔒 ${T(PG.needLv, { lv: need })}</div>` : own ? `<button class="btn ${on ? 'ghost' : ''}" data-wear="${slot}|${id}" type="button">${on ? T(PG.off) : T(PG.wear)}</button>` : `<button class="btn" data-buyw="${id}" type="button">🌰 ${price}</button>`}</div>`; }).join('')}</div></div>`).join('');
}
function bindWardrobe() {
  const dress = (slot, id) => { const cur = S.wearOf[WSEL] || (S.wearOf[WSEL] = {}); cur[slot] = cur[slot] === id ? '' : id; if (WSEL === S.buddy) S.wear = { ...cur }; };
  $$('[data-wsel]').forEach((b) => b.onclick = () => { WSEL = b.dataset.wsel; snd('pop'); rerender(); });
  const mk = $('#mkbuddy'); if (mk) mk.onclick = () => { S.buddy = WSEL; S.wear = { ...(S.wearOf[WSEL] || {}) }; save(); snd('done'); renderTop(); rerender(); };
  $$('[data-wear]').forEach((b) => b.onclick = () => { const [slot, id] = b.dataset.wear.split('|'); dress(slot, id); save(); snd('pop'); rerender(); });
  $$('[data-buyw]').forEach((b) => b.onclick = () => { const w = WEAR.find((x) => x[0] === b.dataset.buyw); if (buy(w[2], w[3], () => { S.owned[w[0]] = 1; dress(w[1], w[0]); })) rerender(); });
}

// ---- house ----
let PLACING = null;
// a room item is shop furniture (emoji) or one of her drawings from the workshop ('art:<id>', shown framed)
function furnFace(id) { if (id.startsWith('kobo:')) { const it = typeof KOBO_ITEMS !== 'undefined' && KOBO_ITEMS[id.slice(5)]; return it ? it.face() : '🎁'; } if (id.startsWith('art:')) { const img = typeof workImg === 'function' && workImg(id.slice(4)); return img ? `<img src="${img}" alt="" style="width:86%;border:4px solid #a8743f;border-radius:4px;background:#fff">` : '🖼️'; } const f = FURN.find((q) => q[0] === id); return f ? f[1] : ''; }
function visitorsToday() {
  const caught = Object.keys(S.caught || {}).filter((k) => S.caught[k] > 0); if (!caught.length) return [];
  const n = Math.min(caught.length, 1 + Math.min(3, Math.floor((S.room || []).length / 3)));   // more furniture, more visitors
  return LEARN.tools(LEARN.rngOf('visit|' + today()), 1).shuffle(caught).slice(0, n);
}
function showHouse() {
  rerender = showHouse; const H = HOUSES[S.house || 0], nx = HOUSES[(S.house || 0) + 1], lv = unlockLv(), vis = visitorsToday();
  S.room = (S.room || []).filter((it) => it.x < H.w && it.y < H.h);
  // visitors stand on empty squares (same squares all day)
  const empty = []; for (let y = 0; y < H.h; y++) for (let x = 0; x < H.w; x++) if (!S.room.some((r) => r.x === x && r.y === y)) empty.push(x + ',' + y);
  const spots = LEARN.tools(LEARN.rngOf('spot|' + today()), 1).shuffle(empty), at = {}; vis.forEach((k, i) => { if (spots[i]) at[spots[i]] = k; });
  const fs = `min(${Math.floor(60 / H.w)}vw, ${Math.floor(330 / H.w)}px)`;
  const cell = (x, y) => { const it = S.room.find((r) => r.x === x && r.y === y), f = it && furnFace(it.id), who = at[x + ',' + y];
    return `<button class="hcell" data-cell="${x},${y}" type="button" style="aspect-ratio:1;border:1px dashed rgba(0,0,0,.10);background:transparent;font-size:${fs};line-height:1;cursor:pointer;display:grid;place-items:center;padding:0">${f ? f : who ? critter(who, 80, {}).replace('width="80" height="80"', 'width="78%" height="78%"') : ''}</button>`; };
  const grid = Array.from({ length: H.h }, (_, y) => Array.from({ length: H.w }, (_, x) => cell(x, y)).join('')).join('');
  setMain(`<div class="chhead"><button class="pill" id="bk" type="button">${T(L.back)}</button><h2>${H.e} ${T(H.n)}</h2><span class="pill">🌰 ${S.acorns}</span></div>
   <div class="stack">
    <div class="panel" style="padding:0;overflow:hidden"><div style="background:${WALLS[S.wall || 0]};background-image:radial-gradient(rgba(0,0,0,.05) 2px,transparent 2px);background-size:18px 18px;height:72px;border-bottom:6px solid rgba(0,0,0,.10);display:flex;justify-content:space-around;align-items:center;font-size:2.4rem">${'🪟'.repeat(Math.max(1, Math.floor(H.w / 2)))}</div>
      <div style="background:${FLOORS[S.floor || 0]};background-image:linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px);background-size:${100 / H.w}% 100%;display:grid;grid-template-columns:repeat(${H.w},1fr);padding:6px">${grid}</div></div>
    ${PLACING ? `<div class="panel"><b>${T(PG.tapCell)}</b> ${furnFace(PLACING)} <button class="btn ghost" id="cancelp" type="button">✕</button></div>` : ''}
    <div class="panel"><h3>👫 ${T(PG.visitors)}</h3>${vis.length ? `<div class="row">${vis.map((k) => `<span>${critter(k, 44, { still: true })} ${T(SPECIES[k].name)}</span>`).join('')}</div>` : `<p class="muted">${T(PG.noVisit)}</p>`}</div>
    <div class="panel"><h3>🎨 ${T(PG.wall)} / ${T(PG.floor)}</h3><div class="row">${WALLS.map((c, i) => `<button data-wall="${i}" type="button" style="width:30px;height:30px;border-radius:8px;border:2px solid ${i === S.wall ? '#333' : '#ccc'};background:${c}"></button>`).join('')}</div>
      <div class="row" style="margin-top:6px">${FLOORS.map((c, i) => `<button data-floor="${i}" type="button" style="width:30px;height:30px;border-radius:8px;border:2px solid ${i === S.floor ? '#333' : '#ccc'};background:${c}"></button>`).join('')}</div></div>
    <div class="panel"><h3>🛋 ${T(PG.furniture)}</h3><div class="row" style="flex-wrap:wrap;gap:8px">${Object.keys(S.furn).filter((id) => /^(art|kobo):/.test(id) && S.furn[id] > 0).map((id) => `<div class="panel" style="padding:6px;width:104px;text-align:center"><div style="font-size:2rem;height:56px;display:grid;place-items:center">${furnFace(id)}</div><button class="btn ghost" data-placef="${id}" type="button">${T(PG.place)}</button></div>`).join('')}${FURN.map(([id, e, price, need, name]) => { const have = S.furn[id] || 0, locked = lv < need;
      return `<div class="panel" style="padding:6px;width:104px;text-align:center;opacity:${locked ? 0.45 : 1}"><div style="font-size:2rem">${e}</div><div style="font-size:.8rem;font-weight:800">${T(name)}</div>
        ${locked ? `<div class="muted">🔒 ${T(PG.needLv, { lv: need })}</div>` : `<button class="btn" data-buyf="${id}" type="button">🌰 ${price}</button>${have ? `<button class="btn ghost" data-placef="${id}" type="button">${T(PG.place)} (${have})</button>` : ''}`}</div>`; }).join('')}</div></div>
    ${nx ? `<div class="panel"><h3>🔨 ${T(PG.upgrade)}</h3><p>${nx.e} ${T(nx.n)} (${nx.w}×${nx.h}) · 🌰 ${nx.cost} ${lv < nx.lv ? `· 🔒 ${T(PG.needLv, { lv: nx.lv })}` : ''}</p>${lv >= nx.lv ? `<button class="btn" id="upg" type="button">${T(PG.upgrade)}</button>` : ''}</div>` : ''}
   </div>`);
  $('#bk').onclick = () => { PLACING = null; showMap(); };
  const cp = $('#cancelp'); if (cp) cp.onclick = () => { PLACING = null; showHouse(); };
  $$('[data-cell]').forEach((b) => b.onclick = () => { const [x, y] = b.dataset.cell.split(',').map(Number), i = S.room.findIndex((r) => r.x === x && r.y === y);
    if (PLACING) { if (i >= 0) S.furn[S.room[i].id] = (S.furn[S.room[i].id] || 0) + 1, S.room.splice(i, 1); S.room.push({ id: PLACING, x, y }); S.furn[PLACING]--; if (!S.furn[PLACING]) PLACING = null; save(); snd('pop'); showHouse(); }
    else if (i >= 0) { S.furn[S.room[i].id] = (S.furn[S.room[i].id] || 0) + 1; S.room.splice(i, 1); save(); snd('pop'); showHouse(); } });
  $$('[data-wall]').forEach((b) => b.onclick = () => { S.wall = +b.dataset.wall; save(); showHouse(); });
  $$('[data-floor]').forEach((b) => b.onclick = () => { S.floor = +b.dataset.floor; save(); showHouse(); });
  $$('[data-buyf]').forEach((b) => b.onclick = () => { const f = FURN.find((q) => q[0] === b.dataset.buyf); if (buy(f[2], f[3], () => { S.furn[f[0]] = (S.furn[f[0]] || 0) + 1; })) { PLACING = f[0]; showHouse(); } });
  $$('[data-placef]').forEach((b) => b.onclick = () => { PLACING = b.dataset.placef; showHouse(); });
  const up = $('#upg'); if (up) up.onclick = () => { if (buy(nx.cost, nx.lv, () => { S.house = (S.house || 0) + 1; })) { confetti(); toast(T(PG.upgraded)); showHouse(); } };
}

// ---- hooks: re-check rank and badges whenever the top bar refreshes; a house on the map ----
{ const t0 = HOOK.top; HOOK.top = () => { if (t0) t0(); checkBadges(); checkRank(); }; }
{ const m0 = HOOK.afterMap; HOOK.afterMap = () => { if (m0) m0(); const map = $('.map'); if (!map) return; const H = HOUSES[S.house || 0];
  map.insertAdjacentHTML('beforeend', `<button class="place" data-house="1" style="left:78%;top:80%" type="button" aria-label="${T(PG.house).replace(/<[^>]+>/g, '')}">${H.e}<span class="plate">${T(PG.house)}</span></button>`);
  $('[data-house]', map).onclick = () => showHouse();
  const acts = $('.acts'); if (acts) { acts.insertAdjacentHTML('beforeend', `<button class="chcard" data-act2="house" type="button"><span class="bigemo">${H.e}</span><span class="t">${T(PG.house)}</span><span class="s">${T(PG.houseTxt)}</span></button>`); $('[data-act2]').onclick = () => showHouse(); } }; }
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(PG).flatMap((v) => (v.ja ? [v] : Object.values(v))), ...HOUSES.map((h) => h.n), ...RANKS.map((r) => r[1]), ...AREAS.map((a) => a.n), ...WEAR.map((w) => w[4]), ...FURN.map((f) => f[4]), ...Object.values(QUESTS).map((q) => q.t)];
