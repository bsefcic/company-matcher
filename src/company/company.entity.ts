import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Phone } from './phone.entity';
import { Social } from './social.entity';
import { Address } from './address.entity';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 512 })
  @Index({ unique: false })
  name!: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  @Index({ unique: false })
  website?: string | null;

  @OneToMany(() => Phone, phone => phone.company, { cascade: true })
  phones!: Phone[];

  @OneToMany(() => Social, social => social.company, { cascade: true })
  socials!: Social[];

  @OneToMany(() => Address, address => address.company, { cascade: true })
  addresses!: Address[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
