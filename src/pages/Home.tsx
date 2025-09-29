import { useState } from "react";
import { Camera, Database } from "lucide-react";
import Layout from "@/components/Layout";
import VetraLogo from "@/components/VetraLogo";
import MainMenuCard from "@/components/MainMenuCard";
import NavigationMenu from "@/components/NavigationMenu";
import CameraInterface from "@/components/CameraInterface";
import ResultsCard from "@/components/ResultsCard";

// Mock data for demonstration
const mockResults = [
  { name: "Body Length", value: "145", unit: "cm", confidence: 0.94 },
  { name: "Withers Height", value: "132", unit: "cm", confidence: 0.91 },
  { name: "Heart Girth", value: "178", unit: "cm", confidence: 0.96 },
  { name: "Hip Width", value: "52", unit: "cm", confidence: 0.89 },
  { name: "Body Weight (Est.)", value: "485", unit: "kg", confidence: 0.87 }
];

const Home = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
    setShowResults(true);
  };

  const handleOpenData = () => {
    // Navigate to data page - for now just show a toast
    alert("Data page will be implemented with past records");
  };

  return (
    <Layout showHeader={false}>
      <div className="max-w-lg mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 pt-8">
          <VetraLogo className="h-20 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Advanced livestock trait extraction using AI technology
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="space-y-4 mb-8">
          <MainMenuCard
            icon={<Camera className="w-6 h-6" />}
            title="Vetra (Trait Extraction)"
            description="Capture or upload livestock images for AI-powered trait analysis"
            onClick={handleOpenCamera}
            variant="primary"
          />

          <MainMenuCard
            icon={<Database className="w-6 h-6" />}
            title="Data (Past Records)"
            description="View and manage your previous trait extraction results"
            onClick={handleOpenData}
            variant="secondary"
          />
        </div>

        {/* Navigation Menu */}
        <div className="vetra-card p-6">
          <NavigationMenu />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-xs text-muted-foreground">
            VETRA v1.0 • National Digital Livestock Mission
          </p>
        </div>
      </div>

      {/* Modals */}
      {showCamera && (
        <CameraInterface
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showResults && (
        <ResultsCard
          imageUrl={capturedImage}
          results={mockResults}
          timestamp={new Date().toLocaleString()}
          onClose={() => setShowResults(false)}
        />
      )}
    </Layout>
  );
};

export default Home;