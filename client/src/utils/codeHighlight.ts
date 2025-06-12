export interface CodeHighlightOptions {
  language: string;
  lineNumbers?: boolean;
  theme?: 'dark' | 'light';
}

export const highlightPythonCode = (code: string): string => {
  // Simple syntax highlighting for Python
  const keywords = [
    'def', 'class', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while',
    'try', 'except', 'finally', 'with', 'return', 'yield', 'pass', 'break', 'continue',
    'and', 'or', 'not', 'in', 'is', 'lambda', 'async', 'await', 'True', 'False', 'None'
  ];

  const builtins = [
    'print', 'len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'tuple', 'set',
    'range', 'enumerate', 'zip', 'map', 'filter', 'sum', 'max', 'min', 'abs', 'round'
  ];

  let highlighted = code;

  // Highlight comments
  highlighted = highlighted.replace(
    /(#.*$)/gm,
    '<span class="comment">$1</span>'
  );

  // Highlight strings
  highlighted = highlighted.replace(
    /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    '<span class="string">$1$2$1</span>'
  );

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span class="number">$1</span>'
  );

  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
  });

  // Highlight function names
  highlighted = highlighted.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
    '<span class="function">$1</span>'
  );

  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b${builtin}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="function">${builtin}</span>`);
  });

  return highlighted;
};

export const addLineNumbers = (code: string): string => {
  const lines = code.split('\n');
  return lines
    .map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      return `<span class="line-number">${lineNumber}</span>${line}`;
    })
    .join('\n');
};

export const formatCodeBlock = (code: string, options: CodeHighlightOptions): string => {
  let formattedCode = code;

  if (options.language === 'python') {
    formattedCode = highlightPythonCode(formattedCode);
  }

  if (options.lineNumbers) {
    formattedCode = addLineNumbers(formattedCode);
  }

  return formattedCode;
};

export const removeHTMLTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const escapeHTML = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const unescapeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Sample Python code for demonstration
export const SAMPLE_LAMBDA_CODE = `# Workflow automation handler for Stripe webhook processing
import json
import os
import boto3
import stripe
import sendgrid
from sendgrid.helpers.mail import Mail

def workflow_handler(event, context):
    """
    Process Stripe webhook events and handle payment confirmations
    """
    
    # Initialize clients
    stripe.api_key = os.environ['STRIPE_SECRET_KEY']
    sg = sendgrid.SendGridAPIClient(api_key=os.environ['SENDGRID_API_KEY'])
    dynamodb = boto3.resource('dynamodb')
    
    try:
        # Parse webhook payload
        payload = json.loads(event['body'])
        
        # Validate webhook signature
        endpoint_secret = os.environ['STRIPE_WEBHOOK_SECRET']
        sig_header = event['headers']['stripe-signature']
        
        webhook_event = stripe.Webhook.construct_event(
            event['body'], sig_header, endpoint_secret
        )
        
        if webhook_event['type'] == 'payment_intent.succeeded':
            payment_intent = webhook_event['data']['object']
            
            # Send confirmation email
            send_confirmation_email(payment_intent, sg)
            
            # Store transaction record
            store_transaction(payment_intent, dynamodb)
            
        return {
            'statusCode': 200,
            'body': json.dumps({'status': 'success'})
        }
        
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }

def send_confirmation_email(payment_intent, sendgrid_client):
    """Send payment confirmation email"""
    message = Mail(
        from_email='noreply@example.com',
        to_emails=payment_intent['receipt_email'],
        subject='Payment Confirmation',
        html_content=f'<p>Your payment of {payment_intent["amount"] / 100} has been processed successfully.</p>'
    )
    
    try:
        response = sendgrid_client.send(message)
        print(f"Email sent successfully: {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {str(e)}")

def store_transaction(payment_intent, dynamodb):
    """Store transaction in DynamoDB"""
    table = dynamodb.Table('transactions')
    
    try:
        table.put_item(
            Item={
                'payment_id': payment_intent['id'],
                'amount': payment_intent['amount'],
                'currency': payment_intent['currency'],
                'status': payment_intent['status'],
                'customer_email': payment_intent['receipt_email'],
                'timestamp': payment_intent['created']
            }
        )
        print(f"Transaction stored: {payment_intent['id']}")
    except Exception as e:
        print(f"Error storing transaction: {str(e)}")
`;

export const SAMPLE_REQUIREMENTS_TXT = `boto3==1.34.0
stripe==5.4.0
sendgrid==6.10.0
requests==2.31.0
`;

export const SAMPLE_SAM_TEMPLATE = `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  stripe-webhook-processor
  
  Generated workflow automation for Stripe webhook processing

Globals:
  Function:
    Timeout: 30
    MemorySize: 128

Resources:
  StripeWebhookProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: lambda_function.lambda_handler
      Runtime: python3.9
      Architectures:
        - x86_64
      Environment:
        Variables:
          STRIPE_SECRET_KEY: !Ref StripeSecretKey
          STRIPE_WEBHOOK_SECRET: !Ref StripeWebhookSecret
          SENDGRID_API_KEY: !Ref SendGridApiKey
      Events:
        Api:
          Type: Api
          Properties:
            Path: /webhook
            Method: post
            
Parameters:
  StripeSecretKey:
    Type: String
    Description: Stripe Secret API Key
    NoEcho: true
    
  StripeWebhookSecret:
    Type: String
    Description: Stripe Webhook Endpoint Secret
    NoEcho: true
    
  SendGridApiKey:
    Type: String
    Description: SendGrid API Key
    NoEcho: true

Outputs:
  StripeWebhookProcessorApi:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://\${ServerlessRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/webhook/"
  StripeWebhookProcessorFunction:
    Description: "Stripe Webhook Processor Lambda Function ARN"
    Value: !GetAtt StripeWebhookProcessorFunction.Arn
`;
