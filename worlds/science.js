// りかの島 (science, grade 4): one place per topic. Questions tagged by skill so the parent page shows which KIND is weak:
// know (terms & facts) / observe (read figures, graphs, tables) / reason (explain causes) / predict (use a rule in a new case) / calc (times & angles).
// Generated families here (sun & shadows, star sky, moon, circuits, magnets, temperature peaks) draw their own figures and get new cases each time;
// fixed questions come from worlds/data/science_bank.js (original wording).

const SCI = (() => {
  const DIR8 = [tx('北', 'north', '北'), tx('北東', 'north-east', '东北'), tx('東', 'east', '东'), tx('南東', 'south-east', '东南'), tx('南', 'south', '南'), tx('南西', 'south-west', '西南'), tx('西', 'west', '西'), tx('北西', 'north-west', '西北')];
  const SEASON = [tx('[春分|しゅんぶん]', 'spring equinox', '春分'), tx('[夏至|げし]', 'summer solstice', '夏至'), tx('[秋分|しゅうぶん]', 'autumn equinox', '秋分'), tx('[冬至|とうじ]', 'winter solstice', '冬至')];
  // sunrise: equinox due east; summer solstice north of east; winter solstice south of east (Japan)
  const RISE = [tx('真東', 'due east', '正东'), tx('東より北', 'north of east', '偏北的东方'), tx('真東', 'due east', '正东'), tx('東より南', 'south of east', '偏南的东方')];
  const SET = [tx('真西', 'due west', '正西'), tx('西より北', 'north of west', '偏北的西方'), tx('真西', 'due west', '正西'), tx('西より南', 'south of west', '偏南的西方')];
  // moon: phase → which direction it is seen at evening (18), midnight (0), dawn (6); null = not visible
  const MOON = {
    crescent: { n: tx('[三日月|みかづき]', 'crescent moon', '月牙'), at: { 18: 6 }, why: tx('[三日月|みかづき]は夕方、西の空に見え、すぐにしずむ。', 'A crescent is seen in the west at dusk and sets soon after.', '月牙傍晚出现在西边天空，很快就落下。') },
    first: { n: tx('[上弦|じょうげん]の月', 'first-quarter moon', '上弦月'), at: { 18: 4, 0: 6 }, why: tx('[上弦|じょうげん]の月は夕方に南の空、真夜中に西の空。', 'First quarter: south at dusk, west at midnight.', '上弦月傍晚在南边，半夜在西边。') },
    full: { n: tx('[満月|まんげつ]', 'full moon', '满月'), at: { 18: 2, 0: 4, 6: 6 }, why: tx('[満月|まんげつ]は夕方 東からのぼり、真夜中に南、明け方に西。太陽と反対がわにある。', 'A full moon rises in the east at dusk, is south at midnight and west at dawn — opposite the sun.', '满月傍晚从东方升起，半夜在南，黎明在西——在太阳的对面。') },
    last: { n: tx('[下弦|かげん]の月', 'last-quarter moon', '下弦月'), at: { 0: 2, 6: 4 }, why: tx('[下弦|かげん]の月は真夜中に東からのぼり、明け方に南の空。', 'Last quarter rises in the east around midnight and is south at dawn.', '下弦月半夜从东方升起，黎明时在南边。') },
  };
  const TIME = { 18: tx('夕方(午後6時ごろ)', 'dusk (about 6 pm)', '傍晚（下午6点左右）'), 0: tx('真夜中(午前0時ごろ)', 'midnight', '半夜（0点左右）'), 6: tx('明け方(午前6時ごろ)', 'dawn (about 6 am)', '黎明（早上6点左右）') };
  // things and whether a magnet attracts them
  const MAG = [[tx('鉄のくぎ', 'iron nail', '铁钉'), 1], [tx('スチールかん', 'steel can', '钢罐'), 1], [tx('鉄のクリップ', 'iron paper clip', '铁回形针'), 1], [tx('はさみの刃(鉄)', 'scissors blade (iron)', '剪刀刃（铁）'), 1],
    [tx('アルミかん', 'aluminium can', '铝罐'), 0], [tx('10円玉(銅)', '10-yen coin (copper)', '10日元硬币（铜）'), 0], [tx('1円玉(アルミニウム)', '1-yen coin (aluminium)', '1日元硬币（铝）'), 0], [tx('ガラスのコップ', 'glass cup', '玻璃杯'), 0], [tx('プラスチックのじょうぎ', 'plastic ruler', '塑料尺'), 0], [tx('木のわりばし', 'wooden chopsticks', '木筷子'), 0], [tx('紙', 'paper', '纸'), 0]];
  return { DIR8, SEASON, RISE, SET, MOON, TIME, MAG };
})();
const SCT = {
  sun: tx('太陽', 'sun', '太阳'), stick: tx('ぼう', 'stick', '棒'), same: tx('同じ', 'the same', '一样'), brighterA: tx('アの方が明るい', 'A is brighter', 'A更亮'), brighterB: tx('イの方が明るい', 'B is brighter', 'B更亮'),
  deg: tx('度', '°', '度'), oclock: tx('時', 'o’clock', '点'),
};

