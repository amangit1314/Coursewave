// app/feature-request/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Send, 
  CheckCircle, 
  TrendingUp,
  Users,
  Zap,
  Star,
  Vote
} from "lucide-react";

export default function FeatureRequestPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "platform",
    priority: "medium",
    benefit: "",
    email: "",
    allowContact: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    {
      id: "platform",
      label: "Platform Improvement",
      icon: TrendingUp,
      description: "General platform features and enhancements"
    },
    {
      id: "learning",
      label: "Learning Experience",
      icon: Users,
      description: "Course features, progress tracking, assessments"
    },
    {
      id: "mobile",
      label: "Mobile App",
      icon: Zap,
      description: "Mobile-specific features and improvements"
    },
    {
      id: "community",
      label: "Community Features",
      icon: Users,
      description: "Student interactions, discussions, groups"
    }
  ];

  const priorities = [
    { id: "low", label: "Nice to Have", color: "text-gray-500" },
    { id: "medium", label: "Important", color: "text-blue-500" },
    { id: "high", label: "Critical", color: "text-orange-500" },
    { id: "urgent", label: "Game Changer", color: "text-red-500" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Feature request submitted:", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting feature request:", error);
    } finally {
      setIsSubmitting(false);
    }
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
              Feature Request Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your suggestion! Our team will review it and consider it for future updates.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Suggest Another Feature
              </button>
              <button
                onClick={() => window.location.href = '/'}
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
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Suggest a Feature
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Have an idea to make CourseWave better? We'd love to hear it!
          </p>
        </motion.div>

        {/* Feature Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feature Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feature Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Brief, descriptive title for your feature..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleInputChange("category", category.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.category === category.id
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${
                        formData.category === category.id 
                          ? "text-purple-600 dark:text-purple-400" 
                          : "text-gray-400"
                      }`} />
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {category.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How important is this feature to you? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => handleInputChange("priority", priority.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.priority === priority.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 font-medium"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className={`text-sm ${formData.priority === priority.id ? priority.color : "text-gray-500"}`}>
                      {priority.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Please describe your feature in detail. How would it work? What problem does it solve? How would students benefit?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
              />
            </div>

            {/* Benefit */}
            <div>
              <label htmlFor="benefit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Benefit
              </label>
              <textarea
                id="benefit"
                rows={3}
                value={formData.benefit}
                onChange={(e) => handleInputChange("benefit", e.target.value)}
                placeholder="How would this feature improve the learning experience for students?"
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
                Allow us to contact you for more details about your feature request
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Feature Request</span>
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
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <Vote className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                How Feature Requests Are Evaluated
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Impact on student learning experience</li>
                <li>• Number of students who would benefit</li>
                <li>• Alignment with our platform vision</li>
                <li>• Technical feasibility and development effort</li>
                <li>• Community interest and voting</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}