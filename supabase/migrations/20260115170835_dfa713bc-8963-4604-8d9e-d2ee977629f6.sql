-- Create a public_profiles view that excludes sensitive email field
-- This allows user discovery for messaging while protecting email privacy

CREATE VIEW public.public_profiles
WITH (security_invoker=on) AS
  SELECT 
    id, 
    user_id, 
    full_name, 
    business_name,
    business_type, 
    bio, 
    avatar_url, 
    created_at,
    updated_at
    -- email is intentionally excluded for privacy protection
  FROM public.profiles;

-- Grant access to authenticated users on the view
GRANT SELECT ON public.public_profiles TO authenticated;

-- Drop the overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create restrictive policy: users can only view their own profile directly
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);