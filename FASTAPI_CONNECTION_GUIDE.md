# FastAPI Backend Connection Guide

This guide explains how to connect the Cue frontend to your FastAPI backend and what endpoints you need to implement.

## How the Connection Works

The frontend makes HTTP requests to your FastAPI backend using the `fetch()` API. Here's the flow:

```
Frontend (React) ──HTTP requests──> FastAPI Backend ──> Database
                 <──JSON responses──
```

## Configuration

### Frontend Configuration

1. **Set the backend URL** in your environment:
   ```bash
   # Create .env file in project root
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. **Frontend automatically**:
   - Makes all API calls to `VITE_API_BASE_URL`
   - Includes cookies for session-based authentication
   - Handles CORS requests
   - Manages error states and loading

### FastAPI Configuration

Your FastAPI backend needs these middleware configurations:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

# CORS - Allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # Your frontend URL
    allow_credentials=True,  # Required for session cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware for authentication
app.add_middleware(
    SessionMiddleware, 
    secret_key="your-secret-key-here"
)
```

## Required API Endpoints

You need to implement these endpoints in your FastAPI backend:

### 1. Authentication Endpoints

#### OAuth Login Redirects
```python
@app.get("/auth/google")
async def google_oauth_login():
    """Redirect user to Google OAuth"""
    # Redirect to Google OAuth with your client_id
    google_auth_url = f"https://accounts.google.com/o/oauth2/auth?client_id={GOOGLE_CLIENT_ID}&redirect_uri={CALLBACK_URL}&scope=openid email profile&response_type=code"
    return RedirectResponse(google_auth_url)

@app.get("/auth/github")
async def github_oauth_login():
    """Redirect user to GitHub OAuth"""
    # Redirect to GitHub OAuth with your client_id
    github_auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={CALLBACK_URL}&scope=user:email"
    return RedirectResponse(github_auth_url)
```

#### OAuth Callback Handler
```python
@app.get("/auth/callback")
async def oauth_callback(request: Request, code: str, state: str = None):
    """Handle OAuth callback from Google/GitHub"""
    # 1. Exchange code for access token
    # 2. Get user info from OAuth provider
    # 3. Create/update user in your database
    # 4. Store user in session
    # 5. Redirect back to frontend
    
    # Example implementation:
    user_data = await exchange_code_for_user_data(code)
    user = await create_or_update_user(user_data)
    request.session["user"] = {
        "id": user.id,
        "email": user.email,
        "firstName": user.first_name,
        # ... other user fields
    }
    
    # Redirect back to frontend with success
    return RedirectResponse("http://localhost:5000/?success=true")
```

#### Get Current User
```python
@app.get("/api/auth/user")
async def get_current_user(request: Request):
    """Return current authenticated user"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Return user data that frontend expects
    return {
        "id": user["id"],
        "email": user["email"],
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "profileImageUrl": user.get("profileImageUrl"),
        "companyName": user.get("companyName"),
        "industry": user.get("industry"),
        "role": user.get("role"),
        "usagePurpose": user.get("usagePurpose"),
        "createdAt": user["createdAt"],
        "updatedAt": user["updatedAt"]
    }
```

#### Logout
```python
@app.post("/api/auth/logout")
async def logout(request: Request):
    """Clear user session"""
    request.session.clear()
    return {"message": "Logged out successfully"}
```

### 2. User Profile Endpoints

#### Update Profile
```python
@app.put("/api/auth/profile")
async def update_profile(request: Request, profile_data: dict):
    """Update user profile"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Update user in database
    updated_user = await update_user_profile(user["id"], profile_data)
    
    # Update session
    request.session["user"] = updated_user
    
    return updated_user
```

### 3. Workflow Endpoints (Optional)

These are called when users interact with workflows:

