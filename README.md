# Exhibition Curator

A comprehensive digital platform for discovering, curating, and managing personal art exhibitions using APIs from the [Harvard Art Museums](https://harvardartmuseums.org) and the [Metripolitan Museum of Art](https://www.metmuseum.org).

## 🎨 Features

### Core Functionality

- **Multi-Museum Search**: Browse artworks from Metropolitan Museum of Art and Harvard Art Museums
- **Advanced Filtering**: Filter by medium, culture, department, date range, and image availability
- **Pagination**: Navigate through search results with Previous/Next controls
- **Detailed Views**: Explore high-resolution artwork images and comprehensive metadata
- **Personal Collections**: Create and manage custom exhibitions with your favorite artworks

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Real-time Search**: Instant search results with loading states and error handling
- **Persistent Storage**: Your exhibitions are saved locally and persist between sessions

## 🌐 Deployment

The application is deployed on GitHub Pages and can be accessed at:

**🔗 [The Error Display - Live Demo](https://jakr-s.github.io/the-error-display/)**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jakr-s/the-error-display
   cd the-error-display
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your Harvard Art Museums API key to `.env`:

   ```
   VITE_HARVARD_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Storage**: Local Storage API

## 🎯 API Integration

### Metropolitan Museum of Art

- **Endpoint**: `https://collectionapi.metmuseum.org/public/collection/v1/`
- **Authentication**: None required
- **Features**: Search, object details, high-resolution images

### Harvard Art Museums

- **Endpoint**: `https://api.harvardartmuseums.org/RESOURCE_TYPE?apikey=YOUR_API_KEY`
- **Authentication**: API key required
- **Features**: Advanced search, detailed metadata, multiple collections

## 🎨 Usage Guide

### Searching for Artworks

1. Use the search bar to find artworks by title, artist, or keywords
2. Apply filters to narrow down results:
   - **Medium**: Painting, sculpture, photography, etc.
   - **Culture**: Geographic or cultural origin
   - **Department**: Museum department or collection
   - **Date Range**: Creation period
   - **Has Image**: Show only artworks with available images

### Creating Exhibitions

1. Click "My Exhibitions" in the navigation
2. Click "Create New Exhibition"
3. Enter exhibition title and description
4. Start adding artworks from search results

### Managing Collections

- **Add Artworks**: Click the "+" button on artwork cards
- **Remove Artworks**: Use the "×" button in exhibition view
- **Edit Exhibitions**: Modify title and description anytime
- **Delete Exhibitions**: Remove entire collections

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

| Variable               | Description                 | Required |
| ---------------------- | --------------------------- | -------- |
| `VITE_HARVARD_API_KEY` | Harvard Art Museums API key | Yes      |

### API Rate Limits

- **Metropolitan Museum**: No documented limits
- **Harvard Art Museums**: 2,500 requests per day

## 🚧 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

```

```
