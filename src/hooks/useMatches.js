import { useState, useEffect } from 'react'
import { fetchMatches } from '../api/koraApi'
import { getToday } from '../utils/time'
import { REFRESH_INTERVAL } from '../utils/constants'

export default function useMatches(date = getToday()) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = async () => {
    try {
      const data = await fetchMatches(date)
      setMatches(data.matches || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [date])

  return { matches, loading, error, refetch: load }
}
