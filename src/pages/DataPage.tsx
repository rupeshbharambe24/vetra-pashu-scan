import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Eye, Database } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface TraitResult {
  id: string;
  imageUrl: string;
  timestamp: string;
  traits: Array<{
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
  const displayTraits = result.traits.slice(0, 3); // Show first 3 traits

  return (
    <div className="vetra-card p-4 cursor-pointer" onClick={() => onViewDetails(result)}>
      <div className="flex gap-4">
        {/* Image thumbnail */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
          <img
            src={result.imageUrl}
            alt="Livestock analysis"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            {result.traits.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{result.traits.length - 3} more measurements
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
            <p className="text-sm text-muted-foreground">
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
          <div className="rounded-xl overflow-hidden">
            <img
              src={result.imageUrl}
              alt="Analyzed livestock"
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              All Measurements
            </h3>
            
            {result.traits.map((trait, index) => (
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
      const response = await fetch('/api/results');
      
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
          imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBEOTQ4OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhdHRsZSAjMTwvdGV4dD48L3N2Zz4=",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          traits: [
            { name: "Body Length", value: "145", unit: "cm", confidence: 0.94 },
            { name: "Withers Height", value: "132", unit: "cm", confidence: 0.91 },
            { name: "Heart Girth", value: "178", unit: "cm", confidence: 0.96 },
            { name: "Hip Width", value: "52", unit: "cm", confidence: 0.89 },
            { name: "Body Weight (Est.)", value: "485", unit: "kg", confidence: 0.87 }
          ]
        },
        {
          id: "2",
          imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzE0MkI3MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJ1ZmZhbG8gIzE8L3RleHQ+PC9zdmc+",
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          traits: [
            { name: "Body Length", value: "156", unit: "cm", confidence: 0.96 },
            { name: "Withers Height", value: "128", unit: "cm", confidence: 0.93 },
            { name: "Heart Girth", value: "195", unit: "cm", confidence: 0.98 },
            { name: "Body Weight (Est.)", value: "520", unit: "kg", confidence: 0.89 }
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