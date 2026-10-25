// しゃかいの島 (social studies): one place per topic, questions tagged by skill so the parent page can show
// which KIND of skill is weak: know (terms & facts) / map (where) / read (charts & maps) / why (cause & effect) / calc (scale).
// Fixed questions come from worlds/data/social_bank.js (original wording);
// map symbols, 8 directions, scale, contour lines and climate charts are generated here with new numbers each time.
// Climate normals: JMA 1991–2020 (出典：気象庁ホームページ「過去の気象データ」, processed).

const SOC = (() => {
  const CITY = {
    sapporo: { n: tx('札幌', 'Sapporo', '札幌'), t: [-3.2, -2.7, 1.1, 7.3, 13.0, 17.0, 21.1, 22.3, 18.6, 12.1, 5.2, -0.9], p: [108.4, 91.9, 77.6, 54.6, 55.5, 60.4, 90.7, 126.8, 142.2, 109.9, 113.8, 114.5],
      f: tx('冬の寒さがきびしく、0℃より下の月がある。梅雨や台風のえいきょうが少なく、1年中 雨が少なめ。', 'Harsh winters below 0 °C; little rainy season or typhoon effect, so fairly dry all year.', '冬天严寒，有低于0℃的月份；受梅雨和台风影响小，全年降水偏少。') },
    joetsu: { n: tx('上越(新潟県)', 'Joetsu (Niigata)', '上越（新潟县）'), t: [2.5, 2.7, 5.8, 11.7, 17.0, 20.9, 25.0, 26.4, 22.3, 16.4, 10.5, 5.3], p: [429.6, 263.3, 194.7, 105.3, 87.0, 136.5, 206.8, 184.5, 205.8, 213.9, 334.2, 475.5],
      f: tx('日本海側。北西の季節風で冬に雪がとても多く、12月・1月の降水量がいちばん多い。', 'Sea of Japan side: the north-west winter monsoon brings heavy snow, so December and January are the wettest.', '日本海一侧：冬季西北季风带来大雪，12月、1月降水最多。') },
    matsumoto: { n: tx('松本(長野県)', 'Matsumoto (Nagano)', '松本（长野县）'), t: [-0.3, 0.6, 4.6, 10.8, 16.5, 20.2, 24.2, 25.1, 20.4, 13.9, 7.8, 2.5], p: [39.8, 38.5, 78.0, 81.1, 94.5, 114.9, 131.3, 101.6, 148.0, 128.3, 56.3, 32.7],
      f: tx('中央高地。山にかこまれて季節風がとどきにくく、雨が少ない。夏と冬の気温の差が大きい。', 'Central highlands: mountains block the monsoons, so it is dry; big gap between summer and winter temperatures.', '中央高地：群山环绕，季风难以到达，降水少；冬夏温差大。') },
    tokyo: { n: tx('東京', 'Tokyo', '东京'), t: [5.4, 6.1, 9.4, 14.3, 18.8, 21.9, 25.7, 26.9, 23.3, 18.0, 12.5, 7.7], p: [59.7, 56.5, 116.0, 133.7, 139.7, 167.8, 156.2, 154.7, 224.9, 234.8, 96.3, 57.9],
      f: tx('太平洋側。梅雨や台風で夏から秋に雨が多く、冬は晴れて かんそうする。', 'Pacific side: rainy season and typhoons make summer–autumn wet; winter is sunny and dry.', '太平洋一侧：梅雨和台风使夏秋多雨，冬季晴朗干燥。') },
    owase: { n: tx('尾鷲(三重県)', 'Owase (Mie)', '尾鹫（三重县）'), t: [6.5, 7.2, 10.3, 14.7, 18.7, 21.9, 25.8, 26.8, 23.8, 18.8, 13.7, 8.8], p: [106.0, 118.8, 233.8, 295.4, 360.5, 436.6, 405.2, 427.3, 745.7, 507.6, 211.5, 121.3],
      f: tx('太平洋側の、日本でも有数の雨が多い所。夏のしめった風が山にぶつかって雨になる。', 'Pacific side and one of Japan’s rainiest places: wet summer winds hit the mountains and turn to rain.', '太平洋一侧，日本数一数二的多雨地：夏季湿润的风撞上山地化为雨。') },
    takamatsu: { n: tx('高松(香川県)', 'Takamatsu (Kagawa)', '高松（香川县）'), t: [5.9, 6.3, 9.4, 14.7, 19.8, 23.3, 27.5, 28.6, 24.7, 19.0, 13.2, 8.1], p: [39.4, 45.8, 81.4, 74.6, 100.9, 153.1, 159.8, 106.0, 167.4, 120.1, 55.0, 46.7],
      f: tx('瀬戸内。北と南を山地にはさまれ、季節風がとどきにくいので1年中 雨が少ない。あたたかい。', 'Seto Inland Sea: mountains to the north and south block the monsoons, so it is dry all year — and warm.', '濑户内：南北被山地夹住，季风难以到达，全年少雨且温暖。') },
    naha: { n: tx('那覇(沖縄県)', 'Naha (Okinawa)', '那霸（冲绳县）'), t: [17.3, 17.5, 19.1, 21.5, 24.2, 27.2, 29.1, 29.0, 27.9, 25.5, 22.5, 19.0], p: [101.6, 114.5, 142.8, 161.0, 245.3, 284.4, 188.1, 240.0, 275.2, 179.2, 119.1, 110.0],
      f: tx('南西諸島。冬でも平均15℃より高い。梅雨や台風で雨が多い。', 'South-western islands: even winter averages above 15 °C; rainy season and typhoons bring lots of rain.', '西南诸岛：冬季平均气温也在15℃以上；梅雨和台风带来大量降水。') },
    nemuro: { n: tx('根室(北海道)', 'Nemuro (Hokkaido)', '根室（北海道）'), t: [-3.4, -3.8, -0.8, 3.5, 7.7, 10.9, 14.9, 17.4, 16.2, 11.6, 5.6, -0.5], p: [30.6, 23.5, 47.0, 64.4, 96.2, 103.0, 115.1, 132.3, 160.0, 126.1, 83.2, 59.0],
      f: tx('北海道の太平洋側。寒流の親潮で夏にこい霧が出て、夏でも20℃に とどかない。', 'Hokkaido’s Pacific side: the cold Oyashio current brings thick summer fog, so even summer stays under 20 °C.', '北海道太平洋一侧：寒流亲潮使夏季多浓雾，夏天也不到20℃。') },
  };
  const REGIONS = [
    ['hokkaido', tx('北海道地方', 'Hokkaido', '北海道地方'), [1], '#8fc6ff'], ['tohoku', tx('東北地方', 'Tohoku', '东北地方'), [2, 3, 4, 5, 6, 7], '#9fd66f'],
    ['kanto', tx('関東地方', 'Kanto', '关东地方'), [8, 9, 10, 11, 12, 13, 14], '#ffb347'], ['chubu', tx('中部地方', 'Chubu', '中部地方'), [15, 16, 17, 18, 19, 20, 21, 22, 23], '#ff9ad0'],
    ['kinki', tx('近畿地方', 'Kinki', '近畿地方'), [24, 25, 26, 27, 28, 29, 30], '#b9a5f6'], ['chugoku', tx('中国地方', 'Chugoku', '中国地方'), [31, 32, 33, 34, 35], '#ffe066'],
    ['shikoku', tx('四国地方', 'Shikoku', '四国地方'), [36, 37, 38, 39], '#7fe0c8'], ['kyushu', tx('九州地方', 'Kyushu', '九州地方'), [40, 41, 42, 43, 44, 45, 46, 47], '#ff8a65'],
  ];
  const DIRS = [tx('北', 'north', '北'), tx('北東', 'north-east', '东北'), tx('東', 'east', '东'), tx('南東', 'south-east', '东南'), tx('南', 'south', '南'), tx('南西', 'south-west', '西南'), tx('西', 'west', '西'), tx('北西', 'north-west', '西北')];
  // map symbols (40×40 drawings, traced from GSI's 2022 symbol list), name, and a look-alike to use as the tempting wrong answer
  const S = 'stroke="#3b3346" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const SYM = {
    school: [`<text x="20" y="29" font-size="26" text-anchor="middle" font-weight="700" fill="#3b3346">文</text>`, tx('小・中学校', 'Elementary / junior high school', '小学、初中'), 'high'],
    high: [`<circle cx="20" cy="20" r="16" ${S}/><text x="20" y="28" font-size="20" text-anchor="middle" font-weight="700" fill="#3b3346">文</text>`, tx('高等学校', 'High school', '高中'), 'school'],
    shrine: [`<path d="M6 12 L34 12 M10 18 L30 18 M13 12 L13 34 M27 12 L27 34" ${S}/>`, tx('神社', 'Shinto shrine', '神社'), 'temple'],
    temple: [`<text x="20" y="30" font-size="28" text-anchor="middle" fill="#3b3346">卍</text>`, tx('寺院', 'Buddhist temple', '寺院'), 'shrine'],
    police: [`<circle cx="20" cy="20" r="16" ${S}/><path d="M12 12 L28 28 M28 12 L12 28" ${S}/>`, tx('警察署', 'Police station', '警察署'), 'koban'],
    koban: [`<path d="M10 10 L30 30 M30 10 L10 30" ${S}/>`, tx('交番', 'Police box', '派出所'), 'police'],
    fire: [`<path d="M10 6 A10 10 0 0 0 30 6 M20 16 L20 35" ${S}/>`, tx('消防署', 'Fire station', '消防署'), 'police'],
    hospital: [`<path d="M6 8 L34 8 L34 20 Q34 32 20 36 Q6 32 6 20 Z" ${S}/><path d="M20 13 L20 29 M12 21 L28 21" ${S}/>`, tx('病院', 'Hospital', '医院'), 'health'],
    health: [`<circle cx="20" cy="20" r="16" ${S}/><path d="M20 10 L20 30 M10 20 L30 20" ${S}/>`, tx('保健所', 'Public health centre', '保健所'), 'hospital'],
    post: [`<circle cx="20" cy="20" r="16" ${S}/><path d="M12 13 L28 13 M12 19 L28 19 M20 19 L20 31" ${S}/>`, tx('郵便局', 'Post office', '邮局'), 'health'],
    library: [`<path d="M20 12 Q12 8 4 10 L4 32 Q12 30 20 34 Q28 30 36 32 L36 10 Q28 8 20 12 Z M20 12 L20 34" ${S}/>`, tx('図書館', 'Library', '图书馆'), 'museum'],
    museum: [`<path d="M4 16 L20 6 L36 16 Z M8 16 L8 32 M16 16 L16 32 M24 16 L24 32 M32 16 L32 32 M4 34 L36 34" ${S}/>`, tx('博物館・美術館', 'Museum / art gallery', '博物馆、美术馆'), 'library'],
    home: [`<path d="M6 20 L20 8 L34 20 L34 34 L6 34 Z" ${S}/><path d="M18 32 L18 18 Q18 14 23 15" ${S}/>`, tx('老人ホーム', 'Care home for the elderly', '养老院'), 'museum'],
    onsen: [`<text x="20" y="31" font-size="28" text-anchor="middle" fill="#3b3346">♨</text>`, tx('温泉', 'Hot spring', '温泉'), 'fire'],
    windmill: [`<circle cx="20" cy="18" r="4" ${S}/><path d="M19 14.1 L16.9 6.4 M23.9 19 L31.6 21.1 M16.9 20.6 L10.8 25.7 M20 22 L20 35 M15 35 L25 35" ${S}/>`, tx('風車', 'Windmill', '风车'), 'fire'],
    lighthouse: [`<circle cx="20" cy="20" r="6.5" ${S}/><circle cx="20" cy="20" r="2.6" fill="#3b3346"/><path d="M20 4 L20 10 M20 30 L20 36 M4 20 L10 20 M30 20 L36 20 M9 9 L13 13 M27 27 L31 31 M31 9 L27 13 M9 31 L13 27" ${S}/>`, tx('灯台', 'Lighthouse', '灯塔'), 'windmill'],
    monument: [`<path d="M13 34 L13 12 Q20 4 27 12 L27 34 Z M10 34 L30 34" ${S}/>`, tx('記念碑', 'Monument', '纪念碑'), 'home'],
    cityhall: [`<circle cx="20" cy="20" r="15" ${S}/><circle cx="20" cy="20" r="8" ${S}/>`, tx('市役所', 'City hall', '市政府'), 'townhall'],
    townhall: [`<circle cx="20" cy="20" r="12" ${S}/>`, tx('町・村役場', 'Town / village office', '町村政府'), 'cityhall'],
    paddy: [`<path d="M16 12 L16 28 M24 12 L24 28" ${S}/>`, tx('田', 'Rice paddy', '水田'), 'field'],
    field: [`<path d="M12 14 L20 28 L28 14" ${S}/>`, tx('畑', 'Field', '旱地'), 'paddy'],
    orchard: [`<circle cx="20" cy="24" r="9" ${S}/><path d="M20 15 L20 6" ${S}/>`, tx('果樹園', 'Orchard', '果园'), 'broadleaf'],
    tea: [`<circle cx="13" cy="26" r="3" fill="#3b3346"/><circle cx="27" cy="26" r="3" fill="#3b3346"/><circle cx="20" cy="14" r="3" fill="#3b3346"/>`, tx('茶畑', 'Tea field', '茶园'), 'orchard'],
    broadleaf: [`<path d="M20 30 A10 10 0 1 1 20.01 30 L34 30" ${S}/>`, tx('広葉樹林', 'Broadleaf forest', '阔叶林'), 'needle'],
    needle: [`<path d="M10 34 L16.5 6 L23.5 34 M17.5 34 L30 34" ${S}/>`, tx('針葉樹林', 'Conifer forest', '针叶林'), 'broadleaf'],
  };
  const symSVG = (k, size = 54) => `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true" style="background:#fffdf5;border-radius:10px;border:1px solid #e6dcc8">${SYM[k][0]}</svg>`;
  return { CITY, REGIONS, DIRS, SYM, symSVG };
})();

