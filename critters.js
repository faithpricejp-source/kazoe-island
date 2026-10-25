// critters.js — wild friends: animal + plant critters met in the meadow, by season and time of day.
// Each one is drawn by critter() in index.html from parts: body shape, ears, a plant on the head, tail, wings, pattern.
// season(): 0 winter, 1 spring, 2 summer, 3 autumn · phase(): morning / day / evening / night · rare: 1 common … 3 very rare.

const CRITTER_PARTS = (() => {
  const leafC = '#7cc95b', leafD = '#4c9a3f';
  const petals = (cx, cy, r, n, rx, ry, fill, stroke) => Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${cy - r}" rx="${rx}" ry="${ry}" transform="rotate(${(360 / n) * i} ${cx} ${cy})" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`).join('');
  const BODY = {
    mochi: { d: 'M10 68 C10 46 28 38 50 38 C72 38 90 46 90 68 C90 85 74 92 50 92 C26 92 10 85 10 68Z', dy: 10 },
    pear: { d: 'M20 66 C20 38 34 22 50 22 C66 22 80 38 80 66 C80 84 68 92 50 92 C32 92 20 84 20 66Z', dy: -6 },
    drop: { d: 'M50 16 C60 32 86 44 86 66 C86 84 70 92 50 92 C30 92 14 84 14 66 C14 44 40 32 50 16Z', dy: -4 },
  };
  // a plant (or hat) on the head; (50, 28) is the top of the default body
  const TOP = {
    flower: (s) => `<path d="M50 30 L50 19" stroke="${leafD}" stroke-width="3" stroke-linecap="round"/>${petals(50, 13, 7, 5, 5, 6.5, s.c2 || '#ff8fb1', '#e0607f')}<circle cx="50" cy="13" r="4" fill="#ffd84d" stroke="#e3a82a" stroke-width="1"/>`,
    tulip: (s) => `<path d="M50 31 L50 18" stroke="${leafD}" stroke-width="3" stroke-linecap="round"/><path d="M50 26 Q40 22 38 14 Q46 16 50 24Z" fill="${leafC}"/><path d="M41 6 Q40 20 50 21 Q60 20 59 6 L54.5 11 L50 4 L45.5 11Z" fill="${s.c2 || '#ff6f91'}" stroke="#c94467" stroke-width="1.4" stroke-linejoin="round"/>`,
    sakura: () => `${petals(68, 30, 6, 5, 4.2, 6, '#ffd1df', '#f08bab')}<circle cx="68" cy="30" r="2.6" fill="#ff7aa2"/>${petals(33, 34, 4, 5, 2.8, 4, '#ffe3ec', '#f3a3bd')}`,
    berry: (s) => `<path d="M50 8 Q44 14 42 22 M50 8 Q56 12 58 20" stroke="${leafD}" stroke-width="2" fill="none"/><path d="M50 8 Q58 2 64 6 Q58 10 50 8Z" fill="${leafC}"/><circle cx="42" cy="25" r="6.5" fill="${s.c2 || '#e53950'}" stroke="#a8243a" stroke-width="1.4"/><circle cx="58" cy="23" r="6.5" fill="${s.c2 || '#e53950'}" stroke="#a8243a" stroke-width="1.4"/><circle cx="40" cy="23" r="1.8" fill="#fff" opacity=".8"/><circle cx="56" cy="21" r="1.8" fill="#fff" opacity=".8"/>`,
    mushroom: (s) => `<path d="M16 42 Q18 6 50 6 Q82 6 84 42 Q50 32 16 42Z" fill="${s.c2 || '#ef5350'}" stroke="#b23a3a" stroke-width="2"/><circle cx="34" cy="22" r="5" fill="#fff"/><circle cx="58" cy="15" r="4" fill="#fff"/><circle cx="70" cy="30" r="4.5" fill="#fff"/><circle cx="46" cy="32" r="3" fill="#fff"/>`,
    acorn: () => `<path d="M50 12 L52 4" stroke="#7a5230" stroke-width="3" stroke-linecap="round"/><path d="M28 36 Q28 12 50 12 Q72 12 72 36 Q50 29 28 36Z" fill="#a8743f" stroke="#6e4524" stroke-width="2"/><path d="M34 22 L66 22 M31 29 L69 29 M40 14 L36 34 M50 12 L50 31 M60 14 L64 34" stroke="#6e4524" stroke-width="1" opacity=".6"/>`,
    leafhat: () => `<path d="M50 30 Q28 2 60 4 Q76 18 50 30Z" fill="${leafC}" stroke="${leafD}" stroke-width="2"/><path d="M50 30 Q55 16 60 6" stroke="${leafD}" stroke-width="1.4" fill="none"/>`,
    clover: () => `<path d="M50 30 L50 19" stroke="${leafD}" stroke-width="3" stroke-linecap="round"/>${[0, 90, 180, 270].map((a) => `<path d="M50 14 C44 4 36 12 50 14Z M50 14 C56 4 64 12 50 14Z" transform="rotate(${a} 50 14) translate(0 -1)" fill="${leafC}" stroke="${leafD}" stroke-width="1.2"/>`).join('')}`,
    bud: (s) => `<path d="M50 30 L50 20" stroke="${leafD}" stroke-width="3" stroke-linecap="round"/><path d="M50 4 Q60 14 50 22 Q40 14 50 4Z" fill="${s.c2 || '#c9a7ff'}" stroke="#8e6cc8" stroke-width="1.4"/><path d="M50 22 Q42 20 41 14 M50 22 Q58 20 59 14" stroke="${leafD}" stroke-width="2" fill="none"/>`,
    maple: () => `<path d="M50 30 L50 22" stroke="#9c3b1d" stroke-width="2.5"/><path d="M50 2 L54 12 L64 8 L60 18 L70 20 L58 24 L50 22 L42 24 L30 20 L40 18 L36 8 L46 12Z" fill="#f2683c" stroke="#b33f1c" stroke-width="1.4" stroke-linejoin="round"/>`,
    snow: () => `<g stroke="#9fd0ff" stroke-width="2.2" stroke-linecap="round">${[0, 60, 120].map((a) => `<path d="M50 4 L50 28 M46 8 L50 12 L54 8 M46 24 L50 20 L54 24" transform="rotate(${a} 50 16)"/>`).join('')}</g>`,
    lotus: () => `<ellipse cx="50" cy="28" rx="22" ry="7" fill="#5fb85a" stroke="#3d8a3a" stroke-width="1.6"/><path d="M50 28 L64 24" stroke="#3d8a3a" stroke-width="1.4"/>${petals(46, 18, 5, 6, 3.4, 6, '#ffc2d6', '#e889a8')}<circle cx="46" cy="18" r="2.4" fill="#ffd84d"/>`,
    grapes: () => `<path d="M50 6 L50 12" stroke="#6e4524" stroke-width="2.5"/><path d="M50 8 Q60 2 66 8 Q58 12 50 8Z" fill="${leafC}"/>${[[42, 14], [50, 14], [58, 14], [46, 21], [54, 21], [50, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#8e5ac8" stroke="#5e3690" stroke-width="1.2"/>`).join('')}`,
    pumpkin: () => `<path d="M50 12 Q50 6 54 4" stroke="#4c7a2a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="24" rx="17" ry="12" fill="#ff9933" stroke="#c46410" stroke-width="2"/><path d="M50 12 L50 36 M40 14 Q36 24 40 34 M60 14 Q64 24 60 34" stroke="#c46410" stroke-width="1.4" fill="none"/>`,
    puff: () => `<path d="M50 31 L50 18" stroke="${leafD}" stroke-width="2.5"/><circle cx="50" cy="12" r="11" fill="#fff" stroke="#d8d8d8" stroke-width="1.2"/>${Array.from({ length: 10 }, (_, i) => `<path d="M50 12 L${(50 + 10 * Math.cos(i * 0.628)).toFixed(1)} ${(12 + 10 * Math.sin(i * 0.628)).toFixed(1)}" stroke="#cfcfcf" stroke-width="0.8"/>`).join('')}`,
    calyx: () => `${[-50, -25, 0, 25, 50].map((a) => `<path d="M50 32 Q46 22 50 14 Q54 22 50 32Z" transform="rotate(${a} 50 32)" fill="${leafC}" stroke="${leafD}" stroke-width="1.2"/>`).join('')}`,
    shoot: () => `<path d="M38 34 L50 4 L62 34Z" fill="#c99a5b" stroke="#8a6232" stroke-width="2" stroke-linejoin="round"/><path d="M42 26 L58 26 M45 18 L55 18" stroke="#8a6232" stroke-width="1.4"/><path d="M50 4 L54 0" stroke="${leafD}" stroke-width="2"/>`,
    bells: () => `<path d="M40 30 Q42 10 58 6" stroke="${leafD}" stroke-width="2.4" fill="none"/>${[[46, 18], [52, 11], [59, 9]].map(([x, y]) => `<path d="M${x - 4} ${y} Q${x} ${y - 8} ${x + 4} ${y} Q${x} ${y + 3} ${x - 4} ${y}Z" fill="#fff" stroke="#c9c9c9" stroke-width="1.2"/>`).join('')}<path d="M40 30 Q30 14 36 4 Q44 18 40 30Z" fill="${leafC}" stroke="${leafD}" stroke-width="1.2"/>`,
    moon: () => `<path d="M58 4 A13 13 0 1 0 62 28 A10 10 0 1 1 58 4Z" fill="#ffe680" stroke="#e3b92a" stroke-width="1.6"/>`,
    holly: () => `<path d="M38 26 Q34 16 40 10 Q42 18 50 22 Q44 26 38 26Z M62 26 Q66 16 60 10 Q58 18 50 22 Q56 26 62 26Z" fill="#3f9a4a" stroke="#256b2f" stroke-width="1.4"/>${[[47, 22], [53, 22], [50, 17]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#e53950" stroke="#a8243a" stroke-width="1"/>`).join('')}`,
    camellia: () => `${petals(66, 30, 6, 5, 5, 6.5, '#e8455e', '#b02c42')}<circle cx="66" cy="30" r="3.4" fill="#ffd84d"/><path d="M58 38 Q52 34 54 28" stroke="${leafD}" stroke-width="0" fill="none"/><path d="M74 36 Q84 34 84 26 Q76 26 74 36Z" fill="${leafC}" stroke="${leafD}" stroke-width="1.2"/>`,
    hydrangea: () => `${[[40, 20], [50, 14], [60, 20], [45, 27], [55, 27], [50, 21]].map(([x, y], i) => petals(x, y, 3, 4, 2.6, 3.4, i % 2 ? '#8fb4ff' : '#b79cff', '#6b7fd6') + `<circle cx="${x}" cy="${y}" r="1" fill="#fff"/>`).join('')}`,
    cotton: () => `<path d="M50 31 L50 22" stroke="#8a6232" stroke-width="2.5"/>${[[44, 16], [56, 16], [50, 10], [50, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#fff" stroke="#d6d0c4" stroke-width="1.2"/>`).join('')}`,
    yuzu: () => `<circle cx="50" cy="22" r="10" fill="#ffd23f" stroke="#d9a400" stroke-width="1.6"/><path d="M50 12 Q56 6 62 9 Q56 13 50 12Z" fill="${leafC}" stroke="${leafD}" stroke-width="1"/><circle cx="46" cy="19" r="1" fill="#e3b200"/><circle cx="53" cy="24" r="1" fill="#e3b200"/>`,
    trumpet: () => `<path d="M50 31 L52 20" stroke="${leafD}" stroke-width="2.5"/><path d="M52 22 L44 6 Q52 0 62 6 Z" fill="#7c8cff" stroke="#4c5bd0" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="53" cy="6" rx="9" ry="3.6" fill="#a9b4ff" stroke="#4c5bd0" stroke-width="1.2"/><circle cx="53" cy="6" r="1.6" fill="#fff"/><path d="M50 26 Q40 26 38 18 Q46 18 50 26Z" fill="${leafC}"/>`,
    rose: () => `<path d="M50 31 L50 20" stroke="${leafD}" stroke-width="3"/><circle cx="50" cy="13" r="9" fill="#ff4d6d" stroke="#b8233f" stroke-width="1.6"/><path d="M45 13 Q50 6 55 12 Q50 18 46 14 Q50 10 52 13" stroke="#b8233f" stroke-width="1.3" fill="none"/>`,
    frill: (s) => `${[-48, -24, 0, 24, 48].map((a) => `<path d="M50 30 Q44 12 50 4 Q56 12 50 30Z" transform="rotate(${a} 50 30)" fill="${s.c2 || '#ff9ad0'}" stroke="${shade(s.c2 || '#ff9ad0', -40)}" stroke-width="1.2"/>`).join('')}`,
    star2: () => `<path d="M50 4 L53 12 L62 12 L55 17 L58 26 L50 21 L42 26 L45 17 L38 12 L47 12Z" fill="#fff6a8" stroke="#e3c22a" stroke-width="1.4" stroke-linejoin="round"/><path d="M28 18 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2Z M72 22 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5Z" fill="#ffd1f0"/>`,
  };
  // back layer: tails, wings, manes
  const TAIL = {
    leaf: () => `<path d="M80 80 Q100 58 97 88 Q88 90 80 80Z" fill="${leafC}" stroke="${leafD}" stroke-width="1.8"/><path d="M80 80 Q90 76 96 66" stroke="${leafD}" stroke-width="1.2" fill="none"/>`,
    fluff: (s) => `<circle cx="88" cy="80" r="9" fill="${s.c3 || s.c}" stroke="${shade(s.c3 || s.c, -40)}" stroke-width="2"/><circle cx="94" cy="72" r="6" fill="${s.c3 || s.c}" stroke="${shade(s.c3 || s.c, -40)}" stroke-width="2"/>`,
    big: (s) => `<path d="M78 84 Q104 80 98 50 Q92 34 84 44 Q94 56 80 70Z" fill="${s.c3 || s.c}" stroke="${shade(s.c3 || s.c, -40)}" stroke-width="2"/>`,
    stripe: (s) => `<path d="M78 82 Q100 84 98 62 Q96 52 90 56 Q92 72 76 74Z" fill="${s.c}" stroke="${shade(s.c, -40)}" stroke-width="2"/><path d="M92 58 L97 60 M93 66 L98 67 M90 73 L95 76" stroke="#7a3b1d" stroke-width="2.4"/>`,
    glow: () => `<circle cx="88" cy="82" r="8" fill="#fff6a0" opacity=".9"/><circle cx="88" cy="82" r="13" fill="#fff6a0" opacity=".35"/>`,
    vine: () => `<path d="M80 82 Q96 82 94 70 Q92 62 86 66 Q84 72 90 72" stroke="${leafD}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M94 72 Q100 68 98 62 Q94 66 94 72Z" fill="${leafC}"/>`,
    tentacle: (s) => [30, 42, 58, 70].map((x, i) => `<path d="M${x} 86 Q${x + (i % 2 ? 5 : -5)} 94 ${x} 99" stroke="${shade(s.c, -25)}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''),
  };
  const WING = {
    leaf: () => `<path d="M16 58 Q-2 40 4 66 Q10 70 16 58Z M84 58 Q102 40 96 66 Q90 70 84 58Z" fill="${leafC}" stroke="${leafD}" stroke-width="1.6"/>`,
    petal: () => `<ellipse cx="9" cy="58" rx="7" ry="12" transform="rotate(-25 9 58)" fill="#ffd1df" stroke="#f08bab" stroke-width="1.4"/><ellipse cx="91" cy="58" rx="7" ry="12" transform="rotate(25 91 58)" fill="#ffd1df" stroke="#f08bab" stroke-width="1.4"/>`,
    butterfly: (s) => `<path d="M20 52 Q-4 30 2 56 Q-2 76 20 64Z M80 52 Q104 30 98 56 Q102 76 80 64Z" fill="${s.c2 || '#ffb347'}" stroke="${shade(s.c2 || '#ffb347', -40)}" stroke-width="1.6"/><circle cx="8" cy="50" r="3.6" fill="#fff" opacity=".8"/><circle cx="92" cy="50" r="3.6" fill="#fff" opacity=".8"/>`,
    owl: (s) => `<path d="M16 56 Q4 70 16 84 Q22 72 20 58Z M84 56 Q96 70 84 84 Q78 72 80 58Z" fill="${shade(s.c, -20)}" stroke="${shade(s.c, -50)}" stroke-width="1.6"/>`,
    mane: () => petals(50, 60, 38, 16, 7, 12, '#ffd23f', '#e3a400'),
  };
  // patterns on the body (drawn under the face)
  const PAT = {
    spots: (s) => `<circle cx="30" cy="46" r="5" fill="${shade(s.c, 35)}"/><circle cx="70" cy="44" r="4" fill="${shade(s.c, 35)}"/><circle cx="78" cy="74" r="3.5" fill="${shade(s.c, 35)}"/>`,
    seeds: () => [[30, 48], [42, 42], [58, 42], [70, 48], [24, 72], [76, 72], [36, 84], [64, 84]].map(([x, y]) => `<path d="M${x} ${y - 2.4} Q${x + 1.6} ${y} ${x} ${y + 2.4} Q${x - 1.6} ${y} ${x} ${y - 2.4}Z" fill="#ffe27a"/>`).join(''),
    spines: (s) => [[22, 48], [30, 38], [70, 38], [78, 48], [18, 66], [82, 66]].map(([x, y]) => `<path d="M${x} ${y} l${x < 50 ? -4 : 4} -3" stroke="${shade(s.c, -45)}" stroke-width="1.6" stroke-linecap="round"/>`).join(''),
    stripes: (s) => `<path d="M40 36 Q50 32 60 36 M38 42 Q50 38 62 42" stroke="${shade(s.c, -35)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    hedgehog: () => `<path d="M14 58 L8 50 L18 48 L14 38 L26 40 L26 28 L36 34 L42 22 L50 30 L58 22 L64 34 L74 28 L74 40 L86 38 L82 48 L92 50 L86 58" fill="#8a6440" stroke="#5e4128" stroke-width="2" stroke-linejoin="round"/>`,
    mask: () => `<ellipse cx="38" cy="58" rx="9" ry="7" fill="#fff"/><ellipse cx="62" cy="58" rx="9" ry="7" fill="#fff"/>`,
  };
  return { BODY, TOP, TAIL, WING, PAT };
})();

// extra drawing for one species: what goes behind the body, the body path, and what goes on top (shifted by the body's head height)
function critterExtra(sp) {
  const P = CRITTER_PARTS, body = P.BODY[sp.body] || null, dy = body ? body.dy : 0;
  const back = (sp.wing ? P.WING[sp.wing](sp) : '') + (sp.tail ? P.TAIL[sp.tail](sp) : '');
  const pat = sp.pat ? P.PAT[sp.pat](sp) : '', top = sp.top ? `<g transform="translate(0 ${dy})">${P.TOP[sp.top](sp)}</g>` : '';
  return { back, body: body && body.d, dy, pat, top };
}

// when and how often a wild friend shows up
const WHEN_TXT = {
  s: [tx('冬', 'winter', '冬'), tx('春', 'spring', '春'), tx('夏', 'summer', '夏'), tx('秋', 'autumn', '秋')],
  t: { morning: tx('朝', 'morning', '早上'), day: tx('昼', 'daytime', '白天'), evening: tx('夕方', 'evening', '傍晚'), night: tx('夜', 'night', '夜里') },
  any: tx('いつでも', 'any time', '随时'),
};
const W = (name, fact, look, when) => ({ ...look, name, fact, wild: when || {} });
const WILD = {
  sakuran: W(tx('さくら', 'Cherry Blossom', '樱花'), tx('春だけ顔を出す。歩くと花びらがひらひら。', 'Only comes out in spring; petals flutter as it walks.', '只在春天出现，走起路来花瓣飘飘。'), { c: '#ffd6e4', ear: 'cat', top: 'sakura', wing: 'petal', type: 'frac' }, { s: [1] }),
  tanpopon: W(tx('たんぽぽ', 'Dandelion', '蒲公英'), tx('ふーっとすると、わた毛が旅に出る。', 'Blow on it and its fluff sets off on a trip.', '轻轻一吹，绒毛就去旅行了。'), { c: '#ffe066', ear: 'round', top: 'puff', type: 'frac' }, { s: [1], t: ['morning', 'day'] }),
  churi: W(tx('チューリップ', 'Tulip', '郁金香'), tx('赤・白・黄色、その日の気分で花の色がかわる。', 'Its flower is red, white or yellow — depends on its mood.', '花的颜色随心情变：红、白、黄。'), { c: '#fff1f5', ear: 'bunny', top: 'tulip', c2: '#ff5c8a', type: 'frac' }, { s: [1] }),
  kurova: W(tx('クローバー', 'Clover', '三叶草'), tx('四つ葉の子に会えたら、とってもラッキー。', 'Meeting this four-leaf friend is very lucky.', '遇到四叶的它，运气超好。'), { c: '#b9eb9a', ear: 'round', top: 'clover', body: 'mochi', type: 'prob', rare: 3 }, { s: [1, 2] }),
  takenon: W(tx('たけのこ', 'Bamboo Shoot', '竹笋'), tx('雨のあと、ぐんぐん背がのびる。', 'Shoots up fast after the rain.', '下过雨就噌噌长高。'), { c: '#e8c48f', ear: 'none', top: 'shoot', body: 'pear', type: 'shape' }, { s: [1] }),
  suzurin: W(tx('すずらん', 'Lily of the Valley', '铃兰'), tx('朝の風で、すずの花がちりんと鳴る(気がする)。', 'In the morning breeze its bell flowers seem to ring.', '早上的风一吹，铃兰好像会叮铃响。'), { c: '#e9f7ee', ear: 'round', top: 'bells', type: 'inf' }, { s: [1], t: ['morning'] }),
  ichigoro: W(tx('いちご', 'Strawberry', '草莓'), tx('あまずっぱいにおい。つぶつぶを数えるのが好き。', 'Smells sweet and sour; loves counting its own seeds.', '酸酸甜甜的味道，最爱数身上的小籽。'), { c: '#ff6b7f', ear: 'none', top: 'calyx', pat: 'seeds', body: 'drop', type: 'count' }, { s: [1, 2] }),
  chocho: W(tx('ちょうちょう', 'Butterfly', '蝴蝶'), tx('花から花へ。この子は、黄色い花がお気に入り。', 'Flits from flower to flower; this one likes yellow flowers best.', '在花间飞来飞去，这一只最喜欢黄色的花。'), { c: '#fff3c4', ear: 'none', top: 'star2', wing: 'butterfly', c2: '#ffb347', type: 'prob' }, { s: [1, 2], t: ['morning', 'day'] }),
  himawan: W(tx('ひまわり', 'Sunflower', '向日葵'), tx('わかいうちは、お日さまの方を向いて首をうごかす。', 'While young, it turns its face to follow the sun.', '小时候会转头追着太阳看。'), { c: '#ffb347', ear: 'round', wing: 'mane', type: 'shape' }, { s: [2], t: ['morning', 'day'] }),
  suiren: W(tx('すいれん', 'Water Lily', '睡莲'), tx('池にぷかぷか。葉っぱのぼうしで日よけ。', 'Floats in the pond with a leaf hat for shade.', '在池塘里漂呀漂，荷叶帽子用来遮阳。'), { c: '#8fd3ff', ear: 'none', top: 'lotus', body: 'drop', type: 'frac' }, { s: [2] }),
  asagao: W(tx('あさがお', 'Morning Glory', '牵牛花'), tx('朝にさいて、お昼にはねむくなる。', 'Blooms in the morning and gets sleepy by noon.', '早上开花，中午就犯困。'), { c: '#d7dcff', ear: 'cat', top: 'trumpet', tail: 'vine', type: 'inf' }, { s: [2], t: ['morning'] }),
  sabo: W(tx('サボテン', 'Cactus', '仙人掌'), tx('島のさぼてんは ふわふわの友だち。本物のサボテンは、とげに気をつけてね。', 'The island’s cactus friend is fluffy — but real cacti have sharp spines, so be careful!', '岛上的仙人球是毛茸茸的朋友；真正的仙人掌有刺，要小心哦。'), { c: '#8ed081', ear: 'none', top: 'flower', c2: '#ff8fb1', pat: 'spines', body: 'pear', type: 'shape' }, { s: [2] }),
  remon: W(tx('レモン', 'Lemon', '柠檬'), tx('すっぱい顔をしても、こころはあまい。', 'Makes a sour face, but has a sweet heart.', '表情酸酸的，心里甜甜的。'), { c: '#fff176', ear: 'none', top: 'leafhat', body: 'drop', type: 'frac' }, { s: [2] }),
  momomo: W(tx('もも', 'Peach', '桃子'), tx('ほっぺがいつもピンク色。', 'Its cheeks are always pink.', '脸蛋总是粉粉的。'), { c: '#ffc2c7', ear: 'none', top: 'leafhat', body: 'drop', type: 'count' }, { s: [2] }),
  ajisai: W(tx('あじさい', 'Hydrangea', '绣球花'), tx('雨の日が大好き。土によって、花の色が変わる種類もあるよ。', 'Loves rainy days. Some kinds change flower colour with the soil.', '最爱下雨天。有些品种的花色会随土壤变化。'), { c: '#c7d3ff', ear: 'bunny', top: 'hydrangea', type: 'prob' }, { s: [2] }),
  hotarun: W(tx('ホタル', 'Firefly', '萤火虫'), tx('夏の夜だけ、しっぽがぴかっと光る。', 'On summer nights its tail glows.', '只有夏天的夜里，尾巴会一闪一闪。'), { c: '#3f4a6b', d: '#20283f', ear: 'none', top: 'star2', tail: 'glow', type: 'inf' }, { s: [2], t: ['evening', 'night'] }),
  umiushi: W(tx('ウミウシ', 'Sea Slug', '海蛞蝓'), tx('海の中の おしゃれさん。フリルが じまん。', 'The fashion star of the sea, proud of its frills.', '海里的时髦精，最得意身上的花边。'), { c: '#b18cff', ear: 'none', top: 'frill', c2: '#ffcf4d', pat: 'spots', body: 'mochi', type: 'prob', rare: 2 }, { s: [2, 3] }),
  kurage: W(tx('クラゲ', 'Jellyfish', '水母'), tx('ゆらゆら。夜の海でぼんやり光る。', 'Sways about and glows softly in the night sea.', '轻轻摇摆，夜晚的海里微微发光。'), { c: '#bfe9ff', d: '#7cc4e6', ear: 'none', tail: 'tentacle', body: 'mochi', type: 'inf' }, { s: [2], t: ['evening', 'night'] }),
  donguri: W(tx('クヌギ', 'Sawtooth Oak', '麻栎'), tx('ぼうしを落とすと、ちょっとはずかしがる。', 'Gets a little shy when its cap falls off.', '帽子掉了会有点害羞。'), { c: '#c98d55', ear: 'none', top: 'acorn', body: 'drop', type: 'count' }, { s: [3] }),
  momiji: W(tx('もみじ', 'Maple', '枫叶'), tx('秋になると、葉っぱも顔も赤くなる。', 'In autumn its leaf — and its face — turn red.', '一到秋天，叶子和脸都变红。'), { c: '#ff9466', ear: 'fox', top: 'maple', tail: 'fluff', c3: '#ffc09a', type: 'shape' }, { s: [3] }),
  kinoko: W(tx('きのこ', 'Mushroom', '蘑菇'), tx('森のしめった所にいる。かさは雨がさ。', 'Lives in damp corners of the forest; its cap is an umbrella.', '住在森林潮湿的地方，菌盖就是雨伞。'), { c: '#fff4e0', d: '#d8c3a5', ear: 'none', top: 'mushroom', body: 'mochi', type: 'count' }, { s: [3, 1] }),
  kabochan: W(tx('かぼちゃ', 'Pumpkin', '南瓜'), tx('秋の夜にあらわれる。おかしが好き。', 'Appears on autumn nights; loves sweets.', '秋夜出没，爱吃点心。'), { c: '#ffb066', ear: 'cat', top: 'pumpkin', type: 'shape' }, { s: [3], t: ['evening', 'night'] }),
  budoun: W(tx('ぶどう', 'Grapes', '葡萄'), tx('頭のぶどうは、何つぶあるかな?', 'How many grapes are on its head?', '头上的葡萄有几粒呢？'), { c: '#d8b8ff', ear: 'round', top: 'grapes', type: 'count' }, { s: [3] }),
  tsukimi: W(tx('ウサギ', 'Rabbit', '兔子'), tx('まんまるの月の夜、おだんごを数える。', 'On full-moon nights it counts rice dumplings.', '满月的夜里数团子。'), { c: '#f8f6ff', d: '#c8bedc', ear: 'bunny', top: 'moon', type: 'inf' }, { s: [3], t: ['night'] }),
  fuwatan: W(tx('わた', 'Cotton', '棉花'), tx('ふわふわの わたの実。さわると気持ちいい。', 'A fluffy cotton boll — so soft to touch.', '毛茸茸的棉桃，摸起来好舒服。'), { c: '#f3ede2', d: '#cfc4b0', ear: 'round', top: 'cotton', tail: 'fluff', type: 'frac' }, { s: [3] }),
  minomu: W(tx('ミノムシ', 'Bagworm', '蓑虫'), tx('葉っぱのコートで冬じたく。', 'Gets ready for winter in a coat of leaves.', '穿上叶子外套准备过冬。'), { c: '#a88b6a', ear: 'none', pat: 'stripes', body: 'pear', top: 'leafhat', type: 'count' }, { s: [3, 0] }),
  harinezu: W(tx('ハリネズミ', 'Hedgehog', '刺猬'), tx('夜になると元気。まるくなると とげとげボール。', 'Lively at night; curls into a spiky ball.', '夜里最精神，缩成一团就是刺球。'), { c: '#f2d4b0', d: '#c39a6b', ear: 'round', pat: 'hedgehog', type: 'shape' }, { s: [3, 1, 2], t: ['evening', 'night'] }),
  risu: W(tx('リス', 'Squirrel', '松鼠'), tx('どんぐりをかくすのが得意。どこにしまったか、思い出し中。', 'Great at hiding acorns — still remembering where they all went.', '很会藏橡果，正在回想都藏在哪儿了。'), { c: '#d9935a', ear: 'cat', tail: 'big', c3: '#e8a874', top: 'acorn', type: 'count' }, { s: [3] }),
  shimaena: W(tx('シマエナガ', 'Long-tailed Tit', '北长尾山雀'), tx('北海道の森にすむ小鳥。雪のおもちみたい。', 'A tiny bird from Hokkaido’s forests, like a snowy rice cake.', '住在北海道森林的小鸟，像一团雪做的年糕。'), { c: '#ffffff', d: '#cfd8e3', ear: 'none', wing: 'owl', tail: 'fluff', c3: '#5a5a66', body: 'mochi', type: 'inf', rare: 2 }, { s: [0] }),
  yukinko: W(tx('オコジョ', 'Ermine', '白鼬'), tx('冬になると、毛が まっ白に生えかわる。', 'In winter its fur turns pure white.', '一到冬天，毛就换成雪白的。'), { c: '#eef6ff', d: '#a9c3e0', ear: 'round', top: 'snow', body: 'mochi', type: 'inf' }, { s: [0] }),
  kapi: W(tx('カピバラ', 'Capybara', '水豚'), tx('動物園では、冬にゆずのおふろに入る仲間もいるよ。のんびりや。', 'At some zoos, capybaras get a yuzu bath in winter. Very relaxed.', '有些动物园冬天会让水豚泡柚子浴。慢性子。'), { c: '#b98a5e', ear: 'round', top: 'yuzu', body: 'mochi', type: 'count' }, { s: [0, 3] }),
  hiiragi: W(tx('ヒイラギ', 'Holly', '冬青'), tx('セイヨウヒイラギの赤い実がぼうしのかざり。冬の森の人気者。', 'Its cap is decorated with English-holly berries; a winter-forest favourite.', '帽子上装饰着西洋冬青的红果子，冬天森林的红人。'), { c: '#e6f2e6', ear: 'cat', top: 'holly', type: 'shape' }, { s: [0] }),
  tsubaki: W(tx('つばき', 'Camellia', '山茶花'), tx('寒い冬でも、赤い花をさかせる。', 'Blooms red flowers even in the cold winter.', '寒冬里也开红花。'), { c: '#fff0f2', ear: 'bunny', top: 'camellia', type: 'frac' }, { s: [0, 1] }),
  fukuron: W(tx('フクロウ', 'Owl', '猫头鹰'), tx('夜ふかしの名人。目をつぶって考えごと。', 'Master of staying up late; thinks with its eyes closed.', '熬夜专家，闭着眼睛想事情。'), { c: '#c7a27c', ear: 'horn', wing: 'owl', eyes: 'sleepy', type: 'inf' }, { t: ['night'] }),
  lessa: W(tx('レッサーパンダ', 'Red Panda', '小熊猫'), tx('しまもようのしっぽで バランスをとる。', 'Balances with its striped tail.', '靠条纹尾巴保持平衡。'), { c: '#e0773c', ear: 'fox', pat: 'mask', tail: 'stripe', type: 'shape' }, {}),
  kokemaru: W(tx('こけ', 'Moss', '苔藓'), tx('雨がふるとうれしくて、緑がこくなる。', 'Gets greener and happier when it rains.', '一下雨就开心，绿色变得更深。'), { c: '#8ccf72', ear: 'none', pat: 'spots', body: 'mochi', top: 'leafhat', type: 'frac' }, {}),
  happa: W(tx('はっぱ', 'Leaf', '叶子'), tx('葉っぱのつばさで、ちょっとだけ飛べる。', 'Can fly just a little with its leaf wings.', '靠叶子翅膀能飞一小会儿。'), { c: '#d6f5b0', ear: 'none', top: 'leafhat', wing: 'leaf', type: 'frac' }, { t: ['morning', 'day', 'evening'] }),
  barari: W(tx('バラ', 'Rose', '玫瑰'), tx('とげには気をつけて。においはとってもいい。', 'Mind the thorns — it smells wonderful.', '小心刺，但香味超好闻。'), { c: '#ffe3e8', ear: 'cat', top: 'rose', tail: 'vine', type: 'prob', rare: 2 }, { s: [1, 2] }),
  nemuno: W(tx('ネムノキ', 'Silk Tree', '合欢树'), tx('いつも半分ねている。つぼみも まだねている。', 'Always half asleep — and so is its bud.', '总是半睡半醒，花苞也还在睡。'), { c: '#cdbdf2', ear: 'round', top: 'bud', eyes: 'sleepy', type: 'inf' }, { t: ['evening', 'night'] }),
  niji: W(tx('にじ', 'Rainbow', '彩虹'), tx('雨あがりの空みたいな、きれいな色。めったに会えない友だち。', 'Colours like a sky after rain. A friend you rarely meet.', '颜色像雨后的天空，很难遇到的朋友。'), { c: '#fff', d: '#c8bedc', ear: 'bunny', top: 'star2', wing: 'butterfly', c2: '#8fd3ff', tail: 'fluff', c3: '#ffd1f0', type: 'prob', rare: 3 }, {}),
};
Object.assign(SPECIES, WILD);

// which wild friends can be met right now; rarer ones are less likely
function wildNow(seasonNow, phaseNow) {
  return Object.keys(WILD).filter((k) => { const w = WILD[k].wild; return (!w.s || w.s.includes(seasonNow)) && (!w.t || w.t.includes(phaseNow)); });
}
const wildWeight = (k) => (WILD[k] ? [1, 1, 0.45, 0.18][WILD[k].rare || 1] : 1);
const wildWhen = (k) => { const w = (WILD[k] || {}).wild; if (!w) return ''; const s = w.s ? w.s.map((i) => T(WHEN_TXT.s[i])).join('・') : '', t = w.t ? w.t.map((x) => T(WHEN_TXT.t[x])).join('・') : '';
  return [s, t].filter(Boolean).join(' / ') || T(WHEN_TXT.any); };
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...WHEN_TXT.s, ...Object.values(WHEN_TXT.t), WHEN_TXT.any];
