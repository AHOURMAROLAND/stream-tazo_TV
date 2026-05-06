import { useState, useEffect } from 'react'
import { fetchLiveCommentary } from '../api/commentsApi'

export default function useCommentary(apiMatchId, isLive) {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiMatchId) return

    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchLiveCommentary(apiMatchId)
        setEvents(data)
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    load()
    const interval = isLive ? setInterval(load, 60000) : null
    return () => { if (interval) clearInterval(interval) }
  }, [apiMatchId, isLive])

  return { events, loading }
}
