-- Create bookings table for property reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price NUMERIC NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
USING (user_id = auth.uid());

-- Users can create bookings when authenticated
CREATE POLICY "Authenticated users can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
ON public.bookings
FOR UPDATE
USING (user_id = auth.uid() AND status = 'pending');

-- Users can cancel their own bookings
CREATE POLICY "Users can delete own bookings"
ON public.bookings
FOR DELETE
USING (user_id = auth.uid());

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'realtor'));

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'realtor'));

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;