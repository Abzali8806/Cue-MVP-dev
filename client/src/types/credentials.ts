export interface CredentialField {
  id: string;
  serviceType: string;
  credentialType: string;
  name: string;
  description: string;
  value: string;
  isRequired: boolean;
  isValid: boolean | null;
  validationMessage: string;
  placeholder?: string;
  helpUrl?: string;
  validationPattern?: string;
}

export interface CredentialSection {
  id: string;
  serviceType: string;
  name: string;
  icon: string;
  isRequired: boolean;
  isExpanded: boolean;
  credentials: CredentialField[];
}

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

export interface CredentialValidationResult {
  credentialId: string;
  isValid: boolean;
  message: string;
  testedAt: Date;
}
