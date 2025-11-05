import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  Users,
  ArrowRight,
  Package,
  Briefcase,
  BarChart3,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Marketing",
      description: "Let AI create, optimize, and manage your campaigns automatically",
    },
    {
      icon: Target,
      title: "Smart Ad Management",
      description: "Run campaigns across Meta, Google, and YouTube from one dashboard",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track performance, ROI, and get AI-driven optimization suggestions",
    },
    {
      icon: Users,
      title: "Investor Connect",
      description: "High-performing businesses get matched with relevant investors",
    },
  ];

  const userTypes = [
    {
      icon: Package,
      title: "Product Providers",
      description: "Sell physical goods with AI-powered product marketing and sales tracking",
      color: "product",
    },
    {
      icon: Briefcase,
      title: "Service Providers",
      description: "Market your services, manage leads, and build your reputation",
      color: "service",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDMwYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">AI-Powered Growth Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Advertise Smarter.
              <br />
              <span className="text-accent">Sell Faster.</span>
              <br />
              Grow Bigger.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The complete AI-driven marketing ecosystem for SMEs. Combine product marketing,
              service promotion, and investor connection — all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 shadow-glow"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Built for Every Business Type</h2>
          <p className="text-xl text-muted-foreground">
            Tailored dashboards and tools for your specific needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {userTypes.map((type, index) => (
            <Card key={index} className="p-8 hover:shadow-premium transition-all duration-300 hover:scale-105">
              <div className={`w-16 h-16 bg-${type.color}/10 rounded-lg flex items-center justify-center mb-6`}>
                <type.icon className={`w-8 h-8 text-${type.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
              <p className="text-muted-foreground">{type.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Grow</h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to accelerate your business growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-premium transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-premium">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30 mb-4">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">Zero Commission Policy</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Ready to Transform Your Business?
            </h2>
            
            <p className="text-xl text-primary-foreground/80">
              Join thousands of SMEs already growing with Adnivio
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 shadow-glow"
            >
              Start Your Free Trial
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
