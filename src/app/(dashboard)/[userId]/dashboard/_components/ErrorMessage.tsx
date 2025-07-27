import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Error Message Component
interface ErrorMessageProps {
    title: string;
    message: string;
  }
  
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
              {title}
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ErrorMessage;