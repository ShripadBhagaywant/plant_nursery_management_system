
import { Navigate } from 'react-router-dom';
//import { useAuth } from '../hooks/useAuth';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useAuth();
  
  if (!auth) return <Navigate to="/login"/>;
  if (role && auth.role !== role) return <Navigate to="/home" />;
  return children;
};

export default ProtectedRoute;
