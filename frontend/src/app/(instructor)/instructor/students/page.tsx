// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"; // Use your dialog component
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Eye, MessageSquare } from "lucide-react";

// interface Student {
//   id: string;
//   name: string;
//   email: string;
//   profileImageUrl?: string;
//   courses: {
//     id: string;
//     title: string;
//     progress: number;
//     lastAccessed: string;
//   }[];
// }

// const mockStudents: Student[] = [
//   {
//     id: "student_1",
//     name: "Alice Johnson",
//     email: "alice.johnson@example.com",
//     profileImageUrl: "/assets/images/avatars/avatar-01.jpg",
//     courses: [
//       {
//         id: "course_1",
//         title: "React Masterclass",
//         progress: 95,
//         lastAccessed: new Date().toISOString(),
//       },
//       {
//         id: "course_2",
//         title: "TypeScript Fundamentals",
//         progress: 75,
//         lastAccessed: new Date(
//           Date.now() - 2 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//     ],
//   },
//   {
//     id: "student_2",
//     name: "Bob Smith",
//     email: "bob.smith@example.com",
//     profileImageUrl: "/assets/images/avatars/avatar-02.jpg",

//     courses: [
//       {
//         id: "course_1",
//         title: "React Masterclass",
//         progress: 45,
//         lastAccessed: new Date(
//           Date.now() - 3 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//     ],
//   },
//   {
//     id: "student_3",
//     name: "Carol Davis",
//     email: "carol.davis@example.com",
//     profileImageUrl: "/assets/images/avatars/avatar-03.jpg",

//     courses: [
//       {
//         id: "course_1",
//         title: "React Masterclass",
//         progress: 100,
//         lastAccessed: new Date(
//           Date.now() - 45 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//       {
//         id: "course_3",
//         title: "Next.js Advanced",
//         progress: 100,
//         lastAccessed: new Date(
//           Date.now() - 40 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//     ],
//   },
//   {
//     id: "student_4",
//     name: "David Wilson",
//     email: "david.wilson@example.com",
//     profileImageUrl: "/assets/images/avatars/avatar-04.jpg",

//     courses: [
//       {
//         id: "course_2",
//         title: "TypeScript Fundamentals",
//         progress: 20,
//         lastAccessed: new Date(
//           Date.now() - 1 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//     ],
//   },
//   {
//     id: "student_5",
//     name: "Eva Brown",
//     email: "eva.brown@example.com",
//     profileImageUrl: "/assets/images/avatars/avatar-05.jpg",

//     courses: [
//       {
//         id: "course_1",
//         title: "React Masterclass",
//         progress: 60,
//         lastAccessed: new Date(
//           Date.now() - 60 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//     ],
//   },
//   {
//     id: "student_6",
//     name: "Frank Miller",
//     email: "frank.miller@example.com",
//     profileImageUrl: "/assets/images/avatars/avatar-06.jpg",

//     courses: [
//       {
//         id: "course_1",
//         title: "React Masterclass",
//         progress: 92,
//         lastAccessed: new Date().toISOString(),
//       },
//       {
//         id: "course_2",
//         title: "TypeScript Fundamentals",
//         progress: 88,
//         lastAccessed: new Date(
//           Date.now() - 1 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//       {
//         id: "course_3",
//         title: "Next.js Advanced",
//         progress: 95,
//         lastAccessed: new Date().toISOString(),
//       },
//     ],
//   },
// ];

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }

// const Students = () => {
//   const router = useRouter();
//   const [students, setStudents] = useState<Student[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => setStudents(mockStudents), 600);
//   }, []);

