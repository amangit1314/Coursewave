"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { X, Sparkles, Award, Linkedin, User } from "lucide-react";

interface Props {
  onSubmit: (data: {
    bio: string;
    expertise: string[];
    socialLinks?: { linkedin?: string };
  }) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

interface FormData {
  bio: string;
  expertiseInput: string;
  expertiseList: string[];
  socialLink?: string;
}

export const InstructorRegistrationForm: React.FC<Props> = ({
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bio: "",
      expertiseInput: "",
      expertiseList: [],
      socialLink: "",
    },
  });

  const expertiseList = watch("expertiseList");

  const handleAddExpertise = () => {
    const input = getValues("expertiseInput").trim();
    if (input && !expertiseList.includes(input)) {
      setValue("expertiseList", [...expertiseList, input]);
      setValue("expertiseInput", "");
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setValue(
      "expertiseList",
      expertiseList.filter((exp) => exp !== item)
    );
  };

  const onFormSubmit = (data: FormData) => {
    if (data.expertiseList.length === 0) {
      toast.error("Please add at least one expertise area.");
      return;
    }

    onSubmit({
      bio: data.bio,
      expertise: data.expertiseList,
      socialLinks: data.socialLink ? { linkedin: data.socialLink } : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Become an Instructor
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Share your knowledge with the world
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Bio Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <User className="w-4 h-4" />
              About You
            </label>
            <textarea
              {...register("bio", { required: "Please tell us about yourself." })}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-zinc-800 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition-all duration-200 resize-none
                ${errors.bio ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
              rows={4}
              placeholder="Tell us about your background, experience, and what you're passionate about teaching..."
              disabled={isSubmitting}
            />
            {errors.bio && (
              <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Expertise Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Sparkles className="w-4 h-4" />
              Your Expertise
            </label>
            <div className="flex gap-2">
              <input
                {...register("expertiseInput")}
                type="text"
                placeholder="e.g., Web Development, Machine Learning"
                className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl 
                  bg-white dark:bg-zinc-800 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddExpertise();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddExpertise}
                disabled={isSubmitting}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                Add
              </Button>
            </div>

            {/* Expertise Tags */}
            {expertiseList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                {expertiseList.map((item, idx) => (
                  <span
                    key={idx}
                    onClick={() => !isSubmitting && handleRemoveExpertise(item)}
                    className="group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium cursor-pointer
                      hover:shadow-lg hover:scale-105 transform transition-all duration-200
                      animate-in zoom-in-95
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      {item}
                      <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
                    </span>
                  </span>
                ))}
              </div>
            )}

            {expertiseList.length === 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Add at least one area of expertise
              </p>
            )}
          </div>

          {/* LinkedIn Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Linkedin className="w-4 h-4" />
              LinkedIn Profile
              <span className="text-xs font-normal text-zinc-500">(optional)</span>
            </label>
            <input
              {...register("socialLink")}
              type="url"
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl 
                bg-white dark:bg-zinc-800 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="https://linkedin.com/in/yourprofile"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                text-white rounded-xl shadow-lg shadow-blue-500/30 
                transition-all duration-200 font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Teaching
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
