import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function BackendStatus() {
  const { data: isOnline, isLoading } = useQuery({
    queryKey: ["/health"],
    retry: false,
    refetchInterval: 30000, // Check every 30 seconds
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:8000/health', {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        return response.ok;
      } catch {
        return false;
      }
    },
  });

  if (isLoading) return null;

  return (
    <Badge 
      variant={isOnline ? "default" : "secondary"} 
      className={`text-xs ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}
    >
      {isOnline ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          Backend Connected
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3 mr-1" />
          Backend Offline
        </>
      )}
    </Badge>
  );
}