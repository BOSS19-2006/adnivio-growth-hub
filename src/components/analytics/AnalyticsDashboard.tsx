import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Loader2,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { format } from "date-fns";

const platformData = [
  { name: "Meta", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Google", value: 35, color: "hsl(var(--chart-2))" },
  { name: "YouTube", value: 20, color: "hsl(var(--chart-3))" },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
  loading?: boolean;
}

const StatCard = ({ title, value, change, icon, prefix = "", loading }: StatCardProps) => (
  <Card>
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
          {loading ? (
            <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin mt-2" />
          ) : (
            <>
              <p className="text-lg md:text-2xl font-bold mt-1 truncate">
                {prefix}{value}
              </p>
              <div className={`flex items-center text-xs md:text-sm mt-1 md:mt-2 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
                <span className="hidden sm:inline">{Math.abs(change)}% vs last</span>
                <span className="sm:hidden">{Math.abs(change)}%</span>
              </div>
            </>
          )}
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>("7d");
  const { summary, trends, campaigns, loading } = useAnalytics(period);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const stats = [
    { 
      title: "Impressions", 
      value: summary ? formatNumber(summary.impressions) : "0", 
      change: 12.5, 
      icon: <Eye className="w-6 h-6 text-primary" /> 
    },
    { 
      title: "Clicks", 
      value: summary ? formatNumber(summary.clicks) : "0", 
      change: 8.2, 
      icon: <MousePointer className="w-6 h-6 text-primary" /> 
    },
    { 
      title: "Conversions", 
      value: summary ? formatNumber(summary.conversions) : "0", 
      change: 15.3, 
      icon: <ShoppingCart className="w-6 h-6 text-primary" /> 
    },
    { 
      title: "Revenue", 
      value: summary ? formatNumber(summary.revenue) : "0", 
      change: 18.7, 
      icon: <DollarSign className="w-6 h-6 text-primary" />, 
      prefix: "₹" 
    },
  ];

  const chartData = trends.map(t => ({
    name: format(new Date(t.date), 'MMM d'),
    impressions: t.impressions,
    clicks: t.clicks,
    conversions: t.conversions,
    revenue: t.revenue,
  }));

  const campaignChartData = campaigns.slice(0, 5).map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
    impressions: c.impressions,
    clicks: c.clicks,
    conversions: c.conversions,
    roi: parseFloat(c.roi),
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time performance insights</p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="h-9">
            <TabsTrigger value="24h" className="text-xs px-2 md:px-3">24h</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-2 md:px-3">7d</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-2 md:px-3">30d</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-2 md:px-3">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available for this period
              </div>
            )}
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
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : campaignChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignChartData}>
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No campaigns available. Create a campaign to see performance data.
            </div>
          )}
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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-card rounded-lg">
              <h4 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Increase Budget</h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                {campaigns.length > 0 && campaigns[0].roi 
                  ? `Your "${campaigns[0].name}" campaign has ${campaigns[0].roi}x ROI.`
                  : 'Create campaigns to get AI-powered recommendations.'
                }
              </p>
            </div>
            <div className="p-3 md:p-4 bg-card rounded-lg">
              <h4 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Optimize Timing</h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Peak engagement on weekends. Schedule ads between 6-9 PM.
              </p>
            </div>
            <div className="p-3 md:p-4 bg-card rounded-lg sm:col-span-2 md:col-span-1">
              <h4 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Expand Audience</h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Target 25-34 age group on Meta for 40% higher CTR.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
