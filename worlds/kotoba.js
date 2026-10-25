// ことばの島 (words): proverbs/idioms and key reading words for primary-school reading, each with the picture or origin behind it.
// Why-first for words: every answer shows the meaning AND why the words mean that (the image, the kanji), so it sticks and transfers.
// A word, not a question slot, is what she learns: S.vocab[word] is the word's record. A chapter visit is a fresh session of words
// that are due or new; review/farm/battle pick only due or new words. A word graduates after 3 clean recalls on review days.
const KB = () => (typeof KOTOBA !== 'undefined' ? KOTOBA : { proverb: [], word: [] });
const KT = {
  why: tx('なぜ?', 'Why?', '为什么？'), mean: tx('意味', 'Meaning', '意思'),
  form: tx('(＿＿には、文に合う形にかえて入るよ)', '(the word changes its ending to fit the sentence)', '（填入时词尾会按句子变化）'),
};
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(KT)];
const hasKanji = (e) => /[一-龯]/.test(e.w);
const kRuby = (e) => (hasKanji(e) ? `[${e.w}|${e.r}]` : e.w);
const kWhy = (e) => tx(`<b>${kRuby(e)}</b>: ${e.mean}${e.why ? `<br>💡 ${e.why}` : ''}`, `<b>${e.w}</b> — ${e.en}${e.why ? `<br>💡 (JP) ${e.why}` : ''}`, `<b>${e.w}</b>：${e.zh}${e.why ? `<br>💡（日文）${e.why}` : ''}`);
const kMean = (e) => tx(e.mean, `${e.mean}（${e.en}）`, `${e.mean}（${e.zh}）`);
// Places by kanji grade (MEXT 学年別漢字配当表, in force from 2020): a word's tier is the highest school grade of its kanji
// (0 = kana only, 7 = taught after primary school). Classical sayings (故事成語・四字熟語) get their own library.
const KGRADE = ["一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六", "引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時室社弱首秋週春書少場色食心新親図数西声星晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬売買麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話", "悪安暗医委意育員院飲運泳駅央横屋温化荷界開階寒感漢館岸起期客究急級宮球去橋業曲局銀区苦具君係軽血決研県庫湖向幸港号根祭皿仕死使始指歯詩次事持式実写者主守取酒受州拾終習集住重宿所暑助昭消商章勝乗植申身神真深進世整昔全相送想息速族他打対待代第題炭短談着注柱丁帳調追定庭笛鉄転都度投豆島湯登等動童農波配倍箱畑発反坂板皮悲美鼻筆氷表秒病品負部服福物平返勉放味命面問役薬由油有遊予羊洋葉陽様落流旅両緑礼列練路和", "愛案以衣位茨印英栄媛塩岡億加果貨課芽賀改械害街各覚潟完官管関観願岐希季旗器機議求泣給挙漁共協鏡競極熊訓軍郡群径景芸欠結建健験固功好香候康佐差菜最埼材崎昨札刷察参産散残氏司試児治滋辞鹿失借種周祝順初松笑唱焼照城縄臣信井成省清静席積折節説浅戦選然争倉巣束側続卒孫帯隊達単置仲沖兆低底的典伝徒努灯働特徳栃奈梨熱念敗梅博阪飯飛必票標不夫付府阜富副兵別辺変便包法望牧末満未民無約勇要養浴利陸良料量輪類令冷例連老労録", "圧囲移因永営衛易益液演応往桜可仮価河過快解格確額刊幹慣眼紀基寄規喜技義逆久旧救居許境均禁句型経潔件険検限現減故個護効厚耕航鉱構興講告混査再災妻採際在財罪殺雑酸賛士支史志枝師資飼示似識質舎謝授修述術準序招証象賞条状常情織職制性政勢精製税責績接設絶祖素総造像増則測属率損貸態団断築貯張停提程適統堂銅導得毒独任燃能破犯判版比肥非費備評貧布婦武復複仏粉編弁保墓報豊防貿暴脈務夢迷綿輸余容略留領歴", "胃異遺域宇映延沿恩我灰拡革閣割株干巻看簡危机揮貴疑吸供胸郷勤筋系敬警劇激穴券絹権憲源厳己呼誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処署諸除承将傷障蒸針仁垂推寸盛聖誠舌宣専泉洗染銭善奏窓創装層操蔵臓存尊退宅担探誕段暖値宙忠著庁頂腸潮賃痛敵展討党糖届難乳認納脳派拝背肺俳班晩否批秘俵腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟模訳郵優預幼欲翌乱卵覧裏律臨朗論"];
const KTIER = (() => { const g = {}; KGRADE.forEach((s, i) => { for (const c of s) g[c] = i + 1; }); return (w) => Math.max(0, ...[...w].filter((c) => /[一-龯]/.test(c)).map((c) => g[c] || 7)); })();
const kClassic = (e) => /故事|四字/.test(e.cat || '');
const KSLICE = {
  k1: () => KB().proverb.filter((e) => !kClassic(e) && KTIER(e.w) <= 3), k2: () => KB().proverb.filter((e) => !kClassic(e) && KTIER(e.w) >= 4 && KTIER(e.w) <= 6),
  k3: () => KB().proverb.filter((e) => kClassic(e) || KTIER(e.w) === 7),
  k4: () => KB().word.filter((e) => KTIER(e.w) <= 3), k5: () => KB().word.filter((e) => KTIER(e.w) === 4 || KTIER(e.w) === 5), k6: () => KB().word.filter((e) => KTIER(e.w) >= 6),
};
const kList = (ch) => (KSLICE[ch] ? KSLICE[ch]() : []);
let KBYW = null;
const kEntry = (w) => { if (!KBYW) { KBYW = {}; for (const e of [...KB().proverb, ...KB().word]) KBYW[e.w] = e; } return KBYW[w]; };
// near-synonyms never stand as each other's wrong options (both would fit the sentence)
let KSYN = null;
const synOf = (w) => { if (!KSYN) { KSYN = {}; for (const g of KB().syn || []) for (const a of g) for (const b of g) if (a !== b) (KSYN[a] || (KSYN[a] = new Set())).add(b); } return KSYN[w] || new Set(); };
function kOthers(list, e, n, seed, field) { const R = LEARN.tools(LEARN.rngOf(seed), 1), syn = synOf(e.w), seen = new Set([e[field]]);
  return R.shuffle(list.filter((x) => x.w !== e.w && !syn.has(x.w))).filter((x) => { if (seen.has(x[field])) return false; seen.add(x[field]); return true; }).slice(0, n); }
