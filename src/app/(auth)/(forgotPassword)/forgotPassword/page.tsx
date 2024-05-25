"use client";

import React from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader } from "lucide-react";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [isButtonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({ email: "" });

  const onEmailChange = (e: any) => {
    const email = e.target.value;
    setUser({ email });

    // Enable the button when there is something in the email input field
    setButtonDisabled(email === "");
  };

  const onForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "api/auth/forgotPassword",
        JSON.stringify(user.email)
      );
      console.log("Forgot email sent successfully", response.data);
      toast.success("Forgot email sent successfully");
      router.push("/login");
    } catch (error: any) {
      console.error("Forgot password failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto w-auto bg-slate-800">
      <div className="h-screen bg-slate-800 lg:p-24 xl:p-24 max-w-7xl mx-auto my-auto">
        <div className="flex flex-col lg:flex-row xl:flex-row w-auto justify-center bg-slate-900 rounded-lg">
          {/* Left section */}
          <div className="flex flex-col py-8 px-8 mr-0 lg:mr-20 xl:mr-20 justify-center">
            <p className="pt-3 text-sm">
              <Link
                href="/login"
                className="text-white hover:text-blue-500 space-x-2 transition-all duration-200"
              >
                <ChevronLeft /> <p>Back to login!</p>
              </Link>
            </p>
            <div className="text-white font-bold text-3xl">
              Did you Forgot Password <br /> your password for{" "}
              <span className="text-blue-500">Coursewae</span>
            </div>
            <div className="h-1.5 rounded-xl bg-blue-500 w-32 mt-1 mb-4" />
            <div className="text-slate-400">
              Enter your email, and we will send you a <br /> forgot password
              link to your email.
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col m-14 py-8 px-8 bg-white rounded-lg">
            <form>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="email"
                type="email"
                autoComplete="true"
                value={user.email}
                onChange={onEmailChange}
                placeholder="Email"
              />
            </form>

            <br className="py-2" />
            <button
              onClick={onForgotPassword}
              type="submit"
              className="py-2 text-white w-full bg-blue-500 inline-flex  justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : isButtonDisabled ? (
                "Can't Send"
              ) : (
                "Send Email"
              )}
            </button>

            <p className="pt-3 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Login!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
