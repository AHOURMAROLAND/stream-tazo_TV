export default function LeagueBadge({ name, logo, externalLogo }) {
  const src = externalLogo
    || (logo ? `https://cdn.kora-api.space/uploads/league/${logo}` : null)

  return (
    <div className="flex items-center gap-2">
      {src && (
        <img
          src={src}
          alt={name}
          className="w-6 h-6 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      <span className="text-tazo-muted text-xs font-mono truncate">{name}</span>
    </div>
  )
}
