import app from './app';
import dotenv from 'dotenv';
import { initializeMainDatabase } from '@src/configs/mysqlConfig';
import { getRedisClient } from '@src/configs/redisConfig';
import 'reflect-metadata';

dotenv.config();

const startServer = async () => {
  try {
    console.log('Initializing main database...');
    await initializeMainDatabase();
    console.log('Main database initialized.');

    console.log('Initializing Redis...');
    const redisClient = getRedisClient();
    await redisClient.ping(); // Test Redis connection
    console.log('Connected to Redis.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Gracefully handle shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down gracefully...');
      console.log('Closing Redis connection...');
      redisClient.quit();
      console.log('Redis connection closed.');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
