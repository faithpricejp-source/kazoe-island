// 図形の島 — angle chasing with rule cards, area by splitting / subtracting / sliding, counting figures, cube nets.
// Every answer is computed from geometry (coordinates, shoelace, enumeration, cube-rolling simulation); tests/verify_worlds.mjs re-checks them.
const GEO = (() => {
  const R = Math.PI / 180;
  const ray = (P, deg, len) => [P[0] + len * Math.cos(deg * R), P[1] - len * Math.sin(deg * R)];
  function isect(P, d1, Q, d2) {
    const u = [Math.cos(d1 * R), -Math.sin(d1 * R)], v = [Math.cos(d2 * R), -Math.sin(d2 * R)];
    const dx = Q[0] - P[0], dy = Q[1] - P[1], det = -u[0] * v[1] + v[0] * u[1];
    const t = (-dx * v[1] + v[0] * dy) / det;
    return [P[0] + t * u[0], P[1] + t * u[1]];
  }
  function angleAt(V, A, B) {
    const a = Math.atan2(A[1] - V[1], A[0] - V[0]), b = Math.atan2(B[1] - V[1], B[0] - V[0]);
    let d = Math.abs(a - b) / R; if (d > 180) d = 360 - d; return d;
  }
  const shoelace = (pts) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
  return { R, ray, isect, angleAt, shoelace };
})();

// ---------- cube nets: roll a cube across the cells; a net is valid when the 6 cells get 6 different bottom faces ----------
const NETS = (() => {
  const roll = { E: (s) => ({ B: s.E, E: s.T, T: s.W, W: s.B, N: s.N, S: s.S }), W: (s) => ({ B: s.W, W: s.T, T: s.E, E: s.B, N: s.N, S: s.S }),
                 N: (s) => ({ B: s.N, N: s.T, T: s.S, S: s.B, E: s.E, W: s.W }), S: (s) => ({ B: s.S, S: s.T, T: s.N, N: s.B, E: s.E, W: s.W }) };
  const dirs = { E: [0, 1], W: [0, -1], N: [-1, 0], S: [1, 0] };
  // cells: array of [row, col]; returns map "r,c" -> face id 0..5, or null if not connected
  function fold(cells) {
    const key = (r, c) => r + ',' + c, set = new Set(cells.map(([r, c]) => key(r, c)));
    if (!cells.length) return null;
    const face = {}, start = cells[0], q = [[start, { B: 0, T: 1, N: 2, S: 3, E: 4, W: 5 }]];
    face[key(...start)] = 0;
    while (q.length) {
      const [[r, c], st] = q.shift();
      for (const d of Object.keys(dirs)) {
        const nr = r + dirs[d][0], nc = c + dirs[d][1], k = key(nr, nc);
        if (set.has(k) && !(k in face)) { const ns = roll[d](st); face[k] = ns.B; q.push([[nr, nc], ns]); }
      }
    }
    return Object.keys(face).length === cells.length ? face : null;
  }
  const opposite = (f) => [1, 0, 3, 2, 5, 4][f];
  function isCubeNet(cells) { if (cells.length !== 6) return false; const f = fold(cells); return !!f && new Set(Object.values(f)).size === 6; }
  function canon(cells) {
    const forms = [];
    for (let k = 0; k < 8; k++) {
      let pts = cells.map(([r, c]) => { let x = c, y = r; for (let i = 0; i < k % 4; i++) [x, y] = [y, -x]; if (k >= 4) x = -x; return [y, x]; });
      const mr = Math.min(...pts.map((p) => p[0])), mc = Math.min(...pts.map((p) => p[1]));
      forms.push(pts.map(([r, c]) => [r - mr, c - mc]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((p) => p.join(',')).join(';'));
    }
    return forms.sort()[0];
  }
  // face opposite to the face lying on cell i (index into cells)
  function oppositeCell(cells, i) {
    const f = fold(cells), key = (r, c) => r + ',' + c; const want = opposite(f[key(...cells[i])]);
    return cells.findIndex(([r, c]) => f[key(r, c)] === want);
  }
  return { fold, isCubeNet, canon, oppositeCell };
})();

// ---------- counting helpers (brute force, used as the outside judge) ----------
const COUNTFIG = {
  rects: (m, n) => { let c = 0; for (let x1 = 0; x1 <= m; x1++) for (let x2 = x1 + 1; x2 <= m; x2++) for (let y1 = 0; y1 <= n; y1++) for (let y2 = y1 + 1; y2 <= n; y2++) c++; return c; },
  squares: (m, n) => { let c = 0; for (let x1 = 0; x1 <= m; x1++) for (let x2 = x1 + 1; x2 <= m; x2++) for (let y1 = 0; y1 <= n; y1++) for (let y2 = y1 + 1; y2 <= n; y2++) if (x2 - x1 === y2 - y1) c++; return c; },
  // fan: apex + k base points, optionally `layers` horizontal cross lines; a triangle = apex + two points on one horizontal line
  fanTriangles: (k, layers) => { let c = 0; for (let L = 0; L < layers; L++) for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) c++; return c; },
  paintedCubes: (n, faces) => { let c = 0; for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) { const f = [x, y, z].filter((v) => v === 0 || v === n - 1).length; if (f === faces) c++; } return c; },
};

// ---------- drawing helpers ----------
const SVGK = {
  ink: '#3d3751', soft: '#b9b2c9', fill: '#ffe3a3', fill2: '#cfe7ff', aux: '#e0566f', ok: '#3fae68',
  line: (a, b, o = {}) => `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${o.c || SVGK.ink}" stroke-width="${o.w || 3}" ${o.dash ? 'stroke-dasharray="7 6"' : ''} stroke-linecap="round"/>`,
  poly: (pts, o = {}) => `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="${o.f || 'none'}" stroke="${o.c || SVGK.ink}" stroke-width="${o.w || 3}" stroke-linejoin="round" ${o.dash ? 'stroke-dasharray="7 6"' : ''} ${o.op ? `fill-opacity="${o.op}"` : ''}/>`,
  text: (p, t, o = {}) => `<text x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="${o.s || 17}" font-weight="800" fill="${o.c || SVGK.ink}" font-family="Fredoka, 'M PLUS Rounded 1c', sans-serif">${t}</text>`,
  dot: (p, l, off = [0, -16]) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="${SVGK.ink}"/>${l ? SVGK.text([p[0] + off[0], p[1] + off[1]], l, { s: 15 }) : ''}`,
  tick: (a, b, n = 1) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 7, ny = dx / L * 7, tx = dx / L * 5, ty = dy / L * 5;
    let s = ''; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2); s += SVGK.line([m[0] - nx + tx * o, m[1] - ny + ty * o], [m[0] + nx + tx * o, m[1] + ny + ty * o], { w: 2.5 }); } return s; },
  arrow: (a, b) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    return `<path d="M${(m[0] - ux * 8 - uy * 6).toFixed(1)} ${(m[1] - uy * 8 + ux * 6).toFixed(1)} L${(m[0]).toFixed(1)} ${(m[1]).toFixed(1)} L${(m[0] - ux * 8 + uy * 6).toFixed(1)} ${(m[1] - uy * 8 - ux * 6).toFixed(1)}" fill="none" stroke="${SVGK.ink}" stroke-width="2.5"/>`; },
  arc: (V, A, B, r, col, op = .35) => {
    const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]); let a2 = Math.atan2(B[1] - V[1], B[0] - V[0]);
    let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const p1 = [V[0] + r * Math.cos(a1), V[1] + r * Math.sin(a1)], p2 = [V[0] + r * Math.cos(a1 + d), V[1] + r * Math.sin(a1 + d)];
    const mid = a1 + d / 2;
    return { path: `<path d="M${V[0].toFixed(1)} ${V[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-width="2"/>`, lab: [V[0] + (r + 18) * Math.cos(mid), V[1] + (r + 18) * Math.sin(mid)] };
  },
  grid: (W, H, u, ox, oy) => { let s = ''; for (let x = 0; x <= W; x++) s += SVGK.line([ox + x * u, oy], [ox + x * u, oy + H * u], { c: '#e4dff0', w: 1.2 }); for (let y = 0; y <= H; y++) s += SVGK.line([ox, oy + y * u], [ox + W * u, oy + y * u], { c: '#e4dff0', w: 1.2 }); return s; },
  wrap: (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" style="background:#fffef9;border-radius:14px">${inner}</svg>`,
};

// ---------- rule cards for angle chasing ----------
const ARULES = {
  line: { n: tx('一直線は180°', 'A straight line is 180°', '平角是180°'), d: tx('まっすぐな線の上で、となりあう角をたすと180°。', 'Angles side by side on a straight line add up to 180°.', '直线上相邻的角加起来是180°。') },
  tri: { n: tx('三角形の3つの角の和は180°', 'A triangle’s angles add up to 180°', '三角形内角和是180°'), d: tx('どんな三角形でも、3つの角をたすと180°。', 'In every triangle the three angles add to 180°.', '任何三角形三个角加起来都是180°。') },
  ext: { n: tx('[外角|がいかく] = となり合わない2つの[内角|ないかく]の[和|わ]', 'Exterior angle = sum of the two far angles', '外角 = 不相邻两内角之和'), d: tx('三角形の外側の角は、はなれた2つの角をたしたもの。', 'A triangle’s outside angle equals the two angles not next to it.', '三角形的外角等于与它不相邻的两个内角之和。') },
  vert: { n: tx('向かい合う角([対頂角|たいちょうかく])は同じ', 'Vertical angles are equal', '对顶角相等'), d: tx('2本の線が交わるとき、向かい合う角は同じ大きさ。', 'When two lines cross, opposite angles are equal.', '两条直线相交，相对的角相等。') },
  par: { n: tx('[平行線|へいこうせん]の[錯角|さっかく]・[同位角|どういかく]は同じ', 'Parallel lines: alternate & corresponding angles are equal', '平行线的内错角、同位角相等'), d: tx('平行な2本の線に1本の線が交わると、Z字の角(錯角)とF字の角(同位角)は同じ。', 'A line crossing two parallel lines makes equal Z-angles and F-angles.', '一条线穿过两条平行线，Z字形的角（内错角）和F字形的角（同位角）相等。') },
  iso: { n: tx('[二等辺三角形|にとうへんさんかくけい]の[底角|ていかく]は同じ', 'Isosceles: the base angles are equal', '等腰三角形两底角相等'), d: tx('2辺が同じ長さの三角形は、2つの底角が同じ。底角 = (180° − 頂角) ÷ 2', 'Two equal sides mean two equal base angles: base = (180° − top) ÷ 2.', '两边相等的三角形，两个底角相等：底角 = (180° − 顶角) ÷ 2。') },
  poly: { n: tx('多角形の角の和 = (辺の数 − 2) × 180°', 'Polygon angle sum = (sides − 2) × 180°', '多边形内角和 = (边数 − 2) × 180°'), d: tx('多角形は三角形に分けられる。五角形なら3つ → 540°。正五角形の1つの角は 540 ÷ 5。', 'A polygon splits into triangles: a pentagon makes 3, so 540°. Each angle of a regular pentagon is 540 ÷ 5.', '多边形可以分成三角形：五边形分成3个，所以540°；正五边形每个角是 540 ÷ 5。') },
  parts: { n: tx('角は分けた部分の和', 'An angle is the sum of its parts', '角等于分开的部分之和'), d: tx('1つの角を線で2つに分けたら、もとの角 = 2つの部分の和。', 'If a line splits an angle in two, the whole equals the two parts added.', '一个角被线分成两部分，原角 = 两部分之和。') },
};

