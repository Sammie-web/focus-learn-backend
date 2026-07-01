import app from './src/app.js';
import env from './src/config/env.js';
import { connectDatabase } from './src/config/db.js';

let isConnected = false;

const ensureDatabaseConnection = async () => {
  if (isConnected) return;

  await connectDatabase();
  isConnected = true;
};

const startServer = async () => {
  await ensureDatabaseConnection();
  app.listen(env.port, () => {
    console.log(`FocusLearn API listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
