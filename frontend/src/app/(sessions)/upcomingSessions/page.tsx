"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Video, Play, AlertCircle, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const UpcomingSessionsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingSessions = [
    {
      id: '1',
      title: 'Advanced React Patterns and Performance Optimization',
      instructor: {
        name: 'Sarah Johnson',
        image: '/assets/images/user/user-01.png',
        rating: 4.9
      },
      scheduledAt: '2024-03-25T14:00:00Z',
      duration: 60,
      type: 'one-on-one',
      status: 'confirmed',
      price: 75,
      currency: 'USD',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      description: 'Learn advanced React patterns, performance optimization techniques, and best practices for building scalable applications.',
      topics: ['React Hooks', 'Performance', 'Code Splitting', 'Memoization']
    },
    {
      id: '2',
      title: 'System Design Interview Preparation',
      instructor: {
        name: 'Michael Chen',
        image: '/assets/images/user/user-02.png',
        rating: 4.8
      },
      scheduledAt: '2024-03-26T10:00:00Z',
      duration: 90,
      type: 'group',
      status: 'confirmed',
      price: 45,
      currency: 'USD',
      participants: 8,
      maxParticipants: 12,
      description: 'Master system design concepts and prepare for technical interviews with hands-on practice.',
      topics: ['Scalability', 'Database Design', 'Load Balancing', 'Caching']
    },
    {
      id: '3',
      title: 'UI/UX Design Principles Workshop',
      instructor: {
        name: 'Emily Rodriguez',
        image: '/assets/images/user/user-03.png',
        rating: 4.7
      },
      scheduledAt: '2024-03-27T16:00:00Z',
      duration: 120,
      type: 'one-on-one',
      status: 'pending',
      price: 55,
      currency: 'USD',
      description: 'Explore fundamental UI/UX design principles and create user-centered interfaces.',
      topics: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing']
    }
  ];

  const pastSessions = [
    {
      id: '4',
      title: 'JavaScript Fundamentals Deep Dive',
      instructor: {
        name: 'David Wilson',
        image: '/assets/images/user/user-04.png',
        rating: 4.6
      },
      scheduledAt: '2024-03-20T15:00:00Z',
      duration: 60,
      type: 'one-on-one',
      status: 'completed',
      price: 65,
      currency: 'USD',
      rating: 5,
      feedback: 'Excellent session! David explained complex concepts clearly and provided practical examples.'
    }
  ];

  const getTimeUntilSession = (scheduledAt: string) => {
    const now = new Date();
    const sessionTime = new Date(scheduledAt);
    const diff = sessionTime.getTime() - now.getTime();
    
    if (diff <= 0) return { status: 'live', text: 'Live Now' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return { status: 'upcoming', text: `${days}d ${hours}h` };
    if (hours > 0) return { status: 'soon', text: `${hours}h ${minutes}m` };
    return { status: 'starting', text: `${minutes}m` };
  };

  const getStatusBadge = (status: string, timeInfo?: any) => {
    switch (status) {
      case 'confirmed':
        return timeInfo?.status === 'live' ? (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          </Badge>
        ) : timeInfo?.status === 'soon' ? (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
            Starting Soon
          </Badge>
        ) : (
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
            Confirmed
          </Badge>
        );
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-0">Completed</Badge>;
      default:
        return null;
    }
  };

  const formatSessionDate = (scheduledAt: string) => {
    const date = new Date(scheduledAt);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
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
            Your Sessions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your upcoming sessions, join live meetings, and review past sessions.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-zinc-800 p-1 rounded-xl">
            <TabsTrigger value="upcoming" className="rounded-lg">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Past ({pastSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Upcoming Sessions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You don't have any scheduled sessions yet.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Video className="h-4 w-4 mr-2" />
                    Book a Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingSessions.map((session, index) => {
                  const timeInfo = getTimeUntilSession(session.scheduledAt);
                  const formattedDate = formatSessionDate(session.scheduledAt);
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(session.status, timeInfo)}
                                <Badge variant="outline" className="text-xs">
                                  {session.type === 'one-on-one' ? '1-on-1' : 'Group'}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg line-clamp-2 mb-2">
                                {session.title}
                              </CardTitle>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {session.instructor.name}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {session.instructor.rating}
                                    </span>
                                    <span className="text-xs">⭐</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{formattedDate.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{formattedDate.time} ({session.duration} minutes)</span>
                            </div>
                            {session.type === 'group' && session.participants && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>{session.participants}/{session.maxParticipants} participants</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {session.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {session.topics?.slice(0, 3).map((topic) => (
                                <Badge key={topic} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {session.topics && session.topics.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{session.topics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            {timeInfo?.status === 'live' ? (
                              <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                <Play className="h-4 w-4 mr-2" />
                                Join Now
                              </Button>
                            ) : (
                              <Button variant="outline" className="flex-1">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            )}
                            <Button variant="outline" size="icon">
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Past Sessions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your completed sessions will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastSessions.map((session, index) => {
                  const formattedDate = formatSessionDate(session.scheduledAt);
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(session.status)}
                                <Badge variant="outline" className="text-xs">
                                  {session.type === 'one-on-one' ? '1-on-1' : 'Group'}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg line-clamp-2 mb-2">
                                {session.title}
                              </CardTitle>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {session.instructor.name}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {session.instructor.rating}
                                    </span>
                                    <span className="text-xs">⭐</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{formattedDate.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{formattedDate.time} ({session.duration} minutes)</span>
                            </div>
                            {session.rating && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Your rating:</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">
                                      {i < session.rating ? '★' : '☆'}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {session.feedback && (
                            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "{session.feedback}"
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" className="flex-1">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Book Again
                            </Button>
                            <Button variant="outline" size="icon">
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UpcomingSessionsPage;