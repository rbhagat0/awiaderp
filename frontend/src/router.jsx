import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MasterAdminPage from './pages/MasterAdminPage';
import HomeHubPage from './pages/HomeHubPage';
import SalesPage from './pages/SalesPage';
import ProjectsPage from './pages/ProjectsPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: 'admin', element: <ProtectedRoute><MasterAdminPage /></ProtectedRoute> },
      { path: 'home', element: <ProtectedRoute><HomeHubPage /></ProtectedRoute> },
      { path: 'sales', element: <ProtectedRoute><SalesPage /></ProtectedRoute> },
      { path: 'projects', element: <ProtectedRoute><ProjectsPage /></ProtectedRoute> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;