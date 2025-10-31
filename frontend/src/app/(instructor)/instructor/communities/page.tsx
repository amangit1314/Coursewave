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
  MessageSquare,
  TrendingUp,
  Star,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  Eye,
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
import { cn } from "@/lib/utils/utils";

interface Community {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  category: string;
  isPublic: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isPopular: boolean;
  avatarUrls: string[];
  thumbnailUrl?: string;
  bannerUrl?: string;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    messages: number;
  };
  role: "ADMIN" | "MODERATOR";
}

function Communities() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const mockCommunities: Community[] = [
    {
      id: "comm_1",
      title: "React Developers Community",
      description: "A community for React developers to share knowledge, ask questions, and collaborate on projects.",
      slug: "react-developers",
      tags: ["react", "javascript", "frontend"],
      category: "Programming",
      isPublic: true,
      isFeatured: true,
      isTrending: true,
      isPopular: true,
      avatarUrls: ["/assets/images/community/react-community.jpg"],
      thumbnailUrl: "/assets/images/community/react-banner.jpg",
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        members: 1247,
        messages: 5432,
      },
      role: "ADMIN",
    },
    {
      id: "comm_2",
      title: "Full-Stack JavaScript",
      description: "Discuss full-stack development with JavaScript, Node.js, and modern frameworks.",
      slug: "fullstack-js",
      tags: ["javascript", "nodejs", "fullstack"],
      category: "Programming",
      isPublic: true,
      isFeatured: false,
      isTrending: true,
      isPopular: false,
      avatarUrls: ["/assets/images/community/js-community.jpg"],
      lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        members: 892,
        messages: 3210,
      },
      role: "MODERATOR",
    },
    {
      id: "comm_3",
      title: "UI/UX Designers Hub",
      description: "For designers to share inspiration, tools, and best practices in UI/UX design.",
      slug: "ui-ux-designers",
      tags: ["design", "ui", "ux", "figma"],
      category: "Design",
      isPublic: true,
      isFeatured: true,
      isTrending: false,
      isPopular: true,
      avatarUrls: ["/assets/images/community/design-community.jpg"],
      lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        members: 1563,
        messages: 6789,
      },
      role: "ADMIN",
    },
    {
      id: "comm_4",
      title: "Python Data Science",
      description: "Community for data scientists and Python enthusiasts working with data analysis and ML.",
      slug: "python-data-science",
      tags: ["python", "datascience", "machinelearning"],
      category: "Data Science",
      isPublic: true,
      isFeatured: false,
      isTrending: false,
      isPopular: false,
      avatarUrls: ["/assets/images/community/python-community.jpg"],
      lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        members: 734,
        messages: 2890,
      },
      role: "MODERATOR",
    },
    {
      id: "comm_5",
      title: "Mobile App Development",
      description: "iOS and Android development discussions, tutorials, and project sharing.",
      slug: "mobile-dev",
      tags: ["react-native", "flutter", "ios", "android"],
      category: "Mobile",
      isPublic: true,
      isFeatured: false,
      isTrending: true,
      isPopular: false,
      avatarUrls: ["/assets/images/community/mobile-community.jpg"],
      lastActiveAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        members: 645,
        messages: 1987,
      },
      role: "ADMIN",
    },
    {
      id: "comm_6",
      title: "DevOps & Cloud Computing",
      description: "Infrastructure, deployment, cloud services, and DevOps best practices.",
      slug: "devops-cloud",
      tags: ["aws", "docker", "kubernetes", "ci-cd"],
      category: "DevOps",
      isPublic: true,
      isFeatured: true,
      isTrending: false,
      isPopular: true,
      avatarUrls: ["/assets/images/community/devops-community.jpg"],
      lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      _count: {
        members: 987,
        messages: 4321,
      },
      role: "MODERATOR",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/instructor/communities');
        // const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCommunities(mockCommunities);
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const filteredAndSortedCommunities = communities
    .filter(community => {
      // Search filter
      if (searchQuery && 
          !community.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !community.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Status filter
      if (filter === "featured" && !community.isFeatured) return false;
      if (filter === "trending" && !community.isTrending) return false;
      if (filter === "popular" && !community.isPopular) return false;
      if (filter === "admin" && community.role !== "ADMIN") return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
      } else if (sortBy === "members") {
        return b._count.members - a._count.members;
      } else if (sortBy === "activity") {
        return b._count.messages - a._count.messages;
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  const stats = {
    total: communities.length,
    admin: communities.filter(c => c.role === "ADMIN").length,
    moderator: communities.filter(c => c.role === "MODERATOR").length,
    featured: communities.filter(c => c.isFeatured).length,
    trending: communities.filter(c => c.isTrending).length,
    popular: communities.filter(c => c.isPopular).length,
    totalMembers: communities.reduce((sum, c) => sum + c._count.members, 0),
    totalMessages: communities.reduce((sum, c) => sum + c._count.messages, 0),
  };

  const CommunitySkeleton = () => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
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
    } else {
      return `${days} days ago`;
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
                Communities
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Manage and moderate your communities
              </p>
            </div>
            <Button
              onClick={() => router.push("/instructor/communities/create")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Create Community
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Total
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
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Admin
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.admin}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Moderator
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.moderator}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Featured
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stats.featured}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Members
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {formatNumber(stats.totalMembers)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Messages
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {formatNumber(stats.totalMessages)}
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
                placeholder="Search communities by name, description, or tags..."
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
                variant={filter === "featured" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "featured" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                )}
                onClick={() => setFilter("featured")}
              >
                Featured
              </Badge>
              <Badge
                variant={filter === "trending" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "trending" && "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300"
                )}
                onClick={() => setFilter("trending")}
              >
                Trending
              </Badge>
              <Badge
                variant={filter === "popular" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "popular" && "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
                )}
                onClick={() => setFilter("popular")}
              >
                Popular
              </Badge>
              <Badge
                variant={filter === "admin" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  filter === "admin" && "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
                )}
                onClick={() => setFilter("admin")}
              >
                Admin Only
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
              <SelectItem value="members">Most Members</SelectItem>
              <SelectItem value="activity">Most Active</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Communities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <CommunitySkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedCommunities.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedCommunities.map((community) => (
              <Card key={community.id} className="overflow-hidden transition-all hover:shadow-lg dark:border-zinc-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-zinc-900 dark:text-white">
                        {community.title}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge
                          variant={community.role === "ADMIN" ? "default" : "secondary"}
                          className={cn(
                            "text-xs font-medium",
                            community.role === "ADMIN" 
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          )}
                        >
                          {community.role}
                        </Badge>
                        {community.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                            Featured
                          </Badge>
                        )}
                        {community.isTrending && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Community Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/communities/${community.slug}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Community
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/instructor/communities/${community.id}/manage`)}
                          className="cursor-pointer"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Manage Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => router.push(`/instructor/communities/${community.id}/analytics`)}
                          className="cursor-pointer"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/instructor/communities/${community.id}/moderation`)}
                          className="cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Moderation Tools
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {community.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {community.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs font-normal">
                        #{tag}
                      </Badge>
                    ))}
                    {community.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{community.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{formatNumber(community._count.members)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{formatNumber(community._count.messages)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">{getTimeAgo(community.lastActiveAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push(`/communities/${community.slug}`)}
                    >
                      Visit Community
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/instructor/communities/${community.id}/manage`)}
                    >
                      Manage
                    </Button>
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
                No communities found
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
                {searchQuery || filter !== "all" 
                  ? "No communities match your search criteria. Try adjusting your filters or search terms."
                  : "You haven't created or joined any communities yet. Start building your community today!"}
              </p>
              {(!searchQuery && filter === "all") && (
                <Button
                  onClick={() => router.push("/instructor/communities/create")}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Community
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
        {!isLoading && filteredAndSortedCommunities.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {filteredAndSortedCommunities.length} of {communities.length} communities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Communities;