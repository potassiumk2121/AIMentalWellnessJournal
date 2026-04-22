import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiAuth } from "@/lib/apiAuth";
import { ArrowLeft, Calendar, Brain } from "lucide-react";
import EmotionBadge from "@/components/EmotionBadge";
import RiskBadge from "@/components/RiskBadge";
import SentimentBar from "@/components/SentimentBar";
import WellnessCard from "@/components/WellnessCard";
import SkeletonCard from "@/components/SkeletonCard";

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

const JournalDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;

    setLoading(true);
    apiAuth<Entry>(`/blogs/list/${id}/`, token)
      .then((data) => {
        setEntry(data);
      })
      .catch((err) => {
        console.error("Error fetching entry:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  const normalizeRisk = (risk: string | undefined): "LOW" | "MEDIUM" | "HIGH" => {
    const upper = (risk || "LOW").toUpperCase();
    if (upper === "HIGH") return "HIGH";
    if (upper === "MEDIUM") return "MEDIUM";
    return "LOW";
  };

  const capitalizeEmotion = (emotion: string | undefined): string => {
    if (!emotion) return "Neutral";
    return emotion.charAt(0).toUpperCase() + emotion.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <SkeletonCard />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Entry not found</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-primary hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {entry.title || "Untitled Entry"}
            </h1>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis
          </h2>

          {entry.analysis ? (
            <>
              <WellnessCard title="Sentiment Score">
                <div className="space-y-4">
                  <SentimentBar score={entry.analysis.sentiment_score} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Negative</span>
                    <span>Positive</span>
                  </div>
                </div>
              </WellnessCard>

              <WellnessCard title="Primary Emotion">
                <EmotionBadge emotion={capitalizeEmotion(entry.analysis.primary_emotion)} />
              </WellnessCard>

              <WellnessCard title="Risk Level">
                <RiskBadge level={normalizeRisk(entry.analysis.risk_level)} />
              </WellnessCard>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                AI analysis is still in progress for this entry. Check back shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
