// Checks the science isle (worlds/science.js + data) against physics, not against the game's own tables:
// sunrise/sunset side and shadow direction from spherical astronomy at Tokyo's latitude; moon direction from its angle to the sun;
// bulb brightness from Ohm's law over the circuit; star turning 360°/24 h; plus the question bank schema and rule ids.
// Run: node tests/verify_science.mjs
import { readFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const html = read('index.html');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const starsSrc = html.match(/function stars\(p\)\{.*\}/)[0];
const stubs = 'const WORLDS=[];function registerWorld(w){WORLDS.push(w);for(const c of w.chapters)PROBLEMS[c.id]=c.problems};const T=(o)=>o&&o.ja?o.ja:String(o||""),LANGTXT=(a)=>a,$=()=>null,$$=()=>[],snd=()=>{},numPad=()=>{},fracHTML=()=>"";const S={prob:{}};const window={};';
const opt = (f) => (existsSync(new URL(f, root)) ? read(f) : '');
const src = core + stubs + starsSrc + '\nconst ALLCH=[];\n' + read('learn.js') + read('worlds/data/jp_prefs.js') + opt('worlds/data/social_bank.js') + read('worlds/data/social_rules.js') + read('worlds/social.js')
  + opt('worlds/data/science_bank.js') + read('worlds/data/science_rules.js') + read('worlds/science.js')
  + '\nreturn {WORLDS,SCI,LEARN,AUDIT,bank:typeof SCIENCE_BANK!=="undefined"?SCIENCE_BANK:null,RULES:SCIENCE_RULES,CIRCUITS};';
const api = new Function(src)();
const { WORLDS, SCI, LEARN, AUDIT, CIRCUITS } = api;
let fails = 0, n = 0; const fail = (m) => { fails++; console.log('FAIL', m); };
const D2R = Math.PI / 180, LAT = 35.7 * D2R;
// sun azimuth at sunrise (degrees from north, clockwise) for declination dec
const riseAz = (dec) => Math.acos(Math.sin(dec * D2R) / Math.cos(LAT)) / D2R;
const sideOf = (az, rising) => { const d = rising ? az - 90 : 270 - az; return Math.abs(d) < 1 ? 'due' : d < 0 ? 'north' : 'south'; };
const DEC = [0, 23.4, 0, -23.4];
// sun azimuth at a given hour (0 = north, 90 = east)
const sunAz = (h, dec) => { const ha = (h - 12) * 15 * D2R, d = dec * D2R; const az = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(LAT) - Math.tan(d) * Math.cos(LAT)) / D2R; return (az + 180 + 360) % 360; };
const DIR8 = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
const nearest8 = (az) => DIR8[Math.round(az / 45) % 8];
const judge = {
  sunrise: ([s, setSide]) => { const az = riseAz(DEC[s]), side = sideOf(setSide ? 360 - az : az, !setSide); return setSide ? { due: '真西', north: '西より北', south: '西より南' }[side] : { due: '真東', north: '東より北', south: '東より南' }[side]; },
  shadow: ([h]) => { const az = (sunAz(h, 0) + 180) % 360; return ['北', '東', '南', '西'][Math.round(az / 90) % 4]; },   // 4-way: the game offers N/E/S/W
  starAngle: ([hrs]) => 360 / 24 * hrs,
  // moon: angle east of the sun → highest at 12 + angle/15; seen at hour h means its hour angle (h − transit)·15° → east (<−45°), south, west (>45°)
  moonDir: ([k, h]) => { const ang = { crescent: 30, first: 90, full: 180, last: 270 }[k], transit = 12 + ang / 15; let ha = ((h - transit) % 24 + 24) % 24; if (ha > 12) ha -= 24; return ha * 15 < -45 ? '東' : ha * 15 > 45 ? '西' : '南'; },
  circuit: ([i, j]) => { const I = (c) => { const V = c.b === 2 && c.bs === 's' ? 2 : 1, R = c.m === 2 && c.ms === 's' ? 2 : c.m === 2 ? 0.5 : 1, total = V / R; return c.m === 2 && c.ms === 'p' ? total / 2 : total; }; const a = I(CIRCUITS[i]), b = I(CIRCUITS[j]); return a > b ? 'アの方が明るい' : a < b ? 'イの方が明るい' : '同じ'; },
  peak: ([w]) => ['12時ごろ', '13時ごろ', '14時ごろ'][w],
};
const sci = WORLDS.find((w) => w.id === 'science');
const fams = sci.chapters.flatMap((c) => c.problems).filter((d) => LEARN.VARY[d.id]);
for (const d of fams) {
  const famKey = { r2s1: 'sunrise', r2s2: 'sunrise', r2h1: 'shadow', r5a1: 'starAngle', r6d1: 'moonDir', r7c1: 'circuit', r7c2: 'circuit', r3p1: 'peak' }[d.id];
  const sets = [...d.sets]; for (const L of [0, 1, 2]) for (let s = 0; s < 25; s++) { const ps = LEARN.varyParams(d, 'sci' + s, L); if (ps) sets.push(ps); }
  for (const ps of sets) { n++; AUDIT.list = []; AUDIT.on = true; const p = d.make(ps), tag = `${d.id}${JSON.stringify(ps)}`;
    for (const o of AUDIT.list) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`${tag} missing language`); AUDIT.on = false;
    if (p.kind === 'choice') { const ok = p.options.filter((o) => o.ok); if (ok.length !== 1) { fail(`${tag}: ${ok.length} right options`); continue; } }
    if (!famKey) continue; const want = judge[famKey](ps);
    if (p.kind === 'num') { if (p.ans !== want) fail(`${tag}: ans ${p.ans} ≠ physics ${want}`); }
    else { const got = (p.options.find((o) => o.ok).t.ja || '').replace(/<[^>]+>/g, ''); if (got !== want) fail(`${tag}: “${got}” ≠ physics “${want}”`); } }
}
// starWhere: the right label must sit at +15·h degrees (anticlockwise)
{ const d = sci.chapters.flatMap((c) => c.problems).find((x) => x.id === 'r5w1'); for (const h of [2, 3, 4]) { const p = d.make([h]); if (p.options.filter((o) => o.ok).length !== 1) fail(`r5w1[${h}] option count`); n++; } }
console.log(`generated science variants checked against physics: ${n}`);
// bank
const B = api.bank;
if (!B) console.log('science_bank.js not present yet — bank checks skipped');
else { const ids = new Set(); let items = 0; const tri = (o, w) => { if (!o || !['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].trim())) fail(`${w}: missing language`); };
  const per = {};
  for (const [u, list] of Object.entries(B.units)) for (const it of list) { items++; const w = `${it.id} (unit ${u})`; (per[u] = per[u] || {})[it.skill] = (per[u][it.skill] || 0) + 1;
    if (ids.has(it.id)) fail(`${w}: duplicate id`); ids.add(it.id);
    if (!['know', 'observe', 'reason', 'predict', 'calc', 'apply'].includes(it.skill)) fail(`${w}: skill ${it.skill}`); if (![1, 2, 3].includes(it.stars)) fail(`${w}: stars`);
    if (!api.RULES[it.rule]) fail(`${w}: unknown rule ${it.rule}`); tri(it.q, w + ' q'); tri(it.why, w + ' why'); (it.hint || []).forEach((h, i) => tri(h, `${w} hint${i}`));
    if (it.k === 'choice') { if (it.opts.filter((o) => o.ok).length !== 1) fail(`${w}: right options`); it.opts.forEach((o, i) => { tri(o.t, `${w} opt${i}`); if (!o.ok) tri(o.fb, `${w} fb${i}`); }); }
    else if (it.k === 'multi') { if (it.opts.filter((o) => o.ok).length < 2) fail(`${w}: multi`); }
    else if (it.k === 'bins') { if (new Set(it.items.map((x) => x.bin)).size !== 2) fail(`${w}: bins`); }
    else if (it.k === 'num') { if (!Number.isFinite(it.ans)) fail(`${w}: ans`); (it.mis || []).forEach((m) => { if (m.v === it.ans) fail(`${w}: mis = ans`); }); }
    else fail(`${w}: kind ${it.k}`);
  }
  for (const [u, c] of Object.entries(per)) { if ((c.reason || 0) < 3) fail(`unit ${u}: only ${c.reason || 0} reason items`); if ((c.apply || 0) < 2) fail(`unit ${u}: only ${c.apply || 0} apply items`); }
  console.log(`science bank: ${items} items`); }
console.log(`\nscience checks: ${fails} failures`);
process.exit(fails ? 1 : 0);
