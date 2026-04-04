"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";

const confettiColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-400",
  "bg-pink-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-400",
];

function ConfettiPiece({
  color,
  delay,
  left,
  size,
}: {
  color: string;
  delay: number;
  left: number;
  size: number;
}) {
  return (
    <div
      className={`absolute top-0 ${color} rounded-sm opacity-0 animate-confetti`}
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 2.5}px`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export default function SubscriptionSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${dmSans.className} relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-[80px]`}
    >
      {/* Confetti keyframes */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
        .animate-confetti {
          animation: confetti-fall 3s ease-in forwards;
        }
      `}</style>

      {/* Confetti particles */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiPiece
              key={i}
              color={confettiColors[i % confettiColors.length]}
              delay={Math.random() * 2000}
              left={Math.random() * 100}
              size={6 + Math.random() * 6}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-10 w-10 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
          Subscription Activated!
        </h1>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          Your payment was successful and your subscription is now active.
          Enjoy unlimited access to all premium courses and features.
        </p>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="mb-2 text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            What happens next?
          </h3>
          <ul className="space-y-3 text-left text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Access all premium course content immediately
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Your billing will renew automatically each month
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime from your subscription settings
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/courses">
            <Button className="w-full sm:w-auto">Browse Courses</Button>
          </Link>
          <Link href="/subscriptions">
            <Button variant="outline" className="w-full sm:w-auto">
              Manage Subscription
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
