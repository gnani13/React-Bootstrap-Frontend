import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("DONOR" | "NGO" | "VOLUNTEER" | "ADMIN")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading secure session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You do not have permission to view this page. This area is restricted to {allowedRoles.join(", ")}s.
          </p>
          <button 
            onClick={() => setLocation("/dashboard")}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
