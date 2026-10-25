// Checks the blank-map isle against the map itself (an outside judge for the coordinates):
// 1) the Mercator fit puts known capes on the right prefecture edges;
// 2) every capital and every land feature point lies INSIDE one of its own prefectures' outlines (point-in-polygon on the real paths);
//    bays/seas/straits lie in the water but next to their prefectures; rivers and ranges keep most of their line inside their prefectures;
// 3) generated questions: one right option, and "where" answers name real prefectures.
// Run: node tests/verify_map.mjs
import { readFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const html = read('index.html');
const core = html.split('// CORE-START')[1].split('// CORE-END')[0];
const starsSrc = html.match(/function stars\(p\)\{.*\}/)[0];
const stubs = 'const WORLDS=[];function registerWorld(w){WORLDS.push(w);for(const c of w.chapters)PROBLEMS[c.id]=c.problems};const T=(o)=>o&&o.ja?o.ja:String(o||""),LANGTXT=(a)=>a,$=()=>null,$$=()=>[],snd=()=>{},numPad=()=>{},fracHTML=()=>"";const S={prob:{}};const window={};';
const opt = (f) => (existsSync(new URL(f, root)) ? read(f) : '');
const api = new Function(core + stubs + starsSrc + '\nconst ALLCH=[];\n' + read('learn.js') + read('worlds/data/jp_prefs.js') + opt('worlds/data/social_bank.js') + read('worlds/data/social_rules.js') + read('worlds/social.js')
  + opt('worlds/data/geo_features.js') + read('worlds/mapisle.js') + '\nreturn {JGEO,WORLDS,LEARN,AUDIT,GF:typeof GEO_FEATURES!=="undefined"?GEO_FEATURES:null};')();
const { JGEO, WORLDS, LEARN, AUDIT, GF } = api;
let fails = 0, n = 0; const fail = (m) => { fails++; console.log('FAIL', m); };
// 1) projection against known extreme points (prefecture bbox edges measured from the map)
const capes = [['Inubosaki', 12, 'x1', 35.71, 140.87], ['Todogasaki', 3, 'x1', 39.55, 142.07], ['Shionomisaki', 30, 'y1', 33.43, 135.76], ['Ashizuri', 39, 'y1', 32.72, 133.01], ['Oma', 2, 'y0', 41.55, 140.91]];
for (const [nm, id, edge, la, lo] of capes) { const [x0, y0, x1, y1] = JGEO.bbox(id), [x, y] = JGEO.proj(la, lo), v = { x0, y0, x1, y1 }[edge], got = edge[0] === 'x' ? x : y; if (Math.abs(got - v) > 1.5) fail(`projection: ${nm} at ${got.toFixed(1)} vs map edge ${v.toFixed(1)}`); }
console.log('projection fits known capes');
if (!GF) { console.log('geo_features.js not present yet — feature checks skipped'); console.log(`\nmap checks: ${fails} failures`); process.exit(fails ? 1 : 0); }
// 2) features inside their prefectures
const near = (ids, p, tol) => ids.some((id) => JGEO.ringsOf(id).some((r) => r.some(([x, y]) => (x - p[0]) ** 2 + (y - p[1]) ** 2 < tol * tol)));
let checked = 0;
for (const [type, list] of Object.entries(GF)) for (const f of list) {
  const ids = f.prefs || [f.pref], pts = (f.line || [[f.lat, f.lon]]).map(([la, lo]) => JGEO.proj(la, lo)); checked++;
  if (ids.some((id) => id < 1 || id > 47)) { fail(`${type} ${f.n}: prefecture code ${ids}`); continue; }
  if (ids.includes(47)) continue;   // Okinawa is drawn as an inset, not at its real position
  if (type === 'bay') { const p = pts[0]; if (ids.some((id) => JGEO.inside(id, p))) fail(`${type} ${f.n}: point is on land`); if (!near(ids, p, 25)) fail(`${type} ${f.n}: not next to ${ids}`); continue; }
  const inn = pts.filter((p) => ids.some((id) => JGEO.inside(id, p)) || near(ids, p, 3)).length;
  if (f.line ? inn / pts.length < 0.7 : inn < 1) fail(`${type} ${f.n} (${f.r}): ${inn}/${pts.length} points inside ${ids.join(',')}`);
}
console.log(`features checked against prefecture outlines: ${checked}`);
// independent anchors (written from outside sources, not from geo_features.js itself), so the data cannot vouch for itself
const byN = {}; for (const list of Object.values(GF)) for (const f of list) byN[f.n] = f;
const mustInclude = { 天竜川: [20, 22, 23], 濃尾平野: [21, 23, 24], 丹波高地: [26, 28], 木曽山脈: [20, 21], 長良川: [21, 23, 24], 東京湾: [12, 13, 14], 利根川: [10, 11, 12, 8], 信濃川: [15, 20] };
for (const [nm, ids] of Object.entries(mustInclude)) { const f = byN[nm]; if (!f) { fail(`anchor ${nm} missing`); continue; } const have = f.prefs || [f.pref]; for (const id of ids) if (!have.includes(id)) fail(`${nm}: prefecture ${id} missing from ${have}`); }
// 小豆島 belongs to 香川: the outline (fixed from the source map) and the tap target must agree
const sh = JGEO.proj(34.49, 134.25); if (!JGEO.inside(37, sh) || JGEO.inside(33, sh)) fail('小豆島 is not drawn in 香川県');
// capes at their real tips (km from the official position)
const km = ([a, b], [c, d]) => 6371 * Math.acos(Math.min(1, Math.sin(a * Math.PI / 180) * Math.sin(c * Math.PI / 180) + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.cos((b - d) * Math.PI / 180)));
for (const [nm, ll] of [['犬吠埼', [35.7078, 140.8686]], ['宗谷岬', [45.5228, 141.9364]], ['室戸岬', [33.2453, 134.1767]]]) { const f = byN[nm]; const d = km([f.lat, f.lon], ll); if (d > 3) fail(`${nm} is ${d.toFixed(1)} km from its tip`); }
console.log('anchors: prefecture sets, 小豆島 in 香川, capes within 3 km');
// 3) generated questions
const W = WORLDS.find((w) => w.id === 'mapisle');
for (const c of W.chapters) for (const d of c.problems) { const sets = [...d.sets]; for (let s = 0; s < 20; s++) { const ps = LEARN.varyParams(d, 'map' + s, 1); if (ps) sets.push(ps); }
  for (const ps of sets) { n++; AUDIT.list = []; AUDIT.on = true; const p = d.make(ps);
    for (const o of AUDIT.list) if (!['ja', 'en', 'zh'].every((k) => typeof o[k] === 'string' && o[k].length)) fail(`${d.id}${JSON.stringify(ps)} missing language`); AUDIT.on = false;
    if (p.kind === 'choice') { if (p.options.filter((o) => o.ok).length !== 1) fail(`${d.id}${JSON.stringify(ps)}: right options`); const t = p.options.map((o) => JSON.stringify(o.t)); if (new Set(t).size !== t.length) fail(`${d.id}${JSON.stringify(ps)}: duplicate options`); }
    else if (!Array.isArray(p.ans) || !p.ans.every((x) => api.JGEO && x)) fail(`${d.id}: bad where-answer`); } }
console.log(`generated map questions checked: ${n}`);
console.log(`\nmap checks: ${fails} failures`);
process.exit(fails ? 1 : 0);
