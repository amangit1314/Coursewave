import { Icon } from "@tremor/react";

export const IconBadge = ({ icon }: any) => {
  return (
    <div className="flex justify-center items-center rounded-full bg-transparent dark:bg-zinc-800 border border-stroke border-blue-500 dark:border-white">
      <Icon icon={icon} size="xs" className="text-blue-500 dark:text-white" />
    </div>
  );
};
