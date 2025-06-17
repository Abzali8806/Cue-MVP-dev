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
    return await apiRequest("/workflows/generate", {
      method: "POST",
      body: JSON.stringify({ description }),
    });
  }

  async saveWorkflow(workflowData: SaveWorkflowRequest): Promise<SaveWorkflowResponse> {
    return await apiRequest("/workflows", {
      method: "POST",
      body: JSON.stringify(workflowData),
    });
  }

  async getWorkflow(id: string): Promise<any> {
    return await apiRequest(`/workflows/${id}`);
  }

  async updateWorkflow(id: string, workflowData: Partial<SaveWorkflowRequest>): Promise<SaveWorkflowResponse> {
    return await apiRequest(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(workflowData),
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    await apiRequest(`/workflows/${id}`, {
      method: "DELETE",
    });
  }

  async listWorkflows(userId: string): Promise<any[]> {
    return await apiRequest(`/workflows/user/${userId}`);
  }
}

export const workflowService = new WorkflowService();
