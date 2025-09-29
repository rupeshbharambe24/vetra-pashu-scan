interface TraitResult {
  name: string;
  value: string;
  unit: string;
  confidence?: number;
}

interface ResultsCardProps {
  imageUrl: string;
  results: TraitResult[];
  timestamp: string;
  onClose: () => void;
}

const ResultsCard = ({ imageUrl, results, timestamp, onClose }: ResultsCardProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Trait Extraction Results</h2>
            <p className="text-sm text-muted-foreground">{timestamp}</p>
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
              src={imageUrl}
              alt="Analyzed livestock"
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-card-foreground">Measurements</h3>
            
            {results.map((result, index) => (
              <div
                key={index}
                className="vetra-card p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-card-foreground">{result.name}</p>
                  {result.confidence && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    {result.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.unit}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="vetra-button-primary w-full"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;