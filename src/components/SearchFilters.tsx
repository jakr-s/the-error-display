import { X } from 'lucide-react'
import type { SearchFilters as SearchFiltersType } from '../types'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onChange: (filters: SearchFiltersType) => void
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const handleFilterChange = (
    key: keyof SearchFiltersType,
    value: string | boolean | { start: number; end: number }
  ) => {
    onChange({
      ...filters,
      [key]: value
    })
  }

  const handleClearFilters = () => {
    onChange({
      query: '',
      medium: '',
      culture: '',
      department: '',
      hasImage: true,
      dateRange: { start: 0, end: 2024 }
    })
  }

  const hasActiveFilters =
    filters.medium ||
    filters.culture ||
    filters.department ||
    !filters.hasImage ||
    filters.dateRange.start > 0 ||
    filters.dateRange.end < 2024

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Query */}
        <div>
          <label
            htmlFor="filter-query"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Terms
          </label>
          <input
            id="filter-query"
            type="text"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            placeholder="Enter search terms..."
            className="input-field"
          />
        </div>

        {/* Medium */}
        <div>
          <label
            htmlFor="filter-medium"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Medium
          </label>
          <select
            id="filter-medium"
            value={filters.medium}
            onChange={(e) => handleFilterChange('medium', e.target.value)}
            className="input-field"
          >
            <option value="">All Media</option>
            <option value="painting">Painting</option>
            <option value="sculpture">Sculpture</option>
            <option value="drawing">Drawing</option>
            <option value="print">Print</option>
            <option value="photograph">Photograph</option>
            <option value="textile">Textile</option>
            <option value="ceramic">Ceramic</option>
            <option value="metal">Metal</option>
            <option value="wood">Wood</option>
            <option value="glass">Glass</option>
          </select>
        </div>

        {/* Culture */}
        <div>
          <label
            htmlFor="filter-culture"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Culture
          </label>
          <select
            id="filter-culture"
            value={filters.culture}
            onChange={(e) => handleFilterChange('culture', e.target.value)}
            className="input-field"
          >
            <option value="">All Cultures</option>
            <option value="american">American</option>
            <option value="european">European</option>
            <option value="asian">Asian</option>
            <option value="african">African</option>
            <option value="ancient">Ancient</option>
            <option value="egyptian">Egyptian</option>
            <option value="greek">Greek</option>
            <option value="roman">Roman</option>
            <option value="chinese">Chinese</option>
            <option value="japanese">Japanese</option>
            <option value="indian">Indian</option>
            <option value="islamic">Islamic</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="filter-department"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Department
          </label>
          <select
            id="filter-department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="input-field"
          >
            <option value="">All Departments</option>
            <option value="painting">Paintings</option>
            <option value="sculpture">Sculpture</option>
            <option value="decorative">Decorative Arts</option>
            <option value="asian">Asian Art</option>
            <option value="ancient">Ancient Art</option>
            <option value="medieval">Medieval Art</option>
            <option value="modern">Modern Art</option>
            <option value="contemporary">Contemporary Art</option>
            <option value="american">American Art</option>
            <option value="european">European Art</option>
            <option value="prints">Prints and Drawings</option>
            <option value="photography">Photography</option>
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Date Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="filter-date-start"
              className="block text-xs text-gray-500 mb-1"
            >
              From Year
            </label>
            <input
              id="filter-date-start"
              type="number"
              min="0"
              max="2024"
              value={filters.dateRange.start}
              onChange={(e) =>
                handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  start: parseInt(e.target.value) || 0
                })
              }
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label
              htmlFor="filter-date-end"
              className="block text-xs text-gray-500 mb-1"
            >
              To Year
            </label>
            <input
              id="filter-date-end"
              type="number"
              min="0"
              max="2024"
              value={filters.dateRange.end}
              onChange={(e) =>
                handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  end: parseInt(e.target.value) || 2024
                })
              }
              className="input-field"
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      {/* Has Image */}
      <div className="flex items-center space-x-2">
        <input
          id="filter-has-image"
          type="checkbox"
          checked={filters.hasImage}
          onChange={(e) => handleFilterChange('hasImage', e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="filter-has-image" className="text-sm text-gray-700">
          Only show artworks with images
        </label>
      </div>
    </div>
  )
}
