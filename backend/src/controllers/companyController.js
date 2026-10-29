import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const companyController = {
  // Get all companies (Super Admin only)
  async getAllCompanies(req, res) {
    try {
      const result = await pool.query(
        `SELECT c.id, c.name, c.subscription_tier, c.status, c.created_at,
                COUNT(u.id) as user_count
         FROM companies c
         LEFT JOIN users u ON u.company_id = c.id
         GROUP BY c.id, c.name, c.subscription_tier, c.status, c.created_at
         ORDER BY c.created_at DESC`
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  },

  // Create a new company with company_admin account (Super Admin only)
  async createCompany(req, res) {
    const { name, subscription_tier = 'starter', status = 'active', admin_email, admin_password, admin_name } = req.body;

    if (!admin_email || !admin_password || !admin_name) {
      return res.status(400).json({ error: 'Admin email, password, and name are required' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create the company
      const companyResult = await client.query(
        `INSERT INTO companies (name, subscription_tier, status)
         VALUES ($1, $2, $3)
         RETURNING id, name, subscription_tier, status, created_at`,
        [name, subscription_tier, status]
      );

      const company = companyResult.rows[0];

      // Hash the admin password
      const hashedPassword = await bcrypt.hash(admin_password, 10);

      // Create the company_admin user
      const userResult = await client.query(
        `INSERT INTO users (email, password, role, company_id, name)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, role, company_id, name, created_at`,
        [admin_email, hashedPassword, 'company_admin', company.id, admin_name]
      );

      await client.query('COMMIT');

      res.status(201).json({
        company,
        admin_user: userResult.rows[0],
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      if (err.code === '23505') { // unique_violation
        return res.status(400).json({ error: 'Admin email already registered' });
      }
      res.status(500).json({ error: 'Failed to create company' });
    } finally {
      client.release();
    }
  },

  // Update company subscription/status/details (Super Admin only)
  async updateCompany(req, res) {
    const { id } = req.params;
    const { name, subscription_tier, status, contact_person, contact_email, contact_phone, address } = req.body;

    try {
      const result = await pool.query(
        `UPDATE companies
         SET name = COALESCE($1, name),
             subscription_tier = COALESCE($2, subscription_tier),
             status = COALESCE($3, status),
             contact_person = COALESCE($4, contact_person),
             contact_email = COALESCE($5, contact_email),
             contact_phone = COALESCE($6, contact_phone),
             address = COALESCE($7, address),
             updated_at = NOW()
         WHERE id = $8
         RETURNING id, name, subscription_tier, status, contact_person, contact_email, contact_phone, address, updated_at`,
        [name, subscription_tier, status, contact_person, contact_email, contact_phone, address, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update company' });
    }
  },

  // Update company details (Company Admin - their own company)
  async updateCompanyDetails(req, res) {
    const { company_id } = req.user;
    const { contact_person, contact_email, contact_phone, address } = req.body;

    try {
      const result = await pool.query(
        `UPDATE companies
         SET contact_person = COALESCE($1, contact_person),
             contact_email = COALESCE($2, contact_email),
             contact_phone = COALESCE($3, contact_phone),
             address = COALESCE($4, address),
             updated_at = NOW()
         WHERE id = $5
         RETURNING id, name, subscription_tier, status, contact_person, contact_email, contact_phone, address, updated_at`,
        [contact_person, contact_email, contact_phone, address, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update company details' });
    }
  },

  // Get company by ID
  async getCompanyById(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `SELECT * FROM companies WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  },

  // Delete a company and all related data (Super Admin only)
  async deleteCompany(req, res) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM companies WHERE id = $1 RETURNING id, name',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json({ message: 'Company deleted successfully', company: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete company' });
    }
  },
};