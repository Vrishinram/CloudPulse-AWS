// AWS re/Start Knowledge Check (KC) Question Database
// Dynamic Data Layer importing from Canvas LMS export (data/kc-questions.json)

import rawQuestionsData from "./kc-questions.json";

export interface Question {
  id: string;
  module: string;
  topic: string; // Exact KC assignment title
  question: string;
  options: string[]; // Choices (typically 4-5)
  correctAnswer: number; // Index 0-based (primary)
  correctAnswers?: number[]; // All correct 0-based indices
  isMultipleAnswer?: boolean; // Whether multiple choices must be selected
  expectedCount?: number; // Expected number of choices to select (e.g. 2 for "Select TWO")
  explanation: string;
}

// Ensure clean typing and fallbacks
export const QUESTIONS: Question[] = (rawQuestionsData as any[]).map((q, idx) => {
  const correctAnswers: number[] = Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0
    ? q.correctAnswers
    : (typeof q.correctAnswer === "number" ? [q.correctAnswer] : [0]);

  const isMultiple = Boolean(
    q.isMultipleAnswer ||
    correctAnswers.length > 1 ||
    q.question?.toLowerCase().includes("select two") ||
    q.question?.toLowerCase().includes("select three")
  );

  const expectedCount = q.expectedCount || (
    q.question?.toLowerCase().includes("select three") ? 3 :
    q.question?.toLowerCase().includes("select two") ? 2 :
    correctAnswers.length
  );

  return {
    id: q.id || `kc-q-${idx + 1}`,
    module: q.module || "Cloud Foundations",
    topic: q.topic || "Knowledge Check",
    question: q.question,
    options: Array.isArray(q.options) ? q.options : [],
    correctAnswer: correctAnswers[0] ?? 0,
    correctAnswers,
    isMultipleAnswer: isMultiple,
    expectedCount,
    explanation: q.explanation || "No explanation provided.",
  };
});

// Standard AWS re/Start curriculum module ordering
const CURRICULUM_MODULE_ORDER = [
  "Cloud Foundations",
  "Linux",
  "Networking",
  "Python Programming",
  "Databases",
  "AWS Architecture",
  "Systems Operations & Tooling",
  "Servers & Scaling",
  "AWS Core Services",
  "Exam Prep",
];

// Dynamically derive modules list from questions, preserving curriculum order
export const MODULES: string[] = (() => {
  const discovered = new Set<string>();
  QUESTIONS.forEach((q) => {
    if (q.module) discovered.add(q.module);
  });

  // Sort according to standard order first, then append any additional modules
  const ordered: string[] = [];
  CURRICULUM_MODULE_ORDER.forEach((mod) => {
    if (discovered.has(mod)) {
      ordered.push(mod);
      discovered.delete(mod);
    }
  });

  discovered.forEach((mod) => ordered.push(mod));
  return ordered.length > 0 ? ordered : CURRICULUM_MODULE_ORDER;
})();

// Dynamically group topics under each module
export const TOPICS_BY_MODULE: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};

  MODULES.forEach((mod) => {
    map[mod] = [];
  });

  QUESTIONS.forEach((q) => {
    const mod = q.module || "Cloud Foundations";
    if (!map[mod]) map[mod] = [];
    if (!map[mod].includes(q.topic)) {
      map[mod].push(q.topic);
    }
  });

  return map;
})();

export function getAllTopics(): string[] {
  const topics = new Set<string>();
  QUESTIONS.forEach((q) => topics.add(q.topic));
  return Array.from(topics);
}

export function getQuestionsByModule(module: string): Question[] {
  if (!module || module === "All Modules") return QUESTIONS;
  return QUESTIONS.filter((q) => q.module === module);
}

export function getQuestionsByTopic(topic: string): Question[] {
  if (!topic || topic === "All Topics") return QUESTIONS;
  return QUESTIONS.filter((q) => q.topic === topic);
}

export function filterQuestions(module?: string, topic?: string): Question[] {
  let list = QUESTIONS;
  if (module && module !== "All Modules") {
    list = list.filter((q) => q.module === module);
  }
  if (topic && topic !== "All Topics") {
    list = list.filter((q) => q.topic === topic);
  }
  return list;
}

export function shuffleQuestions(questions: Question[]): Question[] {
  const array = [...questions];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
