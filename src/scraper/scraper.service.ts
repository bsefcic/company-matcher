import { Injectable, Logger } from '@nestjs/common';
import { Cluster } from 'playwright-cluster';

import { extractPhones, extractSocialLinks } from './extract.utils';
import { ScraperResult } from './types';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private cluster: Cluster | null = null;

  async init() {
    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
      timeout: 30_000,
    });
  }

  async scrape(url: string): Promise<ScraperResult> {
    if (!this.cluster) await this.init();
    return this.cluster!.execute(url, async ({ page, data: targetUrl }) => {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 });
      const html = await page.content();
      return {
        url: targetUrl,
        phones: extractPhones(html),
        socials: extractSocialLinks(html),
        fetchedAt: new Date(),
      } as ScraperResult;
    });
  }

  async shutdown() {
    await this.cluster?.idle();
    await this.cluster?.close();
  }
}
