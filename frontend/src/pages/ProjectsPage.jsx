import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Plus, Trash2, Edit3, Search, FolderKanban, CheckCircle2 } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', client_id: '', description: '', status: 'active', start_date: '', end_date: '' });
  const [newTask, setNewTask] = useState({ project_id: '', title: '', description: '', status: 'todo', priority: 'medium', assigned_to: '', due_date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowProjectForm(false);
      setNewProject({ name: '', client_id: '', description: '', status: 'active', start_date: '', end_date: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowTaskForm(false);
      setNewTask({ project_id: '', title: '', description: '', status: 'todo', priority: 'medium', assigned_to: '', due_date: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage projects and track tasks
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProjectForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'projects'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Tasks ({tasks.length})
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Project Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Client</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{project.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{project.client_name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No projects found. Add your first project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Tasks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Project</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{task.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{task.project_name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'done'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : task.status === 'in_progress'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No tasks found. Add your first task.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="glass-card p-6 max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Create Project</button>
              <button
                type="button"
                onClick={() => setShowProjectForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showTaskForm && (
        <div className="glass-card p-6 max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project
              </label>
              <select
                value={newTask.project_id}
                onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
                className="input-field"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="input-field"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Create Task</button>
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}