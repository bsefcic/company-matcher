import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfigAsync } from './config/typeorm.config';   // ← this line
import { validationSchema } from './config/joi.validation';
import { CompanyModule } from './company/company.module';
import { ScraperModule } from './scraper/scraper.module';

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
  ],
})
export class AppModule {}
