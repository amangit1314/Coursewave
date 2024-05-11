const ScheduledSessionCard = () => {
  return (
    <div className="w-[500px] mx-[2px] border border-stroke border-gray-300 rounded-xl cursor-pointer p-4 flex justify-start  my-4 dark:bg-zinc-950 hover:bg-blue-100 hover:bg-blend-saturation  hover:text-blue-800 dark:hover:text-white transition-all hover:ring-2 hover:ring-blue-600 duration-300">
      <div className={`bg-blue-500 h-15 w-1 rounded-full`}></div>

      <div className="ml-3  mr-1 justify-start items-start py-auto flex flex-col">
        <p className="uppercase   text-xs">Tuesday, jan 3 at 3:40 pm (pt)</p>
        <div className="flex flex-col justify-start">
          <p className="max-w-[169px] w-full text-sm font-medium tracking-tight line-clamp-1">
            One-on-One Session
          </p>
          <p className="text-xs tracking-tighter">40m</p>
        </div>
      </div>

      <div className="flex items-center bg-gray-600 dark:hover:bg-white my-auto h-6 w-[1px] mx-1"></div>

      <div className="flex flex-col justify-start ml-1">
        <p className="  text-xs font-medium">Status</p>
        <div className="flex justify-center mt-[4px] text-xs py-1 px-2 rounded-badge bg-green-200 text-green-950 font-medium">
          confirmed
        </div>
      </div>
    </div>
  );
}

export default ScheduledSessionCard;