import { Payment } from "@/types/payment";

import { MarkerType } from "reactflow";
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
import { Project } from "@/types/project";
import { Community } from "@/types/community";
import { Message } from "@/types/message";
import { OnlineUser } from "@/types/online-user";
import { Course } from "@/types";

export const courses = [
  {
    courseImage: "assets/illustrations/course_illus.png",
    courseId: "course_0xx1",
    isFree: false,
    coursePrice: "300",
    courseTitle: "Become React Hero",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "assets/images/images1.jpg",
    courseId: "course_0xx2",
    isFree: false,
    coursePrice: "200",
    courseTitle: "Full Stack Bootcamp",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "assets/images/images2.jpg",
    courseId: "course_0xx3",
    isFree: false,
    coursePrice: "270",
    courseTitle: "Git & Github Master Class",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "assets/images/images3.jpg",
    courseId: "course_0xx4",
    isFree: false,
    coursePrice: "470",
    courseTitle: "API Testing with Postman",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
  {
    courseImage: "/nextjs.png",
    courseId: "course_0xx5",
    isFree: false,
    coursePrice: "27",
    courseTitle: "Intro to Data Science",
    avgStarRatings: 4.8,
    instructorName: "Aman Soni",
  },
];

export const sampleCourses: Course[] = [
  {
    isFree: false,
    instructorId: "inst_001",
    isLive: true,
    isPublished: true,
    categoryId: "cat_001",
    createdAt: "2025-01-10T12:00:00Z",
    updatedAt: "2025-02-01T10:30:00Z",
    averageRating: 4.8,
    categories: ["Web Development", "JavaScript"],
    description:
      "Learn JavaScript from scratch to advanced concepts with real projects.",
    duration: 1200,
    id: "course_001",
    imageUrl: "https://placehold.co/600x400/javascript-course",
    learningOutcomes: [
      "Understand JS fundamentals",
      "Work with DOM",
      "Build real projects",
    ],
    prerequisites: ["Basic HTML & CSS"],
    price: 199,
    targetAudience: ["Beginners", "Web Developers"],
    technologies: ["JavaScript", "HTML", "CSS"],
    title: "Mastering JavaScript",
    dealPrice: 149,
    discount: 25,
    instructor: {
      userId: "user_101",
      bio: "Full-stack developer with 10 years of experience.",
      expertise: ["JavaScript", "Node.js", "React"],
      socialLinks: { twitter: "@js_guru", linkedin: "linkedin.com/in/jsguru" },
      createdAt: "2024-12-01T08:00:00Z",
      updatedAt: "2025-01-01T08:00:00Z",
      user: {
        id: "user_101",
        name: "John Doe",
        email: "john@example.com",
        profileImageUrl: "https://placehold.co/200x200/john",
        about: "Loves teaching and building scalable applications.",
      },
    },
    Category: {
      id: "cat_001",
      name: "Programming",
      description: "Courses related to software development",
      createdAt: "2024-10-01T10:00:00Z",
      updatedAt: "2024-10-01T10:00:00Z",
    },
    sections: [
      {
        id: "sec_001",
        title: "Introduction",
        description: "Getting started with JavaScript",
        position: 1,
        courseId: "course_001",
        isPublished: true,
        createdAt: "2025-01-11T09:00:00Z",
        updatedAt: "2025-01-11T09:00:00Z",
        Chapter: [
          {
            id: "chap_001",
            title: "What is JavaScript?",
            description: "Overview of JavaScript",
            position: 1,
            sectionId: "sec_001",
            courseId: "course_001",
            isPublished: true,
            isFree: true,
            contentType: "video",
            content: "https://video.example.com/js-intro",
            createdAt: "2025-01-11T09:05:00Z",
            updatedAt: "2025-01-11T09:05:00Z",
          },
          {
            id: "chap_002",
            title: "Setting up Environment",
            description: "Install VSCode & Node.js",
            position: 2,
            sectionId: "sec_001",
            courseId: "course_001",
            isPublished: true,
            isFree: true,
            contentType: "video",
            content: "https://video.example.com/js-setup",
            createdAt: "2025-01-11T09:10:00Z",
            updatedAt: "2025-01-11T09:10:00Z",
          },
        ],
      },
    ],
  },
  // --- 9 more mock courses (shortened here for brevity) ---
];

export const sampleCourseCategories = [
  { title: "All" },
  { title: "Development" },
  { title: "Mobile Development" },
  { title: "Web Development" },
  { title: "React Native" },
];

export const reviews = [
  {
    name: "Lorean James",
    date: "18 Dec 2023",
    imgurl: "/assets/images/user/user-01.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Kapil Sharma",
    date: "17 Nov 2023",
    imgurl: "/assets/images/user/user-02.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Parveen Singh",
    date: "16 Oct 2023",
    imgurl: "/assets/images/user/user-03.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Naina Choudhary",
    date: "15 Sep 2023",
    imgurl: "/assets/images/user/user-04.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Harish Sain",
    date: "14 Aug 2023",
    imgurl: "/assets/images/user/user-05.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Aman Soni",
    date: "13 July 2023",
    imgurl: "/assets/images/user/user-06.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Naina Choudhary",
    date: "15 Sep 2023",
    imgurl: "/assets/images/user/user-04.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Naina Choudhary",
    date: "15 Sep 2023",
    imgurl: "/assets/images/user/user-04.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Aman Soni",
    date: "13 July 2023",
    imgurl: "/assets/images/user/user-06.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
  {
    name: "Lorean James",
    date: "18 Dec 2023",
    imgurl: "/assets/images/user/user-01.png",
    review:
      "Lorem ipsum dolor sit, amet consectetur adipisicing  ipsum dolor sit, amet consectetur adipisicing elit. elit. .",
  },
];

export const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "completed",
    name: "Version Control System with Git",
    enrollementDate: "21 Feb 2024",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "completed",
    name: "UI/UX Master class",
    enrollementDate: "21 Feb 2024",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "ongoing",
    name: "Full Stack Development with Next.js",
    enrollementDate: "21 Feb 2024",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "completed",
    name: "Introduction to Docker and Containers ",
    enrollementDate: "21 Feb 2024",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "not started",
    name: "Backend Development Bootcamp",
    enrollementDate: "21 Feb 2024",
  },
];

