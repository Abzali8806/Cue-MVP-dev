import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { workflowService } from "../../services/workflowService";

export interface WorkflowState {
  id: string | null;
  name: string;
  description: string;
  generatedCode: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isProcessing: boolean;
}

const initialState: WorkflowState = {
  id: null,
  name: "",
  description: "",
  generatedCode: "",
  status: "idle",
  error: null,
  isProcessing: false,
};

export const generateWorkflow = createAsyncThunk(
  "workflow/generate",
  async (description: string, { rejectWithValue }) => {
    try {
      const response = await workflowService.generateWorkflow(description);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to generate workflow");
    }
  }
);

export const saveWorkflow = createAsyncThunk(
  "workflow/save",
  async (workflowData: { name: string; description: string; nodeData: any }, { rejectWithValue }) => {
    try {
      const response = await workflowService.saveWorkflow(workflowData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to save workflow");
    }
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetWorkflow: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateWorkflow.pending, (state) => {
        state.status = "loading";
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(generateWorkflow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isProcessing = false;
        state.generatedCode = action.payload.code;
        state.id = action.payload.workflowId;
      })
      .addCase(generateWorkflow.rejected, (state, action) => {
        state.status = "failed";
        state.isProcessing = false;
        state.error = action.payload as string;
      })
      .addCase(saveWorkflow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveWorkflow.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.id = action.payload.id;
      })
      .addCase(saveWorkflow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setDescription, setName, clearError, resetWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer;
