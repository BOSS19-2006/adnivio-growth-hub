-- Add storage policies for file type validation
-- First, drop existing permissive policies if any
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view public files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Create policy that validates file extensions for uploads
CREATE POLICY "Authenticated users can upload validated images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.extension(name) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif']))
);

-- Allow anyone to view public files (marketplace images)
CREATE POLICY "Anyone can view public uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'uploads');

-- Users can update their own files (file path starts with their user ID)
CREATE POLICY "Users can update own uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uploads' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'uploads'
  AND (storage.extension(name) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif']))
);

-- Users can delete their own files
CREATE POLICY "Users can delete own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);