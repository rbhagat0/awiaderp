import { pool } from '../config/db.js';
import { getTierPlan, isUnlimited } from '../config/tierConfig.js';

/**
 * Middleware to enforce tier-based limits before creating resources.
 * Usage: tierLimitMiddleware('clients', 'maxClients') or tierLimitMiddleware('projects', 'maxProjects')
 */
export const tierLimitMiddleware = (resourceTable, limitKey) => {
  return async (req, res, next) => {
    try {
      const { company_id } = req.user;

      // Fetch company tier
      const companyResult = await pool.query(
        'SELECT subscription_tier FROM companies WHERE id = $1',
        [company_id]
      );

      if (companyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const tier = companyResult.rows[0].subscription_tier;
      const plan = getTierPlan(tier);
      const limit = plan[limitKey];

      // If unlimited, skip check
      if (isUnlimited(limit)) {
        return next();
      }

      // Count existing resources for this company
      const countResult = await pool.query(
        `SELECT COUNT(*) as count FROM ${resourceTable} WHERE company_id = $1`,
        [company_id]
      );

      const currentCount = parseInt(countResult.rows[0].count, 10);

      if (currentCount >= limit) {
        return res.status(403).json({
          error: `Tier limit reached: You can have at most ${limit} ${resourceTable} on the ${plan.name} plan.`,
          tier,
          limit,
          currentCount,
          upgradeRequired: true,
        });
      }

      next();
    } catch (err) {
      console.error('Tier limit middleware error:', err);
      res.status(500).json({ error: 'Failed to check tier limits' });
    }
  };
};
