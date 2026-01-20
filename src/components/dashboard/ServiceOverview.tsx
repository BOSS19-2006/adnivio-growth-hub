import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  Star,
  TrendingUp,
  MessageSquare,
  Users,
  BarChart3,
} from "lucide-react";
import { AICampaignGenerator } from "@/components/ai/AICampaignGenerator";
import ServiceUploadForm from "@/components/services/ServiceUploadForm";
import CampaignLauncher from "@/components/campaigns/CampaignLauncher";

const ServiceOverview = () => {
  const stats = [
    { label: "Active Services", value: "8", icon: Briefcase, change: "+1 this week" },
    { label: "Pending Leads", value: "12", icon: Users, change: "3 new today" },
    { label: "This Month Revenue", value: "₹32,450", icon: TrendingUp, change: "+22% vs last month" },
    { label: "Avg. Rating", value: "4.8", icon: Star, change: "95% positive" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Overview</h2>
          <p className="text-sm text-muted-foreground">Your service business at a glance</p>
        </div>
        <div className="flex gap-2">
          <ServiceUploadForm />
          <CampaignLauncher userType="service" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 md:p-6 hover:shadow-premium transition-shadow">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-service/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-service" />
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{stat.change}</span>
            </div>
            <h3 className="text-xl md:text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-4 md:p-6 bg-gradient-premium text-primary-foreground">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold mb-0.5 md:mb-1">AI Lead Campaign</h3>
              <p className="text-xs md:text-sm opacity-80">
                Generate client acquisition campaigns
              </p>
            </div>
          </div>
          <AICampaignGenerator userType="service" />
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold">Recent Leads</h3>
            <Button variant="ghost" size="sm" className="text-xs md:text-sm w-fit">View All</Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-service/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-service" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1 truncate">Client Request {i}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Web Design • Budget: ₹15,000</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex text-xs md:text-sm">
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Respond</span>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Service Performance */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-service" />
            <h3 className="text-lg md:text-xl font-bold">Performance</h3>
          </div>
          <div className="space-y-4 md:space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm">Response Rate</span>
                <span className="text-xs md:text-sm font-bold">94%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 md:h-2">
                <div className="bg-service h-1.5 md:h-2 rounded-full" style={{ width: "94%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm">Booking Rate</span>
                <span className="text-xs md:text-sm font-bold">68%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 md:h-2">
                <div className="bg-service h-1.5 md:h-2 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm">Client Satisfaction</span>
                <span className="text-xs md:text-sm font-bold">Excellent</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 md:h-2">
                <div className="bg-accent h-1.5 md:h-2 rounded-full" style={{ width: "96%" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ServiceOverview;
