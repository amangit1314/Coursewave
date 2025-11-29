import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, BookOpen, X } from 'lucide-react';

// Mock project data
const mockProject = {
  id: '123',
  courseId: '456',
  title: 'E-Commerce Platform'
};

const ModernDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(true);
    setIsOpen(false);
  };

  const confirmDelete = () => {
    console.log('Deleting project:', mockProject.id);
    setShowDeleteConfirm(false);
    // Add your delete logic here
  };

  const handleViewProject = () => {
    console.log('Viewing project:', mockProject.id);
    setIsOpen(false);
  };

  const handleEditProject = () => {
    console.log('Editing project:', mockProject.id);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle Info */}
      <div className="fixed top-4 right-4 px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow">
        Toggle theme in browser settings
      </div>

      <div className="relative text-gray-900 dark:text-white">
        {/* Dropdown Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 ${isOpen
              ? 'bg-gray-100 dark:bg-gray-700 shadow-lg scale-95'
              : ''
            }`}
        >
          <MoreHorizontal
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'group-hover:scale-110'
              }`}
          />
          <span className="sr-only">Open menu</span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl z-50 overflow-hidden border backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 bg-white/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Project Actions
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* View Project */}
                <button
                  onClick={handleViewProject}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 group text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                >
                  <div className="p-1.5 rounded-lg transition-colors bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      View Project
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      See full details
                    </p>
                  </div>
                </button>

                {/* View Course - Commented out but styled */}
                {/* <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 group text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                >
                  <div className="p-1.5 rounded-lg transition-colors bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      View Course
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Go to course page
                    </p>
                  </div>
                </button> */}

                {/* Edit Project */}
                <button
                  onClick={handleEditProject}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 group text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-500/10"
                >
                  <div className="p-1.5 rounded-lg transition-colors bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-500/30">
                    <Edit className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      Edit Project
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Modify details
                    </p>
                  </div>
                </button>

                {/* Separator */}
                <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                {/* Delete Project */}
                <button
                  onClick={() => handleDelete(mockProject.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 group text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <div className="p-1.5 rounded-lg transition-colors bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-500/30">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm text-red-600 dark:text-red-400">
                      Delete Project
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Remove permanently
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <>
            {/* Modal Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
              onClick={() => setShowDeleteConfirm(false)}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 bg-white dark:bg-gray-800 dark:border dark:border-gray-700">
                {/* Close Button */}
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 dark:bg-red-500/20">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Delete Project?
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete <strong>"{mockProject.title}"</strong>? This action cannot be undone and all associated data will be permanently removed.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Demo Info */}
      <div className="fixed bottom-4 left-4 p-4 rounded-xl shadow-lg max-w-xs bg-white dark:bg-gray-800 dark:border dark:border-gray-700">
        <p className="text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Interactive Demo
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click the menu button to see the enhanced dropdown with smooth animations, better descriptions, and a confirmation modal. Toggle your system theme to see dark mode.
        </p>
      </div>
    </div>
  );
};

export default ModernDropdownMenu;