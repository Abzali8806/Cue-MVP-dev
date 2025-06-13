# Cue MVP Frontend

Standalone React frontend for the Cue workflow automation platform. This frontend connects to a separate FastAPI backend for authentication, workflow generation, and data persistence.

## Features

- Natural language workflow description input with speech-to-text
- Visual workflow builder with node-based interface
- Code preview and download capabilities
- Credential management interface
- Responsive design with dark/light mode
- Integration-ready for FastAPI backend

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:5000

### Docker Development

1. **Run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```
   Access at: http://localhost:5000

### Docker Production

1. **Deploy with Nginx**
   ```bash
   docker-compose up --build
   ```
   Access at: http://localhost

## Backend Integration

This frontend expects a FastAPI backend with these endpoints:
- `POST /api/workflows/generate` - Generate workflow from description
- `GET /api/workflows` - List workflows
- `POST /api/credentials/validate` - Validate service credentials

See `INTEGRATION_GUIDE.md` for complete API specification.

## Technology Stack

- React + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for API state management
- Redux Toolkit for application state
- Wouter for routing

## Deployment Options

### Development
- **Local**: Vite dev server with hot reload
- **Docker**: Containerized development environment
- **Port**: 5000

### Production
- **Docker + Nginx**: Optimized static file serving
- **Port**: 80
- **Features**: Gzip compression, security headers, health checks

For detailed deployment instructions, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Redux store and slices
│   │   └── services/       # API service layers
├── server/                 # Express proxy server
├── Dockerfile              # Production build (Nginx)
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Production deployment
├── docker-compose.dev.yml  # Development deployment
└── nginx.conf              # Nginx configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking