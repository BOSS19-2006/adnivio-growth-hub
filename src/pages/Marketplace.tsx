import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Search,
  Package,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Filter,
  Loader2,
  ShoppingBag,
  Star,
  MapPin,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  image_url: string | null;
  ai_description: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  category: string | null;
  image_url: string | null;
  ai_description: string | null;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const [productsRes, servicesRes] = await Promise.all([
        supabase.from("products").select("*").eq("status", "active"),
        supabase.from("services").select("*").eq("status", "active"),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = {
    products: [...new Set(products.map((p) => p.category).filter(Boolean))],
    services: [...new Set(services.map((s) => s.category).filter(Boolean))],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-teal flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Adnivio
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="font-medium text-foreground"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/onboarding")}
              className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white font-medium shadow-sm"
            >
              Get Started
              <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-8 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsla(199,89%,48%,0.25),transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 py-8 md:py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 text-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span className="font-medium text-white">Marketplace</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
              Discover Amazing Products & Services
            </h1>
            <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto">
              Explore offerings from thousands of SMEs across India
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search products or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white/95 border-0 shadow-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12 container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Products
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredProducts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Services
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredServices.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(activeTab === "products"
              ? categories.products
              : categories.services
            ).map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSearchQuery(cat || "")}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="products" className="mt-0">
                {filteredProducts.length === 0 ? (
                  <EmptyState type="products" onCTA={() => navigate("/onboarding")} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                {filteredServices.length === 0 ? (
                  <EmptyState type="services" onCTA={() => navigate("/onboarding")} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-blue/5 via-transparent to-teal/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-6 md:p-8 text-center border-0 bg-white shadow-elevated">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-2 text-foreground">
              Want to List Your Products or Services?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Join thousands of SMEs growing with Adnivio's AI-powered marketing
            </p>
            <Button
              onClick={() => navigate("/onboarding")}
              className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white font-semibold shadow-md"
            >
              Start Selling Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-teal flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-foreground">Adnivio</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Adnivio. AI-powered SME growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden hover-lift cursor-pointer group border border-border/50 hover:border-primary/30 transition-all">
      <div className="aspect-square bg-secondary/30 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        {product.category && (
          <Badge className="absolute top-2 left-2 bg-white/90 text-foreground text-xs">
            {product.category}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {product.ai_description || product.description || "No description available"}
        </p>
        <div className="flex items-center justify-between">
          {product.price && (
            <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.5</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => navigate("/auth")}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

// Service Card Component
const ServiceCard = ({ service }: { service: Service }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden hover-lift cursor-pointer group border border-border/50 hover:border-teal/30 transition-all">
      <div className="aspect-video bg-gradient-to-br from-teal/10 to-blue/10 relative overflow-hidden">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        {service.category && (
          <Badge className="absolute top-2 left-2 bg-white/90 text-foreground text-xs">
            {service.category}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-teal transition-colors">
          {service.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {service.ai_description || service.description || "No description available"}
        </p>
        <div className="flex items-center justify-between">
          {service.price_range && (
            <span className="font-bold text-teal">{service.price_range}</span>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>India</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => navigate("/auth")}
        >
          Contact Provider
        </Button>
      </div>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ type, onCTA }: { type: string; onCTA: () => void }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
      {type === "products" ? (
        <Package className="w-8 h-8 text-muted-foreground" />
      ) : (
        <Briefcase className="w-8 h-8 text-muted-foreground" />
      )}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      No {type} found
    </h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
      Be the first to list your {type} on Adnivio and reach thousands of potential customers.
    </p>
    <Button onClick={onCTA} className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white">
      List Your {type === "products" ? "Product" : "Service"}
      <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </div>
);

export default Marketplace;
