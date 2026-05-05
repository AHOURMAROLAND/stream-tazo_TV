import { useEffect } from 'react'

export default function useDocumentTitle(match) {
  useEffect(() => {
    if (!match) {
      document.title = 'TAZO TV'
      return
    }

    const { home_en, away_en, score, status } = match
    const isLive     = parseInt(status) === 1
    const isFinished = parseInt(status) === 2

    if (isLive && score && score !== '-') {
      document.title = `LIVE ${score} · ${home_en} vs ${away_en} — TAZO TV`
    } else if (isFinished) {
      document.title = `FT ${score} · ${home_en} vs ${away_en} — TAZO TV`
    } else {
      document.title = `${home_en} vs ${away_en} — TAZO TV`
    }

    return () => {
      document.title = 'TAZO TV'
    }
  }, [match?.score, match?.status])
}
