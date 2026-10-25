// Checks every problem in index.html (CORE block):
// 1) the canonical answer track equals a brute-force enumeration of the real objects;
// 2) no listed misconception value collides with the right answer;
// 3) obvious wrong structures (swap + and ×, P<->C on any station, drop the minus route) don't hit the right answer;
// 4) every problem string has ja/en/zh.
// Run: node tests/verify.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const learnSrc = readFileSync(new URL('../learn.js', import.meta.url), 'utf8'), varySrc = readFileSync(new URL('../worlds/vary_count.js', import.meta.url), 'utf8');
const api = new Function(core + '\nconst ALLCH=[];' + learnSrc + varySrc + '\nreturn {PROBLEMS,getProblem,exprVal,leafVal,AUDIT,nCr,nPr,LEARN};')();
const { PROBLEMS, getProblem, exprVal, leafVal, AUDIT, LEARN } = api;
// generated variants: every level, 12 seeds each, duplicates dropped; they must keep the track shape of the fixed problem
const shape = (sol) => sol.map((l) => (l.sign < 0 ? '-' : '+') + l.st.map((s) => s.t).join('')).join('|');
function variants(d) {
  if (LEARN.VARY[d.id] === null) return []; // declared: no new numbers possible, fixed sets rotate
  if (!LEARN.VARY[d.id]) { fail(`${d.id} has no number generator`); return []; }
  const out = new Map();
  for (const L of [0, 1, 2]) for (let s = 0; s < 12; s++) { const ps = LEARN.varyParams(d, 'test' + s, L); if (!ps) { fail(`${d.id} generator gave nothing new at level ${L}`); continue; } out.set(JSON.stringify(ps), ps); }
  return [...out.values()];
}
let generated = 0;
let fails = 0, checked = 0;
const fail = (m) => { fails++; console.log('FAIL', m); };
const clone = (x) => JSON.parse(JSON.stringify(x));
AUDIT.on = true;
for (const ch of Object.keys(PROBLEMS)) {
  PROBLEMS[ch].forEach((d, i) => [...d.sets.map((set, si) => [set, si, false]), ...variants(d).map((ps) => [ps, 0, true])].forEach(([set, si, gen]) => {
    AUDIT.list = [];
    const p = gen ? getProblem(ch, i, 0, set) : getProblem(ch, i, si);
    const tag = `${p.id}${gen ? '~' : ''}[${JSON.stringify(set)}]`;
    if (gen) { generated++; const base = d.sets.map((s, k) => shape(getProblem(ch, i, k).sol)); if (!base.includes(shape(p.sol))) fail(`${tag} track shape ${shape(p.sol)} differs from the fixed problems' ${base.join(' / ')}`); if (p.ans > 10000) fail(`${tag} answer ${p.ans} is too big for a child`); }
    checked++;
    const brute = p.brute();
    if (brute !== p.ans) fail(`${tag} brute=${brute} track=${p.ans}`);
    if (!(p.ans > 0) || !Number.isInteger(p.ans)) fail(`${tag} bad answer ${p.ans}`);
    for (const m of p.mis) if (m.v === p.ans) fail(`${tag} misconception ${m.tag} equals answer ${p.ans}`);
    // two misconceptions with the same value would make the first one shadow the second's feedback
    const mv = p.mis.map((m) => m.v);
    if (new Set(mv).size !== mv.length) fail(`${tag} misconception values collide: ${mv.join(',')}`);
    // structural alternatives
    const alts = [];
    if (p.sol.length > 1) alts.push(['× instead of +', p.sol.reduce((a, l) => a * l.st.reduce((m, s) => m * leafVal(s), 1), 1)]);
    p.sol.forEach((l, li) => { if (l.st.length > 1) { const alt = clone(p.sol); const sum = l.st.reduce((a, s) => a + leafVal(s), 0); alt[li] = { sign: l.sign, st: [{ t: 'N', n: sum, r: 0 }] }; alts.push([`+ instead of × in route ${li}`, exprVal(alt)]); } });
    p.sol.forEach((l, li) => l.st.forEach((s, si) => {
      if ((s.t === 'P' || s.t === 'C') && s.r >= 2) { const alt = clone(p.sol); alt[li].st[si].t = s.t === 'P' ? 'C' : 'P'; alts.push([`${s.t}->${alt[li].st[si].t} at ${li}-${si}`, exprVal(alt)]); }
    }));
    if (p.sol.some((l) => l.sign < 0)) alts.push(['forgot minus route', exprVal(p.sol.filter((l) => l.sign > 0))]);
    for (const [name, v] of alts) if (v === p.ans) fail(`${tag} wrong structure "${name}" also gives ${p.ans}`);
    for (const o of AUDIT.list) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`${tag} missing language in ${JSON.stringify(o).slice(0, 80)}`);
    console.log(`ok ${tag.padEnd(18)} ans=${String(p.ans).padStart(6)} brute=${brute} mis=[${p.mis.map((m) => m.v).join(',')}] alts=[${alts.map((a) => a[1]).join(',')}]`);
  }));
}
console.log(`\n${checked} problem variants checked (${generated} generated), ${fails} failures`);
process.exit(fails ? 1 : 0);
