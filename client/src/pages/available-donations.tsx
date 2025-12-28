import { useAvailableDonations, useClaimDonation } from "@/hooks/use-donations";
import { DonationCard } from "@/components/DonationCard";
import { Loader2, SearchX } from "lucide-react";

export default function AvailableDonations() {
  const { data: donations, isLoading } = useAvailableDonations();
  const { mutate: claimDonation, isPending } = useClaimDonation();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Available Donations</h1>
        <p className="text-muted-foreground">Browse and claim food donations for distribution.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : donations && donations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard 
              key={donation.id} 
              donation={donation} 
              actionButton={
                <button
                  onClick={() => claimDonation(donation.id)}
                  disabled={isPending}
                  className="w-full py-2.5 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-md shadow-accent/20 flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim Donation"}
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No donations available</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Check back later! Donors are constantly updating the list with new supplies.
          </p>
        </div>
      )}
    </div>
  );
}
