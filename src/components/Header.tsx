"use client";

import React from "react";
import {
  Cloud,
  Moon,
  Sun,
  ExternalLink,
  Award,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  totalAnswered: number;
  totalQuestions: number;
  onResetProgress: () => void;
  onOpenPdfExport?: () => void;
}

export function Header({
  isDark,
  onToggleTheme,
  totalAnswered,
  totalQuestions,
  onResetProgress,
  onOpenPdfExport,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
            <Cloud className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white">
                AWS re/Start
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                KC Prep
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              Interactive Knowledge Check MCQ Simulator
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress Tracker Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Mastery:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {totalAnswered} / {totalQuestions}
            </span>
          </div>

          {/* Canvas Course Grade Reference */}
          <a
            href="https://awsrestart.instructure.com/courses/4448/grades"
            target="_blank"
            rel="noopener noreferrer"
            title="Open AWS re/Start Canvas Gradebook"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-800 transition"
          >
            <span>Canvas Gradebook</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* PDF Study Guide Export */}
          {onOpenPdfExport && (
            <button
              onClick={onOpenPdfExport}
              title="Download or Print PDF Study Guide"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>PDF Study Guide</span>
            </button>
          )}

          {/* Reset Stats */}
          {totalAnswered > 0 && (
            <button
              onClick={onResetProgress}
              title="Reset practice session progress"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
