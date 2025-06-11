import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./slices/workflowSlice";
import nodesReducer from "./slices/nodesSlice";
import credentialsReducer from "./slices/credentialsSlice";
import validationReducer from "./slices/validationSlice";
import speechReducer from "./slices/speechSlice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    nodes: nodesReducer,
    credentials: credentialsReducer,
    validation: validationReducer,
    speech: speechReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