// ---- figures ----
// sky dome seen from the south-east: E on the left, S at the front, W on the right; sun path for a season; optional sun at hour h
function domeSVG(season, h) {
  const W = 360, H = 230, cx = 180, cy = 170, R = 140, tilt = 0.32, dec = [0, 23.4, 0, -23.4][season] * Math.PI / 180, lat = 35.7 * Math.PI / 180;
  const pos = (H_) => { // hour angle → alt/az → screen
    const ha = (H_ - 12) * 15 * Math.PI / 180, sinAlt = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(ha), alt = Math.asin(sinAlt);
    const az = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat));   // 0 = south, + = west
    const x = cx + R * Math.cos(alt) * Math.sin(az), yg = R * Math.cos(alt) * Math.cos(az) * tilt, y = cy + yg - R * Math.sin(alt) * 0.95;
    return { x, y, alt }; };
  const pts = []; for (let t = 4; t <= 20; t += 0.25) { const p = pos(t); if (p.alt > -0.02) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`); }
  const sun = h != null ? pos(h) : null;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:min(100%,380px);background:#eaf6ff;border-radius:12px">
    <ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * tilt}" fill="#e2f0d0" stroke="#7a9a5a"/><path d="M${cx - R} ${cy} A${R} ${R * 0.95} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="#b9cfe0" stroke-dasharray="4 4"/>
    <polyline points="${pts.join(' ')}" fill="none" stroke="#f39c12" stroke-width="2.6"/>
    ${sun && sun.alt > 0 ? `<line x1="${cx}" y1="${cy}" x2="${sun.x.toFixed(1)}" y2="${sun.y.toFixed(1)}" stroke="#f39c12" stroke-dasharray="3 3"/><circle cx="${sun.x.toFixed(1)}" cy="${sun.y.toFixed(1)}" r="10" fill="#ffd84d" stroke="#e3a82a" stroke-width="2"/>` : ''}
    <text x="${cx - R - 2}" y="${cy + 16}" font-size="13" fill="#3b3346">${LANGTXT('東', 'E', '东')}</text><text x="${cx + R - 12}" y="${cy + 16}" font-size="13" fill="#3b3346">${LANGTXT('西', 'W', '西')}</text>
    <text x="${cx - 6}" y="${cy + R * tilt + 16}" font-size="13" fill="#3b3346">${LANGTXT('南', 'S', '南')}</text><text x="${cx - 6}" y="${cy - R * tilt - 4}" font-size="13" fill="#3b3346">${LANGTXT('北', 'N', '北')}</text>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#3b3346"/></svg>`;
}
// stars around Polaris (north sky); stars at angle a (deg, counter-clockwise positive as seen facing north)
function northSkySVG(a0, marks) {
  const W = 300, H = 230, cx = 150, cy = 105, r = 70, pt = (a) => [cx + r * Math.cos((a - 90) * Math.PI / 180) * -1, cy + r * Math.sin((a - 90) * Math.PI / 180)];
  const dipper = (a) => { const [x, y] = pt(a); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${-a})">${[[-14, -4], [-6, -6], [2, -4], [9, 0], [12, 8], [21, 10], [22, 2]].map(([u, v]) => `<circle cx="${u}" cy="${v}" r="2.6" fill="#fff6a0"/>`).join('')}</g>`; };
  return `<svg viewBox="0 0 ${W} ${H}" style="width:min(100%,320px);background:#1d2546;border-radius:12px"><circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/><text x="${cx + 8}" y="${cy + 4}" font-size="11" fill="#ffe680">${LANGTXT('北極星', 'Polaris', '北极星')}</text>
    ${(marks || [a0]).map((a, i) => dipper(a) + `<text x="${(pt(a)[0] - 4).toFixed(1)}" y="${(pt(a)[1] + 24).toFixed(1)}" font-size="11" fill="#9fd0ff">${marks ? LANGTXT('アイウエ'[i], 'ABCD'[i], 'ABCD'[i]) : ''}</text>`).join('')}
    <rect x="0" y="${H - 34}" width="${W}" height="34" fill="#141a33"/><text x="${cx - 8}" y="${H - 12}" font-size="13" fill="#fff">${LANGTXT('北', 'N', '北')}</text><text x="10" y="${H - 12}" font-size="12" fill="#ccc">${LANGTXT('西', 'W', '西')}</text><text x="${W - 22}" y="${H - 12}" font-size="12" fill="#ccc">${LANGTXT('東', 'E', '东')}</text></svg>`;
}
// moon shape for a phase (lit part on the side toward the sun)
function moonSVG(k, size = 70) {
  const lit = { crescent: 'M30 5 A25 25 0 0 1 30 55 A18 25 0 0 0 30 5Z', first: 'M30 5 A25 25 0 0 1 30 55 Z', full: 'M30 5 A25 25 0 1 1 30 55 A25 25 0 1 1 30 5Z', last: 'M30 5 A25 25 0 0 0 30 55 Z' }[k];
  return `<svg viewBox="0 0 60 60" width="${size}" height="${size}" aria-hidden="true"><circle cx="30" cy="30" r="25" fill="#2b3150"/><path d="${lit}" fill="#ffe680"/></svg>`;
}
// circuit: b batteries (series 's' / parallel 'p') and m bulbs (series / parallel).
// Drawn as real connected wires (astra r9: the old drawing masked wires with white and left the loop open): every component
// sits in a gap of the wire, with its two terminals touching the wire ends.
function circuitSVG(c, label) {
  const W = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3b3346" stroke-width="2" stroke-linecap="round"/>`;
  const bat = (x, y) => `<line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + 10}" stroke="#3b3346" stroke-width="3"/><line x1="${x + 7}" y1="${y - 5}" x2="${x + 7}" y2="${y + 5}" stroke="#3b3346" stroke-width="5"/>`;   // + long plate at x, − short plate at x+7
  const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff6c4" stroke="#3b3346" stroke-width="2"/><path d="M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}" stroke="#c9a400" stroke-width="1.4"/>`;
  let g = W(20, 20, 20, 110) + W(180, 20, 180, 110);   // the two sides of the loop
  // top wire with the bulbs
  if (c.m === 1) g += W(20, 20, 91, 20) + bulb(100, 20) + W(109, 20, 180, 20);
  else if (c.ms === 's') g += W(20, 20, 67, 20) + bulb(76, 20) + W(85, 20, 115, 20) + bulb(124, 20) + W(133, 20, 180, 20);
  else g += W(20, 20, 80, 20) + W(80, 20, 91, 20) + bulb(100, 20) + W(109, 20, 120, 20) + W(120, 20, 180, 20) + W(80, 20, 80, -4) + W(120, 20, 120, -4) + W(80, -4, 91, -4) + bulb(100, -4) + W(109, -4, 120, -4);
  // bottom wire with the batteries
  if (c.b === 1) g += W(20, 110, 78, 110) + bat(78, 110) + W(85, 110, 180, 110);
  else if (c.bs === 's') g += W(20, 110, 62, 110) + bat(62, 110) + W(69, 110, 88, 110) + bat(88, 110) + W(95, 110, 180, 110);
  else g += W(20, 110, 64, 110) + W(64, 110, 78, 110) + bat(78, 110) + W(85, 110, 104, 110) + W(104, 110, 180, 110) + W(64, 110, 64, 132) + W(104, 110, 104, 132) + W(64, 132, 78, 132) + bat(78, 132) + W(85, 132, 104, 132);
  return `<svg viewBox="0 -20 200 170" width="170" height="145" aria-hidden="true">${g}<text x="6" y="0" font-size="16" font-weight="800" fill="#c0392b">${label || ''}</text></svg>`;
}
// brightness of each bulb ∝ current through it (ideal batteries and identical bulbs)
const bulbI = (c) => { const V = c.b === 2 && c.bs === 's' ? 2 : 1; return c.m === 1 ? V : c.ms === 's' ? V / 2 : V; };
const CIRC_TXT = (c) => tx(`電池${c.b}こ${c.b === 2 ? (c.bs === 's' ? '(直列)' : '(へい列)') : ''}・豆電球${c.m}こ${c.m === 2 ? (c.ms === 's' ? '(直列)' : '(へい列)') : ''}`, `${c.b} batter${c.b === 2 ? 'ies' + (c.bs === 's' ? ' in series' : ' in parallel') : 'y'}, ${c.m} bulb${c.m === 2 ? 's' + (c.ms === 's' ? ' in series' : ' in parallel') : ''}`, `${c.b}节电池${c.b === 2 ? (c.bs === 's' ? '（串联）' : '（并联）') : ''}、${c.m}个灯泡${c.m === 2 ? (c.ms === 's' ? '（串联）' : '（并联）') : ''}`);
const CIRCUITS = [{ b: 1, m: 1 }, { b: 2, bs: 's', m: 1 }, { b: 2, bs: 'p', m: 1 }, { b: 1, m: 2, ms: 's' }, { b: 1, m: 2, ms: 'p' }, { b: 2, bs: 's', m: 2, ms: 's' }, { b: 2, bs: 's', m: 2, ms: 'p' }];

