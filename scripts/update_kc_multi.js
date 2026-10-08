const fs = require('fs');
const path = require('path');

const HARVESTED_PATH = path.join(__dirname, '..', 'data', 'harvested_kcs.json');
const DATA_KC_QUESTIONS_PATH = path.join(__dirname, '..', 'data', 'kc-questions.json');
const SRC_KC_QUESTIONS_PATH = path.join(__dirname, '..', 'src', 'data', 'kc-questions.json');

function updateKcQuestions(kcId, newQuestions) {
  const harvested = JSON.parse(fs.readFileSync(HARVESTED_PATH, 'utf8'));
  if (!harvested[kcId]) {
    console.error(`KC ${kcId} not found in harvested_kcs.json`);
    return;
  }

  // Merge questions
  const currentKc = harvested[kcId];
  currentKc.questions = newQuestions.map(nq => {
    const existing = (currentKc.questions || []).find(eq => eq.id === nq.id || eq.question === nq.question);
    return {
      id: nq.id || existing?.id,
      question: nq.question,
      options: nq.options,
      correctAnswer: nq.correctAnswer ?? nq.correctAnswers?.[0] ?? 0,
      correctAnswers: nq.correctAnswers || [nq.correctAnswer || 0],
      isMultipleAnswer: Boolean(nq.isMultipleAnswer || (nq.correctAnswers && nq.correctAnswers.length > 1)),
      expectedCount: nq.expectedCount || (nq.correctAnswers ? nq.correctAnswers.length : 1),
      explanation: nq.explanation || existing?.explanation || `Correct choices: ${(nq.correctAnswers || [0]).map(i => nq.options[i]).join('; ')}`,
      type: nq.type || existing?.type
    };
  });

  fs.writeFileSync(HARVESTED_PATH, JSON.stringify(harvested, null, 2), 'utf8');

  // Regenerate all flattened questions
  const allQuestions = [];
  let questionCounter = 1;

  Object.values(harvested).forEach((item) => {
    if (Array.isArray(item.questions)) {
      item.questions.forEach((q) => {
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
  console.log(`Updated KC ${kcId} (${currentKc.topic}): ${newQuestions.length} questions. Total flattened: ${allQuestions.length}`);
}

module.exports = { updateKcQuestions };
