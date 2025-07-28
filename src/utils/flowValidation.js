export function validateFlow(nodes, edges) {
  // I'm allowing single-node flows since a simple start message can be valid
  if (nodes.length <= 1) {
    return { valid: true, errorNodeIds: [] };
  }

  // I'm identifying which nodes have incoming connection. In a chatbot flow, every node except the start should be reachable
  const nodesWithIncomingConnections = new Set(
    edges.map((edge) => edge.target)
  );

  const unconnectedNodes = nodes.filter((node, index) => {
    // Skip the first node (start node) as it doesn't need incoming connections
    if (index === 0) return false;
    return !nodesWithIncomingConnections.has(node.id);
  });

  const emptyTextNodes = nodes.filter((node) => !node.data?.text?.trim());

  // This allows the UI to show users exactly which nodes need attention
  const allErrorNodeIds = [
    ...unconnectedNodes.map((node) => node.id),
    ...emptyTextNodes.map((node) => node.id),
  ];

  if (allErrorNodeIds.length > 0) {
    // Creating specific error messages based on the types of issues found
    let errorMessage = "Cannot save Flow. ";

    if (unconnectedNodes.length > 0 && emptyTextNodes.length > 0) {
      errorMessage += "The highlighted nodes have connection and text issues.";
    } else if (unconnectedNodes.length > 0) {
      errorMessage += "The highlighted nodes are not connected properly.";
    } else {
      errorMessage += "The highlighted nodes have empty text messages.";
    }

    return {
      valid: false,
      error: errorMessage,
      errorNodeIds: allErrorNodeIds,
    };
  }

  return { valid: true, errorNodeIds: [] };
}
