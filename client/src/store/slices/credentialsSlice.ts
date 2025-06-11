import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CredentialField {
  id: string;
  serviceType: string;
  credentialType: string;
  value: string;
  isRequired: boolean;
  isValid: boolean | null;
  validationMessage: string;
}

export interface CredentialsState {
  credentials: Record<string, CredentialField>;
  expandedSections: Record<string, boolean>;
  validationInProgress: Record<string, boolean>;
}

const initialState: CredentialsState = {
  credentials: {},
  expandedSections: {},
  validationInProgress: {},
};

const credentialsSlice = createSlice({
  name: "credentials",
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<CredentialField>) => {
      state.credentials[action.payload.id] = action.payload;
    },
    updateCredentialValue: (state, action: PayloadAction<{ id: string; value: string }>) => {
      if (state.credentials[action.payload.id]) {
        state.credentials[action.payload.id].value = action.payload.value;
        state.credentials[action.payload.id].isValid = null; // Reset validation status
      }
    },
    setCredentialValidation: (state, action: PayloadAction<{ id: string; isValid: boolean; message: string }>) => {
      if (state.credentials[action.payload.id]) {
        state.credentials[action.payload.id].isValid = action.payload.isValid;
        state.credentials[action.payload.id].validationMessage = action.payload.message;
      }
    },
    toggleSection: (state, action: PayloadAction<string>) => {
      state.expandedSections[action.payload] = !state.expandedSections[action.payload];
    },
    setValidationInProgress: (state, action: PayloadAction<{ id: string; inProgress: boolean }>) => {
      state.validationInProgress[action.payload.id] = action.payload.inProgress;
    },
    clearCredentials: (state) => {
      state.credentials = {};
      state.expandedSections = {};
      state.validationInProgress = {};
    },
    initializeCredentials: (state, action: PayloadAction<CredentialField[]>) => {
      state.credentials = {};
      action.payload.forEach(credential => {
        state.credentials[credential.id] = credential;
      });
    },
  },
});

export const {
  setCredential,
  updateCredentialValue,
  setCredentialValidation,
  toggleSection,
  setValidationInProgress,
  clearCredentials,
  initializeCredentials,
} = credentialsSlice.actions;

export default credentialsSlice.reducer;
