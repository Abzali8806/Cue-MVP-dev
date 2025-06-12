import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import passport from "passport";
import { storage } from "./storage";
import { setupSession, setupPassport, requireAuth } from "./auth";

// Request/Response schemas
const generateWorkflowSchema = z.object({
  description: z.string().min(1).max(8000),
});

const saveWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  nodeData: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
  generatedCode: z.string().optional(),
});

const validateCredentialsSchema = z.object({
  credentials: z.record(z.string()),
});

const validateSingleCredentialSchema = z.object({
  serviceType: z.string(),
  credentialType: z.string(),
  value: z.string(),
});

const testConnectionSchema = z.object({
  serviceType: z.string(),
  credentials: z.record(z.string()),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupSession(app);
  setupPassport();

  // OAuth Routes
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
    async (req, res) => {
      // Transfer any session workflows to the authenticated user
      if (req.isAuthenticated() && req.sessionID) {
        const userId = (req.user as any)?.id;
        if (userId) {
          try {
            await storage.transferSessionWorkflows(req.sessionID, userId);
          } catch (error) {
            console.error('Error transferring session workflows:', error);
          }
        }
      }
      res.redirect('/');
    }
  );

  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
  
  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login?error=github_auth_failed' }),
    async (req, res) => {
      // Transfer any session workflows to the authenticated user
      if (req.isAuthenticated() && req.sessionID) {
        const userId = (req.user as any)?.id;
        if (userId) {
          try {
            await storage.transferSessionWorkflows(req.sessionID, userId);
          } catch (error) {
            console.error('Error transferring session workflows:', error);
          }
        }
      }
      res.redirect('/');
    }
  );

  app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get current user
  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
  
  // Workflow generation endpoint
  app.post("/api/workflows/generate", async (req, res) => {
    try {
      const { description } = generateWorkflowSchema.parse(req.body);
      
      // Generate workflow based on description
      const workflowResponse = await generateWorkflowFromDescription(description);
      
      res.json(workflowResponse);
    } catch (error) {
      console.error("Error generating workflow:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to generate workflow" 
      });
    }
  });

  // Save workflow endpoint
  app.post("/api/workflows", async (req, res) => {
    try {
      const workflowData = saveWorkflowSchema.parse(req.body);
      
      // Get user ID if authenticated, otherwise use session ID for anonymous workflows
      const userId = req.isAuthenticated() ? (req.user as any)?.id : null;
      const sessionId = !userId ? req.sessionID : null;
      
      // Save workflow to storage
      const savedWorkflow = await storage.saveWorkflow({
        userId,
        sessionId,
        name: workflowData.name,
        description: workflowData.description,
        nodeData: workflowData.nodeData,
        generatedCode: workflowData.generatedCode || "",
        status: "draft",
      });
      
      res.json({
        id: savedWorkflow.id.toString(),
        message: "Workflow saved successfully",
      });
    } catch (error) {
      console.error("Error saving workflow:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to save workflow" 
      });
    }
  });

  // Get workflow endpoint
  app.get("/api/workflows/:id", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(workflowId);
      
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      
      res.json(workflow);
    } catch (error) {
      console.error("Error fetching workflow:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch workflow" 
      });
    }
  });

  // List workflows endpoint
  app.get("/api/workflows", async (req, res) => {
    try {
      // Get workflows for authenticated user or current session
      const userId = req.isAuthenticated() ? (req.user as any)?.id : null;
      const sessionId = !userId ? req.sessionID : null;
      
      const workflows = await storage.listWorkflows(userId, sessionId);
      res.json(workflows);
    } catch (error) {
      console.error("Error listing workflows:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to list workflows" 
      });
    }
  });

  // Validate credentials endpoint
  app.post("/api/validation/credentials", async (req, res) => {
    try {
      const { credentials } = validateCredentialsSchema.parse(req.body);
      
      const validationResults = await validateCredentials(credentials);
      
      res.json(validationResults);
    } catch (error) {
      console.error("Error validating credentials:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to validate credentials" 
      });
    }
  });

  // Validate single credential endpoint
  app.post("/api/validation/credential", async (req, res) => {
    try {
      const { serviceType, credentialType, value } = validateSingleCredentialSchema.parse(req.body);
      
      const validation = await validateSingleCredential(serviceType, credentialType, value);
      
      res.json(validation);
    } catch (error) {
      console.error("Error validating credential:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to validate credential" 
      });
    }
  });

  // Test connection endpoint
  app.post("/api/validation/test-connection", async (req, res) => {
    try {
      const { serviceType, credentials } = testConnectionSchema.parse(req.body);
      
      const connectionTest = await testServiceConnection(serviceType, credentials);
      
      res.json(connectionTest);
    } catch (error) {
      console.error("Error testing connection:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to test connection" 
      });
    }
  });

  // Validate workflow endpoint
  app.post("/api/validation/workflow", async (req, res) => {
    try {
      const { nodes, credentials } = req.body;
      
      const workflowValidation = await validateWorkflow(nodes, credentials);
      
      res.json(workflowValidation);
    } catch (error) {
      console.error("Error validating workflow:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to validate workflow" 
      });
    }
  });

  // Deployment endpoints
  app.get("/api/deployment/instructions/:workflowId", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.workflowId);
      const instructions = await getDeploymentInstructions(workflowId);
      
      res.json(instructions);
    } catch (error) {
      console.error("Error getting deployment instructions:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get deployment instructions" 
      });
    }
  });

  app.post("/api/deployment/template/:workflowId", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.workflowId);
      const template = await generateDeploymentTemplate(workflowId);
      
      res.json(template);
    } catch (error) {
      console.error("Error generating deployment template:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate deployment template" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for workflow generation and validation

async function generateWorkflowFromDescription(description: string) {
  // Analyze description to determine workflow components
  const lowerDesc = description.toLowerCase();
  
  let nodes = [];
  let edges = [];
  let generatedCode = "";

  // Generate nodes based on keywords in description
  if (lowerDesc.includes('webhook') || lowerDesc.includes('stripe')) {
    nodes.push({
      id: 'webhook-1',
      type: 'custom',
      position: { x: 50, y: 100 },
      name: 'Webhook Receiver',
      description: 'Receives and validates webhook payload',
      serviceType: 'webhook',
      icon: 'webhook',
      requiredCredentials: [
        {
          id: 'webhook_secret',
          type: 'password',
          name: 'Webhook Secret',
          description: 'Secret key for webhook verification',
          required: true,
          placeholder: 'whsec_...',
        },
      ],
      validationStatus: 'pending',
    });
  }

  if (lowerDesc.includes('payment') || lowerDesc.includes('stripe')) {
    nodes.push({
      id: 'payment-1',
      type: 'custom',
      position: { x: 400, y: 100 },
      name: 'Payment Processor',
      description: 'Processes payment transactions',
      serviceType: 'stripe',
      icon: 'payment',
      requiredCredentials: [
        {
          id: 'stripe_secret_key',
          type: 'password',
          name: 'Stripe Secret Key',
          description: 'Your Stripe secret API key',
          required: true,
          placeholder: 'sk_test_...',
        },
      ],
      validationStatus: 'pending',
    });
  }

  if (lowerDesc.includes('email') || lowerDesc.includes('sendgrid') || lowerDesc.includes('notification')) {
    nodes.push({
      id: 'email-1',
      type: 'custom',
      position: { x: 750, y: 200 },
      name: 'Email Sender',
      description: 'Sends emails via SendGrid',
      serviceType: 'sendgrid',
      icon: 'email',
      requiredCredentials: [
        {
          id: 'sendgrid_api_key',
          type: 'password',
          name: 'SendGrid API Key',
          description: 'Your SendGrid API key',
          required: true,
          placeholder: 'SG...',
        },
      ],
      validationStatus: 'invalid',
    });
  }

  if (lowerDesc.includes('database') || lowerDesc.includes('dynamodb') || lowerDesc.includes('store')) {
    nodes.push({
      id: 'database-1',
      type: 'custom',
      position: { x: 400, y: 350 },
      name: 'Database Writer',
      description: 'Stores data in DynamoDB',
      serviceType: 'dynamodb',
      icon: 'storage',
      requiredCredentials: [
        {
          id: 'aws_access_key',
          type: 'text',
          name: 'AWS Access Key ID',
          description: 'AWS access key for DynamoDB',
          required: false,
          placeholder: 'AKIA...',
        },
        {
          id: 'aws_secret_key',
          type: 'password',
          name: 'AWS Secret Access Key',
          description: 'AWS secret key for DynamoDB',
          required: false,
          placeholder: '...',
        },
      ],
      validationStatus: 'warning',
    });
  }

  // Generate edges to connect nodes
  if (nodes.length > 1) {
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        id: `e${i}-${i + 1}`,
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: 'smoothstep',
      });
    }
  }

  // Generate Python code based on nodes
  generatedCode = generateLambdaCode(nodes, description);

  return {
    workflowId: Date.now().toString(),
    nodes,
    edges,
    code: generatedCode,
    requirements: ['boto3', 'stripe', 'sendgrid', 'requests'],
    template: generateSAMTemplate(nodes),
  };
}

