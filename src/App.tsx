import { useState } from 'react'
import { SearchView } from './components/SearchView.tsx'
import { ExhibitionsView } from './components/ExhibitionsView.tsx'
import { ArtworkDetailView } from './components/ArtworkDetailView.tsx'
import { Navigation } from './components/Navigation.tsx'
import type { Artwork } from './types'

type View = 'search' | 'exhibitions' | 'artwork-detail'

function App() {
  const [currentView, setCurrentView] = useState<View>('search')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  const handleViewArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    setCurrentView('artwork-detail')
  }

  const handleBackToSearch = () => {
    setCurrentView('search')
    setSelectedArtwork(null)
  }

  const handleNavigate = (view: View) => {
    setCurrentView(view)
    setSelectedArtwork(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />

      <main className="container mx-auto px-4 py-8">
        {currentView === 'search' && (
          <SearchView onViewArtwork={handleViewArtwork} />
        )}

        {currentView === 'exhibitions' && (
          <ExhibitionsView onViewArtwork={handleViewArtwork} />
        )}

        {currentView === 'artwork-detail' && selectedArtwork && (
          <ArtworkDetailView
            artwork={selectedArtwork}
            onBack={handleBackToSearch}
          />
        )}
      </main>
    </div>
  )
}

export default App
