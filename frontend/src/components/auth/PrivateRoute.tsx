import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/redux';

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
