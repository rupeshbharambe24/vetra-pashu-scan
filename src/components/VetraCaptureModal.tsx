import { useState, useRef } from "react";
import { Camera, Upload, X, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VetraCaptureModalProps {
  onImageProcessed: (results: any) => void;
  onClose: () => void;
}

const VetraCaptureModal = ({ onImageProcessed, onClose }: VetraCaptureModalProps) => {
  const [step, setStep] = useState<"select" | "side-image" | "back-image" | "processing">("select");
  const [sideImage, setSideImage] = useState<{ file: File; url: string } | null>(null);
  const [backImage, setBackImage] = useState<{ file: File; url: string } | null>(null);
  const [currentImageType, setCurrentImageType] = useState<"side" | "back">("side");
  const [isProcessing, setIsProcessing] = useState(false);
  const sideFileInputRef = useRef<HTMLInputElement>(null);
  const sideCameraInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const backCameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSideImageStart = () => {
    setCurrentImageType("side");
    setStep("side-image");
  };

  const handleBackImageStart = () => {
    setCurrentImageType("back");
    setStep("back-image");
  };

  const handleCameraCapture = () => {
    if (currentImageType === "side") {
      sideCameraInputRef.current?.click();
    } else {
      backCameraInputRef.current?.click();
    }
  };

  const handleGalleryUpload = () => {
    if (currentImageType === "side") {
      sideFileInputRef.current?.click();
    } else {
      backFileInputRef.current?.click();
    }
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>, imageType: "side" | "back") => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
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
      const imageData = { file, url: result };
      
      if (imageType === "side") {
        setSideImage(imageData);
      } else {
        setBackImage(imageData);
      }
      
      setStep("select");
    };
    reader.readAsDataURL(file);
  };

  const processImages = async () => {
    if (!sideImage || !backImage) {
      toast({
        title: "Missing Images",
        description: "Please provide both side and back view images",
        variant: "destructive"
      });
      return;
    }

    setStep("processing");
    setIsProcessing(true);

    try {
      // Create FormData for API call
      const formData = new FormData();
      formData.append('sideImage', sideImage.file);
      formData.append('backImage', backImage.file);

      // Call backend API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-livestock-images`, {
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

      onImageProcessed(results);

    } catch (error) {
      console.error('Error processing images:', error);
      
      toast({
        title: "Processing Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive"
      });
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
              <h2 className="text-2xl font-bold mb-2">Livestock Analysis</h2>
              <p className="text-muted-foreground">
                Provide both side and back view images for complete analysis
              </p>
            </div>

            {/* Side View Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Side View Image</h3>
                {sideImage && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
              
              {sideImage ? (
                <div className="relative">
                  <img
                    src={sideImage.url}
                    alt="Side view"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setSideImage(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSideImageStart}
                  className="vetra-button-secondary w-full p-4 flex items-center gap-3"
                >
                  <Camera className="w-6 h-6 text-primary" />
                  <span>Add Side View Image</span>
                </button>
              )}

              <div className="text-xs text-muted-foreground">
                • Body Length • Withers Height • Girth Length • Rump Angle • Chest Depth • Head Length
              </div>
            </div>

            {/* Back View Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Back View Image</h3>
                {backImage && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
              
              {backImage ? (
                <div className="relative">
                  <img
                    src={backImage.url}
                    alt="Back view"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setBackImage(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBackImageStart}
                  className="vetra-button-secondary w-full p-4 flex items-center gap-3"
                >
                  <Camera className="w-6 h-6 text-primary" />
                  <span>Add Back View Image</span>
                </button>
              )}

              <div className="text-xs text-muted-foreground">
                • Hip Width • Hip Height • Rump Width • Thurl Width • Tail Length
              </div>
            </div>

            {/* Process Button */}
            {sideImage && backImage && (
              <button
                onClick={processImages}
                className="vetra-button-primary w-full py-4"
              >
                Process Images
              </button>
            )}

            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileSelection(e, "side")}
              ref={sideCameraInputRef}
              className="hidden"
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelection(e, "side")}
              ref={sideFileInputRef}
              className="hidden"
            />

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileSelection(e, "back")}
              ref={backCameraInputRef}
              className="hidden"
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelection(e, "back")}
              ref={backFileInputRef}
              className="hidden"
            />
          </div>
        );

      case "side-image":
      case "back-image":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {step === "side-image" ? "Side View" : "Back View"} Image
              </h2>
              <p className="text-muted-foreground">
                Choose how to capture the {step === "side-image" ? "side" : "back"} view
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
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Images</h2>
            <p className="text-muted-foreground">
              Analyzing livestock traits from both views using AI...
            </p>
            {sideImage && backImage && (
              <div className="mt-6 flex gap-4 justify-center">
                <div className="text-center">
                  <img
                    src={sideImage.url}
                    alt="Side view processing"
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Side View</p>
                </div>
                <div className="text-center">
                  <img
                    src={backImage.url}
                    alt="Back view processing"
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Back View</p>
                </div>
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
          {(step === "side-image" || step === "back-image") ? (
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