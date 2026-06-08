DROP POLICY IF EXISTS "Anyone can book appointments" ON public.appointments;
CREATE POLICY "Anyone can book appointments" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 100
    AND length(phone) BETWEEN 7 AND 20
    AND length(department) BETWEEN 1 AND 100
    AND preferred_date >= CURRENT_DATE
    AND (message IS NULL OR length(message) <= 500)
  );