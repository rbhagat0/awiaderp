import express from 'express';
import { authenticateToken, authorizeRoles, requireCompanyAccess } from '../middleware/auth.js';
import { companyController } from '../controllers/companyController.js';
import { authController } from '../controllers/authController.js';
import { clientController } from '../controllers/clientController.js';
import { leadController } from '../controllers/leadController.js';
import { projectController } from '../controllers/projectController.js';
import { taskController } from '../controllers/taskController.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);

// Company routes (Super Admin only)
router.get('/companies', authenticateToken, authorizeRoles('super_admin'), companyController.getAllCompanies);
router.post('/companies', authenticateToken, authorizeRoles('super_admin'), companyController.createCompany);
router.get('/companies/:id', authenticateToken, authorizeRoles('super_admin'), companyController.getCompanyById);
router.patch('/companies/:id', authenticateToken, authorizeRoles('super_admin'), companyController.updateCompany);

// Client routes (Tenant)
router.get('/clients', authenticateToken, requireCompanyAccess, clientController.getClients);
router.post('/clients', authenticateToken, requireCompanyAccess, clientController.createClient);
router.put('/clients/:id', authenticateToken, requireCompanyAccess, clientController.updateClient);
router.delete('/clients/:id', authenticateToken, requireCompanyAccess, clientController.deleteClient);

// Lead routes (Tenant)
router.get('/leads', authenticateToken, requireCompanyAccess, leadController.getLeads);
router.post('/leads', authenticateToken, requireCompanyAccess, leadController.createLead);
router.put('/leads/:id', authenticateToken, requireCompanyAccess, leadController.updateLead);
router.delete('/leads/:id', authenticateToken, requireCompanyAccess, leadController.deleteLead);

// Project routes (Tenant)
router.get('/projects', authenticateToken, requireCompanyAccess, projectController.getProjects);
router.post('/projects', authenticateToken, requireCompanyAccess, projectController.createProject);
router.put('/projects/:id', authenticateToken, requireCompanyAccess, projectController.updateProject);
router.delete('/projects/:id', authenticateToken, requireCompanyAccess, projectController.deleteProject);

// Task routes (Tenant)
router.get('/tasks', authenticateToken, requireCompanyAccess, taskController.getTasks);
router.post('/tasks', authenticateToken, requireCompanyAccess, taskController.createTask);
router.put('/tasks/:id', authenticateToken, requireCompanyAccess, taskController.updateTask);
router.delete('/tasks/:id', authenticateToken, requireCompanyAccess, taskController.deleteTask);

export default router;