"use client";

import React, { useEffect } from "react";
import { Question } from "@/data/kc-questions";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Share2,
  Sparkles,
  Info,
  ChevronRight,
  Key,
} from "lucide-react";

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptions: number[];
  onSelectOption: (optionIndex: number) => void;
  onSubmitMultiple: () => void;
  isMultipleSubmitted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isExamMode: boolean;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptions,
  onSelectOption,
  onSubmitMultiple,
  isMultipleSubmitted,
  onNext,
  onPrevious,
  isBookmarked,
  onToggleBookmark,
  isExamMode,
}: QuizCardProps) {
  const isMultiple = Boolean(question.isMultipleAnswer);
  const expectedAnswers = question.correctAnswers && question.correctAnswers.length > 0
    ? question.correctAnswers
    : [question.correctAnswer];
  
  // In Exam Mode, having at least one selection means answered.
  // In Study Mode for multi-answer, it must be explicitly submitted.
  // For single-choice in Study Mode, selecting one option immediately marks as answered.
  const isAnswered = isExamMode
    ? selectedOptions.length > 0
    : isMultiple
    ? isMultipleSubmitted
    : selectedOptions.length > 0;

  // Check correctness: exact match of selection with expected answers
  const isCorrect =
    expectedAnswers.length === selectedOptions.length &&
    expectedAnswers.every((ans) => selectedOptions.includes(ans));

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Keyboard shortcut listener for A, B, C, D (or 1, 2, 3, 4) and Enter
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      if (!isAnswered || isExamMode || (isMultiple && !isMultipleSubmitted)) {
        if (key === "A" || key === "1") onSelectOption(0);
        else if (key === "B" || key === "2") onSelectOption(1);
        else if (key === "C" || key === "3") onSelectOption(2);
        else if (key === "D" || key === "4") onSelectOption(3);
        else if (key === "E" || key === "5") onSelectOption(4);
      }

      if (e.key === "Enter") {
        if (isMultiple && !isExamMode && !isMultipleSubmitted && selectedOptions.length > 0) {
          onSubmitMultiple();
        } else if (isAnswered) {
          onNext();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, isExamMode, isMultiple, isMultipleSubmitted, selectedOptions, onSelectOption, onSubmitMultiple, onNext]);

  return (
    <div className="w-full bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 overflow-hidden">
      {/* Top Progress & Meta Bar */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Breadcrumbs: Module > Topic */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-slate-700 dark:text-slate-300 font-semibold shrink-0">
              {question.module}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-amber-600 dark:text-amber-400 font-medium truncate">
              {question.topic}
            </span>
          </div>

          {/* Question Counter & Badges & Action Icons */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
            {isMultiple && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                <span>Select {question.expectedCount || expectedAnswers.length}</span>
              </span>
            )}

            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <span>Question {currentIndex + 1}</span>
              <span className="text-slate-400">/</span>
              <span>{totalQuestions}</span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              title={isBookmarked ? "Remove bookmark" : "Bookmark question for review"}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Body */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold shrink-0 mt-0.5">
              Q{currentIndex + 1}
            </span>
            <div className="space-y-1">
              <h1 className="text-lg md:text-xl font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
                {question.question}
              </h1>
              {isMultiple && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Multiple-response question: Please select {question.expectedCount || expectedAnswers.length} correct answers.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Choices List */}
        <div className="space-y-3 pt-1">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(idx);
            const isCorrectOption = expectedAnswers.includes(idx);

            // Determine styling based on state
            let containerStyle =
              "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 text-slate-800 dark:text-slate-200";
            let badgeStyle =
              "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";

            if (isExamMode) {
              if (isSelected) {
                containerStyle =
                  "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/30";
                badgeStyle = "bg-amber-500 text-slate-950 border-amber-600 font-bold";
              }
            } else if (isAnswered) {
              // Study Mode with validated state
              if (isCorrectOption) {
                // Correct option highlights in clean emerald green
                containerStyle =
                  "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500/20";
                badgeStyle =
                  "bg-emerald-600 text-white border-emerald-600 font-bold";
              } else if (isSelected) {
                // Selected incorrect option highlights in rose red
                containerStyle =
                  "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-1 ring-rose-500/20";
                badgeStyle = "bg-rose-600 text-white border-rose-600 font-bold";
              } else {
                containerStyle =
                  "border-slate-200 dark:border-slate-800/80 opacity-60 bg-white/50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400";
              }
            } else if (isSelected) {
              // Multi-choice state before submission in Study Mode
              containerStyle =
                "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/30";
              badgeStyle = "bg-blue-600 text-white border-blue-600 font-bold";
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered && !isExamMode}
                onClick={() => onSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${containerStyle}`}
              >
                {/* Option Letter / Checkbox Badge */}
                <div
                  className={`w-7 h-7 rounded-${isMultiple ? "md" : "lg"} border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}
                >
                  {isMultiple && isSelected && !isAnswered ? "✓" : OPTION_LABELS[idx] || `${idx + 1}`}
                </div>

                {/* Option Text */}
                <div className="flex-1 text-sm md:text-base leading-snug pt-0.5">
                  {option}
                </div>

                {/* Validation Indicator Icon */}
                {!isExamMode && isAnswered && (
                  <div className="shrink-0 pt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Multi-answer Study Mode Submit Button */}
        {isMultiple && !isExamMode && !isMultipleSubmitted && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedOptions.length === 0
                ? `Select ${question.expectedCount || expectedAnswers.length} options to submit`
                : `${selectedOptions.length} of ${question.expectedCount || expectedAnswers.length} options selected`}
            </span>
            <button
              type="button"
              onClick={onSubmitMultiple}
              disabled={selectedOptions.length === 0}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Immediate Feedback Alert & Explanation (Study Mode) */}
        {!isExamMode && isAnswered && (
          <div
            className={`p-5 rounded-xl border animate-in fade-in duration-200 ${
              isCorrect
                ? "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100"
                : "bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-slate-900 dark:text-slate-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                    {isMultiple ? "All answers correct! Great job." : "Correct! Great job."}
                  </span>
                </>
              ) : (
                <>
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                    Review Explanation
                  </span>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 pl-7">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls & Next Button */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Keyboard Helper Hint */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Key className="w-3.5 h-3.5" />
          <span>
            {isMultiple
              ? "Press keys [A-E] to toggle choices • Click Submit when ready"
              : "Press keys [A-D] or [1-4] to answer • [Enter] for next"}
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Previous Question Button */}
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Next Question / Finish Button */}
          <button
            type="button"
            onClick={onNext}
            disabled={!isAnswered}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold shadow-sm hover:shadow transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
          >
            <span>
              {currentIndex + 1 === totalQuestions ? "Finish Quiz" : "Next Question"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
