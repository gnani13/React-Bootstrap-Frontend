import { useMyDonations } from "@/hooks/use-donations";
import { DonationCard } from "@/components/DonationCard";
import { Loader2, PackageOpen } from "lucide-react";
import { Link } from "wouter";

export default function MyDonations() {
  const { data: donations, isLoading } = useMyDonations();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Donations</h1>
          <p className="text-muted-foreground">Track the status of your contributions.</p>
        </div>
        <Link href="/donations/new">
          <button className="btn-primary">New Donation</button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : donations && donations.length > 0 ? (
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
          <h3 className="text-xl font-bold text-foreground mb-2">No donations yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven't posted any donations yet. Your contribution can make a huge difference!
          </p>
          <Link href="/donations/new">
            <button className="btn-primary">Make your first donation</button>
          </Link>
        </div>
      )}
    </div>
  );
}
