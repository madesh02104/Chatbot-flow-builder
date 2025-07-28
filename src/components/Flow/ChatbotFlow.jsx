import {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TextMessageNode from "./nodes/TextMessageNode";
import { validateFlow } from "../../utils/flowValidation";

// I'm defining custom node types here so ReactFlow knows how to render them
// This makes the system extensible - we can easily add new node types later
const nodeTypes = {
  textMessage: TextMessageNode,
};

const initialNodes = [
  {
    id: "1",
    type: "textMessage",
    position: { x: 250, y: 100 },
    data: { text: "Start Message" },
  },
];

const initialEdges = [];

const ChatbotFlow = forwardRef(({ onNodeSelect, onSave }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // Tracking which nodes have validation errors so I can highlight them visually
  const [errorNodeIds, setErrorNodeIds] = useState([]);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  useImperativeHandle(ref, () => ({
    updateNodeData: (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );

      if (errorNodeIds.includes(nodeId)) {
        setErrorNodeIds((prev) => prev.filter((id) => id !== nodeId));
      }
    },
    addNode: (newNode) => {
      setNodes((nds) => nds.concat(newNode));
    },
  }));

  const nodesWithErrorState = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      hasError: errorNodeIds.includes(node.id),
    },
  }));

  const onConnect = useCallback(
    (params) => {
      const sourceEdges = edges.filter((edge) => edge.source === params.source);
      if (sourceEdges.length > 0) {
        return; // Prevent connection if source already has an outgoing edge
      }

      setEdges((eds) => addEdge(params, eds));

      if (errorNodeIds.includes(params.target)) {
        setErrorNodeIds((prev) => prev.filter((id) => id !== params.target));
      }
    },
    [edges, setEdges, errorNodeIds]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      // I'm passing the selected node up to App.jsx to show the settings panel
      // This creates a clean separation between flow logic and UI state
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // I'm getting the node type from the drag data set in NodesPanel
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { text: "New message" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const handleSave = useCallback(() => {
    // The validation returns both success state and which nodes have issues
    const validation = validateFlow(nodes, edges);
    if (validation.valid) {
      // Clear any existing error highlighting
      setErrorNodeIds([]);

      const flowData = { nodes, edges };
      localStorage.setItem("chatbot-flow", JSON.stringify(flowData));
      onSave(true, "Flow saved successfully!");
    } else {
      setErrorNodeIds(validation.errorNodeIds);
      onSave(false, validation.error);
    }
  }, [nodes, edges, onSave]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesWithErrorState}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Flow
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
});

ChatbotFlow.displayName = "ChatbotFlow";

export default ChatbotFlow;
