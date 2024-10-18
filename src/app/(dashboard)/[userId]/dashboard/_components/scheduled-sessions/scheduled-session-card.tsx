import Image from "next/image";

const ScheduledSessionCard = () => {
  return (
    <div className="border-stroke mx-[2px] my-4 flex w-full max-w-[30rem] cursor-pointer justify-start overflow-hidden rounded-xl border pr-4 transition-all duration-300 hover:text-blue-800 hover:bg-blend-saturation hover:ring-1 hover:ring-blue-600 dark:border-none dark:bg-zinc-950 dark:hover:text-white">
      <div className={`h-25 w-1 rounded-full bg-blue-500 py-4`}></div>

      <div className="mx-4 flex w-full max-w-[25rem] items-center justify-start space-x-3">
        {/* image and speaker name */}
        <div className="flex flex-col items-start justify-center space-y-2">
          <Image
            src={
              "https://static.vecteezy.com/system/resources/thumbnails/003/857/434/small/group-discuss-session-in-modern-flat-style-free-vector.jpg"
            }
            alt={`Image`}
            height={100}
            width={100}
            objectFit="cover"
            quality={100}
            className="flex h-[6rem] w-full max-w-[8rem] items-center justify-start rounded-md object-cover ring-1 ring-white md:w-[16rem]"
          />
          {/* 
          <p className="line-clamp-2 max-w-[8rem] overflow-hidden text-ellipsis text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            {"Jemmison Carl"}
          </p> */}
        </div>

        {/* content */}
        <div className="flex flex-col items-start justify-start py-4 space-y-2">
          {/* <p className="text-xs uppercase text-zinc-600 dark:text-gray-300 dark:opacity-70">
            <span className="text-blue-500">Tuesday</span>,{" "}
            <span className="text-blue-500">jan 3</span> @{" "}
            <span className="text-blue-500">3:40 PM(IST)</span>
          </p> */}
          <p className="text-xs uppercase text-zinc-600 dark:text-gray-300 dark:opacity-70">
            Tuesday, jan 3 @ 3:40 PM(IST)
          </p>

          <div className="flex flex-col justify-start">
            <p className="line-clamp-1 w-full max-w-[20rem] overflow-hidden text-ellipsis text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              Introduction to Rust
              asdifapdfasdofmas;dkfmas;dfasdfjpasdfjpasdfpwiepqiewjrp;wekdmfa;sodf-pwoej=3=23rj23wejorq[woerjqwke;rjq;ewlrjwlekjrk]
            </p>
            <p className="text-xs tracking-tighter text-zinc-600 dark:text-gray-300 dark:opacity-70">
              One-on-One Session (Duration: 40m)
            </p>
          </div>

          <div className=" flex items-center justify-start">
            <div className="flex justify-center rounded-badge bg-green-600 px-1 py-0.5 text-xs font-medium text-white">
              confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledSessionCard;
