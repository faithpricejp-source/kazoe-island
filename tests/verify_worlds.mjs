// Checks the four extra worlds (shape / frac / prob / inf) with judges that do NOT reuse the world's own math:
// angles are measured from the drawn coordinates, areas by sampling points inside polygons, nets against the
// known count of 11 cube nets and hand-folded answers, probabilities by closed formulas vs. the world's enumeration.
// Also: each misconception value differs from the answer, choice problems have exactly one right option,
// and every string created while building the problems has ja/en/zh.
// Run: node tests/verify_worlds.mjs
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const files = ['shape', 'frac', 'prob', 'inf', 'drill'].map((w) => readFileSync(new URL(`worlds/${w}.js`, root), 'utf8'));
const stubs = 'const WORLDS=[];function registerWorld(w){WORLDS.push(w)};const T=()=>"",LANGTXT=()=>"",$=()=>null,$$=()=>[],snd=()=>{},numPad=()=>{},fracHTML=()=>"";';
const learn = ['learn.js', 'worlds/vary_count.js', 'worlds/vary_drill.js'].map((f) => readFileSync(new URL(f, root), 'utf8'));
const api = new Function(core + stubs + files.join('\n') + '\nconst ALLCH=[];' + learn.join('\n') + '\nfor(const w of WORLDS)for(const c of w.chapters)PROBLEMS[c.id]=c.problems;\nreturn {WORLDS,AUDIT,GEO,NETS,nCr,sameVal,LEARN};')();
const { WORLDS, AUDIT, GEO, NETS, nCr, sameVal, LEARN } = api;
// generated variants (new numbers for review): every level, 12 seeds, duplicates dropped; the drill isle must declare a generator or null
let generated = 0;
function variants(w, d) {
  const f = LEARN.VARY[d.id];
  if (f === null) return [];
  if (!f) { if (w.id === 'drill') fail(`${d.id} has no number generator (or null)`); return []; }
  const out = new Map();
  for (const L of [0, 1, 2]) for (let s = 0; s < 12; s++) { const ps = LEARN.varyParams(d, 'test' + s, L); if (!ps) { fail(`${d.id} generator gave nothing new at level ${L}`); continue; } out.set(JSON.stringify(ps), ps); }
  return [...out.values()];
}

let fails = 0, n = 0;
const fail = (m) => { fails++; console.log('FAIL', m); };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;
const fr = (a, b) => { const g = (x, y) => (y ? g(y, x % y) : x); const k = g(Math.abs(a), Math.abs(b)); return [a / k, b / k]; };
const eqv = (x, y) => (Array.isArray(x) || Array.isArray(y) ? sameVal(x, y) : near(x, y));

// point-in-polygon sampling: an area estimate independent of the shoelace formula
function sampleArea(poly, W, H, k = 60) {
  const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  let hit = 0; for (let i = 0; i < W * k; i++) for (let j = 0; j < H * k; j++) if (inside((i + 0.5) / k, (j + 0.5) / k)) hit++;
  return hit / (k * k);
}
// geometric brute force for the fan figure: count point triples that pairwise share a drawn line but are not all on one line
function fanTrianglesBrute(k, layers) {
  const pts = ['A', ...Array.from({ length: k }, (_, i) => 'B' + i), ...(layers === 2 ? Array.from({ length: k }, (_, i) => 'C' + i) : [])];
  const lines = [['A', ...Array.from({ length: k }, (_, i) => 'B' + i)].slice(1), ...Array.from({ length: k }, (_, i) => ['A', 'B' + i, ...(layers === 2 ? ['C' + i] : [])])];
  if (layers === 2) lines.push(Array.from({ length: k }, (_, i) => 'C' + i));
  const share = (p, q) => lines.some((l) => l.includes(p) && l.includes(q)), col = (p, q, r) => lines.some((l) => l.includes(p) && l.includes(q) && l.includes(r));
  let c = 0; for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) for (let d = b + 1; d < pts.length; d++) { const [p, q, r] = [pts[a], pts[b], pts[d]]; if (share(p, q) && share(q, r) && share(p, r) && !col(p, q, r)) c++; }
  return c;
}
// all free hexominoes, to check the cube-net classifier finds exactly 11 nets among 35 shapes
function hexominoes() {
  let shapes = new Set([JSON.stringify([[0, 0]])]);
  for (let size = 1; size < 6; size++) { const next = new Set(); for (const s of shapes) { const cells = JSON.parse(s); for (const [r, c] of cells) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (cells.some(([a, b]) => a === nr && b === nc)) continue; next.add(NETS.canon([...cells, [nr, nc]])); } } shapes = new Set([...next].map((k) => JSON.stringify(k.split(';').map((p) => p.split(',').map(Number))))); }
  return [...shapes].map((s) => JSON.parse(s));
}
const hex = hexominoes(), netCount = hex.filter((h) => NETS.isCubeNet(h)).length;
if (hex.length !== 35) fail(`free hexominoes = ${hex.length}, expected 35`); if (netCount !== 11) fail(`cube nets = ${netCount}, expected 11`);
console.log(`hexominoes ${hex.length}, cube nets ${netCount}`);

