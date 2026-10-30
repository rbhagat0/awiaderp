import { pool } from '../config/db.js';

/**
 * Middleware to check if a company's subscription has expired.
 * If expired and status is 'active', auto-suspends the company and blocks access.
 */
export const checkSubscriptionExpiry = async (req, res, next) => {
  try {
    const { company_id } = req.user;

    const result = await pool.query(
      `SELECT subscription_end_date, status FROM companies WHERE id = $1`,
      [company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const { subscription_end_date, status } = result.rows[0];

    // If subscription has expired and company is still active, auto-suspend
    if (subscription_end_date && new Date(subscription_end_date) < new Date() && status === 'active') {
      await pool.query(
        `UPDATE companies SET status = 'suspended', updated_at = NOW() WHERE id = $1`,
        [company_id]
      );
      return res.status(403).json({
        error: 'Subscription has expired. Please renew to continue.',
        expired: true,
        expiredAt: subscription_end_date,
      });
    }

    next();
  } catch (err) {
    console.error('Subscription expiry check error:', err);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
};
