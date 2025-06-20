import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

import { Company } from './company.entity';

export type SocialType = 'facebook' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok';

@Entity({ name: 'socials' })
export class Social {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  @Index()
  type!: SocialType;

  @Column({ length: 512 })
  @Index()
  url!: string;

  // ── FK ───────────
  @ManyToOne(() => Company, company => company.socials, { onDelete: 'CASCADE' })
  company!: Company;
}
