import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setDescription } from "../../store/slices/workflowSlice";
import { useWorkflowGeneration } from "../../hooks/useWorkflowGeneration";
import { useWorkspacePersistence } from "../../hooks/useWorkspacePersistence";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";
import SpeechToText from "./SpeechToText";

export default function WorkflowInput() {
  const dispatch = useDispatch();
  const workflowState = useSelector((state: RootState) => state.workflow);
  const nodesState = useSelector((state: RootState) => state.nodes);
  const { generateWorkflowFromDescription, isGenerating, error } = useWorkflowGeneration();
  const { saveWorkspace, loadWorkspace, clearWorkspace, autoSave } = useWorkspacePersistence();
  
  const [characterCount, setCharacterCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const description = workflowState.description;
  const minLength = 0;
  const maxLength = 3000;

  // Load workspace data on component mount
  useEffect(() => {
    const savedData = loadWorkspace();
    if (savedData && savedData.workflowDescription) {
      dispatch(setDescription(savedData.workflowDescription));
      setLastSaved(savedData.lastSaved);
    }
  }, [dispatch, loadWorkspace]);

  useEffect(() => {
    setCharacterCount(description.length);
    setIsValid(description.length > 0 && description.length <= maxLength);
  }, [description, maxLength]);

  // Auto-save workspace data when description changes
  useEffect(() => {
    if (description) {
      const cleanup = autoSave({
        workflowDescription: description,
        nodes: nodesState.nodes,
        edges: nodesState.edges,
      });
      setLastSaved(new Date().toISOString());
      return cleanup;
    }
  }, [description, nodesState.nodes, nodesState.edges, autoSave]);

  const handleDescriptionChange = (value: string) => {
    dispatch(setDescription(value));
  };

  const handleGenerate = async () => {
    if (!isValid || isGenerating) return;

    try {
      await generateWorkflowFromDescription(description);
    } catch (error) {
      console.error("Failed to generate workflow:", error);
    }
  };

  const handleSpeechTranscription = (transcription: string) => {
    // Append transcription to existing description
    const separator = description.length > 0 ? " " : "";
    handleDescriptionChange(description + separator + transcription);
  };

  const handleNewWorkflow = () => {
    // Clear workspace data and reset form
    clearWorkspace();
    dispatch(setDescription(''));
  };

  const formatLastSaved = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };





  return (
    <div className="h-full flex flex-col">
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Speech-to-Text Section */}
        <SpeechToText onTranscription={handleSpeechTranscription} />

        {/* Text Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="workflow-description" className="text-xs sm:text-sm font-medium">
              Workflow Description
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNewWorkflow}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear the input and start a new workflow</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="workflow-description"
            placeholder="Example: Create a payment processing workflow that receives Stripe webhooks, validates payments, sends confirmation emails via SendGrid, and stores transaction data in DynamoDB..."
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="min-h-[100px] sm:min-h-[120px] lg:min-h-[150px] text-xs sm:text-sm resize-none focus:ring-2 focus:ring-primary/20"
            maxLength={maxLength}
          />
          
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className={`${isValid ? 'text-muted-foreground' : 'text-destructive'}`}>
                {characterCount === 0 ? 'Enter a description to generate' : 
                 characterCount > maxLength ? 'Description too long' : 'Ready to generate'}
              </span>
              {lastSaved && (
                <span className="text-muted-foreground/60">
                  • Saved {formatLastSaved(lastSaved)}
                </span>
              )}
            </div>
            {characterCount > 0 && (
              <span className={`${characterCount > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                {characterCount}/{maxLength}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            className="w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm font-medium"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Generating Workflow...</span>
                <span className="sm:hidden">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="hidden sm:inline">Generate Workflow</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-2 sm:p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-xs sm:text-sm text-destructive font-medium">Generation Failed</p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {/* Success State */}
        {workflowState.generatedCode && !isGenerating && !error && (
          <div className="p-3 sm:p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Workflow Generated Successfully!</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Your workflow is ready. Switch to the Workflow Dashboard tab to view the interactive visualization and manage credentials.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
