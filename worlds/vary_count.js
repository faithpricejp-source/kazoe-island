// New numbers for the counting island (c1–c7): same story and logic, fresh parameters.
// R.lv([lo,hi] small, [lo,hi] normal, [lo,hi] big) picks a size by level (0 = shaky chapter, 2 = solid).
// tests/verify.mjs samples every generator at all levels and runs the same brute-force checks as the fixed sets.
(() => {
  const V = VARY, two = (R, f) => { for (let k = 0; k < 30; k++) { const v = f(); if (v) return v; } return null; };
  V.c1a = (R) => two(R, () => { const a = R.lv([2, 4], [3, 7], [5, 12]), b = R.lv([2, 4], [3, 7], [5, 12]); return a + b !== a * b && [a, b]; });
  V.c1b = (R) => two(R, () => { const a = R.lv([2, 4], [3, 7], [5, 12]), b = R.lv([2, 4], [3, 7], [5, 12]); return a + b !== a * b && [a, b]; });
  V.c1c = (R) => [R.lv([2, 3], [2, 5], [3, 7]), R.lv([2, 3], [2, 5], [3, 7]), R.lv([2, 3], [2, 5], [3, 7])];
  V.c1d = (R) => two(R, () => { const a = R.lv([2, 3], [2, 5], [3, 7]), b = R.lv([2, 3], [2, 5], [3, 7]), c = R.lv([2, 3], [2, 4], [3, 6]); return a * c !== a + c && b * c !== b + c && [a, b, c]; }); // a route of 2 × 2 = 2 + 2 hides the mistake
  V.c2a = (R) => [R.lv([3, 4], [4, 7], [6, 10])];
  V.c2b = (R) => { const n = R.lv([4, 5], [5, 7], [6, 10]); return [n, R.int(2, Math.min(3, n - 2))]; };
  const powPair = (R, kR, mR) => two(R, () => { const k = R.lv(...kR), m = R.lv(...mR); return k !== m && k ** m !== m ** k && k ** m <= 3000 && [k, m]; });
  V.c2c = (R) => powPair(R, [[2, 3], [2, 5], [3, 6]], [[2, 3], [2, 4], [3, 4]]);
  V.c2d = (R) => powPair(R, [[2, 3], [2, 5], [3, 6]], [[2, 3], [2, 4], [3, 4]]);
  V.c2e = (R) => { const n = R.lv([2, 2], [2, 3], [3, 4]); return [R.int(n + 1, n + R.lv([2, 2], [3, 3], [4, 4])), n]; };
  V.c2f = () => [2]; // 3 and 4 digits are the fixed sets; 5 digits is too big a number for her
  V.c3a = (R) => [R.lv([3, 4], [3, 6], [5, 8]), R.lv([2, 3], [2, 5], [4, 7])];
  V.c3b = (R) => [R.lv([4, 5], [4, 7], [6, 9])];
  V.c3c = (R) => [R.lv([3, 4], [3, 5], [4, 6]), R.lv([2, 2], [2, 3], [2, 3])];
  V.c3d = (R) => { const n = R.lv([4, 5], [4, 7], [6, 9]); return [n, R.int(2, Math.min(3, n - 1))]; };
  V.c3e = (R) => [R.lv([3, 4], [3, 6], [5, 8]), R.lv([3, 4], [3, 6], [5, 8])];
  V.c4a = (R) => [R.lv([2, 4], [3, 6], [5, 9]), R.lv([2, 4], [3, 6], [5, 9])];
  V.c4b = (R) => [R.lv([2, 4], [3, 6], [4, 8]), R.lv([3, 4], [3, 6], [5, 8])];
  V.c4c = (R) => [R.lv([3, 4], [3, 6], [5, 8])];
  V.c4d = null; // the track hard-codes the even cards 2 and 4, so only 0–4 and 0–5 work; the two fixed sets rotate
  V.c5a = (R) => [R.lv([3, 4], [3, 6], [5, 8]), R.lv([1, 2], [2, 4], [3, 6])];
  V.c5b = (R) => [R.lv([4, 4], [4, 4], [4, 5])];
  V.c5c = () => [2];
  V.c6a = (R) => powPair(R, [[2, 3], [2, 4], [3, 5]], [[2, 3], [2, 4], [3, 5]]);
  V.c6b = (R) => { const n = R.lv([3, 4], [3, 6], [5, 8]); return [R.int(2, Math.min(n - 1, 4)), n]; };
  V.c6c = null; // the track is written for 4 cards and 3 friends
  V.c6d = (R) => [R.lv([3, 5], [4, 7], [6, 10]), R.lv([2, 2], [2, 4], [3, 5])];
  V.c6e = (R) => { const n = R.lv([3, 4], [4, 6], [5, 8]); return [R.int(2, n - 1), n]; };
  V.c6f = (R) => { const n = R.lv([2, 3], [2, 4], [3, 5]); return [R.int(n + 2, n + R.lv([4, 4], [5, 5], [7, 7])), n]; };
  V.c7a = (R) => [R.lv([6, 6], [6, 7], [6, 7])]; // 4 and 5 are the fixed sets; 3 kids makes 2+1 = 2×1 look the same
  V.c7b = (R) => [R.lv([2, 3], [2, 4], [3, 5])];
  V.c7c = (R) => [R.lv([3, 4], [4, 6], [5, 7])];
  V.c7d = (R) => [R.lv([3, 4], [4, 6], [5, 8])];
  V.c7e = (R) => two(R, () => { const a = R.lv([2, 2], [2, 3], [2, 4]), b = R.lv([1, 2], [1, 3], [2, 4]); return [[a, b, 1]]; }); // one single card keeps the same two-station track
})();
