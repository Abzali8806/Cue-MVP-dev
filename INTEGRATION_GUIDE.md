# Cue Frontend - FastAPI Backend Integration Guide

This guide provides complete instructions for integrating the Cue React frontend with a FastAPI backend, including Google and GitHub OAuth authentication.

## Frontend Architecture Overview

The frontend is built with:
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** with shadcn/ui components
- **Session-based authentication** ready for FastAPI integration

## Environment Configuration

Create a `.env` file in your project root:

```env
# FastAPI Backend URL
VITE_API_BASE_URL=http://localhost:8000

# Optional: For development
NODE_ENV=development
```

## Frontend Configuration

The frontend is now configured to:
- Make all API calls to your FastAPI backend via `VITE_API_BASE_URL`
- Use session-based authentication (cookies)
- Handle OAuth redirects through FastAPI endpoints
- No direct database connections

## Required FastAPI Endpoints

### Authentication Endpoints

```python
from fastapi import FastAPI, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key="your-secret-key")

@app.get("/auth/google")
async def google_oauth_login():
    """Redirect to Google OAuth"""
    # Implement Google OAuth redirect
    pass

@app.get("/auth/github") 
async def github_oauth_login():
    """Redirect to GitHub OAuth"""
    # Implement GitHub OAuth redirect
    pass

@app.get("/auth/callback")
async def oauth_callback(request: Request, code: str, state: str = None):
    """Handle OAuth callback and create session"""
    # Process OAuth code
    # Create/update user in database
    # Store user in session: request.session["user"] = user_data
    # Redirect to frontend: return RedirectResponse("http://localhost:5000/?success=true")
    pass

@app.get("/api/auth/user")
async def get_current_user(request: Request):
    """Get current authenticated user"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@app.post("/api/auth/logout")
async def logout(request: Request):
    """Logout current user"""
    request.session.clear()
    return {"message": "Logged out successfully"}
```

### User Model Structure

The frontend expects users to have this structure:

```python
# Expected user response format from /api/auth/user:
{
    "id": "string",
    "email": "string | null",
    "firstName": "string | null", 
    "lastName": "string | null",
    "profileImageUrl": "string | null",
    "companyName": "string | null",
    "industry": "string | null", 
    "role": "string | null",
    "usagePurpose": "string | null",
    "createdAt": "string",  # ISO format
    "updatedAt": "string"   # ISO format
```

### Workflow Endpoints

```python
# Workflow management endpoints your FastAPI backend should implement:

@app.get("/api/workflows")
async def list_workflows(request: Request):
    """Get user's workflows"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Return user's workflows
    pass

@app.post("/api/workflows")
async def create_workflow(request: Request, workflow_data: dict):
    """Create new workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Create workflow for user
    pass

@app.get("/api/workflows/{workflow_id}")
async def get_workflow(request: Request, workflow_id: str):
    """Get specific workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Return specific workflow
    pass

@app.put("/api/workflows/{workflow_id}")
async def update_workflow(request: Request, workflow_id: str, workflow_data: dict):
    """Update workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Update workflow
    pass

@app.delete("/api/workflows/{workflow_id}")
async def delete_workflow(request: Request, workflow_id: str):
    """Delete workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Delete workflow
    pass

@app.post("/api/workflows/generate")
async def generate_workflow(request: Request, description: dict):
    """Generate workflow from description"""
    # This can be public or require auth based on your needs
    # Generate workflow using AI/rules
    pass
```

## Running the Application

### Development Mode

1. **Start your FastAPI backend** on port 8000 (or configure `VITE_API_BASE_URL`)
2. **Start the frontend**:
   ```bash
   npm run dev
   ```

The frontend will:
- Run on port 5000 by default
- Make all API calls to your FastAPI backend
- Handle OAuth redirects through FastAPI
- Use session-based authentication

### Docker Development

```bash
# Run frontend only (connects to external FastAPI)
docker compose -f docker-compose.dev.yml up --build
```

The Docker setup:
- Runs frontend on port 5001 (maps to container port 5000)
- All API calls go to FastAPI backend via environment variables
- No database connections from frontend

## Testing Integration

### 1. Test Authentication Flow

1. Navigate to frontend: `http://localhost:5000`
2. Click "Login with Google" or "Login with GitHub"
3. Should redirect to: `http://localhost:8000/auth/google` or `/auth/github`
4. After OAuth, FastAPI should redirect back with success parameter
5. Frontend should show authenticated state

### 2. Test API Calls

All frontend API calls will go to `VITE_API_BASE_URL`:
- User auth: `GET /api/auth/user`
- Workflows: `GET /api/workflows`
- Profile updates: `PUT /api/auth/profile`

### 3. Test Error Handling

Frontend includes proper error handling for:
- 401 Unauthorized responses
- Network errors
- Session expiration

