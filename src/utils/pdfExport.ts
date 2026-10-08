import { jsPDF } from "jspdf";
import { Question } from "@/data/kc-questions";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export interface PdfExportOptions {
  title?: string;
  subtitle?: string;
  includeExplanations?: boolean;
  onProgress?: (percent: number, current: number, total: number) => void;
}

export async function exportQuestionsToPdf(
  questions: Question[],
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    title = "AWS re/Start Knowledge Check Question Bank",
    subtitle = "Complete Question Bank with Choices & Verified Answers",
    includeExplanations = true,
    onProgress,
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - 50;

  let y = margin;
  let pageNumber = 1;

  function renderPageHeader() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 155);
    doc.text("AWS re/Start • Knowledge Check Practice Hub", margin, 25);
    doc.text(
      new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
      pageWidth - margin,
      25,
      { align: "right" }
    );
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, 30, pageWidth - margin, 30);
  }

  function renderPageFooter() {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 155);
    doc.text("AWS re/Start Certification Preparation", margin, pageHeight - 18);
    doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 18, { align: "right" });
  }

  function checkPageBreak(requiredSpace: number) {
    if (y + requiredSpace > bottomThreshold) {
      renderPageFooter();
      doc.addPage();
      pageNumber++;
      renderPageHeader();
      y = 45;
    }
  }

  // Cover / Header Banner on First Page
  renderPageHeader();
  y = 55;

  // Title block banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 68, 6, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 153, 0); // AWS Orange
  doc.text(title, margin + 16, y + 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(226, 232, 240);
  doc.text(
    `${subtitle} • Total Questions: ${questions.length}`,
    margin + 16,
    y + 44
  );

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Includes single & multi-response questions with full explanations. Generated from AWS re/Start Curriculum.`,
    margin + 16,
    y + 57
  );

  y += 84;

  // Iterate over each question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (onProgress && i % 10 === 0) {
      onProgress(Math.round(((i + 1) / questions.length) * 100), i + 1, questions.length);
      // Give browser a microtick to update UI if running client-side
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const isMultiple = Boolean(q.isMultipleAnswer);
    const expectedAnswers =
      Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0
        ? q.correctAnswers
        : [q.correctAnswer ?? 0];

    // Estimate height needed for this question
    const qLines = doc.splitTextToSize(`Q${i + 1}. ${q.question}`, contentWidth - 10);
    const estimatedHeight = 35 + qLines.length * 13 + (q.options?.length || 4) * 16 + (includeExplanations ? 35 : 0);

    checkPageBreak(Math.min(estimatedHeight, 140));

    // Question Box Header / Meta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const metaText = `${q.module}  ›  ${q.topic}`;
    doc.text(metaText, margin, y);

    if (isMultiple) {
      const badgeText = `[Select ${q.expectedCount || expectedAnswers.length}]`;
      const metaWidth = doc.getTextWidth(metaText);
      doc.setTextColor(2, 132, 199); // Blue
      doc.text(badgeText, margin + metaWidth + 10, y);
    }
    y += 12;

    // Question Prompt
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // slate-900

    qLines.forEach((line: string) => {
      checkPageBreak(14);
      doc.text(line, margin, y);
      y += 13;
    });
    y += 4;

    // Choices
    const options = q.options || [];
    for (let optIdx = 0; optIdx < options.length; optIdx++) {
      const optText = options[optIdx];
      const isCorrect = expectedAnswers.includes(optIdx);
      const label = OPTION_LABELS[optIdx] || `${optIdx + 1}`;

      const choicePrefix = isCorrect ? `[✓]  ${label}. ` : `[  ]  ${label}. `;
      const fullChoice = choicePrefix + optText;
      const optLines = doc.splitTextToSize(fullChoice, contentWidth - 20);

      checkPageBreak(optLines.length * 12 + 4);

      if (isCorrect) {
        doc.setFillColor(236, 253, 245); // emerald-50
        doc.setDrawColor(16, 185, 129); // emerald-500
        doc.roundedRect(margin - 4, y - 9, contentWidth + 8, optLines.length * 12 + 4, 3, 3, "FD");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(6, 95, 70); // emerald-900
      } else {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85); // slate-700
      }

      doc.setFontSize(8.5);
      optLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 12;
      });
      y += 2;
    }

    // Explanation Box
    if (includeExplanations && q.explanation) {
      y += 3;
      const expPrefix = `Explanation: ${q.explanation}`;
      const expLines = doc.splitTextToSize(expPrefix, contentWidth - 16);

      checkPageBreak(expLines.length * 11 + 12);

      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(margin, y - 8, contentWidth, expLines.length * 11 + 8, 3, 3, "FD");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600

      expLines.forEach((line: string) => {
        doc.text(line, margin + 8, y);
        y += 11;
      });
      y += 4;
    }

    // Separator line between questions
    y += 8;
    checkPageBreak(15);
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  }

  // Footer for the final page
  renderPageFooter();

  if (onProgress) {
    onProgress(100, questions.length, questions.length);
  }

  // Sanitize filename
  const safeFilename = title.replace(/[^a-z0-9_-]/gi, "_") + ".pdf";
  doc.save(safeFilename);
}
