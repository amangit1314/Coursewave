import Navbar from "../(browseCourses)/browseCourses/_components/navbar"
import InstructorNavbar from "./_components/instructor-navbar"
import InstructorSidebar from "./_components/instructor-sidebar"

interface InstructorLayoutProps {
    children: React.ReactNode
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
    return <div className="min-h-screen h-full dark:bg-slate-700">
        <div className="h-[60px] md:pl-56 fixed inset-y-0 w-full z-50 ">
            <InstructorNavbar />
        </div> <div className="hidden md:flex h-full fixed inset-y-0 z-50">
            <InstructorSidebar />
        </div>
        <div className="md:pl-64  h-full">
            {children}
        </div>
    </div>
}

// "use client";
// import "../globals.css";
// import "../data-tables-css.css";
// // import "../satoshi.css";
// import { useState, useEffect } from "react";
// import Loader from "@/components/common/Loader";
// import Sidebar from "@/components/Sidebar";
// import Header from "@/app/(instructor)/_components/Header/index";


// export default function InstructorLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         setTimeout(() => setLoading(false), 1000);
//     }, []);

//     return (
//         <html lang="en">
//             <body suppressHydrationWarning={true}>
//                 <div className="dark:bg-boxdark-2 dark:text-bodydark">
//                     {loading ? (
//                         <Loader />
//                     ) : (
//                         <div className="flex h-screen overflow-hidden">
//                             {/* <!-- ===== Sidebar Start ===== --> */}
//                             <Sidebar
//                                 sidebarOpen={sidebarOpen}
//                                 setSidebarOpen={setSidebarOpen}
//                             />
//                             {/* <!-- ===== Sidebar End ===== --> */}

//                             {/* <!-- ===== Content Area Start ===== --> */}
//                             <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//                                 {/* <!-- ===== Header Start ===== --> */}
//                                 <Header
//                                     sidebarOpen={sidebarOpen}
//                                     setSidebarOpen={setSidebarOpen}
//                                 />
//                                     {/* <Header /> */}
//                                 {/* <!-- ===== Header End ===== --> */}

//                                 {/* <!-- ===== Main Content Start ===== --> */}
//                                 <main>
//                                     <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//                                         {children}
//                                     </div>
//                                 </main>
//                                 {/* <!-- ===== Main Content End ===== --> */}
//                             </div>
//                             {/* <!-- ===== Content Area End ===== --> */}
//                         </div>
//                     )}
//                 </div>
//             </body>
//         </html>
//     );
// }
