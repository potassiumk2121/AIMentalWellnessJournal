import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { api } from "@/lib/api";

export type Analysis = {
  sentiment_score: number;
  primary_emotion: string;
  risk_level: string;
  reflection: string;
  coping_suggestion: string;
  created_at: string;
};

export type JournalEntry = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  analysis: Analysis | null;
};

interface JournalContextType {
  addEntry: (title: string, content: string) => Promise<void>;
  isSubmitting: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEntry = async (title: string, content: string): Promise<void> => {
    if (!token) throw new Error("Authentication required");
    
    setIsSubmitting(true);
    try {
      await api("/blogs/create/", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
    } catch (err) {
      console.error("Failed to create entry:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <JournalContext.Provider value={{ addEntry, isSubmitting }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be used within JournalProvider");
  return ctx;
};
