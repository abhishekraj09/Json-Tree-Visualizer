import dagre from "dagre";

export function jsonToFlow(rootObj) {
  let nodes = [];
  let edges = [];

  const safeId = (path) => path.replace(/[^a-zA-Z0-9_\-$]/g, "_");

  function visit(value, path = "$", parent = null) {
    const id = safeId(path);
    const nodeLabel = path === "$" ? "root" : path.split(".").pop();
    const raw =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value);

    // 🎨 Node color logic
    let bgColor = "#a78bfa"; // default (purple)
    if (Array.isArray(value)) bgColor = "#4ade80"; // green for arrays
    else if (value === null || typeof value !== "object") bgColor = "#fbbf24"; // yellow/orange for primitives

    // 🧩 Push node
    nodes.push({
      id,
      data: { label: nodeLabel, path, value, raw },
      position: { x: 0, y: 0 },
      style: {
        backgroundColor: bgColor,
        color: "#000",
        border: "2px solid #333",
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
        fontWeight: 500,
        textAlign: "center",
        minWidth: 100,
      },
    });

    // 🔗 Create edge if has parent
    if (parent) {
      edges.push({
        id: `e-${safeId(parent)}-${id}`,
        source: safeId(parent),
        target: id,
        animated: true,
        style: { stroke: "#64748b", strokeWidth: 2 },
      });
    }

    // 👇 Recursive traversal
    if (value !== null && typeof value === "object") {
      if (Array.isArray(value)) {
        value.forEach((item, idx) => visit(item, `${path}[${idx}]`, path));
      } else {
        Object.keys(value).forEach((key) =>
          visit(value[key], `${path}.${key}`, path)
        );
      }
    }
  }

  visit(rootObj);

  // ⚙️ Layout using dagre
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 100, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 50 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  nodes = nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x, y: pos.y } };
  });

  return { nodes, edges };
}
