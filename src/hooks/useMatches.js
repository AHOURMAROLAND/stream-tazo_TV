import { useState, useEffect, useCallback } from 'react'
import { fetchMatches } from '../api/koraApi'
import { getToday } from '../utils/time'
import { REFRESH_INTERVAL } from '../utils/constants'

export default function useMatches(date = getToday()) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true)
    setError(null)
    try {
      const data = await fetchMatches(date, { forceRefresh: showSpinner })
      setMatches(data.matches || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    // Always show spinner when date changes
    setLoading(true)
    setMatches([])
    load(true)
    const interval = setInterval(() => load(false), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [date])

  return { matches, loading, error, refetch: () => load(true) }
}
