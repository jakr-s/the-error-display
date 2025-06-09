import { useState, useEffect } from 'react'
import { Plus, BookOpen, Edit2, Trash2, Eye } from 'lucide-react'
import { exhibitionService } from '../services/exhibitionService.ts'
import { CreateExhibitionModal } from './CreateExhibitionModal.tsx'
import { EditExhibitionModal } from './EditExhibitionModal.tsx'
import { ArtworkCard } from './ArtworkCard.tsx'
import type { Exhibition, Artwork } from '../types'

interface ExhibitionsViewProps {
  onViewArtwork: (artwork: Artwork) => void
}

export function ExhibitionsView({ onViewArtwork }: ExhibitionsViewProps) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [selectedExhibition, setSelectedExhibition] =
    useState<Exhibition | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [exhibitionToEdit, setExhibitionToEdit] = useState<Exhibition | null>(
    null
  )

  useEffect(() => {
    loadExhibitions()
  }, [])

  const loadExhibitions = () => {
    setExhibitions(exhibitionService.getExhibitions())
  }

  const handleCreateExhibition = () => {
    setShowCreateModal(false)
    loadExhibitions()
  }

  const handleEditExhibition = (exhibition: Exhibition) => {
    setExhibitionToEdit(exhibition)
    setShowEditModal(true)
  }

  const handleUpdateExhibition = () => {
    setShowEditModal(false)
    setExhibitionToEdit(null)
    loadExhibitions()
    // Update selected exhibition if it was edited
    if (selectedExhibition && exhibitionToEdit?.id === selectedExhibition.id) {
      const updated = exhibitionService.getExhibition(selectedExhibition.id)
      setSelectedExhibition(updated)
    }
  }

  const handleDeleteExhibition = (exhibition: Exhibition) => {
    if (
      confirm(
        `Are you sure you want to delete "${exhibition.name}"? This action cannot be undone.`
      )
    ) {
      exhibitionService.deleteExhibition(exhibition.id)
      loadExhibitions()
      if (selectedExhibition?.id === exhibition.id) {
        setSelectedExhibition(null)
      }
    }
  }

  const handleRemoveArtwork = (artworkId: string) => {
    if (!selectedExhibition) return

    const updated = exhibitionService.removeArtworkFromExhibition(
      selectedExhibition.id,
      artworkId
    )
    if (updated) {
      setSelectedExhibition(updated)
      loadExhibitions()
    }
  }

  const handleBackToList = () => {
    setSelectedExhibition(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {!selectedExhibition ? (
        /* Exhibitions List View */
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Exhibitions
              </h1>
              <p className="text-gray-600">
                Create and manage your personal art exhibitions
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Exhibition</span>
            </button>
          </div>

          {/* Exhibitions Grid */}
          {exhibitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="card">
                  {/* Preview Images */}
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {exhibition.artworks.length > 0 ? (
                      <div className="grid grid-cols-2 h-full">
                        {exhibition.artworks
                          .slice(0, 4)
                          .map((artwork, index) => (
                            <div
                              key={artwork.id}
                              className={`relative ${
                                exhibition.artworks.length === 1
                                  ? 'col-span-2'
                                  : ''
                              }`}
                            >
                              {artwork.thumbnailUrl ? (
                                <img
                                  src={artwork.thumbnailUrl}
                                  alt={artwork.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
                                  🖼️
                                </div>
                              )}
                              {index === 3 &&
                                exhibition.artworks.length > 4 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white font-medium">
                                      +{exhibition.artworks.length - 4} more
                                    </span>
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Empty Exhibition</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Exhibition Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {exhibition.name}
                      </h3>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleEditExhibition(exhibition)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          aria-label={`Edit ${exhibition.name}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExhibition(exhibition)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          aria-label={`Delete ${exhibition.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {exhibition.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {exhibition.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {exhibition.artworks.length} artwork
                        {exhibition.artworks.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setSelectedExhibition(exhibition)}
                        className="btn-primary flex items-center space-x-1 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                No exhibitions yet
              </h2>
              <p className="text-gray-600 mb-4">
                Create your first exhibition to start curating artworks
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Exhibition</span>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Exhibition Detail View */
        <div>
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToList}
              className="text-primary-600 hover:text-primary-700 mb-4 flex items-center space-x-1"
            >
              <span>← Back to Exhibitions</span>
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedExhibition.name}
                </h1>
                {selectedExhibition.description && (
                  <p className="text-gray-600 max-w-3xl">
                    {selectedExhibition.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {selectedExhibition.artworks.length} artwork
                  {selectedExhibition.artworks.length !== 1 ? 's' : ''}
                  {' • '}
                  Created{' '}
                  {new Date(selectedExhibition.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleEditExhibition(selectedExhibition)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Artworks Grid */}
          {selectedExhibition.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedExhibition.artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onView={() => onViewArtwork(artwork)}
                  showRemoveButton={true}
                  onRemove={() => handleRemoveArtwork(artwork.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                No artworks in this exhibition
              </h2>
              <p className="text-gray-600">
                Search for artworks and add them to this exhibition
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateExhibitionModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreateExhibition}
        />
      )}

      {showEditModal && exhibitionToEdit && (
        <EditExhibitionModal
          exhibition={exhibitionToEdit}
          onClose={() => {
            setShowEditModal(false)
            setExhibitionToEdit(null)
          }}
          onUpdated={handleUpdateExhibition}
        />
      )}
    </div>
  )
}
