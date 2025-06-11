import { apiRequest } from "@/lib/queryClient";

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface AzureSpeechConfig {
  subscriptionKey: string;
  region: string;
  language: string;
}

class SpeechService {
  private recognition: any = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (this.isSupported) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
  }

  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  startRecognition(
    language: string = 'en-US',
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    this.recognition.lang = language;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          onResult({
            transcript: finalTranscript,
            confidence: confidence || 0.8,
            isFinal: true,
          });
        } else {
          interimTranscript += transcript;
          onResult({
            transcript: interimTranscript,
            confidence: confidence || 0.5,
            isFinal: false,
          });
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError('Failed to start speech recognition');
    }
  }

  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Fallback to Azure Speech Services
  async transcribeWithAzure(audioBlob: Blob, config: AzureSpeechConfig): Promise<{
    transcript: string;
    confidence: number;
  }> {
    try {
      const response = await apiRequest("POST", "/api/speech/azure-transcribe", {
        audio: await this.blobToBase64(audioBlob),
        config,
      });
      return response.json();
    } catch (error) {
      throw new Error(`Azure Speech Service error: ${error}`);
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Get available languages
  getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'es-MX', name: 'Spanish (Mexico)' },
      { code: 'fr-FR', name: 'French (France)' },
      { code: 'de-DE', name: 'German (Germany)' },
      { code: 'it-IT', name: 'Italian (Italy)' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
    ];
  }
}

export const speechService = new SpeechService();
