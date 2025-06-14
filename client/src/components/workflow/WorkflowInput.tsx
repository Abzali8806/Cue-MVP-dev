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
    <div className="w-full space-y-6">
      {/* Minimal Guide Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Describe your workflow below - additional sections will appear once generated
        </p>
      </div>

      {/* Main Input Container */}
      <div className="space-y-4">
        {/* Large Text Input */}
        <div className="relative">
          <Textarea
            id="workflow-description"
            placeholder="Describe your automation workflow in natural language..."
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="w-full min-h-[140px] text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 resize-none p-4 bg-white dark:bg-gray-800 placeholder:text-gray-400"
            maxLength={maxLength}
          />
          
          {/* Character Count in Corner */}
          {characterCount > 0 && (
            <div className="absolute bottom-3 right-4 text-xs text-gray-400">
              {characterCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Bottom Action Row - All elements aligned horizontally */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Side - Voice Input and Save Status */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <SpeechToText onTranscription={handleSpeechTranscription} />
            {lastSaved && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                Saved {formatLastSaved(lastSaved)}
              </span>
            )}
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNewWorkflow}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear and start new</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleGenerate}
              disabled={!isValid || isGenerating}
              className="h-10 px-4 sm:px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Gen...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Save Status */}
        {lastSaved && (
          <div className="sm:hidden text-center">
            <span className="text-xs text-gray-400">
              Saved {formatLastSaved(lastSaved)}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success State */}
        {workflowState.generatedCode && !isGenerating && !error && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Workflow generated successfully! Scroll down to see the visualization and code.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
