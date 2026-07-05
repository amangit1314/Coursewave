import ShimmerButton from "@/components/magicui/shimmer-button";

const LearningGoalsSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-3 p-3 bg-muted rounded-xl"
        >
          <ShimmerButton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <ShimmerButton className="h-4 w-3/4" />
            <ShimmerButton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default LearningGoalsSkeleton;
