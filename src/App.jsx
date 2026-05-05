import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Match from './pages/Match'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen bg-tazo-bg text-tazo-text font-body">
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </div>
  )
}
