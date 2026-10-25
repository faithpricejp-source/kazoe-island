// 3D models for the science isle (three.js r128, vendored for offline use).
// One model explains many units: Earth is a ball, tilted 23.4°, spinning west→east once a day and lit by the sun from one side.
// 'sun'  : Earth seen from space next to the sky seen by a child standing in Tokyo — sunrise, noon, sunset and the seasons all follow.
// 'moon' : the moon is a ball lit by the sun; an inset camera on Earth shows the phase that the light really makes, and the moon's
//          angle from the sun gives the time it is highest (12 h + angle ÷ 15°): new moon at noon, first quarter 6 pm, full moon midnight.
let THREE_LOADING = null;
const E3PH = [[1.5, tx('[新月|しんげつ]', 'new moon', '新月')], [5, tx('三日月', 'crescent', '月牙')], [9.5, tx('[上弦|じょうげん]の月', 'first quarter', '上弦月')], [13, tx('十三夜の月', 'waxing gibbous', '盈凸月')], [16.5, tx('[満月|まんげつ]', 'full moon', '满月')], [21, tx('[満月|まんげつ]のあと', 'waning gibbous', '亏凸月')], [24.5, tx('[下弦|かげん]の月', 'last quarter', '下弦月')], [28, tx('明け方の細い月', 'waning crescent', '残月')], [30, tx('[新月|しんげつ]', 'new moon', '新月')]];
// WebGL can be missing even when the script loads: test it, and fall back to the 2D pictures the lessons already have
function webglOK() { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }
function e3fallback(el, mode, why) { el.innerHTML = `<div class="muted">${T(why)}</div>` + (mode === 'moon'
  ? `<div class="row" style="justify-content:center;gap:14px;flex-wrap:wrap">${Object.entries(SCI.MOON).map(([k, m]) => `<div style="text-align:center;width:120px">${moonSVG(k, 60)}<div><b>${T(m.n)}</b></div><div class="muted" style="font-size:.8rem">${T(m.why)}</div></div>`).join('')}</div>`
  : `<div class="chipbar">${SCI.SEASON.map((s, i) => `<button class="chip" data-fs="${i}" type="button">${T(s)}</button>`).join('')}</div><input class="fh" type="range" min="5" max="19" step="0.5" value="12" style="width:min(320px,100%)"><div class="fd"></div>`);
  if (mode !== 'moon') { let s = 1; const d = () => { $('.fd', el).innerHTML = domeSVG(s, +$('.fh', el).value); $$('[data-fs]', el).forEach((b) => b.classList.toggle('on', +b.dataset.fs === s)); };
    $$('[data-fs]', el).forEach((b) => b.onclick = () => { s = +b.dataset.fs; d(); }); $('.fh', el).oninput = d; d(); } }
function loadThree() {
  if (window.THREE) return Promise.resolve();
  return THREE_LOADING || (THREE_LOADING = new Promise((ok, bad) => { const s = document.createElement('script'); s.src = 'vendor/three.min.js'; s.onload = ok; s.onerror = bad; document.head.appendChild(s); }));
}
const E3T = {
  drag: tx('ドラッグで まわして見られるよ', 'Drag to turn the view', '拖动可以转动视角'), play: tx('▶ 地球を回す', '▶ Spin the Earth', '▶ 转动地球'), stop: tx('⏸ 止める', '⏸ Stop', '⏸ 停止'),
  time: tx('時こく', 'Time', '时刻'), day: tx('月の位置(新月から何日)', 'Moon position (days after new moon)', '月亮位置（新月后第几天）'),
  noLoad: tx('3Dのプログラムを読みこめませんでした。かわりに2Dの図で見てみよう。', 'Couldn’t load the 3D program — here is the 2D picture instead.', '3D程序加载失败，改用2D图来看。'), noGL: tx('この端末では3Dを表示できません。2Dの図で見てみよう。', 'This device can’t show 3D — here is the 2D picture instead.', '这台设备无法显示3D，改用2D图来看。'),
  tokyo: tx('東京の小人', 'the little person in Tokyo', '东京的小人'), sunAlt: tx('東京から見た太陽の高さ: {a}°', 'Sun’s height seen from Tokyo: {a}°', '从东京看太阳的高度：{a}°'), night: tx('東京は いま夜(太陽は地平線の下)', 'It’s night in Tokyo (the sun is below the horizon)', '东京现在是夜晚（太阳在地平线下）'),
  moonView: tx('地球から見た月', 'The moon seen from Earth', '从地球看月亮'), transit: tx('南の空でいちばん高くなるのは 約{h}時。のぼるのは約{r}時、しずむのは約{s}時。', 'Highest in the south at about {h}:00; rises about {r}:00, sets about {s}:00.', '约{h}点在南方最高；约{r}点升起，约{s}点落下。'),
  why: tx('月は自分では光らない。太陽に照らされた半分のうち、地球から見える部分が形になる。太陽の方向を0°として、月が東向きに進んだ角度は{d}°。この かんたんなモデルでは、南の空でいちばん高くなる([南中|なんちゅう])時こくを、12時に{h}時間を足して考えるよ(15°で1時間)。', 'The moon gives no light of its own; we see the part of its sunlit half that faces us. Taking the sun’s direction as 0°, the moon has moved {d}° eastward. In this simple model, the time it is highest in the south is noon plus {h} hours (1 hour per 15°).', '月亮自己不发光，我们看到的是被太阳照亮那一半中朝向地球的部分。以太阳方向为0°，月亮向东走了{d}°。在这个简化模型里，它在南方最高（南中）的时刻是12点加{h}小时（每15°一小时）。'),
};
window.EXTRA_TX = [...(window.EXTRA_TX || []), ...Object.values(E3T), ...E3PH.map((x) => x[1])];

function earth3D(el, mode) {
  if (!webglOK()) { e3fallback(el, mode, E3T.noGL); return; }
  el.innerHTML = `<div class="interact"><div class="muted">${T(E3T.drag)}</div><div class="e3wrap" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:flex-start"><canvas class="e3" style="width:min(100%,420px);aspect-ratio:7/5;border-radius:12px;background:#0b1026;touch-action:none"></canvas><div class="e3side" style="min-width:0"></div></div>
    <div class="e3ctl"></div><div class="disp e3info" style="font-size:1rem"></div></div>`;
  const cv = $('.e3', el), side = $('.e3side', el), ctl = $('.e3ctl', el), info = $('.e3info', el);
  loadThree().then(() => (mode === 'moon' ? moonScene : sunScene)(cv, side, ctl, info)).catch(() => e3fallback(el, mode, E3T.noLoad));
}
// shared: renderer, camera that orbits on drag, animation loop that stops when the canvas leaves the page
function e3base(cv) {
  const THREE = window.THREE, W = cv.clientWidth || 420, H = Math.round(W * 5 / 7), r = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(W, H, false);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 200); let th = 0.9, ph = 0.3, dist = 6.2;
  const place = () => { cam.position.set(dist * Math.cos(ph) * Math.sin(th), dist * Math.sin(ph), dist * Math.cos(ph) * Math.cos(th)); cam.lookAt(0, 0, 0); };
  let drag = null; cv.onpointerdown = (e) => { drag = [e.clientX, e.clientY, th, ph]; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = (e) => { if (!drag) return; th = drag[2] - (e.clientX - drag[0]) * 0.01; ph = Math.max(-1.2, Math.min(1.2, drag[3] + (e.clientY - drag[1]) * 0.01)); place(); };
  cv.onpointerup = () => { drag = null; }; place();
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));
  const loop = (fn) => { const tick = () => { if (!cv.isConnected) { r.dispose(); return; } fn(); requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  return { THREE, r, scene, cam, W, H, loop };
}
// an Earth texture: ocean, a few latitude lines, Japan as a small orange patch (enough to find "where am I")
function earthTexture(THREE) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#2f6fd0'; g.fillRect(0, 0, 512, 256);
  const xy = (lat, lon) => [(lon + 180) / 360 * 512, (90 - lat) / 180 * 256];
  g.fillStyle = '#5fbf5a'; for (const [la, lo, w, h] of [[50, 90, 110, 40], [20, 20, 40, 60], [-15, 25, 30, 50], [45, -100, 70, 35], [-15, -60, 30, 55], [-25, 135, 35, 25], [75, -40, 25, 12]]) { const [x, y] = xy(la, lo); g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; for (const la of [-60, -30, 30, 60]) { const y = xy(la, 0)[1]; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  g.strokeStyle = '#ffd84d'; g.lineWidth = 2; const ye = xy(0, 0)[1]; g.beginPath(); g.moveTo(0, ye); g.lineTo(512, ye); g.stroke();
  g.fillStyle = '#ff8a3d'; const [jx, jy] = xy(36, 138); g.beginPath(); g.ellipse(jx, jy, 7, 11, -0.5, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(c); return t;
}
const TILT = 23.4 * Math.PI / 180, TOKYO = { lat: 35.7 * Math.PI / 180, lon: 139.7 * Math.PI / 180 };
function sunScene(cv, side, ctl, info) {
  const { THREE, r, scene, cam, loop } = e3base(cv);
  const sunDirs = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0)];   // equinox / summer / equinox / winter
  const light = new THREE.DirectionalLight(0xffffff, 1.25); scene.add(light);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd84d })); scene.add(sun);
  const tiltG = new THREE.Group(); tiltG.rotation.z = -TILT; scene.add(tiltG);           // north pole leans toward +x (the summer-solstice sun)
  const spin = new THREE.Group(); tiltG.add(spin);
  spin.add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshLambertMaterial({ map: earthTexture(THREE) })));
  const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); tiltG.add(axis);
  const pinPos = (lat, lon) => new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon));
  const p0 = pinPos(TOKYO.lat, TOKYO.lon), pin = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 12), new THREE.MeshBasicMaterial({ color: 0xff3b6b }));
  pin.position.copy(p0.clone().multiplyScalar(1.1)); pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p0.clone().normalize()); spin.add(pin);
  let season = 1, hour = 12, playing = false;
  const set = () => {
    const sd = sunDirs[season]; light.position.copy(sd).multiplyScalar(10); sun.position.copy(sd).multiplyScalar(2.6);
    // sub-solar longitude in the Earth's (tilted) frame, then spin so Tokyo is that far from it: (hour − 12) × 15°
    const local = sd.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), TILT), lamS = Math.atan2(-local.z, local.x);
    spin.rotation.y = lamS + (hour - 12) * 15 * Math.PI / 180 - TOKYO.lon;
    const dec = [0, 23.4, 0, -23.4][season] * Math.PI / 180, ha = (hour - 12) * 15 * Math.PI / 180, alt = Math.asin(Math.sin(TOKYO.lat) * Math.sin(dec) + Math.cos(TOKYO.lat) * Math.cos(dec) * Math.cos(ha)) * 180 / Math.PI;
    side.innerHTML = `<div class="muted" style="text-align:center">${T(E3T.tokyo)}</div>${domeSVG(season, hour)}`;
    info.innerHTML = alt > 0 ? T(E3T.sunAlt, { a: Math.round(alt) }) : T(E3T.night);
    $$('[data-e3s]', ctl).forEach((b) => b.classList.toggle('on', +b.dataset.e3s === season)); $('#e3h', ctl).value = hour; $('#e3ht', ctl).textContent = `${Math.floor(hour)}:${String(Math.round(hour % 1 * 60)).padStart(2, '0')}`; };
  ctl.innerHTML = `<div class="chipbar">${SCI.SEASON.map((s, i) => `<button class="chip" data-e3s="${i}" type="button">${T(s)}</button>`).join('')}</div>
    <label>${T(E3T.time)} <input id="e3h" type="range" min="0" max="24" step="0.25" value="12" style="width:min(260px,70vw)"> <b id="e3ht"></b></label> <button class="btn ghost" id="e3p" type="button">${T(E3T.play)}</button>`;
  $$('[data-e3s]', ctl).forEach((b) => b.onclick = () => { season = +b.dataset.e3s; set(); });
  $('#e3h', ctl).oninput = (e) => { hour = +e.target.value; set(); };
  $('#e3p', ctl).onclick = (e) => { playing = !playing; e.target.textContent = T(playing ? E3T.stop : E3T.play); };
  let last = 0; loop(() => { if (playing) { const now = performance.now(); if (now - last > 120) { last = now; hour = (hour + 0.25) % 24; set(); } } r.render(scene, cam); }); set();
}
function moonScene(cv, side, ctl, info) {
  const { THREE, r, scene, cam, W, H, loop } = e3base(cv);
  const light = new THREE.DirectionalLight(0xffffff, 1.3); light.position.set(10, 0, 0); scene.add(light);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd84d })); sun.position.set(3.4, 0, 0); scene.add(sun);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(0.6, 40, 28), new THREE.MeshLambertMaterial({ map: earthTexture(THREE) })); scene.add(earth);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 24), new THREE.MeshLambertMaterial({ color: 0xeeeeee })); scene.add(moon);
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.48, 2.52, 96), new THREE.MeshBasicMaterial({ color: 0x55607a, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; scene.add(ring);
  const eye = new THREE.PerspectiveCamera(9, 1, 0.1, 50);             // a camera on Earth looking at the moon
  let day = 7.4;
  const set = () => { const th = day / 29.5 * 2 * Math.PI; moon.position.set(2.5 * Math.cos(th), 0, -2.5 * Math.sin(th));   // anticlockwise seen from the north, starting between Earth and sun
    eye.position.set(0, 0, 0); eye.up.set(0, 1, 0); eye.lookAt(moon.position);
    const deg = (day / 29.5) * 360, transit = (12 + Math.round(deg / 15)) % 24, phaseName = E3PH.find(([d]) => day < d)[1];
    info.innerHTML = `<b>${T(phaseName)}</b> · ${T(E3T.transit, { h: transit, r: (transit + 18) % 24, s: (transit + 6) % 24 })}<div class="muted" style="font-size:.85rem">${T(E3T.why, { d: Math.round(deg), h: Math.round(deg / 15) })}</div>`;
    $('#e3dt', ctl).textContent = `${day.toFixed(1)}`; };
  side.innerHTML = `<div class="muted" style="text-align:center">${T(E3T.moonView)}</div><canvas class="e3m" width="160" height="160" style="width:160px;height:160px;border-radius:50%;background:#0b1026"></canvas>`;
  const r2 = new THREE.WebGLRenderer({ canvas: $('.e3m', side), antialias: true }); r2.setSize(160, 160, false);
  ctl.innerHTML = `<label>${T(E3T.day)} <input id="e3d" type="range" min="0" max="29.5" step="0.5" value="7.5" style="width:min(260px,70vw)"> <b id="e3dt"></b></label>`;
  $('#e3d', ctl).oninput = (e) => { day = +e.target.value; set(); };
  loop(() => { r.render(scene, cam); r2.render(scene, eye); }); set();
}
