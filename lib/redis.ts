// lib/redis.ts
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.log('Redis Client error', err));

(async () => {
  if (!client.isOpen) {
    await client.connect();
  }
})();

export default client;
