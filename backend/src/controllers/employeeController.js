import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const employeeController = {
  // Get all employees for a company (Company Admin only)
  async getEmployees(req, res) {
    const { company_id } = req.user;

    try {
      const result = await pool.query(
        `SELECT id, email, name, role, company_id, created_at, updated_at
         FROM users
         WHERE company_id = $1 AND role != 'super_admin'
         ORDER BY created_at DESC`,
        [company_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  },

  // Create a new employee (Company Admin only)
  async createEmployee(req, res) {
    const { company_id } = req.user;
    const { email, password, name, role = 'employee' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    try {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (email, password, role, company_id, name)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, name, role, company_id, created_at`,
        [email, hashedPassword, role, company_id, name]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  },

  // Update an employee (Company Admin only)
  async updateEmployee(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;
    const { email, name, role, password } = req.body;

    try {
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (email !== undefined) {
        updateFields.push(`email = $${paramIndex++}`);
        updateValues.push(email);
      }
      if (name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        updateValues.push(name);
      }
      if (role !== undefined) {
        updateFields.push(`role = $${paramIndex++}`);
        updateValues.push(role);
      }
      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push(`password = $${paramIndex++}`);
        updateValues.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id, company_id);

      const result = await pool.query(
        `UPDATE users
         SET ${updateFields.join(', ')}
         WHERE id = $${paramIndex++} AND company_id = $${paramIndex++}
         RETURNING id, email, name, role, company_id, updated_at`,
        updateValues
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  },

  // Delete an employee (Company Admin only)
  async deleteEmployee(req, res) {
    const { company_id } = req.user;
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 AND company_id = $2 AND role != \'super_admin\' RETURNING id',
        [id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  },
};
