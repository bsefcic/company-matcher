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
      playwright: require('playwright').chromium,
      playwrightOptions: {
        headless: true,
        args: [
          '--ignore-certificate-errors',
          '--disable-features=BlockInsecurePrivateNetworkRequests',
          '--allow-running-insecure-content',
        ],
      } as any,
    });
  }

  async scrape(rawUrl: string): Promise<ScraperResult> {
    if (!this.cluster) await this.init();

    const withScheme = (url: string) =>
      /^https?:\/\//i.test(url) ? url : `https://${url}`;

    const url = withScheme(rawUrl);

    return this.cluster!.execute(url, async ({ page }) => {
      let html = '';
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 });
        html = await page.content();
      } catch (firstErr) {
        // if the navigation keeps redirecting, grab whatever we have
        try {
          html = await page.content();
        } catch {
          // last-ditch: one more goto with no waitUntil
          await page.goto(url, { waitUntil: 'load', timeout: 15_000 }).catch(() => {});
          html = await page.content().catch(() => '');
        }
        if (!html) throw firstErr; // still nothing → mark FAILED
      }

      return {
        url: rawUrl,
        phones: extractPhones(html),
        socials: extractSocialLinks(html),
        fetchedAt: new Date(),
      };
    });
  }

  async shutdown() {
    await this.cluster?.idle();
    await this.cluster?.close();
  }
}
