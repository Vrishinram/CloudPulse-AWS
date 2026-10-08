const fs = require('fs');
const token = '16893~rHZB3MD4XLvRR2vH6e9DArEPDz6ECnTcJnHhF2tXua3MRuZFtJZPuGWLfwxT2rkG';

async function buildMetadata() {
  const kcsList = JSON.parse(fs.readFileSync('kcs_list.json', 'utf8'));

  let url = 'https://awsrestart.instructure.com/api/v1/courses/4448/modules?include[]=items&per_page=50';
  let modules = [];
  while (url) {
    const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
    const data = await res.json();
    modules = modules.concat(data);
    const link = res.headers.get('link');
    url = null;
    if (link) {
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      if (match) url = match[1];
    }
  }

  const assignmentToModule = new Map();
  modules.forEach(mod => {
    (mod.items || []).forEach(item => {
      if (item.content_id) {
        assignmentToModule.set(item.content_id, mod.name);
      }
    });
  });

  const enriched = kcsList.map((kc, idx) => {
    const mod = assignmentToModule.get(kc.id) || 'Cloud Foundations';
    return {
      index: idx,
      id: kc.id,
      name: kc.name.trim(),
      module: mod,
      tool_url: kc.tool_url
    };
  });

  fs.writeFileSync('kcs_metadata.json', JSON.stringify(enriched, null, 2));
  console.log(`Enriched ${enriched.length} KCs with official modules!`);
  
  const modCounts = {};
  enriched.forEach(k => {
    modCounts[k.module] = (modCounts[k.module] || 0) + 1;
  });
  console.log('Module counts:', JSON.stringify(modCounts, null, 2));
}

buildMetadata();
