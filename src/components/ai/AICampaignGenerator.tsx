import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Loader2, Copy, Check, Target, TrendingUp } from "lucide-react";
import { useAIMarketing } from "@/hooks/useAIMarketing";
import { useToast } from "@/hooks/use-toast";

interface AICampaignGeneratorProps {
  userType: 'product' | 'service';
  productName?: string;
  serviceName?: string;
}

export function AICampaignGenerator({ userType, productName, serviceName }: AICampaignGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemName, setItemName] = useState(productName || serviceName || '');
  const [salesGoal, setSalesGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { isLoading, streamAIResponse, error } = useAIMarketing();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setGeneratedContent('');
    
    await streamAIResponse(
      'campaign_suggestion',
      {
        ...(userType === 'product' ? { productName: itemName } : { serviceName: itemName }),
        salesGoal,
        budget,
        targetAudience,
        userType,
      },
      (delta) => {
        setGeneratedContent(prev => prev + delta);
      },
      () => {
        toast({
          title: "Campaign strategy generated!",
          description: "Your AI-powered campaign strategy is ready",
        });
      }
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Campaign strategy copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Zap className="h-4 w-4" />
          Generate Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            AI Campaign Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">
                {userType === 'product' ? 'Product Name' : 'Service Name'}
              </Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={userType === 'product' ? 'e.g., Premium Headphones' : 'e.g., Web Design Service'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Tech-savvy millennials"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salesGoal">Sales Goal</Label>
              <Select value={salesGoal} onValueChange={setSalesGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase_sales_25">Increase sales by 25%</SelectItem>
                  <SelectItem value="increase_sales_50">Increase sales by 50%</SelectItem>
                  <SelectItem value="brand_awareness">Build brand awareness</SelectItem>
                  <SelectItem value="new_customers">Acquire new customers</SelectItem>
                  <SelectItem value="lead_generation">Generate qualified leads</SelectItem>
                  <SelectItem value="retention">Improve customer retention</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_5000">Under ₹5,000</SelectItem>
                  <SelectItem value="5000_15000">₹5,000 - ₹15,000</SelectItem>
                  <SelectItem value="15000_50000">₹15,000 - ₹50,000</SelectItem>
                  <SelectItem value="50000_100000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="above_100000">Above ₹1,00,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Strategy...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Campaign Strategy
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {generatedContent && (
            <Card className="p-4 bg-muted/50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm">AI Campaign Strategy</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="text-sm whitespace-pre-wrap">{generatedContent}</div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
