// wellbeing.js — eyes and habit: counts active minutes per day (only while the page is visible and she has touched it in the last 2 minutes),
// asks for a 20-second look into the distance after every 20 active minutes (20-20-20 rule), and gives the parent page a 14-day usage chart,
// the run of consecutive days, and a simple outdoor-time log (outdoor time is what protects against myopia; screens type is secondary).
const WB = {
  look: tx('20分がんばったね! 20びょう、まどの外の 遠くを見よう 👀', '20 minutes of hard work! Look far out of the window for 20 seconds 👀', '努力了20分钟！看看窗外远处20秒吧 👀'),
  done: tx('目が休まったね。つづけよう!', 'Eyes rested — let’s go on!', '眼睛休息好了，继续吧！'), skip: tx('あとで', 'Later', '等一下'),
  title: tx('毎日のようす', 'Daily use', '每日使用'), streak: tx('{k}日つづけて使っています', 'Used {k} days in a row', '已连续使用{k}天'), week: tx('この7日間: {m}分', 'Last 7 days: {m} min', '最近7天：{m}分钟'),
  eye: tx('20分ごとに「遠くを見よう」を出す', 'Remind to look into the distance every 20 minutes', '每20分钟提醒看远处'),
  out: tx('今日、外で40分以上 あそんだ・歩いた', 'Spent 40+ minutes outdoors today', '今天在户外玩/走了40分钟以上'), outWeek: tx('この7日間で外あそび {k}日', 'Outdoor days in the last 7: {k}', '最近7天户外天数：{k}'),
  note: tx('近視の予防にいちばん確かなのは外ですごす時間です(6歳の子どもに学校での屋外活動を毎日40分追加した研究では、3年間で新たに近視になった割合が、ふつうの活動の群39.5%に対し、追加した群30.4%でした)。画面の種類より、時間と休けいを見てください。', 'The best-supported protection against short-sightedness is time outdoors (in one trial with 6-year-olds, 40 extra minutes of outdoor activity at school each day: 30.4% developed myopia over 3 years, against 39.5% in the usual-activity group). Watch total time and breaks more than the type of screen.', '预防近视证据最充分的是户外时间（一项针对6岁儿童的试验：在校每天额外增加40分钟户外活动的组，3年内新发近视30.4%，常规活动组为39.5%）。比起屏幕类型，更应关注总时长和休息。'),
};
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(WB)];
(function () {
  const init = () => { for (const [k, v] of Object.entries({ usage: {}, outdoor: {}, eyeBreak: true })) if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(v)); };
  init(); { const r0 = HOOK.reset; HOOK.reset = () => { if (r0) r0(); init(); }; }
  let lastInput = Date.now(), sinceBreak = 0;
  for (const ev of ['pointerdown', 'keydown', 'wheel']) window.addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true });
  setInterval(() => {
    if (document.hidden || Date.now() - lastInput > 120000) return;   // only count time she is actually using it
    const d = today(); S.usage[d] = (S.usage[d] || 0) + 30; sinceBreak += 30; save();
    if (S.eyeBreak && sinceBreak >= 20 * 60 && !document.querySelector('.veil')) { sinceBreak = 0; eyeBreak(); }
  }, 30000);
  function eyeBreak() {
    let left = 20; const body = () => `${critter(S.buddy, 90, { stage: typeof buddyStage === 'function' ? buddyStage() : 1, happy: true })}<p style="font-weight:800">${T(WB.look)}</p><div class="disp" style="font-size:2rem" id="wbc">${left}</div>`;
    modal(body(), [{ t: T(WB.skip), cls: 'ghost' }]);
    const tick = setInterval(() => { const el = document.getElementById('wbc'); if (!el) { clearInterval(tick); return; } left--; el.textContent = left;
      if (left <= 0) { clearInterval(tick); el.textContent = '✨'; const p = el.previousElementSibling; if (p) p.textContent = T(WB.done); } }, 1000);
  }
})();
const dayKey = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
window.PARENT_PANELS = [...(window.PARENT_PANELS || []), (H) => {
  const days = Array.from({ length: 14 }, (_, i) => dayKey(13 - i)), mins = days.map((d) => Math.round((S.usage[d] || 0) / 60)), max = Math.max(20, ...mins);
  let streak = 0; for (let i = 0; ; i++) { if ((S.usage[dayKey(i)] || 0) >= 60) streak++; else if (i > 0 || (S.usage[dayKey(0)] || 0) > 0) break; else continue; if (i > 400) break; }
  const week = Math.round(days.slice(7).reduce((a, d) => a + (S.usage[d] || 0), 0) / 60), outWeek = days.slice(7).filter((d) => S.outdoor[d]).length;
  const bars = mins.map((m, i) => `<div title="${days[i]}: ${m}" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:90px"><div style="width:70%;height:${Math.round(m / max * 80)}px;background:${S.outdoor[days[i]] ? '#7cc95b' : '#8fc6ff'};border-radius:4px 4px 0 0"></div><span style="font-size:.6rem">${days[i].split('-')[2]}</span></div>`).join('');
  setTimeout(() => { const c = document.getElementById('wbout'), e = document.getElementById('wbeye'); if (c) c.onchange = () => { S.outdoor[today()] = c.checked ? 1 : 0; save(); rerender(); }; if (e) e.onchange = () => { S.eyeBreak = e.checked; save(); }; }, 0);
  return `<div class="panel"><h3>👀 ${T(WB.title)}</h3><p><b>${T(WB.streak, { k: streak })}</b> · ${T(WB.week, { m: week })} · ${T(WB.outWeek, { k: outWeek })}</p>
    <div style="display:flex;gap:2px;align-items:flex-end">${bars}</div>
    <label style="display:block;margin-top:8px"><input type="checkbox" id="wbout" ${S.outdoor[today()] ? 'checked' : ''}> ${T(WB.out)}</label>
    <label style="display:block"><input type="checkbox" id="wbeye" ${S.eyeBreak ? 'checked' : ''}> ${T(WB.eye)}</label><p class="muted" style="font-size:.85rem">${T(WB.note)}</p></div>`;
}];

