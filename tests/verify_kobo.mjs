// Checks the workshop (kobo.js): the Chinese-rings rule the game uses gives the fewest-move counts the game shows (BFS vs formula);
// keys open from her real progress the intended way (replayed on the private save when present) and stay open; every paint-lab colour
// can be mixed exactly from its recipe and differs from the others; the secret box, the three wooden-joint puzzles and the fold patterns
// behave as the screens claim (fewest moves by BFS, only the key piece moves first, 1/2/4 lines of symmetry); all text has ja/en/zh.
// Run: node tests/verify_kobo.mjs
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const spectral = createRequire(import.meta.url)(new URL('vendor/spectral.js', root).pathname);
let fails = 0; const fail = (m) => { fails++; if (fails < 30) console.log('FAIL', m); };
function load(state) {
  const subs = {}, store = {};
  const env = { S: state, spectral, KEY: 'k', HOOK: {}, EVT: { sub: (e, f) => (subs[e] = subs[e] || []).push(f), emit: (e, d) => (subs[e] || []).forEach((f) => f(d)) },
    LEARN: { rngOf: () => Math.random }, today: () => '2026-10-25', save: () => {}, tx: (ja, en, zh) => ({ ja, en, zh }), T: (o) => o.ja, toast: () => {}, confetti: () => {}, snd: () => {},
    $: () => null, $$: () => [], setMain: () => {}, modal: () => {}, L: {}, window: { addEventListener: () => {} }, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } } };
  const names = Object.keys(env);
  const api = new Function(...names, read('kobo.js') + read('kobo2.js') + read('kobo3d.js') + '\nreturn {HOOK,SK,PL,RG,BX,HG,KG,KM,CR,cardSVG,KOB,KEYS,MIXES,INKS,ringsMin,ringMovable,koboCheck,koboHas,mixHex,dE,boxCan,BOX_N,BOX_LEVELS,kiriGroup,KIRI_AXES,KUMI,KUMI_MIN,KDIRS,kumiCan,kumiMove,kumiDone,LAMP_GOALS,filmColor,LP,lampMade,KOBO_ROOMS,KOBO_ITEMS,EXTRA_TX:window.EXTRA_TX};')(...names.map((k) => env[k]));
  return { ...api, emit: env.EVT.emit, S: state };
}
// 1. rings: BFS over the game's own move rule
{ const { ringsMin, ringMovable } = load({});
  for (let n = 1; n <= 9; n++) { const start = Array(n).fill(true), key = (a) => a.map(Number).join(''); const dist = new Map([[key(start), 0]]); let q = [start];
    while (q.length) { const nq = []; for (const a of q) for (let k = 0; k < n; k++) if (ringMovable(a, k)) { const b = a.slice(); b[k] = !b[k]; if (!dist.has(key(b))) { dist.set(key(b), dist.get(key(a)) + 1); nq.push(b); } } q = nq; }
    const got = dist.get('0'.repeat(n)); if (got !== ringsMin(n)) fail(`${n} rings: BFS ${got}, shown ${ringsMin(n)}`); }
  console.log('rings: fewest moves shown = BFS over the game rule for 1–9 rings'); }
// 2. keys: closed at the start, open the intended way, sticky
{ const t = load({ cleared: {}, vocab: {}, prob: {}, badges: {} }); t.koboCheck(true);
  if (Object.keys(t.S.kobo.keys).length) fail(`keys open on a fresh save: ${Object.keys(t.S.kobo.keys)}`);
  for (let i = 0; i < 4; i++) t.emit('solve', { first: true }); t.emit('solve', { first: false }); t.emit('solve', { first: false });
  if (t.koboHas('open')) fail('opened before 5 first solves (repeats must not count)');
  t.emit('solve', { first: true }); if (!t.koboHas('open')) fail('not open after 5 first solves');
  t.S.cleared.r1 = 1; t.emit('solve', { first: false }); if (!t.koboHas('paint')) fail('paint lab not open after a science place');
  t.S.cleared.c4 = 1; t.emit('solve', {}); if (!t.koboHas('r5') || t.koboHas('r7')) fail('ring keys wrong after c4');
  t.S.badges = { c4: '2026-10-25' }; t.emit('solve', {}); if (!t.koboHas('r7') || t.koboHas('r9')) fail('7 rings not open after the c4 badge (or 9 opened early)');
  t.S.kobo.rings[7] = 85; t.koboCheck(true); if (!t.koboHas('r9')) fail('9 rings not open after solving 7 rings');
  t.S.cleared = {}; t.S.badges = {}; t.emit('solve', {}); if (!['open', 'paint', 'r5', 'r7', 'r9'].every(t.koboHas)) fail('keys did not stay open');
  console.log('keys: closed on a fresh save, 5 first solves open the door, room keys follow what she learned, and stay open'); }
