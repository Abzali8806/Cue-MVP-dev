# OAuth 2.0 Authentication Implementation

## Overview
The Cue frontend now includes a complete OAuth 2.0 authentication system supporting Google and GitHub login. This implementation follows security best practices with CSRF protection via state parameters and JWT token management.

## Architecture

### Frontend Components
- **OAuth Initiation**: `src/lib/oauth.ts` - Handles OAuth URL generation with state parameters
- **Callback Handler**: `src/pages/AuthCallback.tsx` - Processes OAuth responses and JWT tokens
- **Authentication Hook**: `src/hooks/useAuth.ts` - Manages authentication state and JWT validation
- **API Client**: `src/lib/queryClient.ts` - Automatically includes JWT tokens in requests
- **Protected Routes**: `src/components/auth/ProtectedRoute.tsx` - Route-level authentication

### Security Features
1. **CSRF Protection**: Cryptographically secure state parameter validation
2. **JWT Token Management**: Automatic token validation and refresh
3. **Secure Storage**: Access tokens stored in localStorage with expiration checks
4. **Automatic Logout**: Invalid tokens trigger automatic logout and redirect

## Configuration

### Environment Variables
```bash
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id
VITE_API_BASE_URL=http://localhost:8000
```

### OAuth Provider Setup
1. **Google OAuth**: Configure redirect URI as `${VITE_API_BASE_URL}/auth/google/callback`
2. **GitHub OAuth**: Configure redirect URI as `${VITE_API_BASE_URL}/auth/github/callback`

## Authentication Flow

1. User clicks OAuth button → Frontend generates state parameter → Redirects to OAuth provider
2. Provider authenticates user → Redirects to backend callback with authorization code
3. Backend exchanges code for tokens → Validates state → Returns JWT to frontend callback route
4. Frontend validates JWT → Stores token → Updates authentication state → Redirects to app

## Backend Requirements

Your FastAPI backend must implement these endpoints:

```python
@app.get("/auth/google/callback")
async def google_callback(code: str, state: str):
    # 1. Validate state parameter
    # 2. Exchange code for Google tokens
    # 3. Get user info from Google API
    # 4. Create/update user in database
    # 5. Generate JWT token
    # 6. Redirect to frontend: /auth/callback?token={jwt}&state={state}

@app.get("/auth/github/callback")
async def github_callback(code: str, state: str):
    # Similar flow for GitHub
    
@app.get("/api/auth/user")
async def get_current_user(token: str = Depends(verify_jwt)):
    # Return current user data from JWT
```

## Usage Examples

### Login Component
```tsx
import { initiateGoogleLogin, initiateGitHubLogin, isOAuthConfigured } from "@/lib/oauth";

const handleGoogleLogin = () => {
  try {
    initiateGoogleLogin();
  } catch (error) {
    setError("Google authentication not configured");
  }
};
```

### Protected Route
```tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

<ProtectedRoute requireAuth={true}>
  <Dashboard />
</ProtectedRoute>
```

### API Requests
```tsx
// JWT tokens are automatically included in all API requests
const response = await apiRequest("GET", "/api/protected-endpoint");
```

## Error Handling

- **Network Errors**: Graceful fallback when backend unavailable
- **Token Expiration**: Automatic logout and redirect to login
- **OAuth Errors**: Clear error messages and retry options
- **CSRF Attempts**: State parameter validation prevents attacks

## Testing Checklist

1. Configure OAuth credentials in environment variables
2. Start FastAPI backend with OAuth endpoints
3. Test Google login flow end-to-end
4. Test GitHub login flow end-to-end
5. Verify JWT tokens in API requests
6. Test automatic logout on token expiration
7. Verify protected routes redirect properly