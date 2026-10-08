// Batch Extractor for ContentController Storyline Knowledge Checks
// Uses the authenticated Playwright session to load and extract assignments

const fs = require('fs');
const path = require('path');

const kcsList = JSON.parse(fs.readFileSync('kcs_list.json', 'utf8'));
console.log(`Loaded ${kcsList.length} assignments from kcs_list.json`);

module.exports = { kcsList };
