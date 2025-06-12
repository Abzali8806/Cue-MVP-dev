import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { generateWorkflow, saveWorkflow } from "../store/slices/workflowSlice";
import { setDescription } from "../store/slices/workflowSlice";
import { setNodes, setEdges, clearNodes } from "../store/slices/nodesSlice";
import { initializeCredentials } from "../store/slices/credentialsSlice";
import { clearAllValidations } from "../store/slices/validationSlice";
import { NODE_TYPES, type CredentialRequirement } from "../types/node";

export const useWorkflowGeneration = () => {
  const dispatch = useDispatch();
  const workflowState = useSelector((state: RootState) => state.workflow);
  const nodesState = useSelector((state: RootState) => state.nodes);

  const generateWorkflowFromDescription = useCallback(async (description: string) => {
    try {
      // Clear existing data
      dispatch(clearNodes());
      dispatch(clearAllValidations());

      // Generate workflow
      const result = await dispatch(generateWorkflow(description) as any).unwrap();

      // Parse and set nodes
      if (result.nodes && result.edges) {
        const processedNodes = result.nodes.map((node: any) => ({
          id: node.id,
          type: 'custom',
          position: node.position || { x: 0, y: 0 },
          data: {
            ...node,
            validationStatus: 'pending' as const,
            isExpanded: false,
            credentialValues: {},
          },
        }));

        dispatch(setNodes(processedNodes));
        dispatch(setEdges(result.edges));

        // Initialize credentials based on nodes
        const allCredentials = result.nodes.flatMap((node: any) => 
          (node.requiredCredentials || []).map((cred: CredentialRequirement) => ({
            id: `${node.id}_${cred.id}`,
            serviceType: node.serviceType,
            credentialType: cred.type,
            name: cred.name,
            description: cred.description,
            value: '',
            isRequired: cred.required,
            isValid: null,
            validationMessage: '',
            placeholder: cred.placeholder,
            helpUrl: cred.helpUrl,
            validationPattern: cred.validationPattern,
          }))
        );

        dispatch(initializeCredentials(allCredentials));
      }

      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const saveCurrentWorkflow = useCallback(async (name: string) => {
    try {
      const workflowData = {
        name,
        description: workflowState.description,
        nodeData: {
          nodes: nodesState.nodes,
          edges: nodesState.edges,
        },
        generatedCode: workflowState.generatedCode,
      };

      const result = await dispatch(saveWorkflow(workflowData) as any).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch, workflowState, nodesState]);

  const createSampleWorkflow = useCallback(() => {
    // Set sample description
    dispatch(setDescription("Create an e-commerce order processing workflow that receives Stripe payment webhooks, validates transactions, sends confirmation emails through SendGrid, updates inventory in a database, and triggers fulfillment notifications."));
    
    // Create a comprehensive sample workflow
    const sampleNodes = [
      {
        id: 'webhook-1',
        type: 'custom',
        position: { x: 50, y: 100 },
        data: {
          id: 'webhook-1',
          name: 'Payment Webhook',
          description: 'Receives Stripe payment confirmation webhooks',
          serviceType: 'stripe',
          icon: 'webhook',
          requiredCredentials: [
            {
              id: 'stripe_webhook_secret',
              type: 'password',
              name: 'Webhook Endpoint Secret',
              description: 'Secret key for validating Stripe webhook signatures',
              required: true,
              placeholder: 'whsec_1a2b3c4d...',
              helpUrl: 'https://stripe.com/docs/webhooks/signatures',
            },
          ],
          validationStatus: 'pending' as const,
          isExpanded: false,
          credentialValues: {},
        },
      },
      {
        id: 'payment-1',
        type: 'custom',
        position: { x: 400, y: 100 },
        data: {
          id: 'payment-1',
          name: 'Payment Validator',
          description: 'Validates payment information and status',
          serviceType: 'stripe',
          icon: 'verified',
          requiredCredentials: [
            {
              id: 'stripe_secret_key',
              type: 'password',
              name: 'Stripe Secret Key',
              description: 'Your Stripe secret API key',
              required: true,
              placeholder: 'sk_test_...',
              helpUrl: '/help/stripe-credentials',
            },
          ],
          validationStatus: 'pending' as const,
          isExpanded: false,
          credentialValues: {},
        },
      },
      {
        id: 'email-1',
        type: 'custom',
        position: { x: 750, y: 200 },
        data: {
          id: 'email-1',
          name: 'Email Sender',
          description: 'Sends confirmation emails via SendGrid',
          serviceType: 'sendgrid',
          icon: 'email',
          requiredCredentials: [
            {
              id: 'sendgrid_api_key',
              type: 'password',
              name: 'SendGrid API Key',
              description: 'Your SendGrid API key',
              required: true,
              placeholder: 'SG...',
              helpUrl: '/help/sendgrid-credentials',
            },
          ],
          validationStatus: 'invalid' as const,
          isExpanded: false,
          credentialValues: {},
        },
      },
      {
        id: 'database-1',
        type: 'custom',
        position: { x: 400, y: 350 },
        data: {
          id: 'database-1',
          name: 'Database Writer',
          description: 'Stores transaction records in DynamoDB',
          serviceType: 'dynamodb',
          icon: 'storage',
          requiredCredentials: [
            {
              id: 'aws_access_key',
              type: 'text',
              name: 'AWS Access Key ID',
              description: 'AWS access key for DynamoDB',
              required: false,
              placeholder: 'AKIA...',
            },
            {
              id: 'aws_secret_key',
              type: 'password',
              name: 'AWS Secret Access Key',
              description: 'AWS secret key for DynamoDB',
              required: false,
              placeholder: '...',
            },
          ],
          validationStatus: 'warning' as const,
          isExpanded: false,
          credentialValues: {},
        },
      },
    ];

    const sampleEdges = [
      {
        id: 'e1-2',
        source: 'webhook-1',
        target: 'payment-1',
        type: 'smoothstep',
      },
      {
        id: 'e2-3',
        source: 'payment-1',
        target: 'email-1',
        type: 'smoothstep',
      },
      {
        id: 'e2-4',
        source: 'payment-1',
        target: 'database-1',
        type: 'smoothstep',
      },
    ];

    dispatch(setNodes(sampleNodes));
    dispatch(setEdges(sampleEdges));

    // Initialize credentials for sample nodes
    const sampleCredentials = sampleNodes.flatMap(node => 
      node.data.requiredCredentials.map((cred: any) => ({
        id: `${node.id}_${cred.id}`,
        serviceType: node.data.serviceType,
        credentialType: cred.type,
        name: cred.name,
        description: cred.description,
        value: '',
        isRequired: cred.required,
        isValid: null,
        validationMessage: '',
        placeholder: cred.placeholder,
        helpUrl: cred.helpUrl,
        validationPattern: cred.validationPattern,
      }))
    );

    dispatch(initializeCredentials(sampleCredentials));
  }, [dispatch]);

  return {
    isGenerating: workflowState.isProcessing,
    error: workflowState.error,
    generatedCode: workflowState.generatedCode,
    generateWorkflowFromDescription,
    saveCurrentWorkflow,
    createSampleWorkflow,
  };
};
