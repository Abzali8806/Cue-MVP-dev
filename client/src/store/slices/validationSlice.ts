import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { validationService } from "../../services/validationService";

export interface ValidationState {
  nodeValidations: Record<string, {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  overallValid: boolean;
  isValidating: boolean;
  lastValidationTime: number | null;
}

const initialState: ValidationState = {
  nodeValidations: {},
  overallValid: false,
  isValidating: false,
  lastValidationTime: null,
};

export const validateCredentials = createAsyncThunk(
  "validation/validateCredentials",
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await validationService.validateCredentials(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Validation failed");
    }
  }
);

export const validateWorkflow = createAsyncThunk(
  "validation/validateWorkflow",
  async (workflowData: { nodes: any[]; credentials: Record<string, string> }, { rejectWithValue }) => {
    try {
      const response = await validationService.validateWorkflow(workflowData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Workflow validation failed");
    }
  }
);

const validationSlice = createSlice({
  name: "validation",
  initialState,
  reducers: {
    setNodeValidation: (state, action: PayloadAction<{
      nodeId: string;
      isValid: boolean;
      errors: string[];
      warnings: string[];
    }>) => {
      state.nodeValidations[action.payload.nodeId] = {
        isValid: action.payload.isValid,
        errors: action.payload.errors,
        warnings: action.payload.warnings,
      };
      // Update overall validation
      state.overallValid = Object.values(state.nodeValidations).every(validation => validation.isValid);
    },
    clearValidation: (state, action: PayloadAction<string>) => {
      delete state.nodeValidations[action.payload];
      state.overallValid = Object.values(state.nodeValidations).every(validation => validation.isValid);
    },
    clearAllValidations: (state) => {
      state.nodeValidations = {};
      state.overallValid = false;
    },
    setValidationTime: (state) => {
      state.lastValidationTime = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCredentials.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateCredentials.fulfilled, (state, action) => {
        state.isValidating = false;
        state.lastValidationTime = Date.now();
        // Update validations based on response
        if (action.payload.validations) {
          Object.entries(action.payload.validations).forEach(([nodeId, validation]: [string, any]) => {
            state.nodeValidations[nodeId] = validation;
          });
        }
        state.overallValid = Object.values(state.nodeValidations).every(validation => validation.isValid);
      })
      .addCase(validateCredentials.rejected, (state) => {
        state.isValidating = false;
      })
      .addCase(validateWorkflow.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateWorkflow.fulfilled, (state, action) => {
        state.isValidating = false;
        state.lastValidationTime = Date.now();
        if (action.payload.nodeValidations) {
          state.nodeValidations = action.payload.nodeValidations;
        }
        state.overallValid = action.payload.isValid;
      })
      .addCase(validateWorkflow.rejected, (state) => {
        state.isValidating = false;
      });
  },
});

export const {
  setNodeValidation,
  clearValidation,
  clearAllValidations,
  setValidationTime,
} = validationSlice.actions;

export default validationSlice.reducer;
