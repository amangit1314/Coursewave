import React from "react";

import { useCreatedArticles } from "@/hooks/useArticles";
import { useSavedArticles } from "@/hooks/useArticles";
import {
  Callout,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { BookmarkIcon, PencilIcon } from "lucide-react";
import { BlogArticle } from "@/types/blog-api-response";
import { CreatedArticlesSkeleton, SavedArticlesSkeleton } from "../loading";
import ErrorMessage from "./ErrorMessage";
import { DataTable } from "./enrolled-courses-tables/data-table";
import { savedArticlesColumns } from "./saved-articles-table/saved-articles-columns";
import EmptyState from "./EmptyState";
import { createdArticlesColumns } from "./created-articles-table/created-articles-columns";

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

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <PencilIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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

        <Articles
          savedArticles={savedArticles?.data|| []}
          savedArticlesLoading={isSavedArticlesLoading}
          savedArticlesError={savedArticlesError?.message || null}
          createdArticles={createdArticles?.data || []}
          createdArticlesLoading={isCreatedArticlesLoading}
          createdArticlesError={error?.message || null}
        />
      </div>
    </div>
  );
};

export default ArticlesSection;

interface ArticlesProps {
  savedArticles: BlogArticle[];
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
  const [isSelected, setIsSelected] = React.useState(1);

  return (
    <div className="w-full">
      <TabGroup>
        <TabList
          defaultValue="1"
          color="blue"
          className="mb-6 bg-zinc-50 dark:bg-zinc-700 p-1 rounded-xl flex border border-zinc-200 dark:border-zinc-600"
        >
          <Tab
            value="1"
            className="flex-1 cursor-pointer text-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 data-[state=selected]:bg-blue-500 data-[state=selected]:text-white data-[state=selected]:shadow-sm data-[state=inactive]:hover:bg-blue-500 data-[state=inactive]:hover:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:dark:text-zinc-400"
          >
            <div className="flex items-center justify-center space-x-2">
              <BookmarkIcon className="h-4 w-4" />
              <span>Saved Articles</span>
            </div>
          </Tab>
          <Tab
            value="2"
            className="flex-1 cursor-pointer text-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 data-[state=selected]:bg-blue-500 data-[state=selected]:text-white data-[state=selected]:shadow-sm data-[state=inactive]:hover:bg-blue-500 data-[state=inactive]:hover:text-white data-[state=inactive]:text-zinc-600 data-[state=inactive]:dark:text-zinc-400"
          >
            <div className="flex items-center justify-center space-x-2">
              <PencilIcon className="h-4 w-4" />
              <span>Created Articles</span>
            </div>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {savedArticlesLoading ? (
              <SavedArticlesSkeleton />
            ) : savedArticlesError ? (
              <ErrorMessage
                title="Error fetching saved articles"
                message={savedArticlesError}
              />
            ) : (
              <div>
                {(savedArticles?.length || 0) > 0 ? (
                  <DataTable
                    columns={savedArticlesColumns}
                    data={savedArticles || []}
                  />
                ) : (
                  <EmptyState
                    title="No saved articles"
                    description="You haven't saved any articles yet. Browse and save one to get started."
                    icon={BookmarkIcon}
                    action={{
                      label: "Browse Articles",
                      href: "/articles",
                    }}
                  />
                )}
              </div>
            )}
          </TabPanel>

          <TabPanel>
            {createdArticlesLoading ? (
              <CreatedArticlesSkeleton />
            ) : createdArticlesError ? (
              <ErrorMessage
                title="Error fetching created articles"
                message={createdArticlesError}
              />
            ) : (
              <div>
                {(createdArticles?.length || 0) > 0 ? (
                  <DataTable
                    columns={createdArticlesColumns}
                    data={createdArticles || []}
                  />
                ) : (
                  <EmptyState
                    title="No created articles"
                    description="Share your knowledge by creating your first article."
                    icon={PencilIcon}
                    action={{
                      label: "Create Article",
                      href: "/articles/new",
                    }}
                  />
                )}
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
