import { useState } from 'react'
import {
  ArrowLeft,
  Plus,
  Check,
  Calendar,
  User,
  MapPin,
  ExternalLink,
  Building2
} from 'lucide-react'
import { exhibitionService } from '../services/exhibitionService.ts'
import { AddToExhibitionModal } from './AddToExhibitionModal'
import type { Artwork } from '../types'

interface ArtworkDetailViewProps {
  artwork: Artwork
  onBack: () => void
}

export function ArtworkDetailView({ artwork, onBack }: ArtworkDetailViewProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const isInAnyExhibition = exhibitionService.isArtworkInExhibition(artwork.id)
  const museumName =
    artwork.museum === 'met'
      ? 'Metropolitan Museum of Art'
      : 'Harvard Art Museums'

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const details = [
    { icon: User, label: 'Artist', value: artwork.artist },
    { icon: Calendar, label: 'Date', value: artwork.date },
    { icon: MapPin, label: 'Culture', value: artwork.culture },
    { label: 'Medium', value: artwork.medium },
    { label: 'Dimensions', value: artwork.dimensions },
    { label: 'Department', value: artwork.department },
    { icon: Building2, label: 'Museum', value: museumName }
  ].filter((detail) => detail.value && detail.value !== 'Unknown')

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center space-x-2"
            aria-label="Go back to search results"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              {!imageError && artwork.imageUrl ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={artwork.imageUrl}
                    alt={`${artwork.title} by ${artwork.artist}`}
                    className={`w-full h-full object-contain transition-opacity ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">🖼️</div>
                    <div className="text-lg">No Image Available</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className={`btn-primary flex items-center space-x-2 flex-1 justify-center ${
                  isInAnyExhibition ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                {isInAnyExhibition ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>In Exhibition</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add to Exhibition</span>
                  </>
                )}
              </button>

              {artwork.objectUrl && (
                <a
                  href={artwork.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                  aria-label={`View ${artwork.title} on museum website`}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="hidden sm:inline">View on Museum Site</span>
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title and Artist */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {artwork.title}
              </h1>
              <p className="text-xl text-gray-600">{artwork.artist}</p>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
              <dl className="space-y-3">
                {details.map((detail, index) => {
                  const Icon = detail.icon
                  return (
                    <div key={index} className="flex">
                      <dt className="flex items-center text-sm font-medium text-gray-500 w-24 flex-shrink-0">
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {detail.label}:
                      </dt>
                      <dd className="text-sm text-gray-900 ml-4">
                        {detail.value}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>

            {/* Description */}
            {artwork.description && artwork.description.trim() && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Museum Badge */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Collection of the {museumName}
                </span>
              </div>
            </div>

            {/* Exhibitions containing this artwork */}
            {isInAnyExhibition && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  In Exhibitions
                </h2>
                <div className="space-y-1">
                  {exhibitionService
                    .getExhibitionsContainingArtwork(artwork.id)
                    .map((exhibition) => (
                      <div
                        key={exhibition.id}
                        className="text-sm text-primary-600 bg-primary-50 px-3 py-2 rounded-lg"
                      >
                        {exhibition.name}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
