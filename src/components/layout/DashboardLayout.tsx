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
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    { id: "investors", label: "Investors", icon: Users },
  ];

  const accentColor = type === "product" ? "product" : "service";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="font-bold text-lg">Adnivio</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-2 p-6 border-b">
              <Sparkles className="w-8 h-8 text-accent" />
              <span className="font-bold text-xl">Adnivio</span>
            </div>

            {/* User Type Badge */}
            <div className="p-4">
              <div className={`flex items-center gap-2 p-3 rounded-lg bg-${accentColor}/10`}>
                {type === "product" ? (
                  <Package className={`w-5 h-5 text-${accentColor}`} />
                ) : (
                  <Briefcase className={`w-5 h-5 text-${accentColor}`} />
                )}
                <span className="font-medium">
                  {type === "product" ? "Product Provider" : "Service Provider"}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id ? `bg-${accentColor}/10 text-${accentColor}` : ""
                  }`}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="p-4 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Avatar className="w-8 h-8 mr-3">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