//   return (
//     <Card className="max-w-2xl mx-auto mt-16 p-0 overflow-hidden shadow">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
//           All Students
//         </CardTitle>
//         <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
//           Managed by you (instructor)
//         </p>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Avatar</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {students.map((student) => (
//               <TableRow key={student.id}>
//                 <TableCell>
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage
//                       src={student.profileImageUrl}
//                       alt={student.name}
//                     />
//                     <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
//                   </Avatar>
//                 </TableCell>
//                 <TableCell className="font-semibold">{student.name}</TableCell>
//                 <TableCell className="text-zinc-600">{student.email}</TableCell>
//                 <TableCell className="text-right">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => setSelectedStudent(student)}
//                       >
//                         <Eye className="h-4 w-4 mr-1" /> Courses
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>{student.name}'s Courses</DialogTitle>
//                         <p className="text-xs text-zinc-500">
//                           Email: {student.email}
//                         </p>
//                       </DialogHeader>
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Title</TableHead>
//                             <TableHead>Progress</TableHead>
//                             <TableHead>Last Accessed</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {student.courses.map((course) => (
//                             <TableRow key={course.id}>
//                               <TableCell>{course.title}</TableCell>
//                               <TableCell>
//                                 <span
//                                   className={`px-2 py-1 rounded-full text-xs font-semibold
//                                     ${
//                                       course.progress === 100
//                                         ? "bg-green-100 text-green-700"
//                                         : course.progress >= 50
//                                           ? "bg-blue-100 text-blue-700"
//                                           : "bg-yellow-100 text-yellow-700"
//                                     }`}
//                                 >
//                                   {course.progress}%
//                                 </span>
//                               </TableCell>
//                               <TableCell>
//                                 {new Date(
//                                   course.lastAccessed
//                                 ).toLocaleDateString()}
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </DialogContent>
//                   </Dialog>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="ml-2"
//                     onClick={() =>
//                       router.push(`/instructor/messages?student=${student.id}`)
//                     }
//                   >
//                     <MessageSquare className="h-4 w-4 mr-1" /> Message
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default Students;

/// =============================================================

"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, MessageSquare, Users, TrendingUp, Clock } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  courses: {
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
  }[];
}

