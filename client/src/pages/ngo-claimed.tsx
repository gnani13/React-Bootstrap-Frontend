import { useNgoMyDonations } from "@/hooks/use-donations";
import { DonationCard } from "@/components/DonationCard";
import { Loader2, PackageOpen } from "lucide-react";
import { Link } from "wouter";

export default function NgoClaimedDonations() {
  const { data: donations, isLoading } = useNgoMyDonations();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Claimed Donations</h1>
        <p className="text-muted-foreground">Track the donations you have claimed for distribution.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : Array.isArray(donations) && donations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No claimed donations</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven't claimed any donations yet. Browse available donations to get started.
          </p>
          <Link href="/donations/available">
            <button className="btn-primary">Browse Available Food</button>
          </Link>
        </div>
      )}
    </div>
  );
}
