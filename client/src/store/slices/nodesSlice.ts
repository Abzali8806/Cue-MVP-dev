import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge } from "reactflow";

export interface NodesState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  viewport: { x: number; y: number; zoom: number };
}

const initialState: NodesState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
};

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const nodeIndex = state.nodes.findIndex(node => node.id === action.payload.id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex].data = { ...state.nodes[nodeIndex].data, ...action.payload.data };
      }
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    setViewport: (state, action: PayloadAction<{ x: number; y: number; zoom: number }>) => {
      state.viewport = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
      state.edges = state.edges.filter(edge => edge.source !== action.payload && edge.target !== action.payload);
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    clearNodes: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
    },
  },
});

export const {
  setNodes,
  setEdges,
  updateNode,
  setSelectedNode,
  setViewport,
  addNode,
  removeNode,
  addEdge,
  clearNodes,
} = nodesSlice.actions;

export default nodesSlice.reducer;
