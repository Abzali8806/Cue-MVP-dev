import { apiRequest } from "@/lib/queryClient";

export interface GenerateWorkflowRequest {
  description: string;
  language?: string;
}

export interface GenerateWorkflowResponse {
  workflowId: string;
  nodes: any[];
  edges: any[];
  code: string;
  requirements: string[];
  template: string;
}

export interface SaveWorkflowRequest {
  name: string;
  description: string;
  nodeData: any;
  generatedCode?: string;
}

export interface SaveWorkflowResponse {
  id: string;
  message: string;
}

class WorkflowService {
  async generateWorkflow(description: string): Promise<GenerateWorkflowResponse> {
    const response = await apiRequest("POST", "/api/workflows/generate", {
      description,
    });
    return response.json();
  }

  async saveWorkflow(workflowData: SaveWorkflowRequest): Promise<SaveWorkflowResponse> {
    const response = await apiRequest("POST", "/api/workflows", workflowData);
    return response.json();
  }

  async getWorkflow(id: string): Promise<any> {
    const response = await apiRequest("GET", `/api/workflows/${id}`);
    return response.json();
  }

  async updateWorkflow(id: string, workflowData: Partial<SaveWorkflowRequest>): Promise<SaveWorkflowResponse> {
    const response = await apiRequest("PATCH", `/api/workflows/${id}`, workflowData);
    return response.json();
  }

  async deleteWorkflow(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/workflows/${id}`);
  }

  async listWorkflows(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/workflows");
    return response.json();
  }
}

export const workflowService = new WorkflowService();
