import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { museumAPI } from '../services/museumAPI.ts'
import { ArtworkCard } from './ArtworkCard.tsx'
import { SearchFilters } from './SearchFilters.tsx'
import type { Artwork, SearchFilters as SearchFiltersType } from '../types'

interface SearchViewProps {
  onViewArtwork: (artwork: Artwork) => void
}

export function SearchView({ onViewArtwork }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFiltersType>({
    query: '',
    medium: '',
    culture: '',
    department: '',
    hasImage: true,
    dateRange: { start: 0, end: 2024 }
  })

  const effectiveFilters = { ...filters, query: searchQuery || filters.query }

  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['artworks', effectiveFilters, currentPage],
    queryFn: () => museumAPI.searchArtworks(effectiveFilters, currentPage),
    enabled: !!effectiveFilters.query.trim()
  })

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleFiltersChange = useCallback((newFilters: SearchFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch((e.target as HTMLInputElement).value)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Artworks
        </h1>
        <p className="text-gray-600">
          Search across collections from the Metropolitan Museum of Art and
          Harvard Art Museums
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for artworks, artists, cultures..."
              className="input-field pl-10"
              defaultValue={searchQuery}
              onKeyPress={handleKeyPress}
              aria-label="Search artworks"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${
              showFilters ? 'bg-gray-300' : ''
            }`}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <SearchFilters filters={filters} onChange={handleFiltersChange} />
          </div>
        )}
      </div>

      {/* Search Results */}
      {effectiveFilters.query.trim() && (
        <>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Searching artworks...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">
                Failed to search artworks. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Retry search
              </button>
            </div>
          )}

          {/* Results */}
          {searchResults && !isLoading && (
            <>
              {/* Results Info */}
              <div className="mb-4 text-sm text-gray-600">
                {searchResults.total > 0 ? (
                  <>
                    Showing {searchResults.artworks.length} of{' '}
                    {searchResults.total} results
                  </>
                ) : (
                  <>No artworks found for "{effectiveFilters.query}"</>
                )}
              </div>

              {/* Artwork Grid */}
              {searchResults.artworks.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {searchResults.artworks.map((artwork) => (
                      <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        onView={() => onViewArtwork(artwork)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span>Previous</span>
                    </button>

                    <span className="text-gray-600">Page {currentPage}</span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!searchResults.hasMore}
                      className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Empty State */}
      {!effectiveFilters.query.trim() && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Start your exploration
          </h2>
          <p className="text-gray-600 mb-4">
            Enter keywords to search across museum collections
          </p>
          <div className="text-sm text-gray-500">
            Try searches like "impressionist", "ancient egypt", "renaissance",
            or "pottery"
          </div>
        </div>
      )}
    </div>
  )
}
