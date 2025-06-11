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
  const minLength = 50;
  const maxLength = 2000;

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
    <Card className="border-0 shadow-none rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Describe Your Workflow</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Speech-to-Text Section */}
        <SpeechToText onTranscription={handleSpeechTranscription} />

        {/* Text Input Section */}
        <div className="space-y-2">
          <Label htmlFor="workflow-description" className="text-sm font-medium">
            Workflow Description
          </Label>
          <Textarea
            id="workflow-description"
            placeholder="Describe your workflow in natural language... For example: 'Create a Lambda function that processes uploaded images, resizes them, and stores them in S3'"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary"
            maxLength={maxLength}
          />
          
          <div className="flex justify-between items-center text-xs">
            <span className={characterCount < minLength ? "text-destructive" : "text-muted-foreground"}>
              {characterCount} characters
            </span>
            <span className="text-muted-foreground">
              Min: {minLength}, Max: {maxLength}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={!isValid || isGenerating}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Workflow...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Workflow
            </>
          )}
        </Button>

        {/* Validation Messages */}
        {description.length > 0 && description.length < minLength && (
          <p className="text-xs text-destructive">
            Description must be at least {minLength} characters long.
          </p>
        )}
        
        {description.length > maxLength && (
          <p className="text-xs text-destructive">
            Description must be no more than {maxLength} characters long.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
