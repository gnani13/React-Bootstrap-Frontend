import { Donation } from "@shared/schema";
import { MapPin, Calendar, CheckCircle, Truck, Package } from "lucide-react";
import { format } from "date-fns";

interface DonationCardProps {
  donation: Donation;
  actionButton?: React.ReactNode;
}

export function DonationCard({ donation, actionButton }: DonationCardProps) {
  const statusColors = {
    AVAILABLE: "bg-green-100 text-green-700 border-green-200",
    CLAIMED: "bg-amber-100 text-amber-700 border-amber-200",
    DELIVERED: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const StatusIcon = {
    AVAILABLE: CheckCircle,
    CLAIMED: Truck,
    DELIVERED: Package,
  }[donation.status || "AVAILABLE"];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusColors[donation.status as keyof typeof statusColors]}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {donation.status}
        </div>
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {donation.createdAt ? format(new Date(donation.createdAt), "MMM d, yyyy") : "Recent"}
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {donation.title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
        {donation.description}
      </p>

      <div className="space-y-3 pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Package className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium">Quantity: {donation.quantity}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{donation.pickupAddress}</span>
        </div>
      </div>

      {actionButton && (
        <div className="mt-6 pt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
}
