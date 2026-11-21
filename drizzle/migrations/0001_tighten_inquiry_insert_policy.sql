DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.admission_inquiries;
CREATE POLICY "Anyone can submit a valid inquiry" ON public.admission_inquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 2 AND 100
  AND phone ~ '^[0-9+ ()-]{7,20}$'
  AND char_length(email) <= 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(btrim(timing)) BETWEEN 1 AND 100
  AND (message IS NULL OR char_length(message) <= 1000)
);