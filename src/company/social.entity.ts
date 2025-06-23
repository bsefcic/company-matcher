import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

import { Company } from './company.entity';

@Entity({ name: 'socials' })
export class Social {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 512 })
  @Index()
  url!: string;

  @ManyToOne(() => Company, company => company.socials, { onDelete: 'CASCADE' })
  company!: Company;
}
