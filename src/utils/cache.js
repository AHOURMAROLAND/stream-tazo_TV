// Cache simple en mémoire avec TTL
const store = new Map()

export function cacheGet(key, { ignoreExpiry = false } = {}) {
  const entry = store.get(key)
  if (!entry) return null
  
  if (!ignoreExpiry && Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

export function cacheSet(key, value, ttlMs = 30000) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export function cacheClear() {
  store.clear()
}

export function cacheSize() {
  return store.size
}

// Auto-purge des entrées expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(key)
  }
}, 5 * 60 * 1000)
