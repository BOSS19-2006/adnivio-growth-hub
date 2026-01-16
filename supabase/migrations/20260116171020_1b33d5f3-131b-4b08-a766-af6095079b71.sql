-- Drop the current view with security_invoker=on
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate view without security_invoker (uses default security_definer behavior)
-- This allows authenticated users to see other users' public profiles for messaging
CREATE VIEW public.public_profiles AS
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
  FROM public.profiles;

-- Grant select access to authenticated users only
GRANT SELECT ON public.public_profiles TO authenticated;