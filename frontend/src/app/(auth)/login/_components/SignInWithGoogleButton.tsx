import { Button } from "@/components/ui/button";
import { dmSans, poppins } from "@/lib/config/fonts";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const SignInWithGoogleButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => signIn()}
      className={`${dmSans.className} group relative h-12 w-full overflow-hidden rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default SignInWithGoogleButton;