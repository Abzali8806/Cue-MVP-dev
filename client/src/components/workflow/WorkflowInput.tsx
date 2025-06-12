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
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary animate-pulse" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cue AI
            </h1>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
            Transform Ideas into AWS Lambda Code in Minutes
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Simply describe your workflow in plain English, and Cue instantly generates production-ready AWS Lambda functions with complete deployment instructions. 
            No coding required - just speak or type what you need, and watch your serverless infrastructure come to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Speech-to-text input
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Visual workflow builder
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
          <div className="p-2 sm:p-3 border border-green-200 bg-green-50 rounded-md">
            <p className="text-xs sm:text-sm text-green-700 font-medium">Workflow Generated!</p>
            <p className="text-xs text-green-600 mt-1">
              Workflow created successfully. Check the Visualization tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
