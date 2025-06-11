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
          description: "Download the generated Python files and save them to your local machine.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "aws-cli",
          title: "Configure AWS CLI",
          description: "Set up your AWS credentials and install the SAM CLI for deployment.",
          commands: [
            "aws configure",
            "pip install aws-sam-cli",
          ],
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "deploy",
          title: "Deploy Lambda Function",
          description: "Use SAM CLI to build and deploy your Lambda function to AWS.",
          commands: [
            "sam build",
            "sam deploy --guided",
          ],
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "test",
          title: "Test Deployment",
          description: "Verify that your Lambda function is working correctly.",
          isCompleted: false,
          isOptional: true,
        },
      ],
      prerequisites: [
        "AWS Account with appropriate permissions",
        "AWS CLI installed and configured",
        "Python 3.9+ installed",
        "SAM CLI installed",
      ],
      commands: [
        "sam build",
        "sam deploy --guided",
      ],
      notes: [
        "Make sure to set up environment variables for your API keys",
        "Review IAM permissions before deployment",
        "Test your function with sample data before production use",
      ],
    };
  }
}

export const deploymentService = new DeploymentService();