const ST = { // shared labels
  tapPref: tx('地図の都道府県をタップしよう', 'Tap the prefecture on the map', '在地图上点都道府县'), tapAll: tx('あてはまる都道府県を ぜんぶタップしてから「けってい」', 'Tap every matching prefecture, then “Done”', '点出所有符合的都道府县，再按“确定”'),
  thatIs: tx('そこは {p} だよ。', 'That’s {p}.', '那是{p}。'), done: tx('けってい', 'Done', '确定'), missing: tx('あと {k} つあるよ。', '{k} more to find.', '还差{k}个。'), extra: tx('ちがう所もえらんでいるよ。', 'Some of your picks don’t fit.', '选了不对的地方。'),
  sortHint: tx('それぞれ、どちらのグループかを選んでから「けってい」', 'Choose a group for each, then “Done”', '为每一项选好组，再按“确定”'), sortBad: tx('{k} こが ちがうグループに入っているよ。', '{k} in the wrong group.', '有{k}个分错了组。'),
  pickAll: tx('あてはまるものを ぜんぶ選んで「けってい」', 'Choose all that fit, then “Done”', '选出所有符合的，再按“确定”'),
  mm: tx('mm', 'mm', '毫米'), month: tx('月', '', '月'), m: tx('m', 'm', '米'), cm: tx('cm', 'cm', '厘米'), denom: tx('分の1', '(1 : ?)', '分之一'),
};

