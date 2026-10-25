// 分数の島 — fraction bars, equivalent fractions, common denominators, add/subtract, tape diagrams.
const FRX = {
  g: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; },
  red: ([n, d]) => { const k = FRX.g(n, d); return [n / k, d / k]; },
  add: ([a, b], [c, d]) => FRX.red([a * d + c * b, b * d]),
  sub: ([a, b], [c, d]) => FRX.red([a * d - c * b, b * d]),
  mul: ([a, b], [c, d]) => FRX.red([a * c, b * d]),
  lcm: (a, b) => a / FRX.g(a, b) * b,
  // a tape split into n parts; `on` = how many (from the left) or a Set of indices
  bar: (n, on, o = {}) => { const W = o.w || 360, H = o.h || 46, u = W / n; let s = '';
    for (let i = 0; i < n; i++) { const lit = on instanceof Set ? on.has(i) : i < on; s += `<rect ${o.tap ? `data-part="${i}" style="cursor:pointer"` : ''} x="${(10 + i * u).toFixed(1)}" y="${o.y || 10}" width="${u.toFixed(1)}" height="${H}" fill="${lit ? (o.col || '#ffb347') : '#fffdf7'}" stroke="#7d5434" stroke-width="2"/>`; }
    return s; },
  wrap: (h, inner) => `<svg viewBox="0 0 380 ${h}" width="380" height="${h}" role="img" style="background:#fffef9;border-radius:14px">${inner}</svg>`,
  lbl: (x, y, t, s = 16) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${s}" font-weight="800" fill="#3d3751" font-family="Fredoka, 'M PLUS Rounded 1c', sans-serif">${t}</text>`,
};
const FRT = {
  shadeAsk: tx('ぬれたら「けってい」', 'Tap parts, then press "Done"', '涂好后按“确定”'), done: tx('けってい', 'Done', '确定'),
  shaded: tx('ぬった数: {k} / {n}', 'Shaded: {k} / {n}', '已涂：{k} / {n}'),
};
function shadeTask(n, want, msgWrong) {
  return (box, api) => { const on = new Set();
    const draw = () => { box.innerHTML = `<div class="panel interact">${FRX.wrap(70, FRX.bar(n, on, { tap: true }))}<div class="disp" style="font-size:1.2rem">${T(FRT.shaded, { k: on.size, n })}</div><button class="btn" id="dn" type="button">${T(FRT.done)}</button></div>`;
      $$('[data-part]', box).forEach((r) => r.addEventListener('click', () => { const i = +r.dataset.part; on.has(i) ? on.delete(i) : on.add(i); snd('pop'); draw(); }));
      $('#dn', box).onclick = () => { if (on.size === want) api.ok(); else api.bad(T(msgWrong(on.size)), 'shade'); }; };
    draw(); };
}
registerWorld({
  id: 'frac', x: 8.5, y: 90, host: 'piza', after: null,
  name: tx('分数の島', 'Fraction Isle', '分数岛'), level: tx('小学', 'elementary', '小学'), lockTxt: tx('いつでも行けるよ', 'Always open', '随时可去'),
  intro: tx('ピザやケーキを分ける島。分数は「1つを同じ大きさに分けたうちの、いくつ分か」。テープ図を使えば、たし算も文章題も見える!', 'An island of pizzas and cakes. A fraction means "how many parts out of a whole cut into equal parts". With tape diagrams you can see addition and word problems!', '分披萨和蛋糕的岛。分数就是“把一个东西平均分成几份，取其中几份”。用线段图，加法和应用题都能看清！'),
  species: { piza: { c: '#ffcf7a', ear: 'round', name: tx('ぴざ', 'Piza', '披萨熊'), fact: tx('なんでも同じ大きさに分けるのが得意。', 'Great at cutting anything into equal parts.', '最会把东西分成一样大。') } },
  moves: {
    unitFrac: { ty: '½', col: 'var(--tP)', n: tx('分母は「同じ大きさに何こ分けたか」', 'The bottom = how many equal parts', '分母 = 平均分成几份'), r: tx('分母が大きいほど、1つ分は小さい', 'Bigger bottom number → smaller pieces', '分母越大，每一份越小') },
    common: { ty: '÷×', col: 'var(--tC)', n: tx('通分・約分', 'Common denominators & simplifying', '通分与约分'), r: tx('分子と分母に同じ数(0でない)をかけても、わっても大きさは同じ', 'Multiply or divide top and bottom by the same non-zero number: same size', '分子分母同乘或同除一个不为0的数，大小不变') },
    addFrac: { ty: '+', col: 'var(--tN)', n: tx('分数のたし算', 'Adding fractions', '分数加法'), r: tx('分母をそろえてから、分子だけたす', 'Make the bottoms equal, then add only the tops', '先通分，再只加分子') },
    tape: { ty: '▭', col: 'var(--tW)', n: tx('「のこりの〜」はテープ図', '"Of the rest" → tape diagram', '“剩下的几分之几”用线段图'), r: tx('全体の1/3を使ったあと、のこりの3/4 = 全体の2/3 × 3/4。何の何分の1かに注意', 'After using 1/3 of the whole, 3/4 of the rest = 2/3 × 3/4 of the whole. Watch what it’s a fraction of', '用掉全部的1/3后，剩下的3/4 = 全部的 2/3 × 3/4，注意是谁的几分之几') },
  },
  tags: { rest: tx('食べた分とのこりを取りちがえた', 'Mixed up the part eaten and the part left', '吃掉的和剩下的弄反'), addInstead: tx('分母と分子に同じ数をたした', 'Added the same number to top and bottom', '分子分母加了同一个数'), compare: tx('分数の大小くらべ', 'Comparing fractions', '分数比较大小'), wholeMix: tx('整数を分数になおさずに計算した', 'Didn’t rewrite the whole number as a fraction', '整数没化成分数就算'), shade: tx('分数をぬるまちがい', 'Shading the wrong amount', '涂色错误'), addDen: tx('分母どうしもたした', 'Added the denominators too', '分母也相加了'), unitBig: tx('分母が大きいほど大きいと思った', 'Thought a bigger denominator means bigger', '以为分母越大越大'), notLeast: tx('最小でない公分母', 'Not the least common denominator', '不是最小公分母'), restOf: tx('「のこりの〜」を全体の〜と読んだ', 'Read "of the rest" as "of the whole"', '把“剩下的几分之几”当成全部的'), invert: tx('かける・わるの取りちがえ', 'Multiplied instead of divided', '乘除搞反') },
  chapters: [
    { id: 'f1', host: 'piza', place: tx('ピザ屋', 'Pizza Shop', '披萨店'), topic: tx('分数のいみ', 'What a fraction is', '分数的意义'), unlock: ['piza'], moves: ['unitFrac'],
      say: [tx('いらっしゃい! ぴざです。分数はピザの切り方で考えるとかんたんだよ。', 'Welcome! I’m Piza. Fractions are easy if you think of slicing pizza.', '欢迎！我是披萨熊。用切披萨来想分数就很简单。')],
      lessons: [{ h: () => `<h3>${LANGTXT('いくつに分けて、いくつぬる?', 'How many parts, how many shaded?', '分成几份，涂几份？')}</h3><div class="interact"><div class="chipbar" id="dens">${[2, 3, 4, 5, 6, 8].map((d) => `<button class="chip" data-d="${d}" type="button">${d}</button>`).join('')}</div><div id="lbar"></div><div id="lfr" class="disp" style="font-size:1.4rem"></div></div><p class="muted">${LANGTXT('上の数で分ける数を選んで、テープをタップしてぬろう。', 'Pick how many parts above, then tap the tape to shade.', '上面选分成几份，再点线段涂色。')}</p>`,
        m: (el) => { let n = 4; const on = new Set(); const draw = () => { $('#lbar', el).innerHTML = FRX.wrap(70, FRX.bar(n, on, { tap: true })); $('#lfr', el).innerHTML = fracHTML(on.size, n) + (on.size && FRX.g(on.size, n) > 1 ? ' = ' + fracHTML(...FRX.red([on.size, n])) : '');
          $$('[data-part]', el).forEach((r) => r.addEventListener('click', () => { const i = +r.dataset.part; on.has(i) ? on.delete(i) : on.add(i); draw(); })); $$('[data-d]', el).forEach((b) => b.classList.toggle('on', +b.dataset.d === n)); };
          $$('[data-d]', el).forEach((b) => b.onclick = () => { n = +b.dataset.d; on.clear(); draw(); }); draw(); } }],
      problems: [
        { id: 'f1a', sets: [[4, 3], [5, 2]], make: ([n, k]) => ({ kind: 'custom', story: tx(`テープを同じ長さで${n}つに分けたよ。${k}/${n} だけぬろう。`, `The tape is cut into ${n} parts. Shade ${k}/${n}.`, `线段分成了${n}份，涂出 ${k}/${n}。`), ans: k,
          mount: shadeTask(n, k, (got) => tx(`分子の${k}こだけぬるよ(今は${got}こ)。`, `Shade exactly ${k} parts (now ${got}).`, `只涂${k}份（现在是${got}份）。`)), why: tx(`分母${n}は「${n}つに分けた」、分子${k}は「そのうち${k}こ」。`, `The bottom ${n} = cut into ${n}; the top ${k} = take ${k} of them.`, `分母${n} = 分成${n}份，分子${k} = 取其中${k}份。`) }) },
        { id: 'f1b', sets: [[6, 2, 3], [8, 3, 4]], make: ([n, a, b]) => ({ kind: 'custom', story: tx(`テープは${n}つに分かれている。${a}/${b} と同じ大きさだけぬろう。`, `This tape has ${n} parts. Shade the same amount as ${a}/${b}.`, `线段分成${n}份，涂出和 ${a}/${b} 一样多的部分。`), ans: n * a / b,
          mount: shadeTask(n, n * a / b, (got) => tx(`${a}/${b} は ${n * a / b}/${n} と同じ大きさ。分母を${b}から${n}にすると、分子も同じ数倍になるよ(今は${got}こ)。`, `${a}/${b} equals ${n * a / b}/${n}: scaling the bottom from ${b} to ${n} scales the top the same way (now ${got}).`, `${a}/${b} 和 ${n * a / b}/${n} 一样大：分母从${b}变成${n}，分子也乘同样的倍数（现在是${got}份）。`)),
          why: tx(`${a}/${b} = (${a}×${n / b})/(${b}×${n / b}) = ${n * a / b}/${n}`, `${a}/${b} = ${a}×${n / b} / ${b}×${n / b} = ${n * a / b}/${n}.`, `${a}/${b} = (${a}×${n / b})/(${b}×${n / b}) = ${n * a / b}/${n}`) }) },
        { id: 'f1c', sets: [[8, 3], [6, 1]], make: ([n, k]) => ({ kind: 'frac', story: tx(`同じ大きさに${n}切れに切ったピザのうち${k}切れ食べた。食べたのはピザ全体のどれだけ? 分数で答えよう。`, `A pizza has ${n} slices; you ate ${k}. What fraction of the pizza did you eat?`, `披萨切成${n}块，吃了${k}块。吃掉的是整张披萨的几分之几？`), ans: [k, n],
          fig: () => { let s = ''; for (let i = 0; i < n; i++) { const a1 = (i / n) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2; s += `<path d="M190 90 L${(190 + 70 * Math.cos(a1)).toFixed(1)} ${(90 + 70 * Math.sin(a1)).toFixed(1)} A70 70 0 0 1 ${(190 + 70 * Math.cos(a2)).toFixed(1)} ${(90 + 70 * Math.sin(a2)).toFixed(1)}Z" fill="${i < k ? '#f1edf7' : '#ffcf5a'}" stroke="#c0762f" stroke-width="2"/>`; } return FRX.wrap(180, s); },
          mis: [M([n - k, n], 'rest', tx('それはのこったピザの分。食べた分は?', 'That’s the part left over. What did you eat?', '那是剩下的部分。吃掉的呢？'))],
          hints: [tx('分母は「何切れに分けたか」、分子は「何切れ食べたか」。', 'Bottom: how many slices in all. Top: how many you ate.', '分母 = 一共切几块，分子 = 吃了几块。')], why: tx(`${n}切れのうち${k}切れ → ${k}/${n}`, `${k} of ${n} slices → ${k}/${n}.`, `${n}块中的${k}块 → ${k}/${n}`) }) },
        { id: 'f1d', sets: [[3, 5], [4, 6]], make: ([a, b]) => ({ kind: 'choice', story: tx(`1/${a} と 1/${b}、大きいのはどっち?`, `Which is bigger: 1/${a} or 1/${b}?`, `1/${a} 和 1/${b}，哪个大？`),
          fig: () => FRX.wrap(130, FRX.bar(a, 1, { y: 10 }) + FRX.bar(b, 1, { y: 72, col: '#8fc6ff' })),
          options: [{ t: `1/${a}`, ok: true }, { t: `1/${b}`, ok: false, tag: 'unitBig', fb: tx(`分母が大きいほど、たくさんに分けるから1つ分は小さくなるよ。図を見てみよう。`, `A bigger bottom means more pieces, so each piece is smaller. Look at the picture.`, `分母越大，分得越多，每一份就越小。看看图。`) }, { t: tx('同じ', 'They’re equal', '一样大'), ok: false, tag: 'unitBig' }],
          why: tx(`${a}つに分けた1つ分のほうが、${b}つに分けた1つ分より大きい。`, `One of ${a} parts is bigger than one of ${b} parts.`, `分成${a}份的一份，比分成${b}份的一份大。`) }) },
      ] },
    { id: 'f2', host: 'piza', place: tx('ケーキ屋', 'Cake Shop', '蛋糕店'), topic: tx('[約分|やくぶん]と[通分|つうぶん]', 'Simplify & common denominators', '约分与通分'), unlock: ['sora'], moves: ['common'],
      say: [tx('2/4 と 1/2 は同じ大きさ。分子と分母に同じ数(0でない)をかけても、わっても大きさは変わらないんだ。', '2/4 and 1/2 are the same size: multiplying or dividing top and bottom by the same non-zero number keeps the size.', '2/4 和 1/2 一样大：分子分母同乘或同除一个不为0的数，大小不变。')],
      lessons: [{ h: () => `<h3>${LANGTXT('同じ大きさの分数', 'Equal fractions', '大小相等的分数')}</h3>${FRX.wrap(200, FRX.bar(2, 1, { y: 10 }) + FRX.bar(4, 2, { y: 72 }) + FRX.bar(8, 4, { y: 134 }))}<p>${LANGTXT('1/2 = 2/4 = 4/8。<b>約分</b> = 分子と分母を同じ数でわって小さくする。<b>通分</b> = 分母をそろえる(くらべる・たす前に)。', '1/2 = 2/4 = 4/8. <b>Simplify</b> = divide top and bottom by the same number. <b>Common denominator</b> = make the bottoms equal (before comparing or adding).', '1/2 = 2/4 = 4/8。<b>约分</b> = 分子分母同除一个数；<b>通分</b> = 把分母变成一样（比较或相加之前）。')}</p>` }],
      problems: [
        { id: 'f2a', sets: [[6, 8], [9, 12]], make: ([n, d]) => ({ kind: 'frac', reduce: true, story: tx(`${n}/${d} を約分しよう(いちばん簡単な形に)。`, `Simplify ${n}/${d} as far as possible.`, `把 ${n}/${d} 约分到最简。`), ans: FRX.red([n, d]),
          fig: () => FRX.wrap(130, FRX.bar(d, n, { y: 10 }) + FRX.bar(FRX.red([n, d])[1], FRX.red([n, d])[0], { y: 72, col: '#8fc6ff' })),
          hints: [tx(`${n} と ${d} を両方われる数はなに?`, `Which number divides both ${n} and ${d}?`, `什么数能同时整除 ${n} 和 ${d}？`)], why: tx(`${n} と ${d} を ${FRX.g(n, d)} でわる → ${FRX.red([n, d]).join('/')}`, `Divide ${n} and ${d} by ${FRX.g(n, d)} → ${FRX.red([n, d]).join('/')}.`, `${n} 和 ${d} 同除以 ${FRX.g(n, d)} → ${FRX.red([n, d]).join('/')}`) }) },
        { id: 'f2b', sets: [[2, 3, 12], [3, 4, 20]], make: ([a, b, d]) => ({ kind: 'num', story: tx(`${a}/${b} = □/${d}。□に入る数は?`, `${a}/${b} = □/${d}. What goes in □?`, `${a}/${b} = □/${d}，□里填几？`), ans: a * d / b,
          mis: [M(a + d - b, 'addInstead', tx(`分母に${d - b}をたしたから分子にも${d - b}をたす…はまちがい。分母は${d / b}倍になっているね。`, `Adding ${d - b} to both doesn’t work — the bottom was multiplied by ${d / b}.`, `分母加了${d - b}，分子也加${d - b}——这是错的。分母是乘了${d / b}倍。`))],
          hints: [tx(`${b} を何倍すると ${d} になる?`, `${b} times what makes ${d}?`, `${b} 乘几等于 ${d}？`)], why: tx(`分母が ${b}×${d / b} = ${d} だから、分子も ${a}×${d / b} = ${a * d / b}`, `The bottom is ${b}×${d / b} = ${d}, so the top is ${a}×${d / b} = ${a * d / b}.`, `分母 ${b}×${d / b} = ${d}，分子也 ${a}×${d / b} = ${a * d / b}`) }) },
        { id: 'f2c', sets: [[3, 5, 2, 3], [5, 8, 2, 3]], make: ([a, b, c, d]) => { const L = a * d, R = c * b; return { kind: 'choice', story: tx(`${a}/${b} と ${c}/${d}、大きいのはどっち?`, `Which is bigger: ${a}/${b} or ${c}/${d}?`, `${a}/${b} 和 ${c}/${d}，哪个大？`),
          options: [{ t: `${a}/${b}`, ok: L > R }, { t: `${c}/${d}`, ok: R > L }, { t: tx('同じ', 'Equal', '一样大'), ok: L === R }].map((o) => ({ ...o, tag: 'compare', fb: o.ok ? null : tx(`通分すると ${a * d}/${b * d} と ${c * b}/${b * d}。`, `With a common denominator: ${a * d}/${b * d} vs ${c * b}/${b * d}.`, `通分后是 ${a * d}/${b * d} 和 ${c * b}/${b * d}。`) })),
          hints: [tx(`分母を ${b * d} にそろえてみよう。`, `Make both bottoms ${b * d}.`, `把分母都变成 ${b * d}。`)], why: tx(`${a}/${b} = ${a * d}/${b * d}、${c}/${d} = ${c * b}/${b * d}。分子をくらべればいい。`, `${a}/${b} = ${a * d}/${b * d} and ${c}/${d} = ${c * b}/${b * d}; now just compare the tops.`, `${a}/${b} = ${a * d}/${b * d}，${c}/${d} = ${c * b}/${b * d}，比较分子即可。`) }; } },
        { id: 'f2d', sets: [[4, 6], [6, 9]], make: ([a, b]) => ({ kind: 'num', story: tx(`1/${a} と 1/${b} を通分する。いちばん小さい共通の分母は?`, `To add 1/${a} and 1/${b}, what is the least common denominator?`, `把 1/${a} 和 1/${b} 通分，最小公分母是多少？`), ans: FRX.lcm(a, b),
          mis: [M(a * b, 'notLeast', tx(`${a * b} でもできるけど、もっと小さい分母があるよ。`, `${a * b} works, but there’s a smaller one.`, `${a * b} 也可以，但还有更小的。`))],
          hints: [tx(`${a} の倍数と ${b} の倍数をならべて、はじめて同じになる数を探そう。`, `List multiples of ${a} and of ${b}; find the first one they share.`, `分别列出 ${a} 和 ${b} 的倍数，找第一个相同的。`)], why: tx(`${a} と ${b} の最小公倍数は ${FRX.lcm(a, b)}`, `The least common multiple of ${a} and ${b} is ${FRX.lcm(a, b)}.`, `${a} 和 ${b} 的最小公倍数是 ${FRX.lcm(a, b)}`) }) },
      ] },
    { id: 'f3', host: 'piza', place: tx('ジュース屋', 'Juice Stand', '果汁摊'), topic: tx('分数のたし算・ひき算', 'Adding & subtracting', '分数加减'), unlock: ['chun'], moves: ['addFrac'],
      say: [tx('ジュースを混ぜるよ。分母がちがうときは、まず通分!', 'Let’s mix juice. Different bottoms? Make them the same first!', '来调果汁。分母不同时，先通分！')],
      lessons: [{ h: () => `<h3>${LANGTXT('分母どうしはたさない!', 'Never add the bottoms!', '分母不能相加！')}</h3><p>${LANGTXT('1/3 + 1/4 を 2/7 にすると… 2/7 は 1/3 より小さい! たしたのに小さくなるのはおかしいね。', 'If 1/3 + 1/4 were 2/7… but 2/7 is smaller than 1/3! Adding can’t make it smaller.', '如果 1/3 + 1/4 = 2/7……可 2/7 比 1/3 还小！加了反而变小，不对吧。')}</p>${FRX.wrap(200, FRX.bar(3, 1, { y: 10 }) + FRX.bar(4, 1, { y: 72, col: '#8fc6ff' }) + FRX.bar(7, 2, { y: 134, col: '#e0566f' }))}<p>${LANGTXT('正しくは 4/12 + 3/12 = 7/12。', 'Correct: 4/12 + 3/12 = 7/12.', '正确：4/12 + 3/12 = 7/12。')}</p>` }],
      problems: [
        { id: 'f3a', sets: [[[1, 3], [1, 4]], [[1, 2], [1, 5]]], make: ([x, y]) => ({ kind: 'frac', reduce: true, story: tx(`${x.join('/')} + ${y.join('/')} = ?`, `${x.join('/')} + ${y.join('/')} = ?`, `${x.join('/')} + ${y.join('/')} = ?`), ans: FRX.add(x, y),
          mis: [M([x[0] + y[0], x[1] + y[1]], 'addDen', tx(`分母どうしをたしちゃった? ${x[0] + y[0]}/${x[1] + y[1]} は ${x.join('/')} より小さいよ。まず通分しよう。`, `Added the bottoms? ${x[0] + y[0]}/${x[1] + y[1]} is smaller than ${x.join('/')}. Find a common denominator first.`, `把分母也加了？${x[0] + y[0]}/${x[1] + y[1]} 比 ${x.join('/')} 还小。先通分。`))],
          hints: [tx(`分母を ${FRX.lcm(x[1], y[1])} にそろえよう。`, `Make both bottoms ${FRX.lcm(x[1], y[1])}.`, `把分母都变成 ${FRX.lcm(x[1], y[1])}。`)], why: tx(`通分して分子だけたす → ${FRX.add(x, y).join('/')}`, `Common denominator, then add the tops → ${FRX.add(x, y).join('/')}.`, `通分后只加分子 → ${FRX.add(x, y).join('/')}`) }) },
        { id: 'f3b', sets: [[[3, 4], [1, 6]], [[5, 6], [3, 8]]], make: ([x, y]) => ({ kind: 'frac', reduce: true, story: tx(`${x.join('/')} − ${y.join('/')} = ?`, `${x.join('/')} − ${y.join('/')} = ?`, `${x.join('/')} − ${y.join('/')} = ?`), ans: FRX.sub(x, y),
          hints: [tx(`分母を ${FRX.lcm(x[1], y[1])} にそろえよう。`, `Make both bottoms ${FRX.lcm(x[1], y[1])}.`, `把分母都变成 ${FRX.lcm(x[1], y[1])}。`)], why: tx(`通分して分子だけひく → ${FRX.sub(x, y).join('/')}`, `Common denominator, then subtract the tops → ${FRX.sub(x, y).join('/')}.`, `通分后只减分子 → ${FRX.sub(x, y).join('/')}`) }) },
        { id: 'f3c', sets: [[2, [3, 5]], [3, [4, 7]]], make: ([w, y]) => ({ kind: 'frac', reduce: true, story: tx(`${w} − ${y.join('/')} = ? ([仮分数|かぶんすう]で答えよう)`, `${w} − ${y.join('/')} = ? (answer as an improper fraction)`, `${w} − ${y.join('/')} = ?（用假分数回答）`), ans: FRX.sub([w, 1], y),
          mis: [M([w * y[1] - y[0], 1], 'wholeMix', tx(`${w} を ${w * y[1]}/${y[1]} にしてからひこう。`, `Write ${w} as ${w * y[1]}/${y[1]} first.`, `先把 ${w} 写成 ${w * y[1]}/${y[1]}。`))],
          hints: [tx(`${w} = ${w * y[1]}/${y[1]}`, `${w} = ${w * y[1]}/${y[1]}`, `${w} = ${w * y[1]}/${y[1]}`)], why: tx(`${w * y[1]}/${y[1]} − ${y.join('/')} = ${FRX.sub([w, 1], y).join('/')}`, `${w * y[1]}/${y[1]} − ${y.join('/')} = ${FRX.sub([w, 1], y).join('/')}.`, `${w * y[1]}/${y[1]} − ${y.join('/')} = ${FRX.sub([w, 1], y).join('/')}`) }) },
        { id: 'f3d', sets: [[[1, 2], [1, 3], [1, 6]], [[1, 4], [1, 2], [1, 4]]], make: ([x, y, z]) => ({ kind: 'num', story: tx(`${x.join('/')} + ${y.join('/')} + ${z.join('/')} はいくつ?`, `What is ${x.join('/')} + ${y.join('/')} + ${z.join('/')}?`, `${x.join('/')} + ${y.join('/')} + ${z.join('/')} 等于多少？`), ans: FRX.add(FRX.add(x, y), z)[0] / FRX.add(FRX.add(x, y), z)[1],
          hints: [tx('分母を3つともそろえよう。', 'Give all three the same bottom.', '把三个分母都通分。')], why: tx('通分すると分子の合計が分母と同じ → ちょうど1!', 'With a common bottom, the tops add up to the bottom — exactly 1!', '通分后分子之和正好等于分母——就是1！') }) },
      ] },
    { id: 'f4', host: 'piza', place: tx('本屋', 'Book Shop', '书店'), topic: tx('テープ図の文章題', 'Tape-diagram word problems', '线段图应用题'), unlock: ['tsuno'], moves: ['tape'],
      say: [tx('文章題は「何の何分の1か」がいちばん大事。全体の? のこりの?', 'In word problems, the key is "a fraction of WHAT?" Of the whole? Of the rest?', '应用题最重要的是“谁的几分之几”。全部的？还是剩下的？')],
      lessons: [{ h: () => `<h3>${LANGTXT('「のこりの」に注意', 'Watch out for "of the rest"', '注意“剩下的”')}</h3>${FRX.wrap(140, FRX.bar(3, 1, { y: 10 }) + FRX.lbl(70, 90, LANGTXT('全体の1/3を使う', 'use 1/3 of the whole', '用掉全部的1/3'), 13) + FRX.bar(4, 1, { y: 100, h: 30, w: 240, col: '#8fc6ff' }).replace(/x="(\d+\.?\d*)"/g, (m, x) => `x="${(+x + 120).toFixed(1)}"`))}<p>${LANGTXT('2回目は「のこり(2/3)の1/4」。全体から見ると 2/3 × 1/4 = 1/6。', 'The second time it’s "1/4 of the rest (2/3)", which is 2/3 × 1/4 = 1/6 of the whole.', '第二次是“剩下（2/3）的1/4”，占全部的 2/3 × 1/4 = 1/6。')}</p>` }],
      problems: [
        { id: 'f4a', sets: [[[1, 3], [1, 4]], [[1, 4], [1, 3]]], make: ([x, y]) => { const left = FRX.mul(FRX.sub([1, 1], x), FRX.sub([1, 1], y)); return { kind: 'frac', reduce: true,
          story: tx(`おこづかいの${x.join('/')}で本を買い、のこりの${y.join('/')}でおかしを買った。のこったのは、はじめのおこづかいのどれだけ?`, `You spent ${x.join('/')} of your money on a book, then ${y.join('/')} of the rest on snacks. What fraction of the original money is left?`, `零花钱的${x.join('/')}买了书，剩下的${y.join('/')}买了零食。剩下的是原来零花钱的几分之几？`), ans: left,
          fig: (L) => FRX.wrap(L && L.has('tape') ? 120 : 70, FRX.bar(x[1], x[0], { y: 10 }) + (L && L.has('tape') ? FRX.lbl(190, 80, LANGTXT('のこりをさらに分ける', 'split the rest again', '再分剩下的'), 13) : '')), tools: [{ id: 'tape', t: tx('テープ図', 'tape diagram', '线段图') }],
          mis: [M(FRX.sub(FRX.sub([1, 1], x), y), 'restOf', tx(`${y.join('/')} は「のこりの」${y.join('/')}。全体の${y.join('/')}ではないよ。`, `${y.join('/')} is of the rest, not of the whole.`, `${y.join('/')} 是“剩下的”${y.join('/')}，不是全部的。`))],
          hints: [tx(`本のあと、のこりは ${FRX.sub([1, 1], x).join('/')}。その ${FRX.sub([1, 1], y).join('/')} がのこる。`, `After the book, ${FRX.sub([1, 1], x).join('/')} is left; ${FRX.sub([1, 1], y).join('/')} of that remains.`, `买书后剩 ${FRX.sub([1, 1], x).join('/')}，其中 ${FRX.sub([1, 1], y).join('/')} 留下。`)],
          why: tx(`${FRX.sub([1, 1], x).join('/')} × ${FRX.sub([1, 1], y).join('/')} = ${left.join('/')}`, `${FRX.sub([1, 1], x).join('/')} × ${FRX.sub([1, 1], y).join('/')} = ${left.join('/')}.`, `${FRX.sub([1, 1], x).join('/')} × ${FRX.sub([1, 1], y).join('/')} = ${left.join('/')}`) }; } },
        { id: 'f4b', sets: [[3, 8, 24], [2, 5, 30]], make: ([a, b, v]) => ({ kind: 'num', story: tx(`シールの${a}/${b}が${v}まい。シールはぜんぶで何まい?`, `${a}/${b} of the stickers is ${v}. How many stickers are there in all?`, `贴纸的${a}/${b}是${v}张。贴纸一共有多少张？`), ans: v / a * b,
          fig: () => FRX.wrap(80, FRX.bar(b, a) + FRX.lbl(10 + 360 * a / b / 2, 74, `${v}`, 14)),
          mis: [M(v * a / b, 'invert', tx(`${v} の ${a}/${b} を計算しちゃった? 逆だよ。${v}まいが「${a}こ分」。`, `You took ${a}/${b} of ${v}? It’s the other way: ${v} is ${a} parts.`, `算成 ${v} 的 ${a}/${b} 了？反过来：${v}张是“${a}份”。`))],
          hints: [tx(`1こ分(1/${b})は ${v} ÷ ${a} = ${v / a}まい。`, `One part (1/${b}) is ${v} ÷ ${a} = ${v / a}.`, `一份（1/${b}）是 ${v} ÷ ${a} = ${v / a} 张。`)], why: tx(`1/${b} が ${v / a}まい → 全体は ${v / a} × ${b} = ${v / a * b}まい`, `1/${b} is ${v / a}, so the whole is ${v / a} × ${b} = ${v / a * b}.`, `1/${b} 是 ${v / a} 张 → 全部 ${v / a} × ${b} = ${v / a * b} 张`) }) },
        { id: 'f4c', sets: [[[1, 3], [1, 2], 40], [[1, 4], [2, 3], 30]], make: ([x, y, v]) => { const left = FRX.mul(FRX.sub([1, 1], x), FRX.sub([1, 1], y)), total = v * left[1] / left[0], wrong = FRX.sub(FRX.sub([1, 1], x), y);
          return { kind: 'num', story: tx(`本を、1日目に全体の${x.join('/')}、2日目にのこりの${y.join('/')}読んだら、${v}ページのこった。本は全部で何ページ?`, `Day 1 you read ${x.join('/')} of a book, day 2 ${y.join('/')} of the rest, and ${v} pages remain. How many pages in all?`, `第一天读了全书的${x.join('/')}，第二天读了剩下的${y.join('/')}，还剩${v}页。全书多少页？`), ans: total,
            mis: [M(v * wrong[1] / wrong[0], 'restOf', tx(`2日目は「のこりの」${y.join('/')}。全体から両方ひくのはまちがい。`, `Day 2 is ${y.join('/')} of the rest — you can’t subtract both from the whole.`, `第二天是“剩下的”${y.join('/')}，不能都从全部里减。`))],
            hints: [tx(`のこりは全体の ${FRX.sub([1, 1], x).join('/')} × ${FRX.sub([1, 1], y).join('/')} = ${left.join('/')}。`, `What remains is ${FRX.sub([1, 1], x).join('/')} × ${FRX.sub([1, 1], y).join('/')} = ${left.join('/')} of the book.`, `剩下的是全书的 ${FRX.sub([1, 1], x).join('/')} × ${FRX.sub([1, 1], y).join('/')} = ${left.join('/')}。`)],
            why: tx(`全体の${left.join('/')}が${v}ページ → 全体は ${v} ÷ ${left.join('/')} = ${total}ページ`, `${left.join('/')} of the book is ${v} pages, so the book has ${v} ÷ ${left.join('/')} = ${total} pages.`, `全书的${left.join('/')}是${v}页 → 全书 ${v} ÷ ${left.join('/')} = ${total} 页`) }; } },
      ] },
  ],
});