// reading distractors look like the answer: similar length, sharing a kanji when possible
function kReadOthers(list, e, n, seed) { const R = LEARN.tools(LEARN.rngOf(seed), 1), ks = new Set(e.w.match(/[一-龯]/g) || []);
  const cand = R.shuffle(list.filter((x) => x.w !== e.w && x.r !== e.r && hasKanji(x))).map((x) => ({ x, d: Math.abs(x.r.length - e.r.length) - (x.w.match(/[一-龯]/g) || []).filter((k) => ks.has(k)).length * 2 }));
  const seen = new Set([e.r]); return cand.sort((a, b) => a.d - b.d).map((c) => c.x).filter((x) => { if (seen.has(x.r)) return false; seen.add(x.r); return true; }).slice(0, n); }
const KGEN = {
  meaning: ([ch, w, seed]) => { const L = kList(ch), e = kEntry(w), opts = LEARN.tools(LEARN.rngOf('km' + seed), 1).shuffle([e, ...kOthers(L, e, 3, 'kmo' + seed, 'mean')]);
    return { kind: 'choice', skill: 'know', stars: 1, flat: true, word: e.w, story: tx(`「${kRuby(e)}」の意味は どれ?`, `What does “${e.w}” mean?`, `“${e.w}”是什么意思？`),
      options: opts.map((x) => ({ t: kMean(x), ok: x === e, fb: x === e ? null : tx(`それは「${kRuby(x)}」の意味。`, `That’s the meaning of “${x.w}”.`, `那是“${x.w}”的意思。`), tag: 'kotoba_mean' })),
      hints: e.why ? [tx(`ヒント: ${e.why.split('。')[0]}。`, `Hint (JP): ${e.why.split('。')[0]}.`, `提示（日文）：${e.why.split('。')[0]}。`)] : [], why: kWhy(e) }; },
  // every option in dictionary form, so the ending of the right one gives nothing away
  fill: ([ch, w, seed]) => { const L = kList(ch), e = kEntry(w), opts = LEARN.tools(LEARN.rngOf('kf' + seed), 1).shuffle([e, ...kOthers(L, e, 3, 'kfo' + seed, 'w')]), form = e.ans && e.ans !== e.w;
    const note = (k) => (form ? `<br><span class="muted">${KT.form[k]}</span>` : '');
    return { kind: 'choice', skill: 'apply', stars: 2, flat: true, word: e.w, story: tx(`${e.use}${note('ja')}`, `${e.use}${note('en')}`, `${e.use}${note('zh')}`),
      options: opts.map((x) => ({ t: tx(kRuby(x), x.w, x.w), ok: x === e, fb: x === e ? null : tx(`「${kRuby(x)}」は「${x.mean}」という意味。この文の場面に合うかな?`, `“${x.w}” means: ${x.en}. Does that fit this scene?`, `“${x.w}”的意思是：${x.zh}。符合这个场景吗？`), tag: 'kotoba_use' })),
      hints: [tx(`ヒント: 「${e.r[0]}」で始まることばだよ。`, `Hint: the scene is about “${e.en}”.`, `提示：这个场景说的是“${e.zh}”。`), tx(`ヒント: 「${e.mean}」という意味のことばが入るよ。`, `Hint (JP): ${e.mean}`, `提示（日文）：${e.mean}`)],
      why: form ? tx(`${kWhy(e).ja}<br>(この文では「${e.ans}」)`, kWhy(e).en, kWhy(e).zh) : kWhy(e) }; },
  reading: ([ch, w, seed]) => { const L = kList(ch), e = kEntry(w), opts = LEARN.tools(LEARN.rngOf('kr' + seed), 1).shuffle([e, ...kReadOthers(L, e, 3, 'kro' + seed)]);
    return { kind: 'choice', skill: 'know', stars: 1, flat: true, word: e.w, story: tx(`「${e.w}」の読み方は?`, `How is “${e.w}” read?`, `“${e.w}”怎么读？`),
      options: opts.map((x) => ({ t: tx(x.r, x.r, x.r), ok: x === e, fb: x === e ? null : tx(`それは「${x.w}」の読み方。`, `That’s how “${x.w}” is read.`, `那是“${x.w}”的读法。`), tag: 'kotoba_read' })),
      hints: [tx(`ヒント: 「${e.r[0]}」で始まるよ。`, `Hint: it starts with “${e.r[0]}”.`, `提示：以“${e.r[0]}”开头。`)], why: kWhy(e) }; },
};
// ---- per-word spacing: learned on the first clean solve, then 3 clean recalls on or after the due day (1, 3, 7 days apart) ----
const VS = () => S.vocab || (S.vocab = {});   // lazy: survives a reset that rebuilt S without asking this file
const vocabOf = (w) => VS()[w];
// due = learned, not graduated, due today or earlier; fresh = never seen; wait = learned, not due yet
function vocabState(ch, n = LEARN.dayNum(today())) { const due = [], fresh = [], wait = [], done = [];
  for (const e of kList(ch)) { const v = vocabOf(e.w); if (!v) fresh.push(e); else if (v.done) done.push(e); else if (v.due <= n) due.push(e); else wait.push(e); }
  due.sort((a, b) => vocabOf(a.w).due - vocabOf(b.w).due); return { due, fresh, wait, done }; }
