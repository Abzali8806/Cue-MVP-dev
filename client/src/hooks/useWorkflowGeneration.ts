import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { generateWorkflow, saveWorkflow } from "../store/slices/workflowSlice";
import { setNodes, setEdges, clearNodes } from "../store/slices/nodesSlice";
import { initializeCredentials } from "../store/slices/credentialsSlice";
import { clearAllValidations } from "../store/slices/validationSlice";
import { type CredentialRequirement } from "../types/node";

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
      console.error("Failed to generate workflow:", error);
      throw error;
    }
  }, [dispatch]);

  const saveCurrentWorkflow = useCallback(async (name: string, description: string) => {
    try {
      const workflowData = {
        name,
        description,
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

  return {
    isGenerating: workflowState.isProcessing,
    error: workflowState.error,
    generatedCode: workflowState.generatedCode,
    generateWorkflowFromDescription,
    saveCurrentWorkflow,
  };
};