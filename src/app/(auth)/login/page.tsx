"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { absoluteUrl } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { LucideLoader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PasswordInput } from "./_components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useZustandStore } from "@/zustand/store";
import { signIn } from "next-auth/react";
import { useUserStore } from "@/zustand/userStore";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const Login = () => {
  const router = useRouter();

  // const [loading, setLoading] = React.useState(false);
  const [user, setUserInfo] = React.useState({ email: "", password: "" });
  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const { loginUser, loadingState } = useUserStore();

  const onLogin = async () => {
    loginUser(user.email, user.password);
    // try {
    //   setLoading(true);
    //   const url =
    //     process.env.ENVIRONMENT === "DEVELOPMENT"
    //       ? absoluteUrl("/api/auth/login")
    //       : "api/auth/login";
    //   await axios.post(url, user).then((res) => {
    //     console.log("Login response: ", res.data);
    //     setUser(res.data);
    //   });

    //   successNotification("Logged in successfully");
    //   router.push("/browseCourses");
    // } catch (error: any) {
    //   console.error("Login failed: ", error.message);
    //   errorNotification(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="h-[80vh] bg-zinc-800">
      <div className="flex h-auto w-full flex-col items-center bg-slate-800 md:mx-auto md:max-w-7xl md:p-24">
        <div className="w-7xl flex flex-col justify-center space-y-4 rounded-3xl bg-slate-900 p-14 md:space-y-0 lg:flex-row">
          {/* Left section */}
          <div className="mr-0 flex flex-col justify-center lg:mr-20">
            <div className="space-y-8 text-2xl font-bold tracking-tight text-white md:text-[42px] md:leading-10">
              Welcome back to <br />{" "}
              <span className="text-blue-500">CourseWave</span>
            </div>
            <div className="mb-4 mt-1 h-[5px] w-32 rounded-full bg-blue-500"></div>
            <div className="text-slate-400">
              Sign in to continue to your <br /> account.
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col rounded-3xl bg-white p-8">
            {/* <div className="inline-flex items-center justify-center w-full">
              <SignInWithGoogleButton />
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="px-3 font-medium text-gray-900  bg-white  ">
                or
              </span>
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div> */}

            <Input
              className="mb-4 rounded-lg border border-gray-300 bg-transparent p-2 text-black focus:border-gray-600 focus:outline-none"
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => {
                setUserInfo({ ...user, email: e.target.value });
              }}
              placeholder="email"
            />

            <PasswordInput
              id="current_password"
              value={user.password}
              onChange={(e: any) =>
                setUserInfo({ ...user, password: e.target.value })
              }
              autoComplete="current-password"
            />

            <Link
              href="/forgotPassword"
              className="cursor-point pb-2 text-sm text-blue-500"
            >
              forgot password?
            </Link>

            <button
              onClick={onLogin}
              type="submit"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-500 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {loadingState.loading ? (
                <LucideLoader2 className="animate-spin" />
              ) : isButtonDisabled ? (
                "Cant Login"
              ) : (
                "Login"
              )}
            </button>

            <Toaster />

            <p className="pt-3 text-sm dark:text-gray-900">
              Dont have an account?
              <Link href="/register" className="ml-[4px] text-blue-500">
                Register!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

const SignInWithGoogleButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => signIn()}
      className="overflow-hidden rounded-md border-blue-500 bg-transparent p-3"
    >
      <FcGoogle size={26} />
      <div className="pl-2">Sign in with Google</div>
    </Button>
  );
};
