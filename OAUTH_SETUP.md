# OAuth Setup Instructions

## Current Status
The frontend is configured to work with your FastAPI backend for OAuth authentication. The OAuth buttons currently show placeholder behavior until your backend is configured.

## To Enable OAuth Authentication

### 1. FastAPI Backend Setup
Configure these endpoints in your FastAPI backend:
- `GET /auth/google` - Initiates Google OAuth flow
- `GET /auth/github` - Initiates GitHub OAuth flow
- `GET /auth/callback` - Handles OAuth callbacks
- `GET /api/auth/user` - Returns current user data

### 2. Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 3. GitHub OAuth Configuration
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:8000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 4. Frontend Configuration
Create `client/.env` with your credentials:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### 5. Enable Authentication
In `client/src/hooks/useAuth.ts`, change:
```typescript
enabled: false, // Change to true
```

## Error Handling
The frontend includes proper error handling for:
- Network connectivity issues
- Invalid OAuth responses
- Session expiration
- Backend unavailability