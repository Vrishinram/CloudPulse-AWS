/**
 * Canvas LMS Knowledge Check (KC) Question Harvester
 * Course ID: 4448 (AWS re/Start)
 *
 * This script extracts all Knowledge Check quizzes, submissions, questions,
 * choices, correct answers, and explanations via the Canvas LMS REST API.
 *
 * Usage in Node.js:
 *   CANVAS_TOKEN="your_access_token" node scripts/export-canvas-kc.js
 * Or:
 *   node scripts/export-canvas-kc.js --token="your_access_token"
 * Or:
 *   CANVAS_COOKIE="_legacy_normandy_session=..." node scripts/export-canvas-kc.js
 */

const fs = require('fs');
const path = require('path');

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || 'https://awsrestart.instructure.com';
const COURSE_ID = process.env.COURSE_ID || '4448';

// Extract token from CLI flag --token=xxx or env
const tokenArg = process.argv.find((arg) => arg.startsWith('--token='));
const CANVAS_TOKEN = tokenArg ? tokenArg.split('=')[1] : process.env.CANVAS_TOKEN;
const CANVAS_COOKIE = process.env.CANVAS_COOKIE;

const DELAY_MS = 250; // Rate-limiting delay between requests

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Clean HTML entities and tags
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/\s+/g, ' ')
    .trim();
}

// Map KC title to AWS re/Start module fallback
function inferModuleFromTitle(title) {
  const t = title.toLowerCase();
  if (t.includes('linux') || t.includes('bash') || t.includes('file system') || t.includes('process') || t.includes('permissions')) {
    return 'Linux';
  }
  if (t.includes('network') || t.includes('protocol') || t.includes('subnet') || t.includes('ip') || t.includes('vpc')) {
    return 'Networking';
  }
  if (t.includes('python') || t.includes('programming') || t.includes('devops') || t.includes('continuous integration')) {
    return 'Python Programming';
  }
  if (t.includes('database') || t.includes('table') || t.includes('rds') || t.includes('dynamodb') || t.includes('sql') || t.includes('transaction')) {
    return 'Databases';
  }
  if (t.includes('architecture') || t.includes('well-architected')) {
    return 'AWS Architecture';
  }
  if (t.includes('system operations') || t.includes('tooling') || t.includes('automation')) {
    return 'Systems Operations & Tooling';
  }
  if (t.includes('server') || t.includes('scaling') || t.includes('container') || t.includes('serverless')) {
    return 'Servers & Scaling';
  }
  if (t.includes('core services') || t.includes('resource consumption') || t.includes('monitoring') || t.includes('storage and archiving')) {
    return 'AWS Core Services';
  }
  if (t.includes('exam') || t.includes('scenario') || t.includes('certification') || t.includes('assessment')) {
    return 'Exam Prep';
  }
  return 'Cloud Foundations';
}

async function canvasFetch(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `${CANVAS_BASE_URL}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'AWS-reStart-KC-Harvester/1.0',
  };

  if (CANVAS_TOKEN) {
    headers['Authorization'] = `Bearer ${CANVAS_TOKEN}`;
  }
  if (CANVAS_COOKIE) {
    headers['Cookie'] = CANVAS_COOKIE;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} requesting ${url}`);
  }

  // Parse pagination link header if present
  const linkHeader = res.headers.get('link');
  const data = await res.json();
  return { data, linkHeader };
}

// Fetch all paginated items
async function fetchAllPages(initialEndpoint) {
  let results = [];
  let nextUrl = initialEndpoint;

  while (nextUrl) {
    console.log(`  -> Fetching: ${nextUrl}`);
    const { data, linkHeader } = await canvasFetch(nextUrl);
    if (Array.isArray(data)) {
      results = results.concat(data);
    } else {
      results.push(data);
      break;
    }

    nextUrl = null;
    if (linkHeader) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (match) {
        nextUrl = match[1];
        await sleep(DELAY_MS);
      }
    }
  }

  return results;
}

