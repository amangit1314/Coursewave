import Navbar from "../(browseCourses)/browseCourses/_components/navbar"
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar"

interface BrowseSessionsLayoutProps {
    children: React.ReactNode
}

export default function BrowseSessionsLayout({ children }: BrowseSessionsLayoutProps) {
    return <div className="min-h-screen h-full dark:bg-slate-700">
        <div className="h-[60px] md:pl-56 fixed inset-y-0 w-full z-50 ">
            <Navbar />
        </div>
        
        <div className="hidden md:flex h-full fixed inset-y-0 z-50">
            <Sidebar />
        </div>
        <div className="md:pl-64  h-full">
            {children}
        </div>
        
    </div>
}