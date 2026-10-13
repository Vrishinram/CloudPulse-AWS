"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  X,
  Loader2,
  AlertCircle,
  UserCheck,
} from "lucide-react";

interface SocialUnlockModalProps {
  isOpen: boolean;
  isLocked: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const SOCIAL_LINKS = {
  github: "https://github.com/Vrishinram",
  linkedin: "https://linkedin.com/in/vrishin-ram-k",
  instagram: "https://instagram.com/cybersicker",
};

export function SocialUnlockModal({
  isOpen,
  isLocked,
  onClose,
  onUnlock,
}: SocialUnlockModalProps) {
  // Verification states: "idle" | "verifying" | "verified"
  const [githubStatus, setGithubStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [linkedinStatus, setLinkedinStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [instagramStatus, setInstagramStatus] = useState<"idle" | "verifying" | "verified">("idle");

  // Countdown timers (5 seconds each)
  const [githubCountdown, setGithubCountdown] = useState<number>(5);
  const [linkedinCountdown, setLinkedinCountdown] = useState<number>(5);
  const [instagramCountdown, setInstagramCountdown] = useState<number>(5);

  // Username confirmation
  const [visitorHandle, setVisitorHandle] = useState<string>("");
  const [handleError, setHandleError] = useState<string>("");

  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState<boolean>(false);

  // Timers references
  const githubTimerRef = useRef<NodeJS.Timeout | null>(null);
  const linkedinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const instagramTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load verified steps from localStorage if previously stored
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gh = localStorage.getItem("social_step_github_verified") === "true";
      const li = localStorage.getItem("social_step_linkedin_verified") === "true";
      const ig = localStorage.getItem("social_step_instagram_verified") === "true";
      if (gh) setGithubStatus("verified");
      if (li) setLinkedinStatus("verified");
      if (ig) setInstagramStatus("verified");

      const savedHandle = localStorage.getItem("social_visitor_handle") || "";
      if (savedHandle) setVisitorHandle(savedHandle);
    }
  }, [isOpen]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (githubTimerRef.current) clearInterval(githubTimerRef.current);
      if (linkedinTimerRef.current) clearInterval(linkedinTimerRef.current);
      if (instagramTimerRef.current) clearInterval(instagramTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const completedCount =
    (githubStatus === "verified" ? 1 : 0) +
    (linkedinStatus === "verified" ? 1 : 0) +
    (instagramStatus === "verified" ? 1 : 0);

  const isAllVerified = completedCount === 3;

  // Handle step verification with active 5-second verification countdown
  const handleStartVerification = (platform: "github" | "linkedin" | "instagram") => {
    const url = SOCIAL_LINKS[platform];
    window.open(url, "_blank", "noopener,noreferrer");

    if (platform === "github") {
      setGithubStatus("verifying");
      setGithubCountdown(5);
      let count = 5;
      if (githubTimerRef.current) clearInterval(githubTimerRef.current);
      githubTimerRef.current = setInterval(() => {
        count -= 1;
        setGithubCountdown(count);
        if (count <= 0) {
          if (githubTimerRef.current) clearInterval(githubTimerRef.current);
          setGithubStatus("verified");
          localStorage.setItem("social_step_github_verified", "true");
        }
      }, 1000);
    } else if (platform === "linkedin") {
      setLinkedinStatus("verifying");
      setLinkedinCountdown(5);
      let count = 5;
      if (linkedinTimerRef.current) clearInterval(linkedinTimerRef.current);
      linkedinTimerRef.current = setInterval(() => {
        count -= 1;
        setLinkedinCountdown(count);
        if (count <= 0) {
          if (linkedinTimerRef.current) clearInterval(linkedinTimerRef.current);
          setLinkedinStatus("verified");
          localStorage.setItem("social_step_linkedin_verified", "true");
        }
      }, 1000);
    } else if (platform === "instagram") {
      setInstagramStatus("verifying");
      setInstagramCountdown(5);
      let count = 5;
      if (instagramTimerRef.current) clearInterval(instagramTimerRef.current);
      instagramTimerRef.current = setInterval(() => {
        count -= 1;
        setInstagramCountdown(count);
        if (count <= 0) {
          if (instagramTimerRef.current) clearInterval(instagramTimerRef.current);
          setInstagramStatus("verified");
          localStorage.setItem("social_step_instagram_verified", "true");
        }
      }, 1000);
    }
  };

  // Final submit unlock
  const handleFinalUnlock = () => {
    if (!isAllVerified) {
      return;
    }

    if (!visitorHandle.trim()) {
      setHandleError("Please enter your name or Instagram/GitHub handle to verify.");
      return;
    }

    setHandleError("");
    setIsSuccessUnlocked(true);
    localStorage.setItem("cloudpulse_unlocked", "true");
    localStorage.setItem("social_visitor_handle", visitorHandle.trim());

    try {
      confetti({
        particleCount: 150,
        spread: 90,
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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-200 select-none ${
        isLocked ? "cursor-default" : ""
      }`}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
          {/* Close button ONLY visible when already unlocked / not locked */}
          {!isLocked && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner shrink-0">
              {isAllVerified || isSuccessUnlocked ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Mandatory Access Gate
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Unlock Complete AWS re/Start Prep
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
            To maintain free access for students without paid subscriptions,{" "}
            <strong>all 588+ Questions</strong> and <strong>PDF Booklets</strong>{" "}
            require actively following <strong>Vrishin Ram</strong> on all 3 platforms below.
          </p>

          {/* Progress Tracker Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
              <span>Verified Steps:</span>
              <span
                className={`px-2 py-0.5 rounded-md font-bold ${
                  isAllVerified
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {completedCount} / 3 Completed
              </span>
            </div>
            <div className="w-28 sm:w-36 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isAllVerified
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-amber-500 to-amber-600"
                }`}
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
              githubStatus === "verified"
                ? "bg-emerald-500/5 border-emerald-500/40 dark:bg-emerald-500/10"
                : githubStatus === "verifying"
                ? "bg-amber-500/5 border-amber-500/40"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  githubStatus === "verified"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                }`}
              >
                {githubStatus === "verified" ? (
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
                  {githubStatus === "verified" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      [Verified ✓]
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Follow <strong>@Vrishinram</strong> & star project
                </p>
              </div>
            </div>

            <button
              onClick={() => handleStartVerification("github")}
              disabled={githubStatus === "verifying" || githubStatus === "verified"}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                githubStatus === "verified"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default"
                  : githubStatus === "verifying"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 cursor-wait"
                  : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              {githubStatus === "verified" ? (
                <span>Done ✓</span>
              ) : githubStatus === "verifying" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying ({githubCountdown}s)</span>
                </>
              ) : (
                <>
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Step 2: LinkedIn */}
          <div
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              linkedinStatus === "verified"
                ? "bg-emerald-500/5 border-emerald-500/40 dark:bg-emerald-500/10"
                : linkedinStatus === "verifying"
                ? "bg-amber-500/5 border-amber-500/40"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  linkedinStatus === "verified"
                    ? "bg-emerald-500 text-white"
                    : "bg-[#0077B5] text-white"
                }`}
              >
                {linkedinStatus === "verified" ? (
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
                  {linkedinStatus === "verified" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      [Verified ✓]
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Connect with <strong>Vrishin Ram K</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleStartVerification("linkedin")}
              disabled={linkedinStatus === "verifying" || linkedinStatus === "verified"}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                linkedinStatus === "verified"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default"
                  : linkedinStatus === "verifying"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 cursor-wait"
                  : "bg-[#0077B5] text-white hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              {linkedinStatus === "verified" ? (
                <span>Done ✓</span>
              ) : linkedinStatus === "verifying" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying ({linkedinCountdown}s)</span>
                </>
              ) : (
                <>
                  <span>Connect</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Step 3: Instagram */}
          <div
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              instagramStatus === "verified"
                ? "bg-emerald-500/5 border-emerald-500/40 dark:bg-emerald-500/10"
                : instagramStatus === "verifying"
                ? "bg-amber-500/5 border-amber-500/40"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  instagramStatus === "verified"
                    ? "bg-emerald-500 text-white"
                    : "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white"
                }`}
              >
                {instagramStatus === "verified" ? (
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
                  {instagramStatus === "verified" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      [Verified ✓]
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Follow <strong>@cybersicker</strong> on Instagram
                </p>
              </div>
            </div>

            <button
              onClick={() => handleStartVerification("instagram")}
              disabled={instagramStatus === "verifying" || instagramStatus === "verified"}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                instagramStatus === "verified"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default"
                  : instagramStatus === "verifying"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 cursor-wait"
                  : "bg-gradient-to-r from-[#dc2743] to-[#bc1888] text-white hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              {instagramStatus === "verified" ? (
                <span>Done ✓</span>
              ) : instagramStatus === "verifying" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying ({instagramCountdown}s)</span>
                </>
              ) : (
                <>
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Mandatory Confirmation Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Name or Username (for verification confirmation):
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. John Doe / @johndoe"
                value={visitorHandle}
                onChange={(e) => {
                  setVisitorHandle(e.target.value);
                  if (handleError) setHandleError("");
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  handleError
                    ? "border-rose-500 text-rose-600"
                    : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                }`}
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            {handleError && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{handleError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer CTAs: Strictly Locked unless completed */}
        <div className="p-5 sm:p-6 pt-0 space-y-2.5">
          <button
            onClick={handleFinalUnlock}
            disabled={!isAllVerified}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
              isAllVerified
                ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-105 active:scale-[0.99] cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800/90 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700/50 cursor-not-allowed opacity-80"
            }`}
          >
            {isSuccessUnlocked ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                <span>Access Granted! Welcome to CloudPulse...</span>
              </>
            ) : isAllVerified ? (
              <>
                <Unlock className="w-5 h-5" />
                <span>🎉 All 3 Verified — Unlock Full Exam Access!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-400" />
                <span>
                  Locked: Must Verify All 3 Accounts ({completedCount}/3)
                </span>
              </>
            )}
          </button>

          {/* Secure Trust Badge — Zero Backdoor */}
          <div className="flex items-center justify-center pt-1 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Free & Ad-Free Student Access</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
