import axios from 'axios'
import type {
  Artwork,
  MetArtwork,
  HarvardArtwork,
  SearchResult,
  SearchFilters
} from '../types'

const MET_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'
const HARVARD_BASE_URL = 'https://api.harvardartmuseums.org'

// Harvard API key should be set in environment variables
const HARVARD_API_KEY = import.meta.env.VITE_HARVARD_API_KEY || ''

class MuseumAPIService {
  // Metropolitan Museum of Art API
  async searchMetArtworks(
    query: string,
    page: number = 1,
    hasImages: boolean = true
  ): Promise<SearchResult> {
    try {
      const searchUrl = `${MET_BASE_URL}/search?q=${encodeURIComponent(
        query
      )}&hasImages=${hasImages}`
      const searchResponse = await axios.get(searchUrl)

      if (!searchResponse.data.objectIDs) {
        return { artworks: [], total: 0, hasMore: false }
      }

      const objectIDs = searchResponse.data.objectIDs
      const total = objectIDs.length
      const perPage = 20
      const startIndex = (page - 1) * perPage
      const endIndex = Math.min(startIndex + perPage, total)
      const pageObjectIDs = objectIDs.slice(startIndex, endIndex)

      const artworkPromises = pageObjectIDs.map(async (id: number) => {
        try {
          const response = await axios.get(`${MET_BASE_URL}/objects/${id}`)
          return this.transformMetArtwork(response.data)
        } catch (error) {
          console.warn(`Failed to fetch Met artwork ${id}:`, error)
          return null
        }
      })

      const artworks = (await Promise.all(artworkPromises)).filter(
        Boolean
      ) as Artwork[]

      return {
        artworks,
        total,
        hasMore: endIndex < total
      }
    } catch (error) {
      console.error('Error searching Met artworks:', error)
      return { artworks: [], total: 0, hasMore: false }
    }
  }

  async getMetArtwork(objectId: number): Promise<Artwork | null> {
    try {
      const response = await axios.get(`${MET_BASE_URL}/objects/${objectId}`)
      return this.transformMetArtwork(response.data)
    } catch (error) {
      console.error(`Error fetching Met artwork ${objectId}:`, error)
      return null
    }
  }

  private transformMetArtwork(data: MetArtwork): Artwork {
    return {
      id: `met-${data.objectID}`,
      title: data.title || 'Untitled',
      artist: data.artistDisplayName || 'Unknown Artist',
      date: data.objectDate || 'Unknown Date',
      medium: data.medium || 'Unknown Medium',
      dimensions: data.dimensions || 'Unknown Dimensions',
      culture: data.culture || 'Unknown Culture',
      imageUrl: data.primaryImage || '',
      thumbnailUrl: data.primaryImageSmall || data.primaryImage || '',
      description: this.generateDescription(data),
      department: data.department || 'Unknown Department',
      museum: 'met',
      objectUrl: data.objectURL || ''
    }
  }

  // Harvard Art Museums API
  async searchHarvardArtworks(
    query: string,
    page: number = 1,
    hasImages: boolean = true
  ): Promise<SearchResult> {
    try {
      if (!HARVARD_API_KEY) {
        console.warn('Harvard API key not configured')
        return { artworks: [], total: 0, hasMore: false }
      }

      const perPage = 20
      const params = new URLSearchParams({
        apikey: HARVARD_API_KEY,
        q: query,
        size: perPage.toString(),
        page: page.toString(),
        sort: 'rank',
        sortorder: 'desc'
      })

      if (hasImages) {
        params.append('hasimage', '1')
      }

      const response = await axios.get(`${HARVARD_BASE_URL}/object?${params}`)
      const data = response.data

      const artworks = data.records.map((record: HarvardArtwork) =>
        this.transformHarvardArtwork(record)
      )

      return {
        artworks,
        total: data.info.totalrecords,
        hasMore: data.info.page < data.info.pages
      }
    } catch (error) {
      console.error('Error searching Harvard artworks:', error)
      return { artworks: [], total: 0, hasMore: false }
    }
  }

