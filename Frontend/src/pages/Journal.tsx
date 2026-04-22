import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJournal } from "@/context/JournalContext";
import { Send, Type } from "lucide-react";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

const MAX_CHARS = 2000;

const Journal = () => {
  const { addEntry, isSubmitting } = useJournal();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !title.trim() || isSubmitting) return;

    try {
      await addEntry(title, text);
      toast.success("Entry done", {
        description: "Your thoughts are being analyzed.",
      });
      setTitle("");
      setText("");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error submitting entry:", err);
      toast.error("Failed to save entry", {
        description: err.message || "Please try again later.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">How are you feeling?</h1>
        <p className="mt-3 text-lg text-muted-foreground">Write freely. Your thoughts are analyzed by AI to help track your wellness.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur p-1 shadow-lg">
          {/* Title Input */}
          <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
            <Type className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your entry..."
              disabled={isSubmitting}
              className="w-full bg-transparent text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground/60"
              required
            />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            rows={12}
            disabled={isSubmitting}
            className="w-full resize-none rounded-xl bg-transparent p-6 text-lg text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50 leading-relaxed"
            placeholder="Today I feel..."
            required
          />
          <div className="flex flex-col gap-4 border-t border-border/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-muted-foreground">{text.length}/{MAX_CHARS} characters</span>
            <button
              type="submit"
              disabled={!text.trim() || !title.trim() || isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg gradient-calm px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Spinner size={16} className="text-primary-foreground" /> Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit Entry
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {isSubmitting && (
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 gradient-calm rounded-full opacity-30 blur-xl animate-pulse" />
            <div className="relative h-20 w-20 rounded-full gradient-calm flex items-center justify-center">
              <Spinner size={32} className="text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Saving your entry...</p>
            <p className="text-xs text-muted-foreground">AI analysis will continue in the background</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
