import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  Star,
  TrendingUp,
  Plus,
  MessageSquare,
  Users,
  BarChart3,
} from "lucide-react";
import { AIMarketingAssistant } from "@/components/ai/AIMarketingAssistant";
import { AICampaignGenerator } from "@/components/ai/AICampaignGenerator";

const ServiceDashboard = () => {
  const stats = [
    { label: "Active Services", value: "8", icon: Briefcase, change: "+1 this week" },
    { label: "Pending Leads", value: "12", icon: Users, change: "3 new today" },
    { label: "This Month Revenue", value: "₹32,450", icon: TrendingUp, change: "+22% vs last month" },
    { label: "Avg. Rating", value: "4.8", icon: Star, change: "95% positive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-service/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-service" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your services and clients</p>
            </div>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-premium transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-service/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-service" />
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
                <Calendar className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">AI Portfolio Builder</h3>
                <p className="text-sm opacity-80">
                  Automatically generate a professional portfolio for your services
                </p>
              </div>
            </div>
            <AICampaignGenerator userType="service" />
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Leads</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-service/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-service" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Client Request {i}</h4>
                    <p className="text-sm text-muted-foreground">Web Design • Budget: ₹15,000</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Service Performance */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-service" />
              <h3 className="text-xl font-bold">Performance</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Response Rate</span>
                  <span className="text-sm font-bold">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-service h-2 rounded-full" style={{ width: "94%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Booking Rate</span>
                  <span className="text-sm font-bold">68%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-service h-2 rounded-full" style={{ width: "68%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Client Satisfaction</span>
                  <span className="text-sm font-bold">Excellent</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Marketing Assistant Chat */}
      <AIMarketingAssistant userType="service" />
    </div>
  );
};

export default ServiceDashboard;
