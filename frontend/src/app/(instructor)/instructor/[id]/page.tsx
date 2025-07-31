"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaStar, FaGraduationCap, FaBookOpen, FaUserGraduate } from "react-icons/fa";
import Link from "next/link";

// Dummy fetch functions (replace with real API calls)
async function fetchInstructor(id: string) {
  // Replace with real API call
  return {
    id,
    user: {
      name: "Alex Johnson",
      profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      about:
        "Passionate full stack developer and educator with 10+ years of experience. I love building scalable web apps and helping others learn modern tech.",
    },
    expertise: ["React", "Node.js", "TypeScript", "GraphQL", "Docker", "AWS"],
    bio: "Alex is a senior instructor at Coursewave, specializing in full stack development and cloud architecture.",
  };
}

async function fetchInstructorCourses(id: string) {
  // Replace with real API call
  return [
    {
      id: "course1",
      title: "Mastering React & TypeScript",
      imageUrl:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
      averageRating: 4.8,
      students: 1200,
    },
    {
      id: "course2",
      title: "Node.js API Development Bootcamp",
      imageUrl:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
      averageRating: 4.7,
      students: 950,
    },
    {
      id: "course3",
      title: "GraphQL in Production",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      averageRating: 4.9,
      students: 800,
    },
    {
      id: "course4",
      title: "Docker & AWS for Developers",
      imageUrl:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      averageRating: 4.6,
      students: 670,
    },
  ];
}

const InstructorProfilePage = () => {
  const params = useParams();
  const instructorId = params?.id as string;

  const [instructor, setInstructor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [inst, crs] = await Promise.all([
        fetchInstructor(instructorId),
        fetchInstructorCourses(instructorId),
      ]);
      setInstructor(inst);
      setCourses(crs);
      setLoading(false);
    }
    if (instructorId) load();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400" />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Card className="p-8 bg-white/90 shadow-xl">
          <CardContent>
            <p className="text-lg font-semibold text-gray-700">
              Instructor not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700">
          <CardHeader className="flex flex-col items-center gap-4 pt-8 pb-4">
            <div className="relative h-32 w-32 rounded-full border-4 border-white/30 shadow-lg overflow-hidden">
              <Image
                src={
                  instructor.user?.profileImageUrl ||
                  "https://github.com/shadcn.png"
                }
                alt={instructor.user?.name || "Instructor"}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white text-center drop-shadow-lg">
              {instructor.user?.name}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {instructor.expertise?.slice(0, 4).map((tech: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 border-0 shadow text-blue-800 dark:text-blue-200 flex items-center gap-1"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mr-1" />
                  {tech}
                </Badge>
              ))}
              {instructor.expertise?.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow text-gray-700 dark:text-gray-200 flex items-center gap-1"
                >
                  +{instructor.expertise.length - 4} more
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white/90 mb-2 flex items-center gap-2">
                  <FaGraduationCap className="text-yellow-300" /> About
                </h2>
                <p className="text-white/80 text-base leading-relaxed">
                  {instructor.user?.about || instructor.bio || "No about available."}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 min-w-[180px]">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">
                    {courses.length}
                  </span>
                  <span className="text-sm text-white/80 flex items-center gap-1">
                    <FaBookOpen /> Courses Created
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">
                    {courses.reduce((acc, c) => acc + (c.students || 0), 0)}
                  </span>
                  <span className="text-sm text-white/80 flex items-center gap-1">
                    <FaUserGraduate /> Students Taught
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">
                    {(
                      courses.reduce((acc, c) => acc + (c.averageRating || 0), 0) /
                      (courses.length || 1)
                    ).toFixed(1)}
                  </span>
                  <span className="text-sm text-white/80 flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> Avg. Course Rating
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaBookOpen className="text-orange-300" /> More Courses by {instructor.user?.name}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 transition-transform group-hover:scale-[1.03]">
                  <div className="relative h-40 w-full">
                    <Image
                      src={
                        course.imageUrl ||
                        "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
                      }
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <FaStar className="text-yellow-400" />
                      <span>{course.averageRating}</span>
                      <span className="mx-2">·</span>
                      <FaUserGraduate className="text-emerald-300" />
                      <span>{course.students} students</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfilePage;