// angle-board task: tap an unknown angle, pick a rule, enter the value.
function angleTask(def) {
  return (box, api) => {
    const st = api.state; const known = st.known || (st.known = new Set(Object.keys(def.ang).filter((k) => def.ang[k].given)));
    const aux = st.aux || (st.aux = new Set()); let sel = null, rule = null;
    const visible = (k) => !def.ang[k].layer || aux.has(def.ang[k].layer);
    function svg() {
      let s = '';
      if (def.par) def.par.forEach(([a, b]) => { s += SVGK.arrow(def.pts[a], def.pts[b]); });
      def.segs.forEach(([a, b]) => { s += SVGK.line(def.pts[a], def.pts[b]); });
      (def.ticks || []).forEach(([a, b, n]) => { s += SVGK.tick(def.pts[a], def.pts[b], n); });
      (def.auxSegs || []).forEach(([layer, a, b]) => { if (aux.has(layer)) s += SVGK.line(def.pts[a], def.pts[b], { c: SVGK.aux, dash: true }); });
      for (const [k, A] of Object.entries(def.ang)) {
        if (!visible(k)) continue;
        const isK = known.has(k), col = A.target ? '#e0566f' : isK ? (A.given ? '#8b6fd6' : '#3fae68') : '#ffb020';
        const arc = SVGK.arc(def.pts[A.v], def.pts[A.a], def.pts[A.b], A.r || 24, col, A.target ? .1 : .35);
        const label = isK ? A.val + '°' : (A.target ? '?' : k);
        s += arc.path + `<g class="angtap" data-ang="${k}" style="cursor:${isK ? 'default' : 'pointer'}"><circle cx="${arc.lab[0].toFixed(1)}" cy="${arc.lab[1].toFixed(1)}" r="17" fill="${sel === k ? '#ffc94d' : '#fff'}" stroke="${col}" stroke-width="2.5"/>${SVGK.text(arc.lab, label, { s: isK ? 13 : 16, c: SVGK.ink })}</g>`;
      }
      Object.entries(def.labels || {}).forEach(([k, off]) => { s += SVGK.dot(def.pts[k], k, off); });
      if (def.face) { // like DragonBox Elements: the shape is asleep until you prove its angle, then it wakes up
        const P = def.face.map((k) => def.pts[k]), c = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3 + 8];
        const awake = Object.keys(def.ang).some((k) => def.ang[k].target && known.has(k));
        s += awake ? `<g class="wake"><circle cx="${c[0] - 11}" cy="${c[1]}" r="4" fill="${SVGK.ink}"/><circle cx="${c[0] + 11}" cy="${c[1]}" r="4" fill="${SVGK.ink}"/><path d="M${c[0] - 7} ${c[1] + 9} Q${c[0]} ${c[1] + 16} ${c[0] + 7} ${c[1] + 9}" stroke="${SVGK.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="${c[0] - 20}" cy="${c[1] + 8}" rx="5" ry="3" fill="#ff9fb2"/><ellipse cx="${c[0] + 20}" cy="${c[1] + 8}" rx="5" ry="3" fill="#ff9fb2"/></g>`
          : `<path d="M${c[0] - 16} ${c[1]} h9 M${c[0] + 7} ${c[1]} h9" stroke="${SVGK.ink}" stroke-width="2.5" stroke-linecap="round"/>${SVGK.text([c[0] + 24, c[1] - 16], 'z', { s: 13, c: '#8b6fd6' })}${SVGK.text([c[0] + 33, c[1] - 27], 'z', { s: 10, c: '#8b6fd6' })}`;
      }
      return SVGK.wrap(def.w || 400, def.h || 300, s);
    }
    function render() {
      const unk = Object.keys(def.ang).filter((k) => visible(k) && !known.has(k));
      box.innerHTML = `<div class="panel interact"><div id="angfig">${svg()}</div>
        ${def.auxTools ? `<div class="chipbar">${def.auxTools.map((t) => `<button class="chip ${aux.has(t.id) ? 'on' : ''}" data-aux="${t.id}" type="button">✏️ ${T(t.t)}</button>`).join('')}</div>` : ''}
        <div class="chipbar">${unk.map((k) => `<button class="chip ${sel === k ? 'on' : ''}" data-sel="${k}" type="button">∠${def.ang[k].target ? '?' : k}</button>`).join('')}</div>
        <div id="angpanel" style="width:100%"></div></div>`;
      $$('.angtap', box).forEach((g) => g.addEventListener('click', () => pick(g.dataset.ang)));
      $$('[data-sel]', box).forEach((b) => b.onclick = () => pick(b.dataset.sel));
      $$('[data-aux]', box).forEach((b) => b.onclick = () => { const id = b.dataset.aux; aux.has(id) ? aux.delete(id) : aux.add(id); snd('pop'); render(); });
      if (sel) panel();
    }
    function pick(k) { if (known.has(k)) return; sel = k; rule = null; snd('pop'); render(); }
    function panel() {
      const pnl = $('#angpanel', box), A = def.ang[sel];
      pnl.innerHTML = `<div class="tdesc"><b style="color:var(--ink)">∠${A.target ? '?' : sel}</b> — ${T(SH.whichRule)}</div>
        <div class="opts" style="margin-top:8px">${def.rules.map((r) => `<button class="opt ${rule === r ? 'right' : ''}" data-rule="${r}" type="button">${T(ARULES[r].n)}</button>`).join('')}</div><div id="angnum"></div>`;
      $$('[data-rule]', pnl).forEach((b) => b.onclick = () => {
        const r = b.dataset.rule, ders = def.der[sel] || [], d = ders.find((x) => x.r === r);
        if (!d) { api.bad(T(SH.ruleNo, { r: T(ARULES[r].n) }) + ' ' + T(ARULES[r].d), 'rule'); return; }
        const miss = d.from.filter((f) => !known.has(f));
        if (miss.length) { $('#fb').innerHTML = `<div class="fb no">${T(SH.needFirst)} ${miss.map((m) => '∠' + (def.ang[m].target ? '?' : m)).join(', ')}${miss.some((m) => def.ang[m].layer && !aux.has(def.ang[m].layer)) ? ' — ' + T(SH.useAux) : ''}</div>`; return; }
        rule = r; snd('step'); panel();
        numPad($('#angnum', pnl), 'num', (v) => {
          if (v === A.val) {
            known.add(sel); snd('ok'); $('#fb').innerHTML = `<div class="fb ok"><div>✓ ∠${A.target ? '?' : sel} = ${A.val}° — ${T(ARULES[r].n)}</div></div>`;
            if (A.target) { sel = null; render(); api.ok(); return; }
            sel = null; rule = null; render();
          } else api.bad(T(d.h || ARULES[r].d), 'calc');
        });
        $('#angnum .ansrow', pnl).insertAdjacentHTML('afterbegin', `<span class="unit">∠${A.target ? '?' : sel} =</span>`);
        $('#angnum .ansrow', pnl).insertAdjacentHTML('beforeend', `<span class="unit">°</span>`);
      });
    }
    render();
  };
}

// ---------- angle figures (constructed from the angles, so the picture is exact) ----------
function figTriExt() { const B = [70, 230], C = [300, 230], A = GEO.isect(B, 60, C, 130), D = [380, 230];
  return { face: ['A', 'B', 'C'], pts: { A, B, C, D }, segs: [['A', 'B'], ['B', 'D'], ['A', 'C']], labels: { A: [0, -18], B: [-12, 14], C: [6, 16], D: [8, 14] },
    ang: { b: { v: 'B', a: 'A', b: 'C', val: 60, given: true }, c: { v: 'C', a: 'A', b: 'B', val: 50, given: true }, a: { v: 'A', a: 'B', b: 'C', val: 70 }, x: { v: 'C', a: 'A', b: 'D', val: 130, target: true, r: 30 } },
    der: { a: [{ r: 'tri', from: ['b', 'c'], h: tx('180 − 60 − 50 を計算しよう。', 'Work out 180 − 60 − 50.', '算一算 180 − 60 − 50。') }], x: [{ r: 'line', from: ['c'], h: tx('180 − 50 を計算しよう。', 'Work out 180 − 50.', '算 180 − 50。') }, { r: 'ext', from: ['a', 'b'], h: tx('はなれた2つの角 60 と 70 をたそう。', 'Add the two far angles, 60 and 70.', '把不相邻的两个角 60 和 70 加起来。') }] },
    rules: ['tri', 'line', 'ext', 'vert', 'par'] }; }