```python
@app.get("/api/workflows")
async def list_workflows(request: Request):
    """Get user's workflows"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    workflows = await get_user_workflows(user["id"])
    return workflows

@app.post("/api/workflows")
async def create_workflow(request: Request, workflow_data: dict):
    """Create new workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    workflow = await create_user_workflow(user["id"], workflow_data)
    return workflow

@app.post("/api/workflows/generate")
async def generate_workflow(description: dict):
    """Generate workflow from natural language description"""
    # This endpoint can be public or require auth
    # Implement your AI workflow generation logic here
    return {
        "nodes": [],
        "edges": [],
        "code": "# Generated code here",
        "requirements": []
    }
```

## Step-by-Step Connection Process

### Step 1: Start Your FastAPI Backend

```python
# main.py
import uvicorn
from fastapi import FastAPI

app = FastAPI()

# Add all the middleware and endpoints from above

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

```bash
# Run your FastAPI server
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Configure Frontend Environment

```bash
# In your frontend project root, create .env file:
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

### Step 3: Start Frontend

```bash
npm run dev
```

### Step 4: Test the Connection

1. **Visit frontend**: http://localhost:5000
2. **Click "Login with Google"** - should redirect to: http://localhost:8000/auth/google
3. **Complete OAuth flow** - should redirect back to frontend
4. **Check browser network tab** - should see successful API calls to your FastAPI backend

## How Frontend Makes API Calls

The frontend uses this pattern for all API requests:

```javascript
// Example: Frontend making a request to your FastAPI backend
const API_BASE_URL = "http://localhost:8000";  // From VITE_API_BASE_URL

const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
  method: 'GET',
  credentials: 'include',  // Sends session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

if (response.ok) {
  const user = await response.json();
  // Use user data in frontend
} else if (response.status === 401) {
  // Handle not authenticated
} else {
  // Handle other errors
}
```

## Authentication Flow Detail

1. **User clicks "Login with Google"** in frontend
2. **Frontend redirects** to `http://localhost:8000/auth/google`
3. **Your FastAPI** redirects to Google OAuth
4. **User completes** Google OAuth
5. **Google redirects** back to your FastAPI callback
6. **Your FastAPI** exchanges code for user data, stores in session
7. **Your FastAPI** redirects back to frontend with success
8. **Frontend** automatically checks auth status
9. **Frontend** makes request to `/api/auth/user`
10. **Your FastAPI** returns user data from session

## Error Handling

Your FastAPI should return appropriate HTTP status codes:

- **200**: Success
- **401**: Not authenticated (frontend will show login)
- **403**: Forbidden (user lacks permission)
- **404**: Resource not found
- **422**: Validation error
- **500**: Server error

The frontend automatically handles these status codes and shows appropriate UI states.

## Database Integration

Your FastAPI backend handles all database operations. The frontend never connects to the database directly:

```python
# Your FastAPI handles database operations
async def create_or_update_user(oauth_data):
    # Check if user exists
    user = await db.get_user_by_email(oauth_data["email"])
    
    if user:
        # Update existing user
        user = await db.update_user(user.id, oauth_data)
    else:
        # Create new user
        user = await db.create_user(oauth_data)
    
    return user
```

## Testing Your Integration

### 1. Test Authentication
- Try logging in with Google/GitHub
- Check that user data appears correctly
- Test logout functionality

### 2. Test API Endpoints
- Use browser dev tools to see network requests
- Verify requests go to your FastAPI backend
- Check response formats match expected structure

### 3. Test Error Handling
- Stop your FastAPI server - frontend should handle gracefully
- Return 401 from `/api/auth/user` - frontend should show login
- Return 500 from any endpoint - frontend should show error

## Common Issues

### CORS Errors
```python
# Make sure you have this in your FastAPI:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,  # This is crucial for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Session Issues
```python
# Make sure you have session middleware:
app.add_middleware(SessionMiddleware, secret_key="your-secret-key")

# And that you're setting sessions correctly:
request.session["user"] = user_data
```

### Environment Variables
```bash
# Make sure your .env file exists and has:
VITE_API_BASE_URL=http://localhost:8000
```

That's it! Once you implement these endpoints in your FastAPI backend, the frontend will connect automatically and all features will work.