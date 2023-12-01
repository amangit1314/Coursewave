"use client";

import React, { useEffect } from 'react'
import { course } from '@prisma/client';
import toast, { Toaster } from 'react-hot-toast';
import CreateCourseButton from '../_components/create-course-button';
import CreatedCourseWidget from '../_components/created-course-widget';

const CreatedCourses = () => {
    const [loading, setLoading] = React.useState(true);
    const [courses, setCourses] = React.useState<course[]>([]);

    useEffect(() => {
        fetch('https://localhost:3000/api/instructor/4675e19e-432b-4135-b285-cc0953095f9d/dashboard/courses')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch created courses');
                }
            })
            .then((data) => {
                console.log(data); // Check the data in the console

                // Assuming your data.data is an array of courses
                setCourses(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="pt-[80px] pb-12 w-full">

            <CreateCourseButton />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-6 w-9/12 justify-start mx-auto">
                {loading ? (
                    'Loading ...'
                ) : (
                    courses.map((course: course) => (
                        <CreatedCourseWidget
                            key={course.courseId}
                            index={course.courseId}
                            title={course.courseTitle}
                            courseImage={course.courseImage}
                            courseNumber={course.courseId}
                            instructor={course.instructorID?.split('-')[0] || 'Aman Soni'}
                            instructorId={course.instructorID?.split('-')[0] || 'Aman Soni'}
                            price={course.coursePrice}
                            categories={course.courseCategories}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CreatedCourses;