const getColor = (score: number) => {
  if (score >= 60) return "from-wellness-safe to-wellness-green";
  if (score >= 35) return "from-wellness-warning to-orange-500";
  return "from-wellness-danger to-red-500";
};

const getSentimentLabel = (score: number) => {
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 45) return "Fair";
  if (score >= 30) return "Concerned";
  return "Critical";
};

const SentimentBar = ({ score }: { score: number }) => {
  // Map -1 to 1 range (common in ML) to 0-100
  // Or handle 0-1 range to 0-100
  let normalizedScore: number;
  
  if (score >= -1 && score <= 1) {
    // Map -1...1 to 0...100
    normalizedScore = Math.round((score + 1) * 50);
  } else {
    // Assume it's already on a larger scale, but ensure it's not negative
    normalizedScore = Math.round(Math.max(0, score));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground opacity-60">Sentiment Score</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{normalizedScore}</span>
            <span className="text-sm font-medium text-muted-foreground">/100</span>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">{getSentimentLabel(normalizedScore)}</span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-muted/50 shadow-inset">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${getColor(normalizedScore)} shadow-lg`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
};

export default SentimentBar;
