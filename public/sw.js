// TAZO TV Service Worker — PWA offline support
const CACHE_NAME = 'tazo-tv-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  // Clean old caches
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // API calls — network first, no cache
  if (url.hostname === 'kora-api.space' || url.hostname.includes('meshify')) {
    e.respondWith(fetch(request))
    return
  }

  // Navigation — network first, fallback to cached index.html
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
    return
  }

  // Static assets — cache first
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})
