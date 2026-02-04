import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Edit, Trash2, Loader2, Search, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { BusinessDetailModal } from "@/components/marketplace/BusinessDetailModal";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  category: string | null;
  image_url: string | null;
  ai_description: string | null;
  status: string | null;
  created_at: string;
}

const categories = [
  "Consulting", "Design", "Development", "Marketing",
  "Photography", "Writing", "Tutoring", "Fitness", "Other"
];

const priceRanges = [
  "Under ₹1,000", "₹1,000 - ₹5,000", "₹5,000 - ₹10,000",
  "₹10,000 - ₹25,000", "₹25,000+", "Custom Quote"
];

const ServiceList = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Business Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (user) fetchServices();
  }, [user]);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load services");
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!editingService) return;
    setSaving(true);

    const { error } = await supabase
      .from("services")
      .update({
        name: editingService.name,
        description: editingService.description,
        price_range: editingService.price_range,
        category: editingService.category,
      })
      .eq("id", editingService.id);

    if (error) {
      toast.error("Failed to update service");
    } else {
      toast.success("Service updated");
      setEditingService(null);
      fetchServices();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteService) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", deleteService.id);

    if (error) {
      toast.error("Failed to delete service");
    } else {
      toast.success("Service deleted");
      setDeleteService(null);
      fetchServices();
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">My Services</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "No services match your search" : "No services yet. Add your first service!"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.category || "Uncategorized"}</p>
                  </div>
                  {service.price_range && (
                    <span className="text-sm font-medium text-primary">{service.price_range}</span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {service.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedService(service);
                      setDetailModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingService(service)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setDeleteService(service)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Select
                  value={editingService.price_range || ""}
                  onValueChange={(value) =>
                    setEditingService({ ...editingService, price_range: value })
                  }
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
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editingService.category || ""}
                  onValueChange={(value) =>
                    setEditingService({ ...editingService, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingService.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditingService(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteService} onOpenChange={() => setDeleteService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteService?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Business Detail Modal */}
      <BusinessDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        item={selectedService}
        type="service"
      />
    </div>
  );
};

export default ServiceList;
