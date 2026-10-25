// 白地図の島 (blank-map isle): prefecture outlines, capitals, and the mountains, plains, basins, rivers, peninsulas, bays, lakes and
// islands a 4th grader learns — shown on a real map and asked both ways ("what is this?" / "where is it?"), with new picks each time.
// The prefecture map (svg-japan) is a Mercator projection; fitted on 9 known capes and headlands it reproduces them within 0.23 px.
// Features and coordinates: worlds/data/geo_features.js; tests/verify_map.mjs checks each land point lies inside its own prefecture.
const JGEO = (() => {
  const K = 1123.6, BX = -2422.72, BY = 1005.35, R = Math.PI / 180;
  const proj = (lat, lon) => [K * lon * R + BX, -K * Math.log(Math.tan(Math.PI / 4 + lat * R / 2)) + BY];
  // the map's paths use only relative moveto/lineto (m … z): parse them into rings of absolute points
  function rings(d) {
    const tok = d.match(/[mMzZ]|-?\d*\.?\d+(?:e-?\d+)?/g), out = []; let x = 0, y = 0, sx = 0, sy = 0, cur = null, i = 0, first = false;
    while (i < tok.length) { const t = tok[i];
      if (t === 'm' || t === 'M') { const abs = t === 'M'; i++; x = abs ? +tok[i] : x + +tok[i]; y = abs ? +tok[i + 1] : y + +tok[i + 1]; i += 2; sx = x; sy = y; cur = [[x, y]]; out.push(cur); first = true; continue; }
      if (t === 'z' || t === 'Z') { x = sx; y = sy; i++; continue; }
      x += +tok[i]; y += +tok[i + 1]; i += 2; cur.push([x, y]); }
    return out;
  }
  const RINGS = {}; const ringsOf = (id) => RINGS[id] || (RINGS[id] = rings(JP_PREFS.find((p) => p[0] === id)[3]));
  const inside = (id, [px, py]) => { let c = false; for (const r of ringsOf(id)) for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c; } return c; };
  const bbox = (id) => { let a = [1e9, 1e9, -1e9, -1e9]; for (const r of ringsOf(id)) for (const [x, y] of r) a = [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)]; return a; };
  return { proj, rings, inside, bbox, ringsOf };
})();
const MT = {
  shapeQ: tx('この形の[都道府県|とどうふけん]は どれ?', 'Which prefecture has this shape?', '这个形状是哪个都道府县？'),
  capQ: tx('{p}の 都道府県庁所在地は?', 'What is the capital of {p}?', '{p}的首府是哪里？'),
  dotQ: tx('赤い点の都市は どこ?', 'Which city is at the red dot?', '红点是哪座城市？'),
  markQ: tx('地図の{t}は どれ?', 'Which {t} is marked on the map?', '地图上标出的{t}是哪个？'),
  whereQ: tx('{f}は どの都道府県にある? 地図でタップしよう', 'Where is {f}? Tap a prefecture on the map', '{f}在哪个都道府县？在地图上点一下'),
  near: tx('近くの都道府県: {p}', 'Nearby prefectures: {p}', '附近的都道府县：{p}'),
  isIn: tx('{f}は {p} にある。', '{f} is in {p}.', '{f}位于{p}。'),
  capSame: tx('この県の県庁所在地は、県の名前と ちがう名前の都市だよ。', 'This capital’s name differs from the prefecture’s name.', '这个县的首府名字和县名不一样。'),
};
const TYPE_N = { range: tx('山地・山脈', 'mountain range', '山地/山脉'), mount: tx('山', 'mountain', '山'), plain: tx('平野', 'plain', '平原'), basin: tx('盆地・台地', 'basin/plateau', '盆地/台地'), river: tx('川', 'river', '河'), peninsula: tx('半島・岬', 'peninsula/cape', '半岛/岬角'), bay: tx('湾・海・海峡・海岸', 'bay/sea/strait/coast', '湾/海/海峡/海岸'), lake: tx('湖', 'lake', '湖'), island: tx('島', 'island', '岛'), city: tx('都市', 'city', '城市'), capital: tx('都市', 'city', '城市') };
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(MT), ...Object.values(TYPE_N)];
const GF = () => (typeof GEO_FEATURES !== 'undefined' ? GEO_FEATURES : {});
const fName = (f) => tx(`[${f.n}|${f.r}]`, f.en, f.zh);
const prefT = (id) => tx(prefName(id), prefName(id, 'en'), prefName(id, 'zh'));
const prefsOf = (f) => f.prefs || [f.pref];
const ptsOf = (f) => (f.line ? f.line : [[f.lat, f.lon]]);
// draw a feature on the full map: a pulsing dot for points, a thick line for ranges and rivers
function markSVG(f, color = '#e74c3c') {
  const p = ptsOf(f).map(([la, lo]) => JGEO.proj(la, lo));
  if (p.length > 1) return `<polyline points="${p.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
  return `<circle cx="${p[0][0].toFixed(1)}" cy="${p[0][1].toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="1.5"/><circle cx="${p[0][0].toFixed(1)}" cy="${p[0][1].toFixed(1)}" r="10" fill="none" stroke="${color}" stroke-width="1.5" opacity=".5"/>`;
}
// a regional view around a feature (big enough to show the neighbouring prefectures as landmarks)
function zoomTo(f) { const p = ptsOf(f).map(([la, lo]) => JGEO.proj(la, lo)), xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, s = Math.max(150, (Math.max(...xs) - Math.min(...xs)) * 1.8, (Math.max(...ys) - Math.min(...ys)) * 1.8);
  return [Math.max(0, Math.min(437.33 - s, cx - s / 2)), Math.max(0, Math.min(516.02 - s, cy - s / 2)), s, s]; }
