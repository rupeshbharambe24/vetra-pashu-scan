interface TraitResult {
  name: string;
  value: string;
  unit: string;
  confidence?: number;
}

interface ResultsCardProps {
  entryId: string;
  sideImageUrl: string;
  backImageUrl: string;
  sideViewMeasurements: TraitResult[];
  backViewMeasurements: TraitResult[];
  timestamp: string;
  onClose: () => void;
}

const ResultsCard = ({ entryId, sideImageUrl, backImageUrl, sideViewMeasurements, backViewMeasurements, timestamp, onClose }: ResultsCardProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p className="text-sm text-muted-foreground">Entry ID: {entryId}</p>
            <p className="text-xs text-muted-foreground">{new Date(timestamp).toLocaleString()}</p>
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
                  src={sideImageUrl}
                  alt="Side view"
                  className="w-full h-32 object-cover"
                />
              </div>
              <p className="text-sm font-medium">Side View</p>
            </div>
            <div className="text-center">
              <div className="rounded-xl overflow-hidden mb-2">
                <img
                  src={backImageUrl}
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
            
            {sideViewMeasurements.map((result, index) => (
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

          {/* Back View Measurements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Back View Measurements
            </h3>
            
            {backViewMeasurements.map((result, index) => (
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