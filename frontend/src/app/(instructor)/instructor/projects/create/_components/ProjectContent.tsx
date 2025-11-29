"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Highlighter,
    Calendar,
    Folder,
    FileText,
    CheckCircle
} from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TitleForm } from "./TitleForm";
import { DescriptionForm } from "./DescriptionForm";
import { ImageForm } from "./ImageForm";
import { CourseForm } from "./CourseForm";
import { DifficultyForm } from "./DifficultyForm";
import { ArrayForm } from "./ArrayForm";
import { IconBadge } from "./IconBadge";
import { dmSans } from "@/lib/config/fonts";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/useProjects";
import { CreateProjectRequest } from "@/types/projects.service.types";
import toast from "react-hot-toast";

export default function ProjectContent() {
    const router = useRouter();
    const { mutate: createProject, isPending } = useCreateProject();

    const [projectData, setProjectData] = useState<Partial<CreateProjectRequest>>({
        title: "",
        description: "",
        courseId: "",
        thumbnailUrl: "",
        difficulty: undefined,
        categories: [],
        tags: [],
        technologies: [],
        prerequisites: [],
        learningOutcomes: [],
        resources: [],
    });

    const updateField = <K extends keyof CreateProjectRequest>(
        field: K,
        value: CreateProjectRequest[K]
    ) => {
        setProjectData(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return (
            projectData.title &&
            projectData.title.length >= 5 &&
            projectData.description &&
            projectData.description.length >= 150 &&
            projectData.courseId &&
            projectData.thumbnailUrl
        );
    };

    const handleCreateProject = () => {
        if (!isFormValid()) {
            toast.error("Please fill in all required fields (title, description, course, and image)");
            return;
        }

        const payload: CreateProjectRequest = {
            title: projectData.title!,
            description: projectData.description,
            courseId: projectData.courseId!,
            thumbnailUrl: projectData.thumbnailUrl,
            difficulty: projectData.difficulty,
            categories: projectData.categories,
            tags: projectData.tags,
            technologies: projectData.technologies,
            prerequisites: projectData.prerequisites,
            learningOutcomes: projectData.learningOutcomes,
            resources: projectData.resources,
            status: "DRAFT",
            isPublic: false,
        };

        createProject(payload, {
            onSuccess: () => {
                toast.success("Project created successfully!");
                router.push("/instructor/projects");
            },
            onError: (error: any) => {
                toast.error(error?.message || "Failed to create project");
            },
        });
    };

    return (
        <div className="space-y-8 px-8 py-8 dark:bg-zinc-900">
            <div
                onClick={() => router.back()}
                className={`${dmSans.className} flex cursor-pointer items-center justify-start space-x-2 text-sm hover:underline`}
            >
                <IoMdArrowRoundBack className="text-black dark:text-white" size={16} />
                <p>Back to projects</p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p
                        className={`${dmSans.className} text-lg font-semibold text-zinc-900 dark:text-white`}
                    >
                        Create New Project
                    </p>
                    <p className="text-sm">
                        Add project details and requirements for your students
                    </p>
                </div>
                <Button
                    onClick={handleCreateProject}
                    disabled={!isFormValid() || isPending}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    {isPending ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Create Project
                        </>
                    )}
                </Button>
            </div>

            {/* forms grid */}
            <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6 bg-gray-50 dark:bg-zinc-800 md:grid-cols-2">
                {/* first col for forms */}
                <div>
                    <div className={`${dmSans.className} flex items-center gap-x-2`}>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                            Basic Information
                        </h2>
                    </div>

                    {/* title form */}
                    <TitleForm
                        initialData={{ title: projectData.title }}
                        onUpdate={(title) => updateField("title", title)}
                    />

                    {/* course form */}
                    <CourseForm
                        initialData={{ courseId: projectData.courseId }}
                        onUpdate={(courseId) => updateField("courseId", courseId)}
                    />

                    {/* description form */}
                    <DescriptionForm
                        initialData={{ description: projectData.description }}
                        onUpdate={(description) => updateField("description", description)}
                    />

                    {/* image form */}
                    <ImageForm
                        initialData={{ thumbnailUrl: projectData.thumbnailUrl }}
                        onUpdate={(thumbnailUrl) => updateField("thumbnailUrl", thumbnailUrl)}
                    />
                </div>

                {/* second col for forms */}
                <div className="space-y-6">
                    <div className={`${dmSans.className} flex items-center gap-x-2`}>
                        <IconBadge icon={Folder} />
                        <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                            Project Details
                        </h2>
                    </div>

                    {/* difficulty form */}
                    <DifficultyForm
                        initialData={{ difficulty: projectData.difficulty }}
                        onUpdate={(difficulty) => updateField("difficulty", difficulty)}
                    />

                    {/* categories */}
                    <ArrayForm
                        label="Categories"
                        initialData={projectData.categories}
                        onUpdate={(categories) => updateField("categories", categories)}
                        placeholder="e.g., Web Development, Full Stack"
                    />

                    {/* tags */}
                    <ArrayForm
                        label="Tags"
                        initialData={projectData.tags}
                        onUpdate={(tags) => updateField("tags", tags)}
                        placeholder="e.g., React, Node.js, MongoDB"
                    />

                    {/* technologies */}
                    <ArrayForm
                        label="Technologies"
                        initialData={projectData.technologies}
                        onUpdate={(technologies) => updateField("technologies", technologies)}
                        placeholder="e.g., TypeScript, Next.js, Prisma"
                    />
                </div>
            </div>

            {/* Requirements section */}
            <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6 bg-gray-50 dark:bg-zinc-800">
                <div>
                    <div className={`${dmSans.className} flex items-center gap-x-2`}>
                        <IconBadge icon={Highlighter} />
                        <h2 className="text-md font-medium text-zinc-800 dark:text-white">
                            Requirements & Learning Outcomes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* prerequisites */}
                        <ArrayForm
                            label="Prerequisites"
                            initialData={projectData.prerequisites}
                            onUpdate={(prerequisites) => updateField("prerequisites", prerequisites)}
                            placeholder="e.g., Basic HTML/CSS knowledge"
                        />

                        {/* learning outcomes */}
                        <ArrayForm
                            label="Learning Outcomes"
                            initialData={projectData.learningOutcomes}
                            onUpdate={(learningOutcomes) => updateField("learningOutcomes", learningOutcomes)}
                            placeholder="e.g., Build RESTful APIs"
                        />

                        {/* resources */}
                        <div className="md:col-span-2">
                            <ArrayForm
                                label="Resources"
                                initialData={projectData.resources}
                                onUpdate={(resources) => updateField("resources", resources)}
                                placeholder="e.g., API documentation links, tutorial videos"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
