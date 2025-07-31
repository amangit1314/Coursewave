"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Orbitron, Poppins } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');

  const handleSendCode = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
      toast.success('Verification code sent to your email!');
    }, 2000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      toast.success('Email verified successfully!');
    }, 2000);
  };

  const handleResendCode = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('New verification code sent!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                {isVerified ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <Mail className="h-8 w-8 text-white" />
                )}
              </div>
              
              <h1 className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}>
                {isVerified ? 'Email Verified!' : 'Verify Your Email'}
              </h1>
              
              <p className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}>
                {isVerified 
                  ? 'Your email has been successfully verified. You can now access your account.'
                  : 'We sent a verification code to your email address. Please enter it below.'
                }
              </p>
            </div>

            {!isVerified && (
              <div className="space-y-6">
                {step === 'email' ? (
                  /* Email Input Step */
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}>
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSendCode}
                      disabled={isLoading || !email}
                      className={`${orbitron.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Send Verification Code
                          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  /* Verification Code Step */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}>
                        Verification Code
                      </label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400 text-center text-lg font-mono tracking-widest"
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="000000"
                          maxLength={6}
                        />
                      </div>
                      <p className={`${poppins.className} text-xs text-gray-500 dark:text-gray-400`}>
                        Enter the 6-digit code sent to {email}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleVerifyCode}
                        disabled={isLoading || !verificationCode}
                        className={`${orbitron.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            Verify Email
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className={`${poppins.className} h-10 w-full rounded-xl border-gray-300 bg-transparent text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          "Resend Code"
                        )}
                      </Button>
                    </div>

                    <button
                      onClick={() => setStep('email')}
                      className={`${poppins.className} flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200`}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to email input
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Success State */}
            {isVerified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className={`${poppins.className} text-sm text-green-800 dark:text-green-200`}>
                      Your email has been successfully verified!
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/login">
                    <Button className={`${orbitron.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25`}>
                      Continue to Login
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className={`${poppins.className} h-10 w-full rounded-xl border-gray-300 bg-transparent text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}>
                Need help?{" "}
                <Link 
                  href="/help" 
                  className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default VerifyEmail;