const CACHE_NAME = 'offline-crud-cache-v8'; // Incremented version
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/assets/style.css',
  'https://cdn.jsdelivr.net/npm/localforage/dist/localforage.min.js',
  '/manifest.json' // Corrected path
];

// Install → cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate → cleanup old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 🚫 Skip API calls completely
  if (url.pathname.startsWith('/.netlify/functions/')) {
    return;
  }

  // ✅ Cache-first for all other assets
  e.respondWith(
    caches.match(e.request).then(res => {
      return (
        res ||
        fetch(e.request).catch(() => {
          // Fallback for page navigations
          if (e.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
      );
    })
  );
});