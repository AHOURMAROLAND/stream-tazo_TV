import { useState, useEffect } from 'react'

const KEY = 'tazo_favorites'

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (match) => {
    setFavorites((prev) =>
      prev.find((m) => m.id === match.id) ? prev : [...prev, match]
    )
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id))
  }

  const isFavorite = (id) => favorites.some((m) => m.id === id)

  const toggleFavorite = (match) => {
    isFavorite(match.id) ? removeFavorite(match.id) : addFavorite(match)
  }

  return { favorites, toggleFavorite, isFavorite }
}
