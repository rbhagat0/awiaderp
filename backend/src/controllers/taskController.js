import { pool } from '../config/db.js';

export const taskController = {
  // Get all tasks for a company (optionally filtered by project)
  async getTasks(req, res) {
    const { company_id } = req.user;
    const { project_id } = req.query;

    try {
      let query = `
        SELECT t.*, p.name as project_name, u.name as assigned_to_name
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.company_id = $1
      `;
      const params = [company_id];

      if (project_id) {
        query += ` AND t.project_id = $2`;
        params.push(project_id);
      }

      query += ` ORDER BY t.created_at DESC`;

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Create a new task
  async createTask(req, res) {
    const { company_id } = req.user;
    const { project_id, title, description, status = 'todo', priority = 'medium', assigned_to, due_date } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO tasks (company_id, project_id, title, description, status, priority, assigned_to, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [company_id, project_id, title, description, status, priority, assigned_to, due_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Update a task
  async updateTask(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;
    const { project_id, title, description, status, priority, assigned_to, due_date } = req.body;

    try {
      const result = await pool.query(
        `UPDATE tasks
         SET project_id = COALESCE($1, project_id),
             title = COALESCE($2, title),
             description = COALESCE($3, description),
             status = COALESCE($4, status),
             priority = COALESCE($5, priority),
             assigned_to = COALESCE($6, assigned_to),
             due_date = COALESCE($7, due_date),
             updated_at = NOW()
         WHERE id = $8 AND company_id = $9
         RETURNING *`,
        [project_id, title, description, status, priority, assigned_to, due_date, id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Delete a task
  async deleteTask(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 AND company_id = $2 RETURNING id',
        [id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },
};