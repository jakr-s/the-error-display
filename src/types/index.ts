// Types for artworks and museum data
export interface Artwork {
  id: string
  title: string
  artist: string
  date: string
  medium: string
  dimensions: string
  culture: string
  imageUrl: string
  thumbnailUrl: string
  description: string
  department: string
  museum: 'met' | 'harvard'
  objectUrl: string
}

export interface MetArtwork {
  objectID: number
  isHighlight: boolean
  accessionNumber: string
  isPublicAccess: boolean
  primaryImage: string
  primaryImageSmall: string
  additionalImages: string[]
  constituents: Array<{
    constituentID: number
    role: string
    name: string
    constituentULAN_URL: string
    constituentWikidata_URL: string
    gender: string
  }> | null
  department: string
  objectName: string
  title: string
  culture: string
  period: string
  dynasty: string
  reign: string
  portfolio: string
  artistRole: string
  artistPrefix: string
  artistDisplayName: string
  artistDisplayBio: string
  artistSuffix: string
  artistAlphaSort: string
  artistNationality: string
  artistBeginDate: string
  artistEndDate: string
  artistGender: string
  artistWikidata_URL: string
  artistULAN_URL: string
  objectDate: string
  objectBeginDate: number
  objectEndDate: number
  medium: string
  dimensions: string
  measurements: Array<{
    elementName: string
    elementDescription: string
    elementMeasurements: {
      Height: number
      Width: number
    }
  }> | null
  creditLine: string
  geographyType: string
  city: string
  state: string
  county: string
  country: string
  region: string
  subregion: string
  locale: string
  locus: string
  excavation: string
  river: string
  classification: string
  rightsAndReproduction: string
  linkResource: string
  metadataDate: string
  repository: string
  objectURL: string
  tags: Array<{
    term: string
    AAT_URL: string
    Wikidata_URL: string
  }> | null
}

export interface HarvardArtwork {
  id: number
  objectid: number
  objectnumber: string
  title: string
  dated: string
  datebegin: number
  dateend: number
  classification: string
  medium: string
  dimensions: string
  people: Array<{
    role: string
    name: string
    personid: number
    displayname: string
    prefix: string
    suffix: string
    displaydate: string
    culture: string
    gender: string
  }> | null
  culture: string
  period: string
  century: string
  technique: string
  department: string
  division: string
  contact: string
  creditline: string
  images: Array<{
    imageid: number
    iiifbaseuri: string
    baseimageurl: string
    thumbnailurl: string
    width: number
    height: number
    idsid: number
    copyright: string
    iiifimageuri: string
  }> | null
  primaryimageurl: string
  colors: Array<{
    color: string
    spectrum: string
    hue: string
    percent: number
    css3: string
  }> | null
  description: string
  provenance: string
  commentary: string
  url: string
}

export interface SearchFilters {
  query: string
  medium: string
  culture: string
  department: string
  hasImage: boolean
  dateRange: {
    start: number
    end: number
  }
}

export interface SearchResult {
  artworks: Artwork[]
  total: number
  hasMore: boolean
}

export interface Exhibition {
  id: string
  name: string
  description: string
  artworks: Artwork[]
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  totalItems: number
}