const mockStudents: Student[] = [
  {
    id: "student_1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    profileImageUrl: "/assets/images/avatars/avatar-01.jpg",
    courses: [
      {
        id: "course_1",
        title: "React Masterclass",
        progress: 95,
        lastAccessed: new Date().toISOString(),
      },
      {
        id: "course_2",
        title: "TypeScript Fundamentals",
        progress: 75,
        lastAccessed: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  },
  {
    id: "student_2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    profileImageUrl: "/assets/images/avatars/avatar-02.jpg",
    courses: [
      {
        id: "course_1",
        title: "React Masterclass",
        progress: 45,
        lastAccessed: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  },
  {
    id: "student_3",
    name: "Carol Davis",
    email: "carol.davis@example.com",
    profileImageUrl: "/assets/images/avatars/avatar-03.jpg",
    courses: [
      {
        id: "course_1",
        title: "React Masterclass",
        progress: 100,
        lastAccessed: new Date(
          Date.now() - 45 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "course_3",
        title: "Next.js Advanced",
        progress: 100,
        lastAccessed: new Date(
          Date.now() - 40 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  },
  {
    id: "student_4",
    name: "David Wilson",
    email: "david.wilson@example.com",
    profileImageUrl: "/assets/images/avatars/avatar-04.jpg",
    courses: [
      {
        id: "course_2",
        title: "TypeScript Fundamentals",
        progress: 20,
        lastAccessed: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  },
  {
    id: "student_5",
    name: "Eva Brown",
    email: "eva.brown@example.com",
    profileImageUrl: "/assets/images/avatars/avatar-05.jpg",
    courses: [
      {
        id: "course_1",
        title: "React Masterclass",
        progress: 60,
        lastAccessed: new Date(
          Date.now() - 60 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  },
  {
    id: "student_6",
    name: "Frank Miller",
    email: "frank.miller@example.com",
    profileImageUrl: "/assets/images/avatars/avatar-06.jpg",
    courses: [
      {
        id: "course_1",
        title: "React Masterclass",
        progress: 92,
        lastAccessed: new Date().toISOString(),
      },
      {
        id: "course_2",
        title: "TypeScript Fundamentals",
        progress: 88,
        lastAccessed: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "course_3",
        title: "Next.js Advanced",
        progress: 95,
        lastAccessed: new Date().toISOString(),
      },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 600);
  }, []);

  const totalStudents = students.length;
  const activeStudents = students.filter((s) =>
    s.courses.some((c) => {
      const daysSince =
        (Date.now() - new Date(c.lastAccessed).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    })
  ).length;
  const avgProgress = Math.round(
    students.reduce(
      (acc, s) =>
        acc +
        s.courses.reduce((sum, c) => sum + c.progress, 0) / s.courses.length,
      0
    ) / students.length || 0
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-zinc-900 dark:to-zinc-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:pt-16 lg:pb-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
                Students
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                Manage and monitor your student's progress
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-stone-900 dark:text-white">
                    {totalStudents}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                    Active This Week
                  </p>
                  <p className="text-3xl font-bold text-stone-900 dark:text-white">
                    {activeStudents}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                    Avg Progress
                  </p>
                  <p className="text-3xl font-bold text-stone-900 dark:text-white">
                    {avgProgress}%
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-xl font-bold text-stone-900 dark:text-white">
                  All Students
                </CardTitle>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  View courses, progress, and send messages
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 w-fit shrink-0">
                <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  {totalStudents} Active
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
                    <th className="text-left font-semibold text-stone-700 dark:text-stone-300 px-6 py-3 text-sm">
                      Student
                    </th>
                    <th className="text-left font-semibold text-stone-700 dark:text-stone-300 px-4 py-3 text-sm hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left font-semibold text-stone-700 dark:text-stone-300 px-4 py-3 text-sm hidden lg:table-cell">
                      Courses
                    </th>
                    <th className="text-right font-semibold text-stone-700 dark:text-stone-300 px-6 py-3 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <tr
                          key={i}
                          className="border-b border-stone-200 dark:border-stone-800"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 bg-stone-200 dark:bg-stone-800 rounded-full animate-pulse"></div>
                              <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded animate-pulse"></div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded animate-pulse"></div>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="h-4 w-16 bg-stone-200 dark:bg-stone-800 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <div className="h-8 w-24 bg-stone-200 dark:bg-stone-800 rounded animate-pulse"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    : students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-11 w-11 border-2 border-stone-200 dark:border-stone-700 shadow-sm">
                                <AvatarImage
                                  src={student.profileImageUrl}
                                  alt={student.name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                  {getInitials(student.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-stone-900 dark:text-white text-sm">
                                  {student.name}
                                </p>
                                <p className="text-xs text-stone-500 dark:text-stone-400 md:hidden">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell text-sm text-stone-600 dark:text-stone-400">
                            {student.email}
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full text-xs font-medium">
                              {student.courses.length}{" "}
                              {student.courses.length === 1
                                ? "course"
                                : "courses"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-400 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300 shadow-sm transition-all"
                                    onClick={() => setSelectedStudent(student)}
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">
                                      View
                                    </span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader className="pb-4 border-b border-stone-200 dark:border-stone-800">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Avatar className="h-12 w-12 border-2 border-stone-200 dark:border-stone-700">
                                        <AvatarImage
                                          src={student.profileImageUrl}
                                          alt={student.name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                          {getInitials(student.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <DialogTitle className="text-xl font-bold text-stone-900 dark:text-white">
                                          {student.name}'s Courses
                                        </DialogTitle>
                                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                                          {student.email}
                                        </p>
                                      </div>
                                    </div>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        <thead>
                                          <tr className="border-b border-stone-200 dark:border-stone-800">
                                            <th className="text-left font-semibold text-stone-700 dark:text-stone-300 px-4 py-3 text-sm">
                                              Course Title
                                            </th>
                                            <th className="text-left font-semibold text-stone-700 dark:text-stone-300 px-4 py-3 text-sm">
                                              Progress
                                            </th>
                                            <th className="text-left font-semibold text-stone-700 dark:text-stone-300 px-4 py-3 text-sm">
                                              Last Active
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {student.courses.map((course) => (
                                            <tr
                                              key={course.id}
                                              className="border-b border-stone-200 dark:border-stone-800"
                                            >
                                              <td className="px-4 py-3 font-medium text-stone-900 dark:text-white text-sm">
                                                {course.title}
                                              </td>
                                              <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-20 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                                                    <div
                                                      className={`h-full rounded-full transition-all ${
                                                        course.progress === 100
                                                          ? "bg-green-500"
                                                          : course.progress >=
                                                              50
                                                            ? "bg-blue-500"
                                                            : "bg-yellow-500"
                                                      }`}
                                                      style={{
                                                        width: `${course.progress}%`,
                                                      }}
                                                    ></div>
                                                  </div>
                                                  <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                      course.progress === 100
                                                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                                        : course.progress >= 50
                                                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                                    }`}
                                                  >
                                                    {course.progress}%
                                                  </span>
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-sm">
                                                {getTimeAgo(
                                                  course.lastAccessed
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
                                onClick={() =>
                                  console.log(`Message ${student.id}`)
                                }
                              >
                                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                <span className="hidden sm:inline">
                                  Message
                                </span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Students;