// parent page: her answer record — what the difficulty model is tuned on, and how well its predictions match her real results
const WBL = {
  title: tx('答えの記録', 'Answer record', '作答记录'), none: tx('まだ記録がありません。', 'No answers recorded yet.', '还没有记录。'),
  cal: tx('最近{n}問: モデルの予測 {p}% / 実際に1回目で正解 {a}%(全体の補正 {c})', 'Last {n}: model predicted {p}% / actually right first try {a}% (overall correction {c})', '最近{n}题：模型预测 {p}% / 实际一次做对 {a}%（整体校正 {c}）'),
  calNote: tx('予測と実際がずれていたら、答えの記録からモデルが自動で補正します。数日分たまると合ってきます。', 'When prediction and reality differ, the model corrects itself from these answers; after a few days they should agree.', '预测和实际有偏差时，模型会根据作答记录自动校正，积累几天后会趋于一致。'),
  recent: tx('最近の答え', 'Recent answers', '最近的作答'), first: tx('1回目で正解', 'right first try', '一次做对'), helped: tx('ヒント・まちがいのあと正解', 'right after a hint or a miss', '看提示或答错后做对'), miss: tx('まちがえた', 'missed', '答错'),
  exp: tx('記録を書き出す(JSON)', 'Export the record (JSON)', '导出记录（JSON）'), secs: tx('{s}秒', '{s}s', '{s}秒'),
};
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(WBL)];
window.PARENT_PANELS = [...(window.PARENT_PANELS || []), (H) => {
  const log = (S.log || []); if (!log.length) return `<div class="panel"><h3>📝 ${T(WBL.title)}</h3><p class="muted">${T(WBL.none)}</p></div>`;
  const done = log.filter((e) => e.k === 'done' && !e.again).slice(-60), n = done.length;
  const p = n ? Math.round(done.reduce((a, e) => a + e.pr, 0) / n * 100) : 0, a = n ? Math.round(done.filter((e) => e.ind).length / n * 100) : 0;
  const place = (ch) => { const c = ALLCH.find((x) => x.id === ch); return c ? T(c.place) : ch; };
  const rows = log.slice(-12).reverse().map((e) => { const d = new Date(e.t), when = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    const res = e.k === 'miss' ? `✗ ${T(WBL.miss)}` : e.ind ? `✓ ${T(WBL.first)}` : `△ ${T(WBL.helped)}`;
    return `<tr><td>${when}</td><td>${place(e.ch)} · ${e.id}</td><td>${res}</td><td class="num">${e.s ? T(WBL.secs, { s: e.s }) : ''}</td></tr>`; }).join('');
  setTimeout(() => { const b = document.getElementById('wblexp'); if (b) b.onclick = () => { const blob = new Blob([JSON.stringify(S.log)], { type: 'application/json' }), u = URL.createObjectURL(blob), x = document.createElement('a'); x.href = u; x.download = 'kazoe-answers.json'; x.click(); setTimeout(() => URL.revokeObjectURL(u), 2000); }; }, 0);
  return `<div class="panel"><h3>📝 ${T(WBL.title)}</h3>${n ? `<p><b>${T(WBL.cal, { n, p, a, c: (S.calib || 0).toFixed(2) })}</b></p><p class="muted" style="font-size:.85rem">${T(WBL.calNote)}</p>` : ''}
    <h3 style="font-size:1rem">${T(WBL.recent)}</h3><div class="tw"><table class="ptable">${rows}</table></div><button class="btn ghost" id="wblexp" type="button">⬇️ ${T(WBL.exp)}</button></div>`;
}];
