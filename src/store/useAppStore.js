import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  timezone:    0,
  lang:        'en',
  activeMatch: null,
  favorites:   JSON.parse(localStorage.getItem('tazo_favorites') || '[]'),

  setTimezone:    (tz)    => set({ timezone: tz }),
  setLang:        (lang)  => set({ lang }),
  setActiveMatch: (match) => set({ activeMatch: match }),

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
