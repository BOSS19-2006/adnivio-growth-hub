import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  Search,
  MessageSquare,
  Star,
  Building2,
  DollarSign,
  Filter,
  ArrowUpRight,
} from "lucide-react";

const InvestorHub = () => {
  const topPerformers = [
    {
      name: "TechGadgets Pro",
      type: "Product",
      revenue: "₹4.5L",
      growth: "+45%",
      rating: 4.9,
      industry: "Electronics",
    },
    {
      name: "WebCraft Studios",
      type: "Service",
      revenue: "₹2.8L",
      growth: "+38%",
      rating: 4.8,
      industry: "Web Development",
    },
    {
      name: "EcoHome Products",
      type: "Product",
      revenue: "₹3.2L",
      growth: "+52%",
      rating: 4.7,
      industry: "Home & Living",
    },
    {
      name: "DigitalMark Agency",
      type: "Service",
      revenue: "₹1.9L",
      growth: "+28%",
      rating: 4.9,
      industry: "Marketing",
    },
  ];

  const investors = [
    { name: "Venture Capital Fund", focus: "Tech Startups", investments: 45 },
    { name: "Growth Partners", focus: "SME Scale-ups", investments: 82 },
    { name: "Angel Network", focus: "Early Stage", investments: 124 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Investor Connect Hub</h2>
          <p className="text-sm text-muted-foreground">Connect with investors based on performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search businesses..." className="pl-10 w-full sm:w-64" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">Active Investors</p>
              <p className="text-lg md:text-2xl font-bold">247</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">Total Funded</p>
              <p className="text-lg md:text-2xl font-bold">₹12.5Cr</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-sm text-muted-foreground truncate">Success Rate</p>
              <p className="text-lg md:text-2xl font-bold">78%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Top Performing Businesses */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              Top Performing Businesses
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            <div className="space-y-3 md:space-y-4">
              {topPerformers.map((business, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm md:text-base">
                        {business.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm md:text-base truncate">{business.name}</h4>
                        <Badge variant="secondary" className="text-[10px] md:text-xs">
                          {business.type}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">{business.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-sm md:text-base">{business.revenue}/mo</p>
                      <p className="text-xs md:text-sm text-green-600">{business.growth}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-accent fill-accent" />
                      <span className="font-medium text-sm">{business.rating}</span>
                    </div>
                    <Button size="sm" className="text-xs md:text-sm hidden sm:flex">
                      <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Investors */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Building2 className="w-4 h-4 md:w-5 md:h-5" />
              Active Investors
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            <div className="space-y-3 md:space-y-4">
              {investors.map((investor, index) => (
                <div key={index} className="p-3 md:p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm md:text-base mb-1">{investor.name}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">{investor.focus}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">{investor.investments} investments</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View
                      <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Visibility */}
      <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">Increase Your Visibility</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Top-performing businesses appear here automatically. Improve your metrics to attract investors.
              </p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs md:text-sm w-full sm:w-auto">
              View Performance Tips
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorHub;
