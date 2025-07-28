import { MessageCircle } from "lucide-react";

export default function NodesPanel({ onNodeAdd }) {
  // I'm implementing drag functionality by setting drag data
  // This data will be picked up by the ChatbotFlow component's onDrop handler
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // I'm providing an alternative to dragging for users who prefer clicking
  // Some users find click-to-add more intuitive than drag and drop
  const handleAddNode = (nodeType) => {
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: {
        x: Math.random() * 400 + 100, // Random X between 100-500
        y: Math.random() * 300 + 100, // Random Y between 100-400
      },
      data: { text: "New message" },
    };
    onNodeAdd(newNode);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Nodes</h3>

      <div className="space-y-3">
        <div
          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 transition-colors"
          draggable
          onDragStart={(event) => onDragStart(event, "textMessage")}
          onClick={() => handleAddNode("textMessage")}
        >
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <div>
            <div className="font-medium text-sm text-gray-800">
              Text Message
            </div>
            <div className="text-xs text-gray-500">Send a text message</div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <p>
          <strong>Tip:</strong> Drag nodes to the canvas or click to add them at
          a random position.
        </p>
      </div>
    </div>
  );
}
