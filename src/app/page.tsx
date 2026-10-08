"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Question,
  MODULES,
  TOPICS_BY_MODULE,
  QUESTIONS,
  filterQuestions,
  shuffleQuestions,
} from "@/data/kc-questions";
import { Header } from "@/components/Header";
import { TopicSelector } from "@/components/TopicSelector";
import { QuizCard } from "@/components/QuizCard";
import { Scoreboard } from "@/components/Scoreboard";
import { PdfExportModal } from "@/components/PdfExportModal";
import {
  Layers,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Terminal,
  Server,
  Database,
  Network,
  Cpu,
  GraduationCap,
} from "lucide-react";

interface QuestionResult {
  question: Question;
  selectedAnswers: number[];
  isCorrect: boolean;
}

export default function Home() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(false);

  // Selector state
  const [selectedModule, setSelectedModule] = useState<string>("All Modules");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [questionLimit, setQuestionLimit] = useState<number>(10);

  // Active quiz state
  const [viewState, setViewState] = useState<"selector" | "quiz" | "scoreboard">(
    "selector"
  );
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isMultipleSubmitted, setIsMultipleSubmitted] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuestionResult[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [masteredQuestionIds, setMasteredQuestionIds] = useState<string[]>([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Initialize theme and bookmarks from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("aws_kc_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const savedBookmarks = localStorage.getItem("aws_kc_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }

    const savedMastery = localStorage.getItem("aws_kc_mastery");
    if (savedMastery) {
      try {
        setMasteredQuestionIds(JSON.parse(savedMastery));
      } catch (e) {
        console.error("Failed to parse mastery", e);
      }
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("aws_kc_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("aws_kc_theme", "light");
      }
      return next;
    });
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("aws_kc_bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetProgress = () => {
    if (window.confirm("Reset all quiz progress and answered questions?")) {
      setMasteredQuestionIds([]);
      setBookmarkedIds([]);
      localStorage.removeItem("aws_kc_mastery");
      localStorage.removeItem("aws_kc_bookmarks");
      setQuizResults([]);
      setViewState("selector");
    }
  };

  // Compute available pool for current selector settings
  const filteredPool = useMemo(() => {
    return filterQuestions(selectedModule, selectedTopic);
  }, [selectedModule, selectedTopic]);

  // Start Quiz session
  const startQuiz = useCallback(
    (customQuestions?: Question[]) => {
      let pool = customQuestions || [...filteredPool];
      if (isShuffled) {
        pool = shuffleQuestions(pool);
      }
      if (questionLimit && questionLimit < pool.length) {
        pool = pool.slice(0, questionLimit);
      }

      if (pool.length === 0) return;

      setActiveQuestions(pool);
      setCurrentIndex(0);
      setSelectedOptions([]);
      setIsMultipleSubmitted(false);
      setQuizResults([]);
      setViewState("quiz");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filteredPool, isShuffled, questionLimit]
  );

  // Handle option select
  const handleSelectOption = (index: number) => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    if (currentQ.isMultipleAnswer) {
      // In study mode, prevent changing after submitting
      if (!isExamMode && isMultipleSubmitted) return;
      setSelectedOptions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      // In study mode, prevent changing after selecting
      if (!isExamMode && selectedOptions.length > 0) return;
      setSelectedOptions([index]);
    }
  };

  // Handle multi-answer submission in Study Mode
  const handleSubmitMultiple = () => {
    if (selectedOptions.length === 0) return;
    setIsMultipleSubmitted(true);
  };

  // Next Question or Finish Quiz
  const handleNextQuestion = () => {
    if (selectedOptions.length === 0) return;

    const currentQuestion = activeQuestions[currentIndex];
    const isMultiple = Boolean(currentQuestion.isMultipleAnswer);
    if (!isExamMode && isMultiple && !isMultipleSubmitted) return;

    const expectedAnswers =
      currentQuestion.correctAnswers && currentQuestion.correctAnswers.length > 0
        ? currentQuestion.correctAnswers
        : [currentQuestion.correctAnswer];

    const isCorrect =
      expectedAnswers.length === selectedOptions.length &&
      expectedAnswers.every((ans) => selectedOptions.includes(ans));

    // Record result
    const newResult: QuestionResult = {
      question: currentQuestion,
      selectedAnswers: selectedOptions,
      isCorrect,
    };

    const updatedResults = [...quizResults, newResult];
    setQuizResults(updatedResults);

    // Update mastery if correct
    if (isCorrect && !masteredQuestionIds.includes(currentQuestion.id)) {
      const nextMastery = [...masteredQuestionIds, currentQuestion.id];
      setMasteredQuestionIds(nextMastery);
      localStorage.setItem("aws_kc_mastery", JSON.stringify(nextMastery));
    }

    // Check if end of quiz
    if (currentIndex + 1 >= activeQuestions.length) {
      setViewState("scoreboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptions([]);
      setIsMultipleSubmitted(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // Restore previous answer if exists
      const prevResult = quizResults[currentIndex - 1];
      setSelectedOptions(prevResult ? prevResult.selectedAnswers : []);
      setIsMultipleSubmitted(prevResult ? true : false);
    }
  };

  // Retry same topic with original questions
  const handleRetryTopic = () => {
    startQuiz();
  };

  // Practice only missed questions
  const handlePracticeMissedOnly = () => {
    const missed = quizResults
      .filter((r) => !r.isCorrect)
      .map((r) => r.question);
    if (missed.length > 0) {
      startQuiz(missed);
    }
  };

  // Module category icons helper
  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case "Cloud Foundations":
        return <CloudIcon className="w-4 h-4 text-amber-500" />;
      case "Linux":
        return <Terminal className="w-4 h-4 text-emerald-500" />;
      case "Networking":
        return <Network className="w-4 h-4 text-blue-500" />;
      case "Python Programming":
        return <Cpu className="w-4 h-4 text-indigo-500" />;
      case "Databases":
        return <Database className="w-4 h-4 text-purple-500" />;
      case "Servers & Scaling":
        return <Server className="w-4 h-4 text-cyan-500" />;
      default:
        return <GraduationCap className="w-4 h-4 text-amber-500" />;
    }
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Global Navigation Bar */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        totalAnswered={masteredQuestionIds.length}
        totalQuestions={QUESTIONS.length}
        onResetProgress={handleResetProgress}
        onOpenPdfExport={() => setIsPdfModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: Topic & Settings Selector */}
        {viewState === "selector" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Quick Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-7 md:p-9 shadow-lg border border-slate-800">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Official AWS re/Start Knowledge Check Standard
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  Master Every Knowledge Check (KC)
                </h1>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Practice with {QUESTIONS.length} authentic course questions
                  harvested directly from Canvas LMS Course 4448, covering Cloud
                  Foundations, Linux, Security, Networking, Python scripting,
                  Databases, and Certification Exam Prep.
                </p>

                {/* Quick stats pills */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{MODULES.length} Course Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>96 Knowledge Check Topics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{QUESTIONS.length} Authentic Questions</span>
                  </div>
                </div>
              </div>

              {/* Decorative AWS architectural glow */}
              <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="absolute right-1/4 -top-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            </div>

            {/* Topic Selector Component */}
            <TopicSelector
              selectedModule={selectedModule}
              selectedTopic={selectedTopic}
              onSelectModule={setSelectedModule}
              onSelectTopic={setSelectedTopic}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isExamMode={isExamMode}
              onToggleExamMode={setIsExamMode}
              isShuffled={isShuffled}
              onToggleShuffle={setIsShuffled}
              questionLimit={questionLimit}
              onQuestionLimitChange={setQuestionLimit}
              onStartQuiz={() => startQuiz()}
              activeQuestionCount={filteredPool.length}
              onOpenPdfExport={() => setIsPdfModalOpen(true)}
            />

            {/* Quick Module Jump Tiles */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Jump Directly to Course Modules</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MODULES.map((mod) => {
                  const topics = TOPICS_BY_MODULE[mod] || [];
                  const questionsInMod = filterQuestions(mod, "All Topics").length;
                  const isSelected = selectedModule === mod;

                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => {
                        setSelectedModule(mod);
                        setSelectedTopic("All Topics");
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/30"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d31] hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {getModuleIcon(mod)}
                          <span className="truncate">{mod}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{topics.length} KC Assignments</span>
                        <span>•</span>
                        <span>{questionsInMod} Questions</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Active Quiz Interface */}
        {viewState === "quiz" && currentQ && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Top Navigation Bar back to Selector */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewState("selector")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
              >
                ← Back to Topic Selector
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isExamMode ? "Exam Mode (Evaluation at end)" : "Study Mode (Instant Feedback)"}
              </div>
            </div>

            {/* Quiz Card */}
            <QuizCard
              question={currentQ}
              currentIndex={currentIndex}
              totalQuestions={activeQuestions.length}
              selectedOptions={selectedOptions}
              onSelectOption={handleSelectOption}
              onSubmitMultiple={handleSubmitMultiple}
              isMultipleSubmitted={isMultipleSubmitted}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              isBookmarked={bookmarkedIds.includes(currentQ.id)}
              onToggleBookmark={() => handleToggleBookmark(currentQ.id)}
              isExamMode={isExamMode}
            />
          </div>
        )}

        {/* VIEW 3: Scoreboard & Review Screen */}
        {viewState === "scoreboard" && (
          <div className="space-y-4">
            <Scoreboard
              results={quizResults}
              onRetryTopic={handleRetryTopic}
              onPracticeMissedOnly={handlePracticeMissedOnly}
              onChooseAnotherTopic={() => setViewState("selector")}
              topicName={selectedTopic}
              moduleName={selectedModule}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AWS re/Start Knowledge Check Prep
            </span>
            <span>•</span>
            <span>All 96 KC Topics Covered (584 Questions)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Next.js 16 App Router</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>
      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        currentFilteredQuestions={filteredPool}
        selectedModuleName={selectedModule}
        selectedTopicName={selectedTopic}
      />
    </div>
  );
}

function CloudIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}
