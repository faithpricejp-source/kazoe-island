// Checks the social studies isle (worlds/social.js + worlds/data/social_bank.js) without the DOM:
// 1) climate data reproduces the JMA 1991–2020 annual normals — catches typos in 24×8 numbers;
// 2) generated families: direction, scale, contour, region and climate answers recomputed by independent code, over many seeds;
// 3) the question bank: schema, one right option, valid prefecture names, three languages everywhere.
// Run: node tests/verify_social.mjs
import { readFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const html = read('index.html');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const starsSrc = html.match(/function stars\(p\)\{.*\}/)[0];
const stubs = 'const WORLDS=[];function registerWorld(w){WORLDS.push(w);for(const c of w.chapters)PROBLEMS[c.id]=c.problems};const T=(o)=>o&&o.ja?o.ja:String(o||""),LANGTXT=(a)=>a,$=()=>null,$$=()=>[],snd=()=>{},numPad=()=>{},fracHTML=()=>"";const S={prob:{}};const window={};';
const bank = (existsSync(new URL('worlds/data/social_bank.js', root)) ? read('worlds/data/social_bank.js') : '') + read('worlds/data/social_rules.js');
const src = core + stubs + starsSrc + '\nconst ALLCH=[];\n' + read('learn.js') + read('worlds/data/jp_prefs.js') + bank + read('worlds/social.js') + '\nreturn {WORLDS,SOC,GEN,LEARN,JP_PREFS,AUDIT,PROBLEMS,SOC_SKILL,bank:typeof SOCIAL_BANK!=="undefined"?{units:Object.fromEntries(Object.keys({...SOCIAL_BANK.units,...SOCIAL_TRANSFER}).map(u=>[u,[...(SOCIAL_BANK.units[u]||[]),...(SOCIAL_TRANSFER[u]||[])]]))}:null,RULES:SOCIAL_RULES};';
const api = new Function(src)();
const { WORLDS, SOC, LEARN, JP_PREFS, AUDIT, PROBLEMS } = api;
let fails = 0, n = 0; const fail = (m) => { fails++; console.log('FAIL', m); };

// 1) climate vs JMA annual normals
const JMA = { sapporo: [9.2, 1146.1], joetsu: [13.9, 2837.1], matsumoto: [12.2, 1045.1], tokyo: [15.8, 1598.2], owase: [16.4, 3969.6], takamatsu: [16.7, 1150.1], naha: [23.3, 2161.0], nemuro: [6.6, 1040.4] };
for (const [k, [t, p]] of Object.entries(JMA)) { const c = SOC.CITY[k], sp = c.p.reduce((a, b) => a + b, 0), mt = c.t.reduce((a, b) => a + b, 0) / 12;
  if (Math.abs(sp - p) > 0.25) fail(`${k} precipitation sums to ${sp.toFixed(1)}, JMA annual ${p}`); if (Math.abs(mt - t) > 0.1) fail(`${k} mean temperature ${mt.toFixed(2)}, JMA annual ${t}`); }
console.log('climate normals match JMA annual values: 8 cities');

// 2) generated families, many seeds, independent answers
const social = WORLDS.find((w) => w.id === 'social');
const byId = Object.fromEntries(social.chapters.flatMap((c) => c.problems.map((d, i) => [d.id, { d, c: c.id, i }])));
const DIR8 = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
const judge = {
  dir: ([ax, ay, bx, by, rot]) => { // rotate the screen vector so that north points up, then read the compass angle
    let vx = bx - ax, vy = -(by - ay); for (let r = 0; r < rot; r++) [vx, vy] = [-vy, vx];   // north arrow turned clockwise by rot×90°: turn the vector back
    const ang = (Math.atan2(vx, vy) * 180 / Math.PI + 360) % 360; return DIR8[Math.round(ang / 45) % 8]; },
  wind: ([k]) => DIR8[(k + 4) % 8],
  scaleReal: ([den, cm]) => (cm / 100) * den, scaleMap: ([den, km]) => (km * 1000 * 100) / den, scaleFind: ([m, cm]) => (m * 100) / cm,
  hillH: ([, iv, base, , k]) => base + iv * k, hillSteep: ([, , , east]) => (east ? '東がわ' : '西がわ'),
  region: ([i, pi]) => SOC.REGIONS[i][1].ja, climate: ([key]) => SOC.CITY[key].n.ja, wetMonth: ([key]) => SOC.CITY[key].p.indexOf(Math.max(...SOC.CITY[key].p)) + 1,
  symName: ([key]) => SOC.SYM[key][1].ja, symPick: ([key]) => SOC.SYM[key][0],
};
const famOf = { s4c1: 'climate', s4c2: 'climate', s4c4: 'climate', s8c1: 'climate', s8c2: 'climate', s4c3: 'wetMonth', s5r1: 'region', s5r2: 'region', s6d1: 'dir', s6d2: 'dir', s6w1: 'wind', s6y1: 'symName', s6y2: 'symPick', s7y1: 'symName', s7y2: 'symPick', s6k1: 'scaleReal', s6k2: 'scaleMap', s6k3: 'scaleFind', s7h1: 'hillH', s7h2: 'hillSteep' };
for (const [id, f] of Object.entries(famOf)) {
  const { d } = byId[id] || {}; if (!d) { fail(`${id} missing`); continue; }
  const sets = [...d.sets]; for (const L of [0, 1, 2]) for (let s = 0; s < 25; s++) { const ps = LEARN.varyParams(d, 'soc' + s, L); if (ps) sets.push(ps); }
  for (const ps of sets) { n++; AUDIT.list = []; AUDIT.on = true; const p = d.make(ps), want = judge[f](ps), tag = `${id}${JSON.stringify(ps)}`;
    if (p.kind === 'num') { if (Math.abs(p.ans - want) > 1e-9) fail(`${tag} ans ${p.ans} ≠ ${want}`); if (!Number.isInteger(p.ans) && f.startsWith('scale')) fail(`${tag} answer ${p.ans} is not a whole number`);
      for (const m of p.mis || []) if (m.v === p.ans) fail(`${tag} misconception equals answer`); }
    else { const ok = p.options.filter((o) => o.ok); if (ok.length !== 1) { fail(`${tag} has ${ok.length} right options`); continue; }
      const got = typeof ok[0].t === 'string' ? ok[0].t : ok[0].t.ja; if (f === 'symPick' ? !got.includes(want) : got !== want) fail(`${tag} right option “${got}” ≠ judge “${want}”`);
      const texts = p.options.map((o) => (typeof o.t === 'string' ? o.t : o.t.ja)); if (new Set(texts).size !== texts.length) fail(`${tag} duplicate options`); }
    if (f === 'dir' && (ps[0] === ps[2] && ps[1] === ps[3])) fail(`${tag} the two places overlap`);
    for (const o of AUDIT.list) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`${tag} missing language`);
    AUDIT.on = false; }
}
console.log(`generated social variants checked: ${n}`);

