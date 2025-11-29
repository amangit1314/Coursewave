"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically imported heavy components for better code splitting and performance
 * These components are loaded only when needed, reducing initial bundle size
 */

// Rich Text Editor (React Quill)
export const DynamicReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
    ),
});

// Chart Components
export const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
    ),
});

export const DynamicLineChart = dynamic(
    () => import("recharts").then((mod) => ({ default: mod.LineChart })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
        ),
    }
);

export const DynamicBarChart = dynamic(
    () => import("recharts").then((mod) => ({ default: mod.BarChart })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
        ),
    }
);

export const DynamicPieChart = dynamic(
    () => import("recharts").then((mod) => ({ default: mod.PieChart })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
        ),
    }
);

// Video Players
export const DynamicMuxPlayer = dynamic(
    () => import("@mux/mux-player-react"),
    {
        ssr: false,
        loading: () => (
            <div className="w-full aspect-video bg-black flex items-center justify-center" >
                <div className="text-white"> Loading video player...</div>
            </div>
        ),
    }
);

export const DynamicReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-video bg-black flex items-center justify-center" >
            <div className="text-white"> Loading video player...</div>
        </div>
    ),
});

// PDF Generator
// Note: jsPDF is a library, not a React component, so it cannot be used with Next.js dynamic()
// Import it directly where needed: import { jsPDF } from 'jspdf';

// Confetti
export const DynamicConfetti = dynamic(() => import("react-confetti"), {
    ssr: false,
});

// Lottie Animation
export const DynamicLottie = dynamic(() => import("lottie-react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
    ),
});

// React Flow (for diagrams/flowcharts)
export const DynamicReactFlow = dynamic(() => import("reactflow"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
    ),
});

// Swiper Carousel
export const DynamicSwiper = dynamic(
    () => import("swiper/react").then((mod) => ({ default: mod.Swiper })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
        ),
    }
);

export const DynamicSwiperSlide = dynamic(
    () => import("swiper/react").then((mod) => ({ default: mod.SwiperSlide })),
    {
        ssr: false,
    }
);

// Drag and Drop
export const DynamicDragDropContext = dynamic(
    () =>
        import("@hello-pangea/dnd").then((mod) => ({
            default: mod.DragDropContext,
        })),
    {
        ssr: false,
    }
);

export const DynamicDraggable = dynamic(
    () => import("@hello-pangea/dnd").then((mod) => ({ default: mod.Draggable })),
    {
        ssr: false,
    }
);

export const DynamicDroppable = dynamic(
    () => import("@hello-pangea/dnd").then((mod) => ({ default: mod.Droppable })),
    {
        ssr: false,
    }
);
