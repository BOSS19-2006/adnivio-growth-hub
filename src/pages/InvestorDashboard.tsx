import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Building2,
  DollarSign,
  Users,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Loader2,
  LogOut,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  business_name: string;
  industry: string;
  description: string;
  funding_required: number;
  equity_offered: number | null;
  revenue: number;
  growth_rate: number;
  stage: string;
  location: string;
  user_id: string;
}

const InvestorDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("investment_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      setListings(data || []);
    }
    setLoadingListings(false);
  };

  const handleConnect = async (listingId: string) => {
    const { error } = await supabase.from("investor_connections").insert({
      investor_id: user?.id,
      listing_id: listingId,
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already connected", description: "You've already expressed interest in this listing." });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Connected!", description: "The business owner will be notified." });
    }
  };

  const filteredListings = listings.filter(
    (l) =>
      l.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="font-display font-bold text-xl">Adnivio</span>
              <Badge variant="outline" className="ml-2 text-gold border-gold/30">Investor</Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={() => signOut().then(() => navigate("/"))}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Listings", value: listings.length, icon: Building2 },
            { label: "Avg Funding", value: `₹${(listings.reduce((a, b) => a + b.funding_required, 0) / Math.max(listings.length, 1) / 100000).toFixed(1)}L`, icon: DollarSign },
            { label: "Industries", value: new Set(listings.map((l) => l.industry)).size, icon: Briefcase },
            { label: "Avg Growth", value: `${(listings.reduce((a, b) => a + b.growth_rate, 0) / Math.max(listings.length, 1)).toFixed(0)}%`, icon: TrendingUp },
          ].map((stat, i) => (
            <Card key={i} className="p-4 border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by business or industry..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Listings */}
        <h2 className="text-2xl font-display font-bold mb-6">Investment Opportunities</h2>
        {loadingListings ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground text-sm">Check back soon for new investment opportunities.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="p-6 hover:shadow-elevated transition-shadow border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{listing.business_name}</h3>
                    <Badge variant="secondary" className="mt-1">{listing.industry}</Badge>
                  </div>
                  <Badge className="bg-gold/10 text-gold border-gold/20">{listing.stage}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{listing.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>₹{(listing.funding_required / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{listing.growth_rate}% growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span>₹{(listing.revenue / 100000).toFixed(1)}L rev</span>
                  </div>
                  {listing.equity_offered && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{listing.equity_offered}% equity</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gold hover:bg-gold-dark text-accent-foreground" onClick={() => handleConnect(listing.id)}>
                    Connect <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;