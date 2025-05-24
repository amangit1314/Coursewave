"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { LucideLoader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PasswordInput } from "./_components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useUserStore } from "@/zustand/userStore";
import ApiManager from "@/lib/api/api-manager";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const Login = () => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [user, setUserInfo] = React.useState({ email: "", password: "" });
  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const { loginUser, loadingState } = useUserStore();

  const onLogin = async () => {
    loginUser(user.email, user.password);
    // try {
    //   setLoading(true);
    //   const url = "http://localhost:5002/api/auth/login";
    //   // process.env.ENVIRONMENT === "DEVELOPMENT"
    //   //   ? absoluteUrl("/api/auth/login")
    //   //   : "api/auth/login";
    //   await ApiManager.getInstance().post(url, user).then((res) => {
    //     console.log("Login response: ", res.data);
    //     // setUser(res.data);
    //     successNotification("Logged in successfully");
    //     router.push("/browse");
    //   });
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
    <div className="flex h-full max-h-scree w-full flex-col items-center bg-slate-800 lg:mx-auto md:max-w-7xl p-[0.75rem] md:p-[1.25rem] md:py-[3rem] lg:py-[2.25rem] lg:p-[2.25rem] overflow-hidden">
      <div className="flex flex-col justify-center space-y-4 rounded-3xl bg-slate-900 p-[2rem] md:p-[3.5rem] lg:p-[5rem] md:space-y-0 md:flex-row">
        {/* Left section */}
        <div className="mr-0 flex flex-col justify-center md:mr-[2rem]">
          <div className="space-y-8 text-3xl font-bold tracking-tight text-white md:text-4xl md:leading-10">
            Welcome back to <br />{" "}
            <span className="text-blue-500">CourseWave</span>
          </div>
          <div className="mb-4 mt-1 h-[5px] w-32 rounded-full bg-blue-500"></div>
          <div className="text-slate-400">
            Sign in to continue to your <br /> account.
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:mt-5 lg:mt-0 rounded-3xl bg-white p-8 dark:bg-slate-800">
          <div className="flex flex-col items-center justify-center w-full">
            <SignInWithGoogleButton />
            <div className="inline-flex justify-center items-center">
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="px-3 font-medium text-gray-900  bg-white dark:bg-slate-800 ">
                or
              </span>
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>
          </div>

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
            className="inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-blue-500 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
  );
};

export default Login;

const SignInWithGoogleButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => signIn()}
      className="overflow-hidden rounded-md bg-blue-500 border-transparent p-3 w-full cursor-pointer"
    >
      <FcGoogle size={26} />
      <div className="pl-2">Sign in with Google</div>
    </Button>
  );
};
