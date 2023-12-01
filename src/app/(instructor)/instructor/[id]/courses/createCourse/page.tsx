import React from 'react'
import CreateCourseForm from '../_components/create-course-form'

function CreateCourse() {
  return (
    <div className='flex pt-30 h-full'>
      <div className='flex flex-col'>
        <p>Name your Course</p>
        <p>What would you like to name your course? Dont worry you can change this later. </p>
      </div>
          <CreateCourseForm />
    </div>
  )
}

export default CreateCourse