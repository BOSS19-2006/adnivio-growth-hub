import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import {
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Wallet,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
  Briefcase,
  ChevronRight,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: "product" | "service";
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout = ({ children, type, activeTab, onTabChange }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "items", label: type === "product" ? "Products" : "Services", icon: type === "product" ? Package : Briefcase },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    { id: "investors", label: "Investors", icon: Users },
  ];

  const accentBg = type === "product" ? "bg-primary/10" : "bg-teal/10";
  const accentText = type === "product" ? "text-primary" : "text-teal";

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-white shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/marketplace")}
        >
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">Adnivio</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-border shadow-sm transform transition-transform lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div 
              className="hidden lg:flex items-center gap-3 p-6 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => navigate("/marketplace")}
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">Adnivio</span>
            </div>

            {/* User Type Badge */}
            <div className="p-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${accentBg} border border-primary/10`}>
                {type === "product" ? (
                  <Package className={`w-5 h-5 ${accentText}`} />
                ) : (
                  <Briefcase className={`w-5 h-5 ${accentText}`} />
                )}
                <div className="flex-1">
                  <span className="font-semibold text-sm text-foreground">
                    {type === "product" ? "Product Provider" : "Service Provider"}
                  </span>
                  <p className="text-xs text-muted-foreground">SME Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start h-11 px-4 font-medium transition-all ${
                      isActive 
                        ? `${accentBg} ${accentText} border-l-2 border-primary rounded-l-none` 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? accentText : ""}`} />
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="p-4 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-14 px-3 hover:bg-secondary">
                    <Avatar className="w-9 h-9 mr-3 border-2 border-border">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground truncate">{user?.email?.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="h-10">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive h-10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto min-h-screen">
          {/* Desktop notification bar */}
          <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-white sticky top-0 z-10">
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{user?.email?.split('@')[0]}</span>
            </div>
            <NotificationCenter />
          </div>
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;