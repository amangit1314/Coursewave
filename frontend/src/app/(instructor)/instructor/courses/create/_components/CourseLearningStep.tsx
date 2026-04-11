"use client";

import React from "react";
import { Target, CheckCircle, Code } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import TagInput from "./TagInput";

interface CourseLearningStepProps {
  form: UseFormReturn<any>;
  errors: any;
  watchedFields: any;
}

export const CourseLearningStep = ({
  form,
  errors,
  watchedFields,
}: CourseLearningStepProps) => {
  return (
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
  );
};
