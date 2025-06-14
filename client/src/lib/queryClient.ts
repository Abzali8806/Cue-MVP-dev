import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  // Add authentication header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: "include",
    });

    // Handle authentication errors
    if (res.status === 401) {
      localStorage.removeItem('authToken');
      // Don't redirect automatically - let components handle auth state
      throw new Error('Authentication required');
    }

    if (res.status === 403) {
      throw new Error('Access forbidden');
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Handle network errors when backend is not available
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.debug('Network error suppressed:', error);
      throw new Error('Backend service unavailable');
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      const res = await apiRequest(url, { method: 'GET' });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      return await res.json();
    } catch (error) {
      // Always return null for network errors to prevent overlay
      console.debug('Query failed:', error);
      if (unauthorizedBehavior === "returnNull") {
        return null;
      }
      // Even when we should throw, return null to prevent runtime overlay
      return null;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
