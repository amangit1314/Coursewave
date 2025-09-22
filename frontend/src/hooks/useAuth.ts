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
      loginStore(data.data.user, data.data.accessToken);
    },
    onError: (error) => {
      toast.error(error.message ?? "🚨 Failed to sign ...");
    },
  });
}

export function useRegister() {
  const loginStore = useUserStore((s) => s.login);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // loginStore(data.data.user, data.data.accessToken);
      toast.success(data.message ?? "User registered successfully 🎉 ...");
      // window.href.location = '/login';
    },
    onError: (error) => {
      toast.error(error.message ?? "🚨 Failed to register user ...");
    },
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
    mutationFn: authService.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authService.resetPassword,
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