const vocabToday = (ch) => { const s = vocabState(ch); return [...s.due, ...s.fresh].map((e) => e.w); };
// clean = independent (no wrong answer, no hint, not failed or hinted on this WORD earlier today: learn.js keys those by word)
function vocabMark(p, clean, hintOnly) { if (!p.word) return; const W = VS(), d = today(), n = LEARN.dayNum(d); let v = W[p.word];
  if (!clean) { if (!v) v = W[p.word] = { ok: 0, last: '', due: n + 1 };
    if (hintOnly) { v.ok = Math.max(0, v.ok - 1); v.due = n + 1; } else { v.ok = 0; v.due = n + 1; v.done = false; } }
  else if (!v) W[p.word] = { ok: 0, last: d, due: n + 1 };                                       // first clean solve: learned today
  else if (!v.done && v.last !== d && v.due <= n) { v.ok++; v.last = d; v.due = n + LEARN.GAPS[Math.min(v.ok, LEARN.GAPS.length - 1)]; if (v.ok >= LEARN.RETIRE) v.done = true; }
  save(); }
// progress.js (which defines EVT) loads after this file. A solve after a miss is already counted by the miss; a hinted solve steps back one.
window.addEventListener('DOMContentLoaded', () => { if (typeof EVT !== 'undefined') {
  EVT.sub('solve', ({ p, clean, hinted }) => { if (p.word && (clean || hinted)) vocabMark(p, clean, true); });
  EVT.sub('miss', ({ p }) => vocabMark(p, false)); } });
