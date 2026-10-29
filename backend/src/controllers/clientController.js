import { pool } from '../config/db.js';

export const clientController = {
  // Get all clients for a company
  async getClients(req, res) {
    const { company_id } = req.user;

    try {
      const result = await pool.query(
        `SELECT * FROM clients WHERE company_id = $1 ORDER BY created_at DESC`,
        [company_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  },

  // Create a new client
  async createClient(req, res) {
    const { company_id } = req.user;
    const { name, email, phone, address, status = 'active' } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO clients (company_id, name, email, phone, address, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [company_id, name, email, phone, address, status]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create client' });
    }
  },

  // Update a client
  async updateClient(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;
    const { name, email, phone, address, status } = req.body;

    try {
      const result = await pool.query(
        `UPDATE clients
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             address = COALESCE($4, address),
             status = COALESCE($5, status),
             updated_at = NOW()
         WHERE id = $6 AND company_id = $7
         RETURNING *`,
        [name, email, phone, address, status, id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update client' });
    }
  },

  // Delete a client
  async deleteClient(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM clients WHERE id = $1 AND company_id = $2 RETURNING id',
        [id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({ message: 'Client deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete client' });
    }
  },
};