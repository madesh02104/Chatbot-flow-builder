import { useState, useCallback, useRef } from "react";
import { ReactFlowProvider } from "@xyflow/react";

import ChatbotFlow from "./components/Flow/ChatbotFlow";
import NodesPanel from "./components/Sidebar/NodesPanel";
import SettingsPanel from "./components/Sidebar/SettingsPanel";

export default function App() {
  // I'm managing the selected node at the App level to control sidebar switching
  const [selectedNode, setSelectedNode] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const flowRef = useRef(null);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeAdd = useCallback((newNode) => {
    if (flowRef.current) {
      flowRef.current.addNode(newNode);
    }
  }, []);

  const handleNodeUpdate = useCallback((nodeId, newData) => {
    // passing node updates down to the flow component so real-time text editing from the settings panel
    if (flowRef.current) {
      flowRef.current.updateNodeData(nodeId, newData);
    }
  }, []);

  const handleBack = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleSave = useCallback((success, message) => {
    setSaveMessage({ success, message });
    setTimeout(() => setSaveMessage(null), 3000);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-100">
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            Chatbot Flow Builder
          </h1>

          {saveMessage && (
            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                saveMessage.success
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {saveMessage.message}
            </div>
          )}
        </div>

        <div className="flex pt-16 h-full w-full">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
              onBack={handleBack}
            />
          ) : (
            <NodesPanel onNodeAdd={handleNodeAdd} />
          )}

          <div className="flex-1">
            <ChatbotFlow
              ref={flowRef}
              onNodeSelect={handleNodeSelect}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
