"use client";

import React, { useMemo } from "react";
import {
  MODULES,
  TOPICS_BY_MODULE,
  QUESTIONS,
  getQuestionsByModule,
  getQuestionsByTopic,
} from "@/data/kc-questions";
import {
  Layers,
  BookOpen,
  Search,
  Shuffle,
  Clock,
  Sparkles,
  Award,
  Zap,
  FileDown,
} from "lucide-react";

interface TopicSelectorProps {
  selectedModule: string;
  selectedTopic: string;
  onSelectModule: (module: string) => void;
  onSelectTopic: (topic: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isExamMode: boolean;
  onToggleExamMode: (examMode: boolean) => void;
  isShuffled: boolean;
  onToggleShuffle: (shuffled: boolean) => void;
  questionLimit: number;
  onQuestionLimitChange: (limit: number) => void;
  onStartQuiz: () => void;
  activeQuestionCount: number;
  onOpenPdfExport?: () => void;
}

export function TopicSelector({
  selectedModule,
  selectedTopic,
  onSelectModule,
  onSelectTopic,
  searchQuery,
  onSearchChange,
  isExamMode,
  onToggleExamMode,
  isShuffled,
  onToggleShuffle,
  questionLimit,
  onQuestionLimitChange,
  onStartQuiz,
  activeQuestionCount,
  onOpenPdfExport,
}: TopicSelectorProps) {
  // Cascading topics based on selected module
  const availableTopics = useMemo(() => {
    if (selectedModule === "All Modules") {
      const all: string[] = [];
      MODULES.forEach((m) => {
        all.push(...(TOPICS_BY_MODULE[m] || []));
      });
      return all;
    }
    return TOPICS_BY_MODULE[selectedModule] || [];
  }, [selectedModule]);

  // Filtered topics if user is searching
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return availableTopics;
    return availableTopics.filter((t) =>
      t.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableTopics, searchQuery]);

  // Counts
  const moduleQuestionCount = useMemo(() => {
    return getQuestionsByModule(selectedModule).length;
  }, [selectedModule]);

  const topicQuestionCount = useMemo(() => {
    if (selectedTopic === "All Topics") return moduleQuestionCount;
    return getQuestionsByTopic(selectedTopic).length;
  }, [selectedTopic, moduleQuestionCount]);

  return (
    <div className="w-full bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-7 space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              AWS re/Start Knowledge Check Prep
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              v1.0 • 65 KC Topics
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Configure Your Practice Session
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Select a specific Knowledge Check topic or take an aggregated module mock exam.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenPdfExport && (
            <button
              type="button"
              onClick={onOpenPdfExport}
              title="Download or Print PDF Study Guide"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-sm font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-amber-500" />
              <span>PDF Study Guide</span>
            </button>
          )}

          {/* Start / Jump to Quiz Button */}
          <button
            onClick={onStartQuiz}
            disabled={activeQuestionCount === 0}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Start Practice ({activeQuestionCount} Qs)</span>
          </button>
        </div>
      </div>

      {/* Cascading Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1: Select Module */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              1. Select Module
            </span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              {moduleQuestionCount} questions available
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedModule}
              onChange={(e) => {
                const newModule = e.target.value;
                onSelectModule(newModule);
                onSelectTopic("All Topics");
              }}
              className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer pr-10"
            >
              <option value="All Modules">All Modules ({QUESTIONS.length} Questions)</option>
              {MODULES.map((mod) => {
                const count = getQuestionsByModule(mod).length;
                return (
                  <option key={mod} value={mod}>
                    {mod} ({count} Questions)
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Step 2: Select Topic / KC */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              2. Select Knowledge Check (KC)
            </span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              {topicQuestionCount} questions in selection
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => onSelectTopic(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer pr-10"
            >
              <option value="All Topics">
                All Topics ({moduleQuestionCount} Questions)
              </option>
              {availableTopics.map((top) => {
                const count = getQuestionsByTopic(top).length;
                return (
                  <option key={top} value={top}>
                    {top} ({count} Qs)
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search & Filter by Topic Keyword */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Quick Topic Search
          </label>
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search KC assignments (e.g., 'S3', 'Linux Commands', 'VPC', 'DynamoDB', 'IAM')..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        {/* Search Results Quick Pills (if searching) */}
        {searchQuery.trim().length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Matching KC Topics ({filteredTopics.length}):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-100/60 dark:bg-slate-900/40 rounded-lg">
              {filteredTopics.length === 0 ? (
                <span className="text-xs text-slate-400 p-2">
                  No matching KC assignments found.
                </span>
              ) : (
                filteredTopics.map((top) => (
                  <button
                    key={top}
                    onClick={() => {
                      onSelectTopic(top);
                      onSearchChange("");
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md transition-all text-left truncate max-w-xs cursor-pointer ${
                      selectedTopic === top
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {top}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Practice Mode & Settings Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Practice vs Exam Mode Toggle */}
        <div className="bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Practice Mode
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isExamMode
                  ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                  : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {isExamMode ? "Exam Mode" : "Study Mode"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => onToggleExamMode(false)}
              className={`py-1 rounded font-medium transition cursor-pointer ${
                !isExamMode
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Study Mode
            </button>
            <button
              type="button"
              onClick={() => onToggleExamMode(true)}
              className={`py-1 rounded font-medium transition cursor-pointer ${
                isExamMode
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Exam Mode
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isExamMode
              ? "Immediate feedback hidden until submission."
              : "Instant answer check with detailed explanation."}
          </p>
        </div>

        {/* Question Limit */}
        <div className="bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Question Limit
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Max: {topicQuestionCount}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs">
            {[5, 10, 20, 0].map((limit) => {
              const label = limit === 0 ? "All" : `${limit}`;
              const isSelected =
                limit === 0
                  ? questionLimit >= topicQuestionCount
                  : questionLimit === limit;
              return (
                <button
                  key={limit}
                  type="button"
                  onClick={() =>
                    onQuestionLimitChange(limit === 0 ? 9999 : limit)
                  }
                  className={`py-1 rounded font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Current pool: {activeQuestionCount} questions
          </p>
        </div>

        {/* Shuffle Option */}
        <div className="bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
              Shuffle Questions
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isShuffled}
                onChange={(e) => onToggleShuffle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
            </label>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isShuffled
              ? "Questions randomized on each start."
              : "Ordered sequentially as taught in curriculum."}
          </p>
        </div>
      </div>
    </div>
  );
}
