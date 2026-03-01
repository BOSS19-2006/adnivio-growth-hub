import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  Briefcase,
  IndianRupee,
  Star,
  Users,
  ShoppingCart,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BusinessProfile {
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

interface BusinessMetrics {
  avgRating: number | null;
  totalReviews: number;
  totalOrders: number;
}

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

interface BusinessDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProductItem | ServiceItem | null;
  type: "product" | "service";
}

const InfoCard = ({ icon: Icon, label, value, isLink = false }: { 
  icon: React.ElementType; 
  label: string; 
  value: string | null | undefined;
  isLink?: boolean;
}) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="p-2 bg-primary/10 rounded-md">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLink ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-foreground truncate">{value}</p>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value }: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
}) => (
  <Card className="p-3 text-center border-border/50">
    <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
    <p className="text-lg font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </Card>
);

const formatLocation = (street: string | null, city: string | null, state: string | null, country: string | null): string | null => {
  const parts = [street, city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
};

export const BusinessDetailModal = ({ open, onOpenChange, item, type }: BusinessDetailModalProps) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [metrics, setMetrics] = useState<BusinessMetrics>({ avgRating: null, totalReviews: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(false);
  const [sellerUserId, setSellerUserId] = useState<string | null>(null);

  useEffect(() => {
    if (open && item) {
      fetchSellerData();
    }
  }, [open, item]);

  const fetchSellerData = async () => {
    if (!item) return;
    
    setLoading(true);
    try {
      const table = type === "product" ? "products" : "services";
      
      // Get the user_id from the item
      const { data: itemData, error: itemError } = await supabase
        .from(table)
        .select("user_id")
        .eq("id", item.id)
        .single();

      if (itemError || !itemData?.user_id) {
        console.error("Error fetching item:", itemError);
        setProfile(null);
        return;
      }

      setSellerUserId(itemData.user_id);

      // Fetch profile, reviews, and orders in parallel
      const [profileResult, reviewsResult, ordersResult] = await Promise.all([
        supabase
          .from("public_profiles")
          .select("full_name, business_name, business_type, bio, avatar_url, phone, website, email, street_address, city, state, country")
          .eq("user_id", itemData.user_id)
          .single(),
        supabase
          .from("business_reviews")
          .select("rating")
          .eq("business_user_id", itemData.user_id),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("seller_user_id", itemData.user_id)
      ]);

      if (profileResult.error) {
        console.error("Error fetching profile:", profileResult.error);
        setProfile(null);
      } else {
        setProfile(profileResult.data);
      }

      // Calculate metrics
      const reviews = reviewsResult.data || [];
      const totalReviews = reviews.length;
      const avgRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : null;
      
      setMetrics({
        avgRating,
        totalReviews,
        totalOrders: ordersResult.count || 0
      });

    } catch (error) {
      console.error("Error:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const isProduct = type === "product";
  const price = isProduct 
    ? (item as ProductItem)?.price 
    : null;
  const priceRange = !isProduct 
    ? (item as ServiceItem)?.price_range 
    : null;

  const location = profile ? formatLocation(profile.street_address, profile.city, profile.state, profile.country) : null;
  const hasContactInfo = profile?.email || profile?.phone || profile?.website || location;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isProduct ? (
              <Package className="w-5 h-5 text-primary" />
            ) : (
              <Briefcase className="w-5 h-5 text-accent-foreground" />
            )}
            {isProduct ? "Product Details" : "Service Details"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Item Image & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48 h-48 bg-muted rounded-lg overflow-hidden shrink-0">
                {item?.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {isProduct ? (
                      <Package className="w-12 h-12 text-muted-foreground/50" />
                    ) : (
                      <Briefcase className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{item?.name}</h2>
                  {item?.category && (
                    <Badge variant="secondary" className="mt-1">
                      {item.category}
                    </Badge>
                  )}
                </div>
                
                {(price || priceRange) && (
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-4 h-4" />
                    {price ? price.toLocaleString() : priceRange}
                  </div>
                )}
                
                {item?.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {/* Business Identity Section */}
            <Card className="p-4 border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Business Identity
              </h3>
              
              <div className="flex items-start gap-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.business_name || "Business"}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">
                      {profile?.business_name || profile?.full_name || "Business"}
                    </h4>
                    <BadgeCheck className="w-4 h-4 text-primary" />
                  </div>
                  
                  {profile?.business_type && (
                    <Badge variant="outline" className="text-xs">
                      {profile.business_type}
                    </Badge>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item?.category && (
                      <Badge className="bg-primary/10 text-primary text-xs hover:bg-primary/20">
                        {item.category}
                      </Badge>
                    )}
                    <Badge className="bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80">
                      {isProduct ? "Product Seller" : "Service Provider"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Description */}
            {profile?.bio && (
              <Card className="p-4 border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  About the Business
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="p-4 border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Contact Information
              </h3>
              {hasContactInfo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoCard 
                    icon={Mail} 
                    label="Email" 
                    value={profile?.email} 
                  />
                  <InfoCard 
                    icon={Phone} 
                    label="Phone" 
                    value={profile?.phone} 
                  />
                  <InfoCard 
                    icon={Globe} 
                    label="Website" 
                    value={profile?.website}
                    isLink 
                  />
                  <InfoCard 
                    icon={MapPin} 
                    label="Location" 
                    value={location} 
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No contact information provided. Sign in to message the seller directly.
                </p>
              )}
            </Card>

            {/* Business Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Business Metrics
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <MetricCard 
                  icon={Star} 
                  label="Rating" 
                  value={metrics.avgRating ? metrics.avgRating.toFixed(1) : "N/A"} 
                />
                <MetricCard 
                  icon={Users} 
                  label="Reviews" 
                  value={metrics.totalReviews} 
                />
                <MetricCard 
                  icon={ShoppingCart} 
                  label="Orders" 
                  value={metrics.totalOrders} 
                />
              </div>
              {metrics.totalReviews === 0 && metrics.totalOrders === 0 && (
                <p className="text-xs text-muted-foreground mt-2 text-center italic">
                  New seller - no metrics yet
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