// ---- drill (training isle): brute force written independently of worlds/drill.js ----
const D6 = [1, 2, 3, 4, 5, 6];
const cnt2 = (f) => { let c = 0; for (const a of D6) for (const b of D6) if (f(a, b)) c++; return c; };
const cnt3 = (f) => { let c = 0; for (const a of D6) for (const b of D6) for (const d of D6) if (f(a + b + d)) c++; return c; };
const COND = { sumEq: (v) => (a, b) => a + b === v, sumGe: (v) => (a, b) => a + b >= v, prodEq: (v) => (a, b) => a * b === v, prodMult: (v) => (a, b) => (a * b) % v === 0, div: () => (a, b) => a % b === 0 };
function payAll(den, tot, mins, maxs, cap) { const out = []; for (let x = mins[0]; x <= Math.min(maxs[0], tot / den[0]); x++) for (let y = mins[1]; y <= Math.min(maxs[1], tot / den[1]); y++) for (let z = mins[2]; z <= Math.min(maxs[2], tot / den[2]); z++) if (x * den[0] + y * den[1] + z * den[2] === tot && (cap === undefined || x + y + z <= cap)) out.push([x, y, z]); return out; }
function amountsAll(coins) { const s = new Set(); const [[v0, c0], [v1, c1], [v2, c2]] = coins; for (let x = 0; x <= c0; x++) for (let y = 0; y <= c1; y++) for (let z = 0; z <= c2; z++) s.add(x * v0 + y * v1 + z * v2); s.delete(0); return s.size; }
function knockout(n) { let g = 0, r = 0; while (n > 1) { g += Math.floor(n / 2); n = Math.ceil(n / 2); r++; } return { g, r }; }
function pairs(n) { let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++; return c; }
function sureVotes(N, k, cands) { for (let a = 0; a <= N; a++) { const rest = N - a; if (!(cands - 1 >= k && k * a <= rest)) return a; } }
function fixedCVotes(N, c) { for (let a = 0; a <= N - c; a++) { const b = N - c - a; if ([b, c].filter((x) => x >= a).length <= 1) return a; } }
function sumo5(cond) { const g = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) g.push([i, j]); let n = 0; for (let m = 0; m < 1 << g.length; m++) { const w = [0, 0, 0, 0, 0], beat = new Set(); g.forEach(([i, j], t) => { const [x, y] = (m >> t) & 1 ? [j, i] : [i, j]; w[x]++; beat.add(x * 10 + y); }); if (cond(w, beat)) n++; } return n; }
const drillJudge = {
  d1a: ([[k, v]]) => cnt2(COND[k](v)), d1b: ([[k, v]]) => cnt2(COND[k](v)), d1c: ([[k, v]]) => cnt2(COND[k](v)), d1d: ([[k, v]]) => cnt2(COND[k](v)), d1e: () => cnt2(COND.div()),
  d1f: ([[, v]]) => cnt3((s) => s === v), d1g: ([[, v]]) => cnt3((s) => s >= v), d1h: ([[p, q, r]]) => cnt2((a, b) => p * a + q * b < r),
  d2a: ([coins]) => amountsAll(coins), d2b: ([coins]) => amountsAll(coins), d2c: ([[den, tot]]) => payAll(den, tot, [0, 0, 0], [99, 99, 99]).length,
  d2d: ([[den, tot]]) => payAll(den, tot, [1, 1, 1], [99, 99, 99]).length, d2e: ([[den, tot, cap]]) => payAll(den, tot, [1, 1, 1], [99, 99, 99], cap).length,
  d2f: ([[den, maxs, tot]]) => payAll(den, tot, [0, 0, 0], maxs).length, d2g: ([[den, maxs, tot]]) => Math.max(...payAll(den, tot, [0, 0, 0], maxs).map((t) => t[0] + t[1] + t[2])),
  d2h: ([[den, tot, min]]) => payAll(den, tot, [min, min, min], [99, 99, 99]).length,
  d3a: ([n]) => pairs(n), d3b: ([n]) => knockout(n).g, d3c: ([N, g]) => (N / g) * pairs(g) + knockout(N / g).g, d3d: ([N, g, top]) => g - 1 + knockout((N / g) * top).r, d3e: ([N, g, top]) => (N / g) * pairs(g) + knockout((N / g) * top).g,
  d3f: () => sumo5((w, beat) => w[2] === 1 && beat.has(23) && w[3] === 2),
  d2i: ([[den, tot, min]]) => payAll(den, tot, [min, min, min], [99, 99, 99]).length, d3g: () => sumo5((w, beat) => beat.has(30) && w[0] === 3 && w[3] === 2), d4f: ([N, c]) => fixedCVotes(N, c),
  d4a: ([N, k, c]) => sureVotes(N, k, c), d4b: ([N, k, c]) => sureVotes(N, k, c), d4c: ([N, k, c]) => sureVotes(N, k, c), d4d: ([N, c]) => fixedCVotes(N, c), d4e: ([N, k, c]) => sureVotes(N, k, c),
};
// fixed parameter sets of our own (not taken from any book): each training problem's make() must agree with the brute-force judge
const OWN = [
  ['d1a', [['sumEq', 9]]], ['d1b', [['sumGe', 9]]], ['d1c', [['prodEq', 6]]], ['d1d', [['prodMult', 3]]], ['d1e', [['div', 0]]],
  ['d1f', [['eq', 7]]], ['d1f', [['eq', 9]]], ['d1g', [['ge', 14]]], ['d1h', [[3, 1, 12]]],
  ['d2a', [[[10, 4], [50, 1], [100, 3]]]], ['d2b', [[[10, 3], [50, 1], [100, 2]]]], ['d2c', [[[10, 50, 100], 300]]], ['d2d', [[[50, 100, 500], 1200]]],
  ['d2e', [[[10, 50, 100], 250, 8]]], ['d2f', [[[1, 5, 10], [7, 4, 5], 48]]], ['d2g', [[[1, 5, 10], [7, 4, 5], 48]]], ['d2h', [[[5, 10, 20], 50, 0]]], ['d2i', [[[5, 10, 20], 70, 1]]],
  ['d3a', [8]], ['d3a', [9]], ['d3b', [9]], ['d3c', [36, 6]], ['d3d', [16, 4, 1]], ['d3e', [24, 4, 2]],
  ['d4a', [100, 2, 5]], ['d4b', [90, 2, 3]], ['d4c', [90, 2, 4]], ['d4d', [90, 30]], ['d4f', [90, 24]],
];
// the sumo counter itself, against counts that follow from the rules alone: 10 bouts → 1024; one wrestler's 4 bouts fixed → 2^6
const SUMO_CHECK = [[() => true, 1024], [(w) => w[0] === 4, 64], [(w) => w[2] === 0, 64], [(w, b) => b.has(10) && b.has(21), 256]];
const judge = {
  g2a: () => sampleArea([[0, 0], [6, 0], [6, 2], [2, 2], [2, 5], [0, 5]], 6, 5),
  g2b: () => sampleArea([[0, 1], [5, 0], [3, 4]], 5, 4),
  g2c: ([w, h, t]) => sampleArea([[t, 0], [0, h], [w, h]], w, h),
  g2d: ([a, b]) => sampleArea([[a, 0], [a + b, a], [b, a + b], [0, b]], a + b, a + b),
  g2e: ([w, h, r]) => (w - r) * (h - r),
  g3a: ([m, k]) => nCr(m + 1, 2) * nCr(k + 1, 2), g3b: ([m, k]) => nCr(m + 1, 2) * nCr(k + 1, 2),
  g3c: ([m]) => Array.from({ length: m }, (_, i) => (i + 1) ** 2).reduce((a, b) => a + b, 0),
  g3d: ([k, layers]) => fanTrianglesBrute(k, layers),
  g4a: () => 3, g4b: ([v]) => [5, 3][v], g4c: ([m]) => 12 * (m - 2),
  f1a: ([, k]) => k, f1b: ([m, a, b]) => m * a / b, f1c: ([m, k]) => [k, m], f2a: ([a, b]) => fr(a, b), f2b: ([a, b, d]) => a * d / b, f2d: ([a, b]) => { for (let x = Math.max(a, b); ; x++) if (x % a === 0 && x % b === 0) return x; },
  f3a: ([x, y]) => fr(x[0] * y[1] + y[0] * x[1], x[1] * y[1]), f3b: ([x, y]) => fr(x[0] * y[1] - y[0] * x[1], x[1] * y[1]), f3c: ([w, y]) => fr(w * y[1] - y[0], y[1]), f3d: () => 1,
  f4a: ([x, y]) => fr((x[1] - x[0]) * (y[1] - y[0]), x[1] * y[1]), f4b: ([a, b, v]) => v * b / a, f4c: ([x, y, v]) => v * x[1] * y[1] / ((x[1] - x[0]) * (y[1] - y[0])),
  p1a: ([k]) => fr(Math.floor(6 / k), 6), p1b: ([m]) => fr(m, 2 ** m), p1c: ([r, w]) => fr(r, r + w), p2a: ([s]) => fr(6 - Math.abs(s - 7), 36), p2b: ([v]) => (v ? [1, 6] : [3, 4]), p2c: () => 7,
  p3a: ([m]) => fr(2 ** m - 1, 2 ** m), p3b: ([m]) => fr(6 ** m - 5 ** m, 6 ** m), p3c: ([r, w]) => fr(nCr(r + w, 2) - nCr(r, 2), nCr(r + w, 2)), p4a: ([m]) => m / 6, p4b: () => [1, 2],
  i1a: ([m]) => fr(2 ** m - 1, 2 ** m), i1b: ([m]) => [1, 2 ** m], i2b: ([m]) => 2 * m, i2c: ([k]) => 2 * k - 1, i3b: ([e]) => e / 2,
};
// choice problems: which option text must be the right one (checked by structure, not by the world's own flag)
const drillProblems = Object.fromEntries((WORLDS.find((w) => w.id === 'drill') || { chapters: [] }).chapters.flatMap((c) => c.problems.map((d) => [d.id, d])));
for (const [id, set] of OWN) { const got = drillProblems[id].make(set).ans, want = drillJudge[id](set); if (JSON.stringify(got) !== JSON.stringify(want)) fail(`fixed set ${id}${JSON.stringify(set)}: make() gives ${got}, brute force ${want}`); }
for (const [f, want] of SUMO_CHECK) if (sumo5(f) !== want) fail(`sumo brute counter gives ${sumo5(f)} for a rule-derived case, expected ${want}`);
console.log(`fixed parameter sets checked: ${OWN.length} cases`);
{ const p1 = drillProblems.d4d.make([100, 40]), p2 = drillProblems.d4f.make([100, 28]); if (!(p1.ans === Math.floor(60 / 2) + 1 && p2.ans === 28 + 1)) fail('d4d sets must fall on different branches (beat B / beat C)'); }
const choiceRight = { f1d: 0, f2c: 1, p2c: 2, p4a: 1, p4b: 0, p4c: 2, i1c: 1, i1d: 1, i2a: 1, i3a: 2, i3c: 1, i4b: 1 };
const noJudge = new Set(['g1a', 'g1b', 'g1c', 'g1d', 'g1e', 'i4a']); // checked separately below