  async getHarvardArtwork(objectId: number): Promise<Artwork | null> {
    try {
      if (!HARVARD_API_KEY) {
        console.warn('Harvard API key not configured')
        return null
      }

      const response = await axios.get(
        `${HARVARD_BASE_URL}/object/${objectId}?apikey=${HARVARD_API_KEY}`
      )
      return this.transformHarvardArtwork(response.data)
    } catch (error) {
      console.error(`Error fetching Harvard artwork ${objectId}:`, error)
      return null
    }
  }

  private transformHarvardArtwork(data: HarvardArtwork): Artwork {
    const primaryArtist = data.people?.find(
      (person) =>
        person.role?.toLowerCase().includes('artist') ||
        person.role?.toLowerCase().includes('maker')
    )

    return {
      id: `harvard-${data.id}`,
      title: data.title || 'Untitled',
      artist:
        primaryArtist?.displayname ||
        data.people?.[0]?.displayname ||
        'Unknown Artist',
      date: data.dated || 'Unknown Date',
      medium: data.medium || 'Unknown Medium',
      dimensions: data.dimensions || 'Unknown Dimensions',
      culture: data.culture || 'Unknown Culture',
      imageUrl: data.primaryimageurl || '',
      thumbnailUrl:
        data.images?.[0]?.thumbnailurl || data.primaryimageurl || '',
      description: data.description || this.generateHarvardDescription(data),
      department: data.department || 'Unknown Department',
      museum: 'harvard',
      objectUrl: data.url || ''
    }
  }

  // Combined search across both museums
  async searchArtworks(
    filters: SearchFilters,
    page: number = 1
  ): Promise<SearchResult> {
    try {
      const [metResults, harvardResults] = await Promise.all([
        this.searchMetArtworks(filters.query, page, filters.hasImage),
        this.searchHarvardArtworks(filters.query, page, filters.hasImage)
      ])

      // Combine and interleave results
      const combinedArtworks: Artwork[] = []
      const maxLength = Math.max(
        metResults.artworks.length,
        harvardResults.artworks.length
      )

      for (let i = 0; i < maxLength; i++) {
        if (i < metResults.artworks.length) {
          combinedArtworks.push(metResults.artworks[i])
        }
        if (i < harvardResults.artworks.length) {
          combinedArtworks.push(harvardResults.artworks[i])
        }
      }

      // Apply filters
      const filteredArtworks = this.applyFilters(combinedArtworks, filters)

      return {
        artworks: filteredArtworks,
        total: metResults.total + harvardResults.total,
        hasMore: metResults.hasMore || harvardResults.hasMore
      }
    } catch (error) {
      console.error('Error in combined search:', error)
      return { artworks: [], total: 0, hasMore: false }
    }
  }

  private applyFilters(artworks: Artwork[], filters: SearchFilters): Artwork[] {
    return artworks.filter((artwork) => {
      if (
        filters.medium &&
        !artwork.medium.toLowerCase().includes(filters.medium.toLowerCase())
      ) {
        return false
      }
      if (
        filters.culture &&
        !artwork.culture.toLowerCase().includes(filters.culture.toLowerCase())
      ) {
        return false
      }
      if (
        filters.department &&
        !artwork.department
          .toLowerCase()
          .includes(filters.department.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }

  private generateDescription(data: MetArtwork): string {
    const parts = []
    if (data.culture) parts.push(`Culture: ${data.culture}`)
    if (data.period) parts.push(`Period: ${data.period}`)
    if (data.dynasty) parts.push(`Dynasty: ${data.dynasty}`)
    if (data.classification)
      parts.push(`Classification: ${data.classification}`)
    if (data.creditLine) parts.push(`Credit: ${data.creditLine}`)
    return parts.join(' | ')
  }

  private generateHarvardDescription(data: HarvardArtwork): string {
    const parts = []
    if (data.classification)
      parts.push(`Classification: ${data.classification}`)
    if (data.technique) parts.push(`Technique: ${data.technique}`)
    if (data.period) parts.push(`Period: ${data.period}`)
    if (data.century) parts.push(`Century: ${data.century}`)
    return parts.join(' | ')
  }
}

export const museumAPI = new MuseumAPIService()
