import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiAuth } from "@/lib/apiAuth";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Calendar } from "lucide-react";
import EmotionBadge from "@/components/EmotionBadge";
import RiskBadge from "@/components/RiskBadge";
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

const JournalList = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiAuth<Entry[]>("/blogs/list/", token)
      .then((data) => {
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching entries:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

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

  const filteredEntries = entries.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.content?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard"
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Journal History</h1>
          <p className="text-muted-foreground mt-1">All your past reflections and analyses</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Link
              key={entry.id}
              to={`/journal/${entry.id}`}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30 group sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                  {entry.analysis && (
                    <EmotionBadge emotion={capitalizeEmotion(entry.analysis.primary_emotion)} />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {entry.title || "Untitled Entry"}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {entry.content}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                {entry.analysis ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {entry.analysis.sentiment_score}
                      </span>
                      <RiskBadge level={normalizeRisk(entry.analysis.risk_level)} />
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Analyzing...</span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No entries found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalList;
