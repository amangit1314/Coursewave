"use client";

import { Button } from "@/components/ui/button";
import { dmSans } from "@/lib/config/fonts";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

const OAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuth = (provider: "google" | "github") => {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: "/browse" });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        onClick={() => handleOAuth("google")}
        disabled={loadingProvider !== null}
        className={`${dmSans.className} h-12 w-full rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
      >
        {loadingProvider === "google" ? (
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5" />
        )}
        Continue with Google
      </Button>
      <Button
        variant="outline"
        onClick={() => handleOAuth("github")}
        disabled={loadingProvider !== null}
        className={`${dmSans.className} h-12 w-full rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
      >
        {loadingProvider === "github" ? (
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
        ) : (
          <FaGithub className="mr-2 h-5 w-5" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
};

export default OAuthButtons;
