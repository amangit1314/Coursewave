'use client';

import Image from 'next/image';
import { Course } from "@prisma/client";
import { usePathname } from "next/navigation";
import toast from 'react-hot-toast';
import React from 'react';
import useUserInfo from '@/hooks/use-user-info';
import useCheckCourseIsPurchased from '@/hooks/use-check-course-is-puchased';
import useNotificationsStore from '@/zustand/notificationsStore';
import { absoluteUrl } from '@/utils/utils';
import { Button } from '@tremor/react';
import { Loader } from 'lucide-react';
import axios from 'axios';

export const CourseEnrollButton = ({
    course,
    courseId,
  }: {
    course: Course;
    courseId: string;
  }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const user = useUserInfo();
    const isCoursePurchased = useCheckCourseIsPurchased(user?.user?.id, courseId);
    const setNotification = useNotificationsStore(
      (state) => state.setNotification
    );
  
    const enrollInCourse = async () => {
      try {
        setIsLoading(true);
        console.log(
          "Is course already purchased? : ",
          isCoursePurchased.courseIsPurchased
        );
        if (isCoursePurchased.courseIsPurchased) {
          window.location.assign(
            absoluteUrl(`/courses/${courseId}/courseContent`)
          );
        } else {
          const response = await axios.post(`api/courses/${courseId}/checkout`, {
            userId: user?.user?.id!,
          });
  
          window.location.assign(response.data.url);
  
          setNotification(
            "Course Enrollment Successful 🎉",
            `Congratulations! You have successfully enrolled in "${course?.courseTitle}" course?.`
          );
        }
      } catch (error) {
        toast.error("Something went wrong ...");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isCoursePurchased.error) {
      return <div>Error: {isCoursePurchased.error.message}</div>;
    }
  
    return (
      <div className="flex justify-between">
        <Button
          onClick={enrollInCourse}
          disabled={isLoading}
          size="sm"
          color="blue"
          className="mt-2 text-center text-white bg-blue-500 w-[28rem] md:w-[26rem] mr-8 md:mr-0 rounded-md hover:bg-blue-700 text-sm  font-semibold p-2"
        >
          {isCoursePurchased.isLoading ? (
            <Loader className="animate-spin" />
          ) : // "Checking if course is purchased or not ..."
          isCoursePurchased.courseIsPurchased ? (
            "Resume Learning"
          ) : (
            "Buy Now"
          )}
        </Button>
      </div>
    );
  }
  