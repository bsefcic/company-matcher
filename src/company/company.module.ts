import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './company.entity';
import { Phone } from './phone.entity';
import { Social } from './social.entity';
import { Address } from './address.entity';
import { WebsiteQueue } from './website-queue.entity';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Phone, Social, Address, WebsiteQueue])],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
