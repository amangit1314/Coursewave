"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Download,
  ZoomIn,
  ZoomOut,
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  ExternalLink,
  ChevronRight,
  Play,
  CheckCircle,
  Circle,
  Target,
  TrendingUp,
  Lightbulb,
  Code,
  Database,
  Palette,
  Smartphone,
  Globe,
  Shield,
  Zap,
  FileText,
  Sparkles,
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable method
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Enhanced node styles with better visual hierarchy
const nodeStyles = {
  foundation: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "2px solid #5a67d8",
    borderRadius: "12px",
    padding: "16px",
    width: 200,
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    fontWeight: "600",
  },
  intermediate: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "2px solid #e91e63",
    borderRadius: "12px",
    padding: "16px",
    width: 200,
    boxShadow: "0 8px 25px rgba(240, 147, 251, 0.3)",
    fontWeight: "600",
  },
  advanced: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    color: "white",
    border: "2px solid #00bcd4",
    borderRadius: "12px",
    padding: "16px",
    width: 200,
    boxShadow: "0 8px 25px rgba(79, 172, 254, 0.3)",
    fontWeight: "600",
  },
  expert: {
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    color: "white",
    border: "2px solid #4caf50",
    borderRadius: "12px",
    padding: "16px",
    width: 200,
    boxShadow: "0 8px 25px rgba(67, 233, 123, 0.3)",
    fontWeight: "600",
  },
  specialization: {
    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    color: "white",
    border: "2px solid #ff9800",
    borderRadius: "12px",
    padding: "16px",
    width: 200,
    boxShadow: "0 8px 25px rgba(250, 112, 154, 0.3)",
    fontWeight: "600",
  },
};

// Enhanced Custom Node Component
interface CustomNodeData {
  label: string;
  description?: string;
  type: string;
  resources?: string[];
  estimatedTime?: string;
  difficulty?: string;
}

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  const style =
    nodeStyles[data.type as keyof typeof nodeStyles] || nodeStyles.foundation;

  return (
    <div
      style={style}
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
    >
      <div className="font-bold text-lg mb-2">{data.label}</div>
      {data.description && (
        <div className="text-sm opacity-90 mb-3 leading-relaxed">
          {data.description}
        </div>
      )}
      {data.estimatedTime && (
        <div className="flex items-center gap-1 text-xs opacity-80 mb-2">
          <Clock className="h-3 w-3" />
          {data.estimatedTime}
        </div>
      )}
      {data.difficulty && (
        <div className="flex items-center gap-1 text-xs opacity-80">
          <Target className="h-3 w-3" />
          {data.difficulty}
        </div>
      )}
    </div>
  );
};

// Node types
const nodeTypes = {
  custom: CustomNode,
};

// AI Roadmap Generator Function
const generateAIRoadmap = async (skillName: string) => {
  // Simulate AI API call - in real implementation, this would call your AI service
  return new Promise((resolve) => {
    setTimeout(() => {
      const skill = skillName.toLowerCase();

      // AI-generated roadmap structure
      const roadmap = {
        title: `${skillName} Learning Roadmap`,
        description: `Comprehensive learning path to master ${skillName}. This AI-generated roadmap provides a structured approach to becoming proficient in ${skillName}.`,
        duration: "6-12 months",
        difficulty: "Intermediate",
        category: getCategoryFromSkill(skill),
        nodes: generateNodesForSkill(skill, skillName),
        edges: generateEdgesForSkill(skill),
      };

      resolve(roadmap);
    }, 2000); // Simulate AI processing time
  });
};

