const emotionEmojis: Record<string, string> = {
  Happy: "😊",
  Sad: "😢",
  Anxiety: "😰",
  Neutral: "😐",
  Grateful: "🙏",
  Frustrated: "😤",
  Hopeful: "🤗",
};

const emotionColors: Record<string, string> = {
  Happy: "bg-gradient-to-r from-wellness-green/20 to-wellness-green/10 text-wellness-green border border-wellness-green/30",
  Sad: "bg-gradient-to-r from-wellness-blue/20 to-wellness-blue/10 text-wellness-blue border border-wellness-blue/30",
  Anxiety: "bg-gradient-to-r from-wellness-warning/20 to-wellness-warning/10 text-wellness-warning border border-wellness-warning/30",
  Neutral: "bg-muted/50 text-muted-foreground border border-border",
  Grateful: "bg-gradient-to-r from-wellness-mint/20 to-wellness-mint/10 text-accent-foreground border border-accent/30",
  Frustrated: "bg-gradient-to-r from-wellness-danger/20 to-wellness-danger/10 text-wellness-danger border border-wellness-danger/30",
  Hopeful: "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30",
};

const EmotionBadge = ({ emotion }: { emotion: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:shadow-sm ${emotionColors[emotion] || "bg-muted text-muted-foreground"}`}>
    <span className="text-sm">{emotionEmojis[emotion] || "✨"}</span>
    {emotion}
  </span>
);

export default EmotionBadge;
