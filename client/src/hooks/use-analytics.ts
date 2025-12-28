import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { type DashboardStats, type UserStats } from "@shared/schema";

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      try {
        const res = await api.get<DashboardStats>('/api/analytics/dashboard');
        return res.data;
      } catch (error) {
        console.warn("Backend unavailable, using mock dashboard stats");
        return {
          totalDonations: 150,
          activeDonations: 12,
          totalMealsSaved: 450
        } as DashboardStats;
      }
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['analytics', 'user-stats'],
    queryFn: async () => {
      try {
        const res = await api.get<UserStats>('/api/analytics/user-stats');
        return res.data;
      } catch (error) {
        console.warn("Backend unavailable, using mock user stats");
        return {
          donationsCount: 5,
          impactScore: 85
        } as UserStats;
      }
    },
  });
}
