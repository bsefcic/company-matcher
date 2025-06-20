import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Company } from './company.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 512, nullable: true })
  street?: string;

  @Column({ length: 128, nullable: true })
  city?: string;

  @Column({ length: 128, nullable: true })
  state?: string;

  @Column({ length: 64, nullable: true })
  postalCode?: string;

  @Column({ length: 128, nullable: true })
  country?: string;

  @ManyToOne(() => Company, company => company.addresses, { onDelete: 'CASCADE' })
  company!: Company;
}
