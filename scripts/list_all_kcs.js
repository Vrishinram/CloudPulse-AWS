const token = '16893~rHZB3MD4XLvRR2vH6e9DArEPDz6ECnTcJnHhF2tXua3MRuZFtJZPuGWLfwxT2rkG';

async function listKCs() {
  let all = [];
  let url = 'https://awsrestart.instructure.com/api/v1/courses/4448/assignments?per_page=100';

  while (url) {
    const res = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    all = all.concat(data);

    const link = res.headers.get('link');
    url = null;
    if (link) {
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      if (match) url = match[1];
    }
  }

  console.log('Total assignments in course 4448:', all.length);
  const kcs = all.filter((a) => {
    const name = a.name || '';
    return name.startsWith('KC - ') || name.startsWith('KC – ') || name.toLowerCase().includes('knowledge check');
  });

  console.log('Total KC Assignments found:', kcs.length);
  const summary = kcs.map((a) => ({
    id: a.id,
    name: a.name,
    tool_url: a.external_tool_tag_attributes?.url
  }));

  console.log(JSON.stringify(summary.slice(0, 10), null, 2));

  const fs = require('fs');
  fs.writeFileSync('kcs_list.json', JSON.stringify(summary, null, 2));
  console.log('Saved kcs_list.json');
}

listKCs();
