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

  async checkDeploymentStatus(): Promise<{
    isReady: boolean;
    environment?: string;
    permissions: string[];
    issues: string[];
  }> {
    const response = await apiRequest("GET", "/api/deployment/status");
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
          description: "Download the workflow automation code from the Generated Code section and save it to your computer.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "setup-environment",
          title: "Set Up Environment",
          description: "Prepare your deployment environment with the necessary runtime and dependencies.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "deploy-code",
          title: "Deploy Workflow Code",
          description: "Deploy your workflow automation code to your chosen hosting environment.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "configure-environment",
          title: "Set Environment Variables",
          description: "Configure your API keys and service credentials in your deployment environment.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "test-workflow",
          title: "Test Your Workflow",
          description: "Create a test scenario and verify your workflow executes successfully.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "setup-triggers",
          title: "Configure Triggers (Optional)",
          description: "Set up webhooks, scheduled events, or other triggers based on your workflow needs.",
          isCompleted: false,
          isOptional: true,
        },
      ],
      prerequisites: [
        "Hosting environment with deployment capabilities",
        "Basic familiarity with your deployment platform",
        "API keys for external services (Stripe, SendGrid, etc.)",
      ],
      commands: [],
      notes: [
        "Store sensitive API keys in Environment Variables, never in code",
        "Test with small data sets first before processing large volumes",
        "Monitor workflow execution and set up logging for error tracking",
        "Consider setting appropriate timeout and resource limits for your workflow",
      ],
    };
  }

  getCLIInstructions(): DeploymentInstructions {
    return {
      steps: [
        {
          id: "download-cli",
          title: "Download Generated Files",
          description: "Download all generated files (workflow_handler.py, requirements.txt, config.yaml) to a local folder.",
          isCompleted: false,
          isOptional: false,
        },
        {
          id: "install-tools",
          title: "Install Deployment Tools",
          description: "Install and configure the necessary deployment tools for your hosting platform.",
          commands: [
            "pip install -r requirements.txt",
            "# Configure your deployment platform credentials",
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
