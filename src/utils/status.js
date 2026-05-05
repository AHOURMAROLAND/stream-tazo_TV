export const getStatusLabel = (status) => {
  switch (parseInt(status)) {
    case 0:  return { label: 'À venir',  color: 'text-tazo-muted',  dot: false }
    case 1:  return { label: 'LIVE',     color: 'text-tazo-red',    dot: true  }
    case 2:  return { label: 'Terminé',  color: 'text-tazo-muted',  dot: false }
    default: return { label: 'À venir',  color: 'text-tazo-muted',  dot: false }
  }
}
