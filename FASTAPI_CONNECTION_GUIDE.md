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
    try:
        # Determine OAuth provider from state or session
        provider = request.session.get("oauth_provider", "google")
        
        # Exchange authorization code for access token
        if provider == "google":
            token_data = await exchange_google_code_for_token(code)
            user_info = await get_google_user_info(token_data["access_token"])
        elif provider == "github":
            token_data = await exchange_github_code_for_token(code)
            user_info = await get_github_user_info(token_data["access_token"])
        else:
            raise HTTPException(status_code=400, detail="Invalid OAuth provider")
        
        # Create or update user in database
        user_data = {
            "email": user_info.get("email"),
            "first_name": user_info.get("given_name") or user_info.get("name", "").split()[0],
            "last_name": user_info.get("family_name") or " ".join(user_info.get("name", "").split()[1:]),
            "profile_image_url": user_info.get("picture") or user_info.get("avatar_url"),
            "oauth_provider": provider,
            "oauth_id": str(user_info.get("sub") or user_info.get("id"))
        }
        
        user = await create_or_update_user_from_oauth(user_data)
        
        # Store user in session
        request.session["user"] = {
            "id": user.id,
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "profileImageUrl": user.profile_image_url,
            "companyName": user.company_name,
            "industry": user.industry,
            "role": user.role,
            "usagePurpose": user.usage_purpose,
            "createdAt": user.created_at.isoformat(),
            "updatedAt": user.updated_at.isoformat()
        }
        
        # Clear OAuth provider from session
        request.session.pop("oauth_provider", None)
        
        # Redirect back to frontend with success
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5000")
        return RedirectResponse(f"{frontend_url}/?success=true")
        
    except Exception as e:
        # Log error and redirect with error
        print(f"OAuth callback error: {str(e)}")
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5000")
        return RedirectResponse(f"{frontend_url}/?error=oauth_failed")
