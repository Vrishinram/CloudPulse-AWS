/**
 * ⚡ CANVAS IN-BROWSER KNOWLEDGE CHECK EXPORTER ⚡
 *
 * HOW TO USE:
 * 1. Open your browser and navigate to:
 *    https://awsrestart.instructure.com/courses/4448/grades
 * 2. Press F12 (or right-click -> Inspect) and switch to the "Console" tab.
 * 3. Copy this entire script, paste it into the Console, and press Enter.
 * 4. The script will harvest all Knowledge Checks using your active session
 *    and automatically download 'kc-questions.json'.
 * 5. Move the downloaded 'kc-questions.json' into your project's `data/` folder!
 */

(async function harvestCanvasKC() {
  const COURSE_ID = '4448';
  const DELAY_MS = 250;

  console.log('%c🚀 Starting AWS re/Start Knowledge Check Harvester...', 'color: #ff9900; font-weight: bold; font-size: 14px;');

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function cleanHtml(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || '').trim().replace(/\s+/g, ' ');
  }

  function inferModuleFromTitle(title) {
    const t = title.toLowerCase();
    if (t.includes('linux') || t.includes('bash') || t.includes('file system') || t.includes('process') || t.includes('permissions')) return 'Linux';
    if (t.includes('network') || t.includes('protocol') || t.includes('subnet') || t.includes('ip') || t.includes('vpc')) return 'Networking';
    if (t.includes('python') || t.includes('programming') || t.includes('devops')) return 'Python Programming';
    if (t.includes('database') || t.includes('table') || t.includes('rds') || t.includes('dynamodb') || t.includes('sql')) return 'Databases';
    if (t.includes('architecture')) return 'AWS Architecture';
    if (t.includes('system operations') || t.includes('tooling') || t.includes('automation')) return 'Systems Operations & Tooling';
    if (t.includes('server') || t.includes('scaling') || t.includes('container') || t.includes('serverless')) return 'Servers & Scaling';
    if (t.includes('core services') || t.includes('resource consumption') || t.includes('monitoring') || t.includes('storage')) return 'AWS Core Services';
    if (t.includes('exam') || t.includes('scenario') || t.includes('certification') || t.includes('assessment')) return 'Exam Prep';
    return 'Cloud Foundations';
  }

  async function fetchAllPages(initialUrl) {
    let results = [];
    let nextUrl = initialUrl;
    while (nextUrl) {
      const res = await fetch(nextUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${nextUrl}`);
      const data = await res.json();
      results = results.concat(data);

      const link = res.headers.get('link');
      nextUrl = null;
      if (link) {
        const match = link.match(/<([^>]+)>;\s*rel="next"/);
        if (match) {
          nextUrl = match[1];
          await sleep(DELAY_MS);
        }
      }
    }
    return results;
  }

  try {
    // 1. Map Modules
    console.log('📦 Mapping course modules...');
    let quizToModuleMap = {};
    try {
      const modules = await fetchAllPages(`/api/v1/courses/${COURSE_ID}/modules?include[]=items&per_page=50`);
      modules.forEach((mod) => {
        if (mod.items) {
          mod.items.forEach((item) => {
            quizToModuleMap[item.content_id] = mod.name;
            quizToModuleMap[item.title] = mod.name;
          });
        }
      });
    } catch (e) {
      console.warn('Could not fetch modules list, using title heuristics.', e);
    }

    // 2. Fetch Quizzes
    console.log('📋 Fetching quizzes list...');
    const allQuizzes = await fetchAllPages(`/api/v1/courses/${COURSE_ID}/quizzes?per_page=100`);
    const kcQuizzes = allQuizzes.filter((q) => {
      const title = q.title || '';
      return title.startsWith('KC - ') || title.startsWith('KC – ') || title.toLowerCase().includes('knowledge check');
    });

    console.log(`Found ${kcQuizzes.length} Knowledge Check quizzes to extract.`);

    const questions = [];

    // 3. Process each quiz
    for (let i = 0; i < kcQuizzes.length; i++) {
      const quiz = kcQuizzes[i];
      const title = quiz.title.trim();
      const moduleName = quizToModuleMap[quiz.id] || quizToModuleMap[title] || inferModuleFromTitle(title);

      console.log(`[${i + 1}/${kcQuizzes.length}] Extracting: "${title}" (${moduleName})...`);

      try {
        await sleep(DELAY_MS);
        const subRes = await fetch(`/api/v1/courses/${COURSE_ID}/quizzes/${quiz.id}/submissions`);
        const subData = await subRes.json();
        const submissions = subData.quiz_submissions || (Array.isArray(subData) ? subData : []);

        if (!submissions.length) continue;

        const submission = submissions.find((s) => s.workflow_state === 'complete') || submissions[0];
        if (!submission || !submission.id) continue;

        await sleep(DELAY_MS);
        const qRes = await fetch(`/api/v1/quiz_submissions/${submission.id}/questions`);
        const qData = await qRes.json();
        const rawQuestions = qData.quiz_submission_questions || (Array.isArray(qData) ? qData : []);

        for (const rawQ of rawQuestions) {
          const qText = cleanHtml(rawQ.question_text || rawQ.text);
          if (!qText) continue;

          const rawAnswers = rawQ.answers || [];
          if (rawAnswers.length < 2) continue;

          const options = [];
          let correctAnswer = 0;

          rawAnswers.forEach((ans, idx) => {
            options.push(cleanHtml(ans.text || ans.html || ''));
            if (ans.weight === 100 || ans.weight === 1 || ans.correct === true) {
              correctAnswer = idx;
            }
          });

          const explanation =
            cleanHtml(rawQ.neutral_comments || rawQ.correct_comments || rawQ.comments) ||
            cleanHtml(rawAnswers[correctAnswer]?.comments) ||
            `Explanation for: ${qText.substring(0, 80)}...`;

          questions.push({
            id: `canvas-kc-${quiz.id}-${rawQ.id || questions.length + 1}`,
            module: moduleName,
            topic: title,
            question: qText,
            options,
            correctAnswer,
            explanation,
          });
        }
      } catch (err) {
        console.error(`Error on quiz ${quiz.id}:`, err);
      }
    }

    console.log(`%c🎉 Harvest complete! ${questions.length} total questions collected.`, 'color: #10b981; font-weight: bold; font-size: 14px;');

    // 4. Download file
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kc-questions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('%c📥 Downloaded kc-questions.json successfully! Place this file in your project data/ folder.', 'color: #0073bb; font-weight: bold;');
  } catch (err) {
    console.error('Fatal extraction error:', err);
  }
})();