// review contexts: a due or new word for this question type; none → the slot is not offered (no fallback to graduated words)
const KTYPE = { m: 'meaning', f: 'fill', r: 'reading' };
const vPool = (ch, gen) => { const s = vocabState(ch), l = [...s.due, ...s.fresh]; return gen === 'reading' ? l.filter(hasKanji) : l; };
const vKind = (ch, gen) => (R) => { const l = vPool(ch, gen); if (!l.length) return null;
  const due = l.filter((e) => vocabOf(e.w)), fresh = l.filter((e) => !vocabOf(e.w)), src = due.length && (!fresh.length || R.rng() < 0.7) ? due : fresh;
  return [ch, R.pick(src).w, R.int(1, 9999)]; };
// a chapter visit = a session: due words first, but at least 3 new ones when there are any (so new words never starve), then early practice
const KSESS = {}, KCHAP = {};
function kSession(ch) { const c = KCHAP[ch], slots = c.problems.map((d) => KTYPE[d.id.slice(2, 3)]), s = vocabState(ch), R = LEARN.tools(LEARN.rngOf('ks|' + ch + '|' + Date.now()), 1);
  const nNew = Math.min(s.fresh.length, Math.max(3, slots.length - s.due.length)), keep = slots.length - nNew;
  // reading slots need kanji words: if the kept due words are short of them, today's new words start with kanji ones,
  // so reading slots never eat into the new-word quota
  const needK = Math.max(0, slots.filter((g) => g === 'reading').length - s.due.slice(0, keep).filter(hasKanji).length);
  const fk = s.fresh.filter(hasKanji).slice(0, Math.min(needK, nNew)), fresh = [...fk, ...s.fresh.filter((x) => !fk.includes(x))];
  const order = [...s.due.slice(0, keep), ...fresh.slice(0, nNew), ...s.due.slice(keep), ...R.shuffle(s.wait), ...R.shuffle(s.done)];
  const used = new Set(), pick = (ok) => { const e = order.find((x) => !used.has(x.w) && ok(x)) || kList(ch).find((x) => !used.has(x.w) && ok(x)); used.add(e.w); return e; };
  const words = []; slots.forEach((g, i) => { if (g === 'reading') words[i] = pick(hasKanji); });
  slots.forEach((g, i) => { if (g !== 'reading') words[i] = pick(() => true); });
  return { words: words.map((e) => e.w), seed: R.int(1, 9999) }; }
