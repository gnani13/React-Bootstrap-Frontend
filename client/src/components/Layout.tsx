import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { LogOut, Heart, LayoutDashboard, List, Truck, HandHeart } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return <>{children}</>;

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div className={`
          flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
          ${isActive 
            ? 'bg-primary/10 text-primary font-semibold' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
        `}>
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar / Mobile Header */}
      <aside className="w-full md:w-64 bg-card border-b md:border-r border-border p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight leading-none text-foreground">
              FoodConnect
            </h1>
            <span className="text-xs text-muted-foreground font-medium">Waste Less. Feed More.</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          
          {user.role === 'DONOR' && (
            <>
              <NavItem href="/donations/new" icon={HandHeart} label="Donate Food" />
              <NavItem href="/donations/my" icon={List} label="My Donations" />
            </>
          )}

          {user.role === 'NGO' && (
            <>
              <NavItem href="/donations/available" icon={List} label="Available Food" />
              <NavItem href="/donations/claimed" icon={Truck} label="Claimed Items" />
            </>
          )}

          {user.role === 'VOLUNTEER' && (
            <NavItem href="/assignments" icon={Truck} label="My Assignments" />
          )}
        </nav>

        <div className="pt-6 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