// one prefecture alone, scaled to fit
function prefShapeSVG(id) { const [x0, y0, x1, y1] = JGEO.bbox(id), w = x1 - x0, h = y1 - y0, pad = Math.max(w, h) * 0.08;
  return `<svg viewBox="${(x0 - pad).toFixed(1)} ${(y0 - pad).toFixed(1)} ${(w + 2 * pad).toFixed(1)} ${(h + 2 * pad).toFixed(1)}" style="width:min(70vw,240px);height:min(70vw,240px);background:#cfeefa;border-radius:14px"><path d="${JP_PREFS.find((p) => p[0] === id)[3]}" fill="#ffc94d" stroke="#8a6a3a" stroke-width="${(Math.max(w, h) / 160).toFixed(2)}"/></svg>`; }
// the kind of name (岬 vs 半島, 湾 vs 海峡 …): options of one kind, so the word ending gives nothing away
const KINDS = [['半島', '半島', 'peninsula', '半岛'], ['岬', '岬', 'cape', '岬角'], ['埼', '岬', 'cape', '岬角'], ['海峡', '海峡', 'strait', '海峡'], ['海岸', '海岸', 'coast', '海岸'], ['湾', '湾', 'bay', '湾'], ['灘', '海', 'sea', '海'], ['海', '海', 'sea', '海'],
  ['山脈', '山地・山脈', 'mountain range', '山地/山脉'], ['山地', '山地・山脈', 'mountain range', '山地/山脉'], ['高地', '山地・山脈', 'mountain range', '山地/山脉'], ['盆地', '盆地', 'basin', '盆地'], ['台地', '台地', 'plateau', '台地'], ['諸島', '島', 'island', '岛'], ['島', '島', 'island', '岛']];
const kindOf = (f) => { const k = KINDS.find(([suf]) => f.n.endsWith(suf)); return k ? k[1] : null; };
const kindN = (f) => { const k = KINDS.find(([suf]) => f.n.endsWith(suf)); return k ? tx(k[1], k[2], k[3]) : null; };
// distractors: same kind of name when there are enough, nearest first (so the choice needs real knowledge, not elimination by distance)
function nearest(list, f, n, seed) {
  const [a, b] = ptsOf(f)[0], d = (g) => { const [c, e] = ptsOf(g)[0]; return (a - c) ** 2 + (b - e) ** 2; };
  const k = kindOf(f), same = list.filter((g) => g.n !== f.n && kindOf(g) === k), base = k && same.length >= n ? same : list.filter((g) => g.n !== f.n);
  const R = LEARN.tools(LEARN.rngOf(seed), 1); return R.shuffle(base.sort((x, y) => d(x) - d(y)).slice(0, n + 2)).slice(0, n);
}
const sameKind = (list, f, n) => { const k = kindOf(f); return !!k && list.filter((g) => g.n !== f.n && kindOf(g) === k).length >= n; };
// the mechanism behind a landform or a city (a sentence, not just the rule's title)
const MAP_WHY = {
  plain: tx('川が山から運んだ土がつもって平らになった所。平らで水が得やすく、行き来もしやすいので、田や町がつくられ人が集まる。', 'Rivers dropped the soil they carried from the mountains and built flat land. Flat, with water and easy travel, it draws rice fields, towns and people.', '河流把山上带来的泥沙堆积成平地。地势平、取水方便、交通便利，于是有了稻田、城镇，人也聚集过来。'),
  river: tx('山にふった雨や雪どけ水が集まって海へ流れる。流れながら山をけずり、運んだ土で下流に平野をつくる。', 'Rain and snowmelt gather in the mountains and flow to the sea, cutting the mountains and building plains downstream with the soil.', '山上的雨水和融雪汇集流向大海，一路冲刷山体，把泥沙带到下游形成平原。'),
  basin: tx('まわりを山に囲まれた、低く平らな土地。海から遠いほど一日や一年の気温の差が大きくなりやすい。まわりの山から出た川がつくる[扇状地|せんじょうち]は水はけがよく、日当たりや気温が合う所では くだもの作りがさかん。', 'Low, flat land ringed by mountains. Far from the sea, temperatures tend to swing more. The fans that rivers build at the edge drain well; where sun and temperature suit, fruit growing thrives.', '被群山环绕的低平土地。离海越远，气温变化往往越大。周围山上流出的河流形成的冲积扇排水好，日照和气温合适的地方果树种植兴盛。'),
  plateau: tx('まわりより一段高く、上が平らな土地。火山灰などがつもってできた台地は水がしみこみやすく、田より畑や牧場に使われることが多い。', 'Land standing a step higher than its surroundings with a flat top. Plateaus built from volcanic ash soak up water quickly, so they are used more for fields and pasture than for rice.', '比周围高出一截、顶部平坦的土地。由火山灰等堆积成的台地渗水快，多用作旱田和牧场而不是水田。'),
  city: tx('平野にあって、海や川・鉄道で行き来しやすい所に、仕事と人が集まって大きな都市になった。', 'On a plain, where sea, river and rail make travel easy, jobs and people gathered and a big city grew.', '位于平原、靠海靠河或铁路交通便利的地方，工作和人聚集起来，形成了大城市。'),
};
const MGEN = {
  shape: ([id, seed]) => { const reg = SOC.REGIONS.find((r) => r[2].includes(id)), pool = (reg ? reg[2] : []).filter((x) => x !== id), R = LEARN.tools(LEARN.rngOf('sh' + seed), 1);
    const others = R.shuffle([...pool, ...R.shuffle(Array.from({ length: 47 }, (_, i) => i + 1).filter((x) => x !== id && !pool.includes(x)))]).slice(0, 3), opts = R.shuffle([id, ...others]);
    return { kind: 'choice', skill: 'map', stars: 2, flat: true, story: MT.shapeQ, fig: () => `<div style="display:flex;justify-content:center">${prefShapeSVG(id)}</div>`,
      options: opts.map((x) => ({ t: prefT(x), ok: x === id, fb: x === id ? null : (() => { const sv = prefShapeSVG(x).replace(/min\(70vw,240px\)/g, '90px'); return tx(`${prefName(x)}は こんな形: ${sv}`, `${prefName(x, 'en')} looks like this: ${sv}`, `${prefName(x, 'zh')}是这个形状：${sv}`); })(), tag: 'soc_map' })),
      hints: [tx('海に面しているか、となりの県との形、半島や湖を手がかりにしよう。', 'Use the coastline, peninsulas or lakes as clues.', '看海岸线、半岛、湖泊作线索。')], why: tx(`これは ${prefName(id)}。`, `This is ${prefName(id, 'en')}.`, `这是${prefName(id, 'zh')}。`) }; },
  capital: ([i, seed]) => { const L = GF().capital || [], f = L[i % L.length], others = nearest(L, f, 3, 'c' + seed), opts = LEARN.tools(LEARN.rngOf('co' + seed), 1).shuffle([f, ...others]), same = f.n.replace(/市$/, '') === prefName(f.pref).replace(/[都道府県]$/, '');
    return { kind: 'choice', skill: 'know', stars: same ? 1 : 2, flat: true, story: tx(`${prefName(f.pref)}の [都道府県庁所在地|とどうふけんちょうしょざいち]は?`, `What is the capital of ${prefName(f.pref, 'en')}?`, `${prefName(f.pref, 'zh')}的首府是哪里？`), fig: () => jpMap({ fill: { [f.pref]: '#ffc94d' } }),
      options: opts.map((g) => ({ t: fName(g), ok: g === f, fb: g === f ? null : tx(`${g.n}は ${prefName(g.pref)}の県庁所在地。`, `${g.en} is the capital of ${prefName(g.pref, 'en')}.`, `${g.zh}是${prefName(g.pref, 'zh')}的首府。`), tag: 'soc_know' })),
      hints: same ? [] : [MT.capSame], why: tx(`${prefName(f.pref)}の県庁所在地は ${f.n}。`, `The capital of ${prefName(f.pref, 'en')} is ${f.en}.`, `${prefName(f.pref, 'zh')}的首府是${f.zh}。`) }; },
  mark: ([type, i, seed]) => { const L = GF()[type] || [], f = L[i % L.length], others = nearest(L, f, 3, 'm' + seed), opts = LEARN.tools(LEARN.rngOf('mo' + seed), 1).shuffle([f, ...others]);
    const K = sameKind(L, f, 3) ? kindN(f) : TYPE_N[type];
    return { kind: 'choice', skill: 'map', stars: 2, flat: true, story: tx(`赤いしるしで示した${K.ja}は どれ?`, `Which ${K.en} is marked in red?`, `红色标记的${K.zh}是哪个？`), fig: () => jpMap({ extra: markSVG(f), view: zoomTo(f) }),
      options: opts.map((g) => ({ t: fName(g), ok: g === f, fb: g === f ? null : tx(`${g.n}は ${prefsOf(g).map((x) => prefName(x)).join('・')}の あたり。`, `${g.en} is around ${prefsOf(g).map((x) => prefName(x, 'en')).join(', ')}.`, `${g.zh}在${prefsOf(g).map((x) => prefName(x, 'zh')).join('、')}一带。`), tag: 'soc_map' })),
      hints: [tx(`${TYPE_N[type].ja}のある都道府県を思いうかべよう。`, `Think which prefecture it is in.`, `想想它在哪个都道府县。`)], why: tx(`${f.n}(${prefsOf(f).map((x) => prefName(x)).join('・')})。`, `${f.en} (${prefsOf(f).map((x) => prefName(x, 'en')).join(', ')}).`, `${f.zh}（${prefsOf(f).map((x) => prefName(x, 'zh')).join('、')}）。`) }; },
  where: ([type, i]) => { const L = GF()[type] || [], f = L[i % L.length], names = prefsOf(f).map((x) => prefName(x));
    const verb = type === 'river' ? ['が流れる', 'flows through', '流经的'] : type === 'bay' ? ['に面している', 'faces', '濒临的'] : ['がある', 'has', '所在的'], many = names.length > 1;
    return { kind: 'custom', skill: 'map', stars: 2, flat: true, ans: names, story: tx(`[${f.n}|${f.r}]${verb[0]}[都道府県|とどうふけん]を、${many ? '一つ' : ''}タップしよう。`, `Tap ${many ? 'one prefecture that' : 'the prefecture that'} ${verb[1]} ${f.en}.`, `点一下${f.zh}${verb[2]}${many ? '一个' : ''}都道府县。`), mount: mapTask(names, 'any'),
      hints: [tx(`${TYPE_N[type].ja}だよ。どの地方にあるかから考えよう。`, `It’s a ${TYPE_N[type].en}; start from the region.`, `它是${TYPE_N[type].zh}，先想在哪个地方。`)], why: tx(`${f.n}は ${names.join('・')} にある。`, `${f.en} is in ${prefsOf(f).map((x) => prefName(x, 'en')).join(', ')}.`, `${f.zh}位于${prefsOf(f).map((x) => prefName(x, 'zh')).join('、')}。`) }; },
};
// geography 'why' for landforms (rules from the social isle): rivers make plains, people gather on plains near rivers and the sea
// a 台地 is not made by water like a basin's fans are: its own sentence and no water rule
const MAP_RULES = { plain: ['R7', 'R2'], basin: ['R1'], river: ['R7'], city: ['R2'] };
const featOf = (ps) => { const L = GF()[ps[0]]; return Array.isArray(L) && typeof ps[1] === 'number' ? L[ps[1] % L.length] : null; };
const MFAM = (id, gen, set) => ({ id, sets: [set], make: (ps) => { const q = MGEN[gen](ps), f = featOf(ps); let t = ps[0]; if (t === 'basin' && f && f.n.endsWith('台地')) t = 'plateau';
  if (MAP_WHY[t] && q.why) q.why = tx(`${q.why.ja}<br>💡 ${MAP_WHY[t].ja}`, `${q.why.en}<br>💡 ${MAP_WHY[t].en}`, `${q.why.zh}<br>💡 ${MAP_WHY[t].zh}`);
  if (MAP_RULES[t]) q.why = withRule(q.why, MAP_RULES[t]); return q; } });
VARY.mapShape = (R) => [R.int(1, 47), R.int(1, 9999)];
const vType = (type) => (R) => { const L = GF()[type] || []; return L.length ? [type, R.int(0, L.length - 1), R.int(1, 9999)] : null; };
const vWhere = (type) => (R) => { const L = GF()[type] || []; return L.length ? [type, R.int(0, L.length - 1)] : null; };
VARY.mapCapital = (R) => { const L = GF().capital || []; return L.length ? [R.int(0, L.length - 1), R.int(1, 9999)] : null; };
const MAP_CH = [
  ['m1', 'nami', tx('都道府県の港', 'Prefecture Port', '都道府县港'), tx('形と県庁所在地', 'Shapes & capitals', '形状与首府'), ['shape', 'capital']],
  ['m2', 'tsuno', tx('山の見はらし台', 'Mountain Lookout', '山岳瞭望台'), tx('山地・山脈・山', 'Ranges & mountains', '山地、山脉、山'), ['range', 'mount']],
  ['m3', 'kibi', tx('平野と盆地の村', 'Plains & Basins Village', '平原盆地村'), tx('平野・盆地・台地', 'Plains, basins, plateaus', '平原、盆地、台地'), ['plain', 'basin']],
  ['m4', 'kokemaru', tx('川くだり', 'River Trip', '漂流'), tx('おもな川', 'Main rivers', '主要河流'), ['river']],
  ['m5', 'umiushi', tx('みさきの灯台', 'Cape Lighthouse', '岬角灯塔'), tx('半島・岬・湾・海峡', 'Peninsulas, capes, bays, straits', '半岛、岬角、海湾、海峡'), ['peninsula', 'bay']],
  ['m6', 'suiren', tx('湖と島めぐり', 'Lakes & Islands', '湖泊与岛屿'), tx('湖と島', 'Lakes & islands', '湖泊与岛屿'), ['lake', 'island']],
  ['m7', 'shimaena', tx('大都市の駅', 'Big-City Station', '大城市车站'), tx('大都市', 'Big cities', '大城市'), ['city']],
];
const MAP_LESSON = { h: () => `<h3>${LANGTXT('🔑 地形と町の「しくみ」', '🔑 Why the land and towns are where they are', '🔑 地形和城镇的“规律”')}</h3><p>${LANGTXT('川は山をけずって土を運び、山から出た所に[扇状地|せんじょうち]、下流に広い平野をつくる。平らで水があり、海や川で行き来しやすい平野には、人が集まって大きな都市ができる。山に囲まれた[盆地|ぼんち]では、海から遠いほど気温の変化が大きくなりやすい(雨や雪の量は、風の向きや山の位置でちがう)。盆地のふちの扇状地は水はけがよく、日当たりや気温が合う所ではくだもの作りがさかん。名前を覚えるときは「なぜそこにあるか」もいっしょに考えよう。この地図では おもな地形を学ぶよ。沖縄など、一部の地域の地形はまだ出てこない。', 'Rivers carry soil from the mountains, building fans where they leave the hills and wide plains downstream. Flat plains with water and easy transport by sea and river attract people, so big cities grow there. In basins ringed by mountains, far from the sea, temperatures tend to swing more (rain and snow depend on winds and where the mountains are). The fans at a basin’s edge drain well; where sun and temperature suit, fruit growing thrives. When you learn a name, ask why it is there. This map covers the main landforms; some areas such as Okinawa are not included yet.', '河流把山上的泥沙带下来，出山处形成冲积扇，下游形成宽阔平原。平坦、有水、靠海靠河交通方便的平原吸引人聚集，形成大城市。被山围住的盆地离海远，气温变化往往更大（雨雪多少取决于风向和山的位置）。盆地边缘的冲积扇排水好，日照和气温合适的地方果树种植兴盛。记名字时，也想想它为什么在那里。这张地图学的是主要地形，冲绳等部分地区暂时还没有。')}</p>` };
registerWorld({
  id: 'mapisle', x: 92, y: 52, host: 'nami', after: null, free: true,
  name: tx('白地図の島', 'Blank-Map Isle', '空白地图岛'), level: tx('4年・地図', 'Grade 4 · maps', '四年级 · 地图'), lockTxt: tx('いつでも行けるよ', 'Always open', '随时可去'),
  intro: tx('白地図に、都道府県・山・川・平野・湖・島をのせていこう。形を見て名前を当てたり、名前から場所をタップしたり。', 'Fill the blank map: prefectures, mountains, rivers, plains, lakes and islands. Name them from their shape, or tap where they are.', '在空白地图上找出都道府县、山、河、平原、湖和岛。看形状说名字，或从名字点出位置。'),
  species: {}, moves: {}, tags: {},
  chapters: MAP_CH.map(([id, host, place, topic, types], ci) => {
    const probs = [];
    types.forEach((t, k) => {
      if (t === 'shape') for (let j = 0; j < 4; j++) probs.push(MFAM(`${id}s${j}`, 'shape', [[13, 1, 26, 47][j], j]));
      else if (t === 'capital') for (let j = 0; j < 4; j++) probs.push(MFAM(`${id}c${j}`, 'capital', [[2, 14, 22, 37][j], j]));
      else for (let j = 0; j < 3; j++) { probs.push(MFAM(`${id}${t}m${j}`, 'mark', [t, j * 5, j])); probs.push(MFAM(`${id}${t}w${j}`, 'where', [t, j * 5 + 2])); }
    });
    return { id, host, place, topic, unlock: [host], moves: ['socMap'], say: [tx('白地図に のせていこう。', 'Let’s fill in the blank map.', '一起来填空白地图吧。')], lessons: ci >= 1 && ci <= 3 ? [MAP_LESSON] : [], problems: probs };
  }),
});
// new picks each time
for (const c of WORLDS.find((w) => w.id === 'mapisle').chapters) for (const d of c.problems) {
  if (/s\d$/.test(d.id) && !/m\d$/.test(d.id)) VARY[d.id] = VARY.mapShape;
  if (/c\d$/.test(d.id)) VARY[d.id] = VARY.mapCapital;
  const m = d.id.match(/^m\d([a-z]+)([mw])\d$/); if (m) VARY[d.id] = m[2] === 'm' ? vType(m[1]) : vWhere(m[1]);
}
