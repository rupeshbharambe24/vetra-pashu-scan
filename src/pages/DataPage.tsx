import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Eye, Database } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface TraitResult {
  id: string;
  entryId: string;
  sideImageUrl: string;
  backImageUrl: string;
  timestamp: string;
  status: string;
  sideViewMeasurements: Array<{
    name: string;
    value: string;
    unit: string;
    confidence?: number;
  }>;
  backViewMeasurements: Array<{
    name: string;
    value: string;
    unit: string;
    confidence?: number;
  }>;
}

interface ResultCardProps {
  result: TraitResult;
  onViewDetails: (result: TraitResult) => void;
}

const ResultCard = ({ result, onViewDetails }: ResultCardProps) => {
  const date = new Date(result.timestamp);
  const allMeasurements = [...result.sideViewMeasurements, ...result.backViewMeasurements];
  const displayTraits = allMeasurements.slice(0, 3); // Show first 3 traits

  return (
    <div className="vetra-card p-4 cursor-pointer" onClick={() => onViewDetails(result)}>
      <div className="flex gap-4">
        {/* Image thumbnails */}
        <div className="flex gap-2 shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
            <img
              src={result.sideImageUrl}
              alt="Side view"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
            <img
              src={result.backImageUrl}
              alt="Back view"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              {result.entryId}
            </span>
          </div>

          <div className="space-y-1">
            {displayTraits.map((trait, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium text-card-foreground">
                  {trait.name}
                </span>
                <span className="text-sm text-primary font-semibold">
                  {trait.value} {trait.unit}
                </span>
              </div>
            ))}
            {allMeasurements.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{allMeasurements.length - 3} more measurements
              </div>
            )}
          </div>
        </div>

        {/* View button */}
        <div className="flex items-center text-muted-foreground">
          <Eye className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ result, onClose }: { result: TraitResult; onClose: () => void }) => {
  const date = new Date(result.timestamp);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Analysis Details</h2>
            <p className="text-sm text-muted-foreground">Entry ID: {result.entryId}</p>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Image Thumbnails */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="rounded-xl overflow-hidden mb-2">
                <img
                  src={result.sideImageUrl}
                  alt="Side view"
                  className="w-full h-32 object-cover"
                />
              </div>
              <p className="text-sm font-medium">Side View</p>
            </div>
            <div className="text-center">
              <div className="rounded-xl overflow-hidden mb-2">
                <img
                  src={result.backImageUrl}
                  alt="Back view"
                  className="w-full h-32 object-cover"
                />
              </div>
              <p className="text-sm font-medium">Back View</p>
            </div>
          </div>

          {/* Side View Measurements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Side View Measurements
            </h3>
            
            {result.sideViewMeasurements.map((trait, index) => (
              <div key={index} className="vetra-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">{trait.name}</p>
                  {trait.confidence && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {(trait.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    {trait.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{trait.unit}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Back View Measurements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Back View Measurements
            </h3>
            
            {result.backViewMeasurements.map((trait, index) => (
              <div key={index} className="vetra-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">{trait.name}</p>
                  {trait.confidence && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {(trait.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    {trait.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{trait.unit}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="vetra-button-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DataPage = () => {
  const [results, setResults] = useState<TraitResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<TraitResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-livestock-results`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      
      // Fallback to mock data for development
      const mockResults: TraitResult[] = [
        {
          id: "1",
          entryId: "LV-2025-000001",
          sideImageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBEOTQ4OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhdHRsZSBTaWRlPC90ZXh0Pjwvc3ZnPg==",
          backImageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwN0M1NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhdHRsZSBCYWNrPC90ZXh0Pjwvc3ZnPg==",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: "completed",
          sideViewMeasurements: [
            { name: "Body Length", value: "145", unit: "cm", confidence: 0.94 },
            { name: "Withers Height", value: "132", unit: "cm", confidence: 0.91 },
            { name: "Girth Length", value: "178", unit: "cm", confidence: 0.96 },
            { name: "Rump Angle", value: "18", unit: "degrees", confidence: 0.89 },
            { name: "Chest Depth", value: "72", unit: "cm", confidence: 0.87 },
            { name: "Head Length", value: "48", unit: "cm", confidence: 0.85 }
          ],
          backViewMeasurements: [
            { name: "Hip Width", value: "52", unit: "cm", confidence: 0.89 },
            { name: "Hip Height", value: "135", unit: "cm", confidence: 0.92 },
            { name: "Rump Width", value: "45", unit: "cm", confidence: 0.83 },
            { name: "Thurl Width", value: "26", unit: "cm", confidence: 0.78 },
            { name: "Tail Length", value: "95", unit: "cm", confidence: 0.85 }
          ]
        }
      ];
      
      setResults(mockResults);
      
      toast({
        title: "Using Demo Data",
        description: "Backend API not available, showing sample results"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pb-32"> {/* Extra padding for bottom navigation */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analysis History</h1>
            <p className="text-muted-foreground">Past trait extraction results</p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="vetra-card p-8 text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
            <p className="text-muted-foreground">
              Start by analyzing your first livestock image using VETRA
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onViewDetails={setSelectedResult}
              />
            ))}
          </div>
        )}
      </div>

      {selectedResult && (
        <DetailModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </Layout>
  );
};

export default DataPage;