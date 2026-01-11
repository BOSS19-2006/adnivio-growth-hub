-- Fix products RLS: Only show active products publicly, owners see all their own
DROP POLICY IF EXISTS "Users can view all products" ON public.products;

CREATE POLICY "Users can view own products" 
ON public.products FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view active products from others" 
ON public.products FOR SELECT 
USING (status = 'active' AND auth.uid() != user_id);

-- Fix services RLS: Only show active services publicly, owners see all their own
DROP POLICY IF EXISTS "Users can view all services" ON public.services;

CREATE POLICY "Users can view own services" 
ON public.services FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view active services from others" 
ON public.services FOR SELECT 
USING (status = 'active' AND auth.uid() != user_id);