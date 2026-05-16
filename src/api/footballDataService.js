import { APIFOOTBALL_KEY, APIFOOTBALL_BASE } from '../utils/constants'
import { storeMatch, getStoredMatch } from '../utils/storage'

/**
 * Service pour récupérer les données détaillées via notre "Mini BD" serverless.
 * Le serveur gère le cache permanent pour les matchs terminés.
 */
export const fetchAndStoreMatchDetails = async (apiMatchId, matchStatus) => {
  if (!apiMatchId) return null

  try {
    // On appelle notre propre API serverless qui gère le stockage/cache sur le serveur
    const res = await fetch(`/api/football-data?matchId=${apiMatchId}&status=${matchStatus}`)
    if (!res.ok) throw new Error('Server error')
    
    const data = await res.json()
    return data
  } catch (e) {
    console.error('[FootballDataService] Error', e)
    // Fallback sur le stockage local si le serveur échoue
    return getStoredMatch(apiMatchId)
  }
}
