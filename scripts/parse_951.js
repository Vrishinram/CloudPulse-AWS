const fs = require('fs');
const { updateKcQuestions } = require('./update_kc_multi.js');

const raw = fs.readFileSync('C:/Users/vrish/.gemini/antigravity-ide/brain/b22e6806-47aa-46e7-93be-648460446740/.system_generated/steps/951/output.txt', 'utf8');

const marker = '### Ran Playwright code';
const jsonPart = raw.substring(0, raw.indexOf(marker)).replace(/^### Result\s*/, '').trim();

const data = JSON.parse(jsonPart);
console.log('Extracted questions count:', data.parsedQuestions.length);
let multiCount = data.parsedQuestions.filter(q => q.isMultipleAnswer).length;
console.log('Multi-answer count:', multiCount);

updateKcQuestions(645109, data.parsedQuestions);
