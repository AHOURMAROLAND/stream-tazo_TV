import { IconStar } from './Icons'

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
      <IconStar className="w-3 h-3" filled={isFav} />
    </button>
  )
}
