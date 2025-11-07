import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";

const SuccessMessage = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
      <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
    </div>
    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
      Message sent successfully!
    </h3>
    <p className="mb-6 text-gray-600 dark:text-gray-300">
      Thank you for reaching out. We'll get back to you within 24 hours.
    </p>
    <Button onClick={onReset} variant="outline">
      Send another message
    </Button>
  </div>
);

export default SuccessMessage;
