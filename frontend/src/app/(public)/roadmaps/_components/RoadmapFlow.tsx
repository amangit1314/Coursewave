import { Check, Clock, Plus } from "lucide-react";
import { useEffect, useCallback } from "react";
import ReactFlow, {
  Node,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  OnNodesChange,
  OnEdgesChange,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

// This file contains a React component for a flow-based roadmap visualization.
// It uses the `reactflow` library to display nodes and edges.

// Define node types outside the component to prevent re-creation on every render.
// This addresses the "new nodeTypes object" warning.
const nodeTypes = {
  custom: CustomNode,
};

// Main component to display the roadmap flow.
export function RoadmapFlowView({ roadmap, progress, onToggleProgress }: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // This effect synchronizes the internal React Flow state with the external roadmap data.
  // It runs whenever the `roadmap` or `progress` props change.
  // NOTE: The 'onToggleProgress' prop must be wrapped in 'useCallback' in the parent
  // component to prevent the 'useEffect' from re-running unnecessarily and causing
  // a console warning about changing dependencies.
  useEffect(() => {
    if (roadmap && roadmap.nodes && roadmap.edges) {
      // Map over the roadmap nodes to add the 'completed' status from the progress data.
      // Also, ensure nodes have a position, as ReactFlow requires this for rendering.
      const newNodes = roadmap.nodes.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          completed: progress[node.id],
          onToggleProgress, // Pass the toggle function down to the node component
        },
        // We set a default position if one isn't provided. This ensures nodes are visible.
        position: node.position || { x: Math.random() * 500, y: Math.random() * 300 },
        type: 'custom', // We explicitly set the type to 'custom'
      }));

      // Map over the roadmap edges.
      // We are adding a unique 'key' prop to each edge to fix the console warning.
      const newEdges = roadmap.edges.map((edge: any) => ({
        ...edge,
        key: edge.id, // Assign the unique id as the key
        markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' },
        style: { strokeWidth: 2, stroke: '#9ca3af' }, // Default styling for the edges
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [roadmap, progress, onToggleProgress]);

  // If there's no roadmap data, display a loading message.
  if (!roadmap || nodes.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Awaiting roadmap data...</p>
      </div>
    );
  }

  // The ReactFlow component renders the nodes and edges.
  return (
    <div className="h-[70vh] w-full rounded-lg border-2 border-gray-200 dark:border-zinc-600">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange as OnEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        {/* The Background component defaults to "dots" if no variant is provided. */}
        <Background color="#ccc" />
        <Controls />
      </ReactFlow>
    </div>
  );
}

// CustomNode component to render each roadmap step with clearer text.
function CustomNode({ data }: NodeProps) {
  // Use a guard clause to prevent rendering if data is missing.
  if (!data) {
    return null;
  }

  // Define a function to toggle the completion status.
  const handleToggle = useCallback(() => {
    if (data.onToggleProgress) {
      data.onToggleProgress(data.id);
    }
  }, [data]);

  return (
    <div
      className={`p-4 rounded-lg shadow-md border-2 max-w-sm ${
        data.completed
          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
          : "border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800"
      }`}
    >
      {/* Handle for incoming edges */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      
      <div className="flex justify-between items-start">
        {/* Display title with a fallback text if it's missing */}
        <h3 className="font-bold text-lg">{data.title || "Untitled Step"}</h3>
        <button
          onClick={handleToggle}
          className={`p-1 rounded-full transition-colors duration-200 ${
            data.completed
              ? "text-green-500 bg-green-100 dark:bg-green-900/30"
              : "text-gray-400 bg-gray-100 dark:bg-zinc-700"
          }`}
        >
          {data.completed ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Add a description field for more detail if available */}
      {data.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {data.description}
        </p>
      )}

      {/* Display estimated time with a clearer label */}
      <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
        Estimated Time: {data.estimatedTime || 'N/A'}
      </p>

      {/* Handle for outgoing edges */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
    </div>
  );
}
