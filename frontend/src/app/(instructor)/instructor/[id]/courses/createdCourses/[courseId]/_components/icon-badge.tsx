import { Icon } from "@tremor/react";

export const IconBadge = ({ icon }: any) => {
  return (
    <div className="border-stroke flex items-center justify-center rounded-full border border-blue-500 bg-transparent dark:border-white dark:bg-zinc-800">
      <Icon icon={icon} size="xs" className="text-blue-500 dark:text-white" />
    </div>
  );
};
