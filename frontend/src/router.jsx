import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ResetPassword from './pages/ResetPassword';
import DashboardPage from './pages/DashboardPage';
import MasterAdminPage from './pages/MasterAdminPage';
import HomeHubPage from './pages/HomeHubPage';
import SalesPage from './pages/SalesPage';
import ProjectsPage from './pages/ProjectsPage';
import CompanyAdminDashboard from './pages/CompanyAdminDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
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
      { path: 'company-admin', element: <ProtectedRoute><CompanyAdminDashboard /></ProtectedRoute> },
      { path: 'employees', element: <ProtectedRoute><EmployeeManagement /></ProtectedRoute> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
]);

export default router;