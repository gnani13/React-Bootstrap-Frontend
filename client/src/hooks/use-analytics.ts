import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { type DashboardStats, type UserStats } from "@shared/schema";

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const res = await api.get<DashboardStats>('/api/analytics/dashboard');
      return res.data;
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['analytics', 'user-stats'],
    queryFn: async () => {
      const res = await api.get<UserStats>('/api/analytics/user-stats');
      return res.data;
    },
  });
}
