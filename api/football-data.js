import axios from 'axios'

/**
 * Configuration pour API-Football (v3)
 * On supporte deux modes d'authentification :
 * 1. RapidAPI (x-rapidapi-key) - Recommandé pour le plan Free
 * 2. Direct (x-apisports-key)
 */
const API_KEY = process.env.VITE_APIFOOTBALL_KEY
const IS_RAPID_API = API_KEY?.length > 40 || process.env.USE_RAPIDAPI === 'true'

const BASE_URL = IS_RAPID_API 
  ? 'https://api-football-v1.p.rapidapi.com/v3'
  : 'https://v3.football.api-sports.io'

const HEADERS = IS_RAPID_API 
  ? { 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com', 'x-rapidapi-key': API_KEY }
  : { 'x-apisports-key': API_KEY }

export default async function handler(req, res) {
  const { matchId, status, fixtureId } = req.query
  const id = fixtureId || matchId // Supporte les deux noms de paramètres

  if (!id) {
    return res.status(400).json({ error: 'Missing match/fixture ID' })
  }

  // ── Cache Management ──────────────────────────────────────
  const isFinished = status === 'Finished' || status === 'FT' || status === '2'
  if (isFinished) {
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate=31536000')
  } else {
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
  }

  try {
    // API-Football v3 utilise l'endpoint /fixtures
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: { id: id },
      headers: HEADERS
    })

    const fixture = response.data?.response?.[0]

    if (!fixture) {
      return res.status(404).json({ error: 'Match not found in API-Football v3' })
    }
    
    // Structure transformée pour TAZO TV
    const result = {
      id: id,
      status: fixture.fixture.status.short,
      score: {
        home: fixture.goals.home,
        away: fixture.goals.away
      },
      stats: parseStatsV3(fixture.statistics || []),
      events: parseEventsV3(fixture.events || []),
      lineups: fixture.lineups || [],
      lastUpdate: new Date().toISOString(),
      venue: fixture.fixture.venue,
      referee: fixture.fixture.referee
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error('[API-FOOTBALL V3 ERROR]', error.response?.data || error.message)
    return res.status(500).json({ error: 'Failed to fetch data from API-Football v3' })
  }
}

function parseStatsV3(statistics) {
  const stats = {}
  // statistics est un tableau par équipe [{ team: {}, statistics: [] }, ...]
  statistics.forEach(teamStats => {
    const side = teamStats.team.id === statistics[0].team.id ? 'home' : 'away'
    teamStats.statistics.forEach(s => {
      const key = s.type.toLowerCase().replace(/\s/g, '_')
      if (!stats[key]) stats[key] = { home: 0, away: 0 }
      stats[key][side] = s.value
    })
  })
  return stats
}

function parseEventsV3(events) {
  return events.map(e => ({
    time: e.time.elapsed + (e.time.extra ? `+${e.time.extra}` : ''),
    type: e.type.toLowerCase(), // goal, card, subst, var
    detail: e.detail,
    team: e.comments, // Contient souvent le côté ou des infos
    player: e.player.name,
    assist: e.assist?.name || null,
    side: e.team.name // Nom de l'équipe pour filtrage UI
  }))
}
