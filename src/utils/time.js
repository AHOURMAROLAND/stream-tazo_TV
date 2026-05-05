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
