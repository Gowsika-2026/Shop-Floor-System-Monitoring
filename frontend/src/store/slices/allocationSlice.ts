import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Allocation {
  id: number;
  workOrderId: number;
  resourceType: 'operator' | 'machine' | 'material';
  resourceId: number;
  allocatedAt: string;
  allocatedBy: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface AllocationState {
  allocations: Allocation[];
  loading: boolean;
  error: string | null;
}

const initialState: AllocationState = {
  allocations: [],
  loading: false,
  error: null,
};

const allocationSlice = createSlice({
  name: 'allocations',
  initialState,
  reducers: {
    setAllocations(state, action: PayloadAction<Allocation[]>) {
      state.allocations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAllocation(state, action: PayloadAction<Allocation>) {
      state.allocations.push(action.payload);
    },
    updateAllocation(state, action: PayloadAction<Allocation>) {
      const index = state.allocations.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.allocations[index] = action.payload;
      }
    },
    removeAllocation(state, action: PayloadAction<number>) {
      state.allocations = state.allocations.filter((a) => a.id !== action.payload);
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
  setAllocations,
  addAllocation,
  updateAllocation,
  removeAllocation,
  setLoading,
  setError,
} = allocationSlice.actions;
export default allocationSlice.reducer;
