import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'

// Returns countdown to match kickoff, adjusted for user timezone offset
// Also auto-redirects when countdown reaches 0
export default function useCountdown(match, timezoneOffset = 0, onKickoff = null) {
  const [timeLeft, setTimeLeft] = useState(null) // { h, m, s, total } or null
  const [kicked, setKicked]     = useState(false)
  const intervalRef             = useRef(null)

  useEffect(() => {
    if (!match || parseInt(match.status) !== 0) return

    const compute = () => {
      // Match time is in GMT — apply user timezone offset to display
      // But countdown is always against real UTC time
      const matchUtc = dayjs(`${match.date} ${match.time}`)
      const now      = dayjs()
      const diffSec  = matchUtc.diff(now, 'second')

      if (diffSec <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0, total: 0 })
        setKicked(true)
        clearInterval(intervalRef.current)
        if (onKickoff) onKickoff()
        return
      }

      const h = Math.floor(diffSec / 3600)
      const m = Math.floor((diffSec % 3600) / 60)
      const s = diffSec % 60
      setTimeLeft({ h, m, s, total: diffSec })
    }

    compute()
    intervalRef.current = setInterval(compute, 1000)
    return () => clearInterval(intervalRef.current)
  }, [match?.id, match?.status])

  return { timeLeft, kicked }
}