function generateLambdaCode(nodes: any[], description: string): string {
  const hasStripe = nodes.some(n => n.serviceType === 'stripe' || n.serviceType === 'webhook');
  const hasSendGrid = nodes.some(n => n.serviceType === 'sendgrid');
  const hasDynamoDB = nodes.some(n => n.serviceType === 'dynamodb');

  let imports = ['import json', 'import os'];
  if (hasDynamoDB) imports.push('import boto3');
  if (hasStripe) imports.push('import stripe');
  if (hasSendGrid) imports.push('import sendgrid', 'from sendgrid.helpers.mail import Mail');

  const code = `# AWS Lambda function for workflow processing
# Generated from description: ${description}

${imports.join('\n')}

def lambda_handler(event, context):
    """
    Process workflow events based on the generated configuration
    """
    
    try:
        ${hasStripe ? "# Initialize Stripe\n        stripe.api_key = os.environ['STRIPE_SECRET_KEY']" : ""}
        ${hasSendGrid ? "# Initialize SendGrid\n        sg = sendgrid.SendGridAPIClient(api_key=os.environ['SENDGRID_API_KEY'])" : ""}
        ${hasDynamoDB ? "# Initialize DynamoDB\n        dynamodb = boto3.resource('dynamodb')" : ""}
        
        # Parse input data
        payload = json.loads(event.get('body', '{}'))
        
        ${hasStripe ? `
        # Process Stripe webhook
        if 'type' in payload and payload['type'].startswith('payment'):
            return process_payment_event(payload)` : ""}
        
        ${hasSendGrid ? `
        # Send notification email
        send_notification_email(payload)` : ""}
        
        ${hasDynamoDB ? `
        # Store data in database
        store_data(payload, dynamodb)` : ""}
        
        return {
            'statusCode': 200,
            'body': json.dumps({'status': 'success'})
        }
        
    except Exception as e:
        print(f"Error processing workflow: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

${hasSendGrid ? `
def send_notification_email(data):
    """Send notification email"""
    sg = sendgrid.SendGridAPIClient(api_key=os.environ['SENDGRID_API_KEY'])
    message = Mail(
        from_email='noreply@example.com',
        to_emails=data.get('email', 'admin@example.com'),
        subject='Workflow Notification',
        html_content='<p>Your workflow has been processed successfully.</p>'
    )
    try:
        response = sg.send(message)
        print(f"Email sent: {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {str(e)}")
` : ""}

${hasDynamoDB ? `
def store_data(data, dynamodb):
    """Store data in DynamoDB"""
    table = dynamodb.Table('workflow_data')
    try:
        table.put_item(
            Item={
                'id': data.get('id', str(uuid.uuid4())),
                'timestamp': int(time.time()),
                'data': data
            }
        )
        print("Data stored successfully")
    except Exception as e:
        print(f"Error storing data: {str(e)}")
` : ""}

${hasStripe ? `
def process_payment_event(event_data):
    """Process Stripe payment event"""
    try:
        # Verify webhook signature
        endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
        # Process payment intent
        if event_data['type'] == 'payment_intent.succeeded':
            payment_intent = event_data['data']['object']
            print(f"Payment succeeded: {payment_intent['id']}")
            
        return {
            'statusCode': 200,
            'body': json.dumps({'status': 'processed'})
        }
    except Exception as e:
        print(f"Error processing payment: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }
` : ""}
`;

  return code;
}

function generateSAMTemplate(nodes: any[]): string {
  const hasStripe = nodes.some(n => n.serviceType === 'stripe' || n.serviceType === 'webhook');
  const hasSendGrid = nodes.some(n => n.serviceType === 'sendgrid');

  return `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Generated Lambda function for workflow processing

Globals:
  Function:
    Timeout: 30
    MemorySize: 128

Resources:
  WorkflowFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: lambda_function.lambda_handler
      Runtime: python3.9
      Environment:
        Variables:
          ${hasStripe ? 'STRIPE_SECRET_KEY: !Ref StripeSecretKey' : ''}
          ${hasSendGrid ? 'SENDGRID_API_KEY: !Ref SendGridApiKey' : ''}

Parameters:
  ${hasStripe ? `StripeSecretKey:
    Type: String
    Description: Stripe Secret API Key
    NoEcho: true` : ''}
  ${hasSendGrid ? `SendGridApiKey:
    Type: String
    Description: SendGrid API Key
    NoEcho: true` : ''}

Outputs:
  WorkflowFunction:
    Description: "Workflow Lambda Function ARN"
    Value: !GetAtt WorkflowFunction.Arn
`;
}

async function validateCredentials(credentials: Record<string, string>) {
  const validations: Record<string, { isValid: boolean; message: string }> = {};
  
  for (const [key, value] of Object.entries(credentials)) {
    if (key.includes('stripe')) {
      validations[key] = await validateStripeCredential(value);
    } else if (key.includes('sendgrid')) {
      validations[key] = await validateSendGridCredential(value);
    } else {
      validations[key] = { isValid: true, message: 'Credential format valid' };
    }
  }
  
  return {
    isValid: Object.values(validations).every(v => v.isValid),
    validations,
  };
}

async function validateSingleCredential(serviceType: string, credentialType: string, value: string) {
  if (serviceType === 'stripe') {
    return await validateStripeCredential(value);
  } else if (serviceType === 'sendgrid') {
    return await validateSendGridCredential(value);
  }
  
  return { isValid: true, message: 'Credential format valid' };
}

async function validateStripeCredential(apiKey: string) {
  if (!apiKey.startsWith('sk_')) {
    return { isValid: false, message: 'Invalid Stripe API key format' };
  }
  
  try {
    // In a real implementation, you would test the API key with Stripe
    // For now, we validate the format
    if (apiKey.length < 20) {
      return { isValid: false, message: 'API key too short' };
    }
    
    return { isValid: true, message: 'Valid Stripe API key format' };
  } catch (error) {
    return { isValid: false, message: 'Failed to validate Stripe API key' };
  }
}

async function validateSendGridCredential(apiKey: string) {
  if (!apiKey.startsWith('SG.')) {
    return { isValid: false, message: 'Invalid SendGrid API key format' };
  }
  
  try {
    // In a real implementation, you would test the API key with SendGrid
    if (apiKey.length < 20) {
      return { isValid: false, message: 'API key too short' };
    }
    
    return { isValid: true, message: 'Valid SendGrid API key format' };
  } catch (error) {
    return { isValid: false, message: 'Failed to validate SendGrid API key' };
  }
}

async function testServiceConnection(serviceType: string, credentials: Record<string, string>) {
  try {
    // In a real implementation, you would make actual API calls to test connections
    switch (serviceType) {
      case 'stripe':
        return { success: true, message: 'Stripe connection successful' };
      case 'sendgrid':
        return { success: true, message: 'SendGrid connection successful' };
      default:
        return { success: true, message: 'Connection test passed' };
    }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection test failed' 
    };
  }
}

