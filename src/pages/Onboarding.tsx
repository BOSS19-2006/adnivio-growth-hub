import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Briefcase, ArrowRight, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type UserType = "product" | "service" | "investor" | null;

const Onboarding = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelection = (type: UserType) => {
    setUserType(type);
  };

  const handleContinue = () => {
    if (!user) {
      // Store selection and redirect to auth
      sessionStorage.setItem('selectedUserType', userType || '');
      navigate("/auth");
      return;
    }
    
    if (userType === "investor") {
      navigate("/investor");
    } else if (userType) {
      navigate(`/dashboard/${userType}`);
    }
  };

  const userTypes = [
    {
      type: "product" as const,
      icon: Package,
      title: "I Sell Products",
      description: "Physical goods, inventory, and e-commerce solutions",
      features: ["AI Product Marketing", "Smart Campaign Management", "Real-time Sales Analytics", "Investor Visibility"],
      gradient: "from-purple-500/10 to-purple-600/5",
      accentBg: "bg-product/10",
      accentText: "text-product",
      borderActive: "border-product",
    },
    {
      type: "service" as const,
      icon: Briefcase,
      title: "I Offer Services",
      description: "Freelancing, consulting, and professional services",
      features: ["AI Portfolio Builder", "Lead Generation Tools", "Client Booking System", "Reputation Management"],
      gradient: "from-blue-500/10 to-blue-600/5",
      accentBg: "bg-service/10",
      accentText: "text-service",
      borderActive: "border-service",
    },
    {
      type: "investor" as const,
      icon: TrendingUp,
      title: "I'm an Investor",
      description: "Discover and invest in high-growth SMEs",
      features: ["AI-Powered Matching", "Real-time Analytics", "Direct Founder Access", "Portfolio Tracking"],
      gradient: "from-gold/10 to-gold-dark/5",
      accentBg: "bg-gold/10",
      accentText: "text-gold",
      borderActive: "border-gold",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8 text-muted-foreground hover:text-primary-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-gold" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
              Welcome to Adnivio
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Let's customize your experience. What best describes you?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {userTypes.map((item) => (
            <Card
              key={item.type}
              className={`p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${item.gradient} border-2 ${
                userType === item.type
                  ? `${item.borderActive} shadow-elevated`
                  : "border-border/50 hover:border-border"
              }`}
              onClick={() => handleSelection(item.type)}
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 ${item.accentBg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-7 h-7 ${item.accentText}`} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-card-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.accentBg}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!userType}
            className="bg-gold hover:bg-gold-dark text-accent-foreground font-semibold px-10 h-14 text-lg disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          {!user && userType && (
            <p className="text-sm text-muted-foreground mt-4">
              You'll be asked to sign in or create an account
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;