export const courseChapters = [
  {
    title: "Introduction",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 1",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 2",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 3",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 4",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 5",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 6",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 7",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Chapter 8",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
  {
    title: "Outro",
    chapterDuration: "",
    isFree: false,
    position: 0,
  },
];

export const sampleText = `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Provident eos odit nam quae repellat quis cumque reiciendis
                autem ab expedita Provident eos odit nam quae repellat amet
                consectetur adipisicing elit. Provident eos odit nam quae
                repellat quis amet consectetur adipisicing elit. Provident eos
                odit nam quae repellat quis Provident eos odit nam quae repellat
                repellat quis amet consectetur adipisicing elit. Provident eos
                amet consectetur adipisicing elit. Provident eos odit nam quae
                repellat quis cumque reiciendis autem ab expedita Provident eos
                odit nam quae repellat amet consectetur adipisicing elit.
                Provident eos odit nam quae repellat quis amet consectetur
                adipisicing elit. Provident eos odit nam quae repellat quis`;

export const roadmapTemplates = {
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

export const popularSkills = [
  { name: "Backend Developer", icon: Database, category: "Development" },
  { name: "Frontend Developer", icon: Code, category: "Development" },
  { name: "Data Scientist", icon: TrendingUp, category: "Data Science" },
  { name: "DevOps Engineer", icon: Zap, category: "Operations" },
  { name: "Mobile Developer", icon: Smartphone, category: "Mobile" },
  { name: "UI/UX Designer", icon: Palette, category: "Design" },
  { name: "Full Stack Developer", icon: Globe, category: "Development" },
  { name: "Cybersecurity Engineer", icon: Shield, category: "Security" },
];

export const categories = [
  { name: "All", icon: Star },
  { name: "Development", icon: Code },
  { name: "Data Science", icon: TrendingUp },
  { name: "Operations", icon: Zap },
  { name: "Mobile", icon: Smartphone },
  { name: "Design", icon: Palette },
  { name: "Security", icon: Shield },
];

export const sampleProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, TypeScript, and Stripe integration.",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    status: "in-progress",
    difficulty: "advanced",
    category: "Web Development",
    members: [
      {
        id: "1",
        name: "John Doe",
        avatar: "/assets/images/user/user-01.jpg",
        role: "Lead Developer",
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: "/assets/images/user/user-02.jpg",
        role: "UI/UX Designer",
      },
    ],
    progress: 75,
    startDate: "2024-01-15",
    technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS", "Prisma"],
    likes: 42,
    views: 156,
    isBookmarked: true,
    isPublic: true,
  },
  {
    id: "2",
    title: "AI Chat Assistant",
    description:
      "An intelligent chatbot powered by OpenAI GPT-4 with natural language processing.",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    status: "completed",
    difficulty: "expert",
    category: "AI/ML",
    members: [
      {
        id: "3",
        name: "Alex Johnson",
        avatar: "/assets/images/user/user-03.jpg",
        role: "AI Engineer",
      },
    ],
    progress: 100,
    startDate: "2023-11-01",
    technologies: ["Python", "OpenAI", "FastAPI", "React", "PostgreSQL"],
    likes: 89,
    views: 342,
    isBookmarked: false,
    isPublic: true,
  },
  {
    id: "3",
    title: "Mobile Fitness App",
    description:
      "A cross-platform fitness tracking app with workout plans and progress tracking.",
    tags: ["React Native", "Firebase", "Redux", "Node.js"],
    status: "planning",
    difficulty: "intermediate",
    category: "Mobile Development",
    members: [
      {
        id: "4",
        name: "Sarah Wilson",
        avatar: "/assets/images/user/user-04.jpg",
        role: "Mobile Developer",
      },
      {
        id: "5",
        name: "Mike Brown",
        avatar: "/assets/images/user/user-05.jpg",
        role: "Backend Developer",
      },
    ],
    progress: 15,
    startDate: "2024-03-01",
    technologies: ["React Native", "Firebase", "Redux", "Node.js", "MongoDB"],
    likes: 23,
    views: 67,
    isBookmarked: true,
    isPublic: false,
  },
];

