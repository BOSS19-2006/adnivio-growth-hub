import { useState } from "react";
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
import { Upload, Loader2, Sparkles, Plus, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarketing } from "@/hooks/useAIMarketing";
import { toast } from "sonner";

const categories = [
  "Consulting",
  "Design",
  "Development",
  "Marketing",
  "Photography",
  "Writing",
  "Tutoring",
  "Fitness",
  "Other"
];

const priceRanges = [
  "Under ₹1,000",
  "₹1,000 - ₹5,000",
  "₹5,000 - ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000+",
  "Custom Quote"
];

const ServiceUploadForm = () => {
  const { user } = useAuth();
  const { streamAIResponse, isLoading: aiLoading } = useAIMarketing();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceRange: "",
    category: "",
    aiDescription: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIDescription = async () => {
    if (!formData.name) {
      toast.error("Please enter a service name first");
      return;
    }

    setFormData(prev => ({ ...prev, aiDescription: "" }));
    
    await streamAIResponse(
      "product_description",
      {
        serviceName: formData.name,
        serviceType: formData.category || 'General',
        targetAudience: formData.description || ''
      },
      (chunk) => {
        setFormData(prev => ({ ...prev, aiDescription: prev.aiDescription + chunk }));
      },
      () => {}
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    let imageUrl = null;

    try {
      // Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Insert service
      const { error } = await supabase
        .from('services')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          price_range: formData.priceRange,
          category: formData.category,
          image_url: imageUrl,
          ai_description: formData.aiDescription,
          status: 'active'
        });

      if (error) throw error;

      toast.success("Service created successfully!");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", priceRange: "", category: "", aiDescription: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Service Image</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter service name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range</Label>
              <Select
                value={formData.priceRange}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priceRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Basic Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your service..."
              rows={2}
            />
          </div>

          {/* AI Description */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between mb-3">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                AI-Generated Description
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAIDescription}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={formData.aiDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, aiDescription: e.target.value }))}
              placeholder="Click 'Generate' to create an AI-powered service description..."
              rows={4}
            />
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Create Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceUploadForm;
