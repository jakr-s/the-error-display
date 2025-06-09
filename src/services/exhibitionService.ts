import type { Exhibition, Artwork } from '../types'

class ExhibitionService {
  private readonly STORAGE_KEY = 'exhibition-collections'

  // Get all exhibitions
  getExhibitions(): Exhibition[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading exhibitions:', error)
      return []
    }
  }

  // Get a specific exhibition by ID
  getExhibition(id: string): Exhibition | null {
    const exhibitions = this.getExhibitions()
    return exhibitions.find((exhibition) => exhibition.id === id) || null
  }

  // Create a new exhibition
  createExhibition(name: string, description: string = ''): Exhibition {
    const exhibition: Exhibition = {
      id: this.generateId(),
      name,
      description,
      artworks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const exhibitions = this.getExhibitions()
    exhibitions.push(exhibition)
    this.saveExhibitions(exhibitions)

    return exhibition
  }

  // Update an exhibition
  updateExhibition(
    id: string,
    updates: Partial<Pick<Exhibition, 'name' | 'description'>>
  ): Exhibition | null {
    const exhibitions = this.getExhibitions()
    const index = exhibitions.findIndex((exhibition) => exhibition.id === id)

    if (index === -1) return null

    exhibitions[index] = {
      ...exhibitions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveExhibitions(exhibitions)
    return exhibitions[index]
  }

  // Delete an exhibition
  deleteExhibition(id: string): boolean {
    const exhibitions = this.getExhibitions()
    const filteredExhibitions = exhibitions.filter(
      (exhibition) => exhibition.id !== id
    )

    if (filteredExhibitions.length === exhibitions.length) {
      return false // Exhibition not found
    }

    this.saveExhibitions(filteredExhibitions)
    return true
  }

  // Add artwork to exhibition
  addArtworkToExhibition(
    exhibitionId: string,
    artwork: Artwork
  ): Exhibition | null {
    const exhibitions = this.getExhibitions()
    const exhibitionIndex = exhibitions.findIndex(
      (exhibition) => exhibition.id === exhibitionId
    )

    if (exhibitionIndex === -1) return null

    // Check if artwork is already in the exhibition
    const artworkExists = exhibitions[exhibitionIndex].artworks.some(
      (existingArtwork) => existingArtwork.id === artwork.id
    )

    if (artworkExists) {
      return exhibitions[exhibitionIndex] // Already exists, return as is
    }

    exhibitions[exhibitionIndex].artworks.push(artwork)
    exhibitions[exhibitionIndex].updatedAt = new Date().toISOString()

    this.saveExhibitions(exhibitions)
    return exhibitions[exhibitionIndex]
  }

  // Remove artwork from exhibition
  removeArtworkFromExhibition(
    exhibitionId: string,
    artworkId: string
  ): Exhibition | null {
    const exhibitions = this.getExhibitions()
    const exhibitionIndex = exhibitions.findIndex(
      (exhibition) => exhibition.id === exhibitionId
    )

    if (exhibitionIndex === -1) return null

    exhibitions[exhibitionIndex].artworks = exhibitions[
      exhibitionIndex
    ].artworks.filter((artwork) => artwork.id !== artworkId)
    exhibitions[exhibitionIndex].updatedAt = new Date().toISOString()

    this.saveExhibitions(exhibitions)
    return exhibitions[exhibitionIndex]
  }

  // Check if artwork is in any exhibition
  isArtworkInExhibition(artworkId: string, exhibitionId?: string): boolean {
    const exhibitions = this.getExhibitions()

    if (exhibitionId) {
      const exhibition = exhibitions.find((ex) => ex.id === exhibitionId)
      return exhibition
        ? exhibition.artworks.some((artwork) => artwork.id === artworkId)
        : false
    }

    return exhibitions.some((exhibition) =>
      exhibition.artworks.some((artwork) => artwork.id === artworkId)
    )
  }

  // Get all exhibitions containing a specific artwork
  getExhibitionsContainingArtwork(artworkId: string): Exhibition[] {
    const exhibitions = this.getExhibitions()
    return exhibitions.filter((exhibition) =>
      exhibition.artworks.some((artwork) => artwork.id === artworkId)
    )
  }

  // Private helper methods
  private saveExhibitions(exhibitions: Exhibition[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exhibitions))
    } catch (error) {
      console.error('Error saving exhibitions:', error)
      throw new Error('Failed to save exhibitions. Storage may be full.')
    }
  }

  private generateId(): string {
    return `exhibition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Export/Import functionality
  exportExhibitions(): string {
    const exhibitions = this.getExhibitions()
    return JSON.stringify(exhibitions, null, 2)
  }

  importExhibitions(data: string): boolean {
    try {
      const exhibitions = JSON.parse(data) as Exhibition[]

      // Validate the data structure
      if (!Array.isArray(exhibitions)) {
        throw new Error('Invalid data format')
      }

      for (const exhibition of exhibitions) {
        if (
          !exhibition.id ||
          !exhibition.name ||
          !Array.isArray(exhibition.artworks)
        ) {
          throw new Error('Invalid exhibition format')
        }
      }

      this.saveExhibitions(exhibitions)
      return true
    } catch (error) {
      console.error('Error importing exhibitions:', error)
      return false
    }
  }
}

export const exhibitionService = new ExhibitionService()
