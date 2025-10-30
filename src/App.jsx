import React, { useState, useRef, useCallback } from 'react';
import JsonInput from './components/JsonInput';
import SearchBar from './components/SearchBar';
import Toolbar from './components/Toolbar';
import ThemeToggle from './components/ThemeToggle';
import { jsonToFlow } from './utils/jsonToFlow';
import { JSONPath } from 'jsonpath-plus';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import FlowTree from "./components/FlowTree";




const SAMPLE_JSON = `{
  "user": {
    "name": "Abhishek",
    "age": 23,
    "address": { "city": "Bengaluru", "zip": "560001" }
  },
  "items": [
    { "id": 1, "name": "Item A" },
    { "id": 2, "name": "Item B" }
  ],
  "active": true
}`;

function ThemeToggleSmall({ isDark, toggleDark }) {
  return (
    <button onClick={toggleDark} className="px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded">
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}

export default function App() {
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [isDark, setIsDark] = useState(false);

  const flowWrapperRef = useRef(null);
  const rfInstanceRef = useRef(null);

  const toggleDark = () => {
    setIsDark((p) => !p);
    document.documentElement.classList.toggle('dark');
  };

  const handleVisualize = useCallback(() => {
  try {
    const parsed = JSON.parse(jsonText);
    // Convert JSON to flow nodes and edges
    const { nodes: n, edges: e } = jsonToFlow(parsed);
    console.log("Generated nodes:", n);
    console.log("Generated edges:", e);


    // Safely attach parsed values to node data
    const nodesWithValue = n.map(nd => ({
      ...nd,
      data: {
        ...nd.data,
        value: (() => {
          try {
            return JSON.parse(nd.data.raw);
          } catch {
            return nd.data.raw;
          }
        })(),
      },
    }));

    setNodes(nodesWithValue);
    setEdges(e);

    setStatus("Tree visualized successfully");

    // Automatically fit the view after a short delay
    setTimeout(() => {
      if (rfInstanceRef.current) {
        rfInstanceRef.current.fitView({ padding: 0.2, duration: 800 });
      }
    }, 300);
  } catch (err) {
    console.error("Visualization error:", err);
    setStatus("Invalid JSON. Please fix the format and try again.");
  }
}, [jsonText]);

  const handleClear = () => {
    setJsonText('');
    setNodes([]);
    setEdges([]);
    setSearchText('');
    setStatus('Cleared');
    setTimeout(() => setStatus(''), 1200);
  };

  const copyPath = async (path) => {
    try {
      await navigator.clipboard.writeText(path);
      setStatus(`Copied: ${path}`);
      setTimeout(() => setStatus(''), 1200);
    } catch {
      setStatus('Copy failed');
    }
  };

  const handleNodeClick = (evt, node) => {
    if (node?.data?.path) copyPath(node.data.path);
  };

  const normalizePath = p => p.replace(/\['([^']+)'\]/g, '.$1').replace(/\["([^"]+)"\]/g, '.$1');

  const handleSearch = () => {
    if (!searchText.trim()) {
      setStatus('Enter search path');
      return;
    }
    
    const query = searchText.trim().startsWith('$') ? searchText.trim() : `$..${searchText.trim()}`;
    try {
      const pathResults = JSONPath({ path: query, json: JSON.parse(jsonText), resultType: 'path' });
      if (!pathResults || pathResults.length === 0) {
        setNodes(prev => prev.map(n => ({ ...n, style: { ...n.style, boxShadow: 'none' } })));
        setStatus('No match found');
        return;
      }
      const normalized = pathResults.map(normalizePath);
      const matched = new Set(normalized);
      const updated = nodes.map(n => ({ ...n, style: { ...n.style, boxShadow: matched.has(n.id) ? '0 0 14px 6px rgba(255,224,102,0.95)' : 'none' } }));
      setNodes(updated);
      setStatus(`Match found (${normalized.length})`);

      const first = normalized.find(p => updated.some(n => n.id === p));
      if (first && rfInstanceRef.current) {
        const node = updated.find(n => n.id === first);
        if (node?.position) rfInstanceRef.current.setCenter(node.position.x, node.position.y, { duration: 400 });
        else rfInstanceRef.current.fitView({ padding: 0.2 });
      }
    } catch {
      setStatus('Invalid JSONPath or JSON');
    }
  };

  const handleDownload = async () => {
  try {
    // ✅ Find the React Flow DOM element properly
    const flowContainer = document.querySelector(".react-flow__renderer") || 
                          document.querySelector(".react-flow") ||
                          flowWrapperRef.current;

    if (!flowContainer) {
      setStatus("Nothing to download");
      return;
    }

    // ✅ Ensure background color based on theme
    const bg = document.documentElement.classList.contains("dark")
      ? "#0f172a" // dark slate
      : "#ffffff";

    // ✅ Convert the visible area to PNG
    const dataUrl = await htmlToImage.toPng(flowContainer, {
      backgroundColor: bg,
      pixelRatio: 2,
      quality: 1,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    });

    // ✅ Trigger browser download
    download(dataUrl, "json-tree.png");
    setStatus("Image downloaded successfully!");
    setTimeout(() => setStatus(""), 1500);
  } catch (error) {
    console.error("Download error:", error);
    setStatus("Download failed. Try again.");
  }
};


  return (
    <div className={`h-screen w-screen flex ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="w-80 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="p-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">JSON Tree Visualizer</h3>
          <ThemeToggleSmall isDark={isDark} toggleDark={toggleDark} />
        </div>

        <JsonInput jsonText={jsonText} setJsonText={setJsonText} onVisualize={handleVisualize} onClear={handleClear} onDownload={handleDownload} samplePlaceholder={SAMPLE_JSON} />

        <div className="p-3">
          <SearchBar searchText={searchText} setSearchText={setSearchText} onSearch={handleSearch} status={status} />
          

</div>
</div>

        <div className="flex-1 border rounded overflow-hidden">
          <FlowTree nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
        </div>
      </div>
  
  );
}
