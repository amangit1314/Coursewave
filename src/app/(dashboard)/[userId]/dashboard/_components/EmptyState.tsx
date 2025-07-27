import { SparklesIcon } from "lucide-react";

// Reusable Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.FC<any>;
  action?: {
    label: string;
    href: string;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-700/50 border-2 border-dashed border-zinc-200 dark:border-zinc-600">
      <div className="bg-white dark:bg-zinc-600 p-4 rounded-full mb-4 shadow-sm">
        <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <a
          href={action.href}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          {action.label}
        </a>
      )}
    </div>
  );
};

export default EmptyState;
