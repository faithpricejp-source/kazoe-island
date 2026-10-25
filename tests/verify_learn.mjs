// Checks the learner model (learn.js) with scripted learners, no DOM:
// 1) retirement: 3 clean reviews on 3 different days retire a problem; same-day repeats and chapter solves don't count; a miss resets it;
// 2) "just within reach": simulated children of different true ability get ~3 out of 4 right on what review picks for them;
// 3) after two misses in a row the next pick is easier than usual;
// 4) generated variants are stable for a seed (a re-render shows the same numbers).
// Run: node tests/verify_learn.mjs
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const starsSrc = html.match(/function stars\(p\)\{.*\}/)[0];
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const stubs = 'const WORLDS=[];function registerWorld(w){WORLDS.push(w)};const T=()=>"",LANGTXT=()=>"",$=()=>null,$$=()=>[],snd=()=>{},numPad=()=>{},fracHTML=()=>"";';
const src = core + stubs + starsSrc + ['shape', 'frac', 'prob', 'inf', 'drill'].map((w) => read(`worlds/${w}.js`)).join('\n') + '\nconst ALLCH=Object.keys(PROBLEMS).map(id=>({id}));for(const w of WORLDS)for(const c of w.chapters){PROBLEMS[c.id]=c.problems;ALLCH.push({id:c.id})}\n'
  + read('learn.js') + read('worlds/vary_count.js') + read('worlds/vary_drill.js') + '\nreturn {LEARN,PROBLEMS,ALLCH,getProblem,stars};';
let api; try { api = new Function(src)(); } catch (e) { console.log('load failed', e.message); process.exit(1); }
const { LEARN, PROBLEMS, ALLCH, getProblem, stars } = api;
let fails = 0; const fail = (m) => { fails++; console.log('FAIL', m); };
const fresh = () => { const S = { cleared: {}, tags: {} }; LEARN.init(S); return S; };
const day = (k) => { const d = new Date(Date.UTC(2026, 9, 1 + k)); return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`; };
const P = (ch, i) => getProblem(ch, i, 0);

// 1) retirement
{ const S = fresh(), p = P('c2', 0);
  LEARN.record(S, p, undefined, { wrong: 0, hinted: false }, day(0));                // chapter solve: not a review
  if (S.card[p.id].ok !== 0) fail('a chapter solve counted as a review');
  LEARN.record(S, p, 'rev:a', { wrong: 0, hinted: false }, day(1));
  LEARN.record(S, p, 'rev:b', { wrong: 0, hinted: false }, day(1));                  // same day again
  if (S.card[p.id].ok !== 1) fail(`same-day review counted twice (ok=${S.card[p.id].ok})`);
  LEARN.record(S, p, 'farm:x', { wrong: 0, hinted: true }, day(2));                  // asked for a hint: one step back
  if (S.card[p.id].ok !== 0) fail('a hinted review did not step the card back');
  S.streak.miss = 0; LEARN.miss(S, p, day(2)); LEARN.record(S, p, "rev:c", { wrong: 1, hinted: false }, day(2));
  if (S.card[p.id].miss !== 1 || S.streak.miss !== 1) fail(`one failed attempt counted ${S.card[p.id].miss} misses / streak ${S.streak.miss}`);
  LEARN.record(S, p, 'rev:d', { wrong: 0, hinted: false }, day(2));                    // same-day retry after a failure: practice only
  if (S.card[p.id].ok !== 0) fail('a same-day retry after a failure counted as a review');
  for (const k of [3, 4, 5]) LEARN.record(S, p, 'bt:1', { wrong: 0, hinted: false }, day(k));
  { const q = P('c2', 1); q.scaffold = true; LEARN.record(S, q, 'rev:e', { wrong: 0, hinted: false }, day(3)); if ((S.card[q.id] || {}).ok) fail('a solve with the hint pre-opened counted as an independent review'); }
  if (!S.retired[p.id]) fail('3 clean reviews on 3 days did not retire the problem');
  S.cleared.c2 = 1; if (LEARN.pickReview(S, day(9), 20).some((q) => q.id === p.id)) fail('a retired problem came back in review');
  LEARN.miss(S, p, day(10)); if (S.retired[p.id]) fail('a miss did not bring a retired problem back');
  console.log('retirement rules ok'); }

// 2) "just within reach": simulated children; success follows σ(true ability − difficulty)
const sig = (x) => 1 / (1 + Math.exp(-x));
for (const truth of [-1.5, 0, 1.5]) {
  const S = fresh(); for (const c of ALLCH) S.cleared[c.id] = 1;
  let rng = 12345 + Math.round(truth * 100); const rand = () => ((rng = (rng * 1103515245 + 12345) % 2147483648) / 2147483648);
  let ok = 0, n = 0, late = 0, lateN = 0;
  for (let k = 0; k < 120; k++) for (const q of LEARN.pickReview(S, day(k), 3)) {
    const p = LEARN.variant(q.c, q.i, 'sim' + k + q.id, q.plan), d = LEARN.diffOf(p, p.level, p.scaffold); // true difficulty follows the same model
    const clean = rand() < sig(truth - d); if (!clean) LEARN.miss(S, p, day(k)); LEARN.record(S, p, 'rev:' + k, { wrong: clean ? 0 : 1, hinted: false }, day(k));
    ok += clean; n++; if (k >= 40) { late += clean; lateN++; }
  }
  const rate = late / lateN;
  console.log(`simulated child θ=${truth}: ${(rate * 100).toFixed(0)}% clean after warm-up (${(ok / n * 100).toFixed(0)}% overall, ${Object.keys(S.retired).length} retired)`);
  if (rate < 0.6 || rate > 0.92) fail(`child θ=${truth}: ${(rate * 100).toFixed(0)}% clean — outside the 60–92% "within reach" band`);
}

// 2b) the real answers correct the hand-set difficulty: a child for whom every problem is one step harder than the model thinks
{ const S = fresh(); for (const c of ALLCH) S.cleared[c.id] = 1; let rng = 777; const rand = () => ((rng = (rng * 1103515245 + 12345) % 2147483648) / 2147483648); let late = 0, lateN = 0;
  for (let k = 0; k < 120; k++) for (const q of LEARN.pickReview(S, day(k), 3)) { const p = LEARN.serve(S, q.c, q.i, 'cal' + k + q.id), d = LEARN.diffOf(p, p.level, p.scaffold) + 1;
    const clean = rand() < sig(0 - d); if (!clean) LEARN.miss(S, p, day(k), 'rev:x'); LEARN.record(S, p, 'rev:' + k, { wrong: clean ? 0 : 1, hinted: false, secs: 30 }, day(k)); if (k >= 40) { late += clean; lateN++; } }
  console.log(`harder-than-modelled child: calibration offset ${S.calib.toFixed(2)}, ${(late / lateN * 100).toFixed(0)}% clean after warm-up, ${S.log.length} logged events`);
  if (!(S.calib < -0.2)) fail(`calibration did not move toward the child's real difficulty (calib ${S.calib})`);
  if (late / lateN < 0.6) fail(`even after calibration the child gets only ${(late / lateN * 100).toFixed(0)}% clean`);
  if (!S.log.length || !S.log.every((e) => e.k && e.id && typeof e.pr === 'number')) fail('answer log missing or malformed'); }

