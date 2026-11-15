"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProgressState {
  completed: Record<string, boolean>;
  toggleSection: (href: string) => void;
  isCompleted: (href: string) => boolean;
  getCompletionPercentage: () => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressState>({
  completed: {},
  toggleSection: () => {},
  isCompleted: () => false,
  getCompletionPercentage: () => 0,
  resetProgress: () => {},
});

const TOTAL_TRACKABLE_SECTIONS = 14;

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("playwright_learning_progress");
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSection = (href: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [href]: !prev[href] };
      localStorage.setItem("playwright_learning_progress", JSON.stringify(next));
      return next;
    });
  };

  const isCompleted = (href: string) => !!completed[href];

  const getCompletionPercentage = () => {
    const doneCount = Object.values(completed).filter(Boolean).length;
    return Math.min(100, Math.round((doneCount / TOTAL_TRACKABLE_SECTIONS) * 100));
  };

  const resetProgress = () => {
    setCompleted({});
    localStorage.removeItem("playwright_learning_progress");
  };

  return (
    <ProgressContext.Provider
      value={{
        completed,
        toggleSection,
        isCompleted,
        getCompletionPercentage,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
