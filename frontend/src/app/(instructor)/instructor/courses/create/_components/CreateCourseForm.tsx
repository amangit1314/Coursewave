"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  BookOpen,
  Upload,
  DollarSign,
  User,
  Tag,
  Target,
  CheckCircle,
  Code,
  ImageIcon,
  X,
  Plus,
  Sparkles,
  Save,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useCreateCourse } from "@/hooks/useCourses";
import { CreateCourseRequest } from "@/types/courses.service.types";
import { supabase } from "@/lib/config/supabase";
import { generateCourseDescription } from "@/lib/ai/course-description-generator";
import toast from "react-hot-toast";
import { dmSans } from "@/lib/config/fonts";
import TagInput from "./TagInput";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  image: z.string().min(1, "Course image is required"),
  courseDescription: z
    .string()
    .min(150, "Description must be at least 150 characters")
    .max(1000, "Description must be less than 1000 characters"),
  coursePrice: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 1 && num <= 500;
  }, "Price must be between $1 and $500"),
  courseCategories: z.string().min(1, "At least one category is required"),
  instructorName: z
    .string()
    .min(2, "Instructor name is required")
    .max(50, "Name must be less than 50 characters"),
  technologiesYouWillLearn: z
    .string()
    .min(1, "At least one technology is required"),
  thisCourseIsFor: z.string().min(1, "Target audience is required"),
  prerequisits: z.string().min(1, "Prerequisites are required"),
  whatYouWillLearn: z.string().min(1, "Learning outcomes are required"),
});

