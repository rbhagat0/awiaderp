import { pool } from '../config/db.js';

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

  // Create a new company (Super Admin only)
  async createCompany(req, res) {
    const { name, subscription_tier = 'starter', status = 'active' } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO companies (name, subscription_tier, status)
         VALUES ($1, $2, $3)
         RETURNING id, name, subscription_tier, status, created_at`,
        [name, subscription_tier, status]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create company' });
    }
  },

  // Update company subscription/status (Super Admin only)
  async updateCompany(req, res) {
    const { id } = req.params;
    const { subscription_tier, status } = req.body;

    try {
      const result = await pool.query(
        `UPDATE companies
         SET subscription_tier = COALESCE($1, subscription_tier),
             status = COALESCE($2, status),
             updated_at = NOW()
         WHERE id = $3
         RETURNING id, name, subscription_tier, status, updated_at`,
        [subscription_tier, status, id]
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
};