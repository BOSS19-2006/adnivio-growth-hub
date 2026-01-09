import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Target,
  Zap,
} from "lucide-react";

// Mock data for demonstration
const performanceData = [
  { name: "Mon", impressions: 4000, clicks: 240, conversions: 24, revenue: 2400 },
  { name: "Tue", impressions: 3000, clicks: 198, conversions: 21, revenue: 2210 },
  { name: "Wed", impressions: 5000, clicks: 380, conversions: 38, revenue: 3800 },
  { name: "Thu", impressions: 2780, clicks: 190, conversions: 20, revenue: 2000 },
  { name: "Fri", impressions: 4890, clicks: 380, conversions: 35, revenue: 3500 },
  { name: "Sat", impressions: 6390, clicks: 430, conversions: 45, revenue: 4500 },
  { name: "Sun", impressions: 5490, clicks: 340, conversions: 32, revenue: 3200 },
];

const platformData = [
  { name: "Meta", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Google", value: 35, color: "hsl(var(--chart-2))" },
  { name: "YouTube", value: 20, color: "hsl(var(--chart-3))" },
];

const campaignData = [
  { name: "Summer Sale", impressions: 12500, clicks: 890, conversions: 89, roi: 3.2 },
  { name: "New Arrivals", impressions: 8900, clicks: 620, conversions: 52, roi: 2.8 },
  { name: "Flash Deal", impressions: 15200, clicks: 1100, conversions: 128, roi: 4.1 },
  { name: "Brand Awareness", impressions: 22000, clicks: 450, conversions: 32, roi: 1.5 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
}

const StatCard = ({ title, value, change, icon, prefix = "" }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {prefix}{value}
          </p>
          <div className={`flex items-center text-sm mt-2 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(change)}% vs last week
          </div>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState("7d");

  const stats = [
    { title: "Impressions", value: "31.5K", change: 12.5, icon: <Eye className="w-6 h-6 text-primary" /> },
    { title: "Clicks", value: "2,158", change: 8.2, icon: <MousePointer className="w-6 h-6 text-primary" /> },
    { title: "Conversions", value: "215", change: 15.3, icon: <ShoppingCart className="w-6 h-6 text-primary" /> },
    { title: "Revenue", value: "21,610", change: 18.7, icon: <DollarSign className="w-6 h-6 text-primary" />, prefix: "₹" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time performance insights</p>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Platform Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {platformData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="impressions" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicks" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            AI Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2">Increase Budget</h4>
              <p className="text-sm text-muted-foreground">
                Your "Flash Deal" campaign has 4.1x ROI. Consider increasing budget by ₹500 for potentially 3x more conversions.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2">Optimize Timing</h4>
              <p className="text-sm text-muted-foreground">
                Peak engagement detected on weekends. Schedule more ads between 6-9 PM for better reach.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2">Expand Audience</h4>
              <p className="text-sm text-muted-foreground">
                Consider targeting 25-34 age group on Meta. Similar businesses see 40% higher CTR.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
