import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Loader2, 
  Sparkles, 
  Target, 
  DollarSign,
  Calendar,
  BarChart3,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarketing } from "@/hooks/useAIMarketing";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

const platforms = [
  { value: "google", label: "Google Ads" },
  { value: "facebook", label: "Facebook & Instagram" },
  { value: "linkedin", label: "LinkedIn Ads" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "multi", label: "Multi-Platform" }
];

const audiences = [
  "Young Adults (18-24)",
  "Professionals (25-40)",
  "Middle-aged (40-55)",
  "Seniors (55+)",
  "Business Owners",
  "Tech Enthusiasts",
  "Parents",
  "Students"
];

const CampaignLauncher = ({ userType }: { userType: 'product' | 'service' }) => {
  const { user } = useAuth();
  const { streamAIResponse, isLoading: aiLoading } = useAIMarketing();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<(Product | Service)[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    itemId: "",
    platform: "",
    budget: "",
    targetAudience: "",
    startDate: "",
    endDate: "",
    objective: ""
  });

  useEffect(() => {
    if (user && open) {
      fetchItems();
    }
  }, [user, open]);

  const fetchItems = async () => {
    const table = userType === 'product' ? 'products' : 'services';
    const { data, error } = await supabase
      .from(table)
      .select('id, name')
      .eq('user_id', user?.id);

    if (!error && data) {
      setItems(data);
    }
  };

  const generateAISuggestion = async () => {
    const selectedItem = items.find(i => i.id === formData.itemId);
    if (!selectedItem) {
      toast.error("Please select an item first");
      return;
    }

    setAiSuggestion("");
    await streamAIResponse(
      "campaign_suggestion",
      {
        productName: userType === 'product' ? selectedItem.name : undefined,
        serviceName: userType === 'service' ? selectedItem.name : undefined,
        targetAudience: formData.targetAudience || 'General',
        budget: formData.budget || 'Not specified',
        userType
      },
      (chunk) => {
        setAiSuggestion(prev => prev + chunk);
      },
      () => {}
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!formData.name || !formData.itemId || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: formData.name,
          platform: formData.platform,
          budget: parseFloat(formData.budget),
          start_date: formData.startDate || null,
          end_date: formData.endDate || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Campaign created successfully! It will be reviewed and launched soon.");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      itemId: "",
      platform: "",
      budget: "",
      targetAudience: "",
      startDate: "",
      endDate: "",
      objective: ""
    });
    setAiSuggestion("");
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Rocket className="w-4 h-4" />
          Launch Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Create Ad Campaign
          </DialogTitle>
        </DialogHeader>

        <Tabs value={`step-${step}`} className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="step-1" onClick={() => setStep(1)}>
              1. Basics
            </TabsTrigger>
            <TabsTrigger value="step-2" onClick={() => setStep(2)} disabled={!formData.itemId}>
              2. Targeting
            </TabsTrigger>
            <TabsTrigger value="step-3" onClick={() => setStep(3)} disabled={!formData.budget}>
              3. AI Optimize
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Basics */}
          <TabsContent value="step-1" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Summer Sale 2025"
              />
            </div>

            <div className="space-y-2">
              <Label>Select {userType === 'product' ? 'Product' : 'Service'} *</Label>
              <Select
                value={formData.itemId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, itemId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Choose a ${userType}`} />
                </SelectTrigger>
                <SelectContent>
                  {items.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No {userType}s found. Create one first.
                    </SelectItem>
                  ) : (
                    items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select advertising platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.itemId}
            >
              Continue to Targeting
            </Button>
          </TabsContent>

          {/* Step 2: Targeting & Budget */}
          <TabsContent value="step-2" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget (₹) *
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Audience
                </Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Campaign Objective</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                placeholder="What do you want to achieve with this campaign?"
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep(3)}
                disabled={!formData.budget}
              >
                Get AI Recommendations
              </Button>
            </div>
          </TabsContent>

          {/* Step 3: AI Optimization */}
          <TabsContent value="step-3" className="space-y-6 mt-6">
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold">AI Campaign Optimizer</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAISuggestion}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </div>
              
              {aiSuggestion ? (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-background/80 rounded-lg p-4 whitespace-pre-wrap text-sm">
                    {aiSuggestion}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Generate Strategy" to get AI-powered recommendations for your campaign</p>
                </div>
              )}
            </Card>

            {/* Campaign Summary */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Campaign Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{formData.name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Platform:</span>
                  <p className="font-medium">
                    {platforms.find(p => p.value === formData.platform)?.label || 'Not set'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span>
                  <p className="font-medium">₹{formData.budget || '0'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Target:</span>
                  <p className="font-medium">{formData.targetAudience || 'Not set'}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                className="flex-1 bg-accent hover:bg-accent/90" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Rocket className="w-4 h-4 mr-2" />
                )}
                Launch Campaign
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignLauncher;
