# Docker Deployment Guide

This guide covers both development and production deployment scenarios for the Cue MVP Frontend application using Docker.

## Overview

The application provides two Docker configurations:
- **Development**: Runs Vite dev server with hot reload
- **Production**: Serves static files via optimized Nginx setup

## Files Structure

```
├── Dockerfile              # Production build (Nginx)
├── Dockerfile.dev          # Development build (Vite dev server)
├── docker-compose.yml      # Production deployment
├── docker-compose.dev.yml  # Development deployment
├── nginx.conf              # Nginx configuration for production
└── .dockerignore           # Files to exclude from build context
```

## Development Deployment

### Quick Start
```bash
# Build and run development environment
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up --build -d
```

### Development Configuration
- **Port**: `5000:5000` (matches current Replit setup)
- **Server**: Vite dev server with Express proxy
- **Features**: 
  - Hot module replacement
  - Live code changes via volume mounts
  - Full development tooling
- **Access**: http://localhost:5000

### Development Environment Variables
```yaml
environment:
  - NODE_ENV=development
```

### Volume Mounts
The development setup includes volume mounts for live code editing:
```yaml
volumes:
  - ./client:/app/client      # Frontend code
  - ./server:/app/server      # Server code
  - /app/node_modules         # Preserve node_modules
```

## Production Deployment

### Quick Start
```bash
# Build and run production environment
docker-compose up --build

# Run in background
docker-compose up --build -d
```

### Production Configuration
- **Port**: `80:80` (standard web server port)
- **Server**: Nginx serving static files
- **Features**:
  - Optimized static file serving
  - Gzip compression
  - Security headers
  - Client-side routing support (SPA)
  - Health check endpoint
- **Access**: http://localhost

### Production Environment Variables
```yaml
environment:
  - NODE_ENV=production
```

## Manual Docker Commands

### Development
```bash
# Build development image
docker build -f Dockerfile.dev -t cue-frontend-dev .

# Run development container
docker run -p 5000:5000 \
  -v $(pwd)/client:/app/client \
  -v $(pwd)/server:/app/server \
  -v /app/node_modules \
  cue-frontend-dev
```

### Production
```bash
# Build production image
docker build -t cue-frontend .

# Run production container
docker run -p 80:80 cue-frontend
```

## Nginx Configuration

The production deployment uses a custom Nginx configuration (`nginx.conf`) that provides:

### Performance Optimizations
- Gzip compression for text files
- Static asset caching (1 year)
- Optimized worker processes

### Security Features
- Security headers (XSS, CSRF protection)
- Hidden file access denial
- Content Security Policy

### SPA Support
- Client-side routing support via `try_files`
- Fallback to `index.html` for unknown routes

### Health Check
- `/health` endpoint for container monitoring
- Returns `200 OK` with "healthy" status

## Container Management

### Stop Services
```bash
# Development
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose down
```

### View Logs
```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose logs -f
```

### Restart Services
```bash
# Development
docker-compose -f docker-compose.dev.yml restart

# Production
docker-compose restart
```

## Health Checks

### Development
The development setup relies on the application's built-in health monitoring.

### Production
Nginx provides a dedicated health check endpoint:
```bash
# Check health
curl http://localhost/health

# Expected response
healthy
```

### Docker Health Check
The production container includes automated health monitoring:
```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 20s
```

## Troubleshooting

### Port Conflicts
If ports are already in use:

**Development (port 5000):**
```bash
# Use different port
docker run -p 3000:5000 cue-frontend-dev
```

**Production (port 80):**
```bash
# Use different port
docker run -p 8080:80 cue-frontend
```

### Build Issues
```bash
# Clean build (no cache)
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build
```

### Volume Mount Issues (Development)
```bash
# Reset volumes
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

## Performance Considerations

### Development
- Larger image size due to development dependencies
- Slower startup due to compilation
- Higher memory usage

### Production
- Minimal image size (~50MB)
- Fast startup (static files)
- Low memory footprint
- Optimized for high traffic

## Security Best Practices

Both configurations implement security hardening:
- Non-root user execution
- Minimal base images (Alpine Linux)
- Proper signal handling with dumb-init
- Security headers in production
- Denied access to sensitive files

## Environment-Specific Notes

### Development Environment
- Code changes reflect immediately via volume mounts
- Full debugging capabilities
- Source maps available
- Development tools included

### Production Environment
- Static files only
- No source code exposure
- Optimized build output
- Production-ready caching headers

## Migration from Current Setup

### From Replit Development
The development Docker setup mirrors your current Replit environment:
- Same port (5000)
- Same server setup (Vite + Express)
- Live reload functionality

### To Production
When ready for production deployment:
1. Use the production Docker configuration
2. Build optimized static files
3. Serve via Nginx on port 80
4. Implement proper health monitoring

## Next Steps

1. **Development**: Use `docker-compose.dev.yml` for local development
2. **Testing**: Validate both development and production builds
3. **CI/CD**: Integrate Docker builds into your deployment pipeline
4. **Monitoring**: Implement log aggregation and monitoring solutions
5. **Scaling**: Consider container orchestration (Kubernetes, Docker Swarm) for production scaling