import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sequelize } from './config/db.config.js';
import "./models";
await sequelize.authenticate();
await sequelize.sync();

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
