import React from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { course } from "@prisma/client";
import { AiFillStar } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import { BsFillBookmarkStarFill } from "react-icons/bs";

type CourseItemProps = {
    course: course;
}

const starStyle = { color: "yellow" }

export const CourseItem: React.FC<CourseItemProps> = ({
    course,
}) => {

    const [isBookmarked, setBookmarked] = React.useState(false);
    const [courseRating, setCourseRating] = React.useState(4.95);
    const [noOfCourseReviews, setNoOfCourseReviews] = React.useState(25);

    const router = useRouter();

    const toggleBookmark = () => {
        setBookmarked(!isBookmarked);
    };

    const onViewDetails = () => {
        router.push(`/browseCourses/courseDetails/${course.courseId}`)
    }

    return (
        <div
            key={course.courseId}
            onClick={onViewDetails}
            className={`group rounded-xl w-[15rem] dark:bg-gray-800 p-2.5 transition-colors hover:border-blue-500 hover:bg-white hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30`}
        >

            <div className="relative">
                <Image
                    className="h-40 w-[15rem] bg-slate-700 rounded-lg relative left-0 right-0"
                    src={course.courseImage}
                    alt="Next.js Logo"
                    width={250}
                    height={35}
                    style={{
                        objectFit: 'cover',
                    }}
                />
                <Badge className='absolute bottom-2 right-2'>{course.isFree ? 'Free' : course.coursePrice}</Badge>
            </div>

            <p
                className='mt-2 text-xs bg-transparent text-blue-500 font-normal border-blue-500'>{course.courseCategories ? course.courseCategories[0] : 'Default'}
            </p>
            <p
                className="text-sm font-semibold line-clamp-2">
                {course.courseTitle}
            </p>

            <div className="flex justify-between items-center py-auto">
                <div className="flex text-xs items-center py-auto">
                    <AiFillStar className="my-2" style={starStyle} size={18} />
                    <p className="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">{courseRating}</p>
                    <p className="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400"> ({noOfCourseReviews} Reviews)</p>
                </div>

                <div
                    className={`h-7 hover:bg-indigo-600 w-7 p-1 items-center cursor-pointer flex py-auto justify-center rounded-full ${isBookmarked ? 'bg-indigo-600' : 'bg-indigo-400'}`}
                    onClick={toggleBookmark}
                >
                    {isBookmarked ? (<BsFillBookmarkStarFill />) : (
                        <CiBookmark size={16} style={{ color: "white" }} />
                    )}
                </div>
            </div>

            <div className='flex justify-start'>
                <div className='flex justify-between'>
                    <p className='text-xs'>◽ 10 Classes</p>
                    <p className='pl-1 text-xs'>◽ 48 hours</p>
                </div>
            </div>
        </div>
    );
}