"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Code,
  BookOpen,
  Award,
  Tag,
  Link as LinkIcon,
  Upload,
  X,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  CircleArrowLeft,
  Layers,
} from "lucide-react";
import { useProjectDetails } from "@/hooks/useProjects";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const EditProjectPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params.id;

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectDetails(projectId);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnailUrl: "",
    status: "active",
    difficulty: "beginner",
    startDate: "",
    deadline: "",
    endDate: "",
    maxSubmissions: "",
    categories: [] as string[],
    tags: [] as string[],
    learningOutcomes: [] as string[],
    prerequisites: [] as string[],
    technologies: [] as string[],
    resources: [] as string[],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newLearningOutcome, setNewLearningOutcome] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [newResource, setNewResource] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Populate form when project data loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        thumbnailUrl: project.thumbnailUrl || "",
        status: project.status || "active",
        difficulty: project.difficulty || "beginner",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        deadline: project.deadline
          ? new Date(project.deadline).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        maxSubmissions: project.maxSubmissions?.toString() || "",
        categories: project.categories || [],
        tags: project.tags || [],
        learningOutcomes: project.learningOutcomes || [],
        prerequisites: project.prerequisites || [],
        technologies: project.technologies || [],
        resources: project.resources || [],
      });
      setThumbnailPreview(project.thumbnailUrl || "");
    }
  }, [project]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addArrayItem = (field: keyof typeof formData, value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      console.log("Saving project:", formData);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        // Uncomment to redirect after save
        // router.push(`/instructor/projects/${projectId}`);
      }, 3000);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-zinc-500 dark:text-zinc-300">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <div className="text-center p-8 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" />
          <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
            Error Loading Project
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            {(error as any)?.message || "Project not found"}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0 md:pt-8">
        {/* Success Toast */}
        {saveSuccess && (
          <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Changes Saved!</p>
                <p className="text-sm opacity-90">
                  Your project has been updated successfully
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 group hover:bg-white/50 dark:hover:bg-blue-800/50"
          >
            <CircleArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Project
          </Button>
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-2">
            Edit Project
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Update your project details and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          {/* Basic Information */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Project Thumbnail
                </label>
                <div className="flex items-start gap-6">
                  {thumbnailPreview ? (
                    <div className="relative group">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-48 h-48 object-cover rounded-xl border-2 border-zinc-200 dark:border-zinc-700 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailPreview("");
                          setFormData((prev) => ({
                            ...prev,
                            thumbnailUrl: "",
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
                    </div>
                  ) : (
                    <div className="w-48 h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                      <ImageIcon className="w-16 h-16 text-zinc-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all">
                        <Upload className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter project title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                  placeholder="project-slug"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  URL-friendly version of the title. Use lowercase letters and
                  hyphens only.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Describe your project in detail..."
                />
              </div>

              {/* Status and Difficulty */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="relative">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="archived">Archived</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Difficulty */}
                <div className="relative">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Dates and Submissions */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Timeline & Submissions
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Max Submissions
                </label>
                <input
                  type="number"
                  name="maxSubmissions"
                  value={formData.maxSubmissions}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Unlimited"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Leave empty for unlimited submissions
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex justify-between items-center  mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Categories
              </h2>

              <Button
                type="button"
                onClick={() => {
                  addArrayItem("categories", newCategory);
                  setNewCategory("");
                }}
                className="h-full flex items-center justify-center px-6 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("categories", newCategory);
                    setNewCategory("");
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Add category and press Enter..."
              />
            </div>
            {formData.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center gap-2 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("categories", idx)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                No categories added yet
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex justify-between items-center  mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
                Tags
              </h2>

              <Button
                type="button"
                onClick={() => {
                  addArrayItem("categories", newCategory);
                  setNewCategory("");
                }}
                className="h-full flex items-center justify-center px-6 bg-green-600 hover:bg-green-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("tags", newTag);
                    setNewTag("");
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Add tag and press Enter..."
              />
            </div>
            {formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 flex items-center gap-2 border border-green-200 dark:border-green-500/30 hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("tags", idx)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                No tags added yet
              </p>
            )}
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            {/* <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Learning Outcomes
            </h2> */}
            <div className="flex justify-between items-center  mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                Learning Outcomes
              </h2>

              <Button
                type="button"
                onClick={() => {
                  addArrayItem("learningOutcomes", newLearningOutcome);
                  setNewLearningOutcome("");
                }}
                className="h-full flex items-center justify-center px-6 bg-amber-600 hover:bg-amber-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newLearningOutcome}
                onChange={(e) => setNewLearningOutcome(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("learningOutcomes", newLearningOutcome);
                    setNewLearningOutcome("");
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                placeholder="Add learning outcome and press Enter..."
              />
              {/* <Button
                type="button"
                onClick={() => {
                  addArrayItem("learningOutcomes", newLearningOutcome);
                  setNewLearningOutcome("");
                }}
                className="px-6 bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4" />
              </Button> */}
            </div>
            {formData.learningOutcomes.length > 0 ? (
              <ul className="space-y-2">
                {formData.learningOutcomes.map((outcome, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                  >
                    <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {outcome}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("learningOutcomes", idx)}
                      className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                No learning outcomes added yet
              </p>
            )}
          </div>

          {/* Prerequisites */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex justify-between items-center  mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Prerequisites
              </h2>

              <Button
                type="button"
                onClick={() => {
                  addArrayItem("prerequisites", newPrerequisite);
                  setNewPrerequisite("");
                }}
                className="h-full flex items-center justify-center px-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("prerequisites", newPrerequisite);
                    setNewPrerequisite("");
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Add prerequisite and press Enter..."
              />
              {/* <Button
                type="button"
                onClick={() => {
                  addArrayItem("prerequisites", newPrerequisite);
                  setNewPrerequisite("");
                }}
                className="px-6"
              >
                <Plus className="w-4 h-4" />
              </Button> */}
            </div>
            {formData.prerequisites.length > 0 ? (
              <ul className="space-y-2">
                {formData.prerequisites.map((pre, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {pre}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("prerequisites", idx)}
                      className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                No prerequisites added yet
              </p>
            )}
          </div>

          {/* Technologies */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            {/* <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Technologies
            </h2> */}

            <div className="flex justify-between items-center  mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Technologies
              </h2>

              <Button
                type="button"
                onClick={() => {
                  addArrayItem("technologies", newTechnology);
                  setNewTechnology("");
                }}
                className="h-full flex items-center justify-center px-6 bg-purple-600 hover:bg-purple-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("technologies", newTechnology);
                    setNewTechnology("");
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Add technology and press Enter..."
              />
              {/* <Button
                type="button"
                onClick={() => {
                  addArrayItem("technologies", newTechnology);
                  setNewTechnology("");
                }}
                className="px-6 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button> */}
            </div>
            {formData.technologies.length > 0 ? (
              <ul className="space-y-2">
                {formData.technologies.map((tech, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                  >
                    <Code className="w-5 h-5 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {tech}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("technologies", idx)}
                      className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                No technologies added yet
              </p>
            )}
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
            {/* <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Resources
            </h2> */}
            <div className="flex justify-between items-center  mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Resources
              </h2>

              <Button
                type="button"
                onClick={() => {
                  addArrayItem("resources", newResource);
                  setNewResource("");
                }}
                className="h-full flex items-center justify-center px-6 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArrayItem("resources", newResource);
                    setNewResource("");
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Add resource URL and press Enter..."
              />
              {/* <Button
                type="button"
                onClick={() => {
                  addArrayItem("resources", newResource);
                  setNewResource("");
                }}
                className="px-6"
              >
                <Plus className="w-4 h-4" />
              </Button> */}
            </div>
            {formData.resources.length > 0 ? (
              <ul className="space-y-2">
                {formData.resources.map((resource, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                  >
                    <LinkIcon className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                    >
                      {resource}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("resources", idx)}
                      className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                No resources added yet
              </p>
            )}
          </div>
        </form>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-900 dark:text-white">
                  Editing:
                </span>{" "}
                {formData.title || "Untitled Project"}
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  onClick={handleSubmit}
                  className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProjectPage;
