import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Video, MapPin, Star, BookOpen, DollarSign, User, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const staticSession = {
  id: '1',
  title: 'Advanced React Patterns and Performance Optimization',
  description: 'Learn advanced React patterns, performance optimization techniques, and best practices for building scalable applications. This comprehensive session will cover everything from React hooks to advanced state management patterns.',
  status: 'UPCOMING',
  isFree: false,
  price: 75,
  currency: 'USD',
  type: 'ONE_TO_ONE',
  startTime: '2024-03-25T14:00:00Z',
  duration: 60,
  maxAttendees: 1,
  currentAttendees: 1,
  instructor: {
    user: {
      name: 'Sarah Johnson',
      profileImageUrl: '/assets/images/user/user-01.png',
      email: 'sarah.johnson@example.com',
    },
    bio: 'Senior React Developer with 8+ years of experience building scalable applications. Former tech lead at Google and Facebook.',
    expertise: ['React', 'TypeScript', 'Performance Optimization', 'State Management'],
    rating: 4.9,
    totalSessions: 156,
  },
  topics: [
    'React Hooks Deep Dive',
    'Performance Optimization',
    'Code Splitting',
    'Memoization Techniques',
    'State Management Patterns',
    'Testing Best Practices'
  ],
  requirements: [
    'Basic React knowledge',
    'JavaScript fundamentals',
    'Understanding of ES6+ features'
  ],
  whatYouWillLearn: [
    'Advanced React patterns and techniques',
    'Performance optimization strategies',
    'Best practices for scalable applications',
    'Real-world problem-solving approaches'
  ]
};

export default function SessionDetailPage() {
  const formattedDate = new Date(staticSession.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formattedTime = new Date(staticSession.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{staticSession.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Hosted by {staticSession.instructor.user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Session Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {staticSession.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formattedTime} ({staticSession.duration} min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{staticSession.type === 'ONE_TO_ONE' ? '1-on-1 Session' : `${staticSession.currentAttendees}/${staticSession.maxAttendees} participants`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Online Meeting</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {staticSession.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Session Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Session Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {staticSession.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {staticSession.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${staticSession.price}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {staticSession.isFree ? 'Free Session' : 'per session'}
                  </div>
                </div>
                
                <Link href={`/sessions/browseSessions/${staticSession.id}/meet`} passHref legacyBehavior>
                  <a className="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md font-medium transition-colors">
                    <Video className="h-4 w-4 mr-2" />
                    Join Event
                  </a>
                </Link>
                
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {staticSession.currentAttendees} of {staticSession.maxAttendees} spots filled
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Instructor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {staticSession.instructor.user.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {staticSession.instructor.rating} ({staticSession.instructor.totalSessions} sessions)
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {staticSession.instructor.bio}
                </p>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-1">
                    {staticSession.instructor.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}