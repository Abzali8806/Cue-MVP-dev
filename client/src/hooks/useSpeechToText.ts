import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  startRecording,
  stopRecording,
  setTranscription,
  setInterimTranscript,
  setConfidence,
  setError,
  setLanguage,
  appendTranscription,
} from "../store/slices/speechSlice";
import { speechService } from "../services/speechService";

export const useSpeechToText = () => {
  const dispatch = useDispatch();
  const speechState = useSelector((state: RootState) => state.speech);

  const startListening = useCallback(async () => {
    if (!speechService.isRecognitionSupported()) {
      dispatch(setError("Speech recognition is not supported in this browser"));
      return;
    }

    try {
      dispatch(startRecording());

      speechService.startRecognition(
        speechState.language,
        (result) => {
          if (result.isFinal) {
            dispatch(setTranscription(result.transcript));
            dispatch(setConfidence(result.confidence));
          } else {
            dispatch(setInterimTranscript(result.transcript));
          }
        },
        (error) => {
          dispatch(setError(error));
        },
        () => {
          dispatch(stopRecording());
        }
      );
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to start speech recognition"));
    }
  }, [dispatch, speechState.language]);

  const stopListening = useCallback(() => {
    speechService.stopRecognition();
    dispatch(stopRecording());
  }, [dispatch]);

  const changeLanguage = useCallback((languageCode: string) => {
    dispatch(setLanguage(languageCode));
  }, [dispatch]);

  const appendToTranscription = useCallback((text: string) => {
    dispatch(appendTranscription(text));
  }, [dispatch]);

  const getSupportedLanguages = useCallback(() => {
    return speechService.getSupportedLanguages();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechState.isRecording) {
        speechService.stopRecognition();
      }
    };
  }, [speechState.isRecording]);

  return {
    isRecording: speechState.isRecording,
    isSupported: speechState.isSupported,
    transcription: speechState.transcription,
    interimTranscript: speechState.interimTranscript,
    confidence: speechState.confidence,
    language: speechState.language,
    status: speechState.status,
    error: speechState.error,
    startListening,
    stopListening,
    changeLanguage,
    appendToTranscription,
    getSupportedLanguages,
  };
};