function figParallel() { const Q = [120, 230], P = GEO.ray(Q, 62, 150 / Math.sin(62 * GEO.R)), L1 = [30, 80], R1 = [370, 80], L2 = [30, 230], R2 = [370, 230], T1 = GEO.ray(Q, 242, 50), T2 = GEO.ray(P, 62, 50);
  return { pts: { P, Q, L1, R1, L2, R2, T1, T2 }, segs: [['L1', 'R1'], ['L2', 'R2'], ['T1', 'T2']], par: [['L1', 'R1'], ['L2', 'R2']], labels: { P: [-14, -14], Q: [16, 12] },
    ang: { g: { v: 'Q', a: 'R2', b: 'P', val: 62, given: true }, x: { v: 'P', a: 'L1', b: 'Q', val: 62 }, y: { v: 'P', a: 'R1', b: 'Q', val: 118, target: true, r: 30 } },
    der: { x: [{ r: 'par', from: ['g'], h: tx('Z字の形を探そう。上と下で同じ角になるよ。', 'Find the Z shape: the top and bottom angles match.', '找Z字形：上下两个角相等。') }], y: [{ r: 'line', from: ['x'], h: tx('180 − 62 を計算しよう。', 'Work out 180 − 62.', '算 180 − 62。') }] },
    rules: ['par', 'line', 'tri', 'vert', 'iso'] }; }
function figKunoji() { const A = [40, 30], C = [40, 280], B = GEO.isect(A, -35, C, 40), L1 = [10, 30], R1 = [390, 30], L2 = [10, 280], R2 = [390, 280], E = [B[0] - 150, B[1]], F = [B[0] + 120, B[1]];
  return { w: 400, h: 310, pts: { A, B, C, L1, R1, L2, R2, E, F }, segs: [['L1', 'R1'], ['L2', 'R2'], ['A', 'B'], ['B', 'C']], par: [['L1', 'R1'], ['L2', 'R2']], labels: { A: [-6, -16], B: [16, 4], C: [-6, 16] },
    auxSegs: [['aux', 'E', 'F']], auxTools: [{ id: 'aux', t: tx('Bを通る平行線をひく', 'Draw a parallel line through B', '过B画平行线') }],
    ang: { a: { v: 'A', a: 'R1', b: 'B', val: 35, given: true, r: 40 }, c: { v: 'C', a: 'R2', b: 'B', val: 40, given: true, r: 40 }, p: { v: 'B', a: 'A', b: 'E', val: 35, layer: 'aux', r: 24 }, q: { v: 'B', a: 'E', b: 'C', val: 40, layer: 'aux', r: 24 }, x: { v: 'B', a: 'A', b: 'C', val: 75, target: true, r: 74 } },
    der: { p: [{ r: 'par', from: ['a'] }], q: [{ r: 'par', from: ['c'] }], x: [{ r: 'parts', from: ['p', 'q'], h: tx('上の部分と下の部分をたそう。', 'Add the upper part and the lower part.', '把上下两部分加起来。') }] },
    rules: ['par', 'parts', 'tri', 'line', 'ext'] }; }
function figIso() { const B = [120, 270], C = [280, 270], A = GEO.isect(B, 70, C, 110), D = [380, 270];
  return { face: ['A', 'B', 'C'], pts: { A, B, C, D }, segs: [['A', 'B'], ['A', 'C'], ['B', 'D']], ticks: [['A', 'B', 1], ['A', 'C', 1]], labels: { A: [0, -18], B: [-12, 14], C: [4, 16], D: [8, 14] },
    ang: { a: { v: 'A', a: 'B', b: 'C', val: 40, given: true, r: 30 }, b: { v: 'B', a: 'A', b: 'C', val: 70 }, c: { v: 'C', a: 'A', b: 'B', val: 70 }, x: { v: 'C', a: 'A', b: 'D', val: 110, target: true, r: 28 } },
    der: { b: [{ r: 'iso', from: ['a'], h: tx('(180 − 40) ÷ 2 を計算しよう。', 'Work out (180 − 40) ÷ 2.', '算 (180 − 40) ÷ 2。') }], c: [{ r: 'iso', from: ['a'] }, { r: 'iso', from: ['b'] }], x: [{ r: 'line', from: ['c'] }, { r: 'ext', from: ['a', 'b'] }] },
    rules: ['iso', 'tri', 'line', 'ext', 'par'] }; }
function figPenta() { const O = [200, 165], V = [90, 162, 234, 306, 18].map((d) => GEO.ray(O, d, 120)); const [A, B, C, D, E] = V;
  return { face: ['A', 'B', 'C'], pts: { A, B, C, D, E }, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'A'], ['A', 'C']], ticks: [['A', 'B', 2], ['B', 'C', 2]], labels: { A: [0, -18], B: [-16, 0], C: [-12, 14], D: [12, 14], E: [16, 0] },
    ang: { b: { v: 'B', a: 'A', b: 'C', val: 108, r: 26 }, x: { v: 'A', a: 'B', b: 'C', val: 36, target: true, r: 40 } },
    der: { b: [{ r: 'poly', from: [], h: tx('五角形の角の和は (5 − 2) × 180 = 540°。それを5でわろう。', 'A pentagon’s angles total (5 − 2) × 180 = 540°. Divide by 5.', '五边形内角和 (5 − 2) × 180 = 540°，再除以5。') }], x: [{ r: 'iso', from: ['b'], h: tx('三角形ABCは AB = BC の二等辺三角形。(180 − 108) ÷ 2。', 'Triangle ABC has AB = BC. Work out (180 − 108) ÷ 2.', '三角形ABC中 AB = BC，算 (180 − 108) ÷ 2。') }] },
    rules: ['poly', 'iso', 'tri', 'line', 'par'] }; }

// ---------- area figures on a 1 cm grid ----------
function areaFig(W, H, draw) { const u = 34, ox = 20, oy = 20; const P = ([x, y]) => [ox + x * u, oy + y * u];
  return (layers) => SVGK.wrap(W * u + 40, H * u + 40, SVGK.grid(W, H, u, ox, oy) + draw(P, layers || new Set(), u)); }
