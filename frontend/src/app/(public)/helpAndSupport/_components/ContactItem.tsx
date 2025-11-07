import { dmSans } from "@/lib/config/fonts";

const ContactItem = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) => (
  <div className="flex items-start space-x-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
      {icon}
    </div>
    <div className="flex-1">
      <h4
        className={`${dmSans.className} text-sm font-semibold text-gray-900 dark:text-white`}
      >
        {title}
      </h4>
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

export default ContactItem;