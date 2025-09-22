"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AuthBackgroundPatternProps {
  className?: string;
}

const AuthBackgroundPattern: React.FC<AuthBackgroundPatternProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);

  // Only render particles on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-calculate particle positions using a deterministic pattern
  const particles = Array.from({ length: 15 }, (_, i) => {
    const angle = (i / 15) * Math.PI * 2; // Distribute particles in a circular pattern
    const radius = 40 + (i % 3) * 20; // Vary the radius to create depth
    const spiralFactor = i * 0.2; // Add a spiral effect

    return {
      left: 50 + Math.cos(angle) * radius + spiralFactor,
      top: 50 + Math.sin(angle) * radius + spiralFactor,
      delay: (i / 15) * 2, // Evenly distribute delays
      size: 8 + Math.floor(Math.random() * 12), // Random size between 8-20px
      opacity: 0.1 + Math.random() * 0.2, // Random opacity between 0.1-0.3
    };
  });

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 z-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`grid-col-${i}`}
            className="grid-line h-full w-px bg-blue-500/5 dark:bg-blue-400/10"
            style={{ left: `${(i / 6) * 100}%` }}
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`grid-row-${i}`}
            className="grid-line w-full h-px bg-blue-500/5 dark:bg-blue-400/10"
            style={{ top: `${(i / 6) * 100}%` }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-500/20 dark:to-cyan-500/20"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          animate={{
            y: ["0%", "30%", "0%"],
            x: ["0%", "15%", "0%"],
            scale: [1, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-cyan-900/20" />
    </div>
  );
};

export default AuthBackgroundPattern;