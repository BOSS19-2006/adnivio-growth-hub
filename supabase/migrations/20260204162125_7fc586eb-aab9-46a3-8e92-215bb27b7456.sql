-- Add contact and location fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Update public_profiles view to include new fields (excluding email for privacy)
DROP VIEW IF EXISTS public.public_profiles;
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
  phone,
  website,
  city,
  state,
  country,
  created_at, 
  updated_at
FROM public.profiles;

-- Grant access to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Create business_reviews table for ratings and reviews
CREATE TABLE IF NOT EXISTS public.business_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_user_id UUID NOT NULL,
  reviewer_user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT review_target_check CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR 
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

-- Create orders table for tracking business orders/clients
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_user_id UUID NOT NULL,
  seller_user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_reviews
CREATE POLICY "Anyone can view reviews"
ON public.business_reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.business_reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_user_id AND auth.uid() != business_user_id);

CREATE POLICY "Users can update own reviews"
ON public.business_reviews FOR UPDATE
USING (auth.uid() = reviewer_user_id);

CREATE POLICY "Users can delete own reviews"
ON public.business_reviews FOR DELETE
USING (auth.uid() = reviewer_user_id);

-- RLS policies for orders
CREATE POLICY "Buyers can view their orders"
ON public.orders FOR SELECT
USING (auth.uid() = buyer_user_id);

CREATE POLICY "Sellers can view orders for their products"
ON public.orders FOR SELECT
USING (auth.uid() = seller_user_id);

CREATE POLICY "Authenticated users can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = buyer_user_id);

CREATE POLICY "Sellers can update order status"
ON public.orders FOR UPDATE
USING (auth.uid() = seller_user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_reviews_business_user ON public.business_reviews(business_user_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_product ON public.business_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_service ON public.business_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_business_reviews_updated_at
BEFORE UPDATE ON public.business_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();