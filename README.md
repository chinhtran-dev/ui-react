# ThingsBoard React UI

React-based frontend for ThingsBoard Dashboard and Widget Management System.

## Phase 1: Foundation ✅

This phase includes:
- ✅ React project setup with TypeScript
- ✅ Routing and authentication
- ✅ API layer with React Query
- ✅ Base components (Layout, Toolbar)
- ✅ State management with Redux Toolkit

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_API_BASE_URL=/api
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/          # Authentication components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
│   └── api/          # API client and endpoints
├── store/             # Redux store
│   └── slices/       # Redux slices
└── types/             # TypeScript type definitions
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Redux Toolkit** - State management
- **React Query** - Data fetching and caching
- **Material-UI** - UI components
- **Axios** - HTTP client

## Next Steps

- Phase 2: Widget Bundle Management
- Phase 3: Widget System Core
- Phase 4: Dashboard Grid
- Phase 5: Widget Rendering
- Phase 6: Dashboard Features
- Phase 7: Widget Editor
- Phase 8: Testing & Optimization
