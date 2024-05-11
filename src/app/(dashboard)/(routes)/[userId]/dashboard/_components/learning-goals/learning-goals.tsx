import { IoMdAddCircleOutline } from "react-icons/io";
import LearningGoalCard from "./learning-goal-card";

const LearningGoals = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
          Learning Goals
        </h3>
        <div className="flex justify-center items-center text-blue-500 cursor-pointer font-medium hover:text-blue-600 transition-all duration-300">
          <IoMdAddCircleOutline />
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <LearningGoalCard />
        <LearningGoalCard />
        <LearningGoalCard />
      </div>
    </div>
  );
};

export default LearningGoals;