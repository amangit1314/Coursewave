"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Mail,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  Eye,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";

interface Student {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  enrolledAt: string;
  lastActive: string;
  progress: number;
  status: "active" | "inactive" | "completed";
  courses: {
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
  }[];
  totalCourses: number;
  completedCourses: number;
  totalTimeSpent: number; // in minutes
  averageRating?: number;
}

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  progress: number;
  lastAccessed: string;
  isCompleted: boolean;
}

function Students() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const mockStudents: Student[] = [
    {
      id: "student_1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      profileImageUrl: "/assets/images/avatars/avatar-01.jpg",
      enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
      progress: 85,
      status: "active",
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
          lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalCourses: 2,
      completedCourses: 1,
      totalTimeSpent: 2450,
      averageRating: 4.8,
    },
    {
      id: "student_2",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      profileImageUrl: "/assets/images/avatars/avatar-02.jpg",
      enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 45,
      status: "active",
      courses: [
        {
          id: "course_1",
          title: "React Masterclass",
          progress: 45,
          lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalCourses: 1,
      completedCourses: 0,
      totalTimeSpent: 890,
      averageRating: 4.5,
    },
    {
      id: "student_3",
      name: "Carol Davis",
      email: "carol.davis@example.com",
      profileImageUrl: "/assets/images/avatars/avatar-03.jpg",
      enrolledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 100,
      status: "completed",
      courses: [
        {
          id: "course_1",
          title: "React Masterclass",
          progress: 100,
          lastAccessed: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "course_3",
          title: "Next.js Advanced",
          progress: 100,
          lastAccessed: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalCourses: 2,
      completedCourses: 2,
      totalTimeSpent: 3670,
      averageRating: 5.0,
    },
    {
      id: "student_4",
      name: "David Wilson",
      email: "david.wilson@example.com",
      profileImageUrl: "/assets/images/avatars/avatar-04.jpg",
      enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 20,
      status: "active",
      courses: [
        {
          id: "course_2",
          title: "TypeScript Fundamentals",
          progress: 20,
          lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalCourses: 1,
      completedCourses: 0,
      totalTimeSpent: 320,
    },
    {
      id: "student_5",
      name: "Eva Brown",
      email: "eva.brown@example.com",
      profileImageUrl: "/assets/images/avatars/avatar-05.jpg",
      enrolledAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 60,
      status: "inactive",
      courses: [
        {
          id: "course_1",
          title: "React Masterclass",
          progress: 60,
          lastAccessed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalCourses: 1,
      completedCourses: 0,
      totalTimeSpent: 1560,
      averageRating: 4.2,
    },
    {
      id: "student_6",
      name: "Frank Miller",
      email: "frank.miller@example.com",
      profileImageUrl: "/assets/images/avatars/avatar-06.jpg",
      enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
      progress: 92,
      status: "active",
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
          lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "course_3",
          title: "Next.js Advanced",
          progress: 95,
          lastAccessed: new Date().toISOString(),
        },
      ],
      totalCourses: 3,
      completedCourses: 2,
      totalTimeSpent: 4230,
      averageRating: 4.9,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/instructor/students');
        // const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1200));
        setStudents(mockStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredAndSortedStudents = students
    .filter(student => {
      // Search filter
      if (searchQuery && 
          !student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !student.email.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filter === "active" && student.status !== "active") return false;
      if (filter === "inactive" && student.status !== "inactive") return false;
      if (filter === "completed" && student.status !== "completed") return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      } else if (sortBy === "progress") {
        return b.progress - a.progress;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "enrollment") {
        return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
      } else if (sortBy === "courses") {
        return b.totalCourses - a.totalCourses;
      }
      return 0;
    });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "active").length,
    inactive: students.filter(s => s.status === "inactive").length,
    completed: students.filter(s => s.status === "completed").length,
    totalCourses: students.reduce((sum, s) => sum + s.totalCourses, 0),
    completedCourses: students.reduce((sum, s) => sum + s.completedCourses, 0),
    averageProgress: students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length) : 0,
  };

  const StudentSkeleton = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getTimeAgo = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return '1 day ago';
    } else if (days < 30) {
      return `${days} days ago`;
    } else {
      const months = Math.floor(days / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
  };

  const formatTimeSpent = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days}d`;
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Students
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Manage and track your students' progress and engagement
              </p>
            </div>
            <Button
              onClick={() => router.push("/instructor/students/invite")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="h-4 w-4" />
              Invite Students
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Total Students
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.total}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Active
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.active}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Inactive
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.inactive}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Avg Progress
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.averageProgress}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Total Courses
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Completed
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.completedCourses}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-zinc-500" />
              <Input
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={filter === "all" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "all" && "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                )}
                onClick={() => setFilter("all")}
              >
                All
              </Badge>
              <Badge
                variant={filter === "active" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "active" && "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300"
                )}
                onClick={() => setFilter("active")}
              >
                Active
              </Badge>
              <Badge
                variant={filter === "inactive" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "inactive" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                )}
                onClick={() => setFilter("inactive")}
              >
                Inactive
              </Badge>
              <Badge
                variant={filter === "completed" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "completed" && "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
                )}
                onClick={() => setFilter("completed")}
              >
                Completed
              </Badge>
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Active</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="enrollment">Enrollment Date</SelectItem>
              <SelectItem value="courses">Course Count</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <StudentSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedStudents.map((student) => (
              <Card key={student.id} className="overflow-hidden transition-all hover:shadow-lg dark:border-zinc-700">
                <CardContent className="p-6">
                  {/* Student Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.profileImageUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-zinc-900 dark:text-white">
                          {student.name}
                        </h3>
                        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Overall Progress</span>
                      <span className="font-medium text-zinc-900 dark:text-white">{student.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          student.progress >= 80 ? "bg-green-500" :
                          student.progress >= 50 ? "bg-blue-500" :
                          student.progress >= 25 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Student Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {student.totalCourses}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Courses</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {student.completedCourses}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Completed</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {formatTimeSpent(student.totalTimeSpent)}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Time Spent</p>
                    </div>
                  </div>

                  {/* Course Progress */}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Current Courses</p>
                    {student.courses.slice(0, 2).map((course) => (
                      <div key={course.id} className="flex items-center justify-between text-sm">
                        <span className="truncate text-zinc-600 dark:text-zinc-400 flex-1 mr-2">
                          {course.title}
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-white whitespace-nowrap">
                          {course.progress}%
                        </span>
                      </div>
                    ))}
                    {student.courses.length > 2 && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        +{student.courses.length - 2} more courses
                      </p>
                    )}
                  </div>

                  {/* Last Active & Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      <span>Active {getTimeAgo(student.lastActive)}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/instructor/students/${student.id}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/instructor/students/${student.id}/progress`)}
                          className="cursor-pointer"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Progress Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => router.push(`/instructor/messages?student=${student.id}`)}
                          className="cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => router.push(`mailto:${student.email}`)}
                          className="cursor-pointer"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-16 w-16 text-zinc-400 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                No students found
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
                {searchQuery || filter !== "all" 
                  ? "No students match your search criteria. Try adjusting your filters or search terms."
                  : "You don't have any students yet. Start promoting your courses to get students!"}
              </p>
              {(!searchQuery && filter === "all") && (
                <Button
                  onClick={() => router.push("/instructor/courses")}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Promote Your Courses
                </Button>
              )}
              {(searchQuery || filter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        {!isLoading && filteredAndSortedStudents.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {filteredAndSortedStudents.length} of {students.length} students
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;