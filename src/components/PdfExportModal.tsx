"use client";

import React, { useState } from "react";
import { Question, QUESTIONS } from "@/data/kc-questions";
import { exportQuestionsToPdf } from "@/utils/pdfExport";
import {
  FileDown,
  Printer,
  CheckCircle2,
  X,
  Loader2,
  BookOpen,
  Layers,
  Sparkles,
} from "lucide-react";

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilteredQuestions: Question[];
  selectedModuleName: string;
  selectedTopicName: string;
}

export function PdfExportModal({
  isOpen,
  onClose,
  currentFilteredQuestions,
  selectedModuleName,
  selectedTopicName,
}: PdfExportModalProps) {
  const [scope, setScope] = useState<"all" | "filtered">("all");
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ percent: number; current: number; total: number } | null>(null);

  if (!isOpen) return null;

  const targetQuestions = scope === "all" ? QUESTIONS : currentFilteredQuestions;

  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      setProgress({ percent: 0, current: 0, total: targetQuestions.length });

      let title = "AWS_reStart_KC_Full_Question_Bank";
      let subtitle = "All 96 Knowledge Checks (Complete Course)";

      if (scope === "filtered") {
        if (selectedTopicName !== "All Topics") {
          title = `AWS_KC_${selectedTopicName.replace(/\s+/g, "_")}`;
          subtitle = `${selectedModuleName} • ${selectedTopicName}`;
        } else if (selectedModuleName !== "All Modules") {
          title = `AWS_KC_${selectedModuleName.replace(/\s+/g, "_")}_Module`;
          subtitle = `Module: ${selectedModuleName}`;
        }
      }

      await exportQuestionsToPdf(targetQuestions, {
        title,
        subtitle,
        includeExplanations,
        onProgress: (percent, current, total) => {
          setProgress({ percent, current, total });
        },
      });

      // Brief success feedback before closing
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(null);
        onClose();
      }, 600);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Please try again or use the print option.");
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const handlePrintView = () => {
    // Open printable HTML window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked! Please allow popups to open the print view.");
      return;
    }

    const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

    const questionsHtml = targetQuestions
      .map((q, idx) => {
        const isMultiple = Boolean(q.isMultipleAnswer);
        const expected = q.correctAnswers || [q.correctAnswer ?? 0];
        const optionsHtml = (q.options || [])
          .map((opt, optIdx) => {
            const isCorrect = expected.includes(optIdx);
            return `
              <div class="option ${isCorrect ? "correct" : ""}">
                <span class="badge">${isCorrect ? "✓" : OPTION_LABELS[optIdx]}</span>
                <span class="text">${opt}</span>
                ${isCorrect ? `<span class="tag">CORRECT</span>` : ""}
              </div>
            `;
          })
          .join("");

        return `
          <div class="question-card">
            <div class="meta">${q.module} &bull; ${q.topic} ${isMultiple ? `<span class="multi-tag">Select ${q.expectedCount || expected.length}</span>` : ""}</div>
            <div class="prompt"><strong>Q${idx + 1}.</strong> ${q.question}</div>
            <div class="options-list">${optionsHtml}</div>
            ${
              includeExplanations && q.explanation
                ? `<div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AWS re/Start Knowledge Check Study Guide (${targetQuestions.length} Questions)</title>
          <style>
            @page { margin: 15mm; size: A4; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 11pt; color: #0f172a; margin: 0; padding: 20px; line-height: 1.4; }
            .header-banner { background: #0f172a; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
            .header-banner h1 { margin: 0 0 6px; font-size: 16pt; color: #ff9900; }
            .header-banner p { margin: 0; font-size: 9pt; color: #cbd5e1; }
            .question-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; page-break-inside: avoid; }
            .meta { font-size: 8.5pt; color: #64748b; font-weight: 600; margin-bottom: 4px; }
            .multi-tag { background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-size: 8pt; }
            .prompt { font-size: 10.5pt; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
            .options-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px; }
            .option { display: flex; align-items: flex-start; gap: 8px; font-size: 9.5pt; padding: 4px 8px; border-radius: 4px; }
            .option.correct { background: #ecfdf5; border-left: 3px solid #10b981; font-weight: 600; color: #065f46; }
            .badge { display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; font-weight: 700; font-size: 8.5pt; border-radius: 4px; background: #f1f5f9; color: #334155; }
            .option.correct .badge { background: #10b981; color: white; }
            .tag { margin-left: auto; font-size: 7.5pt; font-weight: 700; color: #059669; }
            .explanation { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; font-size: 8.5pt; color: #475569; margin-top: 6px; }
            .no-print-bar { position: sticky; top: 0; background: #fef3c7; border: 1px solid #fde68a; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
            @media print { .no-print-bar { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print-bar">
            <span><strong>Ready to print or save:</strong> Press <kbd>Ctrl + P</kbd> (or <kbd>Cmd + P</kbd>) to save as PDF.</span>
            <button onclick="window.print()" style="padding: 6px 14px; background: #ff9900; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">Print / Save as PDF</button>
          </div>
          <div class="header-banner">
            <h1>AWS re/Start Knowledge Check Study Guide</h1>
            <p>Official Curriculum Questions, Choices &amp; Verified Correct Answers &bull; Total: ${targetQuestions.length} Questions</p>
          </div>
          ${questionsHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-300 dark:border-amber-700/40">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Download PDF Study Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export questions with choices, correct answers & explanations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Questions Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScope("all")}
                disabled={isGenerating}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  scope === "all"
                    ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    All Questions
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    588 Qs
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full AWS re/Start question bank across all 96 topics
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope("filtered")}
                disabled={isGenerating}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  scope === "filtered"
                    ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Current Filter
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {currentFilteredQuestions.length} Qs
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={`${selectedModuleName} • ${selectedTopicName}`}>
                  {selectedTopicName !== "All Topics" ? selectedTopicName : selectedModuleName}
                </p>
              </button>
            </div>
          </div>

          {/* Options: Include Explanations */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Include Answer Explanations
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Detailed rationale & official AWS curriculum notes
              </span>
            </div>
            <input
              type="checkbox"
              id="includeExp"
              checked={includeExplanations}
              onChange={(e) => setIncludeExplanations(e.target.checked)}
              disabled={isGenerating}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {/* Progress Bar (Visible during generation) */}
          {isGenerating && progress && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  Generating PDF pages...
                </span>
                <span>
                  {progress.current} / {progress.total} questions ({progress.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrintView}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting ({progress?.percent || 0}%)...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download PDF ({targetQuestions.length} Qs)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
