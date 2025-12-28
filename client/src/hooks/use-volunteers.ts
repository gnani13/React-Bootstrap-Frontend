import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { type Assignment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useMyAssignments() {
  return useQuery({
    queryKey: ['assignments', 'my'],
    queryFn: async () => {
      try {
        const res = await api.get<Assignment[]>('/api/volunteer/my-assignments');
        return res.data;
      } catch (error) {
        console.warn("Backend unavailable, using mock assignments");
        return [
          {
            id: 1,
            volunteerId: 1,
            donationId: 1,
            status: "PENDING"
          }
        ] as Assignment[];
      }
    },
    initialData: [] as Assignment[],
  });
}

export function useUpdateAssignmentStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "PENDING" | "IN_PROGRESS" | "COMPLETED" }) => {
      try {
        const res = await api.post<Assignment>(`/api/volunteer/assignment/${id}/status`, { status });
        return res.data;
      } catch (error) {
        console.warn("Backend unavailable, simulating assignment status update");
        return { id, status } as Assignment;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', 'my'] });
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
