import { pool } from '../config/db.js';

export const projectController = {
  // Get all projects for a company
  async getProjects(req, res) {
    const { company_id } = req.user;

    try {
      const result = await pool.query(
        `SELECT p.*, c.name as client_name
         FROM projects p
         LEFT JOIN clients c ON p.client_id = c.id
         WHERE p.company_id = $1
         ORDER BY p.created_at DESC`,
        [company_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  // Create a new project
  async createProject(req, res) {
    const { company_id } = req.user;
    const { name, client_id, description, status = 'active', start_date, end_date } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO projects (company_id, client_id, name, description, status, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [company_id, client_id, name, description, status, start_date, end_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create project' });
    }
  },

  // Update a project
  async updateProject(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;
    const { name, client_id, description, status, start_date, end_date } = req.body;

    try {
      const result = await pool.query(
        `UPDATE projects
         SET name = COALESCE($1, name),
             client_id = COALESCE($2, client_id),
             description = COALESCE($3, description),
             status = COALESCE($4, status),
             start_date = COALESCE($5, start_date),
             end_date = COALESCE($6, end_date),
             updated_at = NOW()
         WHERE id = $7 AND company_id = $8
         RETURNING *`,
        [name, client_id, description, status, start_date, end_date, id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update project' });
    }
  },

  // Delete a project
  async deleteProject(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM projects WHERE id = $1 AND company_id = $2 RETURNING id',
        [id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  },
};