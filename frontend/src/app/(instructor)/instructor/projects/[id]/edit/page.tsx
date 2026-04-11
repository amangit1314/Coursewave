"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  BookOpen,
  Award,
  Tag,
  Link as LinkIcon,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  CircleArrowLeft,
  Layers,
} from "lucide-react";
import { useProjectDetails } from "@/hooks/useProjects";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectBasicInfoForm } from "./_components/ProjectBasicInfoForm";
import { ProjectTimelineForm } from "./_components/ProjectTimelineForm";
import { ArrayFieldSection } from "./_components/ArrayFieldSection";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        setFormData((prev) => ({ ...prev, thumbnailUrl: reader.result as string }));
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

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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
          <ProjectBasicInfoForm
            formData={formData}
            thumbnailPreview={thumbnailPreview}
            onInputChange={handleInputChange}
            onThumbnailChange={handleThumbnailChange}
            onThumbnailClear={() => {
              setThumbnailPreview("");
              setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
            }}
          />

          <ProjectTimelineForm
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ArrayFieldSection
            title="Categories"
            icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            iconColor="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30"
            buttonColor="bg-blue-600 hover:bg-blue-700"
            items={formData.categories}
            inputValue={newCategory}
            onInputChange={setNewCategory}
            onAdd={() => { addArrayItem("categories", newCategory); setNewCategory(""); }}
            onRemove={(idx) => removeArrayItem("categories", idx)}
            placeholder="Add category and press Enter..."
            emptyMessage="No categories added yet"
            listStyle="badge"
          />

          <ArrayFieldSection
            title="Tags"
            icon={<Tag className="w-6 h-6 text-green-600 dark:text-green-400" />}
            iconColor="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30"
            buttonColor="bg-green-600 hover:bg-green-700"
            items={formData.tags}
            inputValue={newTag}
            onInputChange={setNewTag}
            onAdd={() => { addArrayItem("tags", newTag); setNewTag(""); }}
            onRemove={(idx) => removeArrayItem("tags", idx)}
            placeholder="Add tag and press Enter..."
            emptyMessage="No tags added yet"
            listStyle="badge"
            focusColor="green"
          />

          <ArrayFieldSection
            title="Learning Outcomes"
            icon={<Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
            iconColor=""
            buttonColor="bg-amber-600 hover:bg-amber-700"
            items={formData.learningOutcomes}
            inputValue={newLearningOutcome}
            onInputChange={setNewLearningOutcome}
            onAdd={() => { addArrayItem("learningOutcomes", newLearningOutcome); setNewLearningOutcome(""); }}
            onRemove={(idx) => removeArrayItem("learningOutcomes", idx)}
            placeholder="Add learning outcome and press Enter..."
            emptyMessage="No learning outcomes added yet"
            listStyle="list-check"
            focusColor="amber"
          />

          <ArrayFieldSection
            title="Prerequisites"
            icon={<Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
            iconColor=""
            buttonColor="bg-indigo-600 hover:bg-indigo-700"
            items={formData.prerequisites}
            inputValue={newPrerequisite}
            onInputChange={setNewPrerequisite}
            onAdd={() => { addArrayItem("prerequisites", newPrerequisite); setNewPrerequisite(""); }}
            onRemove={(idx) => removeArrayItem("prerequisites", idx)}
            placeholder="Add prerequisite and press Enter..."
            emptyMessage="No prerequisites added yet"
            listStyle="list-bullet"
          />

          <ArrayFieldSection
            title="Technologies"
            icon={<Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            iconColor=""
            buttonColor="bg-purple-600 hover:bg-purple-700"
            items={formData.technologies}
            inputValue={newTechnology}
            onInputChange={setNewTechnology}
            onAdd={() => { addArrayItem("technologies", newTechnology); setNewTechnology(""); }}
            onRemove={(idx) => removeArrayItem("technologies", idx)}
            placeholder="Add technology and press Enter..."
            emptyMessage="No technologies added yet"
            listStyle="list-icon"
            itemIcon={<Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            focusColor="purple"
          />

          <ArrayFieldSection
            title="Resources"
            icon={<LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            iconColor=""
            buttonColor="bg-blue-600 hover:bg-blue-700"
            items={formData.resources}
            inputValue={newResource}
            onInputChange={setNewResource}
            onAdd={() => { addArrayItem("resources", newResource); setNewResource(""); }}
            onRemove={(idx) => removeArrayItem("resources", idx)}
            placeholder="Add resource URL and press Enter..."
            emptyMessage="No resources added yet"
            listStyle="list-link"
            inputType="url"
          />
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
