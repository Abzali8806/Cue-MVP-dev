import { Node, Edge } from "reactflow";

export interface CustomNodeData {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  icon: string;
  requiredCredentials: CredentialRequirement[];
  validationStatus: "pending" | "valid" | "invalid" | "warning";
  validationMessage?: string;
  isExpanded: boolean;
  credentialValues: Record<string, string>;
}

export interface CredentialRequirement {
  id: string;
  type: string;
  name: string;
  description: string;
  required: boolean;
  placeholder?: string;
  validationPattern?: string;
  helpUrl?: string;
}

export type CustomNode = Node<CustomNodeData>;
export type CustomEdge = Edge;

export interface NodeType {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultCredentials: CredentialRequirement[];
}

export const NODE_TYPES: NodeType[] = [
  {
    type: "webhook",
    name: "Webhook Receiver",
    description: "Receives and validates webhook payloads",
    icon: "webhook",
    category: "Input",
    defaultCredentials: [
      {
        id: "webhook_secret",
        type: "password",
        name: "Webhook Secret",
        description: "Secret key for webhook verification",
        required: true,
        placeholder: "whsec_...",
      },
    ],
  },
  {
    type: "payment_processor",
    name: "Payment Processor",
    description: "Processes payment transactions",
    icon: "payment",
    category: "Payment",
    defaultCredentials: [
      {
        id: "stripe_secret_key",
        type: "password",
        name: "Stripe Secret Key",
        description: "Your Stripe secret API key",
        required: true,
        placeholder: "sk_test_...",
        helpUrl: "/help/stripe-credentials",
      },
    ],
  },
  {
    type: "email_sender",
    name: "Email Sender",
    description: "Sends emails via external service",
    icon: "email",
    category: "Communication",
    defaultCredentials: [
      {
        id: "sendgrid_api_key",
        type: "password",
        name: "SendGrid API Key",
        description: "Your SendGrid API key",
        required: true,
        placeholder: "SG...",
        helpUrl: "/help/sendgrid-credentials",
      },
    ],
  },
  {
    type: "database_writer",
    name: "Database Writer",
    description: "Stores data in database",
    icon: "storage",
    category: "Storage",
    defaultCredentials: [
      {
        id: "aws_access_key",
        type: "text",
        name: "AWS Access Key ID",
        description: "AWS access key for DynamoDB",
        required: false,
        placeholder: "AKIA...",
      },
      {
        id: "aws_secret_key",
        type: "password",
        name: "AWS Secret Access Key",
        description: "AWS secret key for DynamoDB",
        required: false,
        placeholder: "...",
      },
    ],
  },
];
