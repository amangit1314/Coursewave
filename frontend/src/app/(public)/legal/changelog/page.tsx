// app/changelog/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GitBranch, 
  Zap, 
  Bug, 
  Star, 
  Users, 
  Shield,
  Rocket,
  BookOpen,
  Video,
  MessageSquare,
  Smartphone,
  Palette
} from "lucide-react";

export default function ChangelogPage() {
  const [filter, setFilter] = useState("all");

  const updates = [
    {
      version: "v2.1.0",
      date: "2024-12-15",
      title: "Mobile Learning Revolution",
      type: "major",
      highlights: [
        {
          icon: Smartphone,
          title: "Native Mobile App",
          description: "Completely redesigned mobile app with offline learning support",
          category: "mobile"
        },
        {
          icon: Video,
          title: "Video Download",
          description: "Download course videos for offline viewing",
          category: "feature"
        },
        {
          icon: Zap,
          title: "Performance Boost",
          description: "60% faster video loading and smoother animations",
          category: "improvement"
        }
      ],
      changes: [
        { type: "added", text: "Mobile app for iOS and Android" },
        { type: "added", text: "Offline video download capability" },
        { type: "improved", text: "Video player performance and reliability" },
        { type: "improved", text: "Mobile navigation and touch interactions" },
        { type: "fixed", text: "Video playback issues on slow connections" }
      ]
    },
    {
      version: "v2.0.0",
      date: "2024-11-28",
      title: "Learning Platform 2.0",
      type: "major",
      highlights: [
        {
          icon: Rocket,
          title: "AI Learning Assistant",
          description: "Personalized learning paths and smart recommendations",
          category: "ai"
        },
        {
          icon: Users,
          title: "Study Groups",
          description: "Collaborate with peers in dedicated study spaces",
          category: "community"
        },
        {
          icon: BookOpen,
          title: "Interactive Coding",
          description: "Built-in code editor with real-time feedback",
          category: "learning"
        }
      ],
      changes: [
        { type: "added", text: "AI-powered learning assistant" },
        { type: "added", text: "Study groups and collaborative learning" },
        { type: "added", text: "Interactive coding exercises" },
        { type: "added", text: "Progress analytics dashboard" },
        { type: "improved", text: "Course recommendation algorithm" },
        { type: "fixed", text: "Several UI/UX inconsistencies" }
      ]
    },
    {
      version: "v1.3.0",
      date: "2024-10-12",
      title: "Community & Engagement",
      type: "minor",
      highlights: [
        {
          icon: MessageSquare,
          title: "Live Q&A Sessions",
          description: "Real-time Q&A with instructors and experts",
          category: "community"
        },
        {
          icon: Star,
          title: "Gamified Learning",
          description: "Earn badges and points for completing challenges",
          category: "engagement"
        },
        {
          icon: Users,
          title: "Peer Reviews",
          description: "Get feedback from fellow students on your projects",
          category: "learning"
        }
      ],
      changes: [
        { type: "added", text: "Live Q&A feature with instructors" },
        { type: "added", text: "Gamification system with badges" },
        { type: "added", text: "Peer review and feedback system" },
        { type: "improved", text: "Discussion forum performance" },
        { type: "fixed", text: "Notification delivery issues" }
      ]
    },
    {
      version: "v1.2.1",
      date: "2024-09-20",
      title: "Performance & Security",
      type: "patch",
      highlights: [
        {
          icon: Shield,
          title: "Enhanced Security",
          description: "Advanced security measures and data protection",
          category: "security"
        },
        {
          icon: Zap,
          title: "Speed Optimization",
          description: "Faster page loads and smoother interactions",
          category: "performance"
        }
      ],
      changes: [
        { type: "improved", text: "API response times by 40%" },
        { type: "improved", text: "Video streaming quality algorithm" },
        { type: "fixed", text: "Security vulnerability in file upload" },
        { type: "fixed", text: "Memory leaks in video player" },
        { type: "fixed", text: "Mobile Safari rendering issues" }
      ]
    },
    {
      version: "v1.2.0",
      date: "2024-08-05",
      title: "Learning Experience Upgrade",
      type: "minor",
      highlights: [
        {
          icon: BookOpen,
          title: "Advanced Quizzes",
          description: "Multiple question types and instant feedback",
          category: "learning"
        },
        {
          icon: Palette,
          title: "Dark Mode",
          description: "Complete dark theme for comfortable learning",
          category: "ui"
        },
        {
          icon: Video,
          title: "Playback Controls",
          description: "Speed control, subtitles, and video bookmarks",
          category: "video"
        }
      ],
      changes: [
        { type: "added", text: "Dark mode theme" },
        { type: "added", text: "Advanced quiz system" },
        { type: "added", text: "Video playback speed control" },
        { type: "added", text: "Subtitle support for videos" },
        { type: "improved", text: "Course progress tracking" },
        { type: "fixed", text: "Quiz scoring calculation bugs" }
      ]
    },
    {
      version: "v1.1.0",
      date: "2024-07-15",
      title: "Initial Public Release",
      type: "major",
      highlights: [
        {
          icon: Rocket,
          title: "Platform Launch",
          description: "Official public release of CourseWave",
          category: "launch"
        },
        {
          icon: Users,
          title: "Community Features",
          description: "Student discussions and peer networking",
          category: "community"
        },
        {
          icon: BookOpen,
          title: "Core Learning",
          description: "Video courses, quizzes, and progress tracking",
          category: "learning"
        }
      ],
      changes: [
        { type: "added", text: "Complete course platform" },
        { type: "added", text: "User registration and profiles" },
        { type: "added", text: "Video streaming infrastructure" },
        { type: "added", text: "Payment processing system" },
        { type: "added", text: "Instructor dashboard" },
        { type: "added", text: "Student progress tracking" }
      ]
    }
  ];

  const filters = [
    { id: "all", label: "All Updates" },
    { id: "major", label: "Major Releases" },
    { id: "minor", label: "Minor Updates" },
    { id: "patch", label: "Bug Fixes" }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "minor": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "patch": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "major": return "Major Release";
      case "minor": return "Minor Update";
      case "patch": return "Bug Fixes";
      default: return "Update";
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "added": return "text-green-600 dark:text-green-400";
      case "improved": return "text-blue-600 dark:text-blue-400";
      case "fixed": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "added": return "🆕";
      case "improved": return "⚡";
      case "fixed": return "🐛";
      default: return "•";
    }
  };

  const filteredUpdates = filter === "all" 
    ? updates 
    : updates.filter(update => update.type === filter);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GitBranch className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Changelog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest features, improvements, and fixes we're shipping to make your learning experience better.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === filterItem.id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
              }`}
            >
              {filterItem.label}
            </button>
          ))}
        </motion.div>

        {/* Updates Timeline */}
        <div className="space-y-8">
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Update Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(update.type)}`}>
                        {getTypeLabel(update.type)}
                      </span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {update.version}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {update.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Released on {new Date(update.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {update.highlights.map((highlight, idx) => {
                    const Icon = highlight.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {highlight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {highlight.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Changes */}
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  What's Changed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">New Features & Improvements</h4>
                    <ul className="space-y-2">
                      {update.changes
                        .filter(change => change.type !== "fixed")
                        .map((change, idx) => (
                          <li key={idx} className={`flex items-start space-x-2 ${getChangeColor(change.type)}`}>
                            <span>{getChangeIcon(change.type)}</span>
                            <span>{change.text}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bug Fixes</h4>
                    <ul className="space-y-2">
                      {update.changes
                        .filter(change => change.type === "fixed")
                        .map((change, idx) => (
                          <li key={idx} className={`flex items-start space-x-2 ${getChangeColor(change.type)}`}>
                            <span>{getChangeIcon(change.type)}</span>
                            <span>{change.text}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
            <p className="mb-4 opacity-90">
              Get notified when we release new features and updates
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}