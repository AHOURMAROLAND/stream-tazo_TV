import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Match from './pages/Match'
import NotFound from './pages/NotFound'
import MiniPlayer from './components/player/MiniPlayer'
import useAppStore from './store/useAppStore'

export default function App() {
  const { theme } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-tazo-bg text-tazo-text font-body">
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
      <MiniPlayer />
    </div>
  )
}
