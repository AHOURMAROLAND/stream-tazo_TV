import { useState, useEffect, useRef } from 'react'
import { APIFOOTBALL_KEY } from '../utils/constants'
import { fetchAndStoreMatchDetails } from '../api/footballDataService'

export default function useMatchEvents(apiMatchId, isLive) {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(false)
  const intervalRef           = useRef(null)

  useEffect(() => {
    if (!apiMatchId) return
    
    const load = async () => {
      if (!isLive && events.length > 0) return // Don't reload if already have data for non-live match
      
      setLoading(events.length === 0)
      try {
        const data = await fetchAndStoreMatchDetails(apiMatchId)
        if (data?.events) {
          setEvents(data.events)
        }
      } catch (e) {
        console.error('[useMatchEvents] Error', e)
      } finally {
        setLoading(false)
      }
    }

    load()
    
    if (isLive) {
      intervalRef.current = setInterval(load, 60000)
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [apiMatchId, isLive])

  return { events, loading }
}
