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

  getDefaultInstructions(): DeploymentInstructions {
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
}

export const deploymentService = new DeploymentService();
