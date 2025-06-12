import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  provider: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      window.location.href = '/login';
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: user as User | null,
    isLoading,
    isAuthenticated: !!user && !error,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}