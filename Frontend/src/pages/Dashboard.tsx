import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiAuth } from "@/lib/apiAuth";
import WellnessCard from "@/components/WellnessCard";
import SentimentBar from "@/components/SentimentBar";
import RiskBadge from "@/components/RiskBadge";
import EmotionBadge from "@/components/EmotionBadge";
import SkeletonCard from "@/components/SkeletonCard";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";

type Analysis = {
  sentiment_score: number;
  primary_emotion: string;
  risk_level: string;
  reflection: string;
  coping_suggestion: string;
  created_at: string;
};

type Entry = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: string;
  analysis: Analysis | null;
};

const Dashboard = () => {
  const { token } = useAuth();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    apiAuth<Entry[]>("/blogs/list/", token)
      .then((data) => {
        console.log("Backend data:", data);
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const latestEntry = entries[0];
  const latestAnalysis = latestEntry?.analysis;

  // Helper to normalize risk level to uppercase
  const normalizeRisk = (risk: string | undefined): "LOW" | "MEDIUM" | "HIGH" => {
    const upper = (risk || "LOW").toUpperCase();
    if (upper === "HIGH") return "HIGH";
    if (upper === "MEDIUM") return "MEDIUM";
    return "LOW";
  };

  // Helper to capitalize emotion
  const capitalizeEmotion = (emotion: string | undefined): string => {
    if (!emotion) return "Neutral";
    return emotion.charAt(0).toUpperCase() + emotion.slice(1).toLowerCase();
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SkeletonCard />
      </div>
    );
  }

  // 💤 No data state
  if (!latestEntry) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          No entries yet
        </h1>
        <p className="mt-2 text-muted-foreground">
          Write your first journal entry to see your wellness analysis.
        </p>

        <Link
          to="/journal"
          className="mt-6 inline-flex items-center gap-2 rounded-lg gradient-calm px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <PenLine className="h-4 w-4" /> Write Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your latest wellness analysis and insights
          </p>
        </div>

        <Link
          to="/journal"
          className="flex items-center justify-center gap-2 rounded-xl gradient-calm px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          <PenLine className="h-4 w-4" /> New Entry
        </Link>
      </div>

      {/* Top metrics */}
      {latestAnalysis && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <WellnessCard title="Sentiment">
            <SentimentBar score={latestAnalysis.sentiment_score} />
          </WellnessCard>

          <WellnessCard title="Emotion">
            <div className="flex flex-col items-start gap-2">
              <EmotionBadge emotion={capitalizeEmotion(latestAnalysis.primary_emotion)} />
              <p className="text-xs text-muted-foreground">
                Detected from your latest entry
              </p>
            </div>
          </WellnessCard>

          <WellnessCard title="Risk Level">
            <div className="flex flex-col items-start gap-2">
              <RiskBadge level={normalizeRisk(latestAnalysis.risk_level)} />
              <p className="text-xs text-muted-foreground">
                Based on overall sentiment analysis
              </p>
            </div>
          </WellnessCard>
        </div>
      )}

      {/* Recent entries */}
      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Entries
        </h2>
        <Link
          to="/journal/all"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {entries.slice(0, 5).map((entry) => (
          <Link
            key={entry.id}
            to={`/journal/${entry.id}`}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 group"
          >
            <div className="flex flex-1 items-center gap-4 overflow-hidden">
              <span className="shrink-0 text-sm text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {entry.title || "Untitled Entry"}
                </span>
                {entry.analysis && (
                  <div className="flex items-center gap-2">
                    <EmotionBadge emotion={capitalizeEmotion(entry.analysis.primary_emotion)} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {entry.analysis && (
                <>
                  <span className="text-sm font-bold text-foreground">
                    {entry.analysis.sentiment_score}
                  </span>
                  <RiskBadge level={normalizeRisk(entry.analysis.risk_level)} />
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;