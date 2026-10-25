// Checks the word isle: the vocabulary bank's shape; every word's generated questions (one right option, no duplicate options,
// no near-synonym as a wrong option, the same grammatical slot for all fill options, no translation of the answer in the question);
// per-word spacing (learned, then 3 clean recalls on due days, 1/3/7 apart; early practice does not count; a miss resets; a hint steps back);
// sessions (due words first but new words never starve, graduated words never come back as review, reading slots get kanji words);
// word-level same-day failure across question types; map/word questions never planned at a fake easier/harder level.
// Run: node tests/verify_kotoba.mjs
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const html = read('index.html');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const starsSrc = html.match(/function stars\(p\)\{.*\}/)[0];
let DAY = '2026-10-1';
const stubs = 'const WORLDS=[];function registerWorld(w){WORLDS.push(w);for(const c of w.chapters)PROBLEMS[c.id]=c.problems};const T=(o)=>o&&o.ja?o.ja:String(o||""),LANGTXT=(a)=>a,$=()=>null,$$=()=>[],snd=()=>{},numPad=()=>{},fracHTML=()=>"";const S={prob:{}};const window={addEventListener(){}};const HOOK={};const save=()=>{};';
const api = new Function('getDay', core + stubs + starsSrc + '\nconst today=()=>getDay();const ALLCH=[];\n' + read('learn.js') + read('worlds/data/kotoba_bank.js') + read('worlds/kotoba.js')
  + '\nreturn {KOTOBA,WORLDS,LEARN,AUDIT,S,vocabMark,vocabState,vPool,kList,kLive,KSESS,KGEN,kEntry,synOf,getProblem,PROBLEMS};')(() => DAY);
const { KOTOBA, WORLDS, LEARN, AUDIT, S, vocabMark, vocabState, vPool, kList, kLive, KSESS, KGEN, kEntry, synOf, getProblem } = api;
let fails = 0, n = 0; const fail = (m) => { fails++; if (fails < 40) console.log('FAIL', m); };
const all = [...KOTOBA.proverb, ...KOTOBA.word], seen = new Set();
for (const e of all) { if (seen.has(e.w)) fail(`duplicate ${e.w}`); seen.add(e.w);
  for (const f of ['w', 'r', 'mean', 'use', 'en', 'zh']) if (!e[f]) fail(`${e.w}: missing ${f}`);
  if ((e.use.match(/＿＿/g) || []).length !== 1) fail(`${e.w}: use needs exactly one ＿＿`);
  if (!/^[ぁ-ゖー・ 　]+$/.test(e.r)) fail(`${e.w}: reading ${e.r} not hiragana`); }
for (const g of KOTOBA.syn) for (const w of g) if (!seen.has(w)) fail(`syn group names unknown ${w}`);
console.log(`vocabulary: ${KOTOBA.proverb.length} expressions, ${KOTOBA.word.length} words, ${KOTOBA.syn.length} near-synonym groups`);
// every word in every question type, two seeds each
const chOf = {}; for (const ch of ['k1', 'k2', 'k3', 'k4', 'k5', 'k6']) for (const e of kList(ch)) chOf[e.w] = ch;
const strip = (s) => String(s).replace(/\[([^|\]]+)\|[^\]]+\]/g, '$1');
for (const e of all) for (const gen of ['meaning', 'fill', 'reading']) for (const seed of [1, 2]) {
  if (gen === 'reading' && !/[一-龯]/.test(e.w)) continue; n++; AUDIT.list = []; AUDIT.on = true; const p = KGEN[gen]([chOf[e.w], e.w, seed]); AUDIT.on = false;
  for (const o of AUDIT.list) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`${gen} ${e.w} missing language`);
  if (p.word !== e.w) fail(`${gen} ${e.w}: asks about ${p.word}`);
  const ok = p.options.filter((o) => o.ok); if (ok.length !== 1) fail(`${gen} ${e.w}: ${ok.length} right`);
  const t = p.options.map((o) => o.t.ja); if (new Set(t).size !== t.length) fail(`${gen} ${e.w}: duplicate options ${t}`);
  if (gen !== 'reading') { const syn = synOf(e.w); for (const o of p.options) { const w = gen === 'fill' ? strip(o.t.ja) : kList(chOf[e.w]).find((x) => x.mean === o.t.ja)?.w; if (w && w !== e.w && syn.has(w)) fail(`${gen} ${e.w}: near-synonym ${w} offered as wrong`); } }
  if (gen === 'fill' && e.ans && e.ans !== e.w && p.options.some((o) => strip(o.t.ja) === e.ans)) fail(`fill ${e.w}: answer shown in its sentence form`);
  // (a Chinese gloss that is the word itself, like 抵抗, is not a giveaway)
  if (gen !== 'reading' && ((!e.w.includes(e.en) && p.story.en.includes(e.en)) || (!e.w.includes(e.zh) && p.story.zh.includes(e.zh)))) fail(`${gen} ${e.w}: question gives the translation`); }
console.log(`generated word questions: ${n}`);
// the review's counterexamples: both fit the sentence, so the other must never be a wrong option
for (const [a, b] of [['さるも木から落ちる', '弘法にも筆の誤り'], ['猫に小判', '豚に真珠'], ['配慮', '気配り'], ['楽天的', '楽観的'], ['障害', '支障']]) {
  if (!seen.has(a) || !seen.has(b)) { fail(`counterexample pair missing ${a}/${b}`); continue; }
  for (let s = 0; s < 300; s++) for (const [x, y] of [[a, b], [b, a]]) { if (chOf[x] !== chOf[y]) continue; const p = KGEN.fill([chOf[x], x, s]); if (p.options.some((o) => strip(o.t.ja) === y)) { fail(`fill ${x} seed ${s} offers ${y}`); break; } } }
