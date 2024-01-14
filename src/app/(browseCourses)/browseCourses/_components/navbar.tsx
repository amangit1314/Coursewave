import React from 'react'
import MobileSidebar from './mobile-sidebar'
import NavbarRoutes from '@/components/navbar-routes'

function Navbar() {
  return (
      <div className='p-4 border-b h-full flex items-center dark:bg-zinc-900 bg-white shadow-sm'>
          <MobileSidebar />
          <NavbarRoutes />
    </div>
  )
}

export default Navbar