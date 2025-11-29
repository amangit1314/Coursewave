import React, { useState } from "react";
import { useCreatedArticles } from "@/hooks/useArticles";
import { useSavedArticles } from "@/hooks/useArticles";
import { BookmarkIcon, FileText, PencilIcon, Plus } from "lucide-react";
import { BlogArticle } from "@/types/blog-api-response";
import { CreatedArticlesSkeleton, SavedArticlesSkeleton } from "../loading";
import ErrorMessage from "./ErrorMessage";
import { DataTable } from "./enrolled-courses-tables/data-table";
import { savedArticlesColumns } from "./saved-articles-table/saved-articles-columns";
import EmptyState from "./EmptyState";
import { createdArticlesColumns } from "./created-articles-table/created-articles-columns";
import { useArticlesStore } from "@/zustand/articlesStore";

const ArticlesSection = () => {
  const {
    data: createdArticles,
    isLoading: isCreatedArticlesLoading,
    error,
  } = useCreatedArticles();

  const {
    data: savedArticles,
    isLoading: isSavedArticlesLoading,
    error: savedArticlesError,
  } = useSavedArticles();

  console.log(
  "Created Articles in Articles Section:",
    JSON.stringify(createdArticles, null, 2)
  );

return (
  <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden h-full flex flex-col">
    <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm">
            <PencilIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              My Content
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Articles and learning materials
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 p-6">
      <Articles
        savedArticles={
          Array.isArray(savedArticles)
            ? savedArticles
            : savedArticles?.data || []
        }
        savedArticlesLoading={isSavedArticlesLoading}
        savedArticlesError={savedArticlesError?.message || null}
        createdArticles={
          Array.isArray(createdArticles)
            ? createdArticles
            : createdArticles?.data || []
        }
        createdArticlesLoading={isCreatedArticlesLoading}
        createdArticlesError={error?.message || null}
      />
    </div>
  </div>
);
};

export default ArticlesSection;

export interface SavedArticleRecord {
  userId: string;
  blogId: string;
  savedAt: string;
  blog: BlogArticle;
}

interface ArticlesProps {
  savedArticles: SavedArticleRecord[];
  savedArticlesLoading: boolean;
  savedArticlesError: string | null;
  createdArticles: BlogArticle[];
  createdArticlesLoading: boolean;
  createdArticlesError: string | null;
}

const Articles: React.FC<ArticlesProps> = ({
  savedArticles,
  savedArticlesLoading,
  savedArticlesError,
  createdArticles,
  createdArticlesLoading,
  createdArticlesError,
}) => {
  console.log(
  "Created Articles in Articles:",
    JSON.stringify(createdArticles, null, 2)
  );

console.log(
"Saved Articles in Articles:",
  JSON.stringify(savedArticles, null, 2)
  );

const [activeTab, setActiveTab] = useState<"saved" | "created">("saved");

const tabs = [
  {
    id: "saved",
    label: "Saved Articles",
    icon: BookmarkIcon,
    count: savedArticles?.length || 0,
  },
  {
    id: "created",
    label: "Created Articles",
    icon: PencilIcon,
    count: createdArticles?.length || 0,
  },
];

return (
  <div className="h-full flex flex-col">
    {/* Custom Tab Navigation */}
    <div className="flex space-x-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "saved" | "created")}
            className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative overflow-hidden group
                ${isActive
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50"
              }
              `}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}
            />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`
                  px-1.5 py-0.5 rounded-full text-xs font-semibold min-w-[1.25rem] text-center
                  ${isActive
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>

    {/* Tab Content */}
    <div className="flex-1 min-h-0">
      {/* Saved Articles Tab */}
      {activeTab === "saved" && (
        <div className="h-full">
          {savedArticlesLoading ? (
            <SavedArticlesSkeleton />
          ) : savedArticlesError ? (
            <ErrorMessage
              title="Error fetching saved articles"
              message={savedArticlesError}
            />
          ) : (savedArticles?.length || 0) > 0 ? (
            <div className="h-full">
              <DataTable
                columns={savedArticlesColumns}
                data={savedArticles.map((a) => a.blog)} // FIXED
                searchColumn="title"
                description="Manage your saved blogs"
                icon={<FileText className="h-6 w-6 text-green-600" />}
                searchPlaceholder="Search articles..."
                title="Saved Articles"
              />
            </div>
          ) : (
            <EmptyState
              title="No saved articles"
              description="You haven't saved any articles yet. Browse and save articles to build your reading list."
              icon={BookmarkIcon}
              action={{
                label: "Browse Articles",
                href: "/articles",
              }}
            />
          )}
        </div>
      )}

      {/* Created Articles Tab */}
      {activeTab === "created" && (
        <div className="h-full">
          {createdArticlesLoading ? (
            <CreatedArticlesSkeleton />
          ) : createdArticlesError ? (
            <ErrorMessage
              title="Error fetching created articles"
              message={createdArticlesError}
            />
          ) : (createdArticles?.length || 0) > 0 ? (
            <div className="h-full">
              <DataTable
                columns={createdArticlesColumns}
                data={createdArticles}
                searchColumn="title"
                searchPlaceholder="Search articles..."
                title="My Articles"
                description="Manage your blog posts"
                icon={<FileText className="h-6 w-6 text-green-600" />}
              />
            </div>
          ) : (
            <EmptyState
              title="No created articles"
              description="Share your knowledge and insights by creating your first article."
              icon={PencilIcon}
              action={{
                label: "Create Article",
                href: "/articles/new",
              }}
            />
          )}
        </div>
      )}
    </div>
  </div>
);
};
