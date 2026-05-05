import { useState, useEffect, useRef } from 'react'
import { APIFOOTBALL_KEY, APIFOOTBALL_BASE } from '../utils/constants'

// Simulated events for when no API key is configured
const DEMO_EVENTS = [
  { time: '12\'', type: 'goal',    team: 'home', player: 'En attente de clé API...' },
]

export default function useMatchEvents(apiMatchId, isLive) {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(false)
  const intervalRef           = useRef(null)

  useEffect(() => {
    if (!apiMatchId || !isLive) return
    if (!APIFOOTBALL_KEY) {
      // No key — show placeholder
      setEvents(DEMO_EVENTS)
      return
    }

    const fetchEvents = async () => {
      setLoading(true)
      try {
        const url = `${APIFOOTBALL_BASE}/?action=get_events&match_id=${apiMatchId}&APIkey=${APIFOOTBALL_KEY}`
        const res  = await fetch(url)
        const data = await res.json()

        if (!Array.isArray(data)) { setEvents([]); return }

        // Parse events from the match
        const match = data[0]
        if (!match) return

        const parsed = []

        // Goals
        ;(match.goalscorer || []).forEach((g) => {
          parsed.push({ time: g.time, type: 'goal', team: 'home', player: g.home_scorer || g.away_scorer, assist: g.home_assist || g.away_assist, side: g.home_scorer ? 'home' : 'away' })
        })

        // Cards
        ;(match.cards || []).forEach((c) => {
          parsed.push({ time: c.time, type: c.fault === 'Yellow Card' ? 'yellow' : 'red', player: c.home_fault || c.away_fault, side: c.home_fault ? 'home' : 'away' })
        })

        // Sort by minute
        parsed.sort((a, b) => parseInt(a.time) - parseInt(b.time))
        setEvents(parsed)
      } catch (_) {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    intervalRef.current = setInterval(fetchEvents, 60000) // refresh every 60s
    return () => clearInterval(intervalRef.current)
  }, [apiMatchId, isLive])

  return { events, loading }
}