```

#### Get Current User
```python
@app.get("/api/auth/user")
async def get_current_user(request: Request):
    """Return current authenticated user"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Fetch latest user data from database
    try:
        db_user = await get_user_from_database(user["id"])
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Return user data that frontend expects
        return {
            "id": db_user.id,
            "email": db_user.email,
            "firstName": db_user.first_name,
            "lastName": db_user.last_name,
            "profileImageUrl": db_user.profile_image_url,
            "companyName": db_user.company_name,
            "industry": db_user.industry,
            "role": db_user.role,
            "usagePurpose": db_user.usage_purpose,
            "createdAt": db_user.created_at.isoformat(),
            "updatedAt": db_user.updated_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch user data")
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
    
    try:
        # Validate profile data
        allowed_fields = {
            "firstName", "lastName", "companyName", "industry", 
            "role", "usagePurpose", "profileImageUrl"
        }
        update_data = {k: v for k, v in profile_data.items() if k in allowed_fields}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        # Update user in database
        updated_user = await update_user_in_database(user["id"], update_data)
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update session with new data
        request.session["user"] = {
            "id": updated_user.id,
            "email": updated_user.email,
            "firstName": updated_user.first_name,
            "lastName": updated_user.last_name,
            "profileImageUrl": updated_user.profile_image_url,
            "companyName": updated_user.company_name,
            "industry": updated_user.industry,
            "role": updated_user.role,
            "usagePurpose": updated_user.usage_purpose,
            "createdAt": updated_user.created_at.isoformat(),
            "updatedAt": updated_user.updated_at.isoformat()
        }
        
        return request.session["user"]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update profile")
```

### 3. Payment Endpoints (Stripe)

```python
import stripe

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.post("/api/payments/create-checkout-session")
async def create_checkout_session(request: Request, payment_data: dict):
    """Create Stripe checkout session for one-time payments"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': payment_data.get('product_name', 'Cue Pro Plan'),
                    },
                    'unit_amount': payment_data.get('amount', 2000),  # $20.00
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{os.getenv('FRONTEND_URL')}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv('FRONTEND_URL')}/payment/cancel",
            customer_email=user.get('email'),
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/payments/create-subscription")
async def create_subscription(request: Request, subscription_data: dict):
    """Create Stripe subscription for recurring payments"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Create or retrieve customer
        customer = stripe.Customer.create(
            email=user.get('email'),
            name=f"{user.get('firstName', '')} {user.get('lastName', '')}".strip(),
        )
        
        # Create subscription
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{
                'price': subscription_data.get('price_id'),  # Your Stripe price ID
            }],
            payment_behavior='default_incomplete',
            expand=['latest_invoice.payment_intent'],
        )
        
        # Store customer ID in database
        await update_user_stripe_customer_id(user['id'], customer.id)
        
        return {
            "subscription_id": subscription.id,
            "client_secret": subscription.latest_invoice.payment_intent.client_secret,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/payments/subscription-status")
async def get_subscription_status(request: Request):
    """Get user's current subscription status"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        customer_id = await get_user_stripe_customer_id(user['id'])
        if not customer_id:
            return {"has_subscription": False, "status": "none"}
        
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status='active',
            limit=1
        )
        
        if subscriptions.data:
            subscription = subscriptions.data[0]
            return {
                "has_subscription": True,
                "status": subscription.status,
                "current_period_end": subscription.current_period_end,
                "plan_name": subscription.items.data[0].price.nickname or "Pro Plan"
            }
        else:
            return {"has_subscription": False, "status": "none"}
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/payments/cancel-subscription")
async def cancel_subscription(request: Request):
    """Cancel user's subscription"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        customer_id = await get_user_stripe_customer_id(user['id'])
        if not customer_id:
            raise HTTPException(status_code=404, detail="No subscription found")
        
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status='active',
            limit=1
        )
        
        if subscriptions.data:
            subscription = subscriptions.data[0]
            stripe.Subscription.modify(
                subscription.id,
                cancel_at_period_end=True
            )
            return {"message": "Subscription will cancel at period end"}
        else:
            raise HTTPException(status_code=404, detail="No active subscription found")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks for payment events"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        await handle_successful_payment(payment_intent)
        
    elif event['type'] == 'customer.subscription.created':
        subscription = event['data']['object']
        await handle_subscription_created(subscription)
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        await handle_subscription_cancelled(subscription)
        
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        await handle_payment_failed(invoice)
    
    return {"status": "success"}
```

### 4. Workflow Endpoints (Optional)

These are called when users interact with workflows:

```python
@app.get("/api/workflows")
async def list_workflows(request: Request, skip: int = 0, limit: int = 50):
    """Get user's workflows with pagination"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        workflows = await get_user_workflows_from_database(
            user_id=user["id"],
            skip=skip,
            limit=min(limit, 100)  # Cap at 100
        )
        
        total_count = await get_user_workflow_count(user["id"])
        
        return {
            "workflows": [
                {
                    "id": w.id,
                    "name": w.name,
                    "description": w.description,
                    "status": w.status,
                    "createdAt": w.created_at.isoformat(),
                    "updatedAt": w.updated_at.isoformat(),
                    "nodeCount": len(w.node_data.get("nodes", [])) if w.node_data else 0
                }
                for w in workflows
            ],
            "total": total_count,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch workflows")

@app.post("/api/workflows")
async def create_workflow(request: Request, workflow_data: dict):
    """Create new workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Validate required fields
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in workflow_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Create workflow in database
        new_workflow = await create_workflow_in_database(
            user_id=user["id"],
            name=workflow_data["name"],
            description=workflow_data["description"],
            node_data=workflow_data.get("nodeData"),
            generated_code=workflow_data.get("generatedCode")
        )
        
        return {
            "id": new_workflow.id,
            "name": new_workflow.name,
            "description": new_workflow.description,
            "status": new_workflow.status,
            "createdAt": new_workflow.created_at.isoformat(),
            "updatedAt": new_workflow.updated_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create workflow")

@app.get("/api/workflows/{workflow_id}")
async def get_workflow(request: Request, workflow_id: str):
    """Get specific workflow with full details"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        workflow = await get_workflow_by_id_and_user(workflow_id, user["id"])
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        return {
            "id": workflow.id,
            "name": workflow.name,
            "description": workflow.description,
            "status": workflow.status,
            "nodeData": workflow.node_data,
            "generatedCode": workflow.generated_code,
            "createdAt": workflow.created_at.isoformat(),
            "updatedAt": workflow.updated_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch workflow")

@app.put("/api/workflows/{workflow_id}")
async def update_workflow(request: Request, workflow_id: str, workflow_data: dict):
    """Update existing workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Verify workflow ownership
        existing_workflow = await get_workflow_by_id_and_user(workflow_id, user["id"])
        if not existing_workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Update workflow in database
        updated_workflow = await update_workflow_in_database(
            workflow_id=workflow_id,
            update_data=workflow_data
        )
        
        return {
            "id": updated_workflow.id,
            "name": updated_workflow.name,
            "description": updated_workflow.description,
            "status": updated_workflow.status,
            "nodeData": updated_workflow.node_data,
            "generatedCode": updated_workflow.generated_code,
            "updatedAt": updated_workflow.updated_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update workflow")

@app.delete("/api/workflows/{workflow_id}")
async def delete_workflow(request: Request, workflow_id: str):
    """Delete workflow"""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Verify workflow ownership
        workflow = await get_workflow_by_id_and_user(workflow_id, user["id"])
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Delete workflow from database
        await delete_workflow_from_database(workflow_id)
        
        return {"message": "Workflow deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete workflow")

@app.post("/api/workflows/generate")
async def generate_workflow(request: Request, generation_data: dict):
    """Generate workflow from natural language description"""
    # Optional: Require authentication
    # user = request.session.get("user")
    # if not user:
    #     raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        description = generation_data.get("description")
        if not description:
            raise HTTPException(status_code=400, detail="Description is required")
        
        # Call your AI service to generate workflow
        generated_workflow = await generate_workflow_from_description(
            description=description,
            language=generation_data.get("language", "python"),
            preferences=generation_data.get("preferences", {})
        )
        
        return {
            "workflowId": generated_workflow.get("id"),
            "nodes": generated_workflow.get("nodes", []),
            "edges": generated_workflow.get("edges", []),
            "code": generated_workflow.get("code", ""),
            "requirements": generated_workflow.get("requirements", []),
            "template": generated_workflow.get("template", ""),
            "estimatedExecutionTime": generated_workflow.get("execution_time"),
            "complexity": generated_workflow.get("complexity", "medium")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate workflow")
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

## External Services and Components Connected Through FastAPI

Your FastAPI backend acts as the central hub connecting various external services and components:

### 1. OAuth Providers
**Google OAuth 2.0**
- Authentication endpoint: `https://accounts.google.com/o/oauth2/auth`
- Token exchange: `https://oauth2.googleapis.com/token`
- User info: `https://www.googleapis.com/oauth2/v2/userinfo`
- Required: Google Client ID, Client Secret

**GitHub OAuth**
- Authentication endpoint: `https://github.com/login/oauth/authorize`
- Token exchange: `https://github.com/login/oauth/access_token`
- User info: `https://api.github.com/user`
- Required: GitHub Client ID, Client Secret

### 2. Database
Your FastAPI connects to your chosen database for:
- User profiles and authentication data
- Workflow definitions and metadata
- Generated code and templates
- User preferences and settings
- Workflow execution history

### 3. External API Services (For Workflow Integrations)
The frontend manages credentials for these services that your FastAPI may integrate with:

**Payment Processing**
- Stripe API (for payment workflows)
- Required: Stripe Secret Key, Webhook Signing Secret

**Email/Communication**
- SendGrid API (for email workflows)
- Required: SendGrid API Key

**Cloud Services**
- AWS DynamoDB (for database workflows)
- Required: AWS Access Key ID, AWS Secret Access Key

**Custom Webhooks**
- User-defined webhook endpoints
- Required: Webhook URLs, Authentication tokens

### 4. AI/ML Services (Optional)
For workflow generation features:
- OpenAI API (for natural language processing)
- Custom AI models for code generation
- Required: API keys and endpoints

### 5. Frontend Application
- React frontend (this application)
- Connects via HTTP/HTTPS to your FastAPI
- Uses session-based authentication
- Sends workflow descriptions and receives generated code

## Complete Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI        │    │   Database      │
│   (React)       │◄──►│   Backend        │◄──►│   (Your Choice) │
│   Port 5000     │    │   Port 8000      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  External APIs   │
                    │  - Google OAuth  │
                    │  - GitHub OAuth  │
                    │  - Stripe        │
                    │  - SendGrid      │
                    │  - AWS Services  │
                    │  - Custom APIs   │
                    └──────────────────┘
```

## Required Environment Variables for FastAPI

Your FastAPI backend will need these environment variables:

```bash
# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Database
DATABASE_URL=your_database_connection_string

# Session Security
SESSION_SECRET_KEY=your_session_secret_key

# External Service APIs (as needed)
STRIPE_SECRET_KEY=sk_test_or_live_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key_here
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret_here
STRIPE_PRO_MONTHLY_PRICE_ID=price_monthly_id
STRIPE_PRO_YEARLY_PRICE_ID=price_yearly_id
SENDGRID_API_KEY=SG.your_sendgrid_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Application URLs
FRONTEND_URL=http://localhost:5000
BACKEND_URL=http://localhost:8000
```

## Data Flow Summary

1. **User Authentication**: Frontend → FastAPI → OAuth Provider → Database
2. **Workflow Creation**: Frontend → FastAPI → Database
3. **Code Generation**: Frontend → FastAPI → AI/ML Services → Database
4. **External Integrations**: Frontend → FastAPI → External APIs (Stripe, SendGrid, etc.)
5. **Credential Validation**: Frontend → FastAPI → External Service APIs → Response

## Required Stripe Helper Functions

Add these database helper functions to your FastAPI backend:

```python
async def update_user_stripe_customer_id(user_id: str, customer_id: str):
    """Store Stripe customer ID in user record"""
    # Update your user database record with Stripe customer ID
    # Example implementation:
    # await db.execute(
    #     "UPDATE users SET stripe_customer_id = ? WHERE id = ?", 
    #     (customer_id, user_id)
    # )
    pass

async def get_user_stripe_customer_id(user_id: str) -> str:
    """Get user's Stripe customer ID from database"""
    # Query your user database for Stripe customer ID
    # Example implementation:
    # result = await db.fetch_one(
    #     "SELECT stripe_customer_id FROM users WHERE id = ?", 
    #     (user_id,)
    # )
    # return result.stripe_customer_id if result else None
    pass

async def handle_successful_payment(payment_intent):
    """Handle successful one-time payment"""
    # Update user account, send confirmation email, activate features, etc.
    # Example: Grant premium access, send receipt
    pass

async def handle_subscription_created(subscription):
    """Handle new subscription created"""
    # Activate user's pro features based on subscription
    # Update user role/permissions in database
    pass

async def handle_subscription_cancelled(subscription):
    """Handle subscription cancellation"""
    # Deactivate user's pro features
    # Send cancellation confirmation email
    pass

async def handle_payment_failed(invoice):
    """Handle failed payment"""
    # Send payment failure notification to user
    # Maybe downgrade account or send retry email
    pass
```

## Stripe Setup Requirements

1. **Create Stripe Account**: Sign up at https://stripe.com
2. **Get API Keys**: Dashboard > Developers > API Keys
3. **Create Products**: Dashboard > Products (create your pricing plans)
4. **Configure Webhooks**: Dashboard > Developers > Webhooks
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `customer.subscription.created`, `customer.subscription.deleted`, `invoice.payment_failed`
5. **Install Stripe Package**: `pip install stripe`

Your FastAPI backend is the single point of integration that orchestrates all these connections while the frontend remains a pure client application.

The Stripe endpoints are now ready for implementation - no frontend payment components will be created until you decide to add them later.