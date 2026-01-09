import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  TrendingUp,
  DollarSign,
  Zap,
  Plus,
  BarChart3,
  Target,
  Users,
} from "lucide-react";
import { AIMarketingAssistant } from "@/components/ai/AIMarketingAssistant";
import { AIProductGenerator } from "@/components/ai/AIProductGenerator";
import { AICampaignGenerator } from "@/components/ai/AICampaignGenerator";

const ProductDashboard = () => {
  const stats = [
    { label: "Total Products", value: "12", icon: Package, change: "+2 this week" },
    { label: "Active Campaigns", value: "5", icon: Target, change: "3 performing well" },
    { label: "Total Revenue", value: "₹45,230", icon: DollarSign, change: "+18% vs last month" },
    { label: "Impressions", value: "128K", icon: TrendingUp, change: "+25% this week" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-product/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-product" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Product Provider Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your products and campaigns</p>
            </div>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-premium transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-product/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-product" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8 bg-gradient-premium text-primary-foreground">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">AI Campaign Generator</h3>
                <p className="text-sm opacity-80">
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
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Products</h3>
              <div className="flex gap-2">
                <AIProductGenerator />
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Product Name {i}</h4>
                    <p className="text-sm text-muted-foreground">Category • ₹1,299</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-product" />
              <h3 className="text-xl font-bold">Performance</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="text-sm font-bold">3.2%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-product h-2 rounded-full" style={{ width: "32%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Ad Performance</span>
                  <span className="text-sm font-bold">8.5/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-product h-2 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Investor Interest</span>
                  <span className="text-sm font-bold">High</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Marketing Assistant Chat */}
      <AIMarketingAssistant userType="product" />
    </div>
  );
};

export default ProductDashboard;