// ---- interactive pieces ----
const PREF_EN = ["Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa", "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"];
const prefName = (id, lang) => { const ja = (JP_PREFS.find((p) => p[0] === id) || [])[1]; return lang === 'en' ? PREF_EN[id - 1] : lang === 'zh' ? ja && ja.replace(/県$/, '县') : ja; };
const prefId = (name) => (JP_PREFS.find((p) => p[1] === name) || [])[0];
function jpMap(opt = {}) { // opt.fill: {id: color}, opt.sel: Set of ids, opt.extra: svg drawn on top (markers)
  return `<svg viewBox="${opt.view ? opt.view.map((v) => v.toFixed(1)).join(' ') : '0 0 437.33 516.02'}" style="width:min(100%,460px);background:#cfeefa;border-radius:14px;touch-action:manipulation">${JP_PREFS.map(([id, n, , d]) =>
    `<path d="${d}" data-pref="${id}" fill="${(opt.fill && opt.fill[id]) || (opt.sel && opt.sel.has(id) ? '#ffc94d' : '#f6f1e3')}" stroke="#8a7f6a" stroke-width="0.6" style="cursor:pointer"><title>${n}</title></path>`).join('')}${opt.extra || ''}</svg>`;
}
function mapTask(names, mode) {
  const want = new Set(names.map(prefId));
  return (box, api) => { const st = api.state; if (!st.sel) st.sel = new Set();
    const draw = (msg) => { box.innerHTML = `<div class="panel interact"><div class="tdesc">${T(mode === 'all' ? ST.tapAll : ST.tapPref)}</div>${jpMap({ sel: st.sel })}<div class="disp" id="pn">${msg || ''}</div>${mode === 'all' ? `<button class="btn" id="dn" type="button">${T(ST.done)} (${st.sel.size})</button>` : ''}</div>`;
      $$('[data-pref]', box).forEach((el) => el.onclick = () => { const id = +el.dataset.pref; snd('pop');
        if (mode === 'all') { st.sel.has(id) ? st.sel.delete(id) : st.sel.add(id); draw(prefName(id, LANG)); return; }
        if (want.has(id)) { st.sel = new Set([id]); draw(prefName(id, LANG)); api.ok(); } else { st.sel = new Set([id]); draw(T(ST.thatIs, { p: prefName(id, LANG) })); api.bad(T(ST.thatIs, { p: prefName(id, LANG) }), 'soc_map'); } });
      const dn = $('#dn', box); if (dn) dn.onclick = () => { const extra = [...st.sel].filter((x) => !want.has(x)).length, miss = [...want].filter((x) => !st.sel.has(x)).length;
        if (extra) api.bad(T(ST.extra), 'soc_map'); else if (miss) api.bad(T(ST.missing, { k: miss }), 'soc_map'); else api.ok(); }; };
    draw(); };
}
function binsTask(bins, items, tag = 'soc_know') {
  return (box, api) => { const st = api.state; if (!st.pick) st.pick = {};
    const draw = (bad) => { box.innerHTML = `<div class="panel interact"><div class="tdesc">${T(ST.sortHint)}</div><div class="tw"><table class="qtable">${items.map((it, i) => `<tr style="${bad && bad.has(i) ? 'background:#ffe3e8' : ''}"><td style="text-align:left">${T(it.t)}</td>${bins.map((b, j) => `<td><button class="chip ${st.pick[i] === j ? 'on' : ''}" data-b="${i}|${j}" type="button">${T(b)}</button></td>`).join('')}</tr>`).join('')}</table></div><button class="btn" id="dn" type="button">${T(ST.done)}</button></div>`;
      $$('[data-b]', box).forEach((b) => b.onclick = () => { const [i, j] = b.dataset.b.split('|').map(Number); st.pick[i] = j; snd('pop'); draw(); });
      $('#dn', box).onclick = () => { const wrong = new Set(items.map((it, i) => (st.pick[i] === it.bin ? -1 : i)).filter((i) => i >= 0)); if (wrong.size) { draw(wrong); api.bad(T(ST.sortBad, { k: wrong.size }), tag); } else api.ok(); }; };
    draw(); };
}
function multiTask(opts, tag) {
  return (box, api) => { const st = api.state; if (!st.on) st.on = new Set();
    const draw = () => { box.innerHTML = `<div class="panel interact"><div class="tdesc">${T(ST.pickAll)}</div><div class="opts">${opts.map((o, i) => `<button class="opt ${st.on.has(i) ? 'right' : ''}" data-m="${i}" type="button">${T(o.t)}</button>`).join('')}</div><button class="btn" id="dn" type="button">${T(ST.done)}</button></div>`;
      $$('[data-m]', box).forEach((b) => b.onclick = () => { const i = +b.dataset.m; st.on.has(i) ? st.on.delete(i) : st.on.add(i); snd('pop'); draw(); });
      $('#dn', box).onclick = () => { const okSet = new Set(opts.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0)), extra = [...st.on].filter((i) => !okSet.has(i)), miss = [...okSet].filter((i) => !st.on.has(i));
        if (extra.length) api.bad(opts[extra[0]].fb ? T(opts[extra[0]].fb) : T(ST.extra), tag); else if (miss.length) api.bad(T(ST.missing, { k: miss.length }), tag); else api.ok(); }; };
    draw(); };
}
// climate chart: bars = precipitation (0–800 mm), line = temperature (−10–30 °C)
function climateSVG(c) {
  const W = 340, H = 220, x0 = 40, x1 = 300, y0 = 190, y1 = 20, bw = (x1 - x0) / 12, py = (v) => y0 - (v / 800) * (y0 - y1), ty = (v) => y0 - ((v + 10) / 40) * (y0 - y1);
  const bars = c.p.map((v, i) => `<rect x="${(x0 + i * bw + 3).toFixed(1)}" y="${py(v).toFixed(1)}" width="${(bw - 6).toFixed(1)}" height="${(y0 - py(v)).toFixed(1)}" fill="#7fb0ff"/>`).join('');
  const line = c.t.map((v, i) => `${(x0 + i * bw + bw / 2).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
  const gridT = [-10, 0, 10, 20, 30].map((v) => `<line x1="${x0}" x2="${x1}" y1="${ty(v)}" y2="${ty(v)}" stroke="#ddd"/><text x="${x0 - 4}" y="${ty(v) + 4}" font-size="10" text-anchor="end" fill="#c0392b">${v}</text>`).join('');
  const gridP = [0, 200, 400, 600, 800].map((v) => `<text x="${x1 + 4}" y="${py(v) + 4}" font-size="10" fill="#2f6fd0">${v}</text>`).join('');
  const months = c.p.map((_, i) => `<text x="${(x0 + i * bw + bw / 2).toFixed(1)}" y="${y0 + 14}" font-size="10" text-anchor="middle" fill="#555">${i + 1}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" style="width:min(100%,360px);background:#fff;border-radius:12px">${gridT}${bars}<polyline points="${line}" fill="none" stroke="#e74c3c" stroke-width="2.4"/>${c.t.map((v, i) => `<circle cx="${(x0 + i * bw + bw / 2).toFixed(1)}" cy="${ty(v).toFixed(1)}" r="2.6" fill="#e74c3c"/>`).join('')}${gridP}${months}
    <text x="${x0 - 30}" y="14" font-size="10" fill="#c0392b">℃</text><text x="${x1 - 6}" y="14" font-size="10" fill="#2f6fd0">mm</text><line x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}" stroke="#555"/></svg>`;
}
// a small town grid with map symbols and a north arrow (rot: 0 up, 1 right, 2 down, 3 left = which way north points)
function townSVG(cells, rot, marks) {
  const n = 5, s = 52, arrow = `<g transform="translate(${n * s + 30} 40) rotate(${rot * 90})"><path d="M0 -22 L8 6 L0 0 L-8 6 Z" fill="#e74c3c"/><text x="0" y="22" font-size="13" text-anchor="middle" fill="#3b3346" transform="rotate(${-rot * 90} 0 16)">${LANGTXT('北', 'N', '北')}</text></g>`;
  const grid = Array.from({ length: n + 1 }, (_, i) => `<line x1="0" x2="${n * s}" y1="${i * s}" y2="${i * s}" stroke="#e3dccb"/><line y1="0" y2="${n * s}" x1="${i * s}" x2="${i * s}" stroke="#e3dccb"/>`).join('');
  return `<svg viewBox="-4 -4 ${n * s + 64} ${n * s + 8}" style="width:min(100%,380px);background:#fffdf5;border-radius:12px">${grid}${cells.map(([k, x, y]) => `<g transform="translate(${x * s + 6} ${y * s + 6})"><svg width="40" height="40" viewBox="0 0 40 40">${SOC.SYM[k][0]}</svg></g>${marks && marks[k] ? `<text x="${x * s + 26}" y="${y * s + 50}" font-size="11" text-anchor="middle" fill="#c0392b" font-weight="700">${marks[k]}</text>` : ''}`).join('')}${arrow}</svg>`;
}
// contour hill: rings every `iv` metres from `base`; the summit sits toward the steep side (east or west)
function hillSVG(rings, iv, base, steepEast, pt) {
  const W = 360, H = 240, cx0 = 180, cy = 120, out = [];
  for (let k = 0; k < rings; k++) { const f = 1 - k / rings, rx = 30 + 140 * f, ry = 20 + 90 * f, cx = cx0 + (steepEast ? 1 : -1) * (1 - f) * 70;
    out.push({ cx, rx, ry, h: base + k * iv }); }
  const P = out[pt.ring], px = P.cx + (pt.side === 'w' ? -P.rx : P.rx), py = cy;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:min(100%,380px);background:#f4fbef;border-radius:12px">${out.map((r, k) => `<ellipse cx="${r.cx.toFixed(1)}" cy="${cy}" rx="${r.rx.toFixed(1)}" ry="${r.ry.toFixed(1)}" fill="none" stroke="#8a6a3a" stroke-width="${(r.h % 100 === 0) ? 2.4 : 1.2}"/>${k === 0 ? `<text x="${(r.cx - r.rx + 4).toFixed(1)}" y="${cy - 4}" font-size="11" fill="#6b4a1e">${r.h}m</text>` : ''}`).join('')}
    <circle cx="${px.toFixed(1)}" cy="${py}" r="5" fill="#e74c3c"/><text x="${(px + 7).toFixed(1)}" y="${py - 7}" font-size="13" font-weight="700" fill="#c0392b">A</text>
    <text x="16" y="22" font-size="12" fill="#3b3346">${LANGTXT('西', 'W', '西')}</text><text x="${W - 28}" y="22" font-size="12" fill="#3b3346">${LANGTXT('東', 'E', '东')}</text></svg>`;
}

// ---- generated problem families (VARY gives new numbers) ----
const CITY_KEYS = Object.keys(SOC.CITY), SYM_KEYS = Object.keys(SOC.SYM);
const pickN = (arr, n, avoid, seed) => { const R = LEARN.tools(LEARN.rngOf(seed), 1); return R.shuffle(arr.filter((x) => !avoid.includes(x))).slice(0, n); };
const GEN = {
  climate: (key, seed) => { const c = SOC.CITY[key], others = pickN(CITY_KEYS, 3, [key], 'c' + seed), opts = LEARN.tools(LEARN.rngOf('o' + seed), 1).shuffle([key, ...others]);
    return { kind: 'choice', skill: 'read', stars: 2, story: tx('この雨温図は どの都市? (棒＝降水量、線＝気温)', 'Which city is this climate chart? (bars = rain, line = temperature)', '这张气候图是哪座城市？（柱=降水量，线=气温）'),
      fig: () => climateSVG(c), options: opts.map((k) => ({ t: SOC.CITY[k].n, ok: k === key, fb: k === key ? null : SOC.CITY[k].f, tag: 'soc_read' })),
      hints: [tx('まず冬(1月・12月)の気温と、雨がいちばん多い季節を見よう。', 'Look first at winter (Jan, Dec) temperatures and at which season is wettest.', '先看冬季（1月、12月）的气温，和哪个季节雨最多。'), tx('冬に雨(雪)が多い→日本海側。夏から秋に多い→太平洋側。1年中少ない→瀬戸内か中央高地。冬も15℃より上→沖縄。', 'Wet winter → Sea of Japan side. Wet summer–autumn → Pacific side. Dry all year → Inland Sea or highlands. Above 15 °C in winter → Okinawa.', '冬季多雨雪→日本海侧；夏秋多雨→太平洋侧；全年少雨→濑户内或中央高地；冬天也在15℃以上→冲绳。')],
      why: c.f }; },
  wetMonth: (key) => { const c = SOC.CITY[key], m = c.p.indexOf(Math.max(...c.p)) + 1, mt = c.t.indexOf(Math.min(...c.t)) + 1;
    return { kind: 'num', skill: 'read', stars: 1, unit: ST.month, story: tx(`${c.n.ja}の雨温図。降水量(棒)がいちばん多いのは何月?`, `${c.n.en}’s climate chart. Which month has the most rain (tallest bar)?`, `${c.n.zh}的气候图。降水量（柱）最多的是几月？`), fig: () => climateSVG(c), ans: m,
      mis: mt !== m ? [M(mt, 'soc_read', tx('それは気温(赤い線)がいちばん低い月。降水量は青い棒だよ。', 'That’s the coldest month (red line). Rain is the blue bars.', '那是气温（红线）最低的月份。降水量看蓝色柱子。'))] : [],
      hints: [tx('青い棒の高さをくらべよう。目もりは右がわ(mm)。', 'Compare the blue bars; the scale is on the right (mm).', '比较蓝色柱子的高度，刻度在右边（毫米）。')], why: tx(`いちばん高い棒は${m}月(${c.p[m - 1]}mm)。`, `The tallest bar is month ${m} (${c.p[m - 1]} mm).`, `最高的柱子是${m}月（${c.p[m - 1]}毫米）。`) }; },
  symName: (key, seed) => { const look = SOC.SYM[key][2], others = pickN(SYM_KEYS, 2, [key, look], 's' + seed), opts = LEARN.tools(LEARN.rngOf('so' + seed), 1).shuffle([key, look, ...others]);
    return { kind: 'choice', skill: 'know', stars: 1, story: tx('この地図記号は何をあらわす?', 'What does this map symbol mean?', '这个地图符号表示什么？'), fig: () => `<div style="display:flex;justify-content:center">${SOC.symSVG(key, 96)}</div>`,
      options: opts.map((k) => ({ t: SOC.SYM[k][1], ok: k === key, fb: k === key ? null : tx(`「${SOC.SYM[k][1].ja}」の記号はこれ: ${SOC.symSVG(k, 40)}`, `“${SOC.SYM[k][1].en}” looks like this: ${SOC.symSVG(k, 40)}`, `“${SOC.SYM[k][1].zh}”的符号是这样：${SOC.symSVG(k, 40)}`), tag: 'soc_know' })),
      why: tx(`${SOC.SYM[key][1].ja}の記号。にている「${SOC.SYM[look][1].ja}」とまちがえないようにしよう。`, `The symbol for ${SOC.SYM[key][1].en}. Don’t mix it up with “${SOC.SYM[look][1].en}”.`, `${SOC.SYM[key][1].zh}的符号。别和相似的“${SOC.SYM[look][1].zh}”搞混。`) }; },
  symPick: (key, seed) => { const look = SOC.SYM[key][2], others = pickN(SYM_KEYS, 2, [key, look], 'p' + seed), opts = LEARN.tools(LEARN.rngOf('po' + seed), 1).shuffle([key, look, ...others]);
    return { kind: 'choice', skill: 'know', stars: 2, story: tx(`「${SOC.SYM[key][1].ja}」の地図記号はどれ?`, `Which map symbol means “${SOC.SYM[key][1].en}”?`, `“${SOC.SYM[key][1].zh}”的地图符号是哪个？`),
      options: opts.map((k) => ({ t: SOC.symSVG(k, 56), ok: k === key, fb: k === key ? null : tx(`それは「${SOC.SYM[k][1].ja}」。`, `That’s “${SOC.SYM[k][1].en}”.`, `那是“${SOC.SYM[k][1].zh}”。`), tag: 'soc_know' })),
      why: tx(`${SOC.SYM[key][1].ja}はこの記号。`, `${SOC.SYM[key][1].en} is this symbol.`, `${SOC.SYM[key][1].zh}是这个符号。`) }; },
  // 8 directions on a town grid; rot ≠ 0 means north is not up (the arrow decides)
  dir: ([ax, ay, bx, by, rot, a, b]) => { const dx = bx - ax, dy = by - ay, sx = Math.sign(dx), sy = Math.sign(dy);
    const screen = { '0,-1': 0, '1,-1': 1, '1,0': 2, '1,1': 3, '0,1': 4, '-1,1': 5, '-1,0': 6, '-1,-1': 7 }[sx + ',' + sy];
    const d = (screen - rot * 2 + 8) % 8, naive = screen, opp = (d + 4) % 8, side = (d + 2) % 8;
    const opts = [...new Set([d, naive, opp, side, (d + 6) % 8])].slice(0, 4);
    return { kind: 'choice', skill: 'map', stars: rot ? 3 : 2, story: tx(`${SOC.SYM[a][1].ja}から見て、${SOC.SYM[b][1].ja}はどの方位?`, `From the ${SOC.SYM[a][1].en}, in which direction is the ${SOC.SYM[b][1].en}?`, `从${SOC.SYM[a][1].zh}看，${SOC.SYM[b][1].zh}在哪个方位？`),
      fig: () => townSVG([[a, ax, ay], [b, bx, by]], rot), options: LEARN.tools(LEARN.rngOf('d' + [ax, ay, bx, by, rot]), 1).shuffle(opts).map((k) => ({ t: SOC.DIRS[k], ok: k === d, fb: k === d ? null : k === naive && rot ? tx('地図の上が北とはかぎらないよ。方位記号の矢印が北。', 'Up is not always north — the arrow shows north.', '地图上方不一定是北，箭头指的才是北。') : k === opp ? tx('反対向きになっているよ。どこから見ているかに注意。', 'That’s the opposite way. Check where you look from.', '方向反了。注意是从哪里看。') : null, tag: 'soc_map' })),
      hints: rot ? [tx('方位記号の矢印が「北」。地図を回して、矢印が上を向くように考えてみよう。', 'The arrow points north. Imagine turning the map so the arrow points up.', '箭头指向北。想象把地图转到箭头朝上。')] : [tx('地図の上が北、右が東、下が南、左が西。', 'Up is north, right is east, down is south, left is west.', '上北、右东、下南、左西。')],
      why: tx(`方位記号から考えると ${SOC.DIRS[d].ja}。`, `Using the north arrow: ${SOC.DIRS[d].en}.`, `按方位标记：${SOC.DIRS[d].zh}。`) }; },
  wind: ([k]) => ({ kind: 'choice', skill: 'map', stars: 2, story: tx(`えんとつのけむりが ${SOC.DIRS[k].ja} の方へ流れている。風はどの方位からふいている?`, `Chimney smoke is drifting ${SOC.DIRS[k].en}. Which direction is the wind blowing from?`, `烟囱的烟飘向${SOC.DIRS[k].zh}。风是从哪个方位吹来的？`),
    options: [...new Set([(k + 4) % 8, k, (k + 2) % 8, (k + 6) % 8])].map((d) => ({ t: SOC.DIRS[d], ok: d === (k + 4) % 8, fb: d === k ? tx('それは けむりが流れていく方。風はその反対からふいてくる。', 'That’s where the smoke goes. The wind comes from the opposite side.', '那是烟飘去的方向，风从反方向吹来。') : null, tag: 'soc_map' })),
    why: tx(`けむりは風にながされる。${SOC.DIRS[k].ja}へ流れたなら、風は反対の ${SOC.DIRS[(k + 4) % 8].ja} から。`, `Smoke is pushed by the wind; drifting ${SOC.DIRS[k].en} means the wind comes from the ${SOC.DIRS[(k + 4) % 8].en}.`, `烟被风吹动；飘向${SOC.DIRS[k].zh}，说明风从反方向${SOC.DIRS[(k + 4) % 8].zh}吹来。`) }),
  // scale: map cm → real metres, real km → map cm, and finding the scale
  scaleReal: ([den, cm]) => ({ kind: 'num', skill: 'calc', stars: 2, unit: ST.m, story: tx(`${den === 25000 ? '2万5千' : den === 50000 ? '5万' : den}分の1の地図で ${cm}cm。実際のきょりは何m?`, `On a 1:${den} map, ${cm} cm. How many metres is it really?`, `在${den}分之一的地图上是${cm}厘米。实际距离是多少米？`), ans: cm * den / 100,
    mis: [M(cm * den, 'soc_calc', tx('それは cm のまま。100cm = 1m だから、100でわろう。', 'That’s still in cm; 100 cm = 1 m, so divide by 100.', '那还是厘米。100厘米=1米，要除以100。')), M(cm * den / 100000, 'soc_calc', tx('それは km。聞かれているのは m だよ。', 'That’s in km; the question asks for metres.', '那是千米，题目问的是米。'))].filter((m) => m.v !== cm * den / 100),
    hints: [tx('実際のきょり = 地図の長さ × 縮尺の分母。そのあと cm を m に直す。', 'Real distance = map length × the scale’s denominator; then change cm into m.', '实际距离 = 图上长度 × 比例尺分母，再把厘米换成米。')], why: tx(`${cm} × ${den} = ${cm * den}cm = ${cm * den / 100}m`, `${cm} × ${den} = ${cm * den} cm = ${cm * den / 100} m`, `${cm} × ${den} = ${cm * den}厘米 = ${cm * den / 100}米`) }),
  scaleMap: ([den, km]) => ({ kind: 'num', skill: 'calc', stars: 3, unit: ST.cm, story: tx(`実際の ${km}km は、${den === 25000 ? '2万5千' : '5万'}分の1の地図で 何cm?`, `How many cm is a real ${km} km on a 1:${den} map?`, `实际${km}千米，在${den}分之一的地图上是多少厘米？`), ans: km * 100000 / den,
    mis: [M(km * 1000 / den, 'soc_calc', tx('km を cm に直そう: 1km = 100000cm。', 'Change km into cm first: 1 km = 100 000 cm.', '先把千米换成厘米：1千米=100000厘米。'))].filter((m) => m.v !== km * 100000 / den),
    hints: [tx('地図の長さ = 実際のきょり ÷ 縮尺の分母。km は cm に直してから わろう。', 'Map length = real distance ÷ denominator; turn km into cm before dividing.', '图上长度 = 实际距离 ÷ 分母；先把千米化成厘米再除。')], why: tx(`${km}km = ${km * 100000}cm、${km * 100000} ÷ ${den} = ${km * 100000 / den}cm`, `${km} km = ${km * 100000} cm; ${km * 100000} ÷ ${den} = ${km * 100000 / den} cm`, `${km}千米 = ${km * 100000}厘米，${km * 100000} ÷ ${den} = ${km * 100000 / den}厘米`) }),
  scaleFind: ([m, cm]) => ({ kind: 'num', skill: 'calc', stars: 3, unit: ST.denom, story: tx(`実際 ${m}m の道が、地図では ${cm}cm。この地図の縮尺は 何分の1?`, `A ${m} m road is ${cm} cm on the map. The scale is 1 : ?`, `实际${m}米的路，在地图上是${cm}厘米。这张地图的比例尺是几分之一？`), ans: m * 100 / cm,
    mis: [M(m / cm, 'soc_calc', tx('m を cm に直してからわろう(1m = 100cm)。', 'Change m into cm before dividing (1 m = 100 cm).', '先把米换成厘米再除（1米=100厘米）。'))],
    hints: [tx('縮尺の分母 = 実際のきょり ÷ 地図の長さ(同じ単位で)。', 'Denominator = real distance ÷ map length (same units).', '分母 = 实际距离 ÷ 图上长度（单位相同）。')], why: tx(`${m}m = ${m * 100}cm、${m * 100} ÷ ${cm} = ${m * 100 / cm} → ${m * 100 / cm}分の1`, `${m} m = ${m * 100} cm; ${m * 100} ÷ ${cm} = ${m * 100 / cm} → 1 : ${m * 100 / cm}`, `${m}米 = ${m * 100}厘米，${m * 100} ÷ ${cm} = ${m * 100 / cm} → ${m * 100 / cm}分之一`) }),
  // contour lines: height of point A (on ring k), and which side is steep
  hillH: ([rings, iv, base, east, k, side]) => { const h = base + k * iv;
    return { kind: 'num', skill: 'read', stars: 2, unit: ST.m, story: tx(`等高線は ${iv}m ごと。いちばん外の線は ${base}m。点Aの高さは およそ何m?`, `Contour lines every ${iv} m; the outermost line is ${base} m. About how high is point A?`, `等高线每${iv}米一条，最外圈是${base}米。A点大约多高？`), fig: () => hillSVG(rings, iv, base, east, { ring: k, side }), ans: h,
      mis: [M(base + (k + 1) * iv, 'soc_read', tx('いちばん外の線が' + base + 'm。そこから内がわへ数えよう(外の線は0本目)。', `The outermost line is ${base} m — count inward from there (that line is number 0).`, `最外圈是${base}米，从它往里数（它算第0条）。`)), M(base + k * (iv === 10 ? 20 : 10), 'soc_read', tx(`線と線の間は ${iv}m だよ。`, `The gap between lines is ${iv} m.`, `相邻两条线相差${iv}米。`))].filter((m) => m.v !== h),
      hints: [tx('まず何mごとの線かをたしかめて、外がわから線を数えよう。', 'First check the interval, then count lines from the outside.', '先确认等高距，再从外往里数线。')], why: tx(`${base}m から内へ ${k} 本 → ${base} + ${k} × ${iv} = ${h}m`, `${k} lines in from ${base} m → ${base} + ${k} × ${iv} = ${h} m`, `从${base}米往里${k}条 → ${base} + ${k} × ${iv} = ${h}米`) }; },
  hillSteep: ([rings, iv, base, east]) => ({ kind: 'choice', skill: 'read', stars: 2, story: tx('この山は、東がわと西がわのどちらが急?', 'Is this hill steeper on the east or the west side?', '这座山东侧和西侧哪边更陡？'), fig: () => hillSVG(rings, iv, base, east, { ring: 0, side: east ? 'w' : 'e' }),
    options: [[0, tx('東がわ', 'East side', '东侧')], [1, tx('西がわ', 'West side', '西侧')]].map(([k, t]) => ({ t, ok: (k === 0) === east, fb: tx('等高線の間かくが広い方は、ゆるやか。せまい方が急。', 'Where the lines are far apart, the slope is gentle; close together means steep.', '等高线间隔宽的一侧平缓，密的一侧陡。'), tag: 'soc_read' })),
    why: tx('等高線の間かくが せまい方が急。', 'Closely spaced contour lines mean a steep slope.', '等高线越密，坡越陡。') }),
  region: ([i, pi]) => { const [, rn, prefs] = SOC.REGIONS[i], pid = prefs[pi % prefs.length], name = prefName(pid), nameEn = prefName(pid, 'en'), nameZh = prefName(pid, 'zh');
    const wrong = SOC.REGIONS.filter((_, j) => j !== i), R = LEARN.tools(LEARN.rngOf('r' + i + '|' + pi), 1), near = { 15: 'kanto', 22: 'kanto', 24: 'chubu', 47: 'chubu', 19: 'kanto', 20: 'kanto' };
    const opts = R.shuffle([SOC.REGIONS[i], ...R.shuffle(wrong).slice(0, 3)]);
    return { kind: 'choice', skill: 'know', stars: [15, 19, 20, 22, 24, 47].includes(prefs[pi % prefs.length]) ? 3 : 2, story: tx(`${name}は 何地方?`, `Which region is ${nameEn} in?`, `${nameZh}属于哪个地方？`), fig: () => jpMap({ fill: { [prefs[pi % prefs.length]]: '#ffc94d' } }),
      options: opts.map((r) => ({ t: r[1], ok: r === SOC.REGIONS[i], fb: r === SOC.REGIONS[i] ? null : tx(`${r[1].ja}の都府県は: ${r[2].map((x) => prefName(x)).join('・')}`, `${r[1].en}: ${r[2].map((x) => prefName(x, 'en')).join(', ')}`, `${r[1].zh}包括：${r[2].map((x) => prefName(x, 'zh')).join('、')}`), tag: 'soc_map' })),
      why: tx(`${name}は${rn.ja}。${rn.ja}: ${prefs.map((x) => prefName(x)).join('・')}`, `${nameEn} is in ${rn.en}: ${prefs.map((x) => prefName(x, 'en')).join(', ')}`, `${nameZh}属于${rn.zh}：${prefs.map((x) => prefName(x, 'zh')).join('、')}`), _near: near }; },
};
// generators of parameters for each family
VARY.socClimate = (R) => [R.pick(CITY_KEYS), R.int(1, 9999)];
VARY.socWet = (R) => [R.pick(CITY_KEYS)];
VARY.socSymName = (R) => [R.pick(SYM_KEYS), R.int(1, 9999)];
VARY.socSymPick = (R) => [R.pick(SYM_KEYS), R.int(1, 9999)];
VARY.socDir = (R) => { for (let k = 0; k < 50; k++) { const ax = R.int(0, 4), ay = R.int(0, 4), d = R.int(0, 7), len = R.int(1, 3), v = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]][d], bx = ax + v[0] * len, by = ay + v[1] * len;
  if (bx < 0 || by < 0 || bx > 4 || by > 4) continue; const [a, b] = R.shuffle(['school', 'hospital', 'temple', 'shrine', 'post', 'police', 'library', 'museum', 'cityhall']).slice(0, 2); return [ax, ay, bx, by, R.level >= 2 ? R.int(1, 3) : 0, a, b]; } return null; };
VARY.socDirRot = (R) => { const p = VARY.socDir(R); if (p) p[4] = R.int(1, 3); return p; };
VARY.socWind = (R) => [R.int(0, 7)];
VARY.socScaleReal = (R) => [R.pick([25000, 50000]), R.lv([1, 4], [1, 8], [3, 12])];
VARY.socScaleMap = (R) => [R.pick([25000, 50000]), R.pick([1, 2, 3, 5])];
VARY.socScaleFind = (R) => { const den = R.pick([10000, 15000, 20000, 25000, 50000]), cm = R.int(2, 8); return [den * cm / 100, cm]; };
VARY.socHillH = (R) => { const rings = R.int(4, 6), iv = R.pick([10, 20]); return [rings, iv, R.pick([100, 200]), R.int(0, 1) === 1, R.int(1, rings - 1), R.pick(['w', 'e'])]; };
VARY.socHillSteep = (R) => [R.int(4, 6), R.pick([10, 20]), 100, R.int(0, 1) === 1];
VARY.socRegion = (R) => { const i = R.int(0, 7); return [i, R.int(0, SOC.REGIONS[i][2].length - 1)]; };

// ---- turn a bank item into a problem definition ----
const ruleLine = (ids, all) => { all = all || (typeof SOCIAL_RULES !== 'undefined' ? SOCIAL_RULES : null); return !all || !ids || !ids.length ? null : ids.map((r) => all[r]).filter(Boolean); };
const withRule = (why, ids, all) => { const rs = ruleLine(ids, all); if (!rs || !why) return why; const tail = (k) => rs.map((r) => `${r.e} ${r.n[k]}`).join(' / ');
  return tx(`${why.ja}<br>🔑 しくみ: ${tail('ja')}`, `${why.en}<br>🔑 Rule: ${tail('en')}`, `${why.zh}<br>🔑 规律：${tail('zh')}`); };
function bankProblem(it, unit, rules, prefix = 'soc_') {
  rules = rules || { all: typeof SOCIAL_RULES !== 'undefined' ? SOCIAL_RULES : null, byUnit: typeof SOCIAL_RULES_BY_UNIT !== 'undefined' ? SOCIAL_RULES_BY_UNIT : {} };
  const base = { skill: it.skill, stars: it.stars, story: it.q, hints: it.hint || [], why: withRule(it.why, it.rule ? [it.rule] : [], rules.all) };
  const order = (n) => LEARN.tools(LEARN.rngOf('order|' + it.id), 1).shuffle([...Array(n).keys()]);   // a fixed shuffle so the right answer isn't always first
  const make = () => {
    if (it.k === 'choice') { const o = order(it.opts.length); return { ...base, kind: 'choice', options: o.map((i) => ({ t: it.opts[i].t, ok: !!it.opts[i].ok, fb: it.opts[i].fb, tag: prefix + it.skill })) }; }
    if (it.k === 'multi') { const o = order(it.opts.length); return { ...base, kind: 'custom', mount: multiTask(o.map((i) => it.opts[i]), prefix + it.skill), ans: 'multi' }; }
    if (it.k === 'bins') return { ...base, kind: 'custom', mount: binsTask(it.bins, it.items, prefix + it.skill), ans: 'bins' };
    if (it.k === 'map') return { ...base, kind: 'custom', mount: mapTask(it.prefs, it.mode || 'any'), ans: it.prefs };
    if (it.k === 'num') return { ...base, kind: 'num', unit: it.unit, ans: it.ans, mis: (it.mis || []).map((m) => M(m.v, prefix + it.skill, m.fb)) };
    return { ...base, kind: 'choice', options: [{ t: tx('?', '?', '?'), ok: true }] };
  };
  VARY[it.id] = null;   // fixed facts: no new numbers
  return { id: it.id, sets: [[0]], make };
}
const FAM_RULES = { climate: ['R5', 'R6'] };
const fam = (id, gen, set) => ({ id, sets: [set], make: (ps) => { const q = GEN[gen](...(gen === 'climate' || gen === 'symName' || gen === 'symPick' || gen === 'wetMonth' ? ps : [ps])); if (FAM_RULES[gen]) q.why = withRule(q.why, FAM_RULES[gen]); return q; } });
const UNIT = (u) => [...((typeof SOCIAL_BANK !== 'undefined' && SOCIAL_BANK.units[u]) || []), ...((typeof SOCIAL_TRANSFER !== 'undefined' && SOCIAL_TRANSFER[u]) || [])].map((it) => bankProblem(it, u));
// a lesson card with the rules behind a lesson's facts
const RULES_LESSON = (units, all, byUnit) => ({ h: () => { all = all || SOCIAL_RULES; byUnit = byUnit || SOCIAL_RULES_BY_UNIT; const ids = [...new Set(units.flatMap((u) => byUnit[u] || []))];
  return `<h3>${LANGTXT('🔑 ここで使う「しくみ」', '🔑 The rules behind this place', '🔑 这里用到的“规律”')}</h3><p class="muted">${LANGTXT('おぼえるより先に、「なぜそうなるか」をつかもう。しくみがわかれば、知らない場所でも予想できる。', 'Before memorising, get the WHY. With the rule you can predict places you’ve never studied.', '先抓住“为什么”，再去记。懂了规律，没学过的地方也能预测。')}</p>${ids.map((r) => `<div class="panel" style="padding:10px;margin:6px 0"><b>${all[r].e} ${T(all[r].n)}</b><div>${T(all[r].t)}</div></div>`).join('')}`; } });

// ---- lessons ----
const SL = {
  regions: { h: () => `<h3>${LANGTXT('8つの地方', 'The 8 regions', '8个地方')}</h3><p>${LANGTXT('地方のボタンをおすと、その地方の都道府県が光るよ。', 'Press a region to light up its prefectures.', '按一个地方，它的都道府县就会亮起来。')}</p><div class="interact"><div class="chipbar" id="rg">${SOC.REGIONS.map((r, i) => `<button class="chip" data-rg="${i}" type="button">${T(r[1])}</button>`).join('')}</div><div id="rmap"></div><div class="disp" id="rlist"></div></div>`,
    m: (el) => { const d = (i) => { const r = SOC.REGIONS[i], fill = {}; SOC.REGIONS.forEach((x) => x[2].forEach((id) => { fill[id] = x === r ? x[3] : '#f6f1e3'; })); $('#rmap', el).innerHTML = jpMap({ fill }); $('#rlist', el).textContent = r[2].map((x) => prefName(x, LANG)).join(LANG === 'en' ? ', ' : '・'); $$('[data-rg]', el).forEach((b) => b.classList.toggle('on', +b.dataset.rg === i)); };
      $$('[data-rg]', el).forEach((b) => b.onclick = () => d(+b.dataset.rg)); d(0); } },
  climate: { h: () => `<h3>${LANGTXT('雨温図の読み方', 'Reading a climate chart', '怎么看气候图')}</h3><p>${LANGTXT('赤い線が気温(左の目もり、℃)、青い棒が降水量(右の目もり、mm)。都市をくらべてみよう。', 'Red line = temperature (left scale, °C); blue bars = rain (right scale, mm). Compare the cities.', '红线是气温（左侧刻度，℃），蓝柱是降水量（右侧刻度，毫米）。比较各城市看看。')}</p><div class="interact"><div class="chipbar" id="cc">${CITY_KEYS.map((k) => `<button class="chip" data-cc="${k}" type="button">${T(SOC.CITY[k].n)}</button>`).join('')}</div><div id="cchart"></div><div class="tdesc" id="cf"></div></div>`,
    m: (el) => { const d = (k) => { $('#cchart', el).innerHTML = climateSVG(SOC.CITY[k]); $('#cf', el).innerHTML = T(SOC.CITY[k].f); $$('[data-cc]', el).forEach((b) => b.classList.toggle('on', b.dataset.cc === k)); };
      $$('[data-cc]', el).forEach((b) => b.onclick = () => d(b.dataset.cc)); d('joetsu'); } },
  symbols: { h: () => `<h3>${LANGTXT('地図記号ずかん', 'Map symbol guide', '地图符号图鉴')}</h3><p>${LANGTXT('にている記号はペアでおぼえよう: 警察署と交番、学校と高校、神社と寺院、市役所と町・村役場、田と畑、広葉樹林と針葉樹林。', 'Learn look-alikes in pairs: police station / police box, school / high school, shrine / temple, city hall / town office, paddy / field, broadleaf / conifer.', '相似的符号成对记：警察署和派出所、小初中和高中、神社和寺院、市政府和町村政府、水田和旱地、阔叶林和针叶林。')}</p><div class="dex">${SYM_KEYS.map((k) => `<div class="dexc">${SOC.symSVG(k, 56)}<span class="n">${T(SOC.SYM[k][1])}</span></div>`).join('')}</div>` },
  dirs: { h: () => `<h3>${LANGTXT('8方位と方位記号', '8 directions & the north arrow', '8个方位和方位标记')}</h3><p>${LANGTXT('ふつう地図は上が北。でも方位記号があったら、その矢印の向きが北。<br>北・北東・東・南東・南・南西・西・北西。「北東」は北と東のあいだ。', 'Maps usually have north at the top — but if there is a north arrow, the arrow is north.<br>N, NE, E, SE, S, SW, W, NW. “North-east” is between north and east.', '地图一般上方为北；但有方位标记时，箭头方向才是北。<br>北、东北、东、东南、南、西南、西、西北。')}</p><div style="display:flex;justify-content:center">${townSVG([['school', 2, 2], ['hospital', 4, 0]], 0, {})}</div>` },
  scale: { h: () => `<h3>${LANGTXT('縮尺の計算', 'Scale calculations', '比例尺计算')}</h3><p>${LANGTXT('<b>実際のきょり = 地図の長さ × 分母</b><br><b>地図の長さ = 実際のきょり ÷ 分母</b><br>単位に気をつけよう: 1m = 100cm、1km = 1000m = 100000cm。<br>例: 5万分の1で2cm → 2 × 50000 = 100000cm = 1000m = 1km', '<b>Real = map length × denominator</b><br><b>Map = real ÷ denominator</b><br>Watch the units: 1 m = 100 cm, 1 km = 1000 m = 100 000 cm.<br>Example: 1:50 000, 2 cm → 2 × 50 000 = 100 000 cm = 1 km', '<b>实际距离 = 图上长度 × 分母</b><br><b>图上长度 = 实际距离 ÷ 分母</b><br>注意单位：1米=100厘米，1千米=1000米=100000厘米。<br>例：5万分之一上2厘米 → 2 × 50000 = 100000厘米 = 1千米')}</p>` },
  contour: { h: () => `<h3>${LANGTXT('等高線', 'Contour lines', '等高线')}</h3><p>${LANGTXT('同じ高さの所をむすんだ線。間かくが<b>せまい</b>ほど急、<b>広い</b>ほどゆるやか。まず「何mごと」かをたしかめよう。', 'Lines joining points of equal height. The <b>closer</b> they are, the steeper; the <b>wider</b>, the gentler. First check how many metres apart they are.', '把同样高度的点连起来的线。越<b>密</b>越陡，越<b>疏</b>越缓。先确认“每隔多少米”一条。')}</p><div style="display:flex;justify-content:center">${hillSVG(5, 20, 100, true, { ring: 2, side: 'w' })}</div>` },
};

registerWorld({
  id: 'social', x: 50, y: 95, host: 'shimaena', after: null, free: true,
  name: tx('しゃかいの島', 'Social Studies Isle', '社会岛'), level: tx('4年・社会', 'Grade 4 · social studies', '四年级 · 社会'), lockTxt: tx('いつでも行けるよ', 'Always open', '随时可去'),
  intro: tx('地図の読み方・国土・気候・地方・食べもの・寒い土地のくらし。地図をタップしたり、雨温図を読んだり、地図記号をさがしたりしよう。どこからはじめてもいい。', 'Reading maps, the land, climate, regions, food, and life in a cold land. Tap the map, read climate charts, find map symbols. Start anywhere.', '看地图、国土、气候、地方、食物和寒冷土地上的生活。点地图、看气候图、找地图符号。从哪里开始都可以。'),
  species: {},
  moves: {
    socKnow: { ty: tx('知', 'fact', '知'), col: 'var(--tN)', n: tx('用語と事実', 'Terms & facts', '术语与事实'), r: tx('にている言葉はペアでくらべておぼえる(扇状地↔三角州、過密↔過疎)', 'Learn look-alike words as pairs (alluvial fan ↔ delta, overcrowded ↔ depopulated)', '相似词成对比较着记（扇状地↔三角洲、过密↔过疏）') },
    socMap: { ty: '🗾', col: 'var(--tP)', n: tx('地図で場所', 'Places on the map', '地图上的位置'), r: tx('名前だけでなく、地図のどこかを指でおさえる', 'Don’t just know the name — point to it on the map', '不只记名字，要能在地图上指出来') },
    socRead: { ty: '📊', col: 'var(--tW)', n: tx('資料を読む', 'Reading charts & maps', '读图表'), r: tx('目もり・単位・何mごとかを先にたしかめる', 'Check the scale, units and intervals first', '先确认刻度、单位、间隔') },
    socWhy: { ty: tx('なぜ', 'why', '为何'), col: 'var(--neg)', n: tx('理由としくみ', 'Causes & reasons', '原因与机制'), r: tx('「〜だから〜」とつなげて言えるか', 'Can you link it: “because …, so …”?', '能否用“因为……所以……”连起来') },
    socApply: { ty: '🔑', col: 'var(--tC)', n: tx('しくみを使う', 'Using the rule', '运用规律'), r: tx('知らない場所でも、気候・土地・人・運び方のしくみから予想する', 'Predict an unknown place from the rules of climate, land, people and transport', '用气候、土地、人口、运输的规律推测陌生的地方') },
    socCalc: { ty: '÷', col: 'var(--tC)', n: tx('縮尺の計算', 'Scale maths', '比例尺计算'), r: tx('実際 = 地図 × 分母。cm・m・km の直しに注意', 'Real = map × denominator; watch cm / m / km', '实际 = 图上 × 分母；注意厘米、米、千米换算') },
  },
  tags: { soc_know: tx('社会: 用語・事実', 'Social: terms & facts', '社会：术语与事实'), soc_map: tx('社会: 地図の位置', 'Social: places on the map', '社会：地图位置'), soc_read: tx('社会: 資料の読み取り', 'Social: reading charts & maps', '社会：读图表'), soc_why: tx('社会: 理由・しくみ', 'Social: causes & reasons', '社会：原因与机制'), soc_calc: tx('社会: 縮尺などの計算', 'Social: scale maths', '社会：比例尺计算'), soc_apply: tx('社会: しくみを別の場所に使う', 'Social: using a rule on a new place', '社会：把规律用到新地方') },
  chapters: [
    { id: 's8', host: 'fukuron', place: tx('地図の図書館', 'Map Library', '地图图书馆'), topic: tx('方位・地図記号・縮尺', 'Directions, symbols, scale', '方位、地图符号、比例尺'), unlock: ['fukuron'], moves: ['socMap', 'socCalc'],
      say: [tx('方位記号の矢印が北。地図記号はにているペアに気をつけて。縮尺は単位の直しがカギ。', 'The arrow is north. Watch look-alike symbols. For scale, unit changes are the key.', '箭头指北；小心相似的符号；比例尺关键在单位换算。')], lessons: [SL.dirs, SL.symbols, SL.scale],
      problems: [...UNIT('maps'), fam('s6d1', 'dir', [1, 3, 3, 1, 0, 'school', 'hospital']), fam('s6w1', 'wind', [3]), fam('s6y1', 'symName', ['police', 1]), fam('s6y2', 'symPick', ['shrine', 2]), fam('s6k1', 'scaleReal', [25000, 4]), fam('s6k2', 'scaleMap', [50000, 2]), fam('s6d2', 'dir', [0, 4, 2, 2, 3, 'temple', 'post']), fam('s6k3', 'scaleFind', [750, 5])] },
    { id: 's9', host: 'risu', place: tx('等高線の山', 'Contour Hill', '等高线山'), topic: tx('等高線と土地利用', 'Contours & land use', '等高线与土地利用'), unlock: ['risu'], moves: ['socRead', 'socKnow'],
      say: [tx('等高線の間かくで、山の形が見えてくるよ。', 'Contour spacing shows the shape of a hill.', '从等高线间隔能看出山的形状。')], lessons: [RULES_LESSON(['contour']), SL.contour],
      problems: [...UNIT('contour'), fam('s7h1', 'hillH', [5, 20, 100, true, 2, 'w']), fam('s7h2', 'hillSteep', [5, 10, 100, false]), fam('s7y1', 'symName', ['orchard', 3]), fam('s7y2', 'symPick', ['needle', 4])] },
    { id: 's5', host: 'tsuno', place: tx('国土の見はらし台', 'Land Lookout', '国土瞭望台'), topic: tx('島・山脈・川', 'Islands, mountains, rivers', '岛屿、山脉、河流'), unlock: ['tsuno'], moves: ['socMap', 'socKnow'],
      say: [tx('日本は南北に長い島国。山が多く、川は短くて急だよ。', 'Japan is a long island country, mostly mountains, with short steep rivers.', '日本是南北狭长的岛国，多山，河流短而急。')], lessons: [RULES_LESSON(['land'])], problems: [...UNIT('land')] },
    { id: 's6', host: 'sora', place: tx('お天気観測所', 'Weather Station', '气象观测站'), topic: tx('気候と雨温図', 'Climate & charts', '气候与气候图'), unlock: ['sora'], moves: ['socRead', 'socWhy'],
      say: [tx('季節風と山と海流で、場所ごとに気候がちがう。雨温図を読めるようになろう。', 'Monsoons, mountains and currents make each place’s climate. Let’s read climate charts.', '季风、山和洋流造就各地气候。学会看气候图吧。')], lessons: [RULES_LESSON(['climate']), SL.climate],
      problems: [...UNIT('climate'), fam('s4c1', 'climate', ['joetsu', 1]), fam('s4c2', 'climate', ['naha', 2]), fam('s4c3', 'wetMonth', ['owase']), fam('s4c4', 'climate', ['matsumoto', 3])] },
    { id: 's7', host: 'nami', place: tx('47都道府県の港', 'Port of 47 Prefectures', '47都道府县港'), topic: tx('地方・都道府県・人口', 'Regions, prefectures, population', '地方、都道府县、人口'), unlock: ['nami'], moves: ['socMap', 'socApply'],
      say: [tx('8つの地方と47の都道府県。人が多い所・少ない所には わけがあるよ。', '8 regions and 47 prefectures — and there are reasons why some are crowded and some empty.', '8个地方、47个都道府县，人多人少都有原因。')], lessons: [RULES_LESSON(['regions']), SL.regions],
      problems: [...UNIT('regions'), fam('s5r1', 'region', [6, 1]), fam('s5r2', 'region', [4, 0])] },
    { id: 's1', host: 'kibi', place: tx('田んぼの村', 'Rice-Paddy Village', '稻田村'), topic: tx('米', 'Rice', '稻米'), unlock: ['kibi'], moves: ['socWhy', 'socApply'],
      say: [tx('米は どこで、どうして たくさん作られるのかな。「しくみ」から考えよう。', 'Where is rice grown, and why there? Think from the rules.', '稻米在哪里、为什么种得多？从规律想起。')], lessons: [RULES_LESSON(['rice'])], problems: [...UNIT('rice')] },
    { id: 's2', host: 'ichigoro', place: tx('野菜の市場', 'Vegetable Market', '蔬菜市场'), topic: tx('野菜と旬', 'Vegetables & seasons', '蔬菜与时令'), unlock: ['ichigoro'], moves: ['socWhy', 'socApply'],
      say: [tx('旬はなぜ安い? 時期をずらすと なぜ高く売れる?', 'Why is food cheap in season, and why does shifting the season pay?', '为什么应季便宜？为什么错季能卖高价？')], lessons: [RULES_LESSON(['veg'])], problems: [...UNIT('veg')] },
    { id: 's3', host: 'momomo', place: tx('くだもの山', 'Fruit Hill', '水果山'), topic: tx('くだもの', 'Fruit', '水果'), unlock: ['momomo'], moves: ['socKnow', 'socApply'],
      say: [tx('りんごは北、みかんは南。くだものは斜面が好き。なぜかな?', 'Apples north, mandarins south, fruit on slopes — why?', '苹果在北、橘子在南、水果爱坡地——为什么？')], lessons: [RULES_LESSON(['fruit'])], problems: [...UNIT('fruit')] },
    { id: 's4', host: 'umiushi', place: tx('魚の港', 'Fish Harbour', '鱼港'), topic: tx('魚と海流', 'Fish & currents', '鱼与洋流'), unlock: ['umiushi'], moves: ['socWhy', 'socMap'],
      say: [tx('寒流と暖流がぶつかる所は、魚がいっぱい。', 'Where cold and warm currents meet, fish abound.', '寒暖流交汇处鱼多。')], lessons: [RULES_LESSON(['fish'])], problems: [...UNIT('fish')] },
    { id: 's10', host: 'shimaena', place: tx('雪の大地', 'Snowy Land', '雪原大地'), topic: tx('寒い土地のくらし(北海道)', 'Life in a cold land (Hokkaido)', '寒冷土地上的生活（北海道）'), unlock: ['shimaena'], moves: ['socMap', 'socWhy'],
      say: [tx('シマエナガの ふるさと、北海道。寒い土地で、人は どんな工夫をしてきたかな?', 'The long-tailed tit’s home, Hokkaido. How have people adapted to the cold?', '北长尾山雀的故乡北海道。人们在寒冷的土地上想了哪些办法？')], lessons: [RULES_LESSON(['north'])], problems: [...UNIT('north'), fam('s8c1', 'climate', ['nemuro', 4]), fam('s8c2', 'climate', ['sapporo', 5])] },
  ],
});
// which skill each social problem trains (for the parent page)
const SOC_SKILL = {}; for (const c of WORLDS.find((w) => w.id === 'social').chapters) c.problems.forEach((d) => { try { SOC_SKILL[d.id] = d.make(d.sets[0]).skill; } catch (e) { /* bank not loaded */ } });
VARY.s4c1 = VARY.socClimate; VARY.s4c2 = VARY.socClimate; VARY.s4c4 = VARY.socClimate; VARY.s8c1 = VARY.socClimate; VARY.s8c2 = VARY.socClimate; VARY.s4c3 = VARY.socWet;
VARY.s5r1 = VARY.socRegion; VARY.s5r2 = VARY.socRegion; VARY.s6d1 = VARY.socDir; VARY.s6d2 = VARY.socDirRot; VARY.s6w1 = VARY.socWind;
VARY.s6y1 = VARY.socSymName; VARY.s6y2 = VARY.socSymPick; VARY.s7y1 = VARY.socSymName; VARY.s7y2 = VARY.socSymPick;
VARY.s6k1 = VARY.socScaleReal; VARY.s6k2 = VARY.socScaleMap; VARY.s6k3 = VARY.socScaleFind; VARY.s7h1 = VARY.socHillH; VARY.s7h2 = VARY.socHillSteep;
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(ST), ...SOC.DIRS, ...Object.values(SOC.SYM).map((s) => s[1]), ...SOC.REGIONS.map((r) => r[1]), ...Object.values(SOC.CITY).flatMap((c) => [c.n, c.f])];

// parent page: first-try rate by skill on the social isle
window.PARENT_PANELS = [...(window.PARENT_PANELS || []), (H) => {
  const by = {}; for (const [id, sk] of Object.entries(SOC_SKILL)) { const r = S.prob[id]; if (!r || !r.n) continue; const b = by[sk] || (by[sk] = { n: 0, f: 0, k: 0 }); b.n += r.n; b.f += r.first; b.k++; }
  const names = { know: H('用語・事実を思い出す', 'Recalling terms & facts', '回忆术语与事实'), map: H('地図で場所がわかる', 'Finding places on the map', '在地图上找位置'), read: H('グラフ・地図を読む', 'Reading charts & maps', '读图表'), why: H('理由・しくみを説明する', 'Explaining causes', '解释原因'), apply: H('しくみを知らない場所に使う', 'Using a rule on a new place', '把规律用到新地方'), calc: H('縮尺などの計算', 'Scale maths', '比例尺计算') };
  const rows = Object.keys(names).map((k) => { const b = by[k]; const pct = b ? Math.round(b.f / b.n * 100) : null;
    return `<tr><td>${names[k]}</td><td class="num">${b ? b.k : 0}</td><td class="num">${pct === null ? '—' : pct + '%'}</td><td>${pct === null ? '' : pct < 60 ? '⚠️' : pct >= 85 ? '◎' : ''}</td></tr>`; }).join('');
  return `<div class="panel"><h3>🗾 ${H('しゃかいの島: 技能べつ', 'Social isle: by skill', '社会岛：按技能')}</h3><p class="muted">${H('しゃかいの島の問題を、知識・地図・資料の読み取り・理由・計算に分けて、1回目で正解した割合を出しています。⚠️ が多い技能が「漏れ」の候補です。', 'Social-isle questions split into facts, map, chart reading, reasons and calculation, with the first-try rate. ⚠️ marks likely gaps.', '把社会岛的题目分成知识、地图、读图表、理由、计算五类，统计一次答对率。⚠️ 是可能的漏洞。')}</p>
    <div class="tw"><table class="ptable"><tr><th>${H('技能', 'Skill', '技能')}</th><th>${H('とりくんだ問題', 'Problems', '做过的题')}</th><th>${H('1回目で正解', 'First try', '一次答对')}</th><th></th></tr>${rows}</table></div></div>`;
}];
