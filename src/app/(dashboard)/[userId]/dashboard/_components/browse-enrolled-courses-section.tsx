"use client";

import React, { useEffect } from 'react'
import { category } from '@prisma/client';
import { FilteredCoursesComponent } from '@/components/course/filtered-courses';
import CategoriesComponent from '@/components/course/courses-categories-component';

interface BrowseEnrolledCoursesSectionProps {
    children: React.ReactNode;
}

const BrowseEnrolledCoursesSection: React.FC<BrowseEnrolledCoursesSectionProps> = ({ children }) => {
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
        <div className="max-h-screen mt-[14rem] md:mt-[1rem] mb-12 max-w-7xl place-items-center items-center w-full h-full">
            <CategoriesComponent
                activeCategory={activeCategoryIndex}
                setActiveCategory={handleClick}
                categories={categories}
                loading={loading}
            />

            <FilteredCoursesComponent
                activeCategory={activeCategory}
                categories={categories}
            />
        </div>
    );
};

export default BrowseEnrolledCoursesSection;