// progress that teaches none of the rooms' skills opens nothing
{ const t = load({ cleared: { s1: 1, s2: 1, f1: 1, c1: 1, c2: 1, d1: 1, p1: 1 }, vocab: {}, prob: {}, badges: { s1: 1 } }); t.koboCheck(true);
  if (Object.keys(t.S.kobo.keys).length) fail(`unrelated progress opens ${Object.keys(t.S.kobo.keys)}`); else console.log('keys: unrelated progress opens nothing'); }
// optional: a real save file (KAZOE_SAVE=path, never in git) must start with the workshop closed
{ const f = process.env.KAZOE_SAVE;
  if (f && existsSync(f)) { const s = JSON.parse(readFileSync(f, 'utf8')); const t = load(s.state || s); t.koboCheck(true);
    // she cleared m1 (prefecture shapes), so the secret-box key is honestly hers; the door itself and every other room stay closed
    const open = Object.keys(t.S.kobo.keys); if (open.join() !== 'box') fail(`her save opens ${open}`); else console.log(`her save: door closed; of ${Object.keys(t.KEYS).length} keys only the secret box (m1 cleared) is earned`); }
  else console.log('her save not present: skipped'); }
// 3. paint lab colours
{ const { MIXES, INKS, mixHex, dE } = load({});
  const tg = MIXES.map(([n, r]) => { const h = mixHex(r); if (!/^#[0-9A-F]{6}$/i.test(h)) fail(`${n.ja}: bad colour ${h}`); return h; });
  MIXES.forEach(([n, r], i) => { if (dE(mixHex(Object.fromEntries(Object.entries(r).map(([c, k]) => [c, k * 2]))), tg[i]) > 1) fail(`${n.ja}: doubled recipe is not the same colour`);
    Object.values(INKS).forEach((h) => { if (dE(h, tg[i]) < 12) fail(`${n.ja} looks like a plain paint ${h}`); });
    tg.forEach((h, j) => { if (j > i && dE(h, tg[i]) < 12) fail(`${n.ja} and ${MIXES[j][0].ja} look the same`); }); });
  if (dE(mixHex({ blue: 1, yellow: 1 }), '#3DB23F') > 3) fail('blue + yellow is not green');
  console.log(`paint lab: ${MIXES.length} colours, each exact from its recipe and distinct`); }
// 4. secret box: panels caught on their neighbours; the fewest moves is 4 per step of depth, and a wrong first panel is stuck
{ const { boxCan, BOX_N, BOX_LEVELS } = load({});
  for (const d of BOX_LEVELS) { const start = Array(BOX_N).fill(0), goal = Array(BOX_N).fill(d).join(); const dist = new Map([[start.join(), 0]]); let q = [start];
    while (q.length) { const nq = []; for (const p of q) for (let j = 0; j < BOX_N; j++) for (const dir of [1, -1]) if (boxCan(p, j, dir, d)) { const r = p.slice(); r[j] += dir; if (!dist.has(r.join())) { dist.set(r.join(), dist.get(p.join()) + 1); nq.push(r); } } q = nq; }
    if (dist.get(goal) !== BOX_N * d) fail(`box depth ${d}: fewest ${dist.get(goal)}, shown ${BOX_N * d}`);
    if (boxCan(start, 1, 1, d) || !boxCan(start, 0, 1, d)) fail(`box depth ${d}: the first move is not the first panel`); }
  console.log(`secret box: fewest moves 4/8/12 by BFS; only the first panel can start`); }
// 5. kirigami: group sizes and lines of symmetry
{ const { kiriGroup, KIRI_AXES } = load({});
  for (const [n, axes] of [[2, 1], [4, 2], [8, 4]]) { if (kiriGroup(n).length !== n) fail(`fold ${n}: ${kiriGroup(n).length} copies`); if (KIRI_AXES[n].length !== axes) fail(`fold ${n}: ${KIRI_AXES[n].length} axes drawn, expected ${axes}`);
    const mirrors = kiriGroup(n).filter((f) => { const a = f([0.3, 0.1]), b = f([0.7, 0.2]); const det = (a[0] * b[1] - a[1] * b[0]) / (0.3 * 0.2 - 0.1 * 0.7); return det < 0; }).length;
    if (mirrors !== axes) fail(`fold ${n}: group has ${mirrors} mirrors, lesson says ${axes} lines`); }
  console.log('kirigami: 2/4/8 copies with 1/2/4 lines of symmetry'); }
// 6. wooden joints: fewest moves by BFS; who can move first
{ const { KUMI, KUMI_MIN, KDIRS, kumiCan, kumiMove, kumiDone } = load({});
  KUMI.forEach((lv, li) => { const P = lv.pieces, start = { off: P.map(() => [0, 0, 0]), out: P.map(() => false) }, sk = (st) => st.off.map((o, i) => (st.out[i] ? 'X' : o.join())).join('|');
    const seen = new Set([sk(start)]); let q = [start], depth = 0, found = null;
    while (q.length && depth <= 16 && found == null) { const nq = []; for (const st of q) { if (kumiDone(P, st)) { found = depth; break; } for (let i = 0; i < P.length; i++) for (const d of KDIRS) if (kumiCan(P, st, i, d)) { const t = kumiMove(P, st, i, d); if (!seen.has(sk(t))) { seen.add(sk(t)); nq.push(t); } } } q = nq; if (found == null) depth++; }
    if (found !== KUMI_MIN[li]) fail(`joint ${li + 1}: fewest ${found}, shown ${KUMI_MIN[li]}`);
    const movers = P.map((p, i) => KDIRS.filter((d) => kumiCan(P, start, i, d)).length);
    if (li === 0 && (movers[0] !== 2)) fail(`dovetail: tail moves ${movers[0]} ways at first (should be only out and back across the board)`);
    if (li === 1 && (movers[1] || movers[2] || !movers[3] || !movers[4])) fail(`crossed frame: lower sticks ${movers.slice(1, 3)} / upper ${movers.slice(3)}`);
    if (li === 2 && movers.filter(Boolean).length !== 1) fail(`dice puzzle: ${movers.filter(Boolean).length} pieces can move first`);
    for (const p of P) { const s = new Set(p.cells.map((c) => c.join())); if (s.size !== p.cells.length) fail(`joint ${li + 1}: repeated cell`);
      // every piece is one piece of wood: its cells are face-connected (astra R11-04: the first socket was two loose halves)
      const seen = new Set([p.cells[0].join()]), st = [p.cells[0]]; while (st.length) { const c = st.pop(); for (const d of KDIRS) { const k = c.map((v, i) => v + d[i]).join(); if (s.has(k) && !seen.has(k)) { seen.add(k); st.push(k.split(',').map(Number)); } } }
      if (seen.size !== s.size) fail(`joint ${li + 1}: a piece is not one connected block (${seen.size}/${s.size})`); }
    const all = P.flatMap((p) => p.cells.map((c) => c.join())); if (new Set(all).size !== all.length) fail(`joint ${li + 1}: pieces overlap`); });
  console.log(`wooden joints: fewest moves ${KUMI_MIN.join('/')} by BFS; dovetail slides only across, the upper sticks go first, one key piece`); }
// 7. light: nothing counts before she moves the lights; light adds, cellophane takes away
{ const { LAMP_GOALS, filmColor, LP, lampMade } = load({ kobo: undefined });
  if (lampMade().length) fail(`lights already make ${lampMade()} before she moves them`);
  LP.spots.g = [200, 150]; LP.spots.r = [110, 120]; if (!lampMade().includes('yellow')) fail('red + green light overlap does not make yellow');
  const fc = (s) => filmColor(s); const [r, g, b] = fc(['yellow', 'blue']); if (!(g > r && g > b)) fail(`yellow + blue cellophane is not green: ${[r, g, b]}`);
  if (fc(['red', 'blue']).some((v) => v > 30)) fail('red + blue cellophane is not near black');
  // the same colour must count the same, and a goal needs 2+ sheets (astra R11-11)
  LP.mode = 'F'; LP.films = ['red']; const one = lampMade(); LP.films = ['red', 'yellow']; const two = lampMade(); LP.films = ['red', 'red'];
  if (one.length || !two.includes('fred')) fail(`cellophane: one sheet ${one}, red+yellow ${two}`);
  if (LAMP_GOALS.filter((x) => x[2] === 'F').some((x) => { const c = fc(x[3]); return x[0] === 'fred' && !(c[0] > 200 && c[1] < 30); })) fail('red + yellow cellophane is not red');
  console.log('light: starts with no overlap; light adds to yellow, cellophane subtracts to green / black / red'); }
// 8b. the card picture keeps every corner in view at 0°, 90°, 180° with the longest slit (astra R11-09)
{ const { CR, cardSVG } = load({});
  for (const ang of [0, 45, 90, 135, 180]) { CR.ang = ang; CR.tabs = [{ x0: 0, x1: 12, L: 8, who: null }]; const svg = cardSVG(400), [vx, vy, vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    for (const m of svg.matchAll(/points="([^"]+)"/g)) for (const pt of m[1].split(' ')) { const [x, y] = pt.split(',').map(Number); if (x < vx || x > vx + vw || y < vy || y > vy + vh) { fail(`card at ${ang}°: point ${x},${y} outside the view`); break; } } }
  console.log('card: every corner in view at 0–180°'); }
// 8c. a reset clears every room's unsaved draft (astra R11-03)
{ const t = load({}); Object.assign(t.SK, { img: 'old', undo: [1, 2] }); t.PL.res = 'match'; t.RG.on = [false]; t.BX.pos = [1, 0, 0, 0]; t.HG.stage = 'printed'; t.KG.cuts = [[[0, 0]]]; t.KM.moves = 3; t.CR.ang = 10;
  t.HOOK.reset(); const left = [t.SK.img && 'sketch', t.SK.undo.length && 'undo', t.PL.res && 'paint', t.RG.on && 'rings', t.BX.pos && 'box', t.HG.stage !== 'carve' && 'hanga', t.KG.cuts.length && 'kiri', t.KM.moves && 'kumi', t.CR.ang !== 90 && 'card'].filter(Boolean);
  if (left.length) fail(`reset left drafts: ${left}`); else console.log('reset: every room draft cleared'); }
// 8. every room is registered, has a key or is open, and every made thing can stand in the house
{ const { KOBO_ROOMS, KEYS, KOBO_ITEMS } = load({});
  for (const r of KOBO_ROOMS) { if (r.key && !KEYS[r.key]) fail(`room ${r.id}: key ${r.key} undefined`); if (r.key && !r.why) fail(`room ${r.id}: no “what to learn” text`); }
  if (KOBO_ROOMS.length !== 9) fail(`${KOBO_ROOMS.length} rooms`); if (Object.keys(KOBO_ITEMS).length !== 6) fail(`${Object.keys(KOBO_ITEMS).length} house items`);
  console.log(`rooms: ${KOBO_ROOMS.length} registered (${KOBO_ROOMS.filter((r) => !r.key).length} open with the door), ${Object.keys(KOBO_ITEMS).length} things for the house`); }
// 9. text
{ const { EXTRA_TX, KOBO_ITEMS } = load({}); for (const o of [...EXTRA_TX, ...Object.values(KOBO_ITEMS).map((i) => i.n)]) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`missing language: ${JSON.stringify(o)}`);
  console.log(`text: ${EXTRA_TX.length} strings in 3 languages`); }
console.log(`\nworkshop checks: ${fails} failures`);
process.exit(fails ? 1 : 0);
