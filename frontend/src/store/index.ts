import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import operatorReducer from './slices/operatorSlice';
import machineReducer from './slices/machineSlice';
import materialReducer from './slices/materialSlice';
import workOrderReducer from './slices/workOrderSlice';
import allocationReducer from './slices/allocationSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    operators: operatorReducer,
    machines: machineReducer,
    materials: materialReducer,
    workOrders: workOrderReducer,
    allocations: allocationReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
