-- Ensure the trigger on auth.users exists to auto-create profile + assign admin role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- If the admin email already exists in auth.users, ensure they have the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'devsclinic20@gmail.com'
ON CONFLICT DO NOTHING;