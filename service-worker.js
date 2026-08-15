// Roadbook — service worker
// Stratégie : le HTML se charge en RÉSEAU d'abord (mises à jour automatiques),
// le statique (CDN, icônes) en cache d'abord, les APIs live jamais en cache.
const CACHE = 'roadbook-v3';

const LOCAL_ASSETS = [
  './', './index.html', './manifest.json',
  './icon.svg', './icon-192.png', './icon-512.png', './icon-180.png'
];

const isLive = h =>
  h.includes('open-meteo.com') || h.includes('overpass-api.de') ||
  h.includes('nominatim.openstreetmap.org') ||
  h.includes('router.project-osrm.org') || h.includes('arcgisonline.com') ||
  h.includes('tile.openstreetmap.org') || h.includes('googleapis.com') ||
  h.includes('firebaseio.com') || h.includes('firestore.');

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function put(req, res){ if (res && res.status === 200){ const c = res.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); } }

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (isLive(url.hostname)) return; // réseau uniquement

  // HTML / navigation : RÉSEAU d'abord -> l'app se met à jour toute seule
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(res => { put(req, res); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Statique (Bootstrap/Leaflet/Firebase, icônes) : cache d'abord + maj en fond
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => { put(req, res); return res; }).catch(() => cached);
      return cached || net;
    })
  );
});