async function main() {
  console.log('====================================================');
  console.log('🚀 AWS re/Start Canvas KC Question Harvester');
  console.log(`   Base URL:  ${CANVAS_BASE_URL}`);
  console.log(`   Course ID: ${COURSE_ID}`);
  console.log('====================================================\n');

  if (!CANVAS_TOKEN && !CANVAS_COOKIE) {
    console.error('❌ Error: No authentication provided.');
    console.log('\nPlease provide authentication via one of:');
    console.log('  1. Environment variable: CANVAS_TOKEN="your_token" node scripts/export-canvas-kc.js');
    console.log('  2. CLI argument: node scripts/export-canvas-kc.js --token="your_token"');
    console.log('  3. In Chrome: Run scripts/canvas-browser-console-snippet.js in DevTools on Canvas.');
    console.log('\nTo generate a Canvas access token:');
    console.log('  Go to Canvas -> Account -> Settings -> Approved Integrations -> + New Access Token\n');
    process.exit(1);
  }

  try {
    // 1. Fetch Course Modules to map quizzes to exact modules
    console.log('📦 Step 1: Mapping Course Modules...');
    let quizToModuleMap = {};
    try {
      const modules = await fetchAllPages(`/api/v1/courses/${COURSE_ID}/modules?include[]=items&per_page=50`);
      console.log(`   Found ${modules.length} modules.`);
      for (const mod of modules) {
        if (mod.items && Array.isArray(mod.items)) {
          for (const item of mod.items) {
            if (item.type === 'Quiz' || item.type === 'Assignment') {
              quizToModuleMap[item.content_id] = mod.name;
              quizToModuleMap[item.title] = mod.name;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`   ⚠️ Warning fetching modules (${err.message}). Using title heuristics.`);
    }

    // 2. Fetch Quizzes for the course
    console.log('\n📋 Step 2: Fetching Course Quizzes...');
    const allQuizzes = await fetchAllPages(`/api/v1/courses/${COURSE_ID}/quizzes?per_page=100`);
    console.log(`   Retrieved ${allQuizzes.length} total quizzes in course.`);

    // Filter Knowledge Check quizzes
    const kcQuizzes = allQuizzes.filter((q) => {
      const title = q.title || '';
      return (
        title.startsWith('KC - ') ||
        title.startsWith('KC – ') ||
        title.toLowerCase().includes('knowledge check')
      );
    });

    console.log(`   🎯 Filtered ${kcQuizzes.length} Knowledge Check quizzes to process.\n`);

    const extractedQuestions = [];
    let successCount = 0;
    let skippedCount = 0;

    // 3. Process each quiz
    for (let i = 0; i < kcQuizzes.length; i++) {
      const quiz = kcQuizzes[i];
      const quizTitle = quiz.title.trim();
      const moduleName = quizToModuleMap[quiz.id] || quizToModuleMap[quizTitle] || inferModuleFromTitle(quizTitle);

      console.log(`[${i + 1}/${kcQuizzes.length}] Processing: "${quizTitle}" (${moduleName})`);

      try {
        await sleep(DELAY_MS);

        // Fetch submissions for this quiz
        const subRes = await canvasFetch(`/api/v1/courses/${COURSE_ID}/quizzes/${quiz.id}/submissions`);
        const submissions = subRes.data.quiz_submissions || (Array.isArray(subRes.data) ? subRes.data : []);

        if (!submissions || submissions.length === 0) {
          console.log(`    ⚠️ No submissions found for quiz ID ${quiz.id}. Skipping.`);
          skippedCount++;
          continue;
        }

        // Find the latest completed or graded submission
        const completedSubmission = submissions
          .filter((s) => s.workflow_state === 'complete' || s.workflow_state === 'pending_review')
          .sort((a, b) => (b.attempt || 0) - (a.attempt || 0))[0] || submissions[0];

        if (!completedSubmission || !completedSubmission.id) {
          console.log(`    ⚠️ No completed submission ID available. Skipping.`);
          skippedCount++;
          continue;
        }

        await sleep(DELAY_MS);

        // Fetch quiz questions for this submission
        const qRes = await canvasFetch(`/api/v1/quiz_submissions/${completedSubmission.id}/questions`);
        const rawQuestions = qRes.data.quiz_submission_questions || (Array.isArray(qRes.data) ? qRes.data : []);

        if (!rawQuestions || rawQuestions.length === 0) {
          console.log(`    ⚠️ No question data returned for submission ${completedSubmission.id}.`);
          skippedCount++;
          continue;
        }

        // Parse each question
        let quizExtracted = 0;
        for (const rawQ of rawQuestions) {
          const qText = cleanHtml(rawQ.question_text || rawQ.text);
          if (!qText) continue;

          const rawAnswers = rawQ.answers || [];
          if (rawAnswers.length < 2) continue;

          const options = [];
          let correctAnswer = 0;

          rawAnswers.forEach((ans, idx) => {
            const optText = cleanHtml(ans.text || ans.html || '');
            options.push(optText);

            // Identify correct answer
            if (ans.weight === 100 || ans.weight === 1 || ans.correct === true) {
              correctAnswer = idx;
            }
          });

          // Extract explanation from feedback comments
          const explanation =
            cleanHtml(rawQ.neutral_comments || rawQ.correct_comments || rawQ.comments) ||
            cleanHtml(rawAnswers[correctAnswer]?.comments) ||
            `Explanation for: ${qText.substring(0, 80)}...`;

          extractedQuestions.push({
            id: `canvas-kc-${quiz.id}-${rawQ.id || quizExtracted + 1}`,
            module: moduleName,
            topic: quizTitle,
            question: qText,
            options,
            correctAnswer,
            explanation,
          });

          quizExtracted++;
        }

        console.log(`    ✅ Successfully extracted ${quizExtracted} questions.`);
        successCount++;
      } catch (err) {
        console.error(`    ❌ Error processing quiz ${quiz.id}: ${err.message}`);
        skippedCount++;
      }
    }

    console.log('\n====================================================');
    console.log(`🎉 Extraction Finished!`);
    console.log(`   Total Questions Harvested: ${extractedQuestions.length}`);
    console.log(`   Quizzes Processed:        ${successCount}`);
    console.log(`   Quizzes Skipped:          ${skippedCount}`);
    console.log('====================================================\n');

    if (extractedQuestions.length > 0) {
      const outputJson = JSON.stringify(extractedQuestions, null, 2);

      // Write to data/kc-questions.json
      const rootDataDir = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(rootDataDir)) fs.mkdirSync(rootDataDir, { recursive: true });
      const rootFilePath = path.join(rootDataDir, 'kc-questions.json');
      fs.writeFileSync(rootFilePath, outputJson, 'utf-8');
      console.log(`💾 Saved to: ${rootFilePath}`);

      // Write to src/data/kc-questions.json
      const srcDataDir = path.join(__dirname, '..', 'src', 'data');
      if (!fs.existsSync(srcDataDir)) fs.mkdirSync(srcDataDir, { recursive: true });
      const srcFilePath = path.join(srcDataDir, 'kc-questions.json');
      fs.writeFileSync(srcFilePath, outputJson, 'utf-8');
      console.log(`💾 Saved to: ${srcFilePath}`);
    }
  } catch (error) {
    console.error('Fatal extraction error:', error);
    process.exit(1);
  }
}

main();
