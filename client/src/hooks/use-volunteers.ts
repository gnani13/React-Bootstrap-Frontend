import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { type Assignment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useMyAssignments() {
  return useQuery({
    queryKey: ['volunteer', 'assignments'],
    queryFn: async () => {
      const res = await api.get<Assignment[]>('/api/volunteer/my-assignments');
      return res.data;
    },
  });
}

export function useUpdateAssignmentStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "PENDING" | "IN_PROGRESS" | "COMPLETED" }) => {
      const res = await api.post<Assignment>(`/api/volunteer/assignment/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer', 'assignments'] });
      toast({
        title: "Status Updated",
        description: "Assignment status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    },
  });
}
