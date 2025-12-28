import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDonationSchema, type InsertDonation } from "@shared/schema";
import { useCreateDonation } from "@/hooks/use-donations";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Donors only provide these fields
const createSchema = insertDonationSchema.omit({ 
  id: true, 
  createdAt: true, 
  donorId: true, 
  claimedByNgoId: true, 
  status: true 
});

type CreateDonationForm = z.infer<typeof createSchema>;

import { z } from "zod";

export default function CreateDonation() {
  const [, setLocation] = useLocation();
  const { mutate: createDonation, isPending } = useCreateDonation();
  
  const form = useForm<CreateDonationForm>({
    resolver: zodResolver(createSchema),
  });

  const onSubmit = (data: CreateDonationForm) => {
    createDonation(data, {
      onSuccess: () => {
        setLocation('/donations/my');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-display font-bold text-foreground">Donate Food</h1>
        <p className="text-muted-foreground">Share your surplus food with those who need it most.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Title</label>
            <input
              {...form.register("title")}
              placeholder="e.g., 20 Packed Meals, Surplus Bread"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Quantity</label>
              <input
                {...form.register("quantity")}
                placeholder="e.g., 5kg, 20 boxes"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {form.formState.errors.quantity && (
                <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Pickup Address</label>
              <input
                {...form.register("pickupAddress")}
                placeholder="Full address for pickup"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {form.formState.errors.pickupAddress && (
                <p className="text-xs text-destructive">{form.formState.errors.pickupAddress.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Description</label>
            <textarea
              {...form.register("description")}
              rows={4}
              placeholder="Describe the food items, dietary info, or pickup instructions..."
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <Link href="/dashboard">
              <button type="button" className="px-6 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary px-8 py-2.5 text-base"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Post Donation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
