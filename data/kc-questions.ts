// AWS re/Start Knowledge Check (KC) Question Database
// Dynamic Data Layer importing from Canvas LMS export (data/kc-questions.json)

import rawQuestionsData from "./kc-questions.json";

export interface Question {
  id: string;
  module: string;
  topic: string; // Exact KC assignment title
  question: string;
  options: string[]; // Choices (typically 4)
  correctAnswer: number; // Index 0-based
  explanation: string;
}

// Ensure clean typing and fallbacks
export const QUESTIONS: Question[] = (rawQuestionsData as Question[]).map((q, idx) => ({
  id: q.id || `kc-q-${idx + 1}`,
  module: q.module || "Cloud Foundations",
  topic: q.topic || "Knowledge Check",
  question: q.question,
  options: Array.isArray(q.options) ? q.options : [],
  correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
  explanation: q.explanation || "No explanation provided.",
}));

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
