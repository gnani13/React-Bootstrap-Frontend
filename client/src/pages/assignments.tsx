import { useMyAssignments, useUpdateAssignmentStatus } from "@/hooks/use-volunteers";
import { Loader2, MapPin, CheckCircle, Clock, Truck } from "lucide-react";
import { Assignment } from "@shared/schema";

export default function MyAssignments() {
  const { data: assignments, isLoading } = useMyAssignments();
  const { mutate: updateStatus, isPending } = useUpdateAssignmentStatus();

  const handleStatusUpdate = (id: number, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    updateStatus({ id, status });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Delivery Assignments</h1>
        <p className="text-muted-foreground">Manage your delivery tasks and update their status.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : Array.isArray(assignments) && assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
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
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Destination details provided by NGO
                </p>
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
        <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No active assignments</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You don't have any delivery tasks assigned at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