// 3) two misses in a row → an easier pick
{ const S = fresh(); for (const c of ALLCH) S.cleared[c.id] = 1; for (const c of ALLCH) S.skill[c.id] = { t: 0.3, n: 5 };
  const avg = (picks) => picks.reduce((a, q) => a + q.plan.pr, 0) / picks.length;
  const normal = avg(LEARN.pickReview(S, day(0), 5)); S.streak.miss = 2; const eased = avg(LEARN.pickReview(S, day(0), 5));
  console.log(`predicted chance of picks: normal ${(normal * 100).toFixed(0)}%, after two misses ${(eased * 100).toFixed(0)}%`);
  if (!(eased > normal)) fail('after two misses the picks were not easier'); }

// 3b) a problem without a number generator is planned at its real level
{ const S = fresh(); S.cleared.d3 = 1; S.skill.d3 = { t: -2, n: 5 };
  for (const i of [5, 6]) { const pl = LEARN.plan(S, 'd3', i), v = LEARN.variant('d3', i, 'r6', pl); if (pl.level !== v.level || Math.abs(pl.pr - LEARN.chance(S, v, v.level, v.scaffold)) > 1e-9) fail(`d3#${i}: planned level ${pl.level} (${pl.pr.toFixed(2)}) but served level ${v.level}`); } }

// 3c) serve(): the chance used to choose equals the chance of the problem actually shown (astra PR7-08)
{ const S = fresh(); for (const c of ALLCH) { S.cleared[c.id] = 1; S.skill[c.id] = { t: -2, n: 5 }; } let k = 0;
  for (const c of ALLCH) for (let i = 0; i < PROBLEMS[c.id].length; i++) { const p = LEARN.serve(S, c.id, i, 'srv' + i); k++;
    if (Math.abs(p.plannedPr - LEARN.chance(S, p, p.level, p.scaffold)) > 1e-9) fail(`${p.id}: planned ${p.plannedPr} vs shown ${LEARN.chance(S, p, p.level, p.scaffold)}`); }
  console.log(`served problems: planned chance = shown chance for ${k}`); }

// 4) stable variants
{ const a = LEARN.variant('c3', 0, 'rev:2026-10-24:0', 1), b = LEARN.variant('c3', 0, 'rev:2026-10-24:0', 1), c = LEARN.variant('c3', 0, 'rev:2026-10-25:0', 1);
  if (JSON.stringify(a.params) !== JSON.stringify(b.params)) fail('the same seed gave different numbers');
  console.log(`variant c3a: ${JSON.stringify(a.params)} today, ${JSON.stringify(c.params)} tomorrow`); }

console.log(`\nlearner checks: ${fails} failures`);
process.exit(fails ? 1 : 0);
