import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";

type CourseDetailLeftSectionParams = {
  toggleIsInCart: any;
  isInCart: boolean;
};

export default function CourseDetailLeftSection({
  isInCart,
  toggleIsInCart,
}: CourseDetailLeftSectionParams) {
  const iconStyle = { color: "white" };
  return (
    // <div className="w-[30rem] ml-[8rem] mt-[60px]"></div>
    <div className="hidden md:flex md:flex-col relative w-[30rem] ml-[8rem] mt-[75px] shadow-lg z-99 shadow-gray-950 rounded-xl bg-slate-800 border-gray-500 max-h-[23rem]">
      <Image
        className="h-60 w-[20rem] bg-slate-700 rounded-t-xl relative left-0 right-0"
        src={
          "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
        }
        alt="Next.js Logo"
        width={400}
        height={40}
        style={{
          objectFit: "cover",
        }}
        unoptimized
      />

      <Badge
        onClick={toggleIsInCart}
        className="flex justify-center items-center rounded-full h-10 w-10 bg-indigo-500 absolute mt-1 bottom-29 hover:bg-indigo-600 right-2"
      >
        {isInCart ? (
          <HiOutlineShoppingCart style={iconStyle} />
        ) : (
          <HiShoppingCart style={iconStyle} />
        )}
      </Badge>

      <div className="p-4">
        <div className="flex py-auto items-center">
          <p className="text-lg font-semibold dark:text-gray-200">$ 499</p>
          <p className="font-bold pl-1 text-sm dark:text-gray-400">/mo</p>
        </div>

        <button
          type="submit"
          className="mt-2 bg-indigo-500 w-[18rem] rounded-lg hover:bg-indigo-700 text-sm text-white font-semibold p-2"
        >
          Buy Now
        </button>

        <p className="text-center text-xs py-2 text-gray-400 font-thin">
          30 Day money back guarantee
        </p>

        {/* <div className='grid grid-cols-2 grid-rows-2 gap-4 pt-1 justify-center'>
                        <div className='flex items-center py-auto'>
                            <FaShare />
                            <p className='pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-indigo-500 hover:font-semibold underline'>Share</p>
                        </div>
                        <div className='pl-[6px]'></div>
                        <div className=' flex items-center py-auto'>
                            <HiOutlineGift />
                            <p className='pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-indigo-500 hover:font-semibold underline'>Gift this course</p>
                        </div>
                        <div className='pl-[6px]'></div>
                        <div className='flex items-center py-auto'>
                            <RiCoupon3Line />
                            <p className='pl-2 hover:cursor-pointer text-xs text-gray-400 hover:text-indigo-500 hover:font-semibold underline'>Apply Coupon</p>
                        </div>   
                    </div> */}
      </div>
    </div>
  );
}
