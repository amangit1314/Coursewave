import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-6 w-6 text-destructive" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-destructive">
            {title}
          </h3>
          <div className="mt-2 text-sm text-destructive/80">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
