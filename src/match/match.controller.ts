import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @HttpCode(200)
  async match(@Body() dto: any) {
    return this.matchService.findBest(dto);
  }
}
