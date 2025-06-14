# Stripe Payment Endpoints for FastAPI

Add these Stripe payment endpoints to your FastAPI backend. The frontend is ready to integrate payments when you implement these endpoints.

## Required Stripe Endpoints

### 1. Create Checkout Session
```python
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
            success_url=f"{FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/payment/cancel",
            customer_email=user.get('email'),
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### 2. Create Subscription
```python
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
```

### 3. Get Subscription Status
```python
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
```

### 4. Cancel Subscription
```python
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
```

### 5. Stripe Webhook Handler
```python
@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks for payment events"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Handle successful payment
        await handle_successful_payment(payment_intent)
        
    elif event['type'] == 'customer.subscription.created':
        subscription = event['data']['object']
        # Handle new subscription
        await handle_subscription_created(subscription)
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # Handle subscription cancellation
        await handle_subscription_cancelled(subscription)
        
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        # Handle failed payment
        await handle_payment_failed(invoice)
    
    return {"status": "success"}
```

## Required Environment Variables

Add these to your FastAPI environment:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_or_live_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key_here
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret_here

# Your Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID=price_monthly_id
STRIPE_PRO_YEARLY_PRICE_ID=price_yearly_id

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5000
```

## Required Helper Functions

Implement these database helper functions:

```python
async def update_user_stripe_customer_id(user_id: str, customer_id: str):
    """Store Stripe customer ID in user record"""
    # Update your user database record
    pass

async def get_user_stripe_customer_id(user_id: str) -> str:
    """Get user's Stripe customer ID from database"""
    # Query your user database
    pass

async def handle_successful_payment(payment_intent):
    """Handle successful one-time payment"""
    # Update user account, send confirmation email, etc.
    pass

async def handle_subscription_created(subscription):
    """Handle new subscription created"""
    # Activate user's pro features
    pass

async def handle_subscription_cancelled(subscription):
    """Handle subscription cancellation"""
    # Deactivate user's pro features
    pass

async def handle_payment_failed(invoice):
    """Handle failed payment"""
    # Send payment failure notification
    pass
```

## Stripe Setup Steps

1. **Create Stripe Account** at https://stripe.com
2. **Get API Keys** from Stripe Dashboard > Developers > API Keys
3. **Create Products and Prices** in Stripe Dashboard > Products
4. **Set up Webhooks** in Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `customer.subscription.created`, `customer.subscription.deleted`, `invoice.payment_failed`
5. **Copy webhook signing secret** and add to environment variables

## Frontend Integration (Future)

When ready to add payments to frontend, the frontend will:
- Call `/api/payments/create-checkout-session` for one-time payments
- Call `/api/payments/create-subscription` for subscriptions
- Check `/api/payments/subscription-status` to show user's plan
- Allow users to cancel via `/api/payments/cancel-subscription`

The endpoints are designed to work seamlessly with Stripe's standard payment flows and will integrate easily with the existing React frontend when you're ready to add payment features.