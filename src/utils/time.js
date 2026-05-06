import dayjs from 'dayjs'

export const getTimestamp = () => {
  return dayjs().format('YYYYMMDDHHmm')
}

export const getToday = () => {
  return dayjs().format('YYYY-MM-DD')
}

export const getYesterday = () => {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD')
}

export const getTomorrow = () => {
  return dayjs().add(1, 'day').format('YYYY-MM-DD')
}

export const formatTime = (time, offsetHours = 0) => {
  const [h, m] = time.split(':').map(Number)
  let newH = (h + offsetHours + 24) % 24
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const getDateRange = () => {
  const dates = []
  for (let i = -14; i <= 14; i++) {
    const d = dayjs().add(i, 'day')
    dates.push({
      date:     d.format('YYYY-MM-DD'),
      label:    i === -1 ? 'Hier'
              : i === 0  ? "Aujourd'hui"
              : i === 1  ? 'Demain'
              : d.format('DD/MM'),
      day:      d.format('ddd'),
      isToday:  i === 0,
      isPast:   i < 0,
      isFuture: i > 0,
    })
  }
  return dates
}
