import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { LayoutGrid, Users, ShoppingCart, FolderKanban, BarChart3 } from 'lucide-react';

const modules = [
  {
    id: 'sales',
    name: 'Sales',
    description: 'Manage clients, leads, and deals',
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    route: '/sales',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Create projects and track tasks',
    icon: <FolderKanban className="w-6 h-6" />,
    color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    route: '/projects',
  },
];

export default function HomeHubPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Home</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back to {user?.company_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">System Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => window.location.href = module.route}
            className="glass-card p-6 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.color} mb-4 group-hover:scale-110 transition-transform`}>
              {module.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {module.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {module.description}
            </p>
            <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
              Open Module <span className="ml-1">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Leads</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Projects</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}