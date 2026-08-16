import 'dotenv/config';
import app from './src/app.js';
import { pool } from './src/config/database.js';

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Innovation Hub API listening on port ${port}`));

async function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);
  server.close(async () => { await pool.end(); process.exit(0); });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
