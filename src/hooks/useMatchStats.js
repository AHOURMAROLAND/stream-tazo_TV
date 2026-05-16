import { useState, useEffect } from 'react'
import { fetchMatchStats, fetchPlayerRatings } from '../api/sportsDbApi'
import { fetchAndStoreMatchDetails } from '../api/footballDataService'

export default function useMatchStats(apiMatchId, isFinished) {
  const [stats,   setStats]   = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiMatchId) return

    const load = async () => {
      setLoading(true)
      try {
        // 1. Tenter d'abord API-Football (plus précis pour les stats live/mi-temps)
        const fbData = await fetchAndStoreMatchDetails(apiMatchId)
        if (fbData && fbData.stats && fbData.stats.length > 0) {
          // Transformer le format API-Football vers le format attendu par MatchStats
          const parsedStats = {}
          fbData.stats.forEach(s => {
            const key = s.type.toLowerCase().replace(/\s/g, '_')
            parsedStats[key] = { home: s.home, away: s.away }
          })
          setStats(parsedStats)
        } else if (isFinished) {
          // 2. Fallback sur SportsDB pour les matchs terminés si API-Football n'a rien
          const [s, r] = await Promise.all([
            fetchMatchStats(apiMatchId),
            fetchPlayerRatings(apiMatchId),
          ])
          setStats(s)
          setRatings(r)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [apiMatchId, isFinished])

  return { stats, ratings, loading }
}
