// Roadbook — service worker (offline app shell)
const CACHE = 'roadbook-v2';

// À l'install : uniquement les fichiers locaux (un CDN en erreur ne doit pas
// faire échouer toute l'installation du SW).
const LOCAL_ASSETS = [
  './', './index.html', './manifest.json',
  './icon.svg', './icon-192.png', './icon-512.png', './icon-180.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const h = new URL(e.request.url).hostname;

  // Réseau uniquement : APIs live (météo, geocodage, lieux, Firestore temps réel).
  if (h.includes('open-meteo.com') || h.includes('overpass-api.de') ||
      h.includes('router.project-osrm.org') ||
      h.includes('arcgisonline.com') || h.includes('tile.openstreetmap.org') ||
      h.includes('googleapis.com') || h.includes('firebaseio.com') || h.includes('firestore.')) {
    return;
  }

  // Le reste (shell + CDN Bootstrap/Leaflet/Firebase scripts) : cache d'abord.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