// ---- generated families ----
const SGEN = {
  sunrise: ([s, setSide]) => { const L = setSide ? SCI.SET : SCI.RISE, opts = [L[0], L[1], L[3]], right = opts[[0, 1, 0, 2][s]];   // equinoxes share the 'due east/west' option
    return { kind: 'choice', skill: 'know', stars: s === 0 || s === 2 ? 1 : 2, story: tx(`${SCI.SEASON[s].ja}の日、太陽はどこから${setSide ? 'しずむ' : 'のぼる'}?`, `On the ${SCI.SEASON[s].en}, where does the sun ${setSide ? 'set' : 'rise'}?`, `${SCI.SEASON[s].zh}这天，太阳从哪里${setSide ? '落下' : '升起'}？`), fig: () => domeSVG(s, null),
      options: opts.map((o) => ({ t: o, ok: o === right, fb: tx('夏は北よりから のぼって北よりにしずみ、冬は南よりから のぼって南よりにしずむ。春分・秋分は真東から真西。', 'Summer: rises and sets north of east/west; winter: south of them; equinoxes: due east to due west.', '夏天从偏北升起、偏北落下；冬天偏南；春分秋分正东升正西落。'), tag: 'sci_know' })),
      why: tx(`${SCI.SEASON[s].ja}は${(setSide ? SCI.SET : SCI.RISE)[s].ja}。`, `${SCI.SEASON[s].en}: ${(setSide ? SCI.SET : SCI.RISE)[s].en}.`, `${SCI.SEASON[s].zh}：${(setSide ? SCI.SET : SCI.RISE)[s].zh}。`) }; },
  // shadow points away from the sun: morning sun in the east → shadow west; noon south → north; afternoon west → east
  shadow: ([h]) => { const d = { 8: 6, 9: 6, 12: 0, 15: 2, 16: 2 }[h], sunD = (d + 4) % 8, opts = [0, 2, 4, 6];
    return { kind: 'choice', skill: 'predict', stars: 2, story: tx(`よく晴れた日の${h}時ごろ、地面に立てたぼうのかげは どの方角にのびる?`, `On a sunny day around ${h} o’clock, which way does a stick’s shadow point?`, `晴天${h}点左右，立在地上的棒子影子朝哪个方向？`), fig: () => domeSVG(0, h),
      options: opts.map((k) => ({ t: SCI.DIR8[k], ok: k === d, fb: k === sunD ? tx('それは太陽のある方角。かげは太陽と反対がわにできるよ。', 'That’s where the sun is. Shadows fall on the opposite side.', '那是太阳所在的方向，影子在太阳的反方向。') : null, tag: 'sci_predict' })),
      hints: [tx('まず、その時こくに太陽がどの方角にあるか考えよう。', 'First think where the sun is at that time.', '先想想那时太阳在哪个方向。')],
      why: tx(`${h}時ごろ太陽は${SCI.DIR8[sunD].ja}の空 → かげは反対の${SCI.DIR8[d].ja}へ。`, `Around ${h} the sun is in the ${SCI.DIR8[sunD].en} → the shadow points ${SCI.DIR8[d].en}.`, `${h}点左右太阳在${SCI.DIR8[sunD].zh}方 → 影子朝相反的${SCI.DIR8[d].zh}。`) }; },
  // north sky: stars turn counter-clockwise around Polaris, 15° per hour
  starAngle: ([hrs]) => ({ kind: 'num', skill: 'calc', stars: 2, unit: SCT.deg, story: tx(`北の空の星は、北極星を中心に1時間で15度 回る。${hrs}時間では何度 回る?`, `Stars in the north sky turn 15° an hour around Polaris. How many degrees in ${hrs} hours?`, `北边天空的星星绕北极星每小时转15度。${hrs}小时转多少度？`), ans: 15 * hrs,
    mis: [M(hrs * 30, 'sci_calc', tx('1時間で15度だよ(1日24時間で360度)。', 'It’s 15° per hour (360° in 24 hours).', '每小时15度（24小时转360度）。'))].filter((m) => m.v !== 15 * hrs),
    why: tx(`15 × ${hrs} = ${15 * hrs}度。24時間でちょうど1回転(360度)。`, `15 × ${hrs} = ${15 * hrs}°. One full turn (360°) in 24 hours.`, `15 × ${hrs} = ${15 * hrs}度。24小时正好转一圈（360度）。`) }),
  starWhere: ([hrs]) => { const marks = [0, 15 * hrs, -15 * hrs, 180], R = LEARN.tools(LEARN.rngOf('sw' + hrs), 1), order = R.shuffle([0, 1, 2, 3]), labels = [tx('ア', 'A', 'A'), tx('イ', 'B', 'B'), tx('ウ', 'C', 'C'), tx('エ', 'D', 'D')];
    // the dipper starts at angle 0 (labelled), after hrs hours it is at +15·hrs (counter-clockwise)
    const at = order.map((i) => marks[i]), right = order.indexOf(1);
    return { kind: 'choice', skill: 'predict', stars: 3, story: tx(`午後8時に北の空で北斗七星を見た(いちばん上の位置)。${hrs}時間後には ア〜エ のどこにある?`, `At 8 pm you saw the Big Dipper at the top. Where will it be ${hrs} hours later (A–D)?`, `晚上8点在北边天空看到北斗七星（在最上方）。${hrs}小时后它在A〜D哪里？`),
      fig: () => northSkySVG(0, at), options: [0, 1, 2, 3].map((k) => ({ t: labels[k], ok: k === right, fb: order[k] === 2 ? tx('北の空の星は 時計の針と反対向き(左回り)に回るよ。', 'North-sky stars turn anticlockwise.', '北边天空的星星逆时针转。') : null, tag: 'sci_predict' })),
      why: tx(`北の空は北極星を中心に左回り(時計と反対)。${hrs}時間で${15 * hrs}度。`, `The north sky turns anticlockwise around Polaris: ${15 * hrs}° in ${hrs} hours.`, `北边天空绕北极星逆时针转，${hrs}小时转${15 * hrs}度。`) }; },
  moonDir: ([k, h]) => { const m = SCI.MOON[k], d = m.at[h];
    return { kind: 'choice', skill: 'predict', stars: 2, story: tx(`${SCI.TIME[h].ja}、${m.n.ja}はどの方角の空に見える?`, `At ${SCI.TIME[h].en}, in which part of the sky is the ${m.n.en}?`, `${SCI.TIME[h].zh}，${m.n.zh}在哪个方向的天空？`), fig: () => `<div style="display:flex;justify-content:center">${moonSVG(k, 90)}</div>`,
      options: [2, 4, 6].map((x) => ({ t: SCI.DIR8[x], ok: x === d, fb: tx('月も太陽と同じように、東からのぼって南を通り、西へしずむ。', 'Like the sun, the moon rises in the east, passes south and sets in the west.', '月亮和太阳一样，从东方升起，经过南方，在西方落下。'), tag: 'sci_predict' })), why: m.why }; },
  moonOrder: ([start]) => { const seq = ['crescent', 'first', 'full', 'last'], k = seq[start % 3], next = seq[start % 3 + 1];
    return { kind: 'choice', skill: 'know', stars: 1, story: tx(`${SCI.MOON[k].n.ja}のあと、月はどんな形になっていく?`, `After the ${SCI.MOON[k].n.en}, which shape comes next?`, `${SCI.MOON[k].n.zh}之后，月亮会变成什么形状？`),
      options: seq.filter((x) => x !== k).map((x) => ({ t: tx(`${moonSVG(x, 44)} ${SCI.MOON[x].n.ja}`, `${moonSVG(x, 44)} ${SCI.MOON[x].n.en}`, `${moonSVG(x, 44)} ${SCI.MOON[x].n.zh}`), ok: x === next, fb: tx('三日月 → 上弦の月 → 満月 → 下弦の月 → 新月 の順。約1か月でもとにもどる。', 'Crescent → first quarter → full → last quarter → new moon, about a month in all.', '月牙 → 上弦月 → 满月 → 下弦月 → 新月，约一个月一循环。'), tag: 'sci_know' })),
      why: tx('三日月 → 上弦の月 → 満月 → 下弦の月 → 新月(約30日で1周)。', 'Crescent → first quarter → full → last quarter → new (about 30 days).', '月牙 → 上弦 → 满月 → 下弦 → 新月（约30天一圈）。') }; },
  circuit: ([i, j]) => { const A = CIRCUITS[i], B = CIRCUITS[j], a = bulbI(A), b = bulbI(B), right = a > b ? 0 : a < b ? 1 : 2;
    return { kind: 'choice', skill: 'reason', stars: 3, story: tx('アとイの豆電球1こずつの明るさをくらべよう(電池も豆電球も同じもの)。', 'Compare how bright ONE bulb is in A and in B (identical batteries and bulbs).', '比较A和B中每个灯泡的亮度（电池和灯泡都相同）。'),
      fig: () => `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><div style="text-align:center">${circuitSVG(A, LANGTXT('ア', 'A', 'A'))}<div class="muted" style="font-size:.8rem">${T(CIRC_TXT(A))}</div></div><div style="text-align:center">${circuitSVG(B, LANGTXT('イ', 'B', 'B'))}<div class="muted" style="font-size:.8rem">${T(CIRC_TXT(B))}</div></div></div>`,
      options: [SCT.brighterA, SCT.brighterB, SCT.same].map((t, k) => ({ t, ok: k === right, fb: tx('電池を直列にすると明るく、へい列にすると明るさは1こと同じ。豆電球を直列にすると暗く、へい列にすると1こと同じ。', 'Batteries in series → brighter; in parallel → same as one. Bulbs in series → dimmer; in parallel → same as one.', '电池串联更亮，并联和一节一样；灯泡串联变暗，并联和一个一样。'), tag: 'sci_reason' })),
      hints: [tx('電池のつなぎ方と、豆電球のつなぎ方を別々に考えよう。', 'Think about the batteries and the bulbs separately.', '分别想电池和灯泡的连接方式。')],
      why: tx(`ア: ${CIRC_TXT(A).ja}、イ: ${CIRC_TXT(B).ja}。電池の直列は明るく、豆電球の直列は暗くなる。`, `A: ${CIRC_TXT(A).en}; B: ${CIRC_TXT(B).en}. Series batteries brighten; series bulbs dim.`, `A：${CIRC_TXT(A).zh}；B：${CIRC_TXT(B).zh}。电池串联变亮，灯泡串联变暗。`) }; },
  magnet: ([seed]) => { const R = LEARN.tools(LEARN.rngOf('mg' + seed), 1), yes = R.shuffle(SCI.MAG.filter((x) => x[1])).slice(0, 3), no = R.shuffle(SCI.MAG.filter((x) => !x[1])).slice(0, 3), items = R.shuffle([...yes, ...no]);
    return { kind: 'custom', skill: 'know', stars: 1, story: tx('磁石に つくもの と つかないもの に分けよう。', 'Sort into: sticks to a magnet / does not.', '分成：能被磁铁吸住的 / 不能的。'), ans: 'bins',
      mount: binsTask([tx('つく', 'sticks', '能吸住'), tx('つかない', 'doesn’t stick', '吸不住')], items.map(([t, y]) => ({ t, bin: y ? 0 : 1 })), 'sci_know'),
      why: tx('磁石につくのは鉄。アルミニウムや銅(10円玉)、ガラス、プラスチック、木、紙はつかない。', 'Magnets attract iron. Aluminium, copper (10-yen), glass, plastic, wood and paper don’t stick.', '磁铁吸铁。铝、铜（10日元）、玻璃、塑料、木头、纸都吸不住。') }; },
  peak: ([what]) => { const L = [[tx('太陽の高さ', 'the sun’s height', '太阳高度'), 12], [tx('地温', 'ground temperature', '地温'), 13], [tx('気温', 'air temperature', '气温'), 14]], [n, h] = L[what];
    return { kind: 'choice', skill: 'reason', stars: what ? 2 : 1, story: tx(`ある よく晴れた日の記録では、${n.ja}がいちばん高くなったのは何時ごろ?`, `On one sunny day’s record, at about what time was ${n.en} highest?`, `某个晴天的记录中，${n.zh}大约几点最高？`),
      options: [12, 13, 14].map((x) => ({ t: tx(`${x}時ごろ`, `about ${x}:00`, `${x}点左右`), ok: x === h, fb: tx('太陽(12時ごろ)→ 地面があたたまる(13時ごろ)→ 空気があたたまる(14時ごろ) の順に、少しずつおくれる。', 'Sun (≈12) → the ground warms (≈13) → the air warms (≈14): each a little later.', '太阳（约12点）→ 地面变暖（约13点）→ 空气变暖（约14点），依次稍晚。'), tag: 'sci_reason' })),
      why: tx('(ある晴れた日の例) 地面は、太陽からもらう熱が にげていく熱より多いあいだは あたたまり続ける。正午をすぎても太陽はまだ強いので、地温の最高は少しおくれる。空気は地面からあたためられるので、気温の最高はさらにおくれる。何時になるかは天気や場所でかわる。', '(An example sunny day.) The ground keeps warming as long as it gets more heat from the sun than it loses. After noon the sun is still strong, so the ground peaks a little later; the air is warmed by the ground, so it peaks later still. The exact times depend on weather and place.', '（某个晴天的例子）只要地面从太阳得到的热比散失的多，就会继续升温。过了正午太阳仍很强，所以地温最高点稍晚；空气由地面加热，所以气温最高点更晚。具体几点因天气和地点而异。') }; },
};
VARY.sciRise = (R) => [R.int(0, 3), R.int(0, 1)];
VARY.sciShadow = (R) => [R.pick([8, 9, 12, 15, 16])];
VARY.sciStarAngle = (R) => [R.lv([1, 2], [1, 4], [2, 6])];
VARY.sciStarWhere = (R) => [R.pick([2, 3, 4])];
VARY.sciMoonDir = (R) => { const k = R.pick(Object.keys(SCI.MOON)), hs = Object.keys(SCI.MOON[k].at); return [k, +R.pick(hs)]; };
VARY.sciMoonOrder = (R) => [R.int(0, 2)];
VARY.sciCircuit = (R) => { for (let t = 0; t < 30; t++) { const i = R.int(0, CIRCUITS.length - 1), j = R.int(0, CIRCUITS.length - 1); if (i !== j) return [i, j]; } return [0, 1]; };
VARY.sciMagnet = (R) => [R.int(1, 9999)];
VARY.sciPeak = (R) => [R.int(0, 2)];

