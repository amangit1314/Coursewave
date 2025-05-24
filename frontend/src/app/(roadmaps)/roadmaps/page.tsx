"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ZoomIn, ZoomOut } from "lucide-react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node styles
const nodeStyles = {
  basic: {
    background: "#3b82f6",
    color: "white",
    border: "1px solid #2563eb",
    borderRadius: "0.5rem",
    padding: "10px",
    width: 180,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  advanced: {
    background: "#10b981",
    color: "white",
    border: "1px solid #059669",
    borderRadius: "0.5rem",
    padding: "10px",
    width: 180,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  expert: {
    background: "#8b5cf6",
    color: "white",
    border: "1px solid #7c3aed",
    borderRadius: "0.5rem",
    padding: "10px",
    width: 180,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
};

// Custom Node Component
interface CustomNodeData {
  label: string;
  description?: string;
  type: string;
}

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  const style =
    nodeStyles[data.type as keyof typeof nodeStyles] || nodeStyles.basic;

  return (
    <div style={style}>
      <div className="font-bold">{data.label}</div>
      {data.description && (
        <div className="text-xs mt-1">{data.description}</div>
      )}
    </div>
  );
};

// Node types
const nodeTypes = {
  custom: CustomNode,
};

// Roadmap templates based on common career paths
const roadmapTemplates = {
  "frontend developer": {
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "HTML & CSS",
          description: "Learn the basics of web structure and styling",
          type: "basic",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 100 },
        data: {
          label: "JavaScript",
          description: "Learn programming fundamentals with JS",
          type: "basic",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 0, y: 200 },
        data: {
          label: "React Basics",
          description: "Components, state, props, and hooks",
          type: "basic",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 200, y: 150 },
        data: {
          label: "State Management",
          description: "Redux, Context API, Zustand",
          type: "advanced",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 200, y: 250 },
        data: {
          label: "React Router",
          description: "Client-side routing for SPAs",
          type: "advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 400, y: 200 },
        data: {
          label: "Testing",
          description: "Jest, React Testing Library",
          type: "expert",
        },
      },
      {
        id: "7",
        type: "custom",
        position: { x: 400, y: 300 },
        data: {
          label: "Performance",
          description: "Optimization techniques and best practices",
          type: "expert",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-5",
        source: "3",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-6",
        source: "4",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  "backend developer": {
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Programming Basics",
          description: "Choose a language: Node.js, Python, Java, etc.",
          type: "basic",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 100 },
        data: {
          label: "Database Fundamentals",
          description: "SQL vs NoSQL, basic CRUD operations",
          type: "basic",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 0, y: 200 },
        data: {
          label: "API Development",
          description: "RESTful principles, API design",
          type: "basic",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 200, y: 150 },
        data: {
          label: "Authentication",
          description: "JWT, OAuth, session management",
          type: "advanced",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 200, y: 250 },
        data: {
          label: "Server Frameworks",
          description: "Express, Django, Spring Boot, etc.",
          type: "advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 400, y: 200 },
        data: {
          label: "Caching",
          description: "Redis, Memcached, strategies",
          type: "expert",
        },
      },
      {
        id: "7",
        type: "custom",
        position: { x: 400, y: 300 },
        data: {
          label: "Microservices",
          description: "Architecture patterns, service communication",
          type: "expert",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-5",
        source: "3",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-6",
        source: "4",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  "devops engineer": {
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Linux Fundamentals",
          description: "Command line, file systems, permissions",
          type: "basic",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 100 },
        data: {
          label: "Networking",
          description: "TCP/IP, DNS, HTTP, load balancing",
          type: "basic",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 0, y: 200 },
        data: {
          label: "Version Control",
          description: "Git, branching strategies, workflows",
          type: "basic",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 200, y: 150 },
        data: {
          label: "Containerization",
          description: "Docker, container orchestration",
          type: "advanced",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 200, y: 250 },
        data: {
          label: "CI/CD",
          description: "Jenkins, GitHub Actions, GitLab CI",
          type: "advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 400, y: 200 },
        data: {
          label: "Infrastructure as Code",
          description: "Terraform, CloudFormation, Ansible",
          type: "expert",
        },
      },
      {
        id: "7",
        type: "custom",
        position: { x: 400, y: 300 },
        data: {
          label: "Monitoring",
          description: "Prometheus, Grafana, ELK stack",
          type: "expert",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-5",
        source: "3",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-6",
        source: "4",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
};

// Main Flow Component
interface FlowProps {
  roadmapData: {
    nodes: {
      id: string;
      type: string;
      position: { x: number; y: number };
      data: { label: string; description: string; type: string };
    }[];
    edges: {
      id: string;
      source: string;
      target: string;
      markerEnd: { type: MarkerType };
    }[];
  } | null;
  isSmallScreen: boolean;
}

const Flow = React.forwardRef<HTMLDivElement, FlowProps>(
  ({ roadmapData, isSmallScreen }, ref) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    useEffect(() => {
      if (roadmapData) {
        setNodes(roadmapData.nodes);
        setEdges(roadmapData.edges);

        // Give time for the nodes to render before fitting the view
        setTimeout(() => {
          fitView({ padding: 0.2 });
        }, 50);
      }
    }, [roadmapData, fitView, setNodes, setEdges]);

    const edgeOptions = {
      animated: true,
      style: {
        stroke: "#333",
        strokeWidth: 2,
      },
    };

    return (
      <div ref={ref} style={{ height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeOptions}
          fitView
        >
          <Panel position="top-left" className={isSmallScreen ? "hidden" : ""}>
            <div className="bg-white p-2 rounded shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Basic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Advanced</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs">Expert</span>
                </div>
              </div>
            </div>
          </Panel>
          {/* <Controls /> */}
        </ReactFlow>
      </div>
    );
  }
);

// Download utility functions
interface DownloadImageProps {
  ref: React.RefObject<HTMLDivElement>;
  filename: string;
}

const downloadImage = async (
  ref: React.RefObject<HTMLDivElement | null>,
  filename: string
) => {
  try {
    // In a real implementation you would use html-to-image or similar
    alert(
      "In a real implementation, this would download the roadmap as an image"
    );
  } catch (error) {
    console.error("Error exporting roadmap:", error);
  }
};

// Main component
const RoadMapsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  interface RoadmapData {
    nodes: {
      id: string;
      type: string;
      position: { x: number; y: number };
      data: { label: string; description: string; type: string };
    }[];
    edges: {
      id: string;
      source: string;
      target: string;
      markerEnd: { type: MarkerType };
    }[];
  }

  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const flowRef = React.useRef<HTMLDivElement>(null);

  // Handle screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle search and generate roadmap
  const handleSearch = async () => {
    setIsLoading(true);

    // Simulate API call with our templates
    setTimeout(() => {
      const query = searchQuery.toLowerCase();

      // Check if we have a template for this query
      const matchedTemplate = Object.keys(roadmapTemplates).find(
        (key) => query.includes(key) || key.includes(query)
      );

      if (matchedTemplate) {
        setRoadmapData(
          roadmapTemplates[matchedTemplate as keyof typeof roadmapTemplates]
        );
      } else {
        // Fallback to a generic template
        setRoadmapData(roadmapTemplates["frontend developer"]);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleDownload = useCallback(() => {
    if (flowRef.current) {
      if (flowRef.current) {
        downloadImage(
          flowRef,
          `roadmap-${searchQuery.replace(/\s+/g, "-")}.png`
        );
      }
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen px-4 md:px-8 pt-16 md:pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Interactive Learning Roadmap Generator
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <Input
            placeholder="Search for a roadmap (e.g., 'Frontend Developer')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="w-full md:w-auto rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Generate Roadmap"
            )}
          </Button>
        </div>

        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
            <p className="text-center">
              AI is generating your personalized learning roadmap...
            </p>
            <p className="text-sm text-gray-500 text-center">
              This may take a few moments
            </p>
          </div>
        )}

        {roadmapData && !isLoading && (
          <div
            className="border rounded-lg shadow-lg overflow-hidden relative"
            style={{ height: "70vh" }}
          >
            <ReactFlowProvider>
              <Flow
                roadmapData={roadmapData}
                isSmallScreen={isSmallScreen}
                ref={flowRef}
              />
            </ReactFlowProvider>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                onClick={handleDownload}
                className="bg-white text-blue-500 hover:bg-gray-100"
                variant="outline"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadMapsPage;
