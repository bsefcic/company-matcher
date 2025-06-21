import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WebsiteQueue } from '../company/website-queue.entity';
import { ScraperService } from '../scraper/scraper.service';

const BATCH_SIZE = 30;

@Injectable()
export class CrawlerRunner {
  private readonly logger = new Logger(CrawlerRunner.name);

  constructor(
    @InjectRepository(WebsiteQueue)
    private readonly repo: Repository<WebsiteQueue>,   // 👈 use Nest repo
    private readonly scraper: ScraperService,
  ) {}

  @Cron('*/20 * * * * *')
  async handleQueue() {
    const batch = await this.repo.find({
      where: { status: 'PENDING' },
      take: BATCH_SIZE,
    });

    if (!batch.length) return;

    this.logger.log(`🕷  crawling ${batch.length} websites…`);

    await Promise.all(
      batch.map(async row => {
        try {
          const result = await this.scraper.scrape(row.url);
          await this.repo.update(row.id, {
            status: 'DONE',
            payload: result,
          });
        } catch (err) {
          this.logger.warn(`❌  ${row.url} failed: ${err}`);
          await this.repo.update(row.id, { status: 'FAILED' });
        }
      }),
    );
  }
}
