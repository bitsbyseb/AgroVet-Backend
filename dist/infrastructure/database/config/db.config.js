import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
const { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_HOST, DATABASE_PORT } = process.env;
const dbPort = parseInt(DATABASE_PORT);
export const sequelize = new Sequelize({
    dialect: MySqlDialect,
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: dbPort
});
