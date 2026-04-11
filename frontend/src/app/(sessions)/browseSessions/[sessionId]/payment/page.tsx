"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Shield,
  Clock,
  Calendar,
  User,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/zustand/userStore";
import { sessionService } from "@/lib/api/services/sessionsService";
import type { Session } from "@/types/session";

type PaymentState = "loading" | "ready" | "processing" | "success" | "error" | "canceled";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user, isLoggedIn } = useUserStore();

  const [session, setSession] = useState<any>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>("loading");
  const [error, setError] = useState("");

  // Handle Stripe redirect return (success or canceled)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      // Fetch session data for the success screen
      sessionService.getSessionById(sessionId).then((res) => {
        if (res.success && res.data) setSession(res.data);
      });
      setPaymentState("success");
      return;
    }
    if (canceled === "true") {
      setPaymentState("canceled");
      return;
    }
  }, []);

  useEffect(() => {
    // Skip fetching if we already resolved from URL params
    if (paymentState === "success" || paymentState === "canceled") return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await sessionService.getSessionById(sessionId);
        if (res.success && res.data) {
          setSession(res.data);

          // If session is free, book directly
          if (res.data.isFree) {
            await handleFreeBooking();
            return;
          }

          setPaymentState("ready");
        } else {
          setError("Session not found.");
          setPaymentState("error");
        }
      } catch {
        setError("Failed to load session details.");
        setPaymentState("error");
      }
    };

    fetchSession();
  }, [sessionId, isLoggedIn]);

  const handleFreeBooking = async () => {
    setPaymentState("processing");
    try {
      const res = await sessionService.bookSession(sessionId);
      if (res.success) {
        setPaymentState("success");
      } else {
        setError(res.message || "Booking failed.");
        setPaymentState("error");
      }
    } catch {
      setError("Failed to complete booking.");
      setPaymentState("error");
    }
  };

  const handlePaidBooking = async () => {
    setPaymentState("processing");
    try {
      // Step 1: Create booking (payment pending)
      const bookRes = await sessionService.bookSession(sessionId);
      if (!bookRes.success) {
        setError(bookRes.message || "Booking failed.");
        setPaymentState("error");
        return;
      }

      // Step 2: Create Stripe checkout session and redirect
      const checkoutRes = await sessionService.createSessionCheckout(sessionId);
      if (checkoutRes.success && checkoutRes.data?.checkoutUrl) {
        window.location.href = checkoutRes.data.checkoutUrl;
        return;
      }

      setError(checkoutRes.message || "Failed to create checkout session.");
      setPaymentState("error");
    } catch {
      setError("Payment processing failed. Please try again.");
      setPaymentState("error");
    }
  };

  const formattedDate = session
    ? new Date(session.scheduledAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = session
    ? new Date(session.scheduledAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Loading
  if (paymentState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  // Success
  if (paymentState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You&apos;re all set for{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {session?.title}
              </span>
            </p>
            {session && (
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {formattedTime} ({session.duration} min)
                  </span>
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => router.push("/mySessions")}
              >
                My Sessions
              </Button>
              <Button
                onClick={() =>
                  router.push(`/browseSessions/${sessionId}/meet`)
                }
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Canceled
  if (paymentState === "canceled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-semibold">Payment Canceled</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment was canceled. No charges were made.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/browseSessions")}
              >
                Browse Sessions
              </Button>
              <Button
                onClick={() => router.push(`/browseSessions/${sessionId}/payment`)}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error
  if (paymentState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Something Went Wrong</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push(`/browseSessions/${sessionId}`)}
              >
                Back to Session
              </Button>
              <Button onClick={() => setPaymentState("ready")}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ready — payment form
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/browseSessions/${sessionId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Session
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Complete Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User info */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Booking as
                  </p>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                <Separator />

                {/* Payment notice */}
                <div className="space-y-4">
                  <h3 className="font-medium">Payment</h3>

                  {session?.isFree ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-700 dark:text-green-400 font-medium">
                        This is a free session — no payment required!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">
                            Credit / Debit Card
                          </span>
                          <Badge variant="secondary" className="ml-auto">
                            Stripe
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You&apos;ll be redirected to Stripe&apos;s secure
                          checkout to complete payment.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Lock className="h-4 w-4" />
                        <span>
                          Your payment is secured with 256-bit encryption
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Action button */}
                <Button
                  onClick={
                    session?.isFree ? handleFreeBooking : handlePaidBooking
                  }
                  disabled={paymentState === "processing"}
                  className="w-full py-6 text-lg font-semibold bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {paymentState === "processing" ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : session?.isFree ? (
                    "Book Free Session"
                  ) : (
                    `Pay $${session?.price} & Book`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order summary sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base">
                    {session?.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    with {session?.instructor?.user?.name}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {formattedTime} ({session?.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>
                      {session?.type === "ONE_TO_ONE"
                        ? "1-on-1 Session"
                        : "Group Session"}
                    </span>
                  </div>
                  {session?.instructor && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>
                        {session.instructor.expertise?.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {session?.isFree
                      ? "Free"
                      : `$${session?.price || 0}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2">
                  <Shield className="h-3 w-3" />
                  <span>30-day money-back guarantee</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
