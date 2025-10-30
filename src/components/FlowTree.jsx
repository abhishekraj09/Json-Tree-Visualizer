import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

// Node color by type
const getNodeColor = (value) => {
  if (value === null) return "#ffb74d"; // null → orange
  if (Array.isArray(value)) return "#4caf50"; // array → green
  if (typeof value === "object") return "#7e57c2"; // object → purple
  return "#fb8c00"; // primitive → amber
};

// ✅ Custom Node (with handles so edges render)
const CustomNode = ({ data }) => (
  <div
    className="group relative"
    style={{
      padding: 10,
      borderRadius: 8,
      backgroundColor: data.bg,
      color: "#fff",
      fontSize: 13,
      textAlign: "center",
      minWidth: 120,
      cursor: "pointer",
      boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    }}
  >
    {/* Top handle for incoming edge */}
    <Handle type="target" position="top" style={{ background: "#fff" }} />

    <div style={{ fontWeight: 600 }}>{data.label}</div>

    {/* Tooltip on hover */}
    <div
      className="absolute hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1"
      style={{
        top: "110%",
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        zIndex: 20,
        maxWidth: 250,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <div>
        <strong>Path:</strong> {data.path}
      </div>
      <div>
        <strong>Value:</strong>{" "}
        {typeof data.value === "object"
          ? JSON.stringify(data.value)
          : String(data.value)}
      </div>
    </div>

    {/* Bottom handle for outgoing edge */}
    <Handle type="source" position="bottom" style={{ background: "#fff" }} />
  </div>
);

export default function FlowTree({ nodes, edges, onNodeClick }) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Assign custom colors
  const formattedNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        type: "custom",
        data: { ...n.data, bg: getNodeColor(n.data?.value) },
      })),
    [nodes]
  );

  const handleNodeClick = useCallback(
    (evt, node) => {
      if (onNodeClick) onNodeClick(evt, node);
    },
    [onNodeClick]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={formattedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        connectionLineType="smoothstep"
      >
        <Background color="#aaa" gap={16} />
        <MiniMap
          nodeColor={(n) => n.data?.bg || "#ccc"}
          nodeStrokeColor="#333"
          nodeBorderRadius={2}
        />
        {/* ✅ Removed zoom + fit buttons */}
        <Controls showZoom={false} showFitView={false} />
      </ReactFlow>
    </div>
  );
}
