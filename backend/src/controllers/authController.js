import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { sendResetEmail, sendApprovalEmail } from '../config/email.js';
import crypto from 'crypto';

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

  // Forgot password - request reset
  async forgotPassword(req, res) {
    const { email, role } = req.body;

    try {
      const userResult = await pool.query(
        `SELECT u.*, c.name as company_name
         FROM users u
         LEFT JOIN companies c ON u.company_id = c.id
         WHERE u.email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        // Don't reveal if email exists or not (security)
        return res.json({ message: 'If this email exists, a reset link has been sent.' });
      }

      const user = userResult.rows[0];
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      if (role === 'employee') {
        // Employee needs company admin approval
        await pool.query(
          `INSERT INTO password_resets (user_id, email, role, company_id, token, status, expires_at)
           VALUES ($1, $2, $3, $4, $5, 'pending', $6)`,
          [user.id, email, role, user.company_id, token, expiresAt]
        );

        // Notify company admin (in-app notification could go here)
        return res.json({
          message: 'Reset request submitted. Your company admin needs to approve it.',
          requiresApproval: true,
        });
      }

      // Company Admin or Super Admin - direct reset link
      await pool.query(
        `INSERT INTO password_resets (user_id, email, role, company_id, token, status, expires_at)
         VALUES ($1, $2, $3, $4, $5, 'approved', $6)`,
        [user.id, email, role, user.company_id, token, expiresAt]
      );

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await sendResetEmail({
        to: email,
        resetUrl,
        userName: user.name,
      });

      res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Forgot password failed' });
    }
  },

  // Company Admin: list pending reset requests for employees
  async getPendingResets(req, res) {
    const { company_id } = req.user;

    try {
      const result = await pool.query(
        `SELECT pr.id, pr.email, pr.role, pr.status, pr.created_at, pr.expires_at,
                u.name as user_name, u.id as user_id
         FROM password_resets pr
         LEFT JOIN users u ON pr.user_id = u.id
         WHERE pr.company_id = $1 AND pr.status = 'pending'
         ORDER BY pr.created_at DESC`,
        [company_id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch pending resets' });
    }
  },

  // Company Admin: approve or reject employee reset request
  async approveReset(req, res) {
    const { resetId, action } = req.body; // action: 'approve' or 'reject'
    const { company_id, id: adminId, name: adminName } = req.user;

    try {
      const resetResult = await pool.query(
        `SELECT * FROM password_resets WHERE id = $1 AND company_id = $2 AND status = 'pending'`,
        [resetId, company_id]
      );

      if (resetResult.rows.length === 0) {
        return res.status(404).json({ error: 'Pending reset request not found' });
      }

      const reset = resetResult.rows[0];

      if (action === 'approve') {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await pool.query(
          `UPDATE password_resets
           SET status = 'approved', approved_by = $1, token = $2, expires_at = $3
           WHERE id = $4`,
          [adminId, token, expiresAt, resetId]
        );

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await sendResetEmail({
          to: reset.email,
          resetUrl,
          userName: reset.user_name || 'User',
        });

        await sendApprovalEmail({
          to: reset.email,
          userName: reset.user_name || 'User',
          companyName: '', // could fetch company name
          adminName: adminName || 'Admin',
        });

        res.json({ message: 'Reset request approved. Reset link sent to employee.' });
      } else {
        await pool.query(
          `UPDATE password_resets SET status = 'rejected' WHERE id = $1`,
          [resetId]
        );

        res.json({ message: 'Reset request rejected.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process reset request' });
    }
  },

  // Reset password with token
  async resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const resetResult = await pool.query(
        `SELECT * FROM password_resets WHERE token = $1 AND status = 'approved'`,
        [token]
      );

      if (resetResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const reset = resetResult.rows[0];

      if (new Date(reset.expires_at) < new Date()) {
        await pool.query(
          `UPDATE password_resets SET status = 'expired' WHERE id = $1`,
          [reset.id]
        );
        return res.status(400).json({ error: 'Reset token has expired' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
        [hashedPassword, reset.user_id]
      );

      await pool.query(
        `UPDATE password_resets SET status = 'completed', used_at = NOW() WHERE id = $1`,
        [reset.id]
      );

      res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Password reset failed' });
    }
  },

  // Super Admin: force reset company admin password
  async forceResetCompanyAdmin(req, res) {
    const { company_id } = req.params;
    const { id: adminId, name: adminName } = req.user;

    try {
      // Verify super admin
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Only super admin can force reset' });
      }

      const userResult = await pool.query(
        `SELECT u.*, c.name as company_name
         FROM users u
         LEFT JOIN companies c ON u.company_id = c.id
         WHERE u.company_id = $1 AND u.role = 'company_admin'`,
        [company_id]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company admin not found' });
      }

      const user = userResult.rows[0];
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await pool.query(
        `INSERT INTO password_resets (user_id, email, role, company_id, token, status, requested_by, expires_at)
         VALUES ($1, $2, $3, $4, $5, 'approved', $6, $7)`,
        [user.id, user.email, user.role, company_id, adminId, token, expiresAt]
      );

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await sendResetEmail({
        to: user.email,
        resetUrl,
        userName: user.name,
      });

      res.json({ message: 'Password reset link sent to company admin.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Force reset failed' });
    }
  },
};