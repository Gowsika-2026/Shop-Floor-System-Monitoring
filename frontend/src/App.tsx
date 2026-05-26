import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@components/layout/Layout';
import PrivateRoute from '@components/auth/PrivateRoute';
import LoginPage from '@pages/auth/LoginPage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import OperatorsPage from '@pages/operators/OperatorsPage';
import MachinesPage from '@pages/machines/MachinesPage';
import MaterialsPage from '@pages/materials/MaterialsPage';
import WorkOrdersPage from '@pages/workOrders/WorkOrdersPage';
import AllocationPage from '@pages/allocation/AllocationPage';
import AnalyticsPage from '@pages/analytics/AnalyticsPage';
import { initializeSocket } from '@services/socket';

function App() {
  useEffect(() => {
    // Initialize WebSocket connection
    const socket = initializeSocket();
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="operators" element={<OperatorsPage />} />
        <Route path="machines" element={<MachinesPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="work-orders" element={<WorkOrdersPage />} />
        <Route path="allocation" element={<AllocationPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
