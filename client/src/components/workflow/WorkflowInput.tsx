import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setDescription } from "../../store/slices/workflowSlice";
import { useWorkflowGeneration } from "../../hooks/useWorkflowGeneration";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import SpeechToText from "./SpeechToText";

export default function WorkflowInput() {
  const dispatch = useDispatch();
  const workflowState = useSelector((state: RootState) => state.workflow);
  const { generateWorkflowFromDescription, isGenerating, error } = useWorkflowGeneration();
  
  const [characterCount, setCharacterCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const description = workflowState.description;
  const minLength = 0;
  const maxLength = 8000;

  useEffect(() => {
    setCharacterCount(description.length);
    setIsValid(description.length >= minLength && description.length <= maxLength);
  }, [description, minLength, maxLength]);

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

  return (
    <div className="h-full flex flex-col">
      {/* Hero Section */}
      <div className="p-4 sm:p-6 lg:p-8 border-b border-border bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Speak It. Build It. Deploy It.
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-muted-foreground">
              Effortless workflow automation from prompt to deployment with <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cue</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Speech-to-text input
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Visual workflow generator
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              One-click deployment
            </span>
          </div>
        </div>
      </div>
      
      {/* Input Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-border bg-surface/50">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold">Describe Your Workflow</h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tell Cue what you want to build in natural language, and we'll handle the rest.
        </p>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
        {/* Speech-to-Text Section */}
        <SpeechToText onTranscription={handleSpeechTranscription} />

        {/* Text Input Section */}
        <div className="space-y-2">
          <Label htmlFor="workflow-description" className="text-xs sm:text-sm font-medium">
            Workflow Description
          </Label>
          <Textarea
            id="workflow-description"
            placeholder="Example: Create a payment processing workflow that receives Stripe webhooks, validates payments, sends confirmation emails via SendGrid, and stores transaction data in DynamoDB..."
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="min-h-[100px] sm:min-h-[120px] lg:min-h-[150px] text-xs sm:text-sm resize-none focus:ring-2 focus:ring-primary/20"
            maxLength={maxLength}
          />
          
          <div className="flex justify-between items-center text-xs">
            <span className={`${isValid ? 'text-muted-foreground' : 'text-destructive'}`}>
              {characterCount > maxLength ? 'Too many characters' : 'Ready to generate'}
            </span>
            <span className={`${characterCount > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
              {characterCount}/{maxLength}
            </span>
          </div>
        </div>

        {/* Generate Button */}
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
