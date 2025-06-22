import { Module } from '@nestjs/common';

import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { EsModule } from '../es/es.module';

@Module({
  imports: [EsModule],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
