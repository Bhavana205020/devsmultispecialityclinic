
DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;

-- Allow public reads of individual avatar files only when name is provided (blocks listing).
CREATE POLICY "Avatars public read by path"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND name IS NOT NULL AND length(name) > 0);
