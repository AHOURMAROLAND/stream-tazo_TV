// TAZO TV Service Worker — PWA offline support
const CACHE_NAME = 'tazo-tv-v2'

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/ptitazologo.jpeg',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
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

  // ── Ne jamais intercepter ──────────────────────────────────────
  // 1. Requêtes non-HTTP (chrome-extension://, chrome-error://, etc.)
  if (!url.protocol.startsWith('http')) return

  // 2. Toutes les APIs externes — laisser passer sans cache
  const externalDomains = [
    'kora-api.space',
    'cdn.kora-api.space',
    'thesportsdb.com',
    'meshify.cloud',
    'sportssonline',
    'score808',
    'reddit-soccer',
    'apifootball',
    'apiv3.apifootball',
  ]
  if (externalDomains.some((d) => url.hostname.includes(d))) return

  // 3. Requêtes cross-origin en général — laisser passer
  if (url.origin !== self.location.origin) return

  // ── Navigation SPA — network first, fallback index.html ───────
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
    return
  }

  // ── Assets statiques — cache first ────────────────────────────
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).catch(() => new Response('', { status: 408 }))
    })
  )
})
