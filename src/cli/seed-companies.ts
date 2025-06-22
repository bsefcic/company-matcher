import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import { AppDataSource } from '../data-source';
import { Company } from '../company/company.entity';
import { Phone } from '../company/phone.entity';
import { Social } from '../company/social.entity';
import { WebsiteQueue } from '../company/website-queue.entity';

/**
 * CSV columns present in sample‑websites-company-names.csv
 *   - domain                       → example.com
 *   - company_commercial_name      → "Acme Corp"
 *   - company_legal_name           → "ACME Incorporated"
 *   - company_all_available_names  → "Acme Corp; ACME Inc; Acme"
 *
 * Import strategy
 *   1. Prefer commercial name, fall back to legal name, then first alias.
 *   2. Prepend https:// to domain if no scheme is present.
 *   3. De‑duplicate on website (unique index in DB).
 *   4. If we already scraped the same domain (row in website_queue with status DONE)
 *      ‑ copy its phones & socials into the phone/social tables so they are ready for ES sync.
 *   5. Await every save before closing the pool so row counts are correct.
 */

(async () => {
  const [, , csvPath = 'data/sample-websites-company-names.csv'] = process.argv;

  await AppDataSource.initialize();
  const companyRepo = AppDataSource.getRepository(Company);
  const phoneRepo   = AppDataSource.getRepository(Phone);
  const socialRepo  = AppDataSource.getRepository(Social);
  const queueRepo   = AppDataSource.getRepository(WebsiteQueue);

  const pending: Promise<unknown>[] = [];
  let total = 0;

  fs.createReadStream(path.resolve(csvPath))
    .pipe(parse({ columns: true, skip_empty_lines: true }))
    .on('data', row => {
      total += 1;

      const domain = (row.domain ?? '').trim().toLowerCase();
      const rawName =
        row.company_commercial_name?.trim() ||
        row.company_legal_name?.trim()      ||
        row.company_all_available_names?.split(';')[0].trim();

      if (!domain || !rawName) return;          // incomplete row → skip

      const website = domain.startsWith('http') ? domain : `https://${domain}`;

      pending.push(
        (async () => {
          const company = await companyRepo
            .save({ name: rawName, website })
            .catch(() => null);                // duplicate website → skip save

          // even if duplicate, fetch the existing entity so we can link phones
          const saved = company ?? await companyRepo.findOneBy({ website });
          if (!saved) return;

          // pull scraped phones/socials from crawler payload (if any)
          const qRow = await queueRepo.findOneBy({ url: domain, status: 'DONE' });
          if (!qRow || !qRow.payload) return;

          const { phones = [], socials = [] } = qRow.payload as any;

          for (const n of phones) {
            await phoneRepo.save({ e164: n, raw: n, company: saved }).catch(() => {});
          }
          for (const u of socials) {
            await socialRepo.save({ url: u, company: saved }).catch(() => {});
          }
        })()
      );
    })
    .on('end', async () => {
      await Promise.allSettled(pending);
      console.log(`✅ processed ${total} CSV rows -> companies table now holds ${await companyRepo.count()} records`);
      await AppDataSource.destroy();
    });
})();