import { useState } from 'react'
import { X } from 'lucide-react'
import { exhibitionService } from '../services/exhibitionService.ts'

interface CreateExhibitionModalProps {
  onClose: () => void
  onCreated: () => void
}

export function CreateExhibitionModal({
  onClose,
  onCreated
}: CreateExhibitionModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    setError('')

    try {
      exhibitionService.createExhibition(name.trim(), description.trim())
      onCreated()
    } catch {
      setError('Failed to create exhibition. Please try again.')
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
      aria-labelledby="create-modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            id="create-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            Create New Exhibition
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
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter exhibition name..."
                className="input-field"
                required
                autoFocus
                maxLength={100}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your exhibition theme, inspiration, or focus..."
                className="input-field resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/500 characters
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={!name.trim() || isCreating}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Exhibition'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isCreating}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
