// offline cache for かぞえ島 (version f1129cc101b2)
const CACHE = 'kazoe-f1129cc101b2', SHELL = ["./", "index.html", "play.js", "learn.js", "critters.js", "progress.js", "kobo.js", "kobo2.js", "kobo3d.js", "wellbeing.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "worlds/drill.js", "worlds/earth3d.js", "worlds/frac.js", "worlds/inf.js", "worlds/kotoba.js", "worlds/mapisle.js", "worlds/prob.js", "worlds/science.js", "worlds/shape.js", "worlds/social.js", "worlds/vary_count.js", "worlds/vary_drill.js", "worlds/data/geo_features.js", "worlds/data/jp_prefs.js", "worlds/data/kotoba_bank.js", "worlds/data/science_bank.js", "worlds/data/science_rules.js", "worlds/data/social_bank.js", "worlds/data/social_rules.js", "vendor/three.min.js", "vendor/spectral.js"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('kazoe-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const font = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !font) return;
  // fonts: cache-first; app files: network-first so updates arrive, cache when offline
  e.respondWith(font
    ? caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; }))
    : fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
