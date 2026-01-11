-- Create investor_profiles table
CREATE TABLE public.investor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_range_min numeric DEFAULT 100000,
  investment_range_max numeric DEFAULT 10000000,
  preferred_industries text[] DEFAULT '{}',
  preferred_stages text[] DEFAULT '{}',
  bio text,
  company_name text,
  website text,
  verified boolean DEFAULT false,
  total_investments integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create investment_listings table (SMEs raising funds)
CREATE TABLE public.investment_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  industry text NOT NULL,
  description text,
  funding_required numeric NOT NULL,
  equity_offered numeric,
  use_of_funds text,
  revenue numeric DEFAULT 0,
  users_count integer DEFAULT 0,
  growth_rate numeric DEFAULT 0,
  stage text DEFAULT 'early',
  location text,
  pitch_deck_url text,
  status text DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create investor_connections table
CREATE TABLE public.investor_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.investment_listings(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(investor_id, listing_id)
);

-- Enable RLS
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_connections ENABLE ROW LEVEL SECURITY;

-- Investor profiles policies
CREATE POLICY "Users can manage own investor profile" ON public.investor_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified investors" ON public.investor_profiles
  FOR SELECT USING (verified = true);

-- Investment listings policies  
CREATE POLICY "Users can manage own listings" ON public.investment_listings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Investors can view active listings" ON public.investment_listings
  FOR SELECT USING (status = 'active');

-- Investor connections policies
CREATE POLICY "Investors can manage connections" ON public.investor_connections
  FOR ALL USING (auth.uid() = investor_id) WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Listing owners can view connections" ON public.investor_connections
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.investment_listings WHERE id = listing_id AND user_id = auth.uid()));

-- Triggers
CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON public.investor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investment_listings_updated_at BEFORE UPDATE ON public.investment_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investor_connections_updated_at BEFORE UPDATE ON public.investor_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();