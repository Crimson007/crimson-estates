import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    price: number;
    bedrooms: number;
  };
  dateRange: {
    from: Date | undefined;
    to?: Date | undefined;
  };
}

export const BookingModal = ({
  isOpen,
  onClose,
  property,
  dateRange,
}: BookingModalProps) => {
  const [guests, setGuests] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const nightsCount =
    dateRange.from && dateRange.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;
  const totalPrice = property.price * nightsCount;
  const serviceFee = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + serviceFee;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to book this property");
      navigate("/auth");
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        property_id: property.id,
        user_id: user.id,
        check_in: format(dateRange.from, "yyyy-MM-dd"),
        check_out: format(dateRange.to, "yyyy-MM-dd"),
        total_price: grandTotal,
        guests: parseInt(guests),
        notes: notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Booking request submitted successfully!");
      onClose();
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxGuests = property.bedrooms * 2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm your booking</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {property.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dates Summary */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">
                {dateRange.from && format(dateRange.from, "MMM d")} -{" "}
                {dateRange.to && format(dateRange.to, "MMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                {nightsCount} night{nightsCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Number of Guests
            </Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger id="guests" className="w-full bg-background">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} guest{num !== 1 ? "s" : ""}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or notes for your stay..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background resize-none"
              rows={3}
            />
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(property.price)} × {nightsCount} nights
              </span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !dateRange.from || !dateRange.to}
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : user ? (
              "Confirm Booking"
            ) : (
              "Sign in to Book"
            )}
          </Button>

          {!user && (
            <p className="text-xs text-center text-muted-foreground">
              You'll need to sign in or create an account to complete your
              booking
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
