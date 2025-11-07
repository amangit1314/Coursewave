const ShimmerSubscriptionItem = () => {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 animate-pulse">
      <div className="h-6 w-32 mb-2 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
      <div className="h-10 w-20 mb-4 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
      <ul className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <li key={i} className="h-5 w-full bg-zinc-300 dark:bg-zinc-700 rounded"></li>
        ))}
      </ul>
      <div className="mt-6 h-10 w-full bg-zinc-300 dark:bg-zinc-700 rounded"></div>
    </div>
  );
};

export default ShimmerSubscriptionItem;