const SRULES = () => ({ all: typeof SCIENCE_RULES !== 'undefined' ? SCIENCE_RULES : null, byUnit: typeof SCIENCE_RULES_BY_UNIT !== 'undefined' ? SCIENCE_RULES_BY_UNIT : {} });
function sciBankProblem(it, unit) {
  const p = bankProblem(it, unit, SRULES(), 'sci_'); const make0 = p.make; p.make = (ps) => { const q = make0(ps); for (const o of q.options || []) o.tag = 'sci_' + it.skill; q.mis = (q.mis || []).map((m) => ({ ...m, tag: 'sci_' + it.skill })); return q; }; return p;
}
const SFAM_RULES = { sunrise: ['Q1'], shadow: ['Q1', 'Q9'], starAngle: ['Q1'], starWhere: ['Q1'], moonDir: ['Q2', 'Q1'], moonOrder: ['Q2'], circuit: ['Q6'], magnet: ['Q7'], peak: ['Q4', 'Q3'] };
const SFAM = (id, gen, set) => ({ id, sets: [set], make: (ps) => { const q = SGEN[gen](ps), R = SRULES(); q.why = withRule(q.why, SFAM_RULES[gen] || [], R.all); return q; } });
const SUNIT = (u) => ((typeof SCIENCE_BANK !== 'undefined' && SCIENCE_BANK.units[u]) || []).map((it) => sciBankProblem(it, u));
const SRL = (u) => RULES_LESSON([u], typeof SCIENCE_RULES !== 'undefined' ? SCIENCE_RULES : {}, typeof SCIENCE_RULES_BY_UNIT !== 'undefined' ? SCIENCE_RULES_BY_UNIT : {});

