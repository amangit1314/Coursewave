import { Checkbox } from "@/components/ui/checkbox";

type LearningGoal = {
  title: string;
  tag: string;
  time: Date | string;
  isDone: boolean;
}

const LearningGoalCard = ({learningGoal}: {learningGoal : LearningGoal}) => {
  return (
    <div className="flex justify-start items-start space-x-2 ">
      <Checkbox className="mt-1" />
      <div className="">
        <p className="text-sm font-medium text-zinc-800 dark:text-gray-50 tracking-tight line-clamp-1">{learningGoal.title ?? "Task need to done"}</p>
        <div className="flex justify-start items-center space-x-2 line-clamp-1">
          <p className="text-xs font-thin text-gray-400 dark:text-gray-300 line-clamp-1">{learningGoal.title ?? "Tag"}</p>

          <p className="text-xs border-l border-stroke font-medium pl-2 text-blue-500">{learningGoal.time.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default LearningGoalCard;