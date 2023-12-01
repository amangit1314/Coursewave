import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <SignIn
      afterSignInUrl={'/userId/browseCourses'}
    />
  )
}

export default page