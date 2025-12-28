import { useMyAssignments, useUpdateAssignmentStatus, useAvailableAssignments, useClaimAssignment } from "@/hooks/use-volunteers";
import { Loader2, MapPin, CheckCircle, Clock, Truck, Package } from "lucide-react";
import { Assignment, Donation } from "@shared/schema";

export default function MyAssignments() {
  const { data: assignments, isLoading } = useMyAssignments();
  const { data: available, isLoading: isLoadingAvailable } = useAvailableAssignments();
  const { mutate: updateStatus, isPending } = useUpdateAssignmentStatus();
  const { mutate: claimAssignment, isPending: isClaiming } = useClaimAssignment();

  const handleStatusUpdate = (id: number, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    updateStatus({ id, status });
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Available for Pickup</h1>
          <p className="text-muted-foreground">Browse donations claimed by NGOs that need delivery.</p>
        </div>

        {isLoadingAvailable ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : Array.isArray(available) && available.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {available.map((donation) => (
              <div key={donation.id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">{donation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{donation.pickupAddress}</p>
                </div>
                <button
                  onClick={() => claimAssignment(donation.id)}
                  disabled={isClaiming}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim for Delivery"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed border-border">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No pending deliveries available at the moment.</p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground">Your active delivery tasks.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : Array.isArray(assignments) && assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5
                      ${assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                        assignment.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        'bg-amber-100 text-amber-700 border-amber-200'}
                    `}>
                      {assignment.status}
                    </span>
                    <span className="text-xs text-muted-foreground">Assignment #{assignment.id}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">Delivery Task</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {assignment.status === 'PENDING' && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(assignment.id, 'IN_PROGRESS')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
                    >
                      <Truck className="w-4 h-4" /> Start Delivery
                    </button>
                  )}
                  
                  {assignment.status === 'IN_PROGRESS' && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(assignment.id, 'COMPLETED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Completed
                    </button>
                  )}
                  
                  {assignment.status === 'COMPLETED' && (
                     <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg flex items-center gap-2 text-sm font-medium cursor-default">
                       <CheckCircle className="w-4 h-4" /> Completed
                     </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed border-border">
            <Truck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active assignments. Browse and claim one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