const SCL = {
  earthSun: { h: () => `<h3>${LANGTXT('🌏 なぜ? 地球は かたむいたまま回っている', '🌏 Why? The Earth spins on a tilted axis', '🌏 为什么？地球斜着自转')}</h3><p>${LANGTXT('太陽が東からのぼるのは、地球が<b>西から東へ</b>1日1回まわっているから。季節で通り道が変わるのは、地球の じくが<b>23.4°かたむいたまま</b>太陽のまわりを回るから。夏は日本が太陽の方へかたむき、太陽が高く・昼が長い。', 'The sun rises in the east because the Earth spins <b>west to east</b> once a day. The path changes with the seasons because the axis stays <b>tilted 23.4°</b> as we go round the sun: in summer Japan leans toward the sun — high sun, long days.', '太阳东升，是因为地球每天<b>自西向东</b>转一圈。路径随季节变化，是因为地轴<b>倾斜23.4°</b>绕太阳公转：夏天日本倾向太阳——太阳高、白天长。')}</p><div class="e3host"></div>`, m: (el) => earth3D($('.e3host', el), 'sun') },
  earthMoon: { h: () => `<h3>${LANGTXT('🌙 なぜ? 月は太陽に照らされたボール', '🌙 Why? The moon is a ball lit by the sun', '🌙 为什么？月亮是被太阳照亮的球')}</h3><p>${LANGTXT('月はいつも半分だけ太陽に照らされている。月が地球のまわりを回ると、照らされた半分の「見える量」が変わる → 満ち欠け。太陽と反対がわにあるとき満月で、太陽がしずむころ東からのぼる。', 'Half of the moon is always lit by the sun. As it circles the Earth, how much of the lit half we see changes → the phases. Opposite the sun it is full, rising in the east as the sun sets.', '月亮总有一半被太阳照亮。它绕地球转时，我们看到的亮面多少在变 → 月相。在太阳对面时是满月，日落时从东方升起。')}</p><div class="e3host"></div>`, m: (el) => earth3D($('.e3host', el), 'moon') },
  sun: { h: () => `<h3>${LANGTXT('太陽の通り道', 'The sun’s path', '太阳的路径')}</h3><p>${LANGTXT('季節と時こくを動かしてみよう。夏は高く長く、冬は低く短い通り道。かげは太陽と反対がわにできる。', 'Move the season and the time. Summer: high and long path; winter: low and short. Shadows fall opposite the sun.', '拖动季节和时刻看看。夏天路径高而长，冬天低而短。影子在太阳的反方向。')}</p>
    <div class="interact"><div class="chipbar" id="ss">${SCI.SEASON.map((s, i) => `<button class="chip" data-ss="${i}" type="button">${T(s)}</button>`).join('')}</div><input id="sh" type="range" min="5" max="19" step="0.5" value="12" style="width:min(320px,100%)" aria-label="time"><div id="sdome"></div><div class="disp" id="stime"></div></div>`,
    m: (el) => { let s = 1; const d = () => { const h = +$('#sh', el).value; $('#sdome', el).innerHTML = domeSVG(s, h); $('#stime', el).textContent = `${Math.floor(h)}:${h % 1 ? '30' : '00'}`; $$('[data-ss]', el).forEach((b) => b.classList.toggle('on', +b.dataset.ss === s)); };
      $$('[data-ss]', el).forEach((b) => b.onclick = () => { s = +b.dataset.ss; d(); }); $('#sh', el).oninput = d; d(); } },
  stars: { h: () => `<h3>${LANGTXT('北の空の星の動き', 'Stars in the north sky', '北边天空星星的运动')}</h3><p>${LANGTXT('北の空の星は、北極星を中心に<b>時計の針と反対向き</b>に、1時間に<b>15度</b>ずつ回る。北極星はほとんど動かない。', 'North-sky stars turn <b>anticlockwise</b> around Polaris, <b>15° per hour</b>. Polaris hardly moves.', '北边天空的星星绕北极星<b>逆时针</b>转，每小时<b>15度</b>。北极星几乎不动。')}</p>
    <div class="interact"><input id="kh" type="range" min="0" max="12" value="0" style="width:min(320px,100%)" aria-label="hours"><div id="ksky"></div><div class="disp" id="kt"></div></div>`,
    m: (el) => { const d = () => { const h = +$('#kh', el).value; $('#ksky', el).innerHTML = northSkySVG(15 * h); $('#kt', el).textContent = `+${h}h → ${15 * h}°`; }; $('#kh', el).oninput = d; d(); } },
  moon: { h: () => `<h3>${LANGTXT('月の形と見える時こく', 'Moon shapes and when they are seen', '月相与出现时刻')}</h3><div class="row" style="justify-content:center;gap:14px;flex-wrap:wrap">${Object.entries(SCI.MOON).map(([k, m]) => `<div style="text-align:center;width:120px">${moonSVG(k, 60)}<div><b>${T(m.n)}</b></div><div class="muted" style="font-size:.8rem">${T(m.why)}</div></div>`).join('')}</div>` },
  circuit: { h: () => `<h3>${LANGTXT('電池と豆電球のつなぎ方', 'Connecting batteries and bulbs', '电池和灯泡的连接')}</h3><p>${LANGTXT('電池の<b>直列</b> → 明るい。電池の<b>へい列</b> → 1こと同じ明るさ(長もち)。<br>豆電球の<b>直列</b> → 暗い。豆電球の<b>へい列</b> → 1こと同じ明るさ。', 'Batteries in <b>series</b> → brighter. In <b>parallel</b> → same as one (lasts longer).<br>Bulbs in <b>series</b> → dimmer. In <b>parallel</b> → same as one.', '电池<b>串联</b> → 更亮；<b>并联</b> → 和一节一样（更持久）。<br>灯泡<b>串联</b> → 变暗；<b>并联</b> → 和一个一样。')}</p><div class="row" style="justify-content:center;flex-wrap:wrap">${CIRCUITS.slice(0, 5).map((c) => `<div style="text-align:center">${circuitSVG(c)}<div class="muted" style="font-size:.75rem">${T(CIRC_TXT(c))}</div></div>`).join('')}</div>` },
};

