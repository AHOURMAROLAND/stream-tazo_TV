export default function FavoriteButton({ isFav, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`
        w-7 h-7 rounded-full flex items-center justify-center
        transition-all duration-200 border
        ${isFav
          ? 'bg-tazo-orange/20 border-tazo-orange text-tazo-orange scale-110'
          : 'bg-transparent border-tazo-border text-tazo-muted hover:border-tazo-orange hover:text-tazo-orange'
        }
      `}
      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <svg
        width="12" height="12"
        viewBox="0 0 24 24"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </button>
  )
}
