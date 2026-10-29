import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MasterAdminPage from './pages/MasterAdminPage';
import HomeHubPage from './pages/HomeHubPage';
import SalesPage from './pages/SalesPage';
import ProjectsPage from './pages/ProjectsPage';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'admin', element: <MasterAdminPage /> },
      { path: 'home', element: <HomeHubPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'projects', element: <ProjectsPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;