// New numbers for the training isle (d1–d4): same method and trap, fresh parameters.
// null = the problem is a fixed puzzle (no numbers to change); review rotates it unchanged.
// tests/verify_worlds.mjs checks every generated set against the independent brute-force judges.
(() => {
  const V = VARY, until = (f) => { for (let k = 0; k < 40; k++) { const v = f(); if (v) return v; } return null; };
  const pay = (den, tot, mins, maxs, cap) => DR.pay(den, tot, mins, maxs, cap).length;
  // dice
  V.d1a = (R) => [['sumEq', R.lv([4, 7], [3, 11], [3, 11])]];
  V.d1b = (R) => [['sumGe', R.lv([9, 11], [5, 11], [4, 10])]];
  V.d1c = (R) => [['prodEq', R.pick(R.level ? [8, 10, 12, 18, 20, 24] : [8, 10])]]; // no square products: (2,2) would add a same-number branch the hint doesn't cover
  V.d1d = (R) => [['prodMult', R.pick([2, 5])]]; // primes only: the complement hint (neither die a multiple) is true only for primes
  V.d1e = null;
  V.d1f = (R) => [['eq', R.lv([6, 8], [6, 14], [7, 15])]];
  V.d1g = (R) => [['ge', R.lv([15, 17], [13, 17], [12, 16])]];
  V.d1h = (R) => until(() => { const k = R.int(2, R.level ? 3 : 2), r = R.int(R.level ? 8 : 7, R.level ? 16 : 11), pq = R.int(0, 1) ? [1, k, r] : [k, 1, r];
    const n = DR.D.reduce((a, b) => a + DR.D.filter((x) => pq[0] * x + pq[1] * b < r).length, 0); return n >= 3 && n <= 25 && [pq]; });
  // coins
  V.d2a = (R) => [[[10, R.lv([1, 2], [1, 4], [2, 4])], [100, R.lv([1, 2], [1, 3], [2, 3])], [500, R.lv([1, 1], [1, 2], [1, 3])]]];
  V.d2b = (R) => [[[50, R.lv([3, 3], [2, 4], [3, 4])], [100, R.lv([1, 1], [1, 2], [1, 2])], [500, 2]]]; // the hint names 0, 1 or 2 × 500
  V.d2c = (R) => [[[10, 50, 100], R.pick(R.level ? [200, 250, 350, 400] : [150, 200])]];
  V.d2d = (R) => [[[50, 100, 200], R.pick(R.level ? [500, 600, 700, 900, 1000] : [450, 500, 600])]];
  V.d2e = (R) => until(() => { const tot = 160 + 10 * R.int(5, 24), all = pay([10, 50, 100], tot, [1, 1, 1], [99, 99, 99]), cap = R.int(4, 12), w = pay([10, 50, 100], tot, [1, 1, 1], [99, 99, 99], cap);
    return w >= 1 && w < all && all <= 20 && [[[10, 50, 100], tot, cap]]; });
  const purse = (R, need) => until(() => { const maxs = [R.int(3, 9), R.int(2, 5), R.int(2, 6)], tot = R.int(15, 60), n = pay([1, 5, 10], tot, [0, 0, 0], maxs), free = pay([1, 5, 10], tot, [0, 0, 0], [99, 99, 99]);
    return n >= 2 && n <= 8 && (!need || free > n) && [[[1, 5, 10], maxs, tot]]; });
  V.d2f = (R) => purse(R, true);
  V.d2g = (R) => purse(R, false);
  V.d2h = (R) => [[[5, 10, 20], R.pick(R.level ? [40, 60, 70] : [30, 40]), 0]];
  V.d2i = (R) => [[[5, 10, 20], R.pick(R.level ? [60, 70, 80, 90] : [40, 45, 55]), 1]];
  // league / knockout
  V.d3a = (R) => [R.lv([4, 6], [4, 10], [6, 12])];
  V.d3b = (R) => [R.lv([4, 8], [5, 16], [8, 32])];
  V.d3c = (R) => { const g = R.lv([3, 4], [3, 6], [4, 6]), G = R.lv([2, 4], [2, 6], [4, 8]); return [g * G, g]; };
  V.d3d = (R) => { const g = R.lv([3, 4], [3, 5], [4, 6]), G = R.pick(R.level ? [2, 4, 8] : [2, 4]); return [g * G, g, 1]; };   // a power of 2 so every round is full
  V.d3e = (R) => { const g = R.lv([3, 4], [3, 5], [4, 6]), G = R.pick([2, 4]); return [g * G, g, 2]; };
  V.d3f = null; V.d3g = null;
  // elections (k ≤ 2 so the tie example A·B·C in the feedback is a real tie)
  const N = (R) => R.lv([30, 60], [40, 150], [80, 300]);
  V.d4a = (R) => { const k = R.int(1, 2); return [N(R), k, R.int(k + 2, k + 4)]; };
  V.d4b = (R) => [N(R), 2, 3];
  V.d4c = (R) => [N(R), 2, R.int(4, 6)];
  V.d4e = (R) => [N(R), 1, R.int(3, 5)];
  // C already has c votes: d4d is the branch where beating B decides, d4f the branch where beating C decides
  V.d4d = (R) => until(() => { const n = N(R), c = R.int(Math.ceil(n / 4), Math.floor(n / 2)); return Math.floor((n - c) / 2) + 1 < c + 1 && [n, c]; });
  V.d4f = (R) => until(() => { const n = N(R), c = R.int(Math.ceil(n / 8), Math.floor(n / 3)); return c + 1 < Math.floor((n - c) / 2) + 1 && [n, c]; });
})();
