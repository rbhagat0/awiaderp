import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const companyController = {
  // Get all companies (Super Admin only)
  async getAllCompanies(req, res) {
    try {
      const result = await pool.query(
        `SELECT c.id, c.name, c.company_code, c.gst_number, c.jurisdiction, c.subscription_tier, c.status, c.created_at,
                c.contact_person, c.contact_email, c.contact_phone, c.address,
                c.subscription_start_date, c.subscription_end_date, c.subscription_duration,
                COUNT(u.id) as user_count
         FROM companies c
         LEFT JOIN users u ON u.company_id = c.id
         GROUP BY c.id, c.name, c.company_code, c.gst_number, c.jurisdiction, c.subscription_tier, c.status, c.created_at,
                  c.contact_person, c.contact_email, c.contact_phone, c.address,
                  c.subscription_start_date, c.subscription_end_date, c.subscription_duration
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
    const { name, company_code, gst_number, jurisdiction, subscription_tier = 'starter', status = 'active', contact_person, contact_email, contact_phone, address, admin_email, admin_password, admin_name, subscription_duration } = req.body;

    if (!admin_email || !admin_password || !admin_name) {
      return res.status(400).json({ error: 'Admin email, password, and name are required' });
    }

    // Calculate subscription end date from duration
    let subscription_end_date = null;
    if (subscription_duration) {
      const now = new Date();
      switch (subscription_duration) {
        case '7_days':
          subscription_end_date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case '1_month':
          subscription_end_date = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case '3_months':
          subscription_end_date = new Date(now.setMonth(now.getMonth() + 3));
          break;
        case '6_months':
          subscription_end_date = new Date(now.setMonth(now.getMonth() + 6));
          break;
        case '1_year':
          subscription_end_date = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
      }
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create the company
      const companyResult = await client.query(
        `INSERT INTO companies (name, company_code, gst_number, jurisdiction, subscription_tier, status, contact_person, contact_email, contact_phone, address, subscription_start_date, subscription_end_date, subscription_duration)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12)
         RETURNING id, name, company_code, gst_number, jurisdiction, subscription_tier, status, contact_person, contact_email, contact_phone, address, subscription_start_date, subscription_end_date, subscription_duration, created_at`,
        [name, company_code, gst_number, jurisdiction, subscription_tier, status, contact_person, contact_email, contact_phone, address, subscription_end_date, subscription_duration]
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
    const { name, company_code, gst_number, jurisdiction, subscription_tier, status, contact_person, contact_email, contact_phone, address, subscription_duration } = req.body;

    // Calculate subscription end date if duration is provided
    let subscription_end_date = null;
    if (subscription_duration) {
      const now = new Date();
      switch (subscription_duration) {
        case '7_days':
          subscription_end_date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case '1_month':
          subscription_end_date = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case '3_months':
          subscription_end_date = new Date(now.setMonth(now.getMonth() + 3));
          break;
        case '6_months':
          subscription_end_date = new Date(now.setMonth(now.getMonth() + 6));
          break;
        case '1_year':
          subscription_end_date = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
      }
    }

    try {
      const result = await pool.query(
        `UPDATE companies
         SET name = COALESCE($1, name),
             company_code = COALESCE($2, company_code),
             gst_number = COALESCE($3, gst_number),
             jurisdiction = COALESCE($4, jurisdiction),
             subscription_tier = COALESCE($5, subscription_tier),
             status = COALESCE($6, status),
             contact_person = COALESCE($7, contact_person),
             contact_email = COALESCE($8, contact_email),
             contact_phone = COALESCE($9, contact_phone),
             address = COALESCE($10, address),
             subscription_end_date = COALESCE($11, subscription_end_date),
             subscription_duration = COALESCE($12, subscription_duration),
             updated_at = NOW()
         WHERE id = $13
         RETURNING id, name, company_code, gst_number, jurisdiction, subscription_tier, status, contact_person, contact_email, contact_phone, address, subscription_start_date, subscription_end_date, subscription_duration, updated_at`,
        [name, company_code, gst_number, jurisdiction, subscription_tier, status, contact_person, contact_email, contact_phone, address, subscription_end_date, subscription_duration, id]
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
    const { contact_person, contact_email, contact_phone, address, industry, currency, timezone, financial_year } = req.body;

    try {
      const result = await pool.query(
        `UPDATE companies
         SET contact_person = COALESCE($1, contact_person),
             contact_email = COALESCE($2, contact_email),
             contact_phone = COALESCE($3, contact_phone),
             address = COALESCE($4, address),
             industry = COALESCE($5, industry),
             currency = COALESCE($6, currency),
             timezone = COALESCE($7, timezone),
             financial_year = COALESCE($8, financial_year),
             updated_at = NOW()
         WHERE id = $9
         RETURNING id, name, subscription_tier, status, contact_person, contact_email, contact_phone, address, industry, currency, timezone, financial_year, updated_at`,
        [contact_person, contact_email, contact_phone, address, industry, currency, timezone, financial_year, company_id]
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