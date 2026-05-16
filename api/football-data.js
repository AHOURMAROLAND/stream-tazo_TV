import axios from 'axios'

const API_FOOTBALL_BASE = 'https://apiv3.apifootball.com'
const API_KEY = process.env.VITE_APIFOOTBALL_KEY

/**
 * Cette fonction serverless agit comme une "Mini BD" sur le serveur (via le cache Vercel).
 * Elle récupère les données, les transforme et demande à Vercel de les garder en cache
 * de manière permanente pour les matchs terminés.
 */
export default async function handler(req, res) {
  const { matchId, status } = req.query

  if (!matchId) {
    return res.status(400).json({ error: 'Missing matchId' })
  }

  // Si le match est terminé, on autorise un cache très long (1 an = permanent sur Vercel Edge)
  const isFinished = status === 'Finished' || status === '2'
  if (isFinished) {
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate=31536000')
  } else {
    // Pendant le match, on cache seulement 30 secondes
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
  }

  try {
    const response = await axios.get(`${API_FOOTBALL_BASE}/?action=get_events&match_id=${matchId}&APIkey=${API_KEY}`)
    const data = response.data

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: 'Match not found' })
    }

    const matchData = data[0]
    
    // Structure simplifiée et propre pour notre application
    const result = {
      id: matchId,
      status: matchData.match_status,
      score: {
        home: matchData.match_hometeam_score,
        away: matchData.match_awayteam_score
      },
      stats: parseStats(matchData.statistics || []),
      events: parseEvents(matchData),
      lineups: matchData.lineup || { home: [], away: [] },
      lastUpdate: new Date().toISOString()
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error('[API-FOOTBALL PROXY ERROR]', error.message)
    return res.status(500).json({ error: 'Failed to fetch match data' })
  }
}

function parseStats(statistics) {
  const stats = {}
  statistics.forEach(s => {
    const key = s.type.toLowerCase().replace(/\s/g, '_')
    stats[key] = { home: s.home, away: s.away }
  })
  return stats
}

function parseEvents(match) {
  const events = []
  // Buts
  ;(match.goalscorer || []).forEach(g => {
    events.push({
      time: g.time,
      type: 'goal',
      team: g.home_scorer ? 'home' : 'away',
      player: g.home_scorer || g.away_scorer,
      assist: g.home_assist || g.away_assist
    })
  })
  // Cartons
  ;(match.cards || []).forEach(c => {
    events.push({
      time: c.time,
      type: c.fault?.toLowerCase().includes('yellow') ? 'yellow' : 'red',
      team: c.home_fault ? 'home' : 'away',
      player: c.home_fault || c.away_fault
    })
  })
  // Remplacements
  if (match.substitutions) {
    // API-Football regroupe parfois les subs différemment selon la version
    const subs = match.substitutions.home || match.substitutions.away || []
    if (Array.isArray(subs)) {
       subs.forEach(s => {
         events.push({
           time: s.time,
           type: 'substitution',
           team: match.substitutions.home?.includes(s) ? 'home' : 'away',
           player: s.substitution.replace(' | ', ' -> ')
         })
       })
    }
  }
  
  return events.sort((a, b) => parseInt(a.time) - parseInt(b.time))
}
