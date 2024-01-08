import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='flex mx-auto items-center justify-center'>
      <SignIn
        // afterSignInUrl={`/${userId}/browseCourses`}
      />
  </div>
  )
}

export default page