function kLive(ch, pi) { if (!KSESS[ch]) KSESS[ch] = kSession(ch); const p = getProblem(ch, pi, 0, [ch, KSESS[ch].words[pi], KSESS[ch].seed + pi]); p.setIdx = 'w:' + p.word; return p; }
const KFAM = (id, gen, set) => ({ id, sets: [set], make: (ps) => KGEN[gen](ps), avail: () => vPool(set[0], gen).length > 0 });
const KCH = [
  ['k1', 'kotsu', tx('ことわざの森①', 'Proverb Woods 1', '谚语林①'), tx('ことわざ（1〜3年の漢字）', 'Proverbs (grade 1–3 kanji)', '谚语（1〜3年级汉字）')],
  ['k2', 'fukuron', tx('ことわざの森②', 'Proverb Woods 2', '谚语林②'), tx('ことわざ（4〜6年の漢字）', 'Proverbs (grade 4–6 kanji)', '谚语（4〜6年级汉字）')],
  ['k3', 'rin', tx('故事成語の図書館', 'Classical Sayings Library', '典故成语图书馆'), tx('故事成語・四字熟語・むずかしい字のことわざ', 'Classical sayings, four-character idioms, proverbs with harder kanji', '典故成语、四字熟语、难字谚语')],
  ['k4', 'mugi', tx('ことば広場①', 'Word Square 1', '词语广场①'), tx('読解のキーワード（かな・1〜3年の漢字）', 'Key reading words (kana, grade 1–3 kanji)', '阅读关键词（假名、1〜3年级汉字）')],
  ['k5', 'popu', tx('ことば広場②', 'Word Square 2', '词语广场②'), tx('読解のキーワード（4・5年の漢字）', 'Key reading words (grade 4–5 kanji)', '阅读关键词（4、5年级汉字）')],
  ['k6', 'moko', tx('ことば広場③', 'Word Square 3', '词语广场③'), tx('読解のキーワード（6年・中学の漢字）', 'Key reading words (grade 6 and later kanji)', '阅读关键词（6年级及以后的汉字）')],
];
const KLESSON = { h: () => `<h3>${LANGTXT('🔑 ことばは「絵」と「漢字」で覚える', '🔑 Learn words through their picture and their kanji', '🔑 用“画面”和“汉字”记词语')}</h3><p>${LANGTXT('ことわざは、昔の人が見た場面を短く言ったもの。「鬼に金棒」なら、強い鬼が鉄の棒を持つ絵 → もっと強くなる。漢字の意味や、ことわざの場面を思いうかべると、意味を覚える手がかりになるよ。ただし、漢字を分けるだけでは分からない言葉もある。昔の話から生まれた言葉は、その話もたしかめよう。意味だけでなく、「どんな場面で使うか」もいっしょに覚えよう。', 'A proverb is a scene people once saw, said in a few words: 鬼に金棒 = a strong ogre with an iron club → even stronger. Picturing the kanji or the scene helps you remember — but some words can’t be worked out from their kanji, and sayings from old stories need the story. Learn the scene where a word is used, too.', '谚语是古人见过的场景的简短说法：鬼に金棒＝强壮的鬼拿着铁棒→更强。想象汉字的意思或谚语的场景能帮助记忆，但也有光拆汉字看不懂的词，出自古代故事的词要了解那个故事。也要记住在什么场景下使用。')}</p>` };
registerWorld({
  id: 'kotoba', x: 71, y: 95, host: 'kotsu', after: null, free: true,
  name: tx('ことばの島', 'Word Isle', '词语岛'), level: tx('国語・ことば', 'Japanese · words', '国语 · 词语'), lockTxt: tx('いつでも行けるよ', 'Always open', '随时可去'),
  intro: tx('ことわざ・故事成語・読解のキーワード。意味だけでなく「なぜその意味か」と「どんな場面で使うか」をセットで。', 'Proverbs, classical sayings and key reading words — with why they mean what they mean and when to use them.', '谚语、典故成语和阅读关键词——同时学“为什么是这个意思”和“什么场景用”。'),
  species: {}, moves: {}, tags: { kotoba_mean: tx('ことば: 意味', 'Words: meaning', '词语：意思'), kotoba_use: tx('ことば: 使う場面', 'Words: when to use', '词语：使用场景'), kotoba_read: tx('ことば: 読み方', 'Words: reading', '词语：读音') },
  chapters: KCH.map(([id, host, place, topic], ci) => { const L = kList(id), K = L.filter(hasKanji), probs = [];
    for (let j = 0; j < 4; j++) { probs.push(KFAM(`${id}m${j}`, 'meaning', [id, L[(j * 7) % L.length].w, j])); probs.push(KFAM(`${id}f${j}`, 'fill', [id, L[(j * 7 + 3) % L.length].w, j])); }
    if (ci >= 3) for (let j = 0; j < 2; j++) probs.push(KFAM(`${id}r${j}`, 'reading', [id, K[(j * 5 + 1) % K.length].w, j]));
    const c = { id, host, place, topic, unlock: [], moves: [], say: [tx('ことばの「絵」を思いうかべよう。', 'Picture the scene behind the words.', '想象词语背后的画面。')], lessons: ci === 0 || ci === 3 ? [KLESSON] : [], problems: probs,
      live: (pi) => kLive(id, pi), onOpen: () => { delete KSESS[id]; },
      grad: () => ({ g: L.filter((e) => (vocabOf(e.w) || {}).done).length, n: L.length }) };
    KCHAP[id] = c; return c; }),
});
for (const c of WORLDS.find((w) => w.id === 'kotoba').chapters) for (const d of c.problems) VARY[d.id] = vKind(c.id, KTYPE[d.id.slice(2, 3)]);
