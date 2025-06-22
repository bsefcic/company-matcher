import { Module, Global } from '@nestjs/common';

import { esClient, ensureIndex } from './es.service';

@Global()
@Module({
  providers: [
    {
      provide: 'ELASTIC_CLIENT',
      useValue: esClient,
    },
    {
      provide: 'ENSURE_ES_INDEX',
      useFactory: () => ensureIndex,
    },
  ],
  exports: ['ELASTIC_CLIENT', 'ENSURE_ES_INDEX'],
})
export class EsModule {}
