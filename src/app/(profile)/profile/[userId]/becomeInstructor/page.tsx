import React from "react";

const BecomeInstructor = ({
  params,
}: {
  params: {
    id?: string;
  };
}) => {
  return (
    <div className="pt-[80px]">
      <span className="me-2 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
        Purple
      </span>
    </div>
  );
};

export default BecomeInstructor;
