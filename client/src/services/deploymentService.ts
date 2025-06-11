import { apiRequest } from "@/lib/queryClient";

export interface DeploymentInstructions {
  steps: DeploymentStep[];
  prerequisites: string[];
  commands: string[];
  notes: string[];
}

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  commands?: string[];
  isCompleted: boolean;
  isOptional: boolean;
}

export interface DeploymentTemplate {
  samTemplate: string;
  requirementsTxt: string;
  envVariables: Record<string, string>;
  awsPermissions: string[];
}

class DeploymentService {
  async getDeploymentInstructions(workflowId: string): Promise<DeploymentInstructions> {
    const response = await apiRequest("GET", `/api/deployment/instructions/${workflowId}`);
    return response.json();
  }

  async generateDeploymentTemplate(workflowId: string): Promise<DeploymentTemplate> {
    const response = await apiRequest("POST", `/api/deployment/template/${workflowId}`);
    return response.json();
  }

  async validateDeploymentSetup(requirements: string[]): Promise<{
    isValid: boolean;
    missingRequirements: string[];
    recommendations: string[];
  }> {
    const response = await apiRequest("POST", "/api/deployment/validate", {
      requirements,
    });
    return response.json();
  }

  async checkAWSCredentials(): Promise<{
    isConfigured: boolean;
    region?: string;
    accountId?: string;
    permissions: string[];
    issues: string[];
  }> {
    const response = await apiRequest("GET", "/api/deployment/aws-status");
    return response.json();
  }

  async generateSAMTemplate(workflowData: any): Promise<string> {
    const response = await apiRequest("POST", "/api/deployment/sam-template", workflowData);
    const result = await response.json();
    return result.template;
  }

  getConsoleInstructions(): DeploymentInstructions {
    return {
      steps: [
        {
          id: "download",
          title: "Download Generated Code",
          description: "Download the Python Lambda function code from the Generated Code section and save it to your computer.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "create-function",
          title: "Create Lambda Function",
          description: "Navigate to AWS Lambda Console and create a new function with Python 3.9+ runtime.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "upload-code",
          title: "Upload Function Code",
          description: "Copy and paste your downloaded code into the Lambda function editor or upload as a ZIP file.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "configure-environment",
          title: "Set Environment Variables",
          description: "Add your API keys and configuration variables in the Environment Variables section.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "set-permissions",
          title: "Configure IAM Permissions",
          description: "Set up the execution role with necessary permissions for your integrations (S3, DynamoDB, etc.).",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "test-function",
          title: "Test Your Function",
          description: "Create a test event and verify your Lambda function executes successfully.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "setup-trigger",
          title: "Configure Trigger (Optional)",
          description: "Set up API Gateway, CloudWatch Events, or other triggers based on your workflow needs.",
          isCompleted: false,
          isOptional: true,
        },
      ],
      prerequisites: [
        "AWS Account with Lambda access permissions",
        "Basic familiarity with AWS Console",
        "API keys for external services (Stripe, SendGrid, etc.)",
      ],
      commands: [],
      notes: [
        "Store sensitive API keys in Environment Variables, never in code",
        "Test with small data sets first before processing large volumes",
        "Monitor function execution and set up CloudWatch alarms for errors",
        "Consider setting appropriate timeout and memory limits for your function",
      ],
    };
  }

  getCLIInstructions(): DeploymentInstructions {
    return {
      steps: [
        {
          id: "download-cli",
          title: "Download Generated Files",
          description: "Download all generated files (lambda_function.py, requirements.txt, template.yaml) to a local folder.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "install-tools",
          title: "Install AWS Tools",
          description: "Install and configure AWS CLI and SAM CLI on your machine.",
          commands: [
            "aws configure",
            "pip install aws-sam-cli",
          ],
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "build-function",
          title: "Build Lambda Function",
          description: "Use SAM CLI to build your Lambda function with dependencies.",
          commands: [
            "sam build",
          ],
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "deploy-function",
          title: "Deploy to AWS",
          description: "Deploy your Lambda function using SAM CLI guided deployment.",
          commands: [
            "sam deploy --guided",
          ],
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "test-deployment",
          title: "Test Deployment",
          description: "Invoke your deployed function to verify it's working correctly.",
          commands: [
            "sam local invoke",
            "aws lambda invoke --function-name YourFunctionName output.json",
          ],
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "setup-monitoring",
          title: "Set Up Monitoring (Optional)",
          description: "Configure CloudWatch logs and alarms for your Lambda function.",
          isCompleted: false,
          isOptional: true,
        },
      ],
      prerequisites: [
        "AWS Account with Lambda and IAM permissions",
        "AWS CLI installed and configured",
        "Python 3.9+ installed",
        "SAM CLI installed",
        "Git (for version control)",
      ],
      commands: [
        "sam build",
        "sam deploy --guided",
      ],
      notes: [
        "Use guided deployment for first-time setup to configure stack parameters",
        "Store API keys in AWS Systems Manager Parameter Store for security",
        "Set up proper IAM roles with least privilege principle",
        "Monitor costs and set up billing alerts for Lambda usage",
      ],
    };
  }

  getDefaultInstructions(): DeploymentInstructions {
    return this.getConsoleInstructions();
  }
}

export const deploymentService = new DeploymentService();
