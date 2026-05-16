import axios from 'axios'
import { KORA_BASE } from '../utils/constants'
import { getTimestamp, getToday } from '../utils/time'
import { cacheGet, cacheSet, cacheClear } from '../utils/cache'

const api = axios.create({ baseURL: KORA_BASE })

// TTL : 30s pour les matchs live, 5min pour les autres
const LIVE_TTL    = 30  * 1000
const DEFAULT_TTL = 5   * 60 * 1000

export const fetchMatches = async (date = getToday(), { forceRefresh = false } = {}) => {
  const cacheKey = `matches_${date}`

  if (!forceRefresh) {
    const cached = cacheGet(cacheKey)
    if (cached) return cached
  }

  const t = getTimestamp()
  try {
    const res = await api.get(`/api/matches/${date}/1?t=${t}`)
    
    if (res.data?.matches) {
      // Shorter TTL if there are live matches
      const hasLive = res.data.matches.some((m) => parseInt(m.status) === 1)
      cacheSet(cacheKey, res.data, hasLive ? LIVE_TTL : DEFAULT_TTL)
      return res.data
    }
    throw new Error('Invalid data format')
  } catch (err) {
    console.warn('[koraApi] Failed to fetch matches, trying fallback cache', err)
    // Fallback : renvoyer le cache même s'il est expiré (si disponible)
    const expiredCache = cacheGet(cacheKey, { ignoreExpiry: true })
    if (expiredCache) return expiredCache
    throw err
  }
}

export const fetchMatch = async (id, lang = 'en') => {
  const cacheKey = `match_${id}_${lang}`
  const cached   = cacheGet(cacheKey)
  if (cached) return cached

  const t = getTimestamp()
  try {
    const res = await api.get(`/api/matche/${id}/${lang}?t=${t}`)
    
    if (res.data) {
      const isLive = parseInt(res.data.status) === 1
      cacheSet(cacheKey, res.data, isLive ? LIVE_TTL : DEFAULT_TTL)
      return res.data
    }
    throw new Error('Invalid match data')
  } catch (err) {
    console.warn('[koraApi] Failed to fetch match, trying fallback cache', err)
    const expiredCache = cacheGet(cacheKey, { ignoreExpiry: true })
    if (expiredCache) return expiredCache
    throw err
  }
}
