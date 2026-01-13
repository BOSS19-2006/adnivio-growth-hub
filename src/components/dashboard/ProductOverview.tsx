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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Overview</h2>
          <p className="text-muted-foreground">Your product marketing at a glance</p>
        </div>
        <div className="flex gap-2">
          <ProductUploadForm />
          <CampaignLauncher userType="product" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white hover:shadow-elevated transition-shadow border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* AI Campaign Generator - Hero Feature */}
      <Card className="p-6 bg-gradient-hero text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">AI Campaign Generator</h3>
              <p className="text-sm text-white/80">
                Let AI create optimized ad campaigns for your products
              </p>
            </div>
          </div>
          <AICampaignGenerator userType="product" />
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <Card className="lg:col-span-2 p-6 bg-white border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Products</h3>
            <div className="flex gap-2">
              <AIProductGenerator />
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-16 h-16 bg-secondary rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Product Name {i}</h4>
                  <p className="text-sm text-muted-foreground">Category • ₹1,299</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Insights */}
        <Card className="p-6 bg-white border-border">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Performance</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Conversion Rate</span>
                <span className="text-sm font-bold text-foreground">3.2%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Ad Performance</span>
                <span className="text-sm font-bold text-foreground">8.5/10</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Investor Interest</span>
                <span className="text-sm font-bold text-foreground">High</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductOverview;