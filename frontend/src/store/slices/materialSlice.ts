import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  allocatedQuantity: number;
  availableQuantity: number;
}

interface MaterialState {
  materials: Material[];
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  materials: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    setMaterials(state, action: PayloadAction<Material[]>) {
      state.materials = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMaterial(state, action: PayloadAction<Material>) {
      state.materials.push(action.payload);
    },
    updateMaterial(state, action: PayloadAction<Material>) {
      const index = state.materials.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.materials[index] = action.payload;
      }
    },
    removeMaterial(state, action: PayloadAction<number>) {
      state.materials = state.materials.filter((m) => m.id !== action.payload);
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

export const { setMaterials, addMaterial, updateMaterial, removeMaterial, setLoading, setError } =
  materialSlice.actions;
export default materialSlice.reducer;
