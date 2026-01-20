import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Briefcase, ArrowRight, Sparkles, TrendingUp, ArrowLeft, Check } from "lucide-react";
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
      features: ["AI Product Marketing", "Smart Campaigns", "Sales Analytics", "Investor Visibility"],
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      ringColor: "ring-blue-500",
    },
    {
      type: "service" as const,
      icon: Briefcase,
      title: "I Offer Services",
      description: "Freelancing, consulting, and professional services",
      features: ["AI Portfolio Builder", "Lead Generation", "Client Booking", "Reputation Mgmt"],
      gradient: "from-teal-500 to-teal-600",
      bgLight: "bg-teal-50",
      textColor: "text-teal-600",
      ringColor: "ring-teal-500",
    },
    {
      type: "investor" as const,
      icon: TrendingUp,
      title: "I'm an Investor",
      description: "Discover and invest in high-growth SMEs",
      features: ["AI-Powered Matching", "Real-time Analytics", "Founder Access", "Portfolio Tracking"],
      gradient: "from-violet-500 to-purple-600",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
      ringColor: "ring-violet-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10 text-sm h-9 px-3"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back
        </Button>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome to Adnivio
            </h1>
          </div>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Choose your path to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {userTypes.map((item, index) => (
            <Card
              key={item.type}
              className={`group relative p-5 cursor-pointer transition-all duration-300 bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden ${
                userType === item.type ? `ring-2 ${item.ringColor} shadow-xl` : ""
              }`}
              onClick={() => handleSelection(item.type)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Selection indicator */}
              {userType === item.type && (
                <div className={`absolute top-3 right-3 w-5 h-5 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className="space-y-3">
                <div className={`w-10 h-10 ${item.bgLight} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.textColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.description}</p>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-br ${item.gradient}`} />
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
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-8 h-11 text-sm shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          
          {!user && userType && (
            <p className="text-xs text-white/50 mt-3">
              You'll be asked to sign in or create an account
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;