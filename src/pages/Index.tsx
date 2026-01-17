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
  Play,
  CheckCircle2,
  Star,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Marketing",
      description: "Let AI create, optimize, and manage your campaigns automatically",
      color: "from-blue to-blue-light",
    },
    {
      icon: Target,
      title: "Smart Ad Management",
      description: "Run campaigns across Meta, Google, and YouTube from one dashboard",
      color: "from-teal to-teal-light",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track performance, ROI, and get AI-driven optimization suggestions",
      color: "from-blue-light to-teal",
    },
    {
      icon: Users,
      title: "Investor Connect",
      description: "High-performing businesses get matched with relevant investors",
      color: "from-teal-light to-blue",
    },
  ];

  const userTypes = [
    {
      icon: Package,
      title: "SME - Product Sellers",
      description: "Physical goods, inventory, and e-commerce solutions with AI-powered marketing",
      gradient: "from-blue/10 to-teal/5",
      iconBg: "bg-gradient-to-br from-blue to-blue-light",
      isPrimary: true,
    },
    {
      icon: Briefcase,
      title: "SME - Service Providers",
      description: "Freelancing, consulting, and professional services with lead generation",
      gradient: "from-teal/10 to-blue-light/5",
      iconBg: "bg-gradient-to-br from-teal to-teal-light",
      isPrimary: true,
    },
    {
      icon: TrendingUp,
      title: "Investors",
      description: "Discover high-growth SMEs, access analytics, and connect with founders",
      gradient: "from-blue-light/10 to-teal/5",
      iconBg: "bg-gradient-to-br from-blue-light to-teal",
      isPrimary: false,
    },
  ];

  const stats = [
    { value: "10K+", label: "Active SMEs", icon: Users },
    { value: "₹50Cr+", label: "Revenue Generated", icon: Coins },
    { value: "500+", label: "Investor Connections", icon: TrendingUp },
    { value: "98%", label: "Success Rate", icon: Star },
  ];

  const testimonials = [
    {
      quote: "Adnivio helped us 3x our revenue in just 6 months with their AI-powered campaigns.",
      author: "Priya Sharma",
      role: "Founder, EcoHome India",
      rating: 5,
    },
    {
      quote: "The investor matching feature connected us with the perfect partner for our growth.",
      author: "Rahul Mehta",
      role: "CEO, TechCraft Solutions",
      rating: 5,
    },
    {
      quote: "Finally, a platform that truly understands the needs of Indian SMEs.",
      author: "Anita Desai",
      role: "Director, Fashion Forward",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue to-teal flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">Adnivio</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="font-medium text-foreground hover:bg-secondary">
              Sign In
            </Button>
            <Button onClick={() => navigate("/onboarding")} className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg transition-all">
              Get Started
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsla(199,89%,48%,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,hsla(221,83%,53%,0.15),transparent)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-teal/20 rounded-full blur-3xl animate-float opacity-50" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-light/20 rounded-full blur-3xl animate-float-delayed opacity-50" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsla(0,0%,100%,0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsla(0,0%,100%,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full border border-white/25 animate-fade-in hover:bg-white/20 transition-colors cursor-default">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-sm font-medium text-white">AI-powered growth platform for SMEs</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] text-white animate-slide-up">
              Advertise Smarter.
              <br />
              <span className="text-gradient-animated bg-clip-text" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg, #fff, hsl(199 89% 68%), hsl(188 78% 70%), #fff)', backgroundSize: '300% 100%', WebkitBackgroundClip: 'text' }}>
                Sell Faster.
              </span>
              <br />
              Grow Bigger.
            </h1>
            
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              The complete AI-driven marketing ecosystem connecting SMEs with smart advertising, 
              real-time analytics, and growth capital — all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="bg-white hover:bg-white/95 text-blue font-semibold px-8 shadow-xl hover:shadow-2xl h-14 text-lg group transition-all"
              >
                Start Growing Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/15 h-14 text-lg backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-10 text-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {[
                { icon: Shield, text: "Zero Commission" },
                { icon: Zap, text: "AI-Powered" },
                { icon: Coins, text: "Investor Access" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <badge.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-white/15 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group cursor-default">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3 group-hover:bg-white/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-24 md:py-32 container mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/5 rounded-full border border-blue/10 mb-6">
            <Users className="w-4 h-4 text-blue" />
            <span className="text-sm font-medium text-blue">For Every Business</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-5 text-foreground">Built for Every Business Type</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're selling products, offering services, or looking to invest — we've got you covered
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto stagger-children">
          {userTypes.map((type, index) => (
            <Card 
              key={index} 
              className={`p-8 bg-gradient-to-br ${type.gradient} border-2 border-transparent hover:border-blue/20 hover-lift cursor-pointer group relative overflow-hidden`}
              onClick={() => navigate("/onboarding")}
            >
              {/* Decorative element */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue/5 to-teal/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className={`w-16 h-16 ${type.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg icon-bounce`}>
                <type.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3 text-foreground">{type.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{type.description}</p>
              <div className="flex items-center text-sm font-semibold text-blue group-hover:text-blue-dark transition-colors">
                Get Started 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-mesh">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/5 rounded-full border border-teal/10 mb-6">
              <Zap className="w-4 h-4 text-teal" />
              <span className="text-sm font-medium text-teal">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-5 text-foreground">Everything You Need to Grow</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven features designed to accelerate your business growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto stagger-children">
            {features.map((feature, index) => (
              <Card key={index} className="p-7 bg-white/80 backdrop-blur-sm hover-lift border-0 shadow-card hover:shadow-elevated group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-md icon-bounce`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/5 rounded-full border border-blue/10 mb-6">
            <Star className="w-4 h-4 text-blue" />
            <span className="text-sm font-medium text-blue">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-5 text-foreground">Loved by Thousands of SMEs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their growth journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto stagger-children">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-white border-gradient hover-lift">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 text-lg">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue to-teal flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Investor Section */}
      <section className="py-24 md:py-32 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue/5 via-white to-teal/5 shadow-elevated">
            <div className="grid lg:grid-cols-2 gap-12 p-10 md:p-14">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/10 rounded-full border border-blue/20">
                  <Rocket className="w-4 h-4 text-blue" />
                  <span className="text-sm font-semibold text-blue">For Investors</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">Discover High-Growth SMEs</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Access AI-verified growth metrics, connect directly with founders, and make 
                  data-driven investment decisions with real-time analytics.
                </p>
                <ul className="space-y-4">
                  {[
                    "AI-powered SME recommendations",
                    "Real-time performance analytics",
                    "Direct founder messaging",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue to-teal flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate("/onboarding")}
                  className="bg-gradient-to-r from-blue to-blue-light hover:opacity-90 text-white font-semibold mt-4 shadow-lg hover:shadow-xl transition-all group"
                >
                  Join as Investor
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue/20 to-teal/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
                  
                  {/* Main card */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-elevated border border-border/50 animate-float">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-medium">Portfolio Value</span>
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+24.5%</span>
                      </div>
                      <div className="text-4xl font-display font-bold text-foreground">₹2.4 Cr</div>
                      <div className="h-px bg-border" />
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-muted-foreground">Active Deals</div>
                          <div className="text-2xl font-bold text-foreground mt-1">12</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Avg. ROI</div>
                          <div className="text-2xl font-bold text-blue mt-1">32%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating mini cards */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg border border-border/50 animate-float-delayed">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-xs font-semibold text-foreground">+15% this month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-hero relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsla(199,89%,48%,0.2),transparent_70%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-light/20 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full border border-white/25">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Zero Commission Policy</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Ready to Transform Your Business?
            </h2>
            
            <p className="text-lg md:text-xl text-white/85 max-w-xl mx-auto">
              Join thousands of SMEs already growing with Adnivio's AI-powered platform
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="bg-white hover:bg-white/95 text-blue font-semibold px-10 shadow-xl hover:shadow-2xl h-14 text-lg group transition-all"
            >
              Start Your Free Trial
              <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 border-t border-border bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue to-teal flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">Adnivio</span>
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