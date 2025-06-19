import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Company } from './company.entity';

@Entity({ name: 'phones' })
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 32 })
  @Index()
  e164!: string; // normalised international format – e.g. "+14085551234"

  // original raw string (optional, for reference)
  @Column({ length: 64, nullable: true })
  raw?: string;

  // ── FK ───────────
  @ManyToOne(() => Company, company => company.phones, { onDelete: 'CASCADE' })
  company!: Company;
}
