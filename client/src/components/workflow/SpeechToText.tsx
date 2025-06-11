import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { cn } from "@/lib/utils";

interface SpeechToTextProps {
  onTranscription: (text: string) => void;
}

export default function SpeechToText({ onTranscription }: SpeechToTextProps) {
  const {
    isRecording,
    isSupported,
    transcription,
    interimTranscript,
    confidence,
    language,
    status,
    error,
    startListening,
    stopListening,
    changeLanguage,
    getSupportedLanguages,
  } = useSpeechToText();

  const [hasTranscribed, setHasTranscribed] = useState(false);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleUseTranscription = () => {
    if (transcription) {
      onTranscription(transcription);
      setHasTranscribed(true);
    }
  };

  const supportedLanguages = getSupportedLanguages();

  if (!isSupported) {
    return (
      <Alert className="border-warning bg-warning/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice input.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border border-border rounded-lg bg-muted/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <Label className="text-xs sm:text-sm font-medium">Voice Input</Label>
        <Select value={language} onValueChange={changeLanguage}>
          <SelectTrigger className="w-full sm:w-32 lg:w-40 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Microphone Button */}
        <Button
          onClick={handleToggleRecording}
          size="lg"
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0",
            isRecording 
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>

        {/* Status and Progress */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm truncate">
              <span className="hidden sm:inline">Status: </span>
              <span className={cn(
                "font-medium",
                status === "listening" && "text-blue-600",
                status === "processing" && "text-orange-600",
                status === "completed" && "text-green-600",
                status === "error" && "text-red-600"
              )}>
                {status === "idle" && "Ready"}
                {status === "listening" && "Listening..."}
                {status === "processing" && "Processing..."}
                {status === "completed" && "Complete"}
                {status === "error" && "Error"}
              </span>
            </span>
            
            {confidence > 0 && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
          
          <Progress 
            value={isRecording ? (confidence * 100) : 0} 
            className="h-2"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Transcription Display */}
      {(transcription || interimTranscript) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Transcription</Label>
          <div className="p-3 bg-background border border-border rounded-md min-h-[60px]">
            <p className="text-sm">
              {transcription && (
                <span className="text-foreground">{transcription}</span>
              )}
              {interimTranscript && (
                <span className="text-muted-foreground italic">
                  {transcription && " "}
                  {interimTranscript}
                </span>
              )}
            </p>
          </div>
          
          {transcription && !hasTranscribed && (
            <Button 
              onClick={handleUseTranscription}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Use This Transcription
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
