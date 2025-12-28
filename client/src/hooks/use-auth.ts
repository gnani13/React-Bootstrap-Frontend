import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { useLocation } from "wouter";
import { 
  type LoginCredentials, 
  type InsertUser, 
  type User, 
  type AuthResponse 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Helper to get user from local storage initially
const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // We use react-query to manage user state, initializing from localStorage
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      // Try to fetch fresh profile if token exists
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const res = await api.get<User>('/api/auth/profile');
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      } catch (error) {
        return null;
      }
    },
    initialData: getStoredUser(),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await api.post<AuthResponse>('/api/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.name}`,
      });
      
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await api.post<AuthResponse>('/api/auth/register', data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      
      toast({
        title: "Account created!",
        description: "Welcome to the platform.",
      });
      
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || error.message || "Could not create account",
      });
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.setQueryData(['auth', 'user'], null);
    setLocation('/login');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