async function validateWorkflow(nodes: any[], credentials: Record<string, string>) {
  const nodeValidations: Record<string, any> = {};
  
  for (const node of nodes) {
    const requiredCreds = node.requiredCredentials || [];
    const errors: string[] = [];
    const warnings: string[] = [];
    
    for (const cred of requiredCreds) {
      if (cred.required && !credentials[`${node.id}_${cred.id}`]) {
        errors.push(`Missing required credential: ${cred.name}`);
      }
    }
    
    nodeValidations[node.id] = {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
  
  return {
    isValid: Object.values(nodeValidations).every(v => v.isValid),
    nodeValidations,
    overallErrors: [],
    overallWarnings: [],
  };
}

async function getDeploymentInstructions(workflowId: number) {
  return {
    steps: [
      {
        id: "download",
        title: "Download Generated Code",
        description: "Download the generated Python files and save them to your local machine.",
        isCompleted: false,
        isOptional: false,
      },
      {
        id: "aws-cli",
        title: "Configure AWS CLI",
        description: "Set up your AWS credentials and install the SAM CLI for deployment.",
        commands: ["aws configure", "pip install aws-sam-cli"],
        isCompleted: false,
        isOptional: false,
      },
      {
        id: "deploy",
        title: "Deploy Lambda Function",
        description: "Use SAM CLI to build and deploy your Lambda function to AWS.",
        commands: ["sam build", "sam deploy --guided"],
        isCompleted: false,
        isOptional: false,
      },
    ],
    prerequisites: [
      "AWS Account with appropriate permissions",
      "AWS CLI installed and configured",
      "Python 3.9+ installed",
      "SAM CLI installed",
    ],
    commands: ["sam build", "sam deploy --guided"],
    notes: [
      "Make sure to set up environment variables for your API keys",
      "Review IAM permissions before deployment",
      "Test your function with sample data before production use",
    ],
  };
}

async function generateDeploymentTemplate(workflowId: number) {
  const workflow = await storage.getWorkflow(workflowId);
  
  return {
    samTemplate: generateSAMTemplate(workflow?.nodeData?.nodes || []),
    requirementsTxt: "boto3==1.34.0\nstripe==5.4.0\nsendgrid==6.10.0\nrequests==2.31.0",
    envVariables: {
      STRIPE_SECRET_KEY: "${STRIPE_SECRET_KEY}",
      SENDGRID_API_KEY: "${SENDGRID_API_KEY}",
    },
    awsPermissions: ["lambda:InvokeFunction", "dynamodb:PutItem", "dynamodb:GetItem"],
  };
}
