import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

let io: Server;

export const initializeWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Event emitters
export const emitResourceUpdate = (resourceType: string, data: ResourceUpdateEvent) => {
  getIO().emit('resource:update', { type: resourceType, data });
};

export const emitAllocationUpdate = (data: AllocationUpdateEvent) => {
  getIO().emit('allocation:update', data);
};

export const emitWorkOrderUpdate = (data: WorkOrderUpdateEvent) => {
  getIO().emit('workorder:update', data);
};

export const emitStatusChange = (resourceType: string, resourceId: number, status: string) => {
  getIO().emit('status:change', { type: resourceType, id: resourceId, status });
};