// 3) the question bank
const B = api.bank;
if (!B) console.log('social_bank.js not present yet — bank checks skipped');
else {
  const names = new Set(JP_PREFS.map((p) => p[1])), ids = new Set(); let items = 0; const tri = (o, where) => { if (!o || !['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].trim())) fail(`${where}: missing language`); };
  for (const [u, list] of Object.entries(B.units)) for (const it of list) { items++; const w = `${it.id} (lesson ${u})`;
    if (ids.has(it.id)) fail(`${w}: duplicate id`); ids.add(it.id);
    if (!['know', 'map', 'read', 'why', 'calc', 'apply'].includes(it.skill)) fail(`${w}: skill ${it.skill}`); if (![1, 2, 3].includes(it.stars)) fail(`${w}: stars ${it.stars}`);
    tri(it.q, w + ' q'); tri(it.why, w + ' why'); (it.hint || []).forEach((h, i) => tri(h, `${w} hint${i}`));
    if (it.rule && !api.RULES[it.rule]) fail(`${w}: unknown rule ${it.rule}`);
    if (it.k === 'choice') { const ok = it.opts.filter((o) => o.ok); if (ok.length !== 1) fail(`${w}: ${ok.length} right options`); it.opts.forEach((o, i) => { tri(o.t, `${w} opt${i}`); if (!o.ok) tri(o.fb, `${w} fb${i}`); }); }
    else if (it.k === 'multi') { if (it.opts.filter((o) => o.ok).length < 2) fail(`${w}: multi needs ≥2 right`); it.opts.forEach((o, i) => tri(o.t, `${w} opt${i}`)); }
    else if (it.k === 'bins') { it.bins.forEach((b, i) => tri(b, `${w} bin${i}`)); const used = new Set(it.items.map((x) => x.bin)); if (used.size !== 2) fail(`${w}: both bins must be used`); it.items.forEach((x, i) => { tri(x.t, `${w} item${i}`); if (![0, 1].includes(x.bin)) fail(`${w}: item ${i} bin`); }); }
    else if (it.k === 'map') { for (const p of it.prefs) if (!names.has(p)) fail(`${w}: unknown prefecture ${p}`); if (!['any', 'all'].includes(it.mode || 'any')) fail(`${w}: mode`); }
    else if (it.k === 'num') { if (!Number.isFinite(it.ans)) fail(`${w}: ans`); tri(it.unit, w + ' unit'); (it.mis || []).forEach((m) => { if (m.v === it.ans) fail(`${w}: mis equals answer`); tri(m.fb, w + ' mis'); }); }
    else fail(`${w}: unknown kind ${it.k}`);
    // the problem built from the item must work
    const ref = byId[it.id]; if (!ref) fail(`${w}: not placed in any chapter`); else { const p = ref.d.make(ref.d.sets[0]); if (p.kind === 'choice' && p.options.filter((o) => o.ok).length !== 1) fail(`${w}: built problem has wrong option count`); }
  }
  console.log(`question bank: ${items} items`);
}
console.log(`\nsocial checks: ${fails} failures`);
process.exit(fails ? 1 : 0);
