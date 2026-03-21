import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

const {DATABASE_NAME,DATABASE_PASSWORD,DATABASE_USERNAME} = process.env;

export const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: DATABASE_NAME,
  user: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  port: 3306
});