import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { exhibitionService } from '../services/exhibitionService.ts'
import type { Artwork } from '../types'

interface AddToExhibitionModalProps {
  artwork: Artwork
  onClose: () => void
}

export function AddToExhibitionModal({
  artwork,
  onClose
}: AddToExhibitionModalProps) {
  const [exhibitions, setExhibitions] = useState(
    exhibitionService.getExhibitions()
  )
  const [showNewExhibitionForm, setShowNewExhibitionForm] = useState(false)
  const [newExhibitionName, setNewExhibitionName] = useState('')
  const [newExhibitionDescription, setNewExhibitionDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleAddToExhibition = async (exhibitionId: string) => {
    const updatedExhibition = exhibitionService.addArtworkToExhibition(
      exhibitionId,
      artwork
    )
    if (updatedExhibition) {
      setExhibitions(exhibitionService.getExhibitions())
    }
  }

  const handleCreateNewExhibition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExhibitionName.trim()) return

    setIsCreating(true)
    try {
      const newExhibition = exhibitionService.createExhibition(
        newExhibitionName.trim(),
        newExhibitionDescription.trim()
      )

      // Add the artwork to the new exhibition
      exhibitionService.addArtworkToExhibition(newExhibition.id, artwork)

      setExhibitions(exhibitionService.getExhibitions())
      setShowNewExhibitionForm(false)
      setNewExhibitionName('')
      setNewExhibitionDescription('')
    } finally {
      setIsCreating(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            Add to Exhibition
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Artwork Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{artwork.title}</h3>
            <p className="text-sm text-gray-600">{artwork.artist}</p>
          </div>

          {/* Exhibitions List */}
          <div className="space-y-2 mb-4">
            {exhibitions.length > 0 ? (
              exhibitions.map((exhibition) => {
                const isArtworkInExhibition = exhibition.artworks.some(
                  (artwork_in_exhibition) =>
                    artwork_in_exhibition.id === artwork.id
                )

                return (
                  <div
                    key={exhibition.id}
                    className={`
                      flex items-center justify-between p-3 border rounded-lg transition-colors
                      ${
                        isArtworkInExhibition
                          ? 'bg-green-50 border-green-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }
                    `}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {exhibition.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exhibition.artworks.length} artwork
                        {exhibition.artworks.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToExhibition(exhibition.id)}
                      disabled={isArtworkInExhibition}
                      className={`
                        flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors
                        ${
                          isArtworkInExhibition
                            ? 'bg-green-100 text-green-800 cursor-default'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }
                      `}
                      aria-label={
                        isArtworkInExhibition
                          ? `Already in ${exhibition.name}`
                          : `Add to ${exhibition.name}`
                      }
                    >
                      {isArtworkInExhibition ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No exhibitions yet.</p>
                <p className="text-sm">Create your first exhibition below.</p>
              </div>
            )}
          </div>

          {/* Create New Exhibition */}
          {!showNewExhibitionForm ? (
            <button
              onClick={() => setShowNewExhibitionForm(true)}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Exhibition</span>
            </button>
          ) : (
            <form onSubmit={handleCreateNewExhibition} className="space-y-3">
              <div>
                <label
                  htmlFor="exhibition-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Exhibition Name *
                </label>
                <input
                  id="exhibition-name"
                  type="text"
                  value={newExhibitionName}
                  onChange={(e) => setNewExhibitionName(e.target.value)}
                  placeholder="Enter exhibition name..."
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="exhibition-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (optional)
                </label>
                <textarea
                  id="exhibition-description"
                  value={newExhibitionDescription}
                  onChange={(e) => setNewExhibitionDescription(e.target.value)}
                  placeholder="Describe your exhibition..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={!newExhibitionName.trim() || isCreating}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create & Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewExhibitionForm(false)
                    setNewExhibitionName('')
                    setNewExhibitionDescription('')
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
