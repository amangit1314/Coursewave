"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/zustand/userStore";
import { sessionService } from "@/lib/api/services/sessionsService";
import type { Session } from "@/types/session";

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { isLoggedIn } = useUserStore();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await sessionService.getSessionById(sessionId);
        if (res.success && res.data) {
          setSession(res.data);

          // If session has a scheduled time, pre-select it
          if (res.data.scheduledAt) {
            const scheduled = new Date(res.data.scheduledAt);
            setSelectedDate(scheduled);
            setCurrentMonth(
              new Date(scheduled.getFullYear(), scheduled.getMonth(), 1)
            );
            setSelectedTime(
              scheduled.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            );
          }
        } else {
          setError("Session not found.");
        }
      } catch {
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, isLoggedIn]);

  // Calendar logic
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Array<{
      date: Date;
      inMonth: boolean;
      isPast: boolean;
      isToday: boolean;
    }> = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        inMonth: false,
        isPast: true,
        isToday: false,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        inMonth: true,
        isPast: date < today,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        inMonth: false,
        isPast: false,
        isToday: false,
      });
    }

    return days;
  }, [currentMonth]);

  const isDateSelected = (date: Date) =>
    selectedDate?.toDateString() === date.toDateString();

  const handleConfirmSchedule = async () => {
    if (!selectedDate || !selectedTime) return;

    setConfirming(true);
    try {
      // Combine selected date and time into an ISO string
      const scheduledAt = new Date(
        `${selectedDate.toDateString()} ${selectedTime}`
      ).toISOString();

      // Book the session with the selected schedule
      const res = await sessionService.bookSession(sessionId, { scheduledAt });
      if (res.success) {
        setConfirmed(true);
      } else {
        setError(res.message || "Failed to book session.");
      }
    } catch {
      setError("Failed to confirm booking.");
    } finally {
      setConfirming(false);
    }
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error
  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button onClick={() => router.push("/browseSessions")}>
              Browse Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confirmed
  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Session Scheduled!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your session has been booked for{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>{" "}
              at{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedTime}
              </span>
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => router.push("/mySessions")}
              >
                View Upcoming
              </Button>
              {!session?.isFree && (
                <Button
                  onClick={() =>
                    router.push(`/browseSessions/${sessionId}/payment`)
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  Proceed to Payment
                </Button>
              )}
              {session?.isFree && (
                <Button
                  onClick={() =>
                    router.push(`/browseSessions/${sessionId}/meet`)
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Meeting
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/browseSessions/${sessionId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Session
        </Button>

        <h1 className="text-2xl font-bold mb-6">Schedule Your Session</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar + Time slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[140px] text-center">
                      {monthLabel}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    const selected = isDateSelected(day.date);
                    const disabled = day.isPast || !day.inMonth;

                    return (
                      <button
                        key={i}
                        onClick={() => !disabled && setSelectedDate(day.date)}
                        disabled={disabled}
                        className={`
                          p-2 rounded-lg text-sm transition-all relative
                          ${disabled ? "text-gray-300 dark:text-zinc-600 cursor-not-allowed" : "hover:bg-blue-50 dark:hover:bg-zinc-700 cursor-pointer"}
                          ${selected ? "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 font-semibold" : ""}
                          ${day.isToday && !selected ? "ring-2 ring-blue-500 font-semibold" : ""}
                          ${!day.inMonth ? "opacity-30" : ""}
                        `}
                      >
                        {day.date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all border
                            ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-zinc-800"
                            }
                          `}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Session Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{session?.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    with {session?.instructor?.user?.name}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>
                      {session?.type === "ONE_TO_ONE"
                        ? "1-on-1 Session"
                        : "Group Session"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{session?.duration} minutes</span>
                  </div>
                  {session?.instructor?.expertise && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>
                        {session.instructor.expertise.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Selected date/time */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Selection</p>
                  {selectedDate ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                        <Calendar className="h-4 w-4" />
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {selectedTime && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                          <Clock className="h-4 w-4" />
                          {selectedTime}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Pick a date from the calendar
                    </p>
                  )}
                </div>

                <Separator />

                {/* Price */}
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Price</span>
                  <span>
                    {session?.isFree ? (
                      <Badge className="bg-green-600">Free</Badge>
                    ) : (
                      `$${session?.price || 0}`
                    )}
                  </span>
                </div>

                {/* Confirm */}
                <Button
                  onClick={handleConfirmSchedule}
                  disabled={
                    !selectedDate || !selectedTime || confirming
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Schedule"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
