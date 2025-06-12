import { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { RootState } from "../../store";
import { setNodes as setStoreNodes, setEdges as setStoreEdges, setViewport } from "../../store/slices/nodesSlice";
import CustomNode from "../nodes/CustomNode";


const nodeTypes = {
  custom: CustomNode,
};

export default function WorkflowVisualization() {
  const dispatch = useDispatch();
  const { nodes: storeNodes, edges: storeEdges, viewport } = useSelector((state: RootState) => state.nodes);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Sync with Redux store
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = addEdge({ ...params, type: 'smoothstep' }, edges);
      setEdges(newEdge);
      dispatch(setStoreEdges(newEdge));
    },
    [edges, setEdges, dispatch]
  );

  const onNodeDragStop = useCallback(() => {
    dispatch(setStoreNodes(nodes));
  }, [nodes, dispatch]);

  const onViewportChange = useCallback(
    (viewport: any) => {
      dispatch(setViewport(viewport));
    },
    [dispatch]
  );



  return (
    <div className="relative w-full h-full bg-workflow-background" style={{ minHeight: '400px' }}>




      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        defaultViewport={viewport}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
      >
        <Controls 
          position="bottom-right"
          className="bg-surface/80 backdrop-blur-sm border-border shadow-sm"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap 
          position="top-right"
          className="bg-surface/80 backdrop-blur-sm border border-border shadow-sm"
          nodeColor={(node: Node) => {
            switch (node.data?.validationStatus) {
              case 'valid': return 'hsl(122, 39%, 49%)';
              case 'invalid': return 'hsl(0, 84.2%, 60.2%)';
              case 'warning': return 'hsl(38, 92%, 50%)';
              default: return 'hsl(231, 48%, 48%)';
            }
          }}
          nodeStrokeWidth={2}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background color="var(--border)" gap={16} />
      </ReactFlow>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">No Workflow Generated</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter a workflow description and click "Generate Workflow" to see the visualization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
