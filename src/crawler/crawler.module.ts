import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebsiteQueue } from '../company/website-queue.entity';
import { ScraperModule } from '../scraper/scraper.module';
import { CrawlerRunner } from './crawler.runner';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ScraperModule,
    TypeOrmModule.forFeature([WebsiteQueue]),
  ],
  providers: [CrawlerRunner],
})
export class CrawlerModule {}
