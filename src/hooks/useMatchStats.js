import { useState, useEffect } from 'react'
import { fetchMatchStats, fetchPlayerRatings } from '../api/sportsDbApi'

export default function useMatchStats(apiMatchId, isFinished) {
  const [stats,   setStats]   = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiMatchId || !isFinished) return

    const load = async () => {
      setLoading(true)
      try {
        const [s, r] = await Promise.all([
          fetchMatchStats(apiMatchId),
          fetchPlayerRatings(apiMatchId),
        ])
        setStats(s)
        setRatings(r)
      } catch {
        // silently fail — data may not be available
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [apiMatchId, isFinished])

  return { stats, ratings, loading }
}
