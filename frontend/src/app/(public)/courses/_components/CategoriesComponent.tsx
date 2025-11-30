import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@/types/category";
import { poppins } from "@/lib/config/fonts";

interface CategoriesComponentProps {
  activeCategory: number;
  setActiveCategory: (index: number) => void;
  categories: Category[];
  loading: boolean;
}

// Shimmer effect component
const CategorySkeleton = () => {
  return (
    <div className="shrink-0">
      <div className="relative h-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
        {/* Placeholder text */}
        <div className="px-4 h-full flex items-center">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

// Loading skeleton with varied widths for natural look
const CategoriesLoadingSkeleton = () => {
  const skeletonWidths = [80, 100, 90, 110, 85, 95, 105, 90];
  
  return (
    <div className="flex w-max justify-center space-x-2 py-2 px-4 md:my-4">
      {skeletonWidths.map((width, index) => (
        <div key={index} className="shrink-0">
          <div 
            className="relative h-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
            style={{ width: `${width}px` }}
          >
            {/* Shimmer overlay */}
            <div 
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"
              style={{
                animation: `shimmer 2s infinite`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CategoriesComponent({
  activeCategory,
  setActiveCategory,
  categories,
  loading,
}: CategoriesComponentProps) {
  return (
    <>
      {/* Add shimmer animation to global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      
      <div
        className={`${poppins.className} sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md `}
      >
        <ScrollArea className="max-w-8xl w-full whitespace-nowrap">
          {loading ? (
            <CategoriesLoadingSkeleton />
          ) : (
            <div className="flex w-max justify-center space-x-2 overflow-x-auto text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 py-3 px-4">
              {categories.map((category, index) => (
                <div key={category.id || index} className="shrink-0">
                  <button
                    onClick={() => setActiveCategory(index)}
                    className={`flex h-9 w-full items-center justify-center rounded-full px-5 text-center transition-all duration-200 font-medium
                      ${
                        activeCategory === index
                          ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white tracking-tight font-semibold shadow-lg shadow-blue-500/30 border-2 border-blue-600 scale-105"
                          : "text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 hover:shadow-md"
                      }
                    `}
                    aria-label={`Filter by ${category.name}`}
                    aria-pressed={activeCategory === index}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
          )}
          <ScrollBar
            orientation="horizontal"
            className="h-2 scrollbar-thumb-rounded-full"
          />
        </ScrollArea>
      </div>
    </>
  );
}