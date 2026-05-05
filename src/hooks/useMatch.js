import { useState, useEffect } from 'react'
import { fetchMatch } from '../api/koraApi'

export default function useMatch(id) {
  const [match, setMatch]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await fetchMatch(id)
        setMatch(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [id])

  return { match, loading, error }
}
