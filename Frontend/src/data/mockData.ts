// Mock data for the AI Mental Wellness Journal

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  sentiment: number;
  emotion: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastActivity: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  entries: JournalEntry[];
}

export const emotions = ["Happy", "Sad", "Anxiety", "Neutral", "Grateful", "Frustrated", "Hopeful"];

export const copingSuggestions = [
  { title: "Deep Breathing", description: "Try 4-7-8 breathing: inhale for 4s, hold for 7s, exhale for 8s.", icon: "🧘" },
  { title: "Gratitude Journaling", description: "Write down 3 things you're grateful for today.", icon: "📝" },
  { title: "Mindful Walk", description: "Take a 10-minute walk and focus on your surroundings.", icon: "🚶" },
  { title: "Progressive Relaxation", description: "Tense and release each muscle group for full-body calm.", icon: "💆" },
  { title: "Connect with Someone", description: "Reach out to a friend or loved one for a brief chat.", icon: "💬" },
  { title: "Digital Detox", description: "Step away from screens for 30 minutes.", icon: "📵" },
];

export const mockEntries: JournalEntry[] = [
  { id: "1", date: "2026-04-13", text: "Feeling really good today. Had a productive morning and enjoyed lunch with a friend.", sentiment: 82, emotion: "Happy", riskLevel: "LOW" },
  { id: "2", date: "2026-04-12", text: "Struggled to sleep last night. Work deadlines are piling up and I feel overwhelmed.", sentiment: 35, emotion: "Anxiety", riskLevel: "MEDIUM" },
  { id: "3", date: "2026-04-11", text: "Normal day. Nothing special happened. Just went through the motions.", sentiment: 55, emotion: "Neutral", riskLevel: "LOW" },
  { id: "4", date: "2026-04-10", text: "Had a great therapy session today. Feeling hopeful about the future.", sentiment: 78, emotion: "Hopeful", riskLevel: "LOW" },
  { id: "5", date: "2026-04-09", text: "Missing my family. Haven't seen them in months. Feeling isolated.", sentiment: 28, emotion: "Sad", riskLevel: "MEDIUM" },
  { id: "6", date: "2026-04-08", text: "Grateful for the small things today. A warm coffee, sunshine, a kind word.", sentiment: 88, emotion: "Grateful", riskLevel: "LOW" },
  { id: "7", date: "2026-04-07", text: "Everything feels pointless. Can't find motivation for anything.", sentiment: 15, emotion: "Sad", riskLevel: "HIGH" },
];

export const weeklyData = [
  { day: "Mon", sentiment: 82 },
  { day: "Tue", sentiment: 35 },
  { day: "Wed", sentiment: 55 },
  { day: "Thu", sentiment: 78 },
  { day: "Fri", sentiment: 28 },
  { day: "Sat", sentiment: 88 },
  { day: "Sun", sentiment: 15 },
];

export const monthlyData = [
  { week: "Week 1", sentiment: 65 },
  { week: "Week 2", sentiment: 52 },
  { week: "Week 3", sentiment: 71 },
  { week: "Week 4", sentiment: 58 },
];

export const emotionDistribution = [
  { name: "Happy", value: 25, fill: "hsl(152, 55%, 55%)" },
  { name: "Sad", value: 18, fill: "hsl(210, 50%, 65%)" },
  { name: "Anxiety", value: 22, fill: "hsl(40, 90%, 55%)" },
  { name: "Neutral", value: 15, fill: "hsl(200, 20%, 70%)" },
  { name: "Grateful", value: 12, fill: "hsl(168, 50%, 55%)" },
  { name: "Hopeful", value: 8, fill: "hsl(199, 89%, 48%)" },
];

export const mockPatients: Patient[] = [
  {
    id: "p1", name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ",
    lastActivity: "2 hours ago", riskLevel: "LOW",
    entries: [
      { id: "p1e1", date: "2026-04-13", text: "", sentiment: 78, emotion: "Happy", riskLevel: "LOW" },
      { id: "p1e2", date: "2026-04-12", text: "", sentiment: 65, emotion: "Neutral", riskLevel: "LOW" },
      { id: "p1e3", date: "2026-04-11", text: "", sentiment: 72, emotion: "Grateful", riskLevel: "LOW" },
      { id: "p1e4", date: "2026-04-10", text: "", sentiment: 80, emotion: "Happy", riskLevel: "LOW" },
      { id: "p1e5", date: "2026-04-09", text: "", sentiment: 68, emotion: "Neutral", riskLevel: "LOW" },
    ],
  },
  {
    id: "p2", name: "Michael Chen", email: "michael@example.com", avatar: "MC",
    lastActivity: "1 day ago", riskLevel: "MEDIUM",
    entries: [
      { id: "p2e1", date: "2026-04-12", text: "", sentiment: 42, emotion: "Anxiety", riskLevel: "MEDIUM" },
      { id: "p2e2", date: "2026-04-11", text: "", sentiment: 38, emotion: "Sad", riskLevel: "MEDIUM" },
      { id: "p2e3", date: "2026-04-10", text: "", sentiment: 55, emotion: "Neutral", riskLevel: "LOW" },
      { id: "p2e4", date: "2026-04-09", text: "", sentiment: 30, emotion: "Anxiety", riskLevel: "MEDIUM" },
    ],
  },
  {
    id: "p3", name: "Emma Williams", email: "emma@example.com", avatar: "EW",
    lastActivity: "3 hours ago", riskLevel: "HIGH",
    entries: [
      { id: "p3e1", date: "2026-04-13", text: "", sentiment: 18, emotion: "Sad", riskLevel: "HIGH" },
      { id: "p3e2", date: "2026-04-12", text: "", sentiment: 22, emotion: "Anxiety", riskLevel: "HIGH" },
      { id: "p3e3", date: "2026-04-11", text: "", sentiment: 15, emotion: "Sad", riskLevel: "HIGH" },
    ],
  },
  {
    id: "p4", name: "James Rodriguez", email: "james@example.com", avatar: "JR",
    lastActivity: "5 hours ago", riskLevel: "LOW",
    entries: [
      { id: "p4e1", date: "2026-04-13", text: "", sentiment: 85, emotion: "Grateful", riskLevel: "LOW" },
      { id: "p4e2", date: "2026-04-12", text: "", sentiment: 70, emotion: "Happy", riskLevel: "LOW" },
    ],
  },
];
