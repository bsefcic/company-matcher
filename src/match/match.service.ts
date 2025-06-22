import { Injectable } from '@nestjs/common';

import { esClient } from '../es/es.service';

@Injectable()
export class MatchService {
  async findBest(dto: {
    name?: string;
    website?: string;
    phone?: string;
    facebook?: string;
  }) {
    const must: any[] = [];
    const should: any[] = [];

    if (dto.name)
      should.push({ match: { name: { query: dto.name, fuzziness: 'AUTO', boost: 3 } } });

    if (dto.website)
      must.push({ term: { website: dto.website.replace(/^https?:\/\//, '') } });

    if (dto.phone) must.push({ term: { phones: dto.phone } });

    if (dto.facebook) must.push({ term: { socials: dto.facebook } });

    const { hits } = await esClient.search({
      index: 'companies_v1',
      size: 1,
      query: { bool: { must, should } },
    });

    if (!hits.hits.length) return null;
    const hit = hits.hits[0];
    return { matchScore: hit._score, company: hit._source };
  }
}
