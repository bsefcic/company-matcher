import { AppDataSource } from '../data-source';
import { Company } from '../company/company.entity';
import { esClient, ensureIndex } from '../es/es.service';

(async () => {
  await ensureIndex();
  await AppDataSource.initialize();
  const companies = await AppDataSource.getRepository(Company).find({ relations: ['phones', 'socials'] });
  const body = companies.flatMap(c => [{ index: { _index: 'companies_v1', _id: c.id } }, {
    name: c.name,
    website: c.website,
    phones: c.phones.map(p => p.e164),
    socials: c.socials.map(s => s.url),
  }]);
  await esClient.bulk({ refresh: true, body });
  console.log(`✅ synced ${companies.length} companies to ES`);
  process.exit(0);
})();
