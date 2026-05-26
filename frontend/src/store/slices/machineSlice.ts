import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Machine {
  id: number;
  name: string;
  type: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'maintenance' | 'breakdown';
  currentWorkOrder: number | null;
  lastMaintenanceDate: string;
}

interface MachineState {
  machines: Machine[];
  loading: boolean;
  error: string | null;
}

const initialState: MachineState = {
  machines: [],
  loading: false,
  error: null,
};

const machineSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    setMachines(state, action: PayloadAction<Machine[]>) {
      state.machines = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMachine(state, action: PayloadAction<Machine>) {
      state.machines.push(action.payload);
    },
    updateMachine(state, action: PayloadAction<Machine>) {
      const index = state.machines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
      }
    },
    removeMachine(state, action: PayloadAction<number>) {
      state.machines = state.machines.filter((m) => m.id !== action.payload);
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

export const { setMachines, addMachine, updateMachine, removeMachine, setLoading, setError } =
  machineSlice.actions;
export default machineSlice.reducer;
