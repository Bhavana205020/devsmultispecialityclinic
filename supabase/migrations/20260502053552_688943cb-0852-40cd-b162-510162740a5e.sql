-- 1) DOCTORS: add description + experience
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS experience TEXT;

-- 2) APPOINTMENTS: migrate status enum to {pending, confirmed, rejected, waiting}
-- Step A: convert column to text temporarily
ALTER TABLE public.appointments ALTER COLUMN status TYPE TEXT USING status::text;
ALTER TABLE public.appointments ALTER COLUMN status DROP DEFAULT;

-- Map old values
UPDATE public.appointments SET status = 'confirmed' WHERE status = 'completed';
UPDATE public.appointments SET status = 'rejected'  WHERE status = 'cancelled';

-- Drop old enum and recreate
DROP TYPE IF EXISTS public.appointment_status CASCADE;
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'rejected', 'waiting');

ALTER TABLE public.appointments
  ALTER COLUMN status TYPE public.appointment_status USING status::public.appointment_status,
  ALTER COLUMN status SET DEFAULT 'pending'::public.appointment_status,
  ALTER COLUMN status SET NOT NULL;

-- 3) SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (length(email) >= 3 AND length(email) <= 255);

CREATE POLICY "Admins manage subscribers"
  ON public.subscribers FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4) SOCIAL CHANNELS
CREATE TABLE IF NOT EXISTS public.social_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  handle TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.social_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view active channels"
  ON public.social_channels FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage channels"
  ON public.social_channels FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_social_channels_updated
  BEFORE UPDATE ON public.social_channels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) FEATURED VIDEOS
CREATE TABLE IF NOT EXISTS public.featured_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  person_name TEXT NOT NULL,
  role TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.featured_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view active videos"
  ON public.featured_videos FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage videos"
  ON public.featured_videos FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_featured_videos_updated
  BEFORE UPDATE ON public.featured_videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();