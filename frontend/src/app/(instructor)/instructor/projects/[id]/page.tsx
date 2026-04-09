"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Award,
  BookOpen,
  Code,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useProjectDetails } from "@/hooks/useProjects";
import { useParams } from "next/navigation";

const mockIsEnrolled = true;
const mockSubmissionFeedback = {
  rating: 4,
  comments:
    "Great job on your project! The implementation is solid and shows good understanding of Next.js concepts. Consider improving the UI accessibility with proper ARIA labels and keyboard navigation. Also, add more comprehensive error handling for the payment flow.",
};

const InstructorProjectPage = () => {
  // Simulate useParams from Next.js
  // const projectId = "ecommerce-nextjs-project";
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectDetails(projectId);

  const [isDark, setIsDark] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!submissionUrl?.trim()) return;
    setSubmitted(true);
  };

  const toggleTheme = () => setIsDark(!isDark);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return isDark
          ? "bg-green-500/20 text-green-300 border-green-500/30"
          : "bg-green-100 text-green-700 border-green-300";
      case "intermediate":
        return isDark
          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
          : "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "advanced":
        return isDark
          ? "bg-red-500/20 text-red-300 border-red-500/30"
          : "bg-red-100 text-red-700 border-red-300";
      default:
        return isDark
          ? "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
          : "bg-zinc-100 text-zinc-700 border-zinc-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return isDark
          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
          : "bg-blue-100 text-blue-700 border-blue-300";
      case "completed":
        return isDark
          ? "bg-green-500/20 text-green-300 border-green-500/30"
          : "bg-green-100 text-green-700 border-green-300";
      case "upcoming":
        return isDark
          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
          : "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return isDark
          ? "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
          : "bg-zinc-100 text-zinc-700 border-zinc-300";
    }
  };

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${isDark ? "bg-zinc-900 text-zinc-300" : "bg-zinc-50 text-zinc-500"}`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4 ${isDark ? "border-blue-400" : "border-blue-600"}`}
          ></div>
          <p className="text-lg font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}
      >
        <div
          className={`text-center p-8 rounded-2xl ${isDark ? "bg-zinc-800" : "bg-white"} shadow-xl max-w-md`}
        >
          <AlertCircle
            className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-red-400" : "text-red-500"}`}
          />
          <h2
            className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Error Loading Project
          </h2>
          <p className={isDark ? "text-zinc-300" : "text-zinc-600"}>
            {(error as any)?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}
      >
        <div
          className={`text-center p-8 rounded-2xl ${isDark ? "bg-zinc-800" : "bg-white"} shadow-xl max-w-md`}
        >
          <BookOpen
            className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          />
          <h2
            className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Project Not Found
          </h2>
          <p className={isDark ? "text-zinc-300" : "text-zinc-600"}>
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen  transition-colors duration-300 dark:bg-zinc-900 bg-gradient-to-br from-zinc-50 dark:from-zinc-900  via-blue-50 dark:via-zinc-950 to-purple-50`}
    >
      <main className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0 md:pb-12 md:pt-24">
        {/* Hero Section */}
        <div
          className={`rounded-3xl overflow-hidden shadow-2xl mb-12 ${isDark ? "bg-zinc-800" : "bg-white"}`}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto overflow-hidden group">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div
                  className={`flex items-center justify-center w-full h-full ${isDark ? "bg-zinc-700 text-zinc-500" : "bg-zinc-200 text-zinc-400"}`}
                >
                  <Code className="w-20 h-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 flex gap-3 flex-wrap">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
                {project.difficulty && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getDifficultyColor(project.difficulty)}`}
                  >
                    {project.difficulty}
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12">
              <h1
                className={`text-4xl lg:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                {project.title}
              </h1>
              <p
                className={`text-lg leading-relaxed mb-8 whitespace-pre-line ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
              >
                {project.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.deadline && (
                  <div
                    className={`p-4 rounded-xl ${isDark ? "bg-zinc-700/50" : "bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                      />
                      <span
                        className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        Deadline
                      </span>
                    </div>
                    <p
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}
                    >
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {project.startDate && (
                  <div
                    className={`p-4 rounded-xl ${isDark ? "bg-zinc-700/50" : "bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target
                        className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`}
                      />
                      <span
                        className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        Start Date
                      </span>
                    </div>
                    <p
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}
                    >
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div
                  className={`p-4 rounded-xl ${isDark ? "bg-zinc-700/50" : "bg-zinc-50"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap
                      className={`w-4 h-4 dark:text-purple-400" text-purple-600`}
                    />
                    <span
                      className={`text-sm font-medium dark:text-zinc-400 text-zinc-500`}
                    >
                      Max Submissions
                    </span>
                  </div>
                  <p
                    className={`text-lg font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    {project.maxSubmissions ?? "Unlimited"}
                  </p>
                </div>
              </div>

              {project.endDate && (
                <div
                  className={`mt-4 p-3 rounded-lg ${isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"}`}
                >
                  <p
                    className={`text-sm ${isDark ? "text-blue-300" : "text-blue-700"}`}
                  >
                    <span className="font-semibold">End Date:</span>{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories & Tags */}
            <div
              className={`p-8 rounded-2xl shadow-lg ${isDark ? "bg-zinc-800" : "bg-white"}`}
            >
              {project.categories.length > 0 && (
                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    <BookOpen className="w-5 h-5" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.tags.length > 0 && (
                <div>
                  <h3
                    className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    <Code className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Learning Outcomes */}
            {project.learningOutcomes.length > 0 && (
              <div
                className={`p-8 rounded-2xl shadow-lg ${isDark ? "bg-zinc-800" : "bg-white"}`}
              >
                <h3
                  className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}
                >
                  <Award className="w-5 h-5" />
                  Learning Outcomes
                </h3>
                <ul className="space-y-3">
                  {project.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`}
                      />
                      <span
                        className={isDark ? "text-zinc-300" : "text-zinc-700"}
                      >
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submission Section */}
            <div
              className={`p-8 rounded-2xl shadow-lg ${isDark ? "bg-zinc-800" : "bg-white"}`}
            >
              <h2
                className={`text-2xl font-semibold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                <ArrowRight className="w-6 h-6" />
                Submit Your Project
              </h2>
              {mockIsEnrolled ? (
                <>
                  {!submitted ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                        >
                          Project URL (GitHub, CodePen, Live Demo, etc.)
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/username/project"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            isDark
                              ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
                              : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-blue-500"
                          } focus:outline-none`}
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={!submissionUrl.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-6 py-3 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-blue-600 disabled:hover:to-purple-600"
                      >
                        Submit Project
                      </button>
                      <p
                        className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        Make sure your project meets all the requirements before
                        submitting. You can submit up to{" "}
                        {project.maxSubmissions ?? "unlimited"} times.
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`rounded-xl p-6 ${isDark ? "bg-green-500/20 border border-green-500/30" : "bg-green-50 border border-green-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle
                          className={`w-6 h-6 flex-shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`}
                        />
                        <div>
                          <p
                            className={`font-semibold mb-1 ${isDark ? "text-green-300" : "text-green-800"}`}
                          >
                            Submission Received!
                          </p>
                          <p
                            className={`text-sm ${isDark ? "text-green-400" : "text-green-700"}`}
                          >
                            Thank you for your submission. You'll receive
                            feedback within 2-3 business days.
                          </p>
                          <p
                            className={`text-sm mt-2 ${isDark ? "text-green-400" : "text-green-700"}`}
                          >
                            <strong>Submitted URL:</strong> {submissionUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitted && (
                    <div
                      className={`mt-6 p-6 rounded-xl border-2 ${isDark ? "bg-zinc-700/50 border-zinc-600" : "bg-zinc-50 border-zinc-200"}`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}
                      >
                        <Award className="w-5 h-5" />
                        Submission Feedback
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                        >
                          Rating:
                        </span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-2xl ${i < mockSubmissionFeedback.rating ? "text-yellow-400" : isDark ? "text-zinc-600" : "text-zinc-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span
                          className={`font-semibold ml-2 ${isDark ? "text-white" : "text-zinc-900"}`}
                        >
                          {mockSubmissionFeedback.rating} / 5
                        </span>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${isDark ? "bg-zinc-600/50" : "bg-white"}`}
                      >
                        <p
                          className={`font-medium mb-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                        >
                          Instructor Comments:
                        </p>
                        <p
                          className={isDark ? "text-zinc-300" : "text-zinc-700"}
                        >
                          {mockSubmissionFeedback.comments}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`rounded-xl p-6 ${isDark ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-yellow-50 border border-yellow-200"}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`w-6 h-6 flex-shrink-0 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                    />
                    <div>
                      <p
                        className={`font-semibold mb-1 ${isDark ? "text-yellow-300" : "text-yellow-800"}`}
                      >
                        Enrollment Required
                      </p>
                      <p
                        className={
                          isDark ? "text-yellow-300" : "text-yellow-800"
                        }
                      >
                        You must be enrolled in the course to submit this
                        project and receive feedback.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Prerequisites */}
            {project.prerequisites.length > 0 && (
              <div
                className={`p-6 rounded-2xl shadow-lg ${isDark ? "bg-zinc-800" : "bg-white"}`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}
                >
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {project.prerequisites.map((pre, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-blue-400" : "bg-blue-600"}`}
                      />
                      <span
                        className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                      >
                        {pre}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div
                className={`p-6 rounded-2xl shadow-lg ${isDark ? "bg-zinc-800" : "bg-white"}`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}
                >
                  Technologies
                </h3>
                <ul className="space-y-2">
                  {project.technologies.map((tech, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Code
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                      />
                      <span
                        className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                      >
                        {tech}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {project.resources.length > 0 && (
              <div
                className={`p-6 rounded-2xl shadow-lg ${isDark ? "bg-zinc-800" : "bg-white"}`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}
                >
                  Resources
                </h3>
                <ul className="space-y-3">
                  {project.resources.map((res, idx) => (
                    <li key={idx}>
                      <a
                        href={res}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm hover:underline transition-colors group ${
                          isDark
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        <span className="truncate">{res}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta Info */}
            <div
              className={`p-6 rounded-2xl shadow-lg text-sm ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-white text-zinc-500"}`}
            >
              <h3
                className={`text-base font-semibold mb-3 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
              >
                Project Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`mt-16 py-8 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Need help? Contact your instructor or check the course discussion
            forum.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InstructorProjectPage;
