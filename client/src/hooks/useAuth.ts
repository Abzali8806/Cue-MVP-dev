import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  companyName?: string;
  industry?: string;
  role?: string;
  usagePurpose?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}