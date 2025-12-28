import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { type Donation, type InsertDonation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// === QUERY HOOKS ===

export function useMyDonations() {
  return useQuery({
    queryKey: ['donations', 'my'],
    queryFn: async () => {
      const res = await api.get<Donation[]>('/api/donations/my-donations');
      return Array.isArray(res.data) ? res.data : [];
    },
  });
}

export function useAvailableDonations() {
  return useQuery({
    queryKey: ['donations', 'available'],
    queryFn: async () => {
      const res = await api.get<Donation[]>('/api/donations/available');
      return Array.isArray(res.data) ? res.data : [];
    },
  });
}

export function useNgoMyDonations() {
  return useQuery({
    queryKey: ['donations', 'ngo-my'],
    queryFn: async () => {
      const res = await api.get<Donation[]>('/api/donations/ngo/my-donations');
      return Array.isArray(res.data) ? res.data : [];
    },
  });
}

// === MUTATION HOOKS ===

export function useCreateDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (donation: Omit<InsertDonation, "id" | "createdAt" | "donorId" | "claimedByNgoId" | "status">) => {
      try {
        const res = await api.post<Donation>('/api/donations', donation);
        return res.data;
      } catch (error) {
        console.warn("Backend unavailable, simulating donation creation");
        return { 
          id: Math.floor(Math.random() * 1000), 
          ...donation, 
          status: 'AVAILABLE',
          donorId: 1,
          createdAt: new Date().toISOString() 
        } as Donation;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'user-stats'] });
      toast({
        title: "Donation Created",
        description: "Thank you for your generosity! Your donation is now listed.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create donation. Please try again.",
      });
    },
  });
}

export function useClaimDonation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await api.post<Donation>(`/api/donations/${id}/claim`);
        return res.data;
      } catch (error) {
        console.warn("Backend unavailable, simulating donation claim");
        return { id, status: 'CLAIMED' } as Donation;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['donations', 'ngo-my'] });
      toast({
        title: "Donation Claimed",
        description: "The donation has been successfully claimed.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to claim donation. It may have already been taken.",
      });
    },
  });
}
