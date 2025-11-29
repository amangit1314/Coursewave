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
import { dmSans, poppins } from "@/lib/config/fonts";
import { useCheckCourseIsPurchased } from "@/hooks/useCourses";
import { useSubmitProject, useProjectSubmissions, useSubmissionFeedback } from "@/hooks/useProjects";

const ProjectPage = () => {
  const params = useParams<{ slug: string }>();
  const projectId = params.slug;

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectDetails(projectId);
  const { data: submissions } = useProjectSubmissions(projectId);
  const { data: feedback } = useSubmissionFeedback(projectId, submissions?.[0]?.id);

  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { courseIsPurchased } = useCheckCourseIsPurchased(project?.courseId!);

  const handleSubmit = () => {
    if (!submissionUrl?.trim()) return;
    setSubmitted(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-50 dark:text-emerald-700 dark:border-emerald-200 bg-emerald-50 dark:bg-emerald-50 dark:text-emerald-700 dark:text-emerald-700 dark:border-emerald-200";
      case "intermediate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 dark:bg-amber-50 dark:text-amber-700 dark:border-amber-200";
      case "advanced":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20 dark:bg-rose-50 dark:text-rose-700 dark:border-rose-200";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 dark:bg-zinc-50 dark:text-zinc-700 dark:border-zinc-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20 dark:bg-blue-500 dark:text-blue-700 dark:border-blue-200";
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-50- dark:text-emerald-700 dark:border-emerald-200";
      case "upcoming":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20 dark:bg-purple-500 dark:text-purple-700 dark:border-purple-200";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 dark:bg-zinc-500 dark:text-zinc-700 dark:border-zinc-200";
    }
  };

  if (isLoading) {
    return (
      <div
        className={`${poppins.className} flex justify-center items-center h-screen dark:bg-zinc-950 dark:text-zinc-400 bg-white text-zinc-500`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4 dark:border-blue-500 border-blue-600`}
          ></div>
          <p className="text-sm font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`flex justify-center items-center h-screen dark:bg-zinc-950 dark:text-zinc-400 bg-white text-zinc-500`}
      >
        <div
          className={`text-center p-8 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200 max-w-md`}
        >
          <AlertCircle
            className={`w-12 h-12 mx-auto mb-4 dark:text-rose-500 text-rose-600`}
          />
          <h2
            className={`${dmSans.className} text-xl font-semibold mb-2 dark:text-white text-zinc-900`}
          >
            Error Loading Project
          </h2>
          <p className={`${poppins.className} text-sm dark:text-zinc-400 text-zinc-600`}>
            {(error as any)?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className={`flex justify-center items-center h-screen dark:bg-zinc-950 dark:text-zinc-400 bg-white text-zinc-500`}
      >
        <div
          className={`text-center p-8 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200 max-w-md`}
        >
          <BookOpen
            className={`w-12 h-12 mx-auto mb-4 dark:text-zinc-600 text-zinc-400`}
          />
          <h2
            className={`${dmSans.className} text-xl font-semibold mb-2 dark:text-white text-zinc-900`}
          >
            Project Not Found
          </h2>
          <p className={`${poppins.className} text-sm dark:text-zinc-400 text-zinc-600`}>
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 dark:bg-zinc-950 bg-white`}
    >

      <main className="max-w-screen mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Hero Section */}
        <div
          className={`rounded-2xl overflow-hidden border mb-10 dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-72 lg:h-auto overflow-hidden">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`flex items-center justify-center w-full h-full dark:bg-zinc-800 dark:text-zinc-600 bg-zinc-200 text-zinc-400`}
                >
                  <Code className="w-16 h-16" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                <span
                  className={`${poppins.className} px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
                {project.difficulty && (
                  <span
                    className={`${poppins.className} px-3 py-1.5 rounded-lg text-xs font-medium border ${getDifficultyColor(project.difficulty)}`}
                  >
                    {project.difficulty}
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10">
              <h1
                className={`${dmSans.className} text-3xl lg:text-4xl font-bold mb-4 dark:text-white text-zinc-900`}
              >
                {project.title}
              </h1>
              <p
                className={`${poppins.className} text-base leading-relaxed mb-8 dark:text-zinc-400 text-zinc-600`}
              >
                {project.description}
              </p>

              {/* deadline, max  Stats */}
              <div className="grid grid-cols-2 gap-3">
                {project.deadline && (
                  <div
                    className={`p-4 rounded-xl border dark:bg-zinc-800/50 dark:border-zinc-700 bg-white border-zinc-200`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        className={`w-4 h-4 dark:text-blue-400 text-blue-600`}
                      />
                      <span
                        className={`${poppins.className} text-xs dark:text-zinc-500 text-zinc-500`}
                      >
                        Deadline
                      </span>
                    </div>
                    <p
                      className={`${dmSans.className} text-sm font-semibold dark:text-white text-zinc-900`}
                    >
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl border dark:bg-zinc-800/50 dark:border-zinc-700 bg-white border-zinc-200`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap
                      className={`w-4 h-4 dark:text-purple-400 text-purple-600`}
                    />
                    <span
                      className={`${poppins.className} text-xs dark:text-zinc-500 text-zinc-500`}
                    >
                      Max Submissions
                    </span>

                    {/* <p
                      className={`${dmSans.className} text-sm font-semibold dark:text-white text-zinc-900`}
                    >
                      {project.maxSubmissions ?? "Unlimited"}
                    </p> */}
                  </div>
                  <p
                    className={`${dmSans.className} text-sm font-semibold dark:text-white text-zinc-900`}
                  >
                    {project.maxSubmissions ?? "Unlimited"}
                  </p>
                </div>
              </div>

              {/* Start Date, end date */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {project.startDate && (
                  <div
                    className={`p-4 rounded-xl border dark:bg-zinc-800/50 dark:border-zinc-700 bg-white border-zinc-200`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target
                        className={`w-4 h-4 dark:text-emerald-400 text-emerald-600`}
                      />
                      <span
                        className={`${poppins.className} text-xs dark:text-zinc-500 text-zinc-500`}
                      >
                        Start Date
                      </span>
                    </div>
                    <p
                      className={`${dmSans.className} text-sm font-semibold dark:text-white text-zinc-900`}
                    >
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {project.endDate && (
                  <div
                    className={`p-4 rounded-xl border dark:bg-zinc-800/50 dark:border-zinc-700 bg-white border-zinc-200`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target
                        className={`w-4 h-4 dark:text-emerald-400 text-emerald-600`}
                      />
                      <span
                        className={`${poppins.className} text-xs dark:text-zinc-500 text-zinc-500`}
                      >
                        End Date
                      </span>
                    </div>
                    <p
                      className={`${dmSans.className} text-sm font-semibold dark:text-white text-zinc-900`}
                    >
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories & Tags */}
            <div
              className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
            >
              {project.categories.length > 0 && (
                <div className="mb-6">
                  <h3
                    className={`${dmSans.className} text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white text-zinc-900`}
                  >
                    <BookOpen className="w-5 h-5" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`${poppins.className} px-3 py-1.5 rounded-lg text-sm border dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 bg-blue-50 text-blue-700 border-blue-200`}
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
                    className={`${dmSans.className} text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white text-zinc-900`}
                  >
                    <Code className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`${poppins.className} px-3 py-1.5 rounded-lg text-sm border dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 bg-emerald-50 text-emerald-700 border-emerald-200`}
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
                className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
              >
                <h3
                  className={`${dmSans.className} text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white text-zinc-900`}
                >
                  <Award className="w-5 h-5" />
                  Learning Outcomes
                </h3>
                <ul className="space-y-3">
                  {project.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 dark:text-emerald-400 text-emerald-600`}
                      />
                      <span
                        className={`${poppins.className} text-sm dark:text-zinc-400 text-zinc-700`}
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
              className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
            >
              <h2
                className={`${dmSans.className} text-xl font-semibold mb-5 flex items-center gap-2 dark:text-white text-zinc-900`}
              >
                <ArrowRight className="w-5 h-5" />
                Submit Your Project
              </h2>
              {courseIsPurchased ? (
                <>
                  {!submitted ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`${poppins.className} block text-sm font-medium mb-2 dark:text-zinc-400 text-zinc-700`}
                        >
                          Project URL (GitHub, CodePen, Live Demo, etc.)
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/username/project"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          className={`${poppins.className} w-full px-4 py-2.5 rounded-lg border transition-colors dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none text-sm`}
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={!submissionUrl.trim()}
                        className={`${dmSans.className} w-full rounded-lg px-6 py-2.5 font-medium transition-colors text-sm ${submissionUrl.trim()
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                          }`}
                      >
                        Submit Project
                      </button>
                      <p
                        className={`${poppins.className} text-xs dark:text-zinc-500 text-zinc-500`}
                      >
                        Make sure your project meets all the requirements before
                        submitting. You can submit up to{" "}
                        {project.maxSubmissions ?? "unlimited"} times.
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg p-5 border dark:bg-emerald-500/5 dark:border-emerald-500/20 bg-emerald-50 border-emerald-200`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 dark:text-emerald-400 text-emerald-600`}
                        />
                        <div>
                          <p
                            className={`${dmSans.className} font-semibold mb-1 text-sm dark:text-emerald-400 text-emerald-800`}
                          >
                            Submission Received!
                          </p>
                          <p
                            className={`${poppins.className} text-sm dark:text-emerald-400 text-emerald-700`}
                          >
                            Thank you for your submission. You'll receive
                            feedback within 2-3 business days.
                          </p>
                          <p
                            className={`${poppins.className} text-sm mt-2 dark:text-emerald-400 text-emerald-700`}
                          >
                            <strong>Submitted URL:</strong> {submissionUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitted && (
                    <div
                      className={`mt-6 p-5 rounded-lg border dark:bg-zinc-800/50 dark:border-zinc-700 bg-white border-zinc-200`}
                    >
                      <h3
                        className={`${dmSans.className} text-base font-semibold mb-4 flex items-center gap-2 dark:text-white text-zinc-900`}
                      >
                        <Award className="w-5 h-5" />
                        Submission Feedback
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`${poppins.className} text-sm font-medium dark:text-zinc-400 text-zinc-700`}
                        >
                          Rating:
                        </span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${i < feedback?.rating ? "text-amber-400" : "text-zinc-700"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span
                          className={`${dmSans.className} text-sm font-semibold ml-1 dark:text-white text-zinc-900`}
                        >
                          {feedback?.rating} / 5
                        </span>
                      </div>
                      <div
                        className={`p-4 rounded-lg border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
                      >
                        <p
                          className={`${dmSans.className} text-sm font-medium mb-2 dark:text-zinc-300 text-zinc-800`}
                        >
                          Instructor Comments:
                        </p>
                        <p
                          className={`${poppins.className} text-sm dark:text-zinc-400 text-zinc-700`}
                        >
                          {feedback?.comments}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`rounded-lg p-5 border dark:bg-amber-500/5 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-800 border-amber-200`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 dark:text-amber-300 text-amber-600`}
                    />
                    <div>
                      <p
                        className={`${dmSans.className} font-semibold mb-1 text-sm dark:text-amber-300 text-amber-800`}
                      >
                        Enrollment Required
                      </p>
                      <p
                        className={`${poppins.className} text-sm dark:text-amber-300 text-amber-700`}
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
                className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
              >
                <h3
                  className={`${dmSans.className} text-base font-semibold mb-4 dark:text-white text-zinc-900`}
                >
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {project.prerequisites.map((pre, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 dark:bg-blue-400 bg-blue-600`}
                      />
                      <span
                        className={`${poppins.className} text-sm dark:text-zinc-400 text-zinc-700`}
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
                className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
              >
                <h3
                  className={`${dmSans.className} text-base font-semibold mb-4 dark:text-white text-zinc-900`}
                >
                  Technologies
                </h3>
                <ul className="space-y-2">
                  {project.technologies.map((tech, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Code
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 dark:text-purple-400 text-purple-600`}
                      />
                      <span
                        className={`${poppins.className} text-sm dark:text-zinc-400 text-zinc-700`}
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
                className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
              >
                <h3
                  className={`${dmSans.className} text-base font-semibold mb-4 dark:text-white text-zinc-900`}
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
                        className={`${poppins.className} flex items-center gap-2 text-sm transition-colors dark:text-blue-400 hover:text-blue-300 text-blue-600 hover:text-blue-700`}
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{res}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta Info */}
            <div
              className={`p-6 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200`}
            >
              <h3
                className={`${dmSans.className} text-base font-semibold mb-3 dark:text-white text-zinc-900`}
              >
                Project Information
              </h3>
              <div className={`${poppins.className} space-y-2 text-sm dark:text-zinc-400 text-zinc-600`}>
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
        className={`mt-16 py-8 border-t dark:border-zinc-800 border-zinc-200`}
      >
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className={`${poppins.className} text-sm dark:text-zinc-500 text-zinc-500`}
          >
            Need help? Contact your instructor or check the course discussion forum.
          </p>
        </div>
      </footer>
    </div>);
};


export default ProjectPage;