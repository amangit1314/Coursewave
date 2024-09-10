const ScheduledSessionCard = () => {
  return (
    <div className="border-stroke mx-[2px] my-4 flex w-[500px] cursor-pointer justify-start rounded-xl border border-gray-300 p-4 transition-all duration-300 hover:bg-blue-100 hover:text-blue-800 hover:bg-blend-saturation hover:ring-2 hover:ring-blue-600 dark:bg-zinc-950 dark:hover:text-white">
      <div className={`h-15 w-1 rounded-full bg-blue-500`}></div>

      <div className="py-auto ml-3 mr-1 flex flex-col items-start justify-start">
        <p className="text-xs uppercase">Tuesday, jan 3 at 3:40 pm (pt)</p>
        <div className="flex flex-col justify-start">
          <p className="line-clamp-1 w-full max-w-[169px] text-sm font-medium tracking-tight">
            One-on-One Session
          </p>
          <p className="text-xs tracking-tighter">40m</p>
        </div>
      </div>

      <div className="mx-1 my-auto flex h-6 w-[1px] items-center bg-gray-600 dark:hover:bg-white"></div>

      <div className="ml-1 flex flex-col justify-start">
        <p className="text-xs font-medium">Status</p>
        <div className="mt-[4px] flex justify-center rounded-badge bg-green-200 px-2 py-1 text-xs font-medium text-green-950">
          confirmed
        </div>
      </div>
    </div>
  );
};

export default ScheduledSessionCard;