export const avatarUrls = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_s8bqkElCOr8R2XL0I4LmiLQexffc-LMRjOaTCAj8ml1UxCXAohpoQ1soZ-GzyQx74l4&usqp=CAU",
  "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScODbPIbdc7AAY2QzQApgWsCzbJ3saUiN-Nm5unofg_beDzFe350o0vHNApy9e17rjXPE&usqp=CAU",
];

export const avatarUrls2 = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6CbDUHMuQk6ZTbcsRN-57V702yP6Mxml3Qt2uw2VrjoEKVUuWTU3ezIQkZCGQmvH8zKY&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS33gDUfkosbpLY1RMMT4jY-Mn9G1jnQdJVZUEZQXy667t30R7zIqbUqMVNadwmbTjt3RU&usqp=CAU",
  "https://i.pinimg.com/originals/c6/9d/d2/c69dd2fd36d5797c9472c738ddce44de.jpg",
];

export const communities = [
  {
    id: "community_clash_of_titans",
    title: "Clash of Titans",
    description:
      "Join top developers in Clash of Titans to conquer complex coding challenges together. Share your expertise and learn from the best in the industry.",
    noOfPeopleOnline: 24,
    totalMembers: 1247,
    avatarUrls: avatarUrls,
    category: {
      id: "asd",
      name: "Development",
      description: "",
      createdAt: "",
      updatedAt: "",
    },
    isTrending: true,
    lastActiveAt: "2 min ago",
    tags: ["JavaScript", "React", "Node.js"],
  },
  {
    id: "community_developers_den",
    title: "Developer's Den",
    description:
      "Developers Den: A collaborative haven for innovative minds to create and share code. Perfect for both beginners and experienced developers.",
    noOfPeopleOnline: 13,
    totalMembers: 892,
    avatarUrls: avatarUrls.toReversed(),
    category: "Development",
    isPopular: true,
    lastActivity: "5 min ago",
    tags: ["Python", "Django", "AI"],
  },
  {
    id: "community_debugging_delemma",
    title: "Debugging Dilemma",
    description:
      "Tackle tough bugs with peers in Debugging Dilemma, your ultimate troubleshooting support network. Get help when you're stuck!",
    noOfPeopleOnline: 9,
    totalMembers: 567,
    avatarUrls: avatarUrls2,
    category: "Support",
    lastActivity: "10 min ago",
    tags: ["Debugging", "Troubleshooting", "Help"],
  },
  {
    id: "community_ai_enthusiasts",
    title: "AI Enthusiasts",
    description:
      "Explore the future of artificial intelligence with fellow enthusiasts. Discuss latest AI trends, models, and applications.",
    noOfPeopleOnline: 31,
    totalMembers: 2156,
    avatarUrls: avatarUrls,
    category: "AI/ML",
    isTrending: true,
    isPopular: true,
    lastActivity: "1 min ago",
    tags: ["Machine Learning", "Deep Learning", "Neural Networks"],
  },
  {
    id: "community_web_designers",
    title: "Web Designers Hub",
    description:
      "A creative space for web designers to share inspiration, discuss design trends, and collaborate on projects.",
    noOfPeopleOnline: 18,
    totalMembers: 743,
    avatarUrls: avatarUrls2,
    category: "Design",
    lastActivity: "8 min ago",
    tags: ["UI/UX", "Design", "Creativity"],
  },
  {
    id: "community_startup_founders",
    title: "Startup Founders",
    description:
      "Connect with fellow entrepreneurs, share startup experiences, and get advice from successful founders.",
    noOfPeopleOnline: 22,
    totalMembers: 1341,
    avatarUrls: avatarUrls,
    category: "Business",
    isPopular: true,
    lastActivity: "3 min ago",
    tags: ["Entrepreneurship", "Startups", "Business"],
  },
];

