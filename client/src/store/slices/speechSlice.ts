import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SpeechState {
  isRecording: boolean;
  isSupported: boolean;
  transcription: string;
  confidence: number;
  language: string;
  status: "idle" | "listening" | "processing" | "completed" | "error";
  error: string | null;
  interimTranscript: string;
  finalTranscript: string;
}

const initialState: SpeechState = {
  isRecording: false,
  isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  transcription: "",
  confidence: 0,
  language: "en-US",
  status: "idle",
  error: null,
  interimTranscript: "",
  finalTranscript: "",
};

const speechSlice = createSlice({
  name: "speech",
  initialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.status = "listening";
      state.error = null;
      state.interimTranscript = "";
    },
    stopRecording: (state) => {
      state.isRecording = false;
      state.status = "processing";
    },
    setTranscription: (state, action: PayloadAction<string>) => {
      state.transcription = action.payload;
      state.finalTranscript = action.payload;
      state.status = "completed";
    },
    setInterimTranscript: (state, action: PayloadAction<string>) => {
      state.interimTranscript = action.payload;
    },
    setConfidence: (state, action: PayloadAction<number>) => {
      state.confidence = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "error";
      state.isRecording = false;
    },
    clearTranscription: (state) => {
      state.transcription = "";
      state.finalTranscript = "";
      state.interimTranscript = "";
      state.confidence = 0;
      state.status = "idle";
    },
    appendTranscription: (state, action: PayloadAction<string>) => {
      const separator = state.transcription.length > 0 ? " " : "";
      state.transcription = state.transcription + separator + action.payload;
      state.finalTranscript = state.transcription;
    },
    resetSpeech: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  startRecording,
  stopRecording,
  setTranscription,
  setInterimTranscript,
  setConfidence,
  setLanguage,
  setError,
  clearTranscription,
  appendTranscription,
  resetSpeech,
} = speechSlice.actions;

export default speechSlice.reducer;