// parent-page labels: tags defined by the worlds plus the shared ones in index.html
const TAGKEYS = new Set([...WORLDS.flatMap((w) => Object.keys(w.tags || {})), ...[...html.split('const TAGS={')[1].split('\n};')[0].matchAll(/^ ?(\w+):tx\(/gm)].map((m) => m[1]), ...[...html.split('const TAGS={')[1].split('\n};')[0].matchAll(/ (\w+):tx\(/g)].map((m) => m[1])]);
AUDIT.on = true;
for (const w of WORLDS) for (const ch of w.chapters) for (const d of ch.problems) [...d.sets.map((s) => [s, false]), ...variants(w, d).map((s) => [s, true])].forEach(([set, gen]) => {
  AUDIT.list = []; n++;
  const p = d.make(set), tag = `${d.id}${gen ? '~' : ''}${JSON.stringify(set)}`;
  if (gen) { generated++; if (typeof p.ans === 'number' && p.ans > 10000) fail(`${tag} answer ${p.ans} too big`);
    if (d.id === 'd4d' && p.ans !== Math.floor((set[0] - set[1]) / 2) + 1) fail(`${tag} left the beat-B branch`);
    if (d.id === 'd4f' && p.ans !== set[1] + 1) fail(`${tag} left the beat-C branch`);
    // astra r6: the complement hint needs a prime; a square product adds an uncovered (k,k) branch; names must match the candidate count
    if (d.id === 'd1d' && ![2, 3, 5].includes(set[0][1])) fail(`${tag} composite multiple breaks the complement hint`);
    if (d.id === 'd1c' && Number.isInteger(Math.sqrt(set[0][1]))) fail(`${tag} square product adds a same-number branch`);
    if (d.id === 'd4c' && !String(p.story.ja).includes(`A〜${'ABCDEFGH'[set[2] - 1]}`)) fail(`${tag} candidate names don't match ${set[2]} candidates`); }
  if (p.kind === 'custom' && p.def) { // angle board: every stated angle must match the drawing, target must be reachable
    for (const [k, A] of Object.entries(p.def.ang)) { const m = GEO.angleAt(p.def.pts[A.v], p.def.pts[A.a], p.def.pts[A.b]); if (!near(m, A.val, 0.01)) fail(`${tag} angle ${k}: drawn ${m.toFixed(3)} vs stated ${A.val}`); }
    const known = new Set(Object.keys(p.def.ang).filter((k) => p.def.ang[k].given)); let grew = true;
    while (grew) { grew = false; for (const [k, ders] of Object.entries(p.def.der)) if (!known.has(k) && ders.some((x) => x.from.every((f) => known.has(f)))) { known.add(k); grew = true; } }
    const W = p.def.w || 400, H = p.def.h || 300; // every point (and its label room) must be inside the drawing
    for (const [k, P] of Object.entries(p.def.pts)) if (P[0] < 8 || P[0] > W - 8 || P[1] < 8 || P[1] > H - 8) fail(`${tag} point ${k} at ${P.map((v) => v.toFixed(1))} is outside the ${W}×${H} picture`);
    const tgt = Object.keys(p.def.ang).find((k) => p.def.ang[k].target); if (!known.has(tgt)) fail(`${tag} target angle not reachable by the rules`);
    if (p.def.ang[tgt].val !== p.ans) fail(`${tag} ans ${p.ans} ≠ target ${p.def.ang[tgt].val}`);
    for (const [k, ders] of Object.entries(p.def.der)) for (const x of ders) for (const r of [x.r]) if (!['line', 'tri', 'ext', 'vert', 'par', 'iso', 'poly', 'parts'].includes(r)) fail(`${tag} unknown rule ${r}`);
  } else if (d.id === 'i4a') {
    const rows = set[0]; if (!rows.every((r, i) => r[i] !== p.ans[i])) fail(`${tag} diagonal row matches a row`); if (rows.includes(p.ans)) fail(`${tag} diagonal row is on the list`);
  } else if (drillJudge[d.id]) { const j = drillJudge[d.id](set); if (!eqv(p.ans, j)) fail(`${tag} ans ${JSON.stringify(p.ans)} ≠ brute ${JSON.stringify(j)}`);
  } else if (judge[d.id]) { const j = judge[d.id](set); const ok = /^g2[a-d]$/.test(d.id) ? near(p.ans, j, 0.1) : eqv(p.ans, j); if (!ok) fail(`${tag} ans ${JSON.stringify(p.ans)} ≠ judge ${JSON.stringify(j)}`); }
  else if (p.kind !== 'choice' && !noJudge.has(d.id)) fail(`${tag} has no judge`);
  if (p.kind === 'choice') { const oks = p.options.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0); if (oks.length !== 1) fail(`${tag} ${oks.length} right options`); if (d.id in choiceRight && oks[0] !== choiceRight[d.id]) fail(`${tag} right option ${oks[0]} ≠ expected ${choiceRight[d.id]}`); }
  for (const m of p.mis || []) if (eqv(m.v, p.ans)) fail(`${tag} misconception ${m.tag} equals answer`);
  for (const m of p.mis || []) if (!TAGKEYS.has(m.tag)) fail(`${tag} misconception tag '${m.tag}' has no parent-page label`);
  for (const o of (p.options || [])) if (o.tag && !TAGKEYS.has(o.tag)) fail(`${tag} option tag '${o.tag}' has no parent-page label`);
  const mv = (p.mis || []).map((m) => JSON.stringify(Array.isArray(m.v) ? fr(...m.v) : m.v)); if (new Set(mv).size !== mv.length) fail(`${tag} misconceptions collide`);
  if (p.kind === 'frac' && p.reduce && Array.isArray(p.ans) && fr(...p.ans).join() !== p.ans.join()) fail(`${tag} answer not in lowest terms`);
  for (const o of AUDIT.list) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`${tag} missing language: ${JSON.stringify(o).slice(0, 90)}`);
  console.log(`ok ${tag.padEnd(28)} ${p.kind.padEnd(6)} ans=${JSON.stringify(p.ans)}`);
});
console.log(`\n${n} problem variants checked (${generated} generated), ${fails} failures`);
process.exit(fails ? 1 : 0);
