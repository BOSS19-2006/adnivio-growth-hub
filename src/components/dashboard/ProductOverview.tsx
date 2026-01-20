import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  TrendingUp,
  DollarSign,
  Zap,
  BarChart3,
  Target,
} from "lucide-react";
import { AIProductGenerator } from "@/components/ai/AIProductGenerator";
import { AICampaignGenerator } from "@/components/ai/AICampaignGenerator";
import ProductUploadForm from "@/components/products/ProductUploadForm";
import CampaignLauncher from "@/components/campaigns/CampaignLauncher";

const ProductOverview = () => {
  const stats = [
    { label: "Total Products", value: "12", icon: Package, change: "+2 this week" },
    { label: "Active Campaigns", value: "5", icon: Target, change: "3 performing well" },
    { label: "Total Revenue", value: "₹45,230", icon: DollarSign, change: "+18% vs last month" },
    { label: "Impressions", value: "128K", icon: TrendingUp, change: "+25% this week" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">Your product marketing at a glance</p>
        </div>
        <div className="flex gap-2">
          <ProductUploadForm />
          <CampaignLauncher userType="product" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 md:p-6 bg-white hover:shadow-elevated transition-shadow border-border">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{stat.change}</span>
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* AI Campaign Generator - Hero Feature */}
      <Card className="p-4 md:p-6 bg-gradient-hero text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold mb-0.5 md:mb-1">AI Campaign Generator</h3>
              <p className="text-xs md:text-sm text-white/80">
                Let AI create optimized ad campaigns
              </p>
            </div>
          </div>
          <AICampaignGenerator userType="product" />
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Products */}
        <Card className="lg:col-span-2 p-4 md:p-6 bg-white border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-foreground">Recent Products</h3>
            <div className="flex gap-2">
              <AIProductGenerator />
              <Button variant="ghost" size="sm" className="text-xs md:text-sm">View All</Button>
            </div>
          </div>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm md:text-base mb-0.5 md:mb-1 truncate">Product Name {i}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Category • ₹1,299</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs md:text-sm hidden sm:flex">Edit</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Insights */}
        <Card className="p-4 md:p-6 bg-white border-border">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <h3 className="text-lg md:text-xl font-bold text-foreground">Performance</h3>
          </div>
          <div className="space-y-4 md:space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm text-foreground">Conversion Rate</span>
                <span className="text-xs md:text-sm font-bold text-foreground">3.2%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 md:h-2">
                <div className="bg-primary h-1.5 md:h-2 rounded-full" style={{ width: "32%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm text-foreground">Ad Performance</span>
                <span className="text-xs md:text-sm font-bold text-foreground">8.5/10</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 md:h-2">
                <div className="bg-primary h-1.5 md:h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm text-foreground">Investor Interest</span>
                <span className="text-xs md:text-sm font-bold text-foreground">High</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 md:h-2">
                <div className="bg-teal h-1.5 md:h-2 rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductOverview;