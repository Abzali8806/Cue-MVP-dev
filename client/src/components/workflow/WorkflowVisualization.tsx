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
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

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

  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  };

  return (
    <div className="relative w-full h-full bg-workflow-background" style={{ minHeight: '400px' }}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur-sm rounded-lg p-2 border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Workflow Visualization</h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitView}
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
          className="bg-surface border-border"
        />
        <MiniMap 
          position="top-right"
          className="bg-surface border border-border"
          nodeColor={(node: Node) => {
            switch (node.data?.validationStatus) {
              case 'valid': return 'hsl(122, 39%, 49%)';
              case 'invalid': return 'hsl(0, 84.2%, 60.2%)';
              case 'warning': return 'hsl(38, 92%, 50%)';
              default: return 'hsl(231, 48%, 48%)';
            }
          }}
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
