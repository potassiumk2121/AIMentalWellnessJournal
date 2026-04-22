import { useState } from "react";
import { mockPatients } from "@/data/mockData";
import RiskBadge from "@/components/RiskBadge";
import WellnessCard from "@/components/WellnessCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowLeft, Users } from "lucide-react";

const Therapist = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockPatients.find((p) => p.id === selectedId);

  if (selected) {
    // Build chart data from patient entries
    const sentimentData = selected.entries.map((e, i) => ({ day: `Day ${i + 1}`, sentiment: e.sentiment }));
    const emotionCounts: Record<string, number> = {};
    selected.entries.forEach((e) => { emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1; });
    const colors = ["hsl(152,55%,55%)", "hsl(210,50%,65%)", "hsl(40,90%,55%)", "hsl(200,20%,70%)", "hsl(168,50%,55%)", "hsl(199,89%,48%)"];
    const emotionPie = Object.entries(emotionCounts).map(([name, value], i) => ({ name, value, fill: colors[i % colors.length] }));

    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <button onClick={() => setSelectedId(null)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Patients
        </button>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {selected.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selected.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selected.email}</span>
              <RiskBadge level={selected.riskLevel} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WellnessCard title="Sentiment Trend" className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200,20%,90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sentiment" stroke="hsl(199,89%,48%)" strokeWidth={3} dot={{ r: 5, fill: "hsl(199,89%,48%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </WellnessCard>

          <WellnessCard title="Emotion Breakdown">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={emotionPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                    {emotionPie.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </WellnessCard>

          <WellnessCard title="Patient Summary">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Entries</span><span className="font-bold">{selected.entries.length}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Sentiment</span><span className="font-bold">{Math.round(selected.entries.reduce((a, b) => a + b.sentiment, 0) / selected.entries.length)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Last Activity</span><span className="font-bold">{selected.lastActivity}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Risk Level</span><RiskBadge level={selected.riskLevel} /></div>
            </div>
          </WellnessCard>
        </div>
      </div>
    );
  }

  // Patient list
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">{mockPatients.length} active patients</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockPatients.map((p) => (
          <button key={p.id} onClick={() => setSelectedId(p.id)}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{p.avatar}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{p.name}</h3>
              <p className="text-sm text-muted-foreground">Last active: {p.lastActivity}</p>
            </div>
            <RiskBadge level={p.riskLevel} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Therapist;
