import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While auth is loading, show nothing
  if (loading) return null;

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
