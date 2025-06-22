import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfigAsync } from './config/typeorm.config';   // ← this line
import { validationSchema } from './config/joi.validation';
import { CompanyModule } from './company/company.module';
import { ScraperModule } from './scraper/scraper.module';
import { CrawlerModule } from './crawler/crawler.module';
import { EsModule } from './es/es.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    CompanyModule,
    ScraperModule,
    CrawlerModule,
    EsModule,
    MatchModule
  ],
})
export class AppModule {}
