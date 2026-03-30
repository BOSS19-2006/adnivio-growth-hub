
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = false)
AS
SELECT
  p.id,
  p.user_id,
  p.full_name,
  p.business_name,
  p.business_type,
  p.bio,
  p.avatar_url,
  p.website,
  p.city,
  p.state,
  p.country,
  p.created_at,
  p.updated_at
FROM public.profiles p;

REVOKE ALL ON public.public_profiles FROM anon;
GRANT SELECT ON public.public_profiles TO authenticated;
