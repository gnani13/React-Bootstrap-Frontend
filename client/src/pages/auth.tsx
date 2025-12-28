import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginCredentialsSchema, insertUserSchema, type InsertUser, type LoginCredentials } from "@shared/schema";
import { Loader2, ArrowRight, Heart } from "lucide-react";
import { Link } from "wouter";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoggingIn, isRegistering } = useAuth();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between bg-secondary text-secondary-foreground p-12 relative overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">FoodConnect</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="font-display text-5xl font-bold leading-tight mb-6">
            Bridging the gap between <span className="text-primary">surplus</span> and <span className="text-accent">scarcity</span>.
          </h2>
          <p className="text-lg text-secondary-foreground/80 leading-relaxed">
            Join our community of donors, NGOs, and volunteers working together to reduce food waste and feed those in need. Every meal counts.
          </p>
        </div>

        <div className="relative z-10 text-sm text-secondary-foreground/40 font-medium">
          © 2024 FoodConnect Platform
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin 
                ? "Enter your credentials to access your dashboard" 
                : "Choose your role and join our mission today"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            {isLogin ? (
              <LoginForm onSubmit={(data) => login(data)} isLoading={isLoggingIn} />
            ) : (
              <RegisterForm onSubmit={(data) => register(data)} isLoading={isRegistering} />
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit, isLoading }: { onSubmit: (data: LoginCredentials) => void, isLoading: boolean }) {
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialsSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Email</label>
        <input
          {...form.register("email")}
          type="email"
          placeholder="name@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Password</label>
        <input
          {...form.register("password")}
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary h-11 text-base group"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Sign In 
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

function RegisterForm({ onSubmit, isLoading }: { onSubmit: (data: InsertUser) => void, isLoading: boolean }) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      role: "DONOR",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Full Name</label>
        <input
          {...form.register("name")}
          placeholder="John Doe"
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Email</label>
        <input
          {...form.register("email")}
          type="email"
          placeholder="name@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Password</label>
        <input
          {...form.register("password")}
          type="password"
          placeholder="Create a strong password"
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">I want to join as a...</label>
        <select
          {...form.register("role")}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          <option value="DONOR">Donor (I have food to give)</option>
          <option value="NGO">NGO (I distribute food)</option>
          <option value="VOLUNTEER">Volunteer (I deliver food)</option>
          <option value="ADMIN">Admin (System Administrator)</option>
        </select>
        {form.formState.errors.role && (
          <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary h-11 text-base group"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Create Account
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
