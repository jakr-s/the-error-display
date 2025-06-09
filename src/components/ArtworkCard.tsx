import { useState } from 'react'
import { Eye, Plus, Check, Calendar, User, MapPin } from 'lucide-react'
import { exhibitionService } from '../services/exhibitionService.ts'
import { AddToExhibitionModal } from './AddToExhibitionModal.tsx'
import type { Artwork } from '../types'

interface ArtworkCardProps {
  artwork: Artwork
  onView: () => void
  showRemoveButton?: boolean
  onRemove?: () => void
}

export function ArtworkCard({
  artwork,
  onView,
  showRemoveButton,
  onRemove
}: ArtworkCardProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const isInAnyExhibition = exhibitionService.isArtworkInExhibition(artwork.id)
  const museumName =
    artwork.museum === 'met' ? 'Metropolitan Museum' : 'Harvard Art Museums'

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleAddToExhibition = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAddModal(true)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.()
  }

  return (
    <>
      <article className="card group cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-gray-100">
          {/* Image */}
          {!imageError && artwork.thumbnailUrl ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                </div>
              )}
              <img
                src={artwork.thumbnailUrl}
                alt={`${artwork.title} by ${artwork.artist}`}
                className={`w-full h-full object-cover transition-opacity ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm">No Image Available</div>
              </div>
            </div>
          )}

          {/* Museum Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/75 text-white text-xs px-2 py-1 rounded">
              {museumName}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onView}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              aria-label={`View details for ${artwork.title}`}
            >
              <Eye className="h-4 w-4 text-gray-700" />
            </button>

            {!showRemoveButton ? (
              <button
                onClick={handleAddToExhibition}
                className={`p-2 rounded-full shadow-md transition-colors ${
                  isInAnyExhibition
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-700'
                }`}
                aria-label={
                  isInAnyExhibition
                    ? `${artwork.title} is already in an exhibition`
                    : `Add ${artwork.title} to exhibition`
                }
              >
                {isInAnyExhibition ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            ) : (
              <button
                onClick={handleRemove}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors"
                aria-label={`Remove ${artwork.title} from exhibition`}
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4" onClick={onView}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {artwork.title}
          </h3>

          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{artwork.artist}</span>
            </div>

            {artwork.date && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{artwork.date}</span>
              </div>
            )}

            {artwork.culture && artwork.culture !== 'Unknown Culture' && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{artwork.culture}</span>
              </div>
            )}
          </div>

          {/* Medium */}
          {artwork.medium && artwork.medium !== 'Unknown Medium' && (
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded truncate">
              {artwork.medium}
            </div>
          )}
        </div>
      </article>

      {/* Add to Exhibition Modal */}
      {showAddModal && (
        <AddToExhibitionModal
          artwork={artwork}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  )
}
