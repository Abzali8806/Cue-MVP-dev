export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description: string;
  serviceType: string;
  requiredCredentials: CredentialRequirement[];
  position: { x: number; y: number };
  data: any;
}

export interface CredentialRequirement {
  type: string;
  name: string;
  description: string;
  required: boolean;
  validationPattern?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface GeneratedWorkflow {
  id: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  code: string;
  requirements: string[];
  deploymentTemplate: string;
}

export interface WorkflowValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  nodeValidations: Record<string, NodeValidation>;
}

export interface NodeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  credentialValidations: Record<string, boolean>;
}
