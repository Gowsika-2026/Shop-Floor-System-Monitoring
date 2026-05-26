import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkOrder {
  id: number;
  description: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  estimatedDuration: number;
  startTime: string | null;
  endTime: string | null;
  requiredOperators: number;
  requiredMachines: string[];
  requiredMaterials: Array<{ materialId: number; quantity: number }>;
}

interface WorkOrderState {
  workOrders: WorkOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkOrderState = {
  workOrders: [],
  loading: false,
  error: null,
};

const workOrderSlice = createSlice({
  name: 'workOrders',
  initialState,
  reducers: {
    setWorkOrders(state, action: PayloadAction<WorkOrder[]>) {
      state.workOrders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addWorkOrder(state, action: PayloadAction<WorkOrder>) {
      state.workOrders.push(action.payload);
    },
    updateWorkOrder(state, action: PayloadAction<WorkOrder>) {
      const index = state.workOrders.findIndex((wo) => wo.id === action.payload.id);
      if (index !== -1) {
        state.workOrders[index] = action.payload;
      }
    },
    removeWorkOrder(state, action: PayloadAction<number>) {
      state.workOrders = state.workOrders.filter((wo) => wo.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setWorkOrders,
  addWorkOrder,
  updateWorkOrder,
  removeWorkOrder,
  setLoading,
  setError,
} = workOrderSlice.actions;
export default workOrderSlice.reducer;
