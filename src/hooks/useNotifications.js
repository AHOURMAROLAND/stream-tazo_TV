import { useEffect, useRef } from 'react'

export default function useNotifications(matches, favorites) {
  const notifiedRef = useRef(new Set())

  const requestPermission = async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  useEffect(() => {
    if (!matches.length || !favorites.length) return

    const checkAndNotify = async () => {
      const granted = await requestPermission()
      if (!granted) return

      favorites.forEach((fav) => {
        const live = matches.find(
          (m) => m.id === fav.id && parseInt(m.status) === 1
        )

        if (live && !notifiedRef.current.has(live.id)) {
          notifiedRef.current.add(live.id)
          new Notification('TAZO TV — Match en direct', {
            body:  `${live.home_en} vs ${live.away_en} a commencé !`,
            icon:  '/favicon.svg',
            badge: '/favicon.svg',
          })
        }
      })
    }

    checkAndNotify()
  }, [matches, favorites])

  return { requestPermission }
}
