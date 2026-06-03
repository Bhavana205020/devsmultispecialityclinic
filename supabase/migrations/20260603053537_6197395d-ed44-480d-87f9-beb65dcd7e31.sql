-- Fix doctors SELECT policy to only expose active records
DROP POLICY IF EXISTS "Anyone view active doctors" ON public.doctors;
CREATE POLICY "Anyone view active doctors"
ON public.doctors
FOR SELECT
TO anon, authenticated
USING (active = true);

-- Explicitly restrict writes on user_roles to admins only (defense in depth)
CREATE POLICY "Admins manage user_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
