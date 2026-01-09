import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { useAIMarketing } from "@/hooks/useAIMarketing";
import { useToast } from "@/hooks/use-toast";

interface AIProductGeneratorProps {
  onGenerated?: (description: string) => void;
}

export function AIProductGenerator({ onGenerated }: AIProductGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { isLoading, streamAIResponse, error } = useAIMarketing();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name to generate description",
        variant: "destructive",
      });
      return;
    }

    setGeneratedContent('');
    
    await streamAIResponse(
      'product_description',
      {
        productName,
        productCategory,
        productFeatures,
        productPrice,
        targetAudience,
        userType: 'product',
      },
      (delta) => {
        setGeneratedContent(prev => prev + delta);
      },
      () => {
        toast({
          title: "Description generated!",
          description: "Your AI-powered product description is ready",
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
      description: "Description copied to clipboard",
    });
  };

  const handleUse = () => {
    if (onGenerated) {
      onGenerated(generatedContent);
    }
    setIsOpen(false);
    toast({
      title: "Applied!",
      description: "Description has been applied to your product",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Product Description Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Premium Leather Wallet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <Input
                id="productCategory"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder="e.g., Accessories, Fashion"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productPrice">Price</Label>
              <Input
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="e.g., ₹1,299"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Young professionals"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productFeatures">Key Features</Label>
            <Textarea
              id="productFeatures"
              value={productFeatures}
              onChange={(e) => setProductFeatures(e.target.value)}
              placeholder="e.g., Genuine leather, 6 card slots, RFID protection, slim design"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Description
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {generatedContent && (
            <Card className="p-4 bg-muted/50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-sm">Generated Description</h4>
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
              {onGenerated && (
                <Button 
                  onClick={handleUse}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  Use This Description
                </Button>
              )}
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
