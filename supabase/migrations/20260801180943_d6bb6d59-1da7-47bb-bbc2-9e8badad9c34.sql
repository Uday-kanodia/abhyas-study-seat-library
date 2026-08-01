CREATE TABLE public.admission_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  timing TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.admission_inquiries TO anon;
GRANT INSERT ON public.admission_inquiries TO authenticated;
GRANT ALL ON public.admission_inquiries TO service_role;

ALTER TABLE public.admission_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
ON public.admission_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_admission_inquiries_updated_at
BEFORE UPDATE ON public.admission_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();