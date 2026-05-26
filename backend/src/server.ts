import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { sequelize } from './config/database';
import { logger } from './utils/logger';
import { initializeWebSocket } from './socket';
import http from 'http';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync database (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synced');
    }

    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    sequelize.close();
    process.exit(0);
  });
});