// Helper function to determine category
const getCategoryFromSkill = (skill: string) => {
  if (
    skill.includes("frontend") ||
    skill.includes("react") ||
    skill.includes("vue") ||
    skill.includes("angular")
  ) {
    return "Development";
  } else if (
    skill.includes("backend") ||
    skill.includes("node") ||
    skill.includes("python") ||
    skill.includes("java")
  ) {
    return "Development";
  } else if (
    skill.includes("data") ||
    skill.includes("ml") ||
    skill.includes("ai") ||
    skill.includes("analytics")
  ) {
    return "Data Science";
  } else if (
    skill.includes("devops") ||
    skill.includes("cloud") ||
    skill.includes("aws") ||
    skill.includes("docker")
  ) {
    return "Operations";
  } else if (
    skill.includes("mobile") ||
    skill.includes("ios") ||
    skill.includes("android") ||
    skill.includes("flutter")
  ) {
    return "Mobile";
  } else if (
    skill.includes("design") ||
    skill.includes("ui") ||
    skill.includes("ux") ||
    skill.includes("figma")
  ) {
    return "Design";
  } else if (
    skill.includes("security") ||
    skill.includes("cyber") ||
    skill.includes("penetration")
  ) {
    return "Security";
  }
  return "Development";
};

// Generate nodes based on skill
const generateNodesForSkill = (skill: string, skillName: string) => {
  const baseNodes = [
    {
      id: "1",
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        label: "Fundamentals",
        description: `Learn the basic concepts and principles of ${skillName}`,
        type: "foundation",
        estimatedTime: "2-3 months",
        difficulty: "Beginner",
      },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 0, y: 150 },
      data: {
        label: "Core Concepts",
        description: `Master the essential concepts and tools in ${skillName}`,
        type: "foundation",
        estimatedTime: "2-3 months",
        difficulty: "Beginner",
      },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 250, y: 75 },
      data: {
        label: "Intermediate Skills",
        description: `Develop advanced skills and practical applications in ${skillName}`,
        type: "intermediate",
        estimatedTime: "3-4 months",
        difficulty: "Intermediate",
      },
    },
    {
      id: "4",
      type: "custom",
      position: { x: 250, y: 225 },
      data: {
        label: "Advanced Techniques",
        description: `Explore advanced techniques and optimization in ${skillName}`,
        type: "advanced",
        estimatedTime: "2-3 months",
        difficulty: "Advanced",
      },
    },
    {
      id: "5",
      type: "custom",
      position: { x: 500, y: 150 },
      data: {
        label: "Expert Level",
        description: `Master expert-level concepts and industry best practices in ${skillName}`,
        type: "expert",
        estimatedTime: "3-4 months",
        difficulty: "Expert",
      },
    },
  ];

  // Add skill-specific nodes
  if (skill.includes("frontend")) {
    baseNodes.push({
      id: "6",
      type: "custom",
      position: { x: 500, y: 300 },
      data: {
        label: "Modern Frameworks",
        description:
          "Master React, Vue, or Angular ecosystem and advanced patterns",
        type: "expert",
        estimatedTime: "2-3 months",
        difficulty: "Expert",
      },
    });
  } else if (skill.includes("backend")) {
    baseNodes.push({
      id: "6",
      type: "custom",
      position: { x: 500, y: 300 },
      data: {
        label: "System Design",
        description:
          "Learn scalable architecture, microservices, and cloud deployment",
        type: "expert",
        estimatedTime: "3-4 months",
        difficulty: "Expert",
      },
    });
  } else if (skill.includes("data")) {
    baseNodes.push({
      id: "6",
      type: "custom",
      position: { x: 500, y: 300 },
      data: {
        label: "MLOps & Production",
        description: "Deploy models, monitoring, and production ML systems",
        type: "expert",
        estimatedTime: "2-3 months",
        difficulty: "Expert",
      },
    });
  }

  return baseNodes;
};

// Generate edges based on skill
const generateEdgesForSkill = (skill: string) => {
  const baseEdges = [
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
      id: "e2-4",
      source: "2",
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
      id: "e4-5",
      source: "4",
      target: "5",
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ];

  // Add additional edges for skill-specific paths
  if (
    skill.includes("frontend") ||
    skill.includes("backend") ||
    skill.includes("data")
  ) {
    baseEdges.push({
      id: "e5-6",
      source: "5",
      target: "6",
      markerEnd: { type: MarkerType.ArrowClosed },
    });
  }

  return baseEdges;
};

