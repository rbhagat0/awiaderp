import express from 'express';
import { authenticateToken, authorizeRoles, requireCompanyAccess } from '../middleware/auth.js';
import { tierLimitMiddleware } from '../middleware/tierLimit.js';
import { checkSubscriptionExpiry } from '../middleware/subscriptionExpiry.js';
import { companyController } from '../controllers/companyController.js';
import { authController } from '../controllers/authController.js';
import { clientController } from '../controllers/clientController.js';
import { leadController } from '../controllers/leadController.js';
import { projectController } from '../controllers/projectController.js';
import { taskController } from '../controllers/taskController.js';
import { employeeController } from '../controllers/employeeController.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password/:token', authController.resetPassword);
router.get('/auth/pending-resets', authenticateToken, authorizeRoles('company_admin'), authController.getPendingResets);
router.post('/auth/approve-reset', authenticateToken, authorizeRoles('company_admin'), authController.approveReset);
router.post('/auth/force-reset-company-admin/:company_id', authenticateToken, authorizeRoles('super_admin'), authController.forceResetCompanyAdmin);

// Company routes (Super Admin only)
router.get('/companies', authenticateToken, authorizeRoles('super_admin'), companyController.getAllCompanies);
router.post('/companies', authenticateToken, authorizeRoles('super_admin'), companyController.createCompany);
router.get('/companies/:id', authenticateToken, authorizeRoles('super_admin', 'company_admin'), requireCompanyAccess, companyController.getCompanyById);
router.patch('/companies/details', authenticateToken, authorizeRoles('company_admin'), companyController.updateCompanyDetails);
router.patch('/companies/:id', authenticateToken, authorizeRoles('super_admin'), companyController.updateCompany);
router.delete('/companies/:id', authenticateToken, authorizeRoles('super_admin'), companyController.deleteCompany);

// Client routes (Tenant)
router.get('/clients', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, clientController.getClients);
router.post('/clients', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, tierLimitMiddleware('clients', 'maxClients'), clientController.createClient);
router.put('/clients/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, clientController.updateClient);
router.delete('/clients/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, clientController.deleteClient);

// Lead routes (Tenant)
router.get('/leads', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, leadController.getLeads);
router.post('/leads', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, tierLimitMiddleware('leads', 'maxClients'), leadController.createLead);
router.put('/leads/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, leadController.updateLead);
router.delete('/leads/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, leadController.deleteLead);

// Project routes (Tenant)
router.get('/projects', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, projectController.getProjects);
router.post('/projects', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, tierLimitMiddleware('projects', 'maxProjects'), projectController.createProject);
router.put('/projects/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, projectController.updateProject);
router.delete('/projects/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, projectController.deleteProject);

// Task routes (Tenant)
router.get('/tasks', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, taskController.getTasks);
router.post('/tasks', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, tierLimitMiddleware('tasks', 'maxTasks'), taskController.createTask);
router.put('/tasks/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, taskController.updateTask);
router.delete('/tasks/:id', authenticateToken, requireCompanyAccess, checkSubscriptionExpiry, taskController.deleteTask);

// Employee routes (Company Admin)
router.get('/employees', authenticateToken, authorizeRoles('company_admin'), checkSubscriptionExpiry, employeeController.getEmployees);
router.post('/employees', authenticateToken, authorizeRoles('company_admin'), checkSubscriptionExpiry, tierLimitMiddleware('employees', 'maxUsers'), employeeController.createEmployee);
router.put('/employees/:id', authenticateToken, authorizeRoles('company_admin'), checkSubscriptionExpiry, employeeController.updateEmployee);
router.delete('/employees/:id', authenticateToken, authorizeRoles('company_admin'), checkSubscriptionExpiry, employeeController.deleteEmployee);

export default router;