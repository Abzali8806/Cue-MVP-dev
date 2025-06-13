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

## Next Steps

1. Set up your FastAPI backend with the expected endpoints
2. Configure environment variables
3. Test frontend-backend communication
4. Implement authentication in FastAPI
5. Add database configuration in AWS
6. Deploy both services separately