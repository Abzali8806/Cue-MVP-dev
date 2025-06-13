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

1. **Configure Environment**
   ```bash
   cp client/.env.example client/.env
   # Edit client/.env with your FastAPI backend URL
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npx vite --host 0.0.0.0 --port 5173
   ```

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