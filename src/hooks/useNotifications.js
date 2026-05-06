import { useEffect, useRef } from 'react'
import dayjs from 'dayjs'

const NOTIFIED_KEY = 'tazo_notified'

function getNotified() {
  try { return JSON.parse(localStorage.getItem(NOTIFIED_KEY)) || {} }
  catch { return {} }
}

function saveNotified(data) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(data))
}

function sendNotification(title, body) {
  if (Notification.permission !== 'granted') return
  new Notification(title, {
    body,
    icon:  '/favicon.svg',
    badge: '/favicon.svg',
  })
}

export default function useNotifications(matches, favorites) {
  const intervalRef = useRef(null)

  const requestPermission = async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const r = await Notification.requestPermission()
    return r === 'granted'
  }

  useEffect(() => {
    if (!matches.length || !favorites.length) return

    const check = async () => {
      const granted = await requestPermission()
      if (!granted) return

      const now      = dayjs()
      const notified = getNotified()

      favorites.forEach((fav) => {
        const match = matches.find((m) => m.id === fav.id)
        if (!match) return

        const status = parseInt(match.status)

        // Match just went live
        if (status === 1 && !notified[`live_${match.id}`]) {
          sendNotification(
            'TAZO TV — Match en direct',
            `${match.home_en} vs ${match.away_en} vient de commencer !`
          )
          notified[`live_${match.id}`] = true
          saveNotified(notified)
          return
        }

        // Pre-match: notify every 5 min window in the 30 min before kickoff
        if (status === 0 && match.date && match.time) {
          const matchTime   = dayjs(`${match.date} ${match.time}`)
          const minutesDiff = matchTime.diff(now, 'minute')

          if (minutesDiff > 0 && minutesDiff <= 30) {
            const slotKey = `pre_${match.id}_${Math.floor(minutesDiff / 5)}`
            if (!notified[slotKey]) {
              sendNotification(
                `TAZO TV — Dans ${minutesDiff} min`,
                `${match.home_en} vs ${match.away_en} commence bientôt`
              )
              notified[slotKey] = true
              saveNotified(notified)
            }
          }
        }
      })
    }

    check()
    intervalRef.current = setInterval(check, 60 * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [matches, favorites])

  return { requestPermission }
}
