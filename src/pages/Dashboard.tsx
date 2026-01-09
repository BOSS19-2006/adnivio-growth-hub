import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductOverview from "@/components/dashboard/ProductOverview";
import ServiceOverview from "@/components/dashboard/ServiceOverview";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import WalletDashboard from "@/components/wallet/WalletDashboard";
import { AIMarketingAssistant } from "@/components/ai/AIMarketingAssistant";
import InvestorHub from "@/components/investors/InvestorHub";
import MessagingCenter from "@/components/messaging/MessagingCenter";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { type } = useParams<{ type: "product" | "service" }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const dashboardType = type === "service" ? "service" : "product";

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return dashboardType === "product" ? <ProductOverview /> : <ServiceOverview />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "wallet":
        return <WalletDashboard />;
      case "ai-assistant":
        return <AIMarketingAssistant userType={dashboardType} isFullPage />;
      case "investors":
        return <InvestorHub />;
      case "messages":
        return <MessagingCenter />;
      default:
        return dashboardType === "product" ? <ProductOverview /> : <ServiceOverview />;
    }
  };

  return (
    <DashboardLayout type={dashboardType} activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
