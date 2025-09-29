import { useState } from "react";
import { Camera, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import VetraCaptureModal from "@/components/VetraCaptureModal";
import ResultsCard from "@/components/ResultsCard";

const VetraPage = () => {
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImageProcessed = (processedResults: any) => {
    setResults(processedResults);
    setShowCaptureModal(false);
  };

  const handleStartAnalysis = () => {
    setShowCaptureModal(true);
  };

  const handleCloseResults = () => {
    setResults(null);
  };

  return (
    <Layout>
      <div className="pb-32 max-w-lg mx-auto"> {/* Extra padding for bottom navigation */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">VETRA Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered livestock trait extraction technology
          </p>
        </div>

        <div className="space-y-6">
          {/* Main action card */}
          <div className="vetra-card p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Start New Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Capture or upload an image to extract detailed livestock measurements
              </p>
            </div>

            <button
              onClick={handleStartAnalysis}
              className="vetra-button-primary w-full py-4"
            >
              Begin Analysis
            </button>
          </div>

          {/* Information cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="vetra-card p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">AI</div>
              <div className="text-xs text-muted-foreground">Powered</div>
            </div>
            <div className="vetra-card p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">95%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Features list */}
          <div className="vetra-card p-6">
            <h3 className="font-semibold mb-4">What VETRA Measures</h3>
            <div className="space-y-3">
              {[
                "Body Length",
                "Withers Height", 
                "Heart Girth",
                "Hip Width",
                "Body Weight (Estimated)"
              ].map((trait, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="vetra-card p-6">
            <h3 className="font-semibold mb-4">Tips for Best Results</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Ensure good lighting conditions</p>
              <p>• Position animal sideways (profile view)</p>
              <p>• Keep animal stable and standing</p>
              <p>• Maintain clear view of body outline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCaptureModal && (
        <VetraCaptureModal
          onImageProcessed={handleImageProcessed}
          onClose={() => setShowCaptureModal(false)}
        />
      )}

      {results && (
        <ResultsCard
          imageUrl={results.imageUrl}
          results={results.traits}
          timestamp={new Date(results.timestamp).toLocaleString()}
          onClose={handleCloseResults}
        />
      )}
    </Layout>
  );
};

export default VetraPage;