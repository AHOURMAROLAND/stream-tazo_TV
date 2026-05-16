import axios from 'axios'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'

/**
 * Tente de récupérer la timeline (premium).
 * Si ça échoue (404), on pourrait tenter d'extraire des infos de base depuis lookupevent.php
 */
export const fetchLiveCommentary = async (eventId) => {
  try {
    const res = await axios.get(`${BASE}/eventtimeline.php?id=${eventId}`)
    return res.data?.timeline || []
  } catch (err) {
    if (err.response?.status === 404) {
      console.warn('[commentsApi] Timeline not available (Tier 3 required), trying basic event lookup...')
      // Fallback : on récupère les détails de l'événement (gratuit)
      const res = await axios.get(`${BASE}/lookupevent.php?id=${eventId}`)
      const event = res.data?.events?.[0]
      if (!event) return []

      // On transforme les champs comma-separated en format timeline
      const events = []
      
      const parse = (str, type) => {
        if (!str) return
        str.split(';').forEach(item => {
          const [time, player] = item.split(':')
          if (time && player) {
            events.push({
              strTimeline: time.trim().replace("'", ""),
              strType: type,
              strPlayer: player.trim(),
              strComment: type === 'Goal' ? 'But !' : 'Carton'
            })
          }
        })
      }

      parse(event.strHomeGoalDetails, 'Goal')
      parse(event.strAwayGoalDetails, 'Goal')
      parse(event.strHomeYellowCards, 'Yellow Card')
      parse(event.strAwayYellowCards, 'Yellow Card')
      parse(event.strHomeRedCards, 'Red Card')
      parse(event.strAwayRedCards, 'Red Card')

      return events.sort((a, b) => parseInt(a.strTimeline) - parseInt(b.strTimeline))
    }
    return []
  }
}
