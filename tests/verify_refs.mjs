// Every function the game calls must be defined somewhere in the shipped sources.
// (astra r7 PR7-01: an edit deleted methodQuiz/mixedFirst; every wrong answer then threw and showed no feedback, and the
// enumeration tests could not see it because they never run the DOM paths.) Static and coarse on purpose: collect all
// declared names (functions, consts/lets, parameters, destructuring) and flag called identifiers that are none of them.
// Run: node tests/verify_refs.mjs
import { readFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const html = read('index.html');
const files = { 'index.html': [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n') };
for (const f of ['learn.js', 'critters.js', 'play.js', 'progress.js', 'kobo.js', 'kobo2.js', 'kobo3d.js', 'wellbeing.js']) files[f] = read(f);
for (const f of readdirSync(new URL('worlds/', root)).filter((x) => x.endsWith('.js'))) files['worlds/' + f] = read('worlds/' + f);
for (const f of readdirSync(new URL('worlds/data/', root)).filter((x) => x.endsWith('.js'))) files['worlds/data/' + f] = read('worlds/data/' + f);
const all = Object.values(files).join('\n');
// keep only code: drop comments and the text of strings and template literals (but keep ${…} expressions inside templates)
function strip(src) {
  let out = '', i = 0; const stack = []; // stack of '`' (inside template text) or '{' (inside ${ } or a block within it)
  while (i < src.length) {
    const c = src[i], top = stack[stack.length - 1];
    if (top === '`') { if (c === '\\') { i += 2; continue; } if (c === '`') { stack.pop(); out += '``'; i++; continue; } if (c === '$' && src[i + 1] === '{') { stack.push('{'); out += ' '; i += 2; continue; } i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 2; if (i < 2) break; continue; }
    if (c === "'" || c === '"') { const q = c; i++; while (i < src.length && src[i] !== q && src[i] !== '\n') { if (src[i] === '\\') i++; i++; } i++; out += q + q; continue; }
    if (c === '`') { stack.push('`'); i++; continue; }
    if (c === '{' && stack.length) stack.push('{');
    if (c === '}' && top === '{') { stack.pop(); if (stack[stack.length - 1] === '`') { i++; continue; } }
    out += c; i++;
  }
  return out;
}
const code = strip(all);
const defined = new Set();
const add = (s) => s.split(/[,\s{}[\]=.:]+/).forEach((x) => { const m = x.match(/^\.{0,3}([A-Za-z_$][\w$]*)$/); if (m) defined.add(m[1]); });
for (const m of code.matchAll(/function\s*\*?\s*([A-Za-z_$][\w$]*)?\s*\(([^)]*)\)/g)) { if (m[1]) defined.add(m[1]); add(m[2]); }
for (const m of code.matchAll(/\b(?:const|let|var)\s+([^;]+?)(?:=|;|\bof\b|\bin\b)/g)) add(m[1]);
for (const m of code.matchAll(/\(([^()]*)\)\s*=>/g)) add(m[1]);
for (const m of code.matchAll(/([A-Za-z_$][\w$]*)\s*=>/g)) defined.add(m[1]);
for (const m of code.matchAll(/catch\s*\(\s*([A-Za-z_$][\w$]*)/g)) defined.add(m[1]);
for (const m of code.matchAll(/(?<![\w$])([A-Za-z_$][\w$]*)\s*=\s*(?:function|\(|[A-Za-z_$][\w$]*\s*=>)/g)) defined.add(m[1]);
for (const m of code.matchAll(/[{,]\s*([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{/g)) defined.add(m[1]);   // object method shorthand
const builtins = new Set(('if for while switch return function catch typeof new await async do else case of in instanceof void delete super this import export ' +
  'Math JSON Object Array Set Map WeakMap Promise Date String Number Boolean Symbol Error RegExp parseInt parseFloat isNaN isFinite encodeURIComponent decodeURIComponent ' +
  'setTimeout clearTimeout setInterval clearInterval requestAnimationFrame fetch alert confirm structuredClone queueMicrotask Intl console ' +
  'Blob one matchMedia BigInt Proxy Reflect escape unescape atob btoa AudioContext webkitAudioContext URL Element Event navigator document window localStorage Image XMLSerializer').split(/\s+/));
const unknown = new Map();
for (const [f, src] of Object.entries(files)) for (const m of strip(src).matchAll(/(?<![.\w$`])([A-Za-z_$][\w$]*)\s*\(/g)) {
  const n = m[1]; if (builtins.has(n) || defined.has(n)) continue; unknown.set(n, (unknown.get(n) || new Set()).add(f)); }
let fails = 0;
// classic <script>s share one global scope: the same top-level const/let/function name in two files stops the later file from loading
// (a map helper named GEO once collided with the shape isle's GEO and the whole blank-map isle silently vanished)
const tops = new Map();
for (const [f, src] of Object.entries(files)) for (const m of strip(src).matchAll(/^(?:const|let|class|function)\s+([A-Za-z_$][\w$]*)/gm)) { const k = m[1]; if (tops.has(k) && tops.get(k) !== f) { fails++; console.log(`FAIL top-level name ${k} declared in both ${tops.get(k)} and ${f}`); } else tops.set(k, f); }
for (const [n, fs] of unknown) { fails++; console.log(`FAIL called but never defined: ${n}  (in ${[...fs].join(', ')})`); }
console.log(`\nreference checks: ${defined.size} names defined, ${fails} failures`);
process.exit(fails ? 1 : 0);
