import DataComponent from '@/app/(browseCourses)/browseCourses/_components/DataComponent'
import React from 'react'
import BrowseEnrolledCoursesSection from './_components/browse-enrolled-courses-section'

function EnrolledCourses() {
    return (
        <div className='flex pt-[80px] h-full'>
            <BrowseEnrolledCoursesSection>
                <DataComponent />
            </BrowseEnrolledCoursesSection>
        </div>
    )
}

export default EnrolledCourses