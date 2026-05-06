export const KORA_BASE    = 'https://kora-api.space'
export const MESHIFY_BASE = 'https://us.meshify.cloud'
export const CDN_LOGOS    = 'https://cdn.kora-api.space/uploads/team'
export const CDN_LEAGUES  = 'https://cdn.kora-api.space/uploads/league'

// v2 — direct API calls, no proxy needed

export const MATCH_STATUS = {
  NOT_STARTED: 0,
  LIVE:        1,
  FINISHED:    2,
}

export const REFRESH_INTERVAL = 30000  // 30s

// apifootball.com — clé gratuite à obtenir sur https://apifootball.com/documentation/
// Remplace par ta clé après inscription
export const APIFOOTBALL_KEY = import.meta.env.VITE_APIFOOTBALL_KEY || ''
export const APIFOOTBALL_BASE = 'https://apiv3.apifootball.com'
