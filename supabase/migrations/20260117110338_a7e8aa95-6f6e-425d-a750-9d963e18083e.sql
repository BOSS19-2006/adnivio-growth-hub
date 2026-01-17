-- Remove any overly permissive SELECT policies on profiles table
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Ensure only owner-only SELECT policy exists (recreate to be safe)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- The public_profiles view with SECURITY DEFINER is intentional for user discovery
-- It excludes the email field and allows authenticated users to find others for messaging