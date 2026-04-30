
-- =========================================
-- ROLES
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: auto-grant admin role to the clinic email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'devsclinic20@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- updated_at helper
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================================
-- DOCTORS
-- =========================================
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  qualifications TEXT,
  specialty TEXT NOT NULL,
  photo_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER doctors_updated BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Anyone view active doctors" ON public.doctors
  FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage doctors" ON public.doctors
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SERVICES
-- =========================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Stethoscope',
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Anyone view services" ON public.services
  FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- TESTIMONIALS
-- =========================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 5,
  message TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER testimonials_updated BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Anyone view testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- APPOINTMENTS
-- =========================================
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  message TEXT,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER appointments_updated BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Anyone (including anonymous visitors) can book; only admins can read/manage
CREATE POLICY "Anyone can book" ON public.appointments
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Admins manage appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- STORAGE bucket for doctor photos (JPEG)
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-photos', 'doctor-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read doctor photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'doctor-photos');

CREATE POLICY "Admins upload doctor photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'doctor-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update doctor photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'doctor-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete doctor photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'doctor-photos' AND public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SEED data from the design
-- =========================================
INSERT INTO public.services (name, description, icon, display_order) VALUES
  ('Orthopaedic', 'Joint Replacements, Orthoscopy, Fracture Care & Sports Medicine.', 'Bone', 1),
  ('Gastroenterology', 'Digestive Disorders, Liver Care, Endoscopy & IBS Treatment.', 'Activity', 2),
  ('General physician', 'Routine Checkups, Fever, Diabetes, BP & General Consultations.', 'Stethoscope', 3),
  ('Physiotherapy', 'Pain Relief Therapy, Rehabilitation, Sports Injury Recovery.', 'Dumbbell', 4),
  ('Pharmacy', 'Wide Range of Medicines at Affordable Prices.', 'Pill', 5),
  ('Surgicals', 'Quality Surgical Instruments & Medical Consumables.', 'Scissors', 6),
  ('Digital X-ray', 'High Quality Digital Imaging for accurate Diagnosis', 'ScanLine', 7),
  ('Diagnostics', 'Blood Tests, Health Packages & Diagnostic Services', 'TestTube', 8);

INSERT INTO public.doctors (name, title, qualifications, specialty, display_order) VALUES
  ('Dr. Sharath Babu N', 'Consultant Orthopaedics - Joint Replacements, Arthroscopic & Robotic Surgeon', 'MBBS, DNB (Ortho), Fellowship in Joint Replacement & Revision (Germany), Fellowship in Arthroscopy (Germany), Spl in Trauma & Sports Medicine', 'Orthopaedic', 1),
  ('Dr. Swathi G', 'Consultant - Gastroenterologist', 'Gastroenterology Medical, MD (General Medicine), MD (Gastroenterology)', 'Gastroenterology', 2),
  ('Dr. Bhavana Bhat', 'Consultant Physiotherapist', 'BPT (MIAP)', 'Physiotherapy', 3);

INSERT INTO public.testimonials (patient_name, rating, message, display_order) VALUES
  ('Ramesh Kumar', 5, 'Visited Dev''s Multispeciality Clinic for knee pain. Dr. Sharath explained the issue very clearly and suggested the right treatment. The staff was very polite and the whole process was quick. Highly recommended for orthopaedic problems.', 1),
  ('Sunita Sharma', 5, 'I consulted Dr. Swathi for gastric issues and I''m really satisfied with the treatment. The diagnosis was accurate and I started feeling better within a few days. The clinic is clean and well maintained.', 2),
  ('Arjun Patel', 5, 'Took physiotherapy sessions here with Dr. Bhavana after my back injury. The improvement has been great and the sessions were very effective. Good facilities and supportive staff.', 3);
