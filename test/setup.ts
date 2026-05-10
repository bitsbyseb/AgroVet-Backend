import { afterAll, beforeAll } from 'vitest';
import { sequelize } from '../src/infrastructure/database/config/db.config.js';
import '../src/infrastructure/database/models/index.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
