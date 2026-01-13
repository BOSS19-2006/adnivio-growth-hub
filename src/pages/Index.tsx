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
  Shield,
  Coins,
  Rocket,
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
      title: "SME - Product Sellers",
      description: "Physical goods, inventory, and e-commerce solutions with AI-powered marketing",
      gradient: "from-blue/5 to-blue-light/5",
      accent: "text-blue",
      bgAccent: "bg-blue/10",
      isPrimary: true,
    },
    {
      icon: Briefcase,
      title: "SME - Service Providers",
      description: "Freelancing, consulting, and professional services with lead generation",
      gradient: "from-teal/5 to-teal-light/5",
      accent: "text-teal",
      bgAccent: "bg-teal/10",
      isPrimary: true,
    },
    {
      icon: TrendingUp,
      title: "Investors",
      description: "Discover high-growth SMEs, access analytics, and connect with founders",
      gradient: "from-blue-light/5 to-teal/5",
      accent: "text-blue-light",
      bgAccent: "bg-blue-light/10",
      isPrimary: false,
    },
  ];

  const stats = [
    { value: "10K+", label: "Active SMEs" },
    { value: "₹50Cr+", label: "Revenue Generated" },
    { value: "500+", label: "Investor Connections" },
    { value: "98%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">Adnivio</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="font-medium text-foreground">
              Sign In
            </Button>
            <Button onClick={() => navigate("/onboarding")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsla(199,89%,48%,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsla(221,83%,53%,0.1)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">AI-powered growth platform for SMEs</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] text-white animate-slide-up">
              Advertise Smarter.
              <br />
              <span className="text-gradient-blue">Sell Faster.</span>
              <br />
              Grow Bigger.
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              The complete AI-driven marketing ecosystem connecting SMEs with smart advertising, 
              real-time analytics, and growth capital — all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="bg-white hover:bg-white/90 text-primary font-semibold px-8 shadow-lg h-14 text-lg"
              >
                Start Growing Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 h-14 text-lg"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-white/70 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-white" />
                <span>Zero Commission</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-white" />
                <span>Investor Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">Built for Every Business Type</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're selling products, offering services, or looking to invest — we've got you covered
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {userTypes.map((type, index) => (
            <Card 
              key={index} 
              className={`p-8 bg-white border-2 ${type.isPrimary ? 'border-primary/20' : 'border-border'} hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
              onClick={() => navigate("/onboarding")}
            >
              <div className={`w-14 h-14 ${type.bgAccent} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <type.icon className={`w-7 h-7 ${type.accent}`} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3 text-foreground">{type.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{type.description}</p>
              <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">Everything You Need to Grow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven features designed to accelerate your business growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-primary/20 bg-white shadow-card">
            <div className="grid lg:grid-cols-2 gap-12 p-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">For Investors</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-foreground">Discover High-Growth SMEs</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Access AI-verified growth metrics, connect directly with founders, and make 
                  data-driven investment decisions with real-time analytics.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    AI-powered SME recommendations
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    Real-time performance analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    Direct founder messaging
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate("/onboarding")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
                >
                  Join as Investor
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-primary/10 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="relative bg-white rounded-2xl p-8 shadow-elevated border border-border">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Portfolio Value</span>
                        <span className="text-sm text-green-600">+24.5%</span>
                      </div>
                      <div className="text-3xl font-display font-bold text-foreground">₹2.4 Cr</div>
                      <div className="h-px bg-border" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Active Deals</div>
                          <div className="font-semibold text-foreground">12</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg. ROI</div>
                          <div className="font-semibold text-primary">32%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Zero Commission Policy</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              Ready to Transform Your Business?
            </h2>
            
            <p className="text-xl text-white/80">
              Join thousands of SMEs already growing with Adnivio's AI-powered platform
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="bg-white hover:bg-white/90 text-primary font-semibold px-8 shadow-lg h-14 text-lg"
            >
              Start Your Free Trial
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg text-foreground">Adnivio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Adnivio. AI-powered SME growth ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;