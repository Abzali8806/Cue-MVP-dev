import { apiRequest } from "@/lib/api";

export interface ValidationRequest {
  serviceType: string;
  credentials: Record<string, string>;
}

export interface ValidationResponse {
  isValid: boolean;
  validations: Record<string, {
    isValid: boolean;
    message: string;
  }>;
  errors?: string[];
}

export interface WorkflowValidationRequest {
  nodes: any[];
  credentials: Record<string, string>;
}

export interface WorkflowValidationResponse {
  isValid: boolean;
  nodeValidations: Record<string, {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  overallErrors: string[];
  overallWarnings: string[];
}

class ValidationService {
  async validateCredentials(credentials: Record<string, string>): Promise<ValidationResponse> {
    const response = await apiRequest("/api/validation/credentials", {
      method: "POST",
      body: JSON.stringify({ credentials }),
    });
    return response;
  }

  async validateSingleCredential(serviceType: string, credentialType: string, value: string): Promise<{
    isValid: boolean;
    message: string;
  }> {
    const response = await apiRequest("/api/validation/credential", {
      method: "POST",
      body: JSON.stringify({
        serviceType,
        credentialType,
        value,
      }),
    });
    return response;
  }

  async validateWorkflow(workflowData: WorkflowValidationRequest): Promise<WorkflowValidationResponse> {
    const response = await apiRequest("/api/validation/workflow", {
      method: "POST",
      body: JSON.stringify(workflowData),
    });
    return response;
  }

  async testConnection(serviceType: string, credentials: Record<string, string>): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    const response = await apiRequest("/api/validation/test-connection", {
      method: "POST",
      body: JSON.stringify({
        serviceType,
        credentials,
      }),
    });
    return response;
  }

  async validateCode(code: string): Promise<ValidationResponse> {
    try {
      const response = await apiRequest("/code/validate", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      return response;
    } catch (error) {
      console.error('Code validation error:', error);
      return {
        isValid: false,
        validations: {},
        errors: [error instanceof Error ? error.message : 'Code validation error'],
      };
    }
  }

  async syntaxCheck(code: string): Promise<ValidationResponse> {
    try {
      const response = await apiRequest("/code/syntax-check", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      return response;
    } catch (error) {
      console.error('Syntax check error:', error);
      return {
        isValid: false,
        validations: {},
        errors: [error instanceof Error ? error.message : 'Syntax check error'],
      };
    }
  }
}

export const validationService = new ValidationService();
