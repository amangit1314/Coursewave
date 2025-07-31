"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Star, MapPin, DollarSign, MessageSquare, Video } from "lucide-react";
import { motion } from "framer-motion";

const BookSessionPage = () => {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'one-on-one' | 'group'>('one-on-one');
  const [sessionDuration, setSessionDuration] = useState<number>(60);

  const mentors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior React Developer',
      company: 'TechCorp',
      rating: 4.9,
      sessions: 150,
      price: 75,
      image: '/assets/images/user/user-01.png',
      skills: ['React', 'TypeScript', 'Node.js'],
      availability: ['Mon', 'Wed', 'Fri']
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      rating: 4.8,
      sessions: 89,
      price: 65,
      image: '/assets/images/user/user-02.png',
      skills: ['Python', 'Django', 'AWS'],
      availability: ['Tue', 'Thu', 'Sat']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      rating: 4.7,
      sessions: 203,
      price: 55,
      image: '/assets/images/user/user-03.png',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      availability: ['Mon', 'Tue', 'Wed', 'Thu']
    }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes', price: 0.5 },
    { value: 60, label: '1 hour', price: 1 },
    { value: 90, label: '1.5 hours', price: 1.5 },
    { value: 120, label: '2 hours', price: 2 }
  ];

  const selectedMentorData = mentors.find(m => m.id === selectedMentor);
  const totalPrice = selectedMentorData ? selectedMentorData.price * durationOptions.find(d => d.value === sessionDuration)?.price! : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your Session
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with expert mentors and accelerate your learning journey with personalized guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mentor Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Choose Your Mentor
                </CardTitle>
                <CardDescription>
                  Select from our verified expert mentors based on your learning goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentors.map((mentor) => (
                  <motion.div
                    key={mentor.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedMentor === mentor.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedMentor(mentor.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {mentor.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{mentor.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {mentor.title} at {mentor.company}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <span>{mentor.sessions} sessions</span>
                              <span>•</span>
                              <span>${mentor.price}/hour</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {mentor.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Session Configuration */}
            {selectedMentor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Session Details
                    </CardTitle>
                    <CardDescription>
                      Configure your session preferences and schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Session Type */}
                    <div>
                      <Label className="text-sm font-medium">Session Type</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          variant={sessionType === 'one-on-one' ? 'default' : 'outline'}
                          onClick={() => setSessionType('one-on-one')}
                          className="flex-1"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          One-on-One
                        </Button>
                        <Button
                          variant={sessionType === 'group' ? 'default' : 'outline'}
                          onClick={() => setSessionType('group')}
                          className="flex-1"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Group Session
                        </Button>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <Label className="text-sm font-medium">Session Duration</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {durationOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={sessionDuration === option.value ? 'default' : 'outline'}
                            onClick={() => setSessionDuration(option.value)}
                            className="justify-start"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                        <select
                          id="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Session Description */}
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        What would you like to discuss?
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your learning goals, specific topics you'd like to cover, or any questions you have..."
                        className="mt-2 min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Session Summary */}
            {selectedMentor && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Session Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedMentorData && (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedMentorData.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedMentorData.title}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Session Type:</span>
                            <span className="font-medium capitalize">{sessionType.replace('-', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                            <span className="font-medium">{sessionDuration} minutes</span>
                          </div>
                          {selectedDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Date:</span>
                              <span className="font-medium">{selectedDate}</span>
                            </div>
                          )}
                          {selectedTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Time:</span>
                              <span className="font-medium">{selectedTime}</span>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-blue-600 dark:text-blue-400">
                              ${totalPrice}
                            </span>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Book Session
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Why Book Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Book Sessions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Expert Guidance</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Learn from verified industry professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Interactive Learning</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Real-time Q&A and hands-on guidance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Flexible Scheduling</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Book sessions that fit your schedule
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSessionPage;