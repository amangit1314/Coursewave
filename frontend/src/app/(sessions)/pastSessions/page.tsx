"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Star, MessageSquare, Download, Filter, Search, CheckCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const PastSessionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const pastSessions = [
    {
      id: '1',
      title: 'JavaScript Fundamentals Deep Dive',
      instructor: {
        name: 'David Wilson',
        image: '/assets/images/user/user-04.png',
        rating: 4.6
      },
      scheduledAt: '2024-03-20T15:00:00Z',
      completedAt: '2024-03-20T16:00:00Z',
      duration: 60,
      type: 'one-on-one',
      status: 'completed',
      price: 65,
      currency: 'USD',
      rating: 5,
      feedback: 'Excellent session! David explained complex concepts clearly and provided practical examples that helped me understand JavaScript fundamentals much better.',
      topics: ['Variables', 'Functions', 'Objects', 'Arrays'],
      notes: 'Learned about ES6 features and modern JavaScript practices. Great practical examples with real-world applications.',
      recordingUrl: 'https://example.com/recording-1',
      materials: ['JavaScript Cheat Sheet', 'Practice Exercises', 'Additional Resources']
    },
    {
      id: '2',
      title: 'React Hooks Masterclass',
      instructor: {
        name: 'Sarah Johnson',
        image: '/assets/images/user/user-01.png',
        rating: 4.9
      },
      scheduledAt: '2024-03-18T14:00:00Z',
      completedAt: '2024-03-18T15:30:00Z',
      duration: 90,
      type: 'group',
      status: 'completed',
      price: 45,
      currency: 'USD',
      rating: 4,
      feedback: 'Very informative session on React Hooks. Sarah covered everything from basic useState to custom hooks. The group format allowed for great discussions.',
      topics: ['useState', 'useEffect', 'useContext', 'Custom Hooks'],
      notes: 'Key takeaway: Custom hooks are powerful for code reuse. Need to practice more with useContext.',
      recordingUrl: 'https://example.com/recording-2',
      materials: ['Hooks Reference', 'Code Examples', 'Best Practices Guide']
    },
    {
      id: '3',
      title: 'UI/UX Design Principles',
      instructor: {
        name: 'Emily Rodriguez',
        image: '/assets/images/user/user-03.png',
        rating: 4.7
      },
      scheduledAt: '2024-03-15T10:00:00Z',
      completedAt: '2024-03-15T11:00:00Z',
      duration: 60,
      type: 'one-on-one',
      status: 'completed',
      price: 55,
      currency: 'USD',
      rating: 5,
      feedback: 'Emily is an amazing instructor! She helped me understand the fundamentals of good design and provided actionable feedback on my portfolio.',
      topics: ['Design Principles', 'User Research', 'Wireframing', 'Prototyping'],
      notes: 'Focus on user-centered design. Importance of accessibility and responsive design.',
      recordingUrl: 'https://example.com/recording-3',
      materials: ['Design System Template', 'User Research Methods', 'Prototyping Tools Guide']
    },
    {
      id: '4',
      title: 'System Design Interview Prep',
      instructor: {
        name: 'Michael Chen',
        image: '/assets/images/user/user-02.png',
        rating: 4.8
      },
      scheduledAt: '2024-03-12T16:00:00Z',
      completedAt: '2024-03-12T17:30:00Z',
      duration: 90,
      type: 'one-on-one',
      status: 'completed',
      price: 75,
      currency: 'USD',
      rating: 4,
      feedback: 'Great preparation for system design interviews. Michael provided a structured approach and helped me think through scalability challenges.',
      topics: ['Scalability', 'Database Design', 'Load Balancing', 'Caching'],
      notes: 'Remember the 4S approach: Scale, Storage, Speed, Security. Practice more with real-world scenarios.',
      recordingUrl: 'https://example.com/recording-4',
      materials: ['System Design Framework', 'Case Studies', 'Interview Questions']
    }
  ];

  const filters = [
    { value: "all", label: "All Sessions" },
    { value: "one-on-one", label: "One-on-One" },
    { value: "group", label: "Group Sessions" },
    { value: "5-star", label: "5 Star Ratings" },
    { value: "recent", label: "Recent (Last 30 days)" }
  ];

  const filteredSessions = pastSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" ||
                         (selectedFilter === "one-on-one" && session.type === "one-on-one") ||
                         (selectedFilter === "group" && session.type === "group") ||
                         (selectedFilter === "5-star" && session.rating === 5) ||
                         (selectedFilter === "recent" && new Date(session.completedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const stats = {
    totalSessions: pastSessions.length,
    averageRating: (pastSessions.reduce((sum, session) => sum + session.rating, 0) / pastSessions.length).toFixed(1),
    totalHours: pastSessions.reduce((sum, session) => sum + session.duration, 0) / 60,
    oneOnOneSessions: pastSessions.filter(s => s.type === 'one-on-one').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Session History
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Review your completed sessions, access recordings, and track your learning progress.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSessions}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.averageRating}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalHours}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hours Learned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.oneOnOneSessions}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">1-on-1 Sessions</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-700 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search sessions or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-zinc-900 dark:text-white"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[200px] border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900">
                <SelectValue placeholder="Filter sessions" />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Sessions List */}
        <div className="space-y-6">
          {filteredSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Sessions Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery || selectedFilter !== "all" 
                      ? "Try adjusting your search or filter criteria."
                      : "Complete your first session to see it here."
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredSessions.map((session, index) => {
              const formattedDate = formatSessionDate(session.scheduledAt);
              const timeAgo = getTimeAgo(session.completedAt);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Session Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {session.type === 'one-on-one' ? '1-on-1' : 'Group'}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {timeAgo}
                                </span>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {session.title}
                              </h3>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {session.instructor.name}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {session.instructor.rating}
                                    </span>
                                    <span className="text-sm">⭐</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                ${session.price}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {session.duration} min
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{formattedDate.date} at {formattedDate.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Star className="h-4 w-4" />
                              <span>Your rating: {session.rating}/5</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-gray-600 dark:text-gray-400">
                              {session.feedback}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {session.topics?.map((topic) => (
                                <Badge key={topic} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:w-48 space-y-3">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Book Again
                          </Button>
                          
                          {session.recordingUrl && (
                            <Button variant="outline" className="w-full">
                              <Download className="h-4 w-4 mr-2" />
                              View Recording
                            </Button>
                          )}
                          
                          {session.materials && session.materials.length > 0 && (
                            <Button variant="outline" className="w-full">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Materials ({session.materials.length})
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PastSessionsPage;