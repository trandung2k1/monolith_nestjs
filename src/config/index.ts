import sql from 'mssql';
import { DataSourceOptions } from 'typeorm';
export const sqlConfig: sql.config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_HOST,
  options: {
    trustServerCertificate: true,
  },
};

export const baseOptions: DataSourceOptions = {
  type: 'mssql',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  options: {
    trustServerCertificate: true,
  },
  extra: {
    trustServerCertificate: true,
  },
  requestTimeout: 30000,
};

export const optionsNotExits: DataSourceOptions = {
  ...baseOptions,
};
