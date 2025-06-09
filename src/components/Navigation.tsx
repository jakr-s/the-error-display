import { Search, BookOpen, Palette } from 'lucide-react'

type View = 'search' | 'exhibitions' | 'artwork-detail'

interface NavigationProps {
  currentView: View
  onNavigate: (view: View) => void
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    {
      id: 'search' as const,
      label: 'Search Artworks',
      icon: Search,
      ariaLabel: 'Search artworks across museum collections'
    },
    {
      id: 'exhibitions' as const,
      label: 'My Exhibitions',
      icon: BookOpen,
      ariaLabel: 'View and manage your personal exhibitions'
    }
  ]

  return (
    <nav
      className="bg-white shadow-sm border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-primary-600" aria-hidden="true" />
            <h1 className="text-xl font-bold text-gray-900">
              The Error Display
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
