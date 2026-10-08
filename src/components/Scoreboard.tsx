"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/data/kc-questions";
import {
  Trophy,
  RotateCcw,
  ListFilter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuestionResult {
  question: Question;
  selectedAnswers: number[];
  isCorrect: boolean;
}

interface ScoreboardProps {
  results: QuestionResult[];
  onRetryTopic: () => void;
  onPracticeMissedOnly: () => void;
  onChooseAnotherTopic: () => void;
  topicName: string;
  moduleName: string;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function Scoreboard({
  results,
  onRetryTopic,
  onPracticeMissedOnly,
  onChooseAnotherTopic,
  topicName,
  moduleName,
}: ScoreboardProps) {
  const [filterMode, setFilterMode] = useState<"all" | "missed" | "correct">("all");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const missedCount = totalQuestions - correctCount;
  const accuracyPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassing = accuracyPercentage >= 70;

  // Trigger confetti if passing score
  useEffect(() => {
    if (isPassing) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff9900", "#0073bb", "#10b981", "#6366f1"],
        });
      } catch (err) {
        console.error("Confetti trigger failed:", err);
      }
    }
  }, [isPassing]);

  const displayedResults = results.filter((r) => {
    if (filterMode === "missed") return !r.isCorrect;
    if (filterMode === "correct") return r.isCorrect;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 border border-amber-300 dark:border-amber-700/50 shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            {moduleName} • {topicName}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isPassing ? "Knowledge Check Completed!" : "Review & Reinforce Concepts"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isPassing
              ? "Great performance! You demonstrated a solid grasp of this AWS re/Start module."
              : "Keep practicing! Review the explanations below to target the areas that need reinforcement."}
          </p>
        </div>

        {/* Big Score Cards */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="text-2xl md:text-3xl font-black text-amber-500">
              {accuracyPercentage}%
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
              Accuracy
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {correctCount} / {totalQuestions}
            </div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5">
              Correct
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
            <div className="text-2xl md:text-3xl font-black text-rose-600 dark:text-rose-400">
              {missedCount}
            </div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-300 mt-0.5">
              Missed
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onRetryTopic}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Topic</span>
          </button>

          {missedCount > 0 && (
            <button
              onClick={onPracticeMissedOnly}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-sm font-bold transition active:scale-95 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Practice Missed Only ({missedCount})</span>
            </button>
          )}

          <button
            onClick={onChooseAnotherTopic}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Choose Another Topic</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-amber-500" />
            <span>Question Review & Explanations</span>
          </h3>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterMode("missed")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === "missed"
                  ? "bg-rose-500 text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Missed ({missedCount})
            </button>
            <button
              onClick={() => setFilterMode("correct")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === "correct"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Correct ({correctCount})
            </button>
          </div>
        </div>

        {/* List of Questions with Detailed Explanations */}
        <div className="space-y-3">
          {displayedResults.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
              No questions matching this filter.
            </div>
          ) : (
            displayedResults.map((item, index) => {
              const isExpanded =
                expandedQuestionId === item.question.id || filterMode === "missed";
              return (
                <div
                  key={item.question.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    item.isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10"
                  }`}
                >
                  {/* Summary Bar */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.question.id)}
                    className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition cursor-pointer"
                  >
                    <div className="shrink-0 mt-0.5">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                        {item.question.topic}
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {item.question.question}
                      </p>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Choices & Detailed Explanation */}
                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 space-y-3">
                      {/* Choices breakdown */}
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        {item.question.options.map((opt, optIdx) => {
                          const isUserAnswer = (item.selectedAnswers || []).includes(optIdx);
                          const expectedAnswers =
                            item.question.correctAnswers && item.question.correctAnswers.length > 0
                              ? item.question.correctAnswers
                              : [item.question.correctAnswer];
                          const isCorrectOption = expectedAnswers.includes(optIdx);

                          let badgeClass =
                            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
                          let borderClass =
                            "border-slate-200 dark:border-slate-800";

                          if (isCorrectOption) {
                            badgeClass =
                              "bg-emerald-600 text-white font-bold";
                            borderClass =
                              "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium";
                          } else if (isUserAnswer) {
                            badgeClass = "bg-rose-600 text-white font-bold";
                            borderClass =
                              "border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${borderClass}`}
                            >
                              <span
                                className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${badgeClass}`}
                              >
                                {OPTION_LABELS[optIdx] || `${optIdx + 1}`}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrectOption && (
                                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                                  Correct Answer
                                </span>
                              )}
                              {isUserAnswer && !isCorrectOption && (
                                <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 rounded">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        <strong className="text-amber-600 dark:text-amber-400 block mb-1">
                          Explanation:
                        </strong>
                        {item.question.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
