# Cue MVP Frontend - FastAPI Integration Guide

## Overview
This frontend is now simplified to work with your separate FastAPI backend. All OAuth, database handling, and AWS integrations are removed from the frontend.

## Environment Configuration

Copy `client/.env.example` to `client/.env` and update:
```bash
# Your FastAPI backend URL
VITE_API_BASE_URL=http://localhost:8000

# Optional: Database URL if frontend needs direct access
# VITE_DATABASE_URL=your_aws_database_connection_string

# Optional: Additional API endpoints
# VITE_WORKFLOW_API_URL=http://localhost:8000/api/workflows
# VITE_AUTH_API_URL=http://localhost:8000/api/auth
```

## FastAPI Backend Endpoints Expected

The frontend expects these endpoints from your FastAPI backend:

### Workflow Generation
```
POST /api/workflows/generate
Content-Type: application/json
{
  "description": "User's workflow description"
}

Response:
{
  "workflow_id": "string",
  "nodes": [],
  "edges": [],
  "generated_code": "string",
  "requirements": [],
  "deployment_template": "string"
}
```

### Workflow Management
```
GET /api/workflows          # List workflows
POST /api/workflows         # Save workflow
GET /api/workflows/{id}     # Get specific workflow
PUT /api/workflows/{id}     # Update workflow
DELETE /api/workflows/{id}  # Delete workflow
```

### Credential Validation
```
POST /api/credentials/validate
{
  "service_type": "stripe|sendgrid|aws",
  "credentials": {"api_key": "..."}
}
```

## Database Configuration

If you need database access from the frontend:
- Set `VITE_DATABASE_URL` in your environment
- All database operations should go through your FastAPI backend
- No direct database connections from frontend

## Authentication

Authentication will be handled entirely by your FastAPI backend:
- JWT tokens
- OAuth providers (Google, GitHub)
- Session management
- Protected routes

## File Structure

```
├── client/src/
│   ├── components/     # UI components
│   ├── hooks/         # React hooks (simplified)
│   ├── lib/           # API client for FastAPI
│   ├── pages/         # Application pages
│   ├── services/      # Service layer
│   ├── store/         # Redux state management
│   └── utils/         # Utilities
├── client/.env        # Environment configuration
└── vite.config.ts     # Vite configuration
```

## Removed Components

- All OAuth handling
- Database schemas and migrations
- Express server
- Session management
- JWT token validation
- Example workflow code
- AWS-specific references (except in deployment sections)

## Deployment Options

### Development Deployment

#### Local Development
```bash
npm install
npm run dev
```
Access at: http://localhost:5000

#### Docker Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```
- Port: 5000:5000
- Features: Hot reload, volume mounts for live code changes
- Environment: Development mode with full debugging

### Production Deployment

#### Docker + Nginx Production
```bash
docker-compose up --build
```
- Port: 80:80
- Server: Nginx serving optimized static files
- Features: Gzip compression, security headers, health checks
- Image size: ~50MB (optimized)

#### Manual Docker Commands
```bash
# Development
docker build -f Dockerfile.dev -t cue-frontend-dev .
docker run -p 5000:5000 cue-frontend-dev

# Production
docker build -t cue-frontend .
docker run -p 80:80 cue-frontend
```

### Environment Configuration for Docker

#### Development (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

#### Production (.env.production)
```bash
VITE_API_BASE_URL=https://your-fastapi-backend.com
NODE_ENV=production
```

### Health Monitoring

The production Docker setup includes health checks:
- Endpoint: `/health`
- Returns: `200 OK` with "healthy" status
- Monitoring: Automatic container health checks every 30s

### Container Security

Both Docker configurations implement:
- Non-root user execution
- Alpine Linux base images
- Proper signal handling
- Security headers (production)

For complete Docker deployment documentation, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## Next Steps

1. Set up your FastAPI backend with the expected endpoints
2. Configure environment variables for your deployment method
3. Choose deployment option (local, Docker dev, or Docker production)
4. Test frontend-backend communication
5. Implement authentication in FastAPI
6. Add database configuration in AWS
7. Deploy both services with appropriate container orchestration