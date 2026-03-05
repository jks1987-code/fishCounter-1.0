const CACHE = 'fishlog-v4';
const ASSETS = [
  './', './index.html', './manifest.json', './logo.png',
  './walleyeemoj.png', './smallmouthemoj.png', './largemouthemoji,.png',
  './salmonemoj.png', './blackcrappieemoj.png', './bluegillemoj.png',
  './perch.png', './muskieemoji,.png', './pikeemoji,.png', './troutemoji,.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
