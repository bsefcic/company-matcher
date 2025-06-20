import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'website_queue' })
export class WebsiteQueue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  url!: string;

  @Column({ default: 'PENDING' })
  status!: 'PENDING' | 'DONE' | 'FAILED';

  @Column({ type: 'jsonb', nullable: true })
  payload?: unknown; // store ScraperResult after crawl
}
