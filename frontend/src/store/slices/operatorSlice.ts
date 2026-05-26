import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Operator {
  id: number;
  name: string;
  skills: string[];
  certifications: string[];
  status: 'available' | 'assigned' | 'on-break' | 'absent';
  currentAssignment: number | null;
}

interface OperatorState {
  operators: Operator[];
  loading: boolean;
  error: string | null;
}

const initialState: OperatorState = {
  operators: [],
  loading: false,
  error: null,
};

const operatorSlice = createSlice({
  name: 'operators',
  initialState,
  reducers: {
    setOperators(state, action: PayloadAction<Operator[]>) {
      state.operators = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOperator(state, action: PayloadAction<Operator>) {
      state.operators.push(action.payload);
    },
    updateOperator(state, action: PayloadAction<Operator>) {
      const index = state.operators.findIndex((op) => op.id === action.payload.id);
      if (index !== -1) {
        state.operators[index] = action.payload;
      }
    },
    removeOperator(state, action: PayloadAction<number>) {
      state.operators = state.operators.filter((op) => op.id !== action.payload);
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

export const { setOperators, addOperator, updateOperator, removeOperator, setLoading, setError } =
  operatorSlice.actions;
export default operatorSlice.reducer;
