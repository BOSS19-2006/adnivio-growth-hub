import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  Briefcase,
  Sparkles,
  ArrowLeft,
  ArrowUpDown,
  Clock,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessDetailModal } from "@/components/marketplace/BusinessDetailModal";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "popular";

const productCategories = ["Electronics", "Fashion", "Home & Garden", "Food & Beverages", "Health & Beauty", "Other"];
const serviceCategories = ["Consulting", "Design", "Development", "Marketing", "Writing", "Other"];

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  
  // Business Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | Service | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<"product" | "service">("product");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const [productsRes, servicesRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, description, price, category, image_url, created_at")
          .eq("status", "active"),
        supabase
          .from("services")
          .select("id, name, description, price_range, category, image_url, created_at")
          .eq("status", "active"),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const parsePriceRange = (priceRange: string | null): number => {
    if (!priceRange) return 0;
    const match = priceRange.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortItems = <T extends { created_at: string; price?: number | null; price_range?: string | null }>(
    items: T[]
  ): T[] => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          const priceA = 'price' in a ? (a.price ?? 0) : parsePriceRange(a.price_range ?? null);
          const priceB = 'price' in b ? (b.price ?? 0) : parsePriceRange(b.price_range ?? null);
          return priceA - priceB;
        case "price-high":
          const priceAHigh = 'price' in a ? (a.price ?? 0) : parsePriceRange(a.price_range ?? null);
          const priceBHigh = 'price' in b ? (b.price ?? 0) : parsePriceRange(b.price_range ?? null);
          return priceBHigh - priceAHigh;
        case "popular":
          // For now, use created_at as proxy for popularity (newer = more visible)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    return sortItems(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const filteredServices = useMemo(() => {
    let filtered = services.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }
    return sortItems(filtered);
  }, [services, searchQuery, selectedCategory, sortBy]);

  const categories = activeTab === "products" ? productCategories : serviceCategories;

  const handleItemClick = (item: Product | Service, type: "product" | "service") => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setDetailModalOpen(true);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="overflow-hidden hover-lift group cursor-pointer border border-border/50 hover:border-primary/30 transition-all"
      onClick={() => handleItemClick(product, "product")}
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground/50" />
          </div>
        )}
        {product.category && (
          <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs">
            {product.category}
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          {product.price && (
            <span className="text-base font-bold text-primary flex items-center">
              <IndianRupee className="w-3.5 h-3.5" />
              {product.price.toLocaleString()}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(product.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card 
      className="overflow-hidden hover-lift group cursor-pointer border border-border/50 hover:border-primary/30 transition-all"
      onClick={() => handleItemClick(service, "service")}
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/50" />
          </div>
        )}
        {service.category && (
          <Badge className="absolute top-2 left-2 bg-teal-500/90 text-white text-xs">
            {service.category}
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          {service.price_range && (
            <span className="text-sm font-semibold text-teal-600">{service.price_range}</span>
          )}
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(service.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground hidden sm:block">
                Marketplace
              </span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm"
          >
            Sign In to Sell
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search, Sort & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products & services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="price-low">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Price: Low to High
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Price: High to Low
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setSelectedCategory(null);
          }}
        >
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Be the first to list a product!"}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No services found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Be the first to list a service!"}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Business Detail Modal */}
      <BusinessDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        item={selectedItem}
        type={selectedItemType}
      />
    </div>
  );
};

export default Marketplace;
