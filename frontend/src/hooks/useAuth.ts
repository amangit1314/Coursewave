// hooks/useAuth.ts
import { authService } from "@/lib/api/services/authService";
import { LoginRequest, RegisterRequest } from "@/types/auth.service.types";
import { useUserStore } from "@/zustand/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useLogin() {
  const loginStore = useUserStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      console.log("Data on success:", JSON.stringify(data, null, 2));
      const { data: loginData } = data;
      console.log("loginData:", loginData);
      console.log("User:", loginData?.user);
      console.log("Token:", loginData?.accessToken);

      loginStore(loginData.user, loginData.accessToken);
      console.log("✅ [useLogin.onSuccess] Stored in Zustand store");
    },
    onError: (error) => {
      console.error("❌ [useLogin.onError]", error);
      toast.error(error.message ?? "🚨 Failed to sign ...");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onError: (error) => {
      toast.error(error.message ?? "🚨 Failed to register user ...");
    },
  });
}

// hooks/useAuth.ts

type VerifyEmailPayload = {
  token: string;
  csrfToken: string;
};

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ token, csrfToken }: VerifyEmailPayload) =>
      authService.verifyEmail(token, csrfToken),
  });
}

export function useLogout() {
  const logoutStore = useUserStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    // mutationFn: authService.forgotPassword,
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

// Type for the mutation payload
type ResetPasswordPayload = {
  token: string;
  csrfToken: string;
  // email: string;
  newPassword: string;
};

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword({
        token: payload.token,
        csrfToken: payload.csrfToken,

        newPassword: payload.newPassword,
      }),
  });
}

export function useCheckAuth() {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRefreshToken() {
  const loginStore = useUserStore((s) => s.login);
  const logoutStore = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (data) => {
      if (data.success && data.data?.accessToken && user) {
        loginStore(user, data.data.accessToken);
      }
    },
    onError: () => {
      logoutStore();
    },
  });
}
