// learn.js — the learner model behind every chapter, review, battle and farm plot.
// 1) new numbers, same logic: VARY[id](R) returns a fresh parameter set for a problem; seeded, so a re-render shows the same numbers.
// 2) "just within reach": per-chapter ability θ (Elo / Rasch); a problem's chance of a clean solve is σ(θ − difficulty).
//    Pools pick the problem whose chance is closest to TARGET (≈ 3 out of 4), and after two misses in a row they pick an easier one.
// 3) review cards: a clean solve in a review context on a new day moves the card up (next review in 1, 3, 7 days);
//    after 3 such reviews the problem is retired and no longer comes back. Any miss sends it back to the start and into the farm.
// Pure functions take S explicitly where tests need them; the DOM is not touched here.

const LEARN = (() => {
  const TARGET = 0.75, EASY = 0.88, K = 0.35, GAPS = [1, 3, 7], RETIRE = 3;
  const REVIEW_CTX = /^(rev|farm|bt|chk):/;

  // ---- seeded randomness ----
  function hashStr(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rngOf(seed) { let a = hashStr(seed); return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function tools(rng, level) {
    const int = (a, b) => a + Math.floor(rng() * (b - a + 1));
    return { rng, level, int, pick: (a) => a[Math.floor(rng() * a.length)],
      // a range that grows with level: lv(small, normal, big) each given as [lo, hi]
      lv: (...rs) => { const r = rs[Math.min(level, rs.length - 1)]; return int(r[0], r[1]); },
      shuffle: (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; } };
  }
  const VARY = {};
  // params for a fresh variant: different from every fixed set the child has seen in the chapter; null if the problem has no generator
  function varyParams(d, seed, level = 1) {
    const f = VARY[d.id]; if (!f) return null;
    const seen = new Set(d.sets.map((s) => JSON.stringify(s))), R = tools(rngOf(d.id + '|' + seed), level);
    for (let k = 0; k < 40; k++) { const ps = f(R); if (ps && !seen.has(JSON.stringify(ps)) && feedbackOk(d, ps)) return ps; }
    return null;
  }
  // a variant is only usable if every listed misconception still gives its own wrong value (else the feedback would be wrong)
  function feedbackOk(d, ps) {
    try { const p = d.make(ps), ans = p.ans !== undefined ? p.ans : p.sol ? exprVal(p.sol) : undefined, key = (v) => JSON.stringify(Array.isArray(v) ? [v[0] / v[1]] : v);
      const mv = (p.mis || []).map((m) => key(m.v)); return !mv.includes(key(ans)) && new Set(mv).size === mv.length; } catch (e) { return false; }
  }
  // the problem to show in a review context: generated numbers if possible, otherwise another fixed set
  function variant(chId, idx, seed, level) {
    const pl = typeof level === 'object' && level ? level : { level: level ?? 1, scaffold: false };
    const d = PROBLEMS[chId][idx], ps = varyParams(d, seed, pl.level);
    const p = ps ? getProblem(chId, idx, 0, ps) : getProblem(chId, idx, d.sets.length > 1 ? 1 + (hashStr(seed) % (d.sets.length - 1)) : 0);
    p.level = ps ? pl.level : 1; p.scaffold = !!pl.scaffold && canScaffold(p); return p;
  }
  // scaffold = the first hint is already open when the problem appears (track problems: the route/station count)
  const canScaffold = (p) => !p.kind || p.kind === 'track' || !!(p.hints && p.hints.length);

  // ---- dates as day numbers (today() is 'Y-M-D' without padding) ----
  const dayNum = (s) => { const [y, m, d] = String(s).split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };

  // ---- ability and difficulty ----
  const sig = (x) => 1 / (1 + Math.exp(-x));
  const starN = (p) => stars(p).length;                                   // 1..3, from the problem's structure
  // bigger numbers add a little; an open first hint takes a step off
  const diffOf = (p, level = 1, scaffold = false) => (starN(p) - 2) * 1.0 + (level - 1) * 0.5 - (scaffold ? 1 : 0);
  const theta = (S, chId) => (S.skill && S.skill[chId] && S.skill[chId].t) || 0;
  const chance = (S, p, level, scaffold) => sig(theta(S, p.ch) + (S.calib || 0) - diffOf(p, level, scaffold));
  const goalOf = (S) => (S.streak && S.streak.miss >= 2 ? EASY : TARGET);
  // how to serve a problem so the chance of a clean solve is nearest the goal: size of the numbers, and whether the first hint is open
  const OPTIONS = [{ level: 0, scaffold: true }, { level: 0, scaffold: false }, { level: 1, scaffold: true }, { level: 1, scaffold: false }, { level: 2, scaffold: false }];
  // a problem without a number generator can only be served at its real level (1); planning another size would promise a change that never happens
  // flat = the generator picks a new item but has no easier/harder version (words, map features): level stays 1
  function planFor(S, p, goal = goalOf(S)) {
    let best = null; const canVary = !!VARY[p.id] && !p.flat;
    for (const o of OPTIONS) { if (o.scaffold && !canScaffold(p)) continue; if (!canVary && o.level !== 1) continue; const pr = chance(S, p, o.level, o.scaffold), gap = Math.abs(pr - goal); if (!best || gap < best.gap - 1e-9) best = { ...o, pr, gap }; }
    return best;
  }
  const plan = (S, chId, idx) => planFor(S, getProblem(chId, idx, 0));
  // serve: build each option with the real seed and choose by the chance of the problem that will actually appear
  function serve(S, chId, idx, seed, opt = {}) {
    const goal = goalOf(S), base = getProblem(chId, idx, 0), canVary = !!VARY[base.id] && !base.flat; let best = null;
    for (const o of OPTIONS) { if (!canVary && o.level !== 1) continue; if (opt.noScaffold && o.scaffold) continue; const p = variant(chId, idx, seed, o); if (o.scaffold && !p.scaffold) continue;
      const pr = chance(S, p, p.level, p.scaffold), gap = Math.abs(pr - goal); if (!best || gap < best.gap - 1e-9) best = { p, gap, pr }; }
    best.p.plannedPr = best.pr; return best.p;
  }
  const levelFor = (S, chId) => { const t = theta(S, chId); return t < -0.6 ? 0 : t > 1.2 ? 2 : 1; };

  function init(S) {
    for (const [k, v] of Object.entries({ skill: {}, card: {}, retired: {}, seedBag: [], streak: { miss: 0 }, dayFail: {}, dayHint: {}, log: [], calib: 0 })) if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(v));
  }
  // a word question is a container: same-day failures and hints belong to the word (shared by its meaning/fill/reading questions),
  // and its spacing lives in the word's own record (worlds/kotoba.js), so the container gets no review card of its own
  const keyOf = (p) => (p.word ? 'kw:' + p.word : p.id);
  function card(S, id) { return S.card[id] || (S.card[id] = { ok: 0, miss: 0, last: '', due: 0 }); }

  const bumpSkill = (S, p, ok) => { const sk = S.skill[p.ch] || (S.skill[p.ch] = { t: 0, n: 0 }); const exp = sig(sk.t + (S.calib || 0) - diffOf(p, p.level ?? 1, p.scaffold));
    sk.t = Math.max(-3, Math.min(3, sk.t + K * ((ok ? 1 : 0) - exp))); sk.n++; S.streak.miss = ok ? 0 : S.streak.miss + 1;
    S.calib = Math.max(-2, Math.min(2, (S.calib || 0) + 0.04 * ((ok ? 1 : 0) - exp)));   // what all chapters got wrong together: the difficulty numbers themselves
    return exp; };
  // her answer history, kept on this device only (newest last, at most 3000 events): the evidence the model is tuned against
  const logEvent = (S, e) => { S.log.push({ t: Date.now(), ...e }); if (S.log.length > 3000) S.log.splice(0, S.log.length - 3000); };
  // a finished attempt (solved). The first wrong answer was already counted by miss(), so ability and the miss streak move once per attempt.
  // independent = no wrong answer, no hint asked, no hint pre-opened, and no failed try at this problem earlier today
  function record(S, p, ctx, info, day) {
    init(S); const clean = !info.wrong && !info.hinted, d = dayNum(day);
    const key = keyOf(p), failedToday = S.dayFail[key] === day, hintedToday = S.dayHint[key] === day, independent = clean && !p.scaffold && !failedToday && !hintedToday;
    const pr = chance(S, p, p.level ?? 1, p.scaffold);
    if (!info.wrong && !failedToday) bumpSkill(S, p, clean && !hintedToday);   // a same-day retry after a failure says nothing new about ability
    logEvent(S, { k: 'done', id: p.id, ...(p.word ? { wd: p.word } : {}), ch: p.ch, x: String(ctx || 'ch').split(':')[0], lv: p.level ?? 1, sc: p.scaffold ? 1 : 0, pr: Math.round(pr * 100) / 100, ok: clean ? 1 : 0, ind: independent ? 1 : 0, w: info.wrong || 0, h: info.hinted ? 1 : 0, s: info.secs || 0, again: failedToday ? 1 : 0 });
    if (p.word) return { clean, independent, retired: false };
    const c = card(S, p.id);
    if (clean && !independent) { if (!c.last) { c.last = day; c.due = d + 1; } return { clean, independent, retired: false }; } // helped or a same-day retry: practice, not yet a review
    if (info.wrong) { c.due = d + 1; return { clean, independent, retired: false }; }
    if (!clean) { c.ok = Math.max(0, c.ok - 1); c.due = d + 1; delete S.retired[p.id]; return { clean, independent, retired: false }; } // asked for a hint: one step back, not back to zero
    if (REVIEW_CTX.test(ctx || '') && c.last !== day) {
      c.ok++; c.last = day; c.due = d + GAPS[Math.min(c.ok, GAPS.length - 1)];
      if (c.ok >= RETIRE) { S.retired[p.id] = day; return { clean, independent, retired: true }; }
    } else if (!c.last) { c.last = day; c.due = d + 1; }
    return { clean, independent, retired: false };
  }
  // a hint asked (or the reasoning opened): remembered for the day, so a reload cannot wash it out
  function hinted(S, p, day) { init(S); S.dayHint[keyOf(p)] = day; }
  const independentToday = (S, p, day) => !(S.dayFail && S.dayFail[keyOf(p)] === day) && !(S.dayHint && S.dayHint[keyOf(p)] === day);
  // the first wrong answer of an attempt: counted at once, so leaving or reloading cannot wash it out
  function miss(S, p, day, ctx) { init(S); const key = keyOf(p), again = S.dayFail[key] === day; S.dayFail[key] = day;
    if (!p.word) { const c = card(S, p.id); c.ok = 0; c.miss++; c.due = dayNum(day) + 1; delete S.retired[p.id]; }
    const pr = chance(S, p, p.level ?? 1, p.scaffold); if (!again) bumpSkill(S, p, false); logEvent(S, { k: 'miss', id: p.id, ...(p.word ? { wd: p.word } : {}), ch: p.ch, x: String(ctx || 'ch').split(':')[0], lv: p.level ?? 1, sc: p.scaffold ? 1 : 0, pr: Math.round(pr * 100) / 100, again: again ? 1 : 0 }); }

  // ---- choosing what to practise ----
  // candidates: problems of cleared chapters (or the given chapters), not retired
  function pool(S, chIds) {
    const out = [];
    for (const c of ALLCH) { if (chIds ? !chIds.includes(c.id) : !S.cleared[c.id]) continue;
      PROBLEMS[c.id].forEach((d, i) => { if (!S.retired[d.id] && (!d.avail || d.avail(S))) out.push({ c: c.id, i, id: d.id }); }); }
    return out;
  }
  // weak spots: misconception tags the child has hit, most frequent first
  const weakTags = (S) => Object.entries(S.tags || {}).filter(([t, n]) => n > 0 && t !== 'other').sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const TAGCACHE = {};
  function tagsOf(q) { if (!TAGCACHE[q.id]) { try { TAGCACHE[q.id] = (getProblem(q.c, q.i, 0).mis || []).map((m) => m.tag); } catch (e) { TAGCACHE[q.id] = []; } } return TAGCACHE[q.id]; }
  // score a candidate: reachability first (best plan's chance near the goal), then missed / due cards and weak spots.
  // a missed card that is far out of reach waits (it stays in the farm with hints) instead of being pushed again
  function score(S, q, day, rnd) {
    const p = getProblem(q.c, q.i, 0), pl = planFor(S, p), c = S.card[q.id], d = dayNum(day);
    let s = -pl.gap * 8, bonus = 0;
    if (c) { if (c.miss && c.ok === 0) bonus += 2; if (c.due && c.due <= d) bonus += 1 + Math.min(1.5, (d - c.due) * 0.15); if (c.last === day) s -= 3; }
    else bonus += 0.4;                                                        // never reviewed yet
    const wt = weakTags(S); if (wt.length) bonus += tagsOf(q).filter((t) => wt.includes(t)).length * 0.5;
    s += bonus * (pl.gap < 0.15 ? 1 : 0.3);
    return s + rnd() * 0.6;
  }
  // n picks for today's review: at most 2 from one chapter so it stays varied
  function pickReview(S, day, n = 3) {
    const rnd = rngOf('rev|' + day), cand = pool(S).map((q) => ({ ...q, s: score(S, q, day, rnd) })).sort((a, b) => b.s - a.s), per = {}, out = [];
    for (const q of cand) { if (out.length >= n) break; if ((per[q.c] || 0) >= 2) continue; per[q.c] = (per[q.c] || 0) + 1; out.push({ ...q, plan: plan(S, q.c, q.i) }); }
    return out;
  }
  // one pick for a battle round: same scoring, skipping recent ids
  function pickOne(S, day, recent, seed) {
    const rnd = rngOf('bt|' + seed), list = pool(S).filter((q) => !(recent || []).includes(q.id)), all = list.length ? list : pool(S);
    if (!all.length) return null;
    const q = all.map((x) => ({ ...x, s: score(S, x, day, rnd) })).sort((a, b) => b.s - a.s)[0]; return { ...q, plan: plan(S, q.c, q.i) };
  }
  const dueCount = (S, day) => { const d = dayNum(day); return Object.entries(S.card || {}).filter(([id, c]) => !S.retired[id] && c.due && c.due <= d).length; };

  return { VARY, varyParams, variant, serve, hinted, independentToday, rngOf, tools, hashStr, dayNum, init, record, miss, pickReview, pickOne, chance, plan, planFor, diffOf, levelFor, theta, weakTags, dueCount, REVIEW_CTX, TARGET, RETIRE, GAPS };
})();
const VARY = LEARN.VARY;
