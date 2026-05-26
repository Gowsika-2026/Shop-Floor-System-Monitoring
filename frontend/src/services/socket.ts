import { io, Socket } from 'socket.io-client';
import { store } from '@store/index';
import { updateOperator } from '@store/slices/operatorSlice';
import { updateMachine } from '@store/slices/machineSlice';
import { updateMaterial } from '@store/slices/materialSlice';
import { updateWorkOrder } from '@store/slices/workOrderSlice';
import { updateAllocation } from '@store/slices/allocationSlice';
import { toast } from 'react-toastify';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  const token = localStorage.getItem('token');
  socket = io(WS_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('resource:update', (data: ResourceUpdateEvent) => {
    if (data.type === 'operator') {
      store.dispatch(updateOperator(data.data));
    } else if (data.type === 'machine') {
      store.dispatch(updateMachine(data.data));
    } else if (data.type === 'material') {
      store.dispatch(updateMaterial(data.data));
    }
    toast.info(`${data.type} updated`);
  });

  socket.on('allocation:update', (data: AllocationUpdateEvent) => {
    store.dispatch(updateAllocation(data));
    toast.info('Resource allocation updated');
  });

  socket.on('workorder:update', (data: WorkOrderUpdateEvent) => {
    store.dispatch(updateWorkOrder(data));
    toast.info('Work order updated');
  });

  socket.on('status:change', (data: { type: string; id: number; status: string }) => {
    toast.info(`${data.type} ${data.id} status changed to ${data.status}`);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
