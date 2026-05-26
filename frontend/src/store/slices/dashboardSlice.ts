import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  operators: {
    total: number;
    available: number;
    assigned: number;
    onBreak: number;
  };
  machines: {
    total: number;
    idle: number;
    busy: number;
    maintenance: number;
  };
  materials: {
    total: number;
    lowStock: number;
  };
  workOrders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats(state, action: PayloadAction<DashboardStats>) {
      state.stats = action.payload;
      state.loading = false;
      state.error = null;
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

export const { setStats, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
