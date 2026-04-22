import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { apiAuth } from "@/lib/apiAuth";
import WellnessCard from "@/components/WellnessCard";
import SkeletonCard from "@/components/SkeletonCard";

type EmotionData = {
  primary_emotion: string;
  count: number;
};

type MonthlyBreakdown = {
  month: string;
  avg_sentiment: number;
  total_entries: number;
};

type AnalyticsData = {
  range: string;
  average_sentiment: number;
  total_entries: number;
  emotion_distribution: EmotionData[];
  monthly_breakdown?: MonthlyBreakdown[];
};

const EMOTION_COLORS: Record<string, string> = {
  Happy: "hsla(122, 85%, 45%, 1.00)",
  Joy: "hsl(45, 93%, 47%)",
  Sad: "hsl(199, 89%, 48%)",
  Anxiety: "hsl(25, 95%, 50%)",
  Fear: "hsl(280, 65%, 60%)",
  Anger: "hsl(0, 84%, 60%)",
  Neutral: "hsl(215, 16%, 47%)",
  Grateful: "hsl(175, 70%, 45%)",
  Frustrated: "hsl(350, 89%, 60%)",
  Hopeful: "hsl(230, 65%, 60%)",
  Clarity: "hsl(190, 90%, 45%)",
  Despair: "hsl(215, 25%, 27%)",
  Surprise: "hsl(330, 80%, 60%)",
  Excited: "hsl(35, 90%, 55%)",
  Peaceful: "hsl(160, 80%, 40%)",
  Accomplishment: "hsla(78, 100%, 50%, 1.00)",
  Fatigue: "hsl(25, 30%, 40%)",
  Relief: "hsl(200, 95%, 70%)",
  Elation: "hsl(270, 70%, 60%)",
};

const Analytics = () => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    apiAuth<AnalyticsData>(`/blogs/analytics/?range=${timeRange}`, token)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, timeRange]);

  const chartData = data?.emotion_distribution.map(item => ({
    name: item.primary_emotion,
    value: item.count,
    fill: EMOTION_COLORS[item.primary_emotion.charAt(0).toUpperCase() + item.primary_emotion.slice(1).toLowerCase()] || "hsl(215, 16%, 47%)"
  })) || [];

  const trendData = data?.monthly_breakdown?.map(item => ({
    name: item.month.substring(0, 3),
    sentiment: Math.round((item.avg_sentiment + 1) * 50), // Map -1...1 to 0...100
  })) || [];

  const normalizedAvgSentiment = data ? Math.round((data.average_sentiment + 1) * 50) : 0;

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Track your emotional patterns over time</p>
        </div>

        {/* Toggle */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((t) => (
            <button key={t} onClick={() => setTimeRange(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                timeRange === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend Chart (Yearly only as per backend) */}
        {timeRange === "yearly" && trendData.length > 0 && (
          <WellnessCard title="Monthly Sentiment Trend" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200,20%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(210,10%,50%)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(210,10%,50%)" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(200,20%,90%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  />
                  <Line type="monotone" dataKey="sentiment" stroke="hsl(199,89%,48%)" strokeWidth={3} dot={{ r: 5, fill: "hsl(199,89%,48%)" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </WellnessCard>
        )}

        {/* Pie chart */}
        <WellnessCard title="Emotion Distribution">
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data for this period
              </div>
            )}
          </div>
        </WellnessCard>

        {/* Stats summary */}
        <WellnessCard title="Summary Statistics">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Sentiment</span>
              <span className="text-lg font-bold text-foreground">{normalizedAvgSentiment}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Entries</span>
              <span className="text-lg font-bold text-foreground">{data?.total_entries || 0}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground italic">
                {data?.total_entries === 0 
                  ? "Start journaling to see your stats here." 
                  : `Analyzed over the last ${data?.range}.`}
              </p>
            </div>
          </div>
        </WellnessCard>
      </div>
    </div>
  );
};

export default Analytics;
