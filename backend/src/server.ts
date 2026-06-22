import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

async function start() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Dyarna API running on http://localhost:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
