import { useState, useRef } from "react";
import { Camera, Upload, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VetraCaptureModalProps {
  onImageProcessed: (results: any) => void;
  onClose: () => void;
}

const VetraCaptureModal = ({ onImageProcessed, onClose }: VetraCaptureModalProps) => {
  const [step, setStep] = useState<"select" | "capture" | "upload" | "processing">("select");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCameraCapture = () => {
    setStep("capture");
    // Trigger camera input for Android devices
    setTimeout(() => {
      cameraInputRef.current?.click();
    }, 100);
  };

  const handleGalleryUpload = () => {
    setStep("upload");
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setStep("select");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      setStep("select");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
      processImage(file);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (file: File) => {
    setStep("processing");
    setIsProcessing(true);

    try {
      // Create FormData for API call
      const formData = new FormData();
      formData.append('image', file);

      // Call backend API
      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const results = await response.json();
      
      toast({
        title: "Processing Complete",
        description: "Trait extraction completed successfully"
      });

      onImageProcessed({
        ...results,
        imageUrl: capturedImage,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing image:', error);
      
      // Fallback to mock data for development
      const mockResults = {
        traits: [
          { name: "Body Length", value: "145", unit: "cm", confidence: 0.94 },
          { name: "Withers Height", value: "132", unit: "cm", confidence: 0.91 },
          { name: "Heart Girth", value: "178", unit: "cm", confidence: 0.96 },
          { name: "Hip Width", value: "52", unit: "cm", confidence: 0.89 },
          { name: "Body Weight (Est.)", value: "485", unit: "kg", confidence: 0.87 }
        ],
        imageUrl: capturedImage,
        timestamp: new Date().toISOString()
      };

      toast({
        title: "Using Demo Data",
        description: "Backend API not available, showing sample results"
      });

      onImageProcessed(mockResults);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "select":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Input Method</h2>
              <p className="text-muted-foreground">
                Select how you want to provide the livestock image
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCameraCapture}
                className="vetra-button-primary w-full p-6 flex items-center gap-4"
              >
                <div className="p-3 bg-white/20 rounded-xl">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-white">Capture Image</h3>
                  <p className="text-white/80 text-sm">Use device camera to take photo</p>
                </div>
              </button>

              <button
                onClick={handleGalleryUpload}
                className="vetra-button-secondary w-full p-6 flex items-center gap-4"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold">Upload Image</h3>
                  <p className="text-muted-foreground text-sm">Choose from gallery or files</p>
                </div>
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelection}
              ref={cameraInputRef}
              className="hidden"
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelection}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Image</h2>
            <p className="text-muted-foreground">
              Analyzing livestock traits using AI...
            </p>
            {capturedImage && (
              <div className="mt-6 rounded-xl overflow-hidden max-w-xs mx-auto">
                <img
                  src={capturedImage}
                  alt="Processing"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Preparing camera...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          {step !== "select" && step !== "processing" ? (
            <button
              onClick={() => setStep("select")}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div></div>
          )}
          
          <h1 className="text-lg font-semibold">VETRA Analysis</h1>
          
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default VetraCaptureModal;