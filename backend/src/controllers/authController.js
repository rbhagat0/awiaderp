import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

export const authController = {
  // Register a new user (Super Admin creates first company admin)
  async register(req, res) {
    const { email, password, role, company_id, name } = req.body;

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
         RETURNING id, email, role, company_id, name, created_at`,
        [email, hashedPassword, role, company_id, name]
      );

      const user = result.rows[0];
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
      });

      res.status(201).json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  // Login
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await pool.query(
        `SELECT u.*, c.name as company_name
         FROM users u
         LEFT JOIN companies c ON u.company_id = c.id
         WHERE u.email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          company_id: user.company_id,
          name: user.name,
          company_name: user.company_name,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.email, u.role, u.company_id, u.name, u.created_at,
                c.name as company_name, c.subscription_tier, c.status
         FROM users u
         LEFT JOIN companies c ON u.company_id = c.id
         WHERE u.id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  },
};