## Frontend Pages Available

- **/** - Workflow builder (accessible without auth)
- **/login** - Login page with OAuth buttons
- **/registration** - Registration/profile completion
- **/profile** - User profile management (requires auth)
- **/history** - Workflow history (requires auth)
- **/settings** - App settings (requires auth)
- **/privacy** - Privacy policy
- **/terms** - Terms of service
- **/support** - Support information

## Key Frontend Features

- **Mobile-responsive** design with dropdown navigation
- **Dark/light mode** toggle
- **Voice input** for workflow descriptions
- **Real-time workflow generation** 
- **Credential management** for service integrations
- **Workflow visualization** with React Flow
- **Code generation and preview**
- **Session-based authentication** (no tokens stored locally)

## Development Notes

- Frontend serves static files only - no backend logic
- All database operations handled by your FastAPI backend
- Uses cookies for session management
- CORS configured for cross-origin requests
- Health check endpoint at `/health`

## Additional Workflow Endpoints Your FastAPI Should Implement

```python
@app.get("/api/workflows")
async def list_workflows():
    """Get user's workflows"""
    pass

@app.post("/api/workflows")
async def create_workflow():
    """Create new workflow"""
    pass

@app.get("/api/workflows/{workflow_id}")
async def get_workflow(workflow_id: str):
    """Get specific workflow"""
    pass

@app.put("/api/workflows/{workflow_id}")
async def update_workflow(workflow_id: str):
    """Update workflow"""
    pass

@app.delete("/api/workflows/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """Delete workflow"""
    pass
```

## Environment Variables

### Frontend (.env)
```bash
# Required for OAuth
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Backend
```bash
# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# Database
DATABASE_URL=your_database_url

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:5173
```

## OAuth Setup Instructions

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:8000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL:
   - `http://localhost:8000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

## Authentication Flow

1. **Login Initiation**: User clicks Google/GitHub login button
2. **OAuth Redirect**: Frontend redirects to `/auth/google` or `/auth/github`
3. **Provider Authentication**: Backend handles OAuth flow with provider
4. **Callback Processing**: Provider redirects to `/auth/callback` with code
5. **Token Generation**: Backend creates JWT token and redirects to frontend
6. **Token Storage**: Frontend stores token in localStorage
7. **API Authentication**: All API requests include `Authorization: Bearer {token}`

## Frontend Authentication Integration

### Current Implementation

The frontend includes:

- `useAuth()` hook for authentication state management
- Automatic token handling in API requests
- OAuth callback processing
- Session persistence across page reloads
- Logout functionality with token cleanup

### API Request Authentication

All API requests automatically include authentication headers:

```typescript
// Automatic token inclusion in requests
const response = await apiRequest('/api/workflows', {
  method: 'GET'
});
```

### Protected Routes

To add route protection, wrap components with authentication checks:

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
}
```

## CORS Configuration

Configure your FastAPI backend for CORS:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Development Setup

1. **Start Backend**: Ensure FastAPI server runs on `http://localhost:8000`
2. **Configure OAuth**: Set up Google/GitHub OAuth applications
3. **Environment Variables**: Configure both frontend and backend `.env` files
4. **Database**: Set up user and workflow tables
5. **Test Authentication**: Verify OAuth flow works end-to-end

## Production Deployment

### Frontend
- Build: `npm run build`
- Deploy static files to CDN/hosting service
- Update environment variables for production URLs

### Backend
- Deploy FastAPI application
- Configure production database
- Set production OAuth redirect URLs
- Update CORS settings for production frontend URL

## Security Considerations

- Store JWT tokens securely (httpOnly cookies recommended for production)
- Implement token refresh mechanism
- Use HTTPS in production
- Validate JWT tokens on all protected endpoints
- Implement rate limiting
- Sanitize user inputs

## Testing Integration

To test the integration:

1. Start both frontend and backend servers
2. Navigate to `/login` in the frontend
3. Click Google or GitHub login
4. Verify OAuth redirect and callback flow
5. Check that user data is returned from `/api/auth/me`
6. Test protected API endpoints
7. Verify logout functionality

## Troubleshooting

### Common Issues

- **CORS errors**: Check CORS middleware configuration
- **OAuth redirect mismatch**: Verify redirect URLs in OAuth app settings
- **Token validation fails**: Check JWT secret and algorithm configuration
- **API requests fail**: Verify `VITE_API_BASE_URL` environment variable

### Debug Mode

Enable debug logging in development:

```typescript
// Frontend - check browser console for authentication logs
// Backend - enable FastAPI debug mode for detailed error messages
```

This integration guide provides everything needed to connect the Cue frontend with a FastAPI backend. The frontend is fully prepared for OAuth authentication and API integration.