import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  Play,
  CheckCircle2,
  Star,
  ShoppingBag,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    {
      icon: Sparkles,
      title: "AI Marketing",
      description: "Auto-create and optimize your campaigns",
      color: "from-blue to-blue-light",
    },
    {
      icon: Target,
      title: "Smart Ads",
      description: "Multi-platform campaign management",
      color: "from-teal to-teal-light",
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time ROI tracking & insights",
      color: "from-blue-light to-teal",
    },
    {
      icon: Users,
      title: "Investor Match",
      description: "Connect with growth investors",
      color: "from-teal-light to-blue",
    },
  ];

  const userTypes = [
    {
      icon: Package,
      title: "Product Sellers",
      description: "E-commerce & inventory solutions with AI marketing",
      iconBg: "bg-gradient-to-br from-blue to-blue-light",
    },
    {
      icon: Briefcase,
      title: "Service Providers",
      description: "Lead generation for freelancers & consultants",
      iconBg: "bg-gradient-to-br from-teal to-teal-light",
    },
    {
      icon: TrendingUp,
      title: "Investors",
      description: "Discover high-growth SMEs & founders",
      iconBg: "bg-gradient-to-br from-blue-light to-teal",
    },
  ];

  const stats = [
    { value: "10K+", label: "SMEs" },
    { value: "₹50Cr+", label: "Revenue" },
    { value: "500+", label: "Investors" },
    { value: "98%", label: "Success" },
  ];

  const testimonials = [
    {
      quote: "3x revenue growth in just 6 months with AI campaigns.",
      author: "Priya S.",
      role: "EcoHome India",
    },
    {
      quote: "Found the perfect investor match for our Series A.",
      author: "Rahul M.",
      role: "TechCraft",
    },
    {
      quote: "Finally, a platform built for Indian SMEs.",
      author: "Anita D.",
      role: "Fashion Forward",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-teal flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Adnivio</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-medium text-foreground">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/onboarding")} className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white font-medium shadow-sm">
              Get Started
              <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsla(199,89%,48%,0.25),transparent)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-32 left-[10%] w-48 h-48 bg-teal/30 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-blue-light/25 rounded-full blur-3xl animate-float-delayed opacity-60" />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsla(0,0%,100%,0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsla(0,0%,100%,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 animate-fade-in text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="font-medium text-white">AI-powered growth for SMEs</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] text-white animate-slide-up">
              Advertise Smarter.
              <br />
              <span className="bg-gradient-to-r from-white via-teal-light to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Sell Faster.
              </span>
              <br />
              Grow Bigger.
            </h1>
            
            <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              AI-driven marketing, real-time analytics, and investor connections — all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button
                onClick={() => navigate("/onboarding")}
                className="bg-white hover:bg-white/95 text-blue font-semibold px-6 shadow-lg hover:shadow-xl h-11 group transition-all"
              >
                Start Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/marketplace")}
                className="bg-gradient-to-r from-teal to-teal-light hover:opacity-90 text-white font-semibold px-6 shadow-lg hover:shadow-xl h-11 group transition-all"
              >
                <ShoppingBag className="mr-2 w-4 h-4" />
                Browse Marketplace
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 h-11 backdrop-blur-sm"
                onClick={() => toast({
                  title: "Demo Coming Soon",
                  description: "We're preparing an interactive demo video. Stay tuned!",
                })}
              >
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 text-xs animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {[
                { icon: Shield, text: "Zero Commission" },
                { icon: Zap, text: "AI-Powered" },
                { icon: Coins, text: "Investor Access" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors">
                  <badge.icon className="w-3.5 h-3.5" />
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl md:text-2xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-white/60 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 md:py-20 container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">Built for Every Business</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Products, services, or investments — we've got you covered
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {userTypes.map((type, index) => (
            <Card 
              key={index} 
              className="p-5 bg-white border border-border/50 hover:border-blue/30 hover-lift cursor-pointer group"
              onClick={() => navigate("/onboarding")}
            >
              <div className={`w-11 h-11 ${type.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-sm icon-bounce`}>
                <type.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-display font-bold mb-1.5 text-foreground">{type.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{type.description}</p>
              <div className="flex items-center text-xs font-semibold text-blue group-hover:text-blue-dark transition-colors">
                Get Started 
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-mesh">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">Everything to Grow</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              AI-powered features to accelerate your business
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-5 bg-white/90 backdrop-blur-sm hover-lift border-0 shadow-card group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm icon-bounce`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-display font-bold mb-1 text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">Loved by SMEs</h2>
          <p className="text-sm text-muted-foreground">What our customers say</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-5 bg-white border-gradient hover-lift">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-teal flex items-center justify-center text-white font-semibold text-xs">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Investor Section */}
      <section className="py-16 md:py-20 container mx-auto px-4">
        <Card className="max-w-4xl mx-auto overflow-hidden border-0 bg-gradient-to-br from-blue/5 via-white to-teal/5 shadow-elevated">
          <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue/10 rounded-full text-xs">
                <Rocket className="w-3.5 h-3.5 text-blue" />
                <span className="font-semibold text-blue">For Investors</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Discover High-Growth SMEs</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-verified metrics, direct founder access, and data-driven investment decisions.
              </p>
              <ul className="space-y-2.5">
                {[
                  "AI-powered recommendations",
                  "Real-time analytics",
                  "Direct messaging",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-blue flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/onboarding")}
                className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white font-semibold shadow-md group"
              >
                Join as Investor
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue/15 to-teal/15 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="relative bg-white rounded-2xl p-6 shadow-elevated border border-border/50 animate-float">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Portfolio</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+24.5%</span>
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">₹2.4 Cr</div>
                    <div className="h-px bg-border" />
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground">Deals</div>
                        <div className="text-lg font-bold text-foreground">12</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">ROI</div>
                        <div className="text-lg font-bold text-blue">32%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsla(199,89%,48%,0.15),transparent_60%)]" />
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-teal/20 rounded-full blur-3xl animate-float opacity-50" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 text-xs">
              <Zap className="w-3.5 h-3.5 text-white" />
              <span className="font-semibold text-white">Zero Commission</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white">
              Ready to Transform Your Business?
            </h2>
            
            <p className="text-sm md:text-base text-white/80">
              Join thousands of SMEs growing with Adnivio
            </p>
            
            <Button
              onClick={() => navigate("/onboarding")}
              className="bg-white hover:bg-white/95 text-blue font-semibold px-8 shadow-lg hover:shadow-xl h-11 group"
            >
              Start Free Trial
              <TrendingUp className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-teal flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-foreground">Adnivio</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Adnivio. AI-powered SME growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;