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
    <div className="flex items-center space-x-2 sm:space-x-3">
      {/* Microphone Button */}
      <Button
        onClick={handleToggleRecording}
        size="sm"
        variant="ghost"
        className={cn(
          "h-10 w-10 rounded-full flex-shrink-0",
          isRecording 
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        {isRecording ? (
          <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
        ) : (
          <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
      </Button>

      {/* Status Display */}
      {isRecording && (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="hidden sm:inline">Listening...</span>
              <span className="sm:hidden">Rec</span>
            </span>
          </div>
          {confidence > 0 && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      )}

      {/* Language Selector - Only show when not recording and on larger screens */}
      {!isRecording && (
        <div className="hidden sm:block">
          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-20 sm:w-24 h-7 sm:h-8 text-xs border-0 bg-transparent">
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
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-1 text-red-500">
          <AlertCircle className="h-3 w-3" />
          <span className="text-xs hidden sm:inline">Error</span>
        </div>
      )}

      {/* Transcription Popup */}
      {(transcription || interimTranscript) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Transcription</div>
            <p className="text-sm">
              {transcription && (
                <span className="text-gray-900 dark:text-gray-100">{transcription}</span>
              )}
              {interimTranscript && (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  {transcription && " "}
                  {interimTranscript}
                </span>
              )}
            </p>
            
            {transcription && !hasTranscribed && (
              <Button 
                onClick={handleUseTranscription}
                size="sm"
                className="w-full h-7 text-xs"
              >
                Use This Transcription
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
