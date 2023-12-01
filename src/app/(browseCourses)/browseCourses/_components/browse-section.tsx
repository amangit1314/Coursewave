"use client";

import React, { useEffect } from 'react'
import CourseWidget from "./course-widget";
import { category, course } from '@prisma/client';
import courses, { fetchCourses, fetchCoursesSuccess } from '@/redux/slices/courses';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useDispatch } from 'react-redux';

interface TabsComponentProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
    categories: category[];
    loading: boolean;
}

export function TabsComponent({ activeTab, setActiveTab, categories, loading }: TabsComponentProps) {
    return <>
        <ul className="flex flex-wrap justify-center py-4 text-sm font-medium text-center mx-auto text-gray-500 dark:text-gray-400">
            {loading ? (
                'Categories Loading ...'
            ) : (categories.map((category, index) => (
                <li key={index} className="mr-2">
                    <a
                        href="#"
                        onClick={() => setActiveTab(index)}
                        className={`inline-block px-6 py-2 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${activeTab === index ? 'text-white bg-blue-600' : 'text-gray-500'
                            }`}
                    >
                        {category.categoryName}
                    </a>
                </li>
            )))}
        </ul>
    </>
}

interface TabsContentComponentProps {
    activeCategory: string | null;
    categories: category[];
}

export function TabsContentComponent({ activeCategory, categories }: TabsContentComponentProps) {
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
                console.log(data); // Check the data in the console

                // Assuming your data.data is an array of courses
                setCourses(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, []); // Empty dependency array to ensure useEffect runs only once

    // const courses = useAppSelector((state) => state.courses);
    // const dispatch = useAppDispatch();

    const filteredCourses = activeCategory
        ? courses1.filter((course) => {
            return (
                course.courseTitle === 'All' ? courses :
                    (
                        course.courseTitle.includes(activeCategory) ||
                        (course.courseCategories && course.courseCategories.includes(activeCategory))
                    )
            );
        })
        : courses1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6 w-10/12 justify-start mx-auto">
            {loading ? (
                'Loading ...'
            ) : (
                filteredCourses.map((course: course) => (
                    <CourseWidget
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
    );
}

interface BrowseSectionProps {
    children: React.ReactNode;
}

const BrowseSection: React.FC<BrowseSectionProps> = ({ children }) => {
    const [loading, setLoading] = React.useState(true);
    const [activeCategoryIndex, setActiveCategoryIndex] = React.useState<number>(0);
    const [categories, setCategories] = React.useState<category[]>([]);

    useEffect(() => {
        fetch('https://localhost:3000/api/categories/')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch categories');
                }
            })
            .then((data) => {
                console.log(data); // Check the data in the console

                // Assuming your data.data is an array of courses
                setCategories([{ categoryName: 'All' }, ...data.data]); // Add 'All' category
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                setLoading(false);
            });
    }, []);

    const handleClick = (index: number) => {
        setActiveCategoryIndex(index);
    };

    const activeCategory = categories[activeCategoryIndex]?.categoryName || 'All';

    return (
        <div className="pt-[80px] pb-12 w-full">
            <TabsComponent
                activeTab={activeCategoryIndex}
                setActiveTab={handleClick}
                categories={categories}
                loading={loading}
            />
            <TabsContentComponent
                activeCategory={activeCategory}
                categories={categories}
            />
        </div>
    );
};


export default BrowseSection;