const CreateCourseForm = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      instructorName: "",
      coursePrice: "",
      courseDescription: "",
      courseCategories: "",
      whatYouWillLearn: "",
      thisCourseIsFor: "",
      technologiesYouWillLearn: "",
      prerequisits: "",
    },
    mode: "onChange",
  });

  const { mutate: createCourse, isPending } = useCreateCourse();

  const {
    watch,
    formState: { errors, isValid },
  } = form;
  const watchedFields = watch();
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const handleAIDescription = async () => {
    const title = form.getValues("title");
    if (!title || title.length < 3) {
      form.setError("title", { message: "Enter a course title first" });
      return;
    }
    try {
      setIsAIGenerating(true);
      const category = form.getValues("courseCategories");
      const result = await generateCourseDescription(title, category);
      form.setValue("courseDescription", result.description, { shouldValidate: true });
      if (result.learningOutcomes?.length) {
        form.setValue("whatYouWillLearn", result.learningOutcomes.join("\n"), { shouldValidate: true });
      }
      if (result.prerequisites?.length) {
        form.setValue("prerequisits", result.prerequisites.join("\n"), { shouldValidate: true });
      }
      if (result.targetAudience) {
        form.setValue("thisCourseIsFor", result.targetAudience, { shouldValidate: true });
      }
    } catch {
      // Silently fail — user can still type manually
    } finally {
      setIsAIGenerating(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      fields: ["title", "instructorName", "courseDescription"],
    },
    {
      id: 2,
      title: "Course Details",
      fields: ["courseCategories", "coursePrice", "image"],
    },
    {
      id: 3,
      title: "Learning Outcomes",
      fields: [
        "whatYouWillLearn",
        "technologiesYouWillLearn",
        "thisCourseIsFor",
        "prerequisits",
      ],
    },
  ];

  const getCurrentStepFields = () =>
    steps.find((step) => step.id === currentStep)?.fields || [];
  const isCurrentStepValid = () => {
    const currentFields = getCurrentStepFields();
    return currentFields.every(
      (field) =>
        !(errors as any)[field] &&
        watchedFields[field as keyof typeof watchedFields]
    );
  };

  const handleDrag = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    type: string;
  }) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Please upload a valid image file (JPEG, PNG, WebP, GIF)"
        );
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `course-images/${fileName}`;

      // Upload to Supabase "courses" bucket
      const { data, error } = await supabase.storage
        .from("courses") // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("courses").getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Image upload error:", error);
      throw new Error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Show temporary preview while uploading
      const tempUrl = URL.createObjectURL(file);
      setImageUrl(tempUrl);

      // Upload to Supabase
      const publicUrl = await uploadImageToSupabase(file);

      // Set the actual Supabase URL in the form
      setImageUrl(publicUrl);
      form.setValue("image", publicUrl, { shouldValidate: true });

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      // Reset on error
      setImageUrl("");
      form.setValue("image", "", { shouldValidate: true });
      toast.error(error.message || "Failed to upload image");

      // Clean up temporary URL
      if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  };

  const onSubmit = async (values: {
    courseCategories: string;
    whatYouWillLearn: string;
    technologiesYouWillLearn: string;
    thisCourseIsFor: string;
    prerequisits: string;
  }) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const processedData = {
        ...values,
        courseCategories: values.courseCategories
          .split(",")
          .map((item) => item.trim()),
        whatYouWillLearn: values.whatYouWillLearn
          .split(",")
          .map((item) => item.trim()),
        technologiesYouWillLearn: values.technologiesYouWillLearn
          .split(",")
          .map((item) => item.trim()),
        thisCourseIsFor: values.thisCourseIsFor
          .split(",")
          .map((item) => item.trim()),
        prerequisits: values.prerequisits.split(",").map((item) => item.trim()),
      };

      createCourse(processedData as unknown as CreateCourseRequest);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-blue-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Course Created Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your course has been created and is ready for students.
          </p>
          <button
            onClick={() => {
              setSubmitSuccess(false);
              form.reset();
              setImageUrl("");
              setCurrentStep(1);
            }}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Create Another Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:max-w-7xl w-full bg-gradient-to-br from-white-50 mt-12 to-gray-100 dark:from-zinc-950 dark:to-blue-600/30 p-6 rounded-2xl">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`${dmSans.className} text-4xl font-bold text-gray-800  dark:text-white mb-2`}
          >
            Create Your Course
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Share your knowledge with the world
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${currentStep >= step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle size={20} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`${dmSans.className} ml-2 text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 ${currentStep > step.id ? "bg-blue-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2
                  className={`${dmSans.className} text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center `}
                >
                  <BookOpen className="mr-3 text-blue-500" />
                  Basic Information
                </h2>

                {/* Course Title */}
                <div className="space-y-2">
                  <label
                    className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200`}
                  >
                    Course Title *
                  </label>
                  <input
                    {...form.register("title")}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Instructor Name */}
                <div className="space-y-2">
                  <label
                    className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200 flex items-center`}
                  >
                    <User className="mr-2" size={16} />
                    Instructor Name *
                  </label>
                  <input
                    {...form.register("instructorName")}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.instructorName && (
                    <p className="text-red-500 text-sm">
                      {errors.instructorName.message}
                    </p>
                  )}
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200`}
                    >
                      Course Description *
                    </label>
                    <button
                      type="button"
                      onClick={handleAIDescription}
                      disabled={isAIGenerating}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                    >
                      {isAIGenerating ? (
                        <span className="h-3 w-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {isAIGenerating ? "Generating..." : "AI Generate"}
                    </button>
                  </div>
                  <textarea
                    {...form.register("courseDescription")}
                    rows={6}
                    placeholder="Describe what students will learn in this course. Include key benefits and outcomes. Minimum 150 characters."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  <div className="flex justify-between items-center">
                    {errors.courseDescription && (
                      <p className="text-red-500 text-sm">
                        {errors.courseDescription.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {watchedFields.courseDescription?.length || 0}/1000
                      characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Course Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2
                  className={`${dmSans.className} text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center`}
                >
                  <Tag className="mr-3 text-blue-500" />
                  Course Details
                </h2>

                {/* Categories */}
                <div className="space-y-2">
                  <label
                    className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200`}
                  >
                    Course Categories *
                  </label>
                  <TagInput
                    value={watchedFields.courseCategories}
                    onChange={(value: string) =>
                      form.setValue("courseCategories", value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Add categories (e.g., Web Development, React)"
                    icon={Tag}
                  />
                  {errors.courseCategories && (
                    <p className="text-red-500 text-sm">
                      {errors.courseCategories.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label
                    className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200 flex items-center`}
                  >
                    <DollarSign className="mr-2" size={16} />
                    Course Price (USD) *
                  </label>
                  <div className="relative flex items-center">
                    <DollarSign
                      className="absolute left-3 text-gray-400"
                      size={18}
                    />
                    <input
                      {...form.register("coursePrice")}
                      type="number"
                      min="1"
                      max="500"
                      placeholder="49"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {errors.coursePrice && (
                    <p className="text-red-500 text-sm">
                      {errors.coursePrice.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Recommended: $1-$500 for optimal enrollment
                  </p>
                </div>

                {/* Course Image */}
                <div className="space-y-2">
                  <label
                    className={`${dmSans.className} block text-sm font-semibold text-gray-700 dark:text-zinc-200 flex items-center`}
                  >
                    <ImageIcon className="mr-2" size={16} />
                    Course Image *
                  </label>
                  <div
                    className={`relative border border-dashed rounded-xl p-2 transition-all duration-200 ${dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        await handleFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    {isUploading ? (
                      <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p
                          className={`${dmSans.className} text-lg font-semibold text-gray-700 dark:text-zinc-200 mb-2`}
                        >
                          Uploading image...
                        </p>
                        <p className="text-sm text-gray-500">Please wait</p>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Course preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("");
                            form.setValue("image", "", {
                              shouldValidate: true,
                            });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p
                          className={`${dmSans.className} text-lg font-semibold text-gray-700 dark:text-zinc-200 mb-2`}
                        >
                          Drop your image here, or{" "}
                          <button
                            type="button"
                            onClick={() =>
                              (
                                fileInputRef.current as HTMLInputElement | null
                              )?.click()
                            }
                            className="text-blue-500 hover:text-blue-600 underline transition-colors"
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-sm text-gray-500">
                          Recommended: 16:9 aspect ratio, max 5MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await handleFileUpload(file);
                      }}
                      className="hidden"
                    />
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Learning Outcomes */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center">
                  <Target className="mr-3 text-blue-500" />
                  Learning Outcomes
                </h2>

                {/* What You'll Learn */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                    What You'll Learn *
                  </label>
                  <TagInput
                    value={watchedFields.whatYouWillLearn}
                    onChange={(value: string) =>
                      form.setValue("whatYouWillLearn", value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Add learning outcomes (e.g., Build responsive websites)"
                    icon={CheckCircle}
                  />
                  {errors.whatYouWillLearn && (
                    <p className="text-red-500 text-sm">
                      {errors.whatYouWillLearn.message}
                    </p>
                  )}
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                    Technologies You'll Learn *
                  </label>
                  <TagInput
                    value={watchedFields.technologiesYouWillLearn}
                    onChange={(value: string) =>
                      form.setValue("technologiesYouWillLearn", value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Add technologies (e.g., React, Node.js, MongoDB)"
                    icon={Code}
                  />
                  {errors.technologiesYouWillLearn && (
                    <p className="text-red-500 text-sm">
                      {errors.technologiesYouWillLearn.message}
                    </p>
                  )}
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                    This Course is For *
                  </label>
                  <TagInput
                    value={watchedFields.thisCourseIsFor}
                    onChange={(value: string) =>
                      form.setValue("thisCourseIsFor", value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Define target audience (e.g., Beginners in web development)"
                    icon={Target}
                  />
                  {errors.thisCourseIsFor && (
                    <p className="text-red-500 text-sm">
                      {errors.thisCourseIsFor.message}
                    </p>
                  )}
                </div>

                {/* Prerequisites */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                    Prerequisites *
                  </label>
                  <TagInput
                    value={watchedFields.prerequisits}
                    onChange={(value: string) =>
                      form.setValue("prerequisits", value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Add prerequisites (e.g., Basic HTML knowledge, Computer with internet)"
                    icon={CheckCircle}
                  />
                  {errors.prerequisits && (
                    <p className="text-red-500 text-sm">
                      {errors.prerequisits.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                // className="px-6 py-3 text-gray-600 dark:text-zinc-300 border border-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-blue-500 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-10 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  // className="flex items-center px-6 py-3 text-gray-600 dark:text-zinc-300 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="mr-2" size={18} />
                  Preview
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!isCurrentStepValid()}
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={!isValid || isSubmitting}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={18} />
                        Create Course
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseForm;
