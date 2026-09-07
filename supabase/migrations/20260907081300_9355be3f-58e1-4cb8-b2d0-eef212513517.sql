CREATE TABLE public.memberships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  plan_type text NOT NULL,
  branch text NOT NULL,
  shift_timings text,
  seat_number integer,
  is_reserved boolean NOT NULL DEFAULT false,
  start_date date NOT NULL DEFAULT current_date,
  expiry_date date NOT NULL,
  fee_total numeric(10,2) NOT NULL DEFAULT 0,
  fee_paid numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX memberships_email_idx ON public.memberships (lower(email));
CREATE INDEX memberships_phone_idx ON public.memberships (phone);

GRANT SELECT ON public.memberships TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all memberships" ON public.memberships
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can view their own membership" ON public.memberships
  FOR SELECT TO authenticated USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email'), '')));

CREATE POLICY "Admins can insert memberships" ON public.memberships
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update memberships" ON public.memberships
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete memberships" ON public.memberships
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();