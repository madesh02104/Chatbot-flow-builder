import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function SettingsPanel({ selectedNode, onNodeUpdate, onBack }) {
  const [text, setText] = useState("");

  // I'm syncing the local text state whenever a new node is selected
  // This ensures the textarea shows the current node's text content
  useEffect(() => {
    if (selectedNode) {
      setText(selectedNode.data?.text || "");
    }
  }, [selectedNode]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Making the data to be updated real time by passing the text to App.jsx which creates an immediate visual feedback loop where users see changes instantly
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { text: newText });
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            Text Message
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Text
          </label>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your message..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
          <p>
            <strong>Note:</strong> Changes are automatically saved as you type.
          </p>
        </div>
      </div>
    </div>
  );
}
