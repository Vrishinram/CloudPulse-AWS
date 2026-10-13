"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Heart,
  Sparkles,
  ShieldCheck,
  X,
  Share2,
} from "lucide-react";

interface SocialUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const SOCIAL_LINKS = {
  github: "https://github.com/Vrishinram",
  githubRepo: "https://github.com/Vrishinram/CloudPulse-AWS",
  linkedin: "https://linkedin.com/in/vrishin-ram-k",
  instagram: "https://instagram.com/cybersicker",
};

export function SocialUnlockModal({
  isOpen,
  onClose,
  onUnlock,
}: SocialUnlockModalProps) {
  const [hasFollowedGithub, setHasFollowedGithub] = useState<boolean>(false);
  const [hasFollowedLinkedin, setHasFollowedLinkedin] = useState<boolean>(false);
  const [hasFollowedInstagram, setHasFollowedInstagram] = useState<boolean>(false);
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState<boolean>(false);

  // Initialize progress from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gh = localStorage.getItem("social_step_github") === "true";
      const li = localStorage.getItem("social_step_linkedin") === "true";
      const ig = localStorage.getItem("social_step_instagram") === "true";
      setHasFollowedGithub(gh);
      setHasFollowedLinkedin(li);
      setHasFollowedInstagram(ig);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const completedCount =
    (hasFollowedGithub ? 1 : 0) +
    (hasFollowedLinkedin ? 1 : 0) +
    (hasFollowedInstagram ? 1 : 0);

  const isAllCompleted = completedCount === 3;

  const handleOpenLink = (platform: "github" | "linkedin" | "instagram", url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    if (platform === "github") {
      setHasFollowedGithub(true);
      localStorage.setItem("social_step_github", "true");
    } else if (platform === "linkedin") {
      setHasFollowedLinkedin(true);
      localStorage.setItem("social_step_linkedin", "true");
    } else if (platform === "instagram") {
      setHasFollowedInstagram(true);
      localStorage.setItem("social_step_instagram", "true");
    }
  };

  const handleCompleteUnlock = () => {
    setIsSuccessUnlocked(true);
    localStorage.setItem("cloudpulse_unlocked", "true");
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onUnlock();
      onClose();
    }, 900);
  };

  const handleDirectBypass = () => {
    localStorage.setItem("cloudpulse_unlocked", "true");
    onUnlock();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              {isAllCompleted || isSuccessUnlocked ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> 100% Free Access
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Unlock Complete Exam Mastery
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
            Instead of charging a fee for this platform, all{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              588+ Questions
            </strong>
            ,{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              96 Knowledge Checks
            </strong>
            , and{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              PDF Study Booklets
            </strong>{" "}
            are unlocked by supporting <strong>Vrishin Ram</strong> across 3 platforms!
          </p>

          {/* Progress Tracker Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
              <span>Support Progress:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                {completedCount} / 3 Completed
              </span>
            </div>
            <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Steps Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Step 1: GitHub */}
          <div
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              hasFollowedGithub
                ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  hasFollowedGithub
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                }`}
              >
                {hasFollowedGithub ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  1. Follow on GitHub
                  {hasFollowedGithub && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      (Completed)
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Follow <strong>@Vrishinram</strong> & star this project
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenLink("github", SOCIAL_LINKS.github)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                hasFollowedGithub
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
              }`}
            >
              <span>{hasFollowedGithub ? "Followed ✓" : "Follow"}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Step 2: LinkedIn */}
          <div
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              hasFollowedLinkedin
                ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  hasFollowedLinkedin
                    ? "bg-emerald-500 text-white"
                    : "bg-[#0077B5] text-white"
                }`}
              >
                {hasFollowedLinkedin ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  2. Connect on LinkedIn
                  {hasFollowedLinkedin && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      (Completed)
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Connect with <strong>Vrishin Ram K</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenLink("linkedin", SOCIAL_LINKS.linkedin)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                hasFollowedLinkedin
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-[#0077B5] text-white hover:opacity-90"
              }`}
            >
              <span>{hasFollowedLinkedin ? "Connected ✓" : "Connect"}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Step 3: Instagram */}
          <div
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              hasFollowedInstagram
                ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  hasFollowedInstagram
                    ? "bg-emerald-500 text-white"
                    : "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white"
                }`}
              >
                {hasFollowedInstagram ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  3. Follow on Instagram
                  {hasFollowedInstagram && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      (Completed)
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Follow <strong>@cybersicker</strong> on Instagram
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenLink("instagram", SOCIAL_LINKS.instagram)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                hasFollowedInstagram
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-gradient-to-r from-[#dc2743] to-[#bc1888] text-white hover:opacity-90"
              }`}
            >
              <span>{hasFollowedInstagram ? "Followed ✓" : "Follow"}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-5 sm:p-6 pt-0 space-y-2.5">
          <button
            onClick={handleCompleteUnlock}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
              isAllCompleted || completedCount > 0
                ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-105 active:scale-[0.99] cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            {isSuccessUnlocked ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Access Granted! Welcome...</span>
              </>
            ) : isAllCompleted ? (
              <>
                <Unlock className="w-5 h-5" />
                <span>🎉 All 3 Completed — Unlock Lifetime Access!</span>
              </>
            ) : completedCount > 0 ? (
              <>
                <Unlock className="w-5 h-5" />
                <span>Unlock Full Access ({completedCount}/3 Done)</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Click Links Above to Unlock Free Access</span>
              </>
            )}
          </button>

          {/* Quick bypass for returning friends / creator */}
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> No fees, no ads
            </span>
            <button
              onClick={handleDirectBypass}
              className="text-[11px] font-medium text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400 underline underline-offset-2 transition"
            >
              Already followed? Continue directly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
