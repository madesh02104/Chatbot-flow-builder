import { Handle, Position } from "@xyflow/react";
import { MessageCircle } from "lucide-react";

export default function TextMessageNode({ data, selected }) {
  // checking for error state that gets passed down from the flow validation
  // This allows the node to visually indicate when it has validation issues
  const hasError = data?.hasError;

  let borderClass = "border-gray-200";
  let bgClass = "bg-white";

  if (hasError) {
    borderClass = "border-red-500";
    bgClass = "bg-red-50";
  } else if (selected) {
    borderClass = "border-blue-500";
    bgClass = "bg-white";
  }

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] transition-colors ${bgClass} ${borderClass}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400"
        isConnectable={true}
      />

      <div className="flex items-center space-x-2">
        <MessageCircle
          className={`w-4 h-4 ${hasError ? "text-red-500" : "text-blue-500"}`}
        />
        <div
          className={`font-medium text-sm ${
            hasError ? "text-red-700" : "text-gray-600"
          }`}
        >
          Text Message
        </div>
      </div>

      <div
        className={`mt-2 text-sm break-words ${
          hasError ? "text-red-800" : "text-gray-800"
        }`}
      >
        {data?.text || "Enter your message..."}
      </div>

      {hasError && (
        <div className="mt-2 text-xs text-red-600 font-medium">
          ⚠ This node has issues
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400"
        isConnectable={true}
      />
    </div>
  );
}
