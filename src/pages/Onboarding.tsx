import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Briefcase, ArrowRight, Sparkles } from "lucide-react";

type UserType = "product" | "service" | null;

const Onboarding = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();

  const handleSelection = (type: UserType) => {
    setUserType(type);
  };

  const handleContinue = () => {
    if (userType) {
      navigate(`/dashboard/${userType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Welcome to Adnivio
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Let's customize your experience. What best describes your business?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card
            className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              userType === "product"
                ? "border-product bg-card shadow-glow"
                : "border-border hover:border-product/50"
            }`}
            onClick={() => handleSelection("product")}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-product/10 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-product" />
              </div>
              <h3 className="text-2xl font-bold">I Sell Products</h3>
              <p className="text-muted-foreground">
                Physical goods, inventory, and e-commerce solutions
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• AI Product Marketing</li>
                <li>• Smart Campaign Management</li>
                <li>• Real-time Sales Analytics</li>
                <li>• Investor Visibility</li>
              </ul>
            </div>
          </Card>

          <Card
            className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              userType === "service"
                ? "border-service bg-card shadow-glow"
                : "border-border hover:border-service/50"
            }`}
            onClick={() => handleSelection("service")}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-service/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-service" />
              </div>
              <h3 className="text-2xl font-bold">I Offer Services</h3>
              <p className="text-muted-foreground">
                Freelancing, consulting, and professional services
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• AI Portfolio Builder</li>
                <li>• Lead Generation Tools</li>
                <li>• Client Booking System</li>
                <li>• Reputation Management</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="text-center animate-fade-in">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!userType}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
