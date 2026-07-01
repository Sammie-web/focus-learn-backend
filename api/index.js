import app from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';

let isConnected = false;

const ensureDatabaseConnection = async () => {
  if (isConnected) return;

  await connectDatabase();
  isConnected = true;
};

export default async function handler(req, res) {
  await ensureDatabaseConnection();
  return app(req, res);
}
