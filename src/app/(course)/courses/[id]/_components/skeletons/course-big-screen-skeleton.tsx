import { Skeleton } from "@/components/ui/skeleton";
import { FaAngleRight, FaStar } from "react-icons/fa6";

const CourseBigScreenSkeleton = () => {
  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center py-8">
      <div className="border-stroke grid h-full min-h-screen grid-cols-3 items-start justify-between space-x-8 rounded-3xl border p-4">
        {/* left */}
        <div className="col-span-2 h-full w-full space-y-8">
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[100px] rounded-full" />
            <FaAngleRight />
            <Skeleton className="h-4 w-[100px] rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-[300px] rounded-md" />
            </div>

            <div className="flex items-center justify-start space-x-2">
              <FaStar className="text-yellow-500" />
              <Skeleton className="h-4 w-[100px] rounded-full" />
              <Skeleton className="h-4 w-[230px] rounded-full" />
              <Skeleton className="h-4 w-[150px] rounded-md" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="mt-2 h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Skeleton className="h-6 w-40 rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[260px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="mt-2 h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[320px] rounded-full" />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="border-stroke col-span-1 h-full w-full max-w-[22rem] space-y-2 rounded-3xl border p-4">
          <Skeleton className="h-[220px] w-full rounded-2xl" />
          <div className="flex items-center justify-start space-x-2">
            <span className="font-bold text-blue-500">$</span>
            <Skeleton className="h-4 w-12 rounded-md" />{" "}
            <Skeleton className="h-4 w-40 rounded-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="space-y-8">
            <div className="mx-auto flex items-center justify-center">
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <Skeleton className="h-6 w-40 rounded-md" />
              </div>

              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              </div>
            </div>

            <div className="mx-auto flex items-center justify-center space-x-4">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CourseBigScreenSkeleton;