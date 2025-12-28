import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">404</h1>
          <p className="text-xl font-medium text-foreground">Page Not Found</p>
          <p className="text-muted-foreground mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link href="/dashboard">
          <button className="btn-primary px-8 py-3">
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