export const sampleMessages: Message[] = [
  {
    id: "1",
    sender: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "Hey everyone! Welcome to our new community chat! 🎉",
    timestamp: new Date(Date.now() - 3600000),
    isCurrentUser: false,
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "🎉", count: 2 },
    ],
  },
  {
    id: "2",
    sender: "Sam Wilson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Excited to be here! What are we discussing today?",
    timestamp: new Date(Date.now() - 1800000),
    isCurrentUser: false,
    reactions: [{ emoji: "❤️", count: 2 }],
    replyTo: {
      id: "1",
      sender: "Alex Johnson",
      content: "Hey everyone! Welcome to our new community chat! 🎉",
    },
  },
  {
    id: "3",
    sender: "You",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    content:
      "I was thinking we could talk about the upcoming community event next month. Anyone interested in helping organize it?",
    timestamp: new Date(Date.now() - 900000),
    isCurrentUser: true,
    reactions: [
      { emoji: "👍", count: 5 },
      { emoji: "😄", count: 2 },
    ],
  },
  {
    id: "4",
    sender: "Taylor Swift",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    content:
      "That sounds great! I've been working on some ideas for the event. Here's a quick mockup I made:",
    timestamp: new Date(Date.now() - 600000),
    isCurrentUser: false,
    reactions: [],
    attachments: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
        name: "event-mockup.png",
      },
    ],
  },
  {
    id: "5",
    sender: "David Chen",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    content:
      "I can help with the technical setup! Here's the project proposal document:",
    timestamp: new Date(Date.now() - 300000),
    isCurrentUser: false,
    reactions: [{ emoji: "👏", count: 1 }],
    attachments: [
      {
        type: "file",
        url: "#",
        name: "project-proposal.pdf",
        size: "2.4 MB",
      },
    ],
  },
  {
    id: "6",
    sender: "Community Admin",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    content:
      "📢 Important Announcement: Our monthly community meetup will be held this Saturday at 2 PM. Please RSVP in the events channel!",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    isCurrentUser: false,
    reactions: [
      { emoji: "📢", count: 12 },
      { emoji: "👍", count: 8 },
    ],
    isPinned: true,
    pinnedBy: "Community Admin",
    pinnedAt: new Date(Date.now() - 43200000), // 12 hours ago
  },
  {
    id: "7",
    sender: "Emma Davis",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    content:
      "🚀 New Feature Alert: We've just launched our community resource library! Check it out and let us know what you think.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isCurrentUser: false,
    reactions: [
      { emoji: "🚀", count: 15 },
      { emoji: "👏", count: 6 },
    ],
    isPinned: true,
    pinnedBy: "Community Admin",
    pinnedAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "8",
    sender: "Mike Brown",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    content:
      "📚 Weekly Reading List: Here are this week's must-read articles on AI and machine learning. Happy learning!",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isCurrentUser: false,
    reactions: [
      { emoji: "📚", count: 9 },
      { emoji: "❤️", count: 4 },
    ],
    isPinned: true,
    pinnedBy: "Community Admin",
    pinnedAt: new Date(Date.now() - 900000), // 15 minutes ago
  },
];

export const sampleOnlineUsers: OnlineUser[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "online",
  },
  {
    id: "2",
    name: "Sam Wilson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "online",
  },
  {
    id: "3",
    name: "Taylor Swift",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "away",
  },
  {
    id: "4",
    name: "David Chen",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    status: "online",
  },
  {
    id: "5",
    name: "Emma Davis",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    status: "busy",
  },
  {
    id: "6",
    name: "Mike Brown",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    status: "online",
  },
];
