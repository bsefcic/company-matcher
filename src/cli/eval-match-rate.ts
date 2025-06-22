// src/cli/eval-match-rate.ts
import fs from 'fs';
import { parse } from 'csv-parse';

const ENDPOINT = 'http://localhost:3000/match';

let total = 0;
let hits  = 0;

const tasks: Promise<void>[] = [];

/** build a request body from one CSV row */
function buildBody(row: Record<string, string>) {
  const body: Record<string, string> = {};
  if (row.name)      body.name     = row.name.trim();
  if (row.website)   body.website  = row.website.trim().replace(/^https?:\/\//, '');
  if (row.phone)     body.phone    = row.phone.trim();
  if (row.facebook)  body.facebook = row.facebook.trim();
  return body;
}


fs.createReadStream('data/API-input-sample.csv')
  .pipe(parse({ columns: true, skip_empty_lines: true }))
  .on('data', (row: Record<string, string>) => {
    total += 1;
    const body = buildBody(row);

    tasks.push(
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(r => r.json())
        .then(j => { if (j && j.company) hits += 1; })
        .catch(() => { /* network/API error counts as miss */ })
    );
  })
  .on('end', async () => {
    await Promise.allSettled(tasks);
    const pct = ((hits / total) * 100).toFixed(1);
    console.log(`Match-rate: ${pct}%  (${hits}/${total})`);
  });
