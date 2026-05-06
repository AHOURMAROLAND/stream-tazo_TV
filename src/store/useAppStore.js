import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  timezone:    0,
  lang:        'en',
  theme:       localStorage.getItem('tazo_theme') || 'dark',
  activeMatch: null,
  favorites:   JSON.parse(localStorage.getItem('tazo_favorites') || '[]'),
  miniPlayer:  null, // { matchId, src, homeName, awayName, homeLogo, awayLogo, score, isLive }

  setTimezone:    (tz)    => set({ timezone: tz }),
  setLang:        (lang)  => set({ lang }),
  setActiveMatch: (match) => set({ activeMatch: match }),

  setTheme: (theme) => {
    localStorage.setItem('tazo_theme', theme)
    set({ theme })
  },

  setMiniPlayer:   (data) => set({ miniPlayer: data }),
  clearMiniPlayer: ()     => set({ miniPlayer: null }),

  toggleFavorite: (match) => {
    const favs = get().favorites
    const exists = favs.find((f) => f.id === match.id)
    const next = exists
      ? favs.filter((f) => f.id !== match.id)
      : [...favs, { id: match.id, home_en: match.home_en, away_en: match.away_en, league_en: match.league_en, time: match.time, status: match.status }]
    localStorage.setItem('tazo_favorites', JSON.stringify(next))
    set({ favorites: next })
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),
}))

export default useAppStore