// Comprehensive roadmap templates for fallback
const roadmapTemplates = {
  "backend developer": {
    title: "Backend Developer Roadmap",
    description: "Master server-side development, databases, and API design",
    duration: "6-12 months",
    difficulty: "Intermediate",
    category: "Development",
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Programming Fundamentals",
          description: "Choose a language: Node.js, Python, Java, Go, or C#",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 150 },
        data: {
          label: "Web Fundamentals",
          description: "HTTP, REST APIs, JSON, Web Security basics",
          type: "foundation",
          estimatedTime: "1-2 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 250, y: 75 },
        data: {
          label: "Database Design",
          description: "SQL, NoSQL, Database modeling and optimization",
          type: "intermediate",
          estimatedTime: "2-3 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 250, y: 225 },
        data: {
          label: "API Development",
          description: "RESTful APIs, GraphQL, API documentation",
          type: "intermediate",
          estimatedTime: "2-3 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 500, y: 150 },
        data: {
          label: "Authentication & Security",
          description: "JWT, OAuth, Password hashing, CORS, Rate limiting",
          type: "advanced",
          estimatedTime: "1-2 months",
          difficulty: "Advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 500, y: 300 },
        data: {
          label: "Testing & Deployment",
          description: "Unit testing, Integration testing, CI/CD, Docker",
          type: "advanced",
          estimatedTime: "2-3 months",
          difficulty: "Advanced",
        },
      },
      {
        id: "7",
        type: "custom",
        position: { x: 750, y: 225 },
        data: {
          label: "Microservices & Cloud",
          description: "Microservices architecture, AWS/Azure/GCP, Kubernetes",
          type: "expert",
          estimatedTime: "3-4 months",
          difficulty: "Expert",
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
        id: "e1-3",
        source: "1",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-4",
        source: "2",
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
      {
        id: "e6-7",
        source: "6",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  "frontend developer": {
    title: "Frontend Developer Roadmap",
    description: "Master modern web development with React, Vue, or Angular",
    duration: "6-10 months",
    difficulty: "Intermediate",
    category: "Development",
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "HTML & CSS",
          description: "Semantic HTML, CSS Grid, Flexbox, Responsive Design",
          type: "foundation",
          estimatedTime: "1-2 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 150 },
        data: {
          label: "JavaScript Fundamentals",
          description: "ES6+, DOM manipulation, Async programming",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 250, y: 75 },
        data: {
          label: "React/Vue/Angular",
          description: "Choose a framework and master its ecosystem",
          type: "intermediate",
          estimatedTime: "3-4 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 250, y: 225 },
        data: {
          label: "State Management",
          description: "Redux, Context API, Vuex, NgRx",
          type: "intermediate",
          estimatedTime: "1-2 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 500, y: 150 },
        data: {
          label: "Testing & Performance",
          description: "Jest, React Testing Library, Performance optimization",
          type: "advanced",
          estimatedTime: "2-3 months",
          difficulty: "Advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 500, y: 300 },
        data: {
          label: "Build Tools & Deployment",
          description: "Webpack, Vite, CI/CD, Vercel/Netlify",
          type: "advanced",
          estimatedTime: "1-2 months",
          difficulty: "Advanced",
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
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  "data scientist": {
    title: "Data Scientist Roadmap",
    description:
      "Master data analysis, machine learning, and statistical modeling",
    duration: "8-12 months",
    difficulty: "Advanced",
    category: "Data Science",
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Python & Statistics",
          description: "Python programming, Statistical concepts, Probability",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 150 },
        data: {
          label: "Data Manipulation",
          description: "Pandas, NumPy, Data cleaning and preprocessing",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 250, y: 75 },
        data: {
          label: "Data Visualization",
          description: "Matplotlib, Seaborn, Plotly, Storytelling with data",
          type: "intermediate",
          estimatedTime: "1-2 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 250, y: 225 },
        data: {
          label: "Machine Learning",
          description: "Scikit-learn, Supervised/Unsupervised learning",
          type: "intermediate",
          estimatedTime: "3-4 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 500, y: 150 },
        data: {
          label: "Deep Learning",
          description: "TensorFlow/PyTorch, Neural networks, Computer vision",
          type: "advanced",
          estimatedTime: "3-4 months",
          difficulty: "Advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 500, y: 300 },
        data: {
          label: "MLOps & Deployment",
          description: "Model deployment, MLflow, Kubeflow, Cloud platforms",
          type: "expert",
          estimatedTime: "2-3 months",
          difficulty: "Expert",
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
        id: "e2-4",
        source: "2",
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
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  "devops engineer": {
    title: "DevOps Engineer Roadmap",
    description: "Master infrastructure automation, CI/CD, and cloud platforms",
    duration: "6-10 months",
    difficulty: "Advanced",
    category: "Operations",
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Linux & Networking",
          description:
            "Linux administration, Networking fundamentals, Shell scripting",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 150 },
        data: {
          label: "Cloud Platforms",
          description: "AWS, Azure, or GCP fundamentals and services",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 250, y: 75 },
        data: {
          label: "Containerization",
          description: "Docker, Container orchestration basics",
          type: "intermediate",
          estimatedTime: "1-2 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 250, y: 225 },
        data: {
          label: "CI/CD Pipelines",
          description:
            "Jenkins, GitLab CI, GitHub Actions, Pipeline automation",
          type: "intermediate",
          estimatedTime: "2-3 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 500, y: 150 },
        data: {
          label: "Kubernetes",
          description: "Container orchestration, K8s administration, Helm",
          type: "advanced",
          estimatedTime: "3-4 months",
          difficulty: "Advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 500, y: 300 },
        data: {
          label: "Monitoring & Security",
          description:
            "Prometheus, Grafana, Security best practices, Compliance",
          type: "expert",
          estimatedTime: "2-3 months",
          difficulty: "Expert",
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
        id: "e2-4",
        source: "2",
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
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  "mobile developer": {
    title: "Mobile Developer Roadmap",
    description: "Master iOS and Android development with modern frameworks",
    duration: "6-10 months",
    difficulty: "Intermediate",
    category: "Mobile",
    nodes: [
      {
        id: "1",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Programming Fundamentals",
          description: "Swift (iOS) or Kotlin/Java (Android), OOP concepts",
          type: "foundation",
          estimatedTime: "2-3 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "2",
        type: "custom",
        position: { x: 0, y: 150 },
        data: {
          label: "UI/UX Design",
          description:
            "Mobile design principles, Material Design, Human Interface Guidelines",
          type: "foundation",
          estimatedTime: "1-2 months",
          difficulty: "Beginner",
        },
      },
      {
        id: "3",
        type: "custom",
        position: { x: 250, y: 75 },
        data: {
          label: "Native Development",
          description: "iOS (SwiftUI/UIKit) or Android (Jetpack Compose/Views)",
          type: "intermediate",
          estimatedTime: "3-4 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "4",
        type: "custom",
        position: { x: 250, y: 225 },
        data: {
          label: "Cross-Platform",
          description:
            "React Native, Flutter, or Xamarin for multi-platform apps",
          type: "intermediate",
          estimatedTime: "2-3 months",
          difficulty: "Intermediate",
        },
      },
      {
        id: "5",
        type: "custom",
        position: { x: 500, y: 150 },
        data: {
          label: "Testing & Performance",
          description:
            "Unit testing, UI testing, Performance optimization, Memory management",
          type: "advanced",
          estimatedTime: "2-3 months",
          difficulty: "Advanced",
        },
      },
      {
        id: "6",
        type: "custom",
        position: { x: 500, y: 300 },
        data: {
          label: "App Store & Deployment",
          description:
            "App Store Connect, Google Play Console, CI/CD for mobile",
          type: "advanced",
          estimatedTime: "1-2 months",
          difficulty: "Advanced",
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
        id: "e2-4",
        source: "2",
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
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
};

// Popular skills for quick access
const popularSkills = [
  { name: "Backend Developer", icon: Database, category: "Development" },
  { name: "Frontend Developer", icon: Code, category: "Development" },
  { name: "Data Scientist", icon: TrendingUp, category: "Data Science" },
  { name: "DevOps Engineer", icon: Zap, category: "Operations" },
  { name: "Mobile Developer", icon: Smartphone, category: "Mobile" },
  { name: "UI/UX Designer", icon: Palette, category: "Design" },
  { name: "Full Stack Developer", icon: Globe, category: "Development" },
  { name: "Cybersecurity Engineer", icon: Shield, category: "Security" },
];

// Categories for filtering
const categories = [
  { name: "All", icon: Star },
  { name: "Development", icon: Code },
  { name: "Data Science", icon: TrendingUp },
  { name: "Operations", icon: Zap },
  { name: "Mobile", icon: Smartphone },
  { name: "Design", icon: Palette },
  { name: "Security", icon: Shield },
];

// Flow component with enhanced features
const Flow = React.forwardRef<
  HTMLDivElement,
  {
    roadmapData: any;
    isSmallScreen: boolean;
  }
>(({ roadmapData, isSmallScreen }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    roadmapData?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    roadmapData?.edges || []
  );
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const edgeOptions = {
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  };

  useEffect(() => {
    if (roadmapData) {
      setNodes(roadmapData.nodes);
      setEdges(roadmapData.edges);
      setTimeout(() => fitView({ padding: 0.1 }), 100);
    }
  }, [roadmapData, setNodes, setEdges, fitView]);

  return (
    <div ref={ref} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900"
      >
        <Background color="#94a3b8" gap={20} size={1} />
        <Controls className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700" />

        <Panel position="top-left" className={isSmallScreen ? "hidden" : ""}>
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Roadmap Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Foundation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-gradient-to-r from-pink-500 to-red-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Intermediate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Advanced
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-gradient-to-r from-green-500 to-teal-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Expert
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
});

Flow.displayName = "Flow";

// Enhanced PDF download functionality
const downloadRoadmapAsPDF = async (roadmapData: any, filename: string) => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text(roadmapData.title, 20, 30);

    // Add description
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99); // Gray color
    doc.text(roadmapData.description, 20, 45);

    // Add metadata
    doc.setFontSize(10);
    doc.text(`Duration: ${roadmapData.duration}`, 20, 60);
    doc.text(`Difficulty: ${roadmapData.difficulty}`, 20, 70);
    doc.text(`Category: ${roadmapData.category}`, 20, 80);

    // Add learning path table
    const tableData = roadmapData.nodes.map((node: any, index: number) => [
      index + 1,
      node.data.label,
      node.data.type.charAt(0).toUpperCase() + node.data.type.slice(1),
      node.data.estimatedTime,
      node.data.difficulty,
    ]);

    doc.autoTable({
      startY: 100,
      head: [["#", "Skill", "Level", "Time", "Difficulty"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 12,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    // Add tips section
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text("Tips for Success", 20, finalY);

    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    const tips = [
      "• Set realistic goals and track your progress regularly",
      "• Practice regularly with hands-on projects",
      "• Join communities and seek mentorship",
      "• Stay updated with industry trends and best practices",
      "• Build a portfolio of projects to showcase your skills",
      "• Focus on understanding concepts rather than memorizing",
      "• Take breaks and maintain a healthy work-life balance",
    ];

    tips.forEach((tip, index) => {
      doc.text(tip, 20, finalY + 15 + index * 8);
    });

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      "Generated by CourseWave AI Roadmap Generator",
      20,
      doc.internal.pageSize.height - 20
    );

    // Save the PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// Main component
const RoadMapsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const flowRef = React.useRef<HTMLDivElement>(null);

  // Handle screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle AI-powered search and generate roadmap
  const handleAISearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setAiGenerating(true);
    setShowSuggestions(false);

    try {
      // Call AI service to generate roadmap
      const aiRoadmap = await generateAIRoadmap(searchTerm);
      setRoadmapData(aiRoadmap);
    } catch (error) {
      console.error("Error generating AI roadmap:", error);
      // Fallback to template-based approach
      const normalizedQuery = searchTerm.toLowerCase();
      const matchedTemplate = Object.keys(roadmapTemplates).find(
        (key) => normalizedQuery.includes(key) || key.includes(normalizedQuery)
      );

      if (matchedTemplate) {
        setRoadmapData(
          roadmapTemplates[matchedTemplate as keyof typeof roadmapTemplates]
        );
      } else {
        setRoadmapData(roadmapTemplates["backend developer"]);
      }
    } finally {
      setIsLoading(false);
      setAiGenerating(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (roadmapData) {
      downloadRoadmapAsPDF(
        roadmapData,
        `ai-roadmap-${searchQuery.replace(/\s+/g, "-")}`
      );
    }
  }, [roadmapData, searchQuery]);

  const filteredPopularSkills = popularSkills.filter(
    (skill) => selectedCategory === "All" || skill.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-900 dark:via-transparent dark:to-zinc-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              AI-Powered Learning Roadmaps
            </h1>
            <Sparkles className="h-8 w-8 text-cyan-500" />
          </div>
          <p className="text-base dark:text-gray-300 max-w-3xl mx-auto">
            Let AI create personalized learning paths for any skill. Get
            intelligent, step-by-step guidance tailored to your learning goals
            and experience level.
          </p>
        </motion.div>

        {/* AI Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <label htmlFor="roadmap-search" className="sr-only">
              Search for a skill
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 dark:text-gray-300 h-5 w-5" />
                <Input
                  id="roadmap-search"
                  placeholder="Ask AI for any skill roadmap (e.g., Backend Developer, Data Scientist, React Expert)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                  className="pl-12 pr-4 py-4 text-base rounded-xl border-stroke border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-600 transition-all"
                />
              </div>
              <Button
                onClick={() => handleAISearch()}
                disabled={isLoading || !searchQuery.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {aiGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center"
              >
                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  AI is analyzing and creating your personalized roadmap...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-7 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-zinc-700">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="flex items-center gap-2 capitalize data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700 data-[state=active]:hover:bg-blue-600"
                >
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Popular Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Popular AI-Generated Paths
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* {filteredPopularSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-stroke hover:border-blue-300 dark:hover:border-blue-600 dark:bg-zinc-800 dark:border-zinc-700"
                  onClick={() => {
                    setSearchQuery(skill.name);
                    handleAISearch(skill.name);
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <skill.icon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 tracking-tight dark:text-white mb-2 line-clamp-1">
                      {skill.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {skill.category}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))} */}
            {filteredPopularSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.06 * index }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  onClick={() => {
                    setSearchQuery(skill.name);
                    handleAISearch(skill.name);
                  }}
                  className="group cursor-pointer border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md transition-all hover:shadow-xl dark:hover:border-blue-500 hover:border-blue-300"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                      <skill.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {skill.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 rounded-full text-blue-700 border-blue-500 bg-blue-50 dark:bg-zinc-700 dark:text-blue-300 dark:border-blue-400"
                    >
                      {skill.category}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative">
                <Loader2 className="animate-spin h-16 w-16 text-blue-500" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">
                AI is Creating Your Roadmap
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Our AI is analyzing "{searchQuery}" and generating a
                personalized learning path with optimal progression and time
                estimates.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap Display */}
        <AnimatePresence>
          {roadmapData && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Roadmap Header */}
              <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {roadmapData.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                      {roadmapData.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Duration: {roadmapData.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Difficulty: {roadmapData.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Category: {roadmapData.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                    >
                      <FileText className="h-5 w-5" />
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-gray-300 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400 px-6 py-3 rounded-xl flex items-center gap-2 dark:bg-zinc-800 dark:text-white"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Interactive Roadmap */}
              <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-xl">
                <div className="h-[70vh] relative">
                  <ReactFlowProvider>
                    <Flow
                      roadmapData={roadmapData}
                      isSmallScreen={isSmallScreen}
                      ref={flowRef}
                    />
                  </ReactFlowProvider>
                </div>
              </div>

              {/* Roadmap Details */}
              <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  AI-Generated Learning Path
                </h3>
                <div className="grid gap-6">
                  {roadmapData.nodes.map((node: any, index: number) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:shadow-md transition-all duration-300 dark:bg-zinc-700/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {node.data.label}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={`${
                              node.data.type === "foundation"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : node.data.type === "intermediate"
                                  ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                                  : node.data.type === "advanced"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {node.data.type.charAt(0).toUpperCase() +
                              node.data.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {node.data.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {node.data.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {node.data.difficulty}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoadMapsPage;