console.log('near-synonym counterexamples never offered');
// spacing
const W = (w) => S.vocab[w];
{ const p = { word: KOTOBA.word[0].w }; DAY = '2026-10-1'; vocabMark(p, true);
  if (W(p.word).ok !== 0 || W(p.word).due !== LEARN.dayNum('2026-10-2')) fail('first clean solve should be "learned", due next day');
  vocabMark(p, true); if (W(p.word).ok !== 0) fail('same-day repeat counted');
  DAY = '2026-10-2'; vocabMark(p, true); if (W(p.word).ok !== 1 || W(p.word).due !== LEARN.dayNum('2026-10-5')) fail(`review 1 should set due +3: ${JSON.stringify(W(p.word))}`);
  DAY = '2026-10-3'; vocabMark(p, true); if (W(p.word).ok !== 1) fail('early practice (before due) counted');
  DAY = '2026-10-5'; vocabMark(p, true); if (W(p.word).ok !== 2 || W(p.word).due !== LEARN.dayNum('2026-10-12')) fail(`review 2 should set due +7: ${JSON.stringify(W(p.word))}`);
  DAY = '2026-10-12'; vocabMark(p, true); if (!W(p.word).done) fail('3 reviews did not graduate the word');
  DAY = '2026-10-20'; if (vPool('k4', 'meaning').some((e) => e.w === p.word)) fail('graduated word offered for review');
  const q = { word: KOTOBA.word[1].w }; DAY = '2026-10-1'; vocabMark(q, true); DAY = '2026-10-2'; vocabMark(q, true); DAY = '2026-10-5'; vocabMark(q, false, true);
  if (W(q.word).ok !== 0 || W(q.word).due !== LEARN.dayNum('2026-10-6')) fail(`hint should step back one: ${JSON.stringify(W(q.word))}`);
  vocabMark(q, false); if (W(q.word).ok !== 0 || W(q.word).done) fail('miss did not reset');
  console.log('per-word spacing ok (learn → +1 → +3 → +7 → graduated; early practice ignored)'); }
// reset rebuilt S without vocab: the next solve must still be recorded
{ delete S.vocab; DAY = '2026-10-21'; vocabMark({ word: KOTOBA.word[2].w }, true); if (!S.vocab || !S.vocab[KOTOBA.word[2].w]) fail('word not recorded after a reset'); else console.log('records survive a reset'); }
// sessions: everything graduated → review slots unavailable (no fallback); new words never starve behind failing due words
{ S.vocab = {}; DAY = '2026-11-1'; const L = kList('k4'), dn = LEARN.dayNum(DAY);
  for (const e of L) S.vocab[e.w] = { ok: 3, last: '', due: 0, done: true };
  const d = PROBLEMS_OF('k4'); if (d.some((x) => x.avail())) fail('slots offered with every word graduated');
  if (d.some((x) => LEARN.varyParams(x, 'z', 1))) fail('review params produced with every word graduated');
  S.vocab = {}; L.slice(0, 60).forEach((e) => { S.vocab[e.w] = { ok: 0, last: '', due: dn }; });
  for (let day = 0; day < 5; day++) { delete KSESS.k4; const p0 = kLive('k4', 0); const ws = KSESS.k4.words, fresh = ws.filter((w) => !S.vocab[w]);
    if (fresh.length < 3) fail(`day ${day}: only ${fresh.length} new words in a session behind 60 due words`);
    ws.forEach((w) => { if (S.vocab[w]) S.vocab[w].due = dn; else S.vocab[w] = { ok: 0, last: '', due: dn }; }); }
  delete KSESS.k4; for (let i = 0; i < PROBLEMS_OF('k4').length; i++) { const p = kLive('k4', i); if (p.word !== KSESS.k4.words[i]) fail(`session slot ${i} asks ${p.word} not ${KSESS.k4.words[i]}`);
    if (/r\d$/.test(p.id) && !/[一-龯]/.test(p.word)) fail(`reading slot got ${p.word}`); }
  if (new Set(KSESS.k4.words).size !== KSESS.k4.words.length) fail('session repeats a word');
  console.log('sessions: due first, ≥3 new words, no graduated fallback, reading slots get kanji words'); }
function PROBLEMS_OF(ch) { return api.PROBLEMS[ch]; }
// a miss on a word's meaning question makes its fill question the same day not independent
{ S.vocab = {}; LEARN.init(S); DAY = '2026-11-2'; const w = kList('k4')[5].w, pm = getProblem('k4', 0, 0, ['k4', w, 1]), pf = getProblem('k4', 1, 0, ['k4', w, 2]);
  LEARN.miss(S, pm, DAY, 'ch'); const r = LEARN.record(S, pf, 'ch', { wrong: 0, hinted: false }, DAY); if (r.independent) fail('same-day failure on the word did not carry to its other question');
  if (S.card[pm.id] || S.card[pf.id]) fail('word questions created slot review cards'); else console.log('same-day failure is per word; no slot cards'); }
// no fake difficulty levels for words
{ const p = getProblem('k4', 0, 0); const pl = LEARN.planFor(S, p); if (pl.level !== 1) fail(`word question planned at level ${pl.level}`); else console.log('word questions planned at level 1 only'); }
console.log(`\nword checks: ${fails} failures`);
process.exit(fails ? 1 : 0);
