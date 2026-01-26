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
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BusinessProfile {
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  bio: string | null;
  avatar_url: string | null;
  email?: string | null;
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

export const BusinessDetailModal = ({ open, onOpenChange, item, type }: BusinessDetailModalProps) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && item) {
      fetchSellerProfile();
    }
  }, [open, item]);

  const fetchSellerProfile = async () => {
    if (!item) return;
    
    setLoading(true);
    try {
      // Fetch the seller's profile using the public_profiles view
      const table = type === "product" ? "products" : "services";
      
      // First get the user_id from the item
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

      // Then fetch the profile from public_profiles view
      const { data: profileData, error: profileError } = await supabase
        .from("public_profiles")
        .select("full_name, business_name, business_type, bio, avatar_url")
        .eq("user_id", itemData.user_id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setProfile(null);
        return;
      }

      setProfile(profileData);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard 
                  icon={Mail} 
                  label="Email" 
                  value="Contact via platform" 
                />
                <InfoCard 
                  icon={Phone} 
                  label="Phone" 
                  value="Available on request" 
                />
                <InfoCard 
                  icon={Globe} 
                  label="Website" 
                  value={null}
                  isLink 
                />
                <InfoCard 
                  icon={MapPin} 
                  label="Location" 
                  value="India" 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Sign in to message the seller directly
              </p>
            </Card>

            {/* Business Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Business Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard icon={Star} label="Rating" value="4.5" />
                <MetricCard icon={Users} label="Reviews" value="12" />
                <MetricCard icon={ShoppingCart} label="Orders" value="45+" />
                <MetricCard icon={IndianRupee} label="Revenue" value="₹50K+" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center italic">
                Metrics are approximate and updated periodically
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