const lab = (P, a, b, t, off = [0, 0]) => { const p = P([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); return SVGK.text([p[0] + off[0], p[1] + off[1]], t, { s: 14, c: '#7d5434' }); };

// ---------- the world ----------
const SH = {
  whichRule: tx('どのルールを使う?', 'Which rule will you use?', '用哪条规则？'),
  ruleNo: tx('「{r}」はこの角には使えないみたい。', '"{r}" doesn’t fit this angle.', '“{r}”用不到这个角上。'),
  needFirst: tx('そのルールを使うには、先にこの角が必要:', 'To use that rule you first need:', '要用这条规则，先得求出：'),
  useAux: tx('[補助線|ほじょせん]をひいてみよう', 'try drawing the helper line', '试试画辅助线'),
  cm2: tx('cm²', 'cm²', 'cm²'), pieces: tx('こ', '', '个'),
};
registerWorld({
  id: 'shape', x: 9, y: 15, host: 'kaku', after: null,
  name: tx('図形の島', 'Shape Isle', '图形岛'), level: tx('小学・算数オリンピック', 'elementary · olympiad', '小学 · 奥数'),
  lockTxt: tx('いつでも行けるよ', 'Always open', '随时可去'),
  intro: tx('ここは図形の島。角度・面積・図形の数・立体を、ルールと「補助線」で解く島だよ。答えを当てるんじゃなくて、どのルールを使ったかが大事!', 'The Shape Isle: angles, areas, counting figures and solids — solved with rules and helper lines. What matters is which rule you used, not guessing!', '图形岛：角度、面积、数图形、立体，用规则和“辅助线”来解。重要的不是猜答案，而是用了哪条规则！'),
  species: {
    kaku: { c: '#7fb0ff', ear: 'horn', name: tx('かく', 'Kaku', '角角兽'), fact: tx('図形の島の案内役。角度を見るとつい測りたくなる。', 'Guide of the Shape Isle. Can’t see an angle without measuring it.', '图形岛向导，看到角就忍不住要量。') },
  },
  moves: {
    ruleCards: { ty: '∠', col: 'var(--tP)', n: tx('角のルールカード', 'Angle rule cards', '角度规则卡'), r: tx('一直線180°・三角形180°・外角・対頂角・錯角同位角・二等辺・多角形', 'line 180°, triangle 180°, exterior, vertical, parallel, isosceles, polygon', '平角、三角形内角和、外角、对顶角、平行线、等腰、多边形') },
    auxLine: { ty: '┄', col: 'var(--neg)', n: tx('[補助線|ほじょせん]', 'Helper lines', '辅助线'), r: tx('見えない平行線をひくと、角が2つに分かれて見える', 'A hidden parallel line splits the angle into parts you can see', '画一条看不见的平行线，角就分成看得见的两部分') },
    areaSplit: { ty: '▭+▭', col: 'var(--tN)', n: tx('分けてたす・まわりから引く', 'Split & add / box & subtract', '分割相加 / 外框相减'), r: tx('ナナメの図形は、まわりの長方形からはみ出しを引く', 'For slanted shapes, take the surrounding box minus the leftovers', '斜着的图形，用外框长方形减去多出来的部分') },
    slide: { ty: '⇄', col: 'var(--tW)', n: tx('[等積変形|とうせきへんけい]', 'Equal-area slide', '等积变形'), r: tx('底辺と高さが同じなら、三角形の面積は同じ', 'Same base and height → same triangle area', '同底等高，三角形面积相等') },
    pickLines: { ty: 'C×C', col: 'var(--tC)', n: tx('線を選んで数える', 'Count by choosing lines', '选线来数'), r: tx('長方形 = たて線2本 × よこ線2本 → C × C', 'A rectangle = 2 vertical × 2 horizontal lines → C × C', '长方形 = 2条竖线 × 2条横线 → C × C') },
    net: { ty: '⬚', col: 'var(--tP)', n: tx('[展開図|てんかいず]と向かいの面', 'Nets & opposite faces', '展开图与相对面'), r: tx('一直線にならぶ3つの面は、両はしが向かい合う', 'Three faces in a straight line: the two ends are opposite', '排成一直线的3个面，两端相对') },
  },
  tags: {
    countCalc: tx('図形の数の計算ミス', 'Counting-figures arithmetic slip', '数图形计算错'),
    areaSub: tx('面積でまわりから引くのをわすれた', 'Forgot to subtract the leftover area', '面积忘了减去多余部分'), halfBox: tx('長方形の半分と決めつけた', 'Assumed it was half the box', '以为正好是外框的一半'), missLayer: tx('平行な線の上の三角形を数えもれ', 'Missed the triangles on the parallel line', '漏数了平行线上的三角形'), wrongFaces: tx('ぬられた面の数のまちがい', 'Miscounted painted faces', '涂色面数弄错'),
    rule: tx('角のルールの選びまちがい', 'Picked the wrong angle rule', '角度规则选错'), calc: tx('角の計算ミス', 'Angle arithmetic slip', '角度计算错'),
    perimeter: tx('面積と周りの長さをまちがえた', 'Mixed up area and perimeter', '面积和周长混淆'), forgotHalf: tx('三角形の ÷2 をわすれた', 'Forgot ÷2 for a triangle', '三角形忘了÷2'),
    onlySmall: tx('小さい図形しか数えなかった', 'Counted only the smallest figures', '只数了最小的图形'), overlap: tx('重なりを2回引いた', 'Subtracted an overlap twice', '重叠部分减了两次'),
    netWrong: tx('展開図の向かいの面のまちがい', 'Opposite face on a net', '展开图相对面判断错'),
  },
  chapters: [
    { id: 'g1', host: 'kaku', place: tx('角度の探偵', 'Angle Detective', '角度侦探'), topic: tx('ルールで角をつなぐ', 'Chain angles with rules', '用规则串起角'), unlock: ['kaku'], moves: ['ruleCards', 'auxLine'],
      say: [tx('ようこそ図形の島へ! ぼくは かく。', 'Welcome to the Shape Isle! I’m Kaku.', '欢迎来到图形岛！我是角角兽。'), tx('角度の問題は、わかっている角から「ルール」で1つずつつないでいくんだ。', 'Angle problems are solved by chaining rules, one known angle at a time.', '角度题就是从已知的角出发，用“规则”一个一个推下去。'), tx('この島の三角形は ねぼすけ。ルールを使って ? の角度を求めると、目をさますよ!', 'The triangles here are sleepyheads. Prove the ? angle with rules and they wake up!', '这里的三角形都是瞌睡虫。用规则求出 ? 角，它们就会醒来！')],
      lessons: [
        { h: () => `<h3>${LANGTXT('三角形の角の和は、いつでも180°?', 'Do a triangle’s angles always add to 180°?', '三角形内角和永远是180°吗？')}</h3><p>${LANGTXT('スライダーで点Aを動かしてみよう。', 'Drag the slider to move point A.', '拖动滑块移动点A。')}</p><div class="interact"><div id="trifig"></div><input id="trislide" type="range" min="40" max="360" value="160" style="width:min(360px,100%)" aria-label="A"><div id="trisum" class="disp" style="font-size:1.3rem"></div></div>`,
          m: (el) => { const draw = () => { const ax = +$('#trislide', el).value, A = [ax, 50], B = [60, 240], C = [340, 240];
            const a = GEO.angleAt(A, B, C), b = GEO.angleAt(B, A, C), c = GEO.angleAt(C, A, B); const ra = Math.round(a), rb = Math.round(b), rc = 180 - ra - rb;
            const arcs = [SVGK.arc(A, B, C, 24, '#ff8f45'), SVGK.arc(B, A, C, 28, '#8b6fd6'), SVGK.arc(C, A, B, 28, '#2fb0c6')];
            $('#trifig', el).innerHTML = SVGK.wrap(400, 280, SVGK.poly([A, B, C]) + arcs.map((x, i) => x.path + SVGK.text(x.lab, [ra, rb, rc][i] + '°', { s: 14 })).join(''));
            $('#trisum', el).textContent = `${ra}° + ${rb}° + ${rc}° = 180°`; };
            $('#trislide', el).oninput = draw; draw(); } },
        { h: () => `<h3>${LANGTXT('ルールカード', 'Rule cards', '规则卡')}</h3><p>${LANGTXT('角を1つ選んで、使うルールを選んで、数を入れる。ルールが合っていないと進めないよ。', 'Pick an angle, pick the rule, then enter the number. The wrong rule won’t let you move on.', '选一个角，选要用的规则，再填数字。规则不对就过不去。')}</p><div class="opts">${['line', 'tri', 'ext', 'vert', 'par', 'iso', 'poly', 'parts'].map((r) => `<div class="opt" style="cursor:default"><b style="color:var(--ink)">${T(ARULES[r].n)}</b><br><span class="muted">${T(ARULES[r].d)}</span></div>`).join('')}</div>` },
      ],
      problems: [
        { id: 'g1a', sets: [[0]], make: () => { const d = figTriExt(); return { kind: 'custom', story: tx('∠? は何度? 先に ∠a を出してもいいし、外角のルールを使ってもいいよ。', 'What is ∠? You can find ∠a first, or use the exterior-angle rule.', '∠? 是多少度？可以先求 ∠a，也可以用外角规则。'), def: d, ans: 130, mount: angleTask(d), praise: tx('ルールをつないで答えにたどりついたね!', 'You chained the rules all the way!', '你把规则串起来，推到了答案！'), why: tx('∠a = 180 − 60 − 50 = 70(三角形)。∠? = 180 − 50 = 130(一直線)。外角なら 60 + 70 = 130 でも同じ。', '∠a = 180 − 60 − 50 = 70 (triangle). ∠? = 180 − 50 = 130 (straight line). Or exterior angle: 60 + 70 = 130.', '∠a = 180 − 60 − 50 = 70（三角形）。∠? = 180 − 50 = 130（平角）。用外角也是 60 + 70 = 130。') }; } },
        { id: 'g1b', sets: [[0]], make: () => { const d = figParallel(); return { kind: 'custom', story: tx('2本の線は平行(矢印のしるし)。∠? は何度?', 'The two lines are parallel (arrow marks). What is ∠?', '两条线平行（有箭头记号）。∠? 是多少度？'), def: d, ans: 118, mount: angleTask(d), why: tx('Z字の錯角で ∠x = 62。一直線で ∠? = 180 − 62 = 118。', 'Z-angles: ∠x = 62. Straight line: ∠? = 180 − 62 = 118.', '内错角 ∠x = 62，平角 ∠? = 180 − 62 = 118。') }; } },
        { id: 'g1c', sets: [[0]], make: () => { const d = figKunoji(); return { kind: 'custom', story: tx('上と下の線は平行。くの字に曲がった ∠? は何度? ヒント: 補助線!', 'The top and bottom lines are parallel. What is the bent angle ∠? Hint: a helper line!', '上下两条线平行。折出来的 ∠? 是多少度？提示：辅助线！'), def: d, ans: 75, mount: angleTask(d), praise: tx('補助線で角を2つに分けられたね。算数オリンピックでよく出る形だよ!', 'Your helper line split the angle in two — a classic olympiad trick!', '你用辅助线把角分成了两份，这是奥数常考的形状！'), why: tx('Bを通る平行線をひくと、∠? が上と下に分かれる。上は錯角で35°、下は錯角で40°。∠? = 35 + 40 = 75。「くの字の角 = 両側の角の和」は覚えておくと速い。', 'A parallel line through B splits ∠? into two parts: 35° and 40° (Z-angles). ∠? = 75. Remember: the bend = sum of the two outer angles.', '过B画平行线，∠? 分成上下两部分：内错角35°和40°，∠? = 75。记住：折角 = 两侧角之和。') }; } },
        { id: 'g1d', sets: [[0]], make: () => { const d = figIso(); return { kind: 'custom', story: tx('AB = AC の二等辺三角形(同じしるしの辺は同じ長さ)。∠? は何度?', 'Isosceles triangle with AB = AC (matching marks = equal sides). What is ∠?', '等腰三角形 AB = AC（相同记号的边相等）。∠? 是多少度？'), def: d, ans: 110, mount: angleTask(d), why: tx('底角 = (180 − 40) ÷ 2 = 70。∠? = 180 − 70 = 110。', 'Base angles = (180 − 40) ÷ 2 = 70. ∠? = 180 − 70 = 110.', '底角 = (180 − 40) ÷ 2 = 70。∠? = 180 − 70 = 110。') }; } },
        { id: 'g1e', sets: [[0]], make: () => { const d = figPenta(); return { kind: 'custom', story: tx('正五角形に対角線を1本ひいたよ。∠? は何度?', 'A regular pentagon with one diagonal. What is ∠?', '正五边形画了一条对角线。∠? 是多少度？'), def: d, ans: 36, mount: angleTask(d), praise: tx('多角形のルールと二等辺のルール、2つ組み合わせたね!', 'You combined the polygon rule and the isosceles rule!', '你把多边形规则和等腰规则组合起来了！'), why: tx('五角形の角の和は540°、正五角形の1つの角は108°。三角形ABCは二等辺なので (180 − 108) ÷ 2 = 36。', 'Pentagon angles total 540°, so each is 108°. Triangle ABC is isosceles: (180 − 108) ÷ 2 = 36.', '五边形内角和540°，每个角108°。三角形ABC是等腰，(180 − 108) ÷ 2 = 36。') }; } },
      ] },
    { id: 'g2', host: 'kaku', place: tx('面積のはたけ', 'Area Fields', '面积农田'), topic: tx('分ける・引く・ずらす', 'Split, subtract, slide', '分割、相减、平移'), unlock: ['tsuno'], moves: ['areaSplit', 'slide'],
      say: [tx('はたけの広さを測ろう。方眼の1マスは1cm²だよ。', 'Let’s measure the fields. One grid square is 1 cm².', '来量农田的面积。方格的一格是1cm²。'), tx('ナナメの形も、補助線をひけばいつもの長方形と三角形になる!', 'With a helper line, even slanted shapes turn into rectangles and triangles!', '画上辅助线，斜的图形也会变成熟悉的长方形和三角形！')],
      lessons: [
        { h: () => `<h3>${LANGTXT('3つのわざ', '3 tricks', '3个招数')}</h3><div class="rule"><span class="op add">＋</span><div>${LANGTXT('<b>分けてたす</b>: 長方形や三角形に切って、たす', '<b>Split & add</b>: cut into rectangles/triangles, add them', '<b>分割相加</b>：切成长方形和三角形再加')}</div><span class="op sub">−</span><div>${LANGTXT('<b>まわりから引く</b>: 大きな長方形でかこんで、はみ出しを引く', '<b>Box & subtract</b>: put a big rectangle around it and subtract the extra', '<b>外框相减</b>：用大长方形框住，减去多出来的')}</div><span class="op mul">⇄</span><div>${LANGTXT('<b>ずらす([等積変形|とうせきへんけい])</b>: 底辺と高さが同じなら、形を変えても面積は同じ', '<b>Slide</b>: same base and height keep the same area', '<b>平移（等积变形）</b>：底和高不变，面积就不变')}</div></div>` },
        { h: () => `<h3>${LANGTXT('等積変形を見てみよう', 'Watch the equal-area slide', '看看等积变形')}</h3><p>${LANGTXT('頂点を平行線にそって動かしても、面積は変わらない。', 'Slide the top point along the parallel line — the area never changes.', '顶点沿平行线移动，面积不变。')}</p><div class="interact"><div id="slfig"></div><input id="slide" type="range" min="0" max="10" value="3" style="width:min(360px,100%)" aria-label="apex"><div id="slarea" class="disp" style="font-size:1.2rem"></div></div>`,
          m: (el) => { const draw = () => { const t = +$('#slide', el).value; const f = areaFig(10, 5, (P) => { const A = [t, 0], B = [2, 5], C = [8, 5]; return SVGK.line(P([0, 0]), P([10, 0]), { c: SVGK.aux, dash: true }) + SVGK.poly([P(A), P(B), P(C)], { f: SVGK.fill }) + lab(P, B, C, '6 cm', [0, 14]); });
            $('#slfig', el).innerHTML = f(); $('#slarea', el).textContent = `6 × 5 ÷ 2 = ${GEO.shoelace([[t, 0], [2, 5], [8, 5]])} cm²`; };
            $('#slide', el).oninput = draw; draw(); } },
      ],
      problems: [
        { id: 'g2a', sets: [[0]], make: () => { const poly = [[0, 0], [6, 0], [6, 2], [2, 2], [2, 5], [0, 5]];
          return { kind: 'num', unit: SH.cm2, story: tx('L字のはたけの面積は何cm²?', 'What is the area of the L-shaped field (cm²)?', 'L形农田的面积是多少cm²？'), ans: GEO.shoelace(poly), poly,
            fig: areaFig(7, 6, (P, L) => SVGK.poly(poly.map(P), { f: SVGK.fill }) + lab(P, [0, 0], [6, 0], '6 cm', [0, -12]) + lab(P, [6, 0], [6, 2], '2', [12, 0]) + lab(P, [0, 0], [0, 5], '5 cm', [-14, 0]) + lab(P, [2, 2], [2, 5], '3', [12, 0]) + lab(P, [2, 2], [6, 2], '4', [0, 12])
              + (L.has('split') ? SVGK.line(P([2, 0]), P([2, 2]), { c: SVGK.aux, dash: true }) : '') + (L.has('box') ? SVGK.poly([[0, 0], [6, 0], [6, 5], [0, 5]].map(P), { c: SVGK.aux, dash: true, w: 2.5 }) : '')),
            tools: [{ id: 'split', t: tx('分ける線', 'split line', '分割线') }, { id: 'box', t: tx('かこむ長方形', 'surrounding box', '外框') }],
            mis: [M(30, 'areaSub', tx('それは「かこむ長方形」ぜんぶ。右下の空いている部分をひこう。', 'That’s the whole surrounding box. Subtract the empty bottom-right part.', '那是整个外框，要减去右下角空着的部分。')), M(22, 'perimeter', tx('それはまわりの長さ(cm)。聞かれているのは広さ(cm²)だよ。', 'That’s the perimeter (cm). The question asks for area (cm²).', '那是周长（cm），题目问的是面积（cm²）。'))],
            hints: [tx('「分ける線」をおして、2つの長方形に分けてみよう。', 'Press "split line" to make two rectangles.', '按“分割线”，分成两个长方形。'), tx('2 × 5 と 4 × 2 をたそう。', 'Add 2 × 5 and 4 × 2.', '把 2 × 5 和 4 × 2 加起来。')],
            why: tx('分けて: 2×5 + 4×2 = 10 + 8 = 18。引いて: 6×5 − 4×3 = 30 − 12 = 18。どちらでも同じ!', 'Split: 2×5 + 4×2 = 18. Subtract: 6×5 − 4×3 = 18. Same answer either way!', '分割：2×5 + 4×2 = 18；相减：6×5 − 4×3 = 18。两种方法都一样！') }; } },
        { id: 'g2b', sets: [[0]], make: () => { const tri = [[0, 1], [5, 0], [3, 4]];
          return { kind: 'num', unit: SH.cm2, story: tx('方眼の上のナナメの三角形。面積は何cm²?', 'A slanted triangle on the grid. What is its area (cm²)?', '方格上的斜三角形，面积是多少cm²？'), ans: GEO.shoelace(tri),
            fig: areaFig(6, 5, (P, L) => (L.has('box') ? SVGK.poly([[0, 0], [5, 0], [5, 4], [0, 4]].map(P), { c: SVGK.aux, dash: true, w: 2.5 }) + SVGK.poly([[0, 1], [0, 0], [5, 0]].map(P), { f: SVGK.fill2, c: SVGK.aux, w: 1.5 }) + SVGK.poly([[5, 0], [5, 4], [3, 4]].map(P), { f: SVGK.fill2, c: SVGK.aux, w: 1.5 }) + SVGK.poly([[3, 4], [0, 4], [0, 1]].map(P), { f: SVGK.fill2, c: SVGK.aux, w: 1.5 }) : '') + SVGK.poly(tri.map(P), { f: SVGK.fill, op: .85 })),
            tools: [{ id: 'box', t: tx('かこむ長方形とはみ出し', 'box & leftovers', '外框和多余部分') }],
            mis: [M(20, 'areaSub', tx('それは長方形ぜんぶ。青い3つの三角形をひこう。', 'That’s the whole box. Subtract the three blue triangles.', '那是整个长方形，要减去三个蓝色三角形。')), M(10, 'halfBox', tx('長方形の半分とはかぎらないよ。はみ出しを1つずつ計算しよう。', 'It isn’t simply half the box. Work out each leftover triangle.', '不一定是长方形的一半，把多出来的三角形一个个算。')), M(11, 'flip', tx('それは引く三角形の合計。長方形からそれを引こう。', 'That’s the total of the leftover triangles. Subtract it from the box.', '那是要减掉的三角形之和，再用长方形减去它。'))],
            hints: [tx('かこむ長方形は 5 × 4 = 20。', 'The surrounding box is 5 × 4 = 20.', '外框是 5 × 4 = 20。'), tx('はみ出しの三角形: 5×1÷2、2×4÷2、3×3÷2。', 'Leftover triangles: 5×1÷2, 2×4÷2, 3×3÷2.', '多余的三角形：5×1÷2、2×4÷2、3×3÷2。')],
            why: tx('20 − (2.5 + 4 + 4.5) = 20 − 11 = 9 cm²。ナナメの図形は「かこんで引く」が定番!', '20 − (2.5 + 4 + 4.5) = 9 cm². "Box and subtract" is the go-to move for slanted shapes!', '20 − (2.5 + 4 + 4.5) = 9 cm²。斜图形的常用招：框起来再减！') }; } },
        { id: 'g2c', sets: [[8, 5, 3], [10, 4, 7]], make: ([w, h, t]) => { const tri = [[t, 0], [0, h], [w, h]];
          return { kind: 'num', unit: SH.cm2, story: tx(`たて${h}cm、よこ${w}cmの長方形。上の辺のどこかに点Pがある。色のついた三角形の面積は?`, `A ${w} cm × ${h} cm rectangle with point P somewhere on the top side. What is the shaded triangle’s area?`, `长${w}cm、宽${h}cm的长方形，上边某处有一点P。涂色三角形的面积是多少？`), ans: GEO.shoelace(tri),
            fig: areaFig(w + 1, h + 1, (P, L) => SVGK.poly([[0, 0], [w, 0], [w, h], [0, h]].map(P)) + SVGK.poly((L.has('slide') ? [[0, 0], [0, h], [w, h]] : tri).map(P), { f: SVGK.fill }) + SVGK.dot(P(L.has('slide') ? [0, 0] : [t, 0]), 'P') + lab(P, [0, h], [w, h], `${w} cm`, [0, 14]) + lab(P, [w, 0], [w, h], `${h} cm`, [22, 0])),
            tools: [{ id: 'slide', t: tx('Pをはしまでずらす', 'slide P to the corner', '把P移到角上') }],
            mis: [M(w * h, 'forgotHalf', tx('三角形は「底辺 × 高さ ÷ 2」。÷2 をわすれずに。', 'Triangle = base × height ÷ 2. Don’t forget ÷2.', '三角形 = 底 × 高 ÷ 2，别忘了÷2。'))],
            hints: [tx('Pがどこにあっても、底辺と高さは同じだね。', 'Wherever P is, the base and height stay the same.', '不管P在哪里，底和高都不变。')],
            why: tx(`Pを動かしても 底辺${w}cm・高さ${h}cm は同じ → ${w} × ${h} ÷ 2 = ${w * h / 2}。長方形のちょうど半分!`, `Moving P keeps base ${w} cm and height ${h} cm → ${w} × ${h} ÷ 2 = ${w * h / 2}, exactly half the rectangle!`, `P怎么移，底${w}cm、高${h}cm都不变 → ${w} × ${h} ÷ 2 = ${w * h / 2}，正好是长方形的一半！`) }; } },
        { id: 'g2d', sets: [[3, 4], [2, 5]], make: ([a, b]) => { const n = a + b, sq = [[a, 0], [n, a], [b, n], [0, b]];
          return { kind: 'num', unit: SH.cm2, story: tx(`1辺${n}cmの正方形の中に、ナナメの正方形がある(頂点は辺を ${a}cm と ${b}cm に分ける)。ナナメの正方形の面積は?`, `Inside a ${n} cm square sits a tilted square whose corners split each side into ${a} cm and ${b} cm. What is the tilted square’s area?`, `边长${n}cm的正方形里有一个斜放的正方形（顶点把每条边分成${a}cm和${b}cm）。斜正方形面积是多少？`), ans: GEO.shoelace(sq),
            fig: areaFig(n + 1, n + 1, (P, L) => SVGK.poly([[0, 0], [n, 0], [n, n], [0, n]].map(P)) + (L.has('four') ? [[[0, 0], [a, 0], [0, b]], [[n, 0], [n, a], [a, 0]], [[n, n], [b, n], [n, a]], [[0, n], [0, b], [b, n]]].map((t) => SVGK.poly(t.map(P), { f: SVGK.fill2, c: SVGK.aux, w: 1.5 })).join('') : '') + SVGK.poly(sq.map(P), { f: SVGK.fill, op: .9 }) + lab(P, [0, 0], [a, 0], `${a}`, [0, -12]) + lab(P, [a, 0], [n, 0], `${b}`, [0, -12])),
            tools: [{ id: 'four', t: tx('まわりの4つの三角形', 'the 4 corner triangles', '四周4个三角形') }],
            mis: [M(n * n, 'areaSub', tx('それは外の大きな正方形。4つの三角形をひこう。', 'That’s the big outer square. Subtract the 4 triangles.', '那是外面的大正方形，要减去4个三角形。')), M(2 * a * b, 'flip', tx('それは4つの三角形の合計。大きな正方形からひこう。', 'That’s the 4 triangles together. Subtract them from the big square.', '那是4个三角形之和，用大正方形去减。'))],
            hints: [tx(`大きな正方形 ${n}×${n} から、${a}×${b}÷2 の三角形4つをひこう。`, `Big square ${n}×${n} minus four triangles of ${a}×${b}÷2.`, `大正方形 ${n}×${n} 减去4个 ${a}×${b}÷2 的三角形。`)],
            why: tx(`${n * n} − ${a}×${b}÷2×4 = ${n * n} − ${2 * a * b} = ${n * n - 2 * a * b}`, `${n * n} − ${a}×${b}÷2×4 = ${n * n} − ${2 * a * b} = ${n * n - 2 * a * b}.`, `${n * n} − ${a}×${b}÷2×4 = ${n * n} − ${2 * a * b} = ${n * n - 2 * a * b}`) }; } },
        { id: 'g2e', sets: [[8, 5, 1], [9, 6, 1]], make: ([w, h, r]) => { let cells = 0; for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (!(x === 3) && !(y === 2)) cells++;
          return { kind: 'num', unit: SH.cm2, story: tx(`たて${h}cm・よこ${w}cmの畑に、はば${r}cmの道がたてと横に1本ずつ通っている。道をのぞいた畑の面積は?`, `A ${w} cm × ${h} cm field has a ${r} cm wide path running across it each way. What is the area of the field without the paths?`, `长${w}cm、宽${h}cm的田里，横竖各有一条宽${r}cm的小路。去掉小路后田的面积是多少？`), ans: cells,
            fig: areaFig(w + 1, h + 1, (P, L) => L.has('move') ? SVGK.poly([[0, 0], [w - r, 0], [w - r, h - r], [0, h - r]].map(P), { f: SVGK.fill }) + SVGK.poly([[w - r, 0], [w, 0], [w, h], [w - r, h]].map(P), { f: '#d9c7a8' }) + SVGK.poly([[0, h - r], [w, h - r], [w, h], [0, h]].map(P), { f: '#d9c7a8' })
              : SVGK.poly([[0, 0], [w, 0], [w, h], [0, h]].map(P), { f: SVGK.fill }) + SVGK.poly([[3, 0], [3 + r, 0], [3 + r, h], [3, h]].map(P), { f: '#d9c7a8' }) + SVGK.poly([[0, 2], [w, 2], [w, 2 + r], [0, 2 + r]].map(P), { f: '#d9c7a8' }) + lab(P, [0, h], [w, h], `${w} cm`, [0, 14]) + lab(P, [w, 0], [w, h], `${h} cm`, [22, 0])),
            tools: [{ id: 'move', t: tx('道をはしにずらす', 'slide the paths to the edge', '把小路移到边上') }],
            mis: [M(w * h - w * r - h * r, 'overlap', tx('道が交わるところ(1×1)を2回ひいているよ。', 'You subtracted the crossing square twice.', '小路交叉的那一块被减了两次。')), M(w * h, 'areaSub', tx('道の分をひこう。', 'Subtract the paths.', '要减去小路。'))],
            hints: [tx('「道をはしにずらす」を押してみよう。のこりは1つの長方形!', 'Press "slide the paths". What remains is one rectangle!', '按“把小路移到边上”，剩下的是一个长方形！')],
            why: tx(`道をはしに集めると、のこりは (${w}−${r}) × (${h}−${r}) = ${(w - r) * (h - r)}。全体から引くなら、交わる部分を足しもどす: ${w * h} − ${w * r} − ${h * r} + 1 = ${cells}`, `Slide the paths to the edges: what’s left is (${w}−${r}) × (${h}−${r}) = ${(w - r) * (h - r)}. Subtracting from the whole, add the crossing back once: ${w * h} − ${w * r} − ${h * r} + 1 = ${cells}.`, `把小路移到边上，剩下 (${w}−${r}) × (${h}−${r}) = ${(w - r) * (h - r)}。用整体减的话要把交叉处加回一次：${w * h} − ${w * r} − ${h * r} + 1 = ${cells}`) }; } },
      ] },
    { id: 'g3', host: 'kaku', place: tx('かくれんぼの森', 'Hide-and-Seek Woods', '捉迷藏森林'), topic: tx('図形を数える', 'Counting figures', '数图形'), unlock: ['kibi'], moves: ['pickLines'],
      say: [tx('この森には、長方形や三角形がたくさんかくれているよ。', 'Lots of rectangles and triangles hide in these woods.', '这片森林里藏着很多长方形和三角形。'), tx('1つずつ探すと数えもれる。「線を選ぶ」と考えると、かけ算で数えられる!', 'Searching one by one misses some. Think "choose the lines" and you can count with multiplication!', '一个个找会漏。想成“选线”，就能用乘法数！')],
      lessons: [{ h: () => `<h3>${LANGTXT('長方形 = たて線2本 × よこ線2本', 'A rectangle = 2 vertical lines × 2 horizontal lines', '长方形 = 2条竖线 × 2条横线')}</h3><p>${LANGTXT('たての線から2本、よこの線から2本選ぶと、長方形が1つ決まる。だから 場合の数の島で習った C × C で数えられるよ。', 'Choose 2 vertical and 2 horizontal lines and you get exactly one rectangle — so it’s C × C from the Counting Island!', '从竖线中选2条、横线中选2条，就确定一个长方形——所以可以用计数岛学的 C × C！')}</p>` }],
      problems: [
        { id: 'g3a', sets: [[3, 2]], make: ([m, n]) => ({ kind: 'custom', story: tx(`${m}×${n}のマス目。たて線2本・よこ線2本をタップして長方形(正方形もふくむ)を作ろう。5つ見つけたら、ぜんぶでいくつかを答えてね。`, `A ${m}×${n} grid. Tap 2 vertical and 2 horizontal lines to make a rectangle (squares count too). Find 5, then tell how many there are in total.`, `${m}×${n}的方格。点2条竖线和2条横线做出长方形（正方形也算）。找到5个后，回答一共有几个。`), ans: COUNTFIG.rects(m, n),
          mount: (box, api) => { const u = 60, ox = 30, oy = 30; let vs = [], hs = []; const st = api.state; if (!st.found) { st.found = new Set(); st.stage = 1; } const found = st.found;
            const draw = () => { let s = '';
              if (vs.length === 2 && hs.length === 2) s += SVGK.poly([[ox + vs[0] * u, oy + hs[0] * u], [ox + vs[1] * u, oy + hs[0] * u], [ox + vs[1] * u, oy + hs[1] * u], [ox + vs[0] * u, oy + hs[1] * u]], { f: SVGK.fill, w: 0 });
              for (let x = 0; x <= m; x++) s += `<g data-v="${x}" style="cursor:pointer"><rect x="${ox + x * u - 12}" y="${oy - 24}" width="24" height="${n * u + 48}" fill="transparent"/>${SVGK.line([ox + x * u, oy], [ox + x * u, oy + n * u], { c: vs.includes(x) ? SVGK.aux : SVGK.ink, w: vs.includes(x) ? 6 : 3 })}${SVGK.text([ox + x * u, oy - 14], String.fromCharCode(65 + x), { s: 13 })}</g>`;
              for (let y = 0; y <= n; y++) s += `<g data-h="${y}" style="cursor:pointer"><rect x="${ox - 24}" y="${oy + y * u - 12}" width="${m * u + 48}" height="24" fill="transparent"/>${SVGK.line([ox, oy + y * u], [ox + m * u, oy + y * u], { c: hs.includes(y) ? SVGK.aux : SVGK.ink, w: hs.includes(y) ? 6 : 3 })}${SVGK.text([ox - 16, oy + y * u], String(y + 1), { s: 13 })}</g>`;
              box.innerHTML = `<div class="panel interact">${SVGK.wrap(m * u + 60, n * u + 60, s)}<div class="disp" style="font-size:1.1rem">${T(SHC.found, { n: found.size })}</div>${st.stage === 1 ? `<button class="btn" id="addr" type="button" ${vs.length === 2 && hs.length === 2 ? '' : 'disabled'}>${T(SHC.add)}</button>` : '<div id="np" style="width:100%"></div>'}</div>`;
              $$('[data-v]', box).forEach((g) => g.addEventListener('click', () => { const x = +g.dataset.v; vs = vs.includes(x) ? vs.filter((v) => v !== x) : [...vs, x].slice(-2).sort((a, b) => a - b); snd('pop'); draw(); }));
              $$('[data-h]', box).forEach((g) => g.addEventListener('click', () => { const y = +g.dataset.h; hs = hs.includes(y) ? hs.filter((v) => v !== y) : [...hs, y].slice(-2).sort((a, b) => a - b); snd('pop'); draw(); }));
              const ad = $('#addr', box); if (ad) ad.onclick = () => { const k = vs.join('') + hs.join(''); if (found.has(k)) { api.say(SHC.dup); return; } found.add(k); snd('ok'); vs = []; hs = []; if (found.size >= 5) { st.stage = 2; api.say(SHC.now); } draw(); };
              if (st.stage === 2) { $('#np', box).innerHTML = `<div class="tdesc">${T(SHC.ask, { v: m + 1, h: n + 1 })}</div><div id="np2"></div>`; numPad($('#np2', box), 'num', (v) => { if (v === COUNTFIG.rects(m, n)) api.ok(); else if (v === m * n) api.bad(T(SHC.small), 'onlySmall'); else api.bad(T(SHC.hint, { v: m + 1, h: n + 1 }), 'countCalc'); }); } };
            draw(); },
          why: tx(`たて線${m + 1}本から2本: ${m + 1}C2 = ${nCr(m + 1, 2)}、よこ線${n + 1}本から2本: ${n + 1}C2 = ${nCr(n + 1, 2)}。${nCr(m + 1, 2)} × ${nCr(n + 1, 2)} = ${COUNTFIG.rects(m, n)}`, `2 of ${m + 1} vertical lines: ${m + 1}C2 = ${nCr(m + 1, 2)}; 2 of ${n + 1} horizontal: ${n + 1}C2 = ${nCr(n + 1, 2)}. ${nCr(m + 1, 2)} × ${nCr(n + 1, 2)} = ${COUNTFIG.rects(m, n)}.`, `${m + 1}条竖线选2条：${m + 1}C2 = ${nCr(m + 1, 2)}；${n + 1}条横线选2条：${n + 1}C2 = ${nCr(n + 1, 2)}。${nCr(m + 1, 2)} × ${nCr(n + 1, 2)} = ${COUNTFIG.rects(m, n)}`) }) },
        { id: 'g3b', sets: [[4, 3], [5, 2]], make: ([m, n]) => ({ kind: 'num', unit: SH.pieces, story: tx(`${m}×${n}のマス目に、長方形(正方形もふくむ)はいくつある?`, `How many rectangles (squares included) are in a ${m}×${n} grid?`, `${m}×${n}的方格里有多少个长方形（含正方形）？`), ans: COUNTFIG.rects(m, n),
          fig: areaFig(m, n, () => ''), mis: [M(m * n, 'onlySmall', tx('それは1マスの長方形だけ。大きい長方形もあるよ。', 'That’s only the 1×1 ones. Bigger rectangles count too.', '那只是1格的长方形，还有大的。'))],
          hints: [tx(`たて線は${m + 1}本、よこ線は${n + 1}本。それぞれ2本選ぶ。`, `There are ${m + 1} vertical and ${n + 1} horizontal lines. Choose 2 of each.`, `竖线${m + 1}条、横线${n + 1}条，各选2条。`)],
          why: tx(`${m + 1}C2 × ${n + 1}C2 = ${nCr(m + 1, 2)} × ${nCr(n + 1, 2)} = ${COUNTFIG.rects(m, n)}`, `${m + 1}C2 × ${n + 1}C2 = ${nCr(m + 1, 2)} × ${nCr(n + 1, 2)} = ${COUNTFIG.rects(m, n)}.`, `${m + 1}C2 × ${n + 1}C2 = ${nCr(m + 1, 2)} × ${nCr(n + 1, 2)} = ${COUNTFIG.rects(m, n)}`) }) },
        { id: 'g3c', sets: [[4], [3]], make: ([n]) => ({ kind: 'num', unit: SH.pieces, story: tx(`${n}×${n}のマス目に、正方形はいくつある? (大きさがちがうものもぜんぶ)`, `How many squares of any size are in a ${n}×${n} grid?`, `${n}×${n}的方格里一共有多少个正方形（大小都算）？`), ans: COUNTFIG.squares(n, n),
          fig: areaFig(n, n, (P, L) => L.has('sizes') ? range(n).map((k) => SVGK.poly([[0, 0], [k + 1, 0], [k + 1, k + 1], [0, k + 1]].map(P), { c: ['#ff8f45', '#8b6fd6', '#2fb0c6', '#e0566f', '#3fae68'][k], w: 4 - k * 0.5 })).join('') : ''),
          tools: [{ id: 'sizes', t: tx('大きさごとに1つずつ', 'one of each size', '每种大小各一个') }],
          mis: [M(n * n, 'onlySmall', tx('1マスの正方形だけじゃないよ。2×2、3×3…もある。', 'Not only 1×1 squares — there are 2×2, 3×3 … too.', '不只1×1的，还有2×2、3×3……')), M(n * n + 1, 'onlySmall', tx('1マスと全体だけじゃないよ。間の大きさもある。', 'Not just the tiny ones and the whole — middle sizes count too.', '不只最小的和整个，中间大小的也要算。'))],
          hints: [tx('大きさごとに数えよう: 1×1 はいくつ? 2×2 は?', 'Count by size: how many 1×1? how many 2×2?', '按大小数：1×1有几个？2×2呢？'), tx(`${n}×${n} + ${n - 1}×${n - 1} + … + 1×1`, `${n}×${n} + ${n - 1}×${n - 1} + … + 1×1`, `${n}×${n} + ${n - 1}×${n - 1} + … + 1×1`)],
          why: tx(`1×1が${n * n}、2×2が${(n - 1) ** 2}…と大きさごとにたす(分かれ道!) → ${range(n).map((k) => (n - k) ** 2).join(' + ')} = ${COUNTFIG.squares(n, n)}`, `By size (a fork!): ${range(n).map((k) => (n - k) ** 2).join(' + ')} = ${COUNTFIG.squares(n, n)}.`, `按大小分类相加（岔路！）：${range(n).map((k) => (n - k) ** 2).join(' + ')} = ${COUNTFIG.squares(n, n)}`) }) },
        { id: 'g3d', sets: [[5, 1], [4, 2]], make: ([k, layers]) => ({ kind: 'num', unit: SH.pieces, story: tx(layers === 1 ? `三角形の頂点から、底辺に線を${k - 2}本ひいた(底辺の点は全部で${k}こ)。三角形はいくつある?` : `頂点から底辺に線を${k - 2}本、さらに底辺と平行な線を1本ひいた。三角形はいくつある?`, layers === 1 ? `From the top corner, ${k - 2} lines go down to the base (${k} points on the base). How many triangles?` : `From the top, ${k - 2} lines go to the base, plus one line parallel to the base. How many triangles?`, layers === 1 ? `从三角形顶点向底边画了${k - 2}条线（底边上共${k}个点）。一共有几个三角形？` : `从顶点向底边画${k - 2}条线，再画一条与底边平行的线。一共有几个三角形？`), ans: COUNTFIG.fanTriangles(k, layers),
          fig: () => { const A = [200, 30], Bs = range(k).map((i) => [40 + i * 320 / (k - 1), 250]); let s = SVGK.poly([A, Bs[0], Bs[k - 1]]) + Bs.slice(1, -1).map((b) => SVGK.line(A, b)).join('');
            if (layers === 2) { const yy = 150, t = (yy - 30) / 220; s += SVGK.line([A[0] + (Bs[0][0] - A[0]) * t, yy], [A[0] + (Bs[k - 1][0] - A[0]) * t, yy]); } return SVGK.wrap(400, 280, s); },
          mis: [M(k - 1, 'onlySmall', tx('小さい三角形だけじゃないよ。となりどうしをくっつけた三角形もある。', 'Not only the thin ones — neighbors joined together make triangles too.', '不只细长的小三角形，相邻拼起来的也是三角形。')), ...(layers === 2 ? [M(nCr(k, 2), 'missLayer', tx('平行な線の上にも、同じ数だけ三角形があるよ。', 'The parallel line makes just as many triangles again.', '平行线上也有同样多的三角形。'))] : [])],
          hints: [tx('三角形は「頂点」+「よこの線の上の2点」で決まる。', 'A triangle = the top corner + 2 points on one horizontal line.', '三角形 = 顶点 + 同一条横线上的2个点。'), tx(`1本のよこ線の上に${k}点 → ${k}C2`, `${k} points on a horizontal line → ${k}C2`, `一条横线上有${k}个点 → ${k}C2`)],
          why: tx(`よこ線1本ごとに ${k}C2 = ${nCr(k, 2)} こ。よこ線は${layers}本 → ${nCr(k, 2)} × ${layers} = ${COUNTFIG.fanTriangles(k, layers)}`, `Each horizontal line gives ${k}C2 = ${nCr(k, 2)}. With ${layers} such line(s): ${COUNTFIG.fanTriangles(k, layers)}.`, `每条横线 ${k}C2 = ${nCr(k, 2)} 个，共${layers}条 → ${COUNTFIG.fanTriangles(k, layers)}`) }) },
      ] },
    { id: 'g4', host: 'kaku', place: tx('サイコロ工場', 'Dice Factory', '骰子工厂'), topic: tx('[展開図|てんかいず]と立体', 'Nets & solids', '展开图与立体'), unlock: ['moko'], moves: ['net'],
      say: [tx('サイコロ工場へようこそ! 紙を切って立方体を作るよ。', 'Welcome to the Dice Factory! We fold paper into cubes.', '欢迎来到骰子工厂！我们用纸折出立方体。'), tx('6まいの正方形をつなげても、組み立てられるのは11種類だけなんだ。', 'There are only 11 ways to join 6 squares that fold into a cube.', '6个正方形连起来，能折成立方体的只有11种。')],
      lessons: [{ h: () => `<h3>${LANGTXT('向かいの面の見つけ方', 'Finding opposite faces', '找相对面')}</h3><p>${LANGTXT('一列にならんだ面は「1つとばし」が向かいどうし。サイコロは向かいの面をたすと7になるよ(1と6、2と5、3と4)。', 'In a straight row, faces one apart are opposite. On a die, opposite faces add up to 7 (1–6, 2–5, 3–4).', '排成一列的面，隔一个的是相对面。骰子相对两面之和是7（1和6、2和5、3和4）。')}</p>` }],
      problems: [
        { id: 'g4a', sets: [[0]], make: () => ({ kind: 'custom', story: tx('マスを6つタップして展開図を作り、「組み立てる」を押そう。ちがう形の展開図を3種類見つけてね。', 'Tap 6 squares to make a net and press "fold". Find 3 different cube nets.', '点6个格子做展开图，按“折起来”。找出3种不同的展开图。'), ans: 3,
          mount: (box, api) => { const R = 4, C = 5; let cells = []; const found = api.state.found || (api.state.found = new Set());
            const draw = (msg) => { const u = 52; let s = '';
              for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { const on = cells.some(([a, b]) => a === r && b === c); s += `<rect data-cell="${r},${c}" x="${10 + c * u}" y="${10 + r * u}" width="${u - 4}" height="${u - 4}" rx="6" fill="${on ? '#ffc94d' : '#f1edf7'}" stroke="${on ? '#e3a82a' : '#d9d3e6'}" stroke-width="2" style="cursor:pointer"/>`; }
              box.innerHTML = `<div class="panel interact">${SVGK.wrap(C * u + 16, R * u + 16, s)}<div class="disp" style="font-size:1.1rem">${T(SHC.nets, { n: found.size })}</div><div class="row" style="justify-content:center"><button class="btn ghost" id="clr" type="button">${T(SHC.clear)}</button><button class="btn" id="fold" type="button" ${cells.length === 6 ? '' : 'disabled'}>${T(SHC.fold)}</button></div>${msg ? `<div class="tdesc">${msg}</div>` : ''}</div>`;
              $$('[data-cell]', box).forEach((e) => e.addEventListener('click', () => { const [r, c] = e.dataset.cell.split(',').map(Number); const i = cells.findIndex(([a, b]) => a === r && b === c); if (i >= 0) cells.splice(i, 1); else if (cells.length < 6) cells.push([r, c]); snd('pop'); draw(); }));
              $('#clr', box).onclick = () => { cells = []; draw(); };
              $('#fold', box).onclick = () => { if (!NETS.fold(cells)) { api.bad(T(SHC.notJoined), 'netWrong'); return; }
                if (!NETS.isCubeNet(cells)) { api.bad(T(SHC.overlap), 'netWrong'); return; }
                const k = NETS.canon(cells); if (found.has(k)) { draw(T(SHC.sameNet)); return; }
                found.add(k); snd('ok'); cells = []; if (found.size >= 3) { draw(T(SHC.netWin)); api.ok(); } else draw(T(SHC.netOk)); }; };
            draw(); },
          why: tx('立方体の展開図は全部で11種類。「1-4-1型」が6種類、「2-3-1型」が3種類、「2-2-2型」と「3-3型」が1種類ずつ。', 'There are exactly 11 cube nets: six "1-4-1", three "2-3-1", one "2-2-2" and one "3-3".', '立方体展开图一共11种：“1-4-1型”6种、“2-3-1型”3种、“2-2-2型”和“3-3型”各1种。') }) },
        { id: 'g4b', sets: [[0], [1]], make: ([v]) => { const nets = [[[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]], [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]]]; const cells = nets[v]; const L = ['A', 'B', 'C', 'D', 'E', 'F']; const opp = NETS.oppositeCell(cells, 0);
          return { kind: 'choice', story: tx('この展開図を組み立てたとき、Aの面と向かい合う面はどれ?', 'When this net is folded, which face is opposite A?', '这个展开图折起来后，和A相对的是哪一面？'), ans: opp,
            fig: () => { const u = 56; return SVGK.wrap(4 * u + 20, 3 * u + 20, cells.map(([r, c], i) => `<rect x="${10 + c * u}" y="${10 + r * u}" width="${u - 4}" height="${u - 4}" rx="6" fill="${i === 0 ? '#ffc94d' : '#f1edf7'}" stroke="#7d5434" stroke-width="2"/>${SVGK.text([10 + c * u + u / 2 - 2, 10 + r * u + u / 2 - 2], L[i], { s: 20 })}`).join('')); },
            options: L.slice(1).map((l, i) => ({ t: l, ok: i + 1 === opp, tag: 'netWrong', fb: i + 1 !== opp && NETS.fold(cells) ? tx(`${l}はAのとなりの面になるよ。`, `${l} ends up next to A.`, `${l}会在A的旁边。`) : null })),
            hints: [tx('頭の中で、Aを下にして組み立ててみよう。一列にならんだ面は1つとばしが向かい合う。', 'Fold it in your head with A at the bottom. In a row, faces one apart are opposite.', '在脑中把A放在底下折起来。一列中隔一个的面相对。')],
            why: tx(`Aと向かい合うのは ${L[opp]}。となり合う面は向かいにはならない。`, `${L[opp]} is opposite A. Faces that touch can never be opposite.`, `和A相对的是 ${L[opp]}。相邻的面不可能相对。`) }; } },
        { id: 'g4c', sets: [[3], [4]], make: ([n]) => { const two = COUNTFIG.paintedCubes(n, 2), one = COUNTFIG.paintedCubes(n, 1);
          return { kind: 'num', unit: SH.pieces, story: tx(`小さな立方体を${n}×${n}×${n}に積んで大きな立方体を作り、外側をぜんぶペンキでぬった。ちょうど2つの面がぬられた小さな立方体はいくつ?`, `Small cubes are stacked into a ${n}×${n}×${n} cube and the outside is painted. How many small cubes have exactly 2 painted faces?`, `用小立方体堆成${n}×${n}×${n}的大立方体，外表面全部涂色。恰好有2个面涂色的小立方体有几个？`), ans: two,
            fig: () => { const u = 34, c = 0.866, ox = n * u * c + 20, oy = n * u + 20; const P = (x, y, z) => [ox + (x - y) * u * c, oy + (x + y) * u * 0.5 - z * u]; let s = '';
              // visible faces only: top (z = n), right front (x = n), left front (y = n)
              for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += SVGK.poly([P(i, j, n), P(i + 1, j, n), P(i + 1, j + 1, n), P(i, j + 1, n)], { f: '#d7e7ff', w: 1.5 });
              for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) s += SVGK.poly([P(n, j, k), P(n, j + 1, k), P(n, j + 1, k + 1), P(n, j, k + 1)], { f: '#7fb0ff', w: 1.5 });
              for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) s += SVGK.poly([P(i, n, k), P(i + 1, n, k), P(i + 1, n, k + 1), P(i, n, k + 1)], { f: '#a9cbff', w: 1.5 });
              return SVGK.wrap(Math.ceil(2 * n * u * c + 40), 2 * n * u + 40, s); },
            mis: [M(one, 'wrongFaces', tx('それは「1面だけぬられた」立方体の数(各面のまん中)。2面は「辺」の上にあるよ。', 'That’s the 1-face cubes (face centers). 2-face cubes sit along the edges.', '那是只涂1面的（各面中间）。涂2面的在棱上。')), M(8, 'wrongFaces', tx('それは3面ぬられた「かど」の立方体。', 'That’s the 3-face corner cubes.', '那是涂3面的角上的小立方体。')), M(12, 'wrongFaces', tx('辺の数は12本。でも1本の辺の上に2面の立方体はいくつある?', 'There are 12 edges — but how many 2-face cubes sit on each edge?', '棱有12条，但每条棱上有几个涂2面的？'))].filter((m) => m.v !== two),
            hints: [tx('2面ぬられるのは、辺の上(かどをのぞく)。', '2 painted faces = on an edge, but not a corner.', '涂2面的在棱上（不含角）。'), tx(`1本の辺の上に ${n} − 2 = ${n - 2} こ。辺は12本。`, `${n} − 2 = ${n - 2} per edge, and there are 12 edges.`, `每条棱上 ${n} − 2 = ${n - 2} 个，棱有12条。`)],
            why: tx(`かど(3面)8こ、辺(2面)は ${n - 2} × 12 = ${two}こ、面のまん中(1面)は ${(n - 2) ** 2} × 6 = ${one}こ、中(0面)は ${(n - 2) ** 3}こ。全部で ${n ** 3}。`, `Corners (3 faces): 8; edges (2 faces): ${n - 2} × 12 = ${two}; face centers (1 face): ${(n - 2) ** 2} × 6 = ${one}; inside (0): ${(n - 2) ** 3}. Total ${n ** 3}.`, `角（3面）8个，棱（2面）${n - 2} × 12 = ${two}个，面中间（1面）${(n - 2) ** 2} × 6 = ${one}个，内部（0面）${(n - 2) ** 3}个，共${n ** 3}个。`) }; } },
      ] },
  ],
});
const SHC = {
  found: tx('見つけた長方形: {n}', 'Rectangles found: {n}', '找到的长方形：{n}'), add: tx('この長方形を登録', 'Add this rectangle', '记下这个长方形'),
  dup: tx('それはもう見つけたよ!', 'You already found that one!', '这个已经找到过了！'), now: tx('よし! では、ぜんぶでいくつ?', 'Great! Now, how many are there in total?', '好！那一共有多少个？'),
  ask: tx('たて線{v}本から2本、よこ線{h}本から2本選ぶと考えよう。長方形はぜんぶでいくつ?', 'Think: choose 2 of {v} vertical lines and 2 of {h} horizontal lines. How many rectangles in all?', '想成从{v}条竖线中选2条、{h}条横线中选2条。一共有多少个长方形？'),
  small: tx('それは1マスの長方形だけの数。大きい長方形もあるよ。', 'That counts only the 1×1 rectangles. Bigger ones count too.', '那只是1格的长方形，还有更大的。'),
  hint: tx('たて{v}C2 × よこ{h}C2 で計算しよう。', 'Work out {v}C2 × {h}C2.', '算 {v}C2 × {h}C2。'),
  nets: tx('見つけた展開図: {n} / 3 (全部で11種類)', 'Nets found: {n} / 3 (11 exist)', '找到的展开图：{n} / 3（共11种）'), clear: tx('やり直す', 'Clear', '重来'), fold: tx('組み立てる', 'Fold', '折起来'),
  notJoined: tx('正方形がぜんぶつながっていないよ(辺どうしでくっつけよう)。', 'The squares aren’t all joined edge to edge.', '正方形没有全部边贴边连起来。'),
  overlap: tx('組み立てると2つの面が重なっちゃう。どこかの面を動かしてみよう。', 'When folded, two squares land on the same face. Move one square.', '折起来会有两个面重叠，移动一个格子试试。'),
  sameNet: tx('その形は、もう見つけた展開図を回したり裏返したりしたものだよ。', 'That’s one you found already, just turned or flipped.', '这个是已找到的展开图转过来或翻过来的。'),
  netOk: tx('立方体になった! つぎの形を探そう。', 'It folds into a cube! Find another shape.', '折成立方体了！再找下一种。'), netWin: tx('3種類見つけた!', 'Three nets found!', '找到3种了！'),
};
