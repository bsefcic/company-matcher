import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // pulls vars from .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  // logging: true
});
