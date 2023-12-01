import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import InstructorSidebar from './instructor-sidebar';
import { Menu } from '@/components/menu-icon';

function InstructorMobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className='p-0 bg-white' >
                <InstructorSidebar />
            </SheetContent>
        </Sheet>
    )
}

export default InstructorMobileSidebar