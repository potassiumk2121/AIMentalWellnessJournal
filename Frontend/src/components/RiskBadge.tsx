const config = {
  LOW: { bg: "bg-gradient-to-r from-wellness-safe/20 to-wellness-safe/10", text: "text-wellness-safe", label: "Low Risk", emoji: "✅", border: "border-wellness-safe/30" },
  MEDIUM: { bg: "bg-gradient-to-r from-wellness-warning/20 to-wellness-warning/10", text: "text-wellness-warning", label: "Medium Risk", emoji: "⚠️", border: "border-wellness-warning/30" },
  HIGH: { bg: "bg-gradient-to-r from-wellness-danger/20 to-wellness-danger/10", text: "text-wellness-danger", label: "High Risk", emoji: "🚨", border: "border-wellness-danger/30" },
};

const RiskBadge = ({ level }: { level: "LOW" | "MEDIUM" | "HIGH" }) => {
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${c.bg} ${c.text} ${c.border} transition-all hover:shadow-sm`}>
      <span>{c.emoji}</span>
      {c.label}
    </span>
  );
};

export default RiskBadge;
