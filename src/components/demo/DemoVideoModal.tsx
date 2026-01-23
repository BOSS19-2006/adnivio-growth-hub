import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Sparkles } from "lucide-react";

interface DemoVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoVideoModal = ({ open, onOpenChange }: DemoVideoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-teal flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="font-display text-lg">
                See Adnivio in Action
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          {/* Video Container with 16:9 aspect ratio */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-blue/10 to-teal/10 rounded-xl overflow-hidden border border-border/50">
            {/* Placeholder for actual video - replace src with real video URL */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&modestbranding=1"
              title="Adnivio Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Fallback content if video doesn't load */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue/5 to-teal/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg mb-4">
                <Play className="w-7 h-7 text-blue ml-1" />
              </div>
              <p className="text-sm text-muted-foreground">Click to play demo</p>
            </div>
          </div>
          
          {/* Video description */}
          <div className="mt-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground">
              Discover how Adnivio transforms your business
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Watch how our AI-powered platform helps SMEs create marketing campaigns, 
              track analytics in real-time, and connect with investors — all in one place.
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["AI Marketing", "Real-time Analytics", "Investor Matching", "Zero Commission"].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 text-xs font-medium bg-blue/10 text-blue rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoVideoModal;