registerWorld({
  id: 'science', x: 8, y: 52, host: 'hotarun', after: null, free: true,
  name: tx('りかの島', 'Science Isle', '理科岛'), level: tx('4年・理科', 'Grade 4 · science', '四年级 · 理科'), lockTxt: tx('いつでも行けるよ', 'Always open', '随时可去'),
  intro: tx('電気・磁石・光・太陽・地温と気温・月・星・川。動かして、くらべて、きまりを見つけよう。', 'Electricity, magnets, light, the sun, ground and air temperature, the moon, stars and rivers. Move things, compare, and find the rules.', '电、磁铁、光、太阳、地温与气温、月亮、星星和河流。动手比较，找出规律。'),
  species: {},
  moves: {
    sciKnow: { ty: tx('知', 'fact', '知'), col: 'var(--tN)', n: tx('用語と事実', 'Terms & facts', '术语与事实'), r: tx('言葉の意味を、図と いっしょにおぼえる', 'Learn each word together with its picture', '把词语和图一起记') },
    sciObserve: { ty: '👀', col: 'var(--tW)', n: tx('図・グラフを読む', 'Reading figures', '读图表'), r: tx('目もり・単位・時こくを先に見る', 'Check scales, units and times first', '先看刻度、单位、时刻') },
    sciReason: { ty: tx('なぜ', 'why', '为何'), col: 'var(--neg)', n: tx('しくみを説明する', 'Explaining causes', '解释原因'), r: tx('「〜だから〜になる」と原因と結果をつなぐ', 'Link cause and result: “because …, so …”', '把原因和结果连起来：“因为……所以……”') },
    sciPredict: { ty: '🔮', col: 'var(--tP)', n: tx('きまりで予想する', 'Predicting with a rule', '用规律预测'), r: tx('見つけたきまりを、ちがう場面に当てはめる', 'Apply the rule you found to a new case', '把发现的规律用到新情境') },
    sciApply: { ty: '🔑', col: 'var(--tC)', n: tx('きまりを使う', 'Using the rule', '运用规律'), r: tx('見たことのない場面でも、きまりから予想する', 'Predict an unseen situation from the rule', '在没见过的情境里用规律预测') },
    sciCalc: { ty: '°', col: 'var(--tC)', n: tx('時こく・角度の計算', 'Times & angles', '时刻与角度计算'), r: tx('1時間に15度、24時間で360度', '15° per hour, 360° in 24 hours', '每小时15度，24小时360度') },
  },
  tags: { sci_know: tx('理科: 用語・事実', 'Science: terms & facts', '理科：术语与事实'), sci_observe: tx('理科: 図・グラフの読み取り', 'Science: reading figures', '理科：读图表'), sci_reason: tx('理科: しくみの説明', 'Science: explaining causes', '理科：解释原因'), sci_predict: tx('理科: きまりで予想', 'Science: predicting with a rule', '理科：用规律预测'), sci_calc: tx('理科: 時こく・角度の計算', 'Science: times & angles', '理科：时刻与角度计算'), sci_apply: tx('理科: きまりを新しい場面に使う', 'Science: using a rule in a new situation', '理科：把规律用到新情境') },
  chapters: [
    { id: 'r7', host: 'hotarun', place: tx('ほたるの電気小屋', 'Firefly Power Shed', '萤火虫电屋'), topic: tx('電池と豆電球のつなぎ方', 'Bulb brightness', '灯泡亮度'), unlock: ['hotarun'], moves: ['sciReason', 'sciPredict'],
      say: [tx('電池と豆電球の つなぎ方で、明るさが変わるよ。', 'How you connect batteries and bulbs changes the brightness.', '电池和灯泡的连接方式会改变亮度。')], lessons: [SRL('circuit'), SCL.circuit], problems: [...SUNIT('circuit'), SFAM('r7c1', 'circuit', [1, 0]), SFAM('r7c2', 'circuit', [3, 4])] },
    { id: 'r9', host: 'tanpopon', place: tx('じしゃくの森', 'Magnet Woods', '磁铁林'), topic: tx('じしゃくの力', 'Magnets', '磁铁'), unlock: ['tanpopon'], moves: ['sciKnow', 'sciPredict'],
      say: [tx('磁石につくのは鉄。N極とS極は引き合い、同じ極はしりぞけ合う。', 'Magnets attract iron. N and S attract; like poles repel.', '磁铁吸铁。N极和S极相吸，同极相斥。')], lessons: [SRL('magnet')], problems: [...SUNIT('magnet'), SFAM('r9m1', 'magnet', [1])] },
    { id: 'r8', host: 'suiren', place: tx('かがみの池', 'Mirror Pond', '镜池'), topic: tx('光のはね返り・集まり方', 'Light, mirrors, lenses', '光、镜子与放大镜'), unlock: ['suiren'], moves: ['sciReason', 'sciObserve'],
      say: [tx('光ははね返ったり、集まったりする。集めるほど明るく、熱くなる。', 'Light bounces and can be gathered: the more you gather, the brighter and hotter.', '光会反射，也能聚集；聚得越多越亮越热。')], lessons: [SRL('light')], problems: [...SUNIT('light')] },
    { id: 'r2', host: 'himawan', place: tx('ひだまりの丘', 'Sunny Hill', '向阳坡'), topic: tx('太陽の動きとかげ', 'The sun & shadows', '太阳运动与影子'), unlock: ['himawan'], moves: ['sciPredict', 'sciKnow'],
      say: [tx('太陽は東からのぼって南を通り西へ。季節で通り道が変わるよ。', 'The sun rises east, passes south, sets west — and its path changes with the seasons.', '太阳东升、过南、西落，路径随季节变化。')], lessons: [SRL('sun'), SCL.earthSun, SCL.sun],
      problems: [...SUNIT('sun'), SFAM('r2s1', 'sunrise', [1, 0]), SFAM('r2s2', 'sunrise', [3, 1]), SFAM('r2h1', 'shadow', [9])] },
    { id: 'r3', host: 'sabo', place: tx('温度計の畑', 'Thermometer Field', '温度计田'), topic: tx('地面と空気のあたたまり方', 'Sun height, ground & air temperature', '太阳高度与地温气温'), unlock: ['sabo'], moves: ['sciReason', 'sciObserve'],
      say: [tx('太陽 → 地面 → 空気 の順にあたたまる。はかり方のきまりも大事。', 'Sun → ground → air warm up in that order. How to measure matters too.', '依次是太阳 → 地面 → 空气变暖。测量方法也很重要。')], lessons: [SRL('warmth')], problems: [...SUNIT('warmth'), SFAM('r3p1', 'peak', [2])] },
    { id: 'r6', host: 'tsukimi', place: tx('お月見の原っぱ', 'Moon-viewing Meadow', '赏月草地'), topic: tx('月の満ち欠け', 'Phases of the moon', '月相变化'), unlock: ['tsukimi'], moves: ['sciPredict', 'sciKnow'],
      say: [tx('月の形と、見える時こく・方角はセットでおぼえよう。', 'Learn each moon shape together with when and where it is seen.', '把月亮的形状和出现的时刻、方向一起记。')], lessons: [SRL('moon'), SCL.earthMoon, SCL.moon], problems: [...SUNIT('moon'), SFAM('r6d1', 'moonDir', ['full', 0]), SFAM('r6o1', 'moonOrder', [0])] },
    { id: 'r4', host: 'chocho', place: tx('星の見える丘', 'Starry Hill', '观星丘'), topic: tx('星の色・明るさ・星座', 'Star colours, brightness, constellations', '星的颜色、亮度、星座'), unlock: ['chocho'], moves: ['sciKnow', 'sciObserve'],
      say: [tx('夜空の星には、色や明るさのちがいがある。星座も見つけよう。', 'Stars differ in colour and brightness. Find the constellations too.', '星星有颜色和亮度的不同，也来找星座吧。')], lessons: [SRL('stars')], problems: [...SUNIT('stars')] },
    { id: 'r5', host: 'fukuron', place: tx('夜空の観測所', 'Night Observatory', '夜空观测所'), topic: tx('星の動き', 'Moving stars', '星星的运动'), unlock: ['fukuron'], moves: ['sciPredict', 'sciCalc'],
      say: [tx('北の空は北極星を中心に左回り、1時間に15度。', 'The north sky turns anticlockwise around Polaris, 15° an hour.', '北边天空绕北极星逆时针转，每小时15度。')], lessons: [SRL('starmove'), SCL.stars], problems: [...SUNIT('starmove'), SFAM('r5a1', 'starAngle', [3]), SFAM('r5w1', 'starWhere', [3])] },
    { id: 'r1', host: 'kokemaru', place: tx('川のほとり', 'Riverside', '河边'), topic: tx('流れる水と地形', 'Running water & land', '流水与地形'), unlock: ['kokemaru'], moves: ['sciReason', 'sciKnow'],
      say: [tx('川の上流・中流・下流で、石や地形がどうちがうか見てみよう。', 'See how stones and land differ upstream, midstream and downstream.', '看看上游、中游、下游的石头和地形有什么不同。')], lessons: [SRL('river')], problems: [...SUNIT('river')] },
  ],
});
const SCI_SKILL = {}; for (const c of WORLDS.find((w) => w.id === 'science').chapters) c.problems.forEach((d) => { try { SCI_SKILL[d.id] = d.make(d.sets[0]).skill; } catch (e) { /* bank not loaded */ } });
Object.assign(VARY, { r2s1: VARY.sciRise, r2s2: VARY.sciRise, r2h1: VARY.sciShadow, r3p1: VARY.sciPeak, r5a1: VARY.sciStarAngle, r5w1: VARY.sciStarWhere, r6d1: VARY.sciMoonDir, r6o1: VARY.sciMoonOrder, r7c1: VARY.sciCircuit, r7c2: VARY.sciCircuit, r9m1: VARY.sciMagnet });
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(SCT), ...SCI.DIR8, ...SCI.SEASON, ...SCI.RISE, ...SCI.SET, ...Object.values(SCI.TIME), ...Object.values(SCI.MOON).flatMap((m) => [m.n, m.why]), ...SCI.MAG.map((m) => m[0])];
window.PARENT_PANELS = [...(window.PARENT_PANELS || []), (H) => {
  const by = {}; for (const [id, sk] of Object.entries(SCI_SKILL)) { const r = S.prob[id]; if (!r || !r.n) continue; const b = by[sk] || (by[sk] = { n: 0, f: 0, k: 0 }); b.n += r.n; b.f += r.first; b.k++; }
  const names = { know: H('用語・事実', 'Terms & facts', '术语与事实'), observe: H('図・グラフを読む', 'Reading figures', '读图表'), reason: H('しくみを説明する', 'Explaining causes', '解释原因'), predict: H('きまりで予想する', 'Predicting with a rule', '用规律预测'), calc: H('時こく・角度の計算', 'Times & angles', '时刻与角度'), apply: H('きまりを新しい場面に使う', 'Using a rule in a new situation', '把规律用到新情境') };
  const rows = Object.keys(names).map((k) => { const b = by[k], pct = b ? Math.round(b.f / b.n * 100) : null; return `<tr><td>${names[k]}</td><td class="num">${b ? b.k : 0}</td><td class="num">${pct === null ? '—' : pct + '%'}</td><td>${pct === null ? '' : pct < 60 ? '⚠️' : pct >= 85 ? '◎' : ''}</td></tr>`; }).join('');
  return `<div class="panel"><h3>🔬 ${H('りかの島: 技能べつ', 'Science isle: by skill', '理科岛：按技能')}</h3><p class="muted">${H('1回目で正解した割合。⚠️ が多い技能が「漏れ」の候補です。', 'First-try rate by skill. ⚠️ marks likely gaps.', '按技能的一次答对率。⚠️ 是可能的漏洞。')}</p><div class="tw"><table class="ptable"><tr><th>${H('技能', 'Skill', '技能')}</th><th>${H('とりくんだ問題', 'Problems', '做过的题')}</th><th>${H('1回目で正解', 'First try', '一次答对')}</th><th></th></tr>${rows}</table></div></div>`;
}];
