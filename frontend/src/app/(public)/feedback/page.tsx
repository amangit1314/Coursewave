// app/feedback/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  CheckCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Lightbulb,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubmitFeedback } from "@/hooks/useFeedback";

export default function FeedbackPage() {
   const router = useRouter();
  const feedbackMutation = useSubmitFeedback();
  const [formData, setFormData] = useState({
    type: "general",
    rating: 0,
    title: "",
    message: "",
    email: "",
    allowContact: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isSubmitting = feedbackMutation.isPending;

  const feedbackTypes = [
    {
      id: "general",
      label: "General Feedback",
      icon: MessageSquare,
      description: "Share your overall experience"
    },
    {
      id: "bug",
      label: "Bug Report",
      icon: Bug,
      description: "Report technical issues or bugs"
    },
    {
      id: "suggestion",
      label: "Improvement Suggestion",
      icon: Lightbulb,
      description: "Suggest improvements to existing features"
    },
    {
      id: "praise",
      label: "Praise & Compliments",
      icon: Heart,
      description: "Share what you love about our platform"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    feedbackMutation.mutate(
      {
        name: formData.title,
        email: formData.email,
        type: formData.type === "suggestion" ? "improvement" : formData.type === "praise" ? "general" : formData.type,
        rating: formData.rating,
        message: formData.message,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }
    );
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your feedback has been received. We appreciate you helping us improve CourseWave.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Submit More Feedback
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Help us improve CourseWave by sharing your thoughts, suggestions, and experiences.
          </p>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What type of feedback do you have?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange("type", type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${formData.type === type.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${formData.type === type.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400"
                        }`} />
                      <div className="font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {type.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How would you rate your overall experience?
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleInputChange("rating", star)}
                    className="p-2 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brief Summary
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Briefly describe your feedback..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Feedback
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Please provide detailed feedback. What worked well? What could be improved? Any specific issues or suggestions?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Contact Permission */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowContact"
                checked={formData.allowContact}
                onChange={(e) => handleInputChange("allowContact", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowContact" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Allow us to contact you for follow-up questions about your feedback
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.message}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            Your feedback helps us create a better learning experience for everyone.
            We read every submission and use it to guide our development.
          </p>
        </motion.div>
      </div>
    </div>
  );
}