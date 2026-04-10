"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthors } from "@/hooks/useAuthors";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import { Search, Loader2, BookOpen, GraduationCap, User } from "lucide-react";

const InstructorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: authors, isPending, isError } = useAuthors(searchQuery || undefined);

  return (
    <div className="min-h-screen bg-background pt-[80px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold text-foreground mb-3",
              dmSans.className
            )}
          >
            Our Instructors
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn from experienced instructors and authors across a wide range of topics.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-input"
          />
        </div>

        {/* Loading */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-primary mb-3" />
            <p className="text-muted-foreground">Loading instructors...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500">Failed to load instructors. Please try again later.</p>
          </div>
        )}

        {/* Grid */}
        {!isPending && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors && authors.length > 0 ? (
              authors.map((author) => (
                <Link key={author.id} href={`/instructors/${author.id}`}>
                  <Card className="border border-border hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      {author.profileImageUrl ? (
                        <Image
                          src={author.profileImageUrl}
                          alt={author.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <h3
                        className={cn(
                          "font-semibold text-foreground mb-1",
                          dmSans.className
                        )}
                      >
                        {author.name}
                      </h3>
                      {author.about && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {author.about}
                        </p>
                      )}
                      <div className="flex gap-2 flex-wrap justify-center">
                        {author.authoredBlogs && author.authoredBlogs.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {author.authoredBlogs.length} articles
                          </Badge>
                        )}
                        {author.instructorProfile?.courses && author.instructorProfile.courses.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {author.instructorProfile.courses.length} courses
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? "No instructors found matching your search." : "No instructors available yet."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorsPage;
