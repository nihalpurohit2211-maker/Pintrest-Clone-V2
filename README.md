# Pinterest Clone

A high-performance, responsive image gallery web application inspired by Pinterest. Built with React, this project features a masonry layout, live search streaming, progressive image loading, and a personalized saved pins collection.

## Features

- **Masonry Layout:** Responsive grid layout using CSS columns, perfectly adapting to desktop, tablet, and mobile screens.
- **Live Search Streaming:** Real-time search that streams results dynamically as they are found across multiple local data sources, without waiting for the entire dataset to load.
- **High-Performance Image Loading:** 
  - Uses native `loading="lazy"` for deferred off-screen image rendering.
  - Loads highly optimized, low-resolution thumbnails initially to minimize bandwidth and maximize speed.
- **InfoMatrix Modal Card:** Pinterest-style detail view featuring:
  - Progressive "blur-up" loading for full-resolution images.
  - Display of key metadata (Photo ID, dimensions, aspect ratio).
  - Categorized tag chips.
- **Saved Pins Collection:** Users can save their favorite pins. The saved collection is persisted locally via the browser's `localStorage` and can be managed seamlessly in a dedicated "Saved" tab.
- **Infinite Scrolling:** Automatically loads more images in batches as the user scrolls down the feed.
- **Skeleton Loaders:** Smooth pulse animations displayed while initial data or search results are being fetched.

## Tech Stack

- **Frontend:** React.js (JSX)
- **Styling:** Custom Vanilla CSS (CSS Columns, Flexbox, Animations)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Data & Storage:** Local Storage API, JSON APIs (`fetch`)

## Getting Started

### Prerequisites
- Node.js installed on your local development environment.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pinterest-clone.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pinterest-clone
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *(Note: Use `npm start` if this project was initialized with Create React App).*

## Project Structure
```text
src/
├── components/
│   ├── Pin.jsx            # Individual image card component
│   ├── Pin.css            # Styles for the pin and hover overlay
│   ├── InfoMatrixCard.jsx # High-res modal with metadata
│   └── InfoMatrixCard.css # Modal layout and blur-up animations
├── public/data/           # Directory containing photos1.json to photos50.json
├── App.jsx                # Main application component & tab navigation logic
├── Gallery.css            # Masonry grid layout styles
├── Navbar.css             # Sidebar and top navigation styles
├── main.jsx               # React DOM entry point
└── search.js              # Live streaming search & saved pins retrieval logic
```

## Author
**Nihal Purohit**

## License
This project is licensed under the MIT License.
