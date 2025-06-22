import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({ node: 'http://localhost:9200' });

export async function ensureIndex() {
  const exists = await esClient.indices.exists({ index: 'companies_v1' });
  if (!exists) {
    await esClient.indices.create({
      index: 'companies_v1',
      mappings: {
        properties: {
          name:   { type: 'text', analyzer: 'standard' },
          website:{ type: 'keyword' },
          phones: { type: 'keyword' },
          socials:{ type: 'keyword' },
        },
      },
    });
  }
}
