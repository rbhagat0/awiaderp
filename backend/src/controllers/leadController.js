import { pool } from '../config/db.js';

export const leadController = {
  // Get all leads for a company
  async getLeads(req, res) {
    const { company_id } = req.user;

    try {
      const result = await pool.query(
        `SELECT l.*, c.name as client_name
         FROM leads l
         LEFT JOIN clients c ON l.client_id = c.id
         WHERE l.company_id = $1
         ORDER BY l.created_at DESC`,
        [company_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  },

  // Create a new lead
  async createLead(req, res) {
    const { company_id } = req.user;
    const { client_id, title, value, status = 'new', expected_close_date } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO leads (company_id, client_id, title, value, status, expected_close_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [company_id, client_id, title, value, status, expected_close_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create lead' });
    }
  },

  // Update a lead
  async updateLead(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;
    const { client_id, title, value, status, expected_close_date } = req.body;

    try {
      const result = await pool.query(
        `UPDATE leads
         SET client_id = COALESCE($1, client_id),
             title = COALESCE($2, title),
             value = COALESCE($3, value),
             status = COALESCE($4, status),
             expected_close_date = COALESCE($5, expected_close_date),
             updated_at = NOW()
         WHERE id = $6 AND company_id = $7
         RETURNING *`,
        [client_id, title, value, status, expected_close_date, id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update lead' });
    }
  },

  // Delete a lead
  async deleteLead(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM leads WHERE id = $1 AND company_id = $2 RETURNING id',
        [id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      res.json({ message: 'Lead deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  },
};