import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/useAuth";
import { orbitron, poppins } from "@/lib/config/fonts";
import { motion } from "framer-motion";
import { Eye, EyeOff, LucideLoader2, Mail, Lock } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Toaster } from "react-hot-toast";

type Props = {};

const RegisterForm = (props: Props) => {
  const { mutate: register, isPending, error } = useRegister();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onRegister = async () => {
    console.log("Register clicked");
    register(user);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center justify-center"
    >
      {/* <Toaster /> */}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80">
        <div className="text-center">
          <h2
            className={`${poppins.className} text-2xl font-bold text-gray-900 dark:text-white`}
          >
            Create your account
          </h2>
          <p
            className={`${poppins.className} mt-2 text-sm text-gray-600 dark:text-gray-400`}
          >
            Start your learning journey today. It's completely free!
          </p>
        </div>

        <div className="space-y-6">
          {/* Google Sign Up */}
          <Button
            variant="outline"
            className={`${poppins.className} group relative h-12 w-full overflow-hidden rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`${poppins.className} bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400`}
              >
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                id="email"
                type="email"
                autoComplete="email"
                value={user.email}
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                }}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`${poppins.className} text-sm font-medium text-gray-700 dark:text-gray-300`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-10 h-12 rounded-xl border-gray-300 bg-white/50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400"
                id="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                autoComplete="new-password"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p
              className={`${poppins.className} text-xs text-gray-500 dark:text-gray-400`}
            >
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Register Button */}
          <Button
            onClick={onRegister}
            disabled={isButtonDisabled || isPending}
            className={`${orbitron.className} group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50`}
          >
            {isPending ? (
              <LucideLoader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Account
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:to-cyan-600/20" />
              </>
            )}
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p
              className={`${poppins.className} text-sm text-gray-600 dark:text-gray-400`}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
