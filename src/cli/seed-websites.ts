import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import { AppDataSource } from '../data-source';
import { WebsiteQueue } from '../company/website-queue.entity';

(async () => {
  const [,, csvPath] = process.argv;
  if (!csvPath) throw new Error('Usage: npm run seed:websites <file.csv>');

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(WebsiteQueue);

  const pending: Promise<unknown>[] = [];

  fs.createReadStream(path.resolve(csvPath))
    .pipe(parse({ columns: true }))
    .on('data', (row) => {
      const url = (row.website ?? row.url ?? row.domain ?? row.Website)?.trim();
      if (url) pending.push(repo.save({ url }));
    })
    .on('end', async () => {
      await Promise.allSettled(pending)
      console.log('✅ CSV import done');
      await AppDataSource.destroy();
    });
})();
