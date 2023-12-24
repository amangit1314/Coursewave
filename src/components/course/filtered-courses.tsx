import React, { useEffect } from "react";
import { CourseItem } from "./course-item";
import { category, course } from "@prisma/client";
import courses from "@/lib/features/courses";

interface FilteredCoursesComponentProps {
    activeCategory: string | null;
    categories: category[];
}

export function FilteredCoursesComponent({ activeCategory, categories }: FilteredCoursesComponentProps) {
    const [loading, setLoading] = React.useState(true);
    const [courses1, setCourses] = React.useState<course[]>([]);

    useEffect(() => {
        fetch('https://localhost:3000/api/courses/')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch courses');
                }
            })
            .then((data) => {
                console.log(data); 
                setCourses(data.data); // Assuming your data.data is an array of courses
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, []); // Empty dependency array to ensure useEffect runs only once

    // const filteredCourses = activeCategory
    //     ? courses1.filter((course: course) => {
    //         return (
    //             course.courseTitle === 'All' ? courses :
    //                 (
    //                     course.courseTitle.includes(activeCategory) ||
    //                     (course.courseCategories && course.courseCategories.includes(activeCategory))
    //                 )
    //         );
    //     })
    //     : courses1;

    const filteredCourses = activeCategory
        ? (activeCategory === 'All'
            ? courses1
            : courses1.filter((course: course) => (
                course.courseTitle.includes(activeCategory) ||
                (course.courseCategories && course.courseCategories.includes(activeCategory))
            ))
        )
        : courses1;


    return (
        <div className="grid grid-cols-1 max-w-5xl lg:grid-cols-4 gap-10 my-6 justify-center mx-auto">
            {
                loading ? ('Loading ...') : (
                    filteredCourses.map((course: course) => (
                        <CourseItem
                            key={course.courseId}
                            course={course}
                        />
                    ))
                )
            }
        </div>
    );
}