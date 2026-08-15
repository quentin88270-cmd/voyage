// Roadbook — service worker (offline app shell)
const CACHE = 'roadbook-v1';

// On ne met en cache à l'install QUE les fichiers locaux (sinon un CDN
// qui répond mal ferait échouer toute l'installation du SW).
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // APIs live (météo, geocodage) : toujours le réseau, jamais de cache.
  if (url.hostname.includes('open-meteo.com') ||
      url.hostname.includes('arcgisonline.com') ||
      url.hostname.includes('tile.openstreetmap.org')) {
    return;
  }

  // Le reste (shell + CDN Bootstrap/Leaflet) : cache d'abord, réseau ensuite,
  // et on met en cache au passage pour la prochaine fois.
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
