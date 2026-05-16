/**
 * Système de stockage persistant pour les données de matchs terminés.
 * Utilise localStorage pour simuler une base de données locale.
 */

const STORAGE_KEY = 'tazo_match_history'

/**
 * Récupère tous les matchs stockés
 */
export function getStoredMatches() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('[Storage] Error reading storage', e)
    return {}
  }
}

/**
 * Récupère les données d'un match spécifique
 */
export function getStoredMatch(matchId) {
  const matches = getStoredMatches()
  return matches[matchId] || null
}

/**
 * Enregistre ou met à jour les données d'un match
 * @param {string|number} matchId 
 * @param {object} data Données du match (stats, events, etc.)
 * @param {boolean} force Si true, écrase même si déjà présent
 */
export function storeMatch(matchId, data, force = false) {
  if (!matchId || !data) return
  
  const matches = getStoredMatches()
  
  // Si déjà stocké et pas de force, on ne fait rien pour économiser localStorage
  if (matches[matchId] && !force) return
  
  matches[matchId] = {
    ...data,
    storedAt: new Date().toISOString()
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
  } catch (e) {
    // Si localStorage est plein, on vide les plus vieux matchs
    if (e.name === 'QuotaExceededError') {
      const keys = Object.keys(matches)
      if (keys.length > 10) {
        // Supprimer les 5 plus vieux
        const sorted = keys.sort((a, b) => 
          new Date(matches[a].storedAt) - new Date(matches[b].storedAt)
        )
        sorted.slice(0, 5).forEach(k => delete matches[k])
        localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
      }
    }
  }
}

/**
 * Supprime un match du stockage
 */
export function removeStoredMatch(matchId) {
  const matches = getStoredMatches()
  delete matches[matchId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
}
