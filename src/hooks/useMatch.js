import { useState, useEffect, useCallback } from 'react'
import { fetchMatch } from '../api/koraApi'

export default function useMatch(id) {
  const [match, setMatch]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async (showSpinner = false) => {
    if (!id) return
    if (showSpinner) setLoading(true)
    try {
      const data = await fetchMatch(id)
      setMatch(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setMatch(null)
    load(true)
    const interval = setInterval(() => load(false), 30000)
    return () => clearInterval(interval)
  }, [id])

  return { match, loading, error }
}
