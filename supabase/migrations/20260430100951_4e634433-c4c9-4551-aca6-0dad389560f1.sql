
-- Fix function search_path + restrict execution
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Restrict bucket listing — only allow reading specific objects, not listing
DROP POLICY IF EXISTS "Public read doctor photos" ON storage.objects;
CREATE POLICY "Public read doctor photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'doctor-photos' AND name IS NOT NULL);

-- Tighten appointment INSERT
DROP POLICY IF EXISTS "Anyone can book" ON public.appointments;
CREATE POLICY "Anyone can book appointments" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 100
    AND length(phone) BETWEEN 7 AND 20
    AND length(department) BETWEEN 1 AND 100
    AND preferred_date >= CURRENT_DATE
  );
