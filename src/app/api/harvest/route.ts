import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const METADATA_PATH = path.join(process.cwd(), "kcs_metadata.json");
const HARVESTED_PATH = path.join(process.cwd(), "data", "harvested_kcs.json");
const DATA_KC_QUESTIONS_PATH = path.join(process.cwd(), "data", "kc-questions.json");
const SRC_KC_QUESTIONS_PATH = path.join(process.cwd(), "src", "data", "kc-questions.json");

function ensureDirs() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadHarvested(): Record<string, any> {
  ensureDirs();
  if (fs.existsSync(HARVESTED_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(HARVESTED_PATH, "utf8"));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveAll(harvested: Record<string, any>) {
  ensureDirs();
  fs.writeFileSync(HARVESTED_PATH, JSON.stringify(harvested, null, 2), "utf8");

  // Flatten all questions
  const allQuestions: any[] = [];
  let questionCounter = 1;

  Object.values(harvested).forEach((item: any) => {
    if (Array.isArray(item.questions)) {
      item.questions.forEach((q: any) => {
        allQuestions.push({
          id: q.id || `kc-q-${questionCounter++}`,
          module: item.module || "Cloud Foundations",
          topic: item.topic || item.name || "Knowledge Check",
          question: q.question,
          options: q.options || [],
          correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : (q.correctAnswers?.[0] ?? 0),
          correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : [typeof q.correctAnswer === "number" ? q.correctAnswer : 0],
          isMultipleAnswer: Boolean(q.isMultipleAnswer || (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 1)),
          expectedCount: typeof q.expectedCount === "number" ? q.expectedCount : (Array.isArray(q.correctAnswers) ? q.correctAnswers.length : 1),
          explanation: q.explanation || `Correct answer: "${q.options?.[q.correctAnswer] || ""}". Verified from AWS re/Start curriculum.`,
        });
      });
    }
  });

  const jsonStr = JSON.stringify(allQuestions, null, 2);
  fs.writeFileSync(DATA_KC_QUESTIONS_PATH, jsonStr, "utf8");
  fs.writeFileSync(SRC_KC_QUESTIONS_PATH, jsonStr, "utf8");
}

export async function GET(req: Request) {
  ensureDirs();
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");

  let metadata: any[] = [];
  if (fs.existsSync(METADATA_PATH)) {
    metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));
  }

  const harvested = loadHarvested();

  if (mode === "multi") {
    const multiPending: any[] = [];
    metadata.forEach((m) => {
      const h = harvested[m.id];
      if (!h || !Array.isArray(h.questions)) {
        multiPending.push({ id: m.id, name: m.name, module: m.module });
      } else {
        const needsUpdate = h.questions.some(
          (q: any) =>
            (q.question?.includes("Select TWO") || q.question?.includes("Select THREE") || q.type === "multipleresponse") &&
            (!Array.isArray(q.correctAnswers) || q.correctAnswers.length <= 1)
        );
        if (needsUpdate) {
          multiPending.push({ id: m.id, name: m.name, module: m.module });
        }
      }
    });

    return NextResponse.json({
      total: metadata.length,
      multiPendingCount: multiPending.length,
      pending: multiPending,
    });
  }

  const harvestedIds = new Set(Object.keys(harvested).map(Number));
  const pending = metadata.filter((m) => !harvestedIds.has(m.id));

  return NextResponse.json({
    total: metadata.length,
    harvestedCount: Object.keys(harvested).length,
    pendingCount: pending.length,
    pending: pending.map((p) => ({ id: p.id, name: p.name, module: p.module })),
    harvestedIds: Array.from(harvestedIds),
  });
}

export async function POST(req: Request) {
  try {
    ensureDirs();
    const body = await req.json();
    const { kcId, module, topic, questions } = body;

    if (!kcId || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const harvested = loadHarvested();
    harvested[kcId] = {
      kcId,
      module,
      topic,
      harvestedAt: new Date().toISOString(),
      questionCount: questions.length,
      questions,
    };

    saveAll(harvested);

    const totalQuestions = Object.values(harvested).reduce(
      (acc: number, item: any) => acc + (item.questions?.length || 0),
      0
    );

    return NextResponse.json({
      success: true,
      kcId,
      savedQuestionsCount: questions.length,
      totalHarvestedKcs: Object.keys(harvested).length,
      totalHarvestedQuestions: totalQuestions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
