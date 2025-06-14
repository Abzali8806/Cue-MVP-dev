import { QueryClient } from "@tanstack/react-query";

// Get FastAPI base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API request function for FastAPI backend
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies for session-based auth
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText || response.statusText}`);
  }
  
  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      queryFn: async ({ queryKey }) => {
        const endpoint = queryKey[0] as string;
        try {
          return await apiRequest(endpoint);
        } catch (error) {
          // Handle development mode when FastAPI backend is not available
          if (error instanceof TypeError && error.message.includes('fetch')) {
            console.warn(`FastAPI backend not available for ${endpoint} - running in development mode`);
            return null;
          }
          throw error;
        }
      },
    },
    mutations: {
      retry: false,
    },
  },
});