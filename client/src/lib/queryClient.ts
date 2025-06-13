import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // TODO: Add authentication headers when FastAPI backend is implemented
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  // Authentication will be handled by your FastAPI backend
  // headers.Authorization = `Bearer ${your_jwt_token}`;
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    // TODO: Handle authentication errors when FastAPI backend is implemented
    if (res.status === 401 || res.status === 403) {
      // Authentication error handling will be implemented with FastAPI backend
      throw new Error(`${res.status}: ${res.statusText || 'Unauthorized'}`);
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Handle network errors when backend is not available
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Backend service unavailable. Please ensure your FastAPI backend is running.');
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
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    try {
      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      if (!res.ok) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        throw new Error(`${res.status}: ${res.statusText}`);
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
      queryFn: getQueryFn({ on401: "throw" }),
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
