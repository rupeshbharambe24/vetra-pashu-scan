import { useState, useRef, useCallback } from "react";
import { Camera, Upload, RotateCcw, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraInterfaceProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraInterface = ({ onCapture, onClose }: CameraInterfaceProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleConfirmImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    try {
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      onCapture(capturedImage);
      toast({
        title: "Image processed successfully",
        description: "Trait extraction completed"
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Capture Image</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!capturedImage ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select an image of the livestock
              </p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="vetra-button-primary w-full flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose from Gallery
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Supported formats: JPG, PNG, HEIC (max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="vetra-button-secondary flex-1 flex items-center justify-center gap-2"
                disabled={isProcessing}
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
              
              <button
                onClick={handleConfirmImage}
                className="vetra-button-primary flex-1 flex items-center justify-center gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraInterface;