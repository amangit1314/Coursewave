import React from 'react'
import BrowseSection from '../_components/browse-section'
import DataComponent from '../_components/DataComponent'


function BrowseCourses() {
    return (
        <div className='flex mt-30 h-full'>
            <BrowseSection>
                <DataComponent />
            </BrowseSection>
        </div>
    )
}
export default BrowseCourses