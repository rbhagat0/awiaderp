import { pool } from '../src/config/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create a default super admin company
    const companyResult = await client.query(
      `INSERT INTO companies (name, subscription_tier, status)
       VALUES ('Awiad ERP', 'enterprise', 'active')
       RETURNING id`
    );
    const companyId = companyResult.rows[0].id;

    // Create super admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO users (email, password, role, company_id, name)
       VALUES ($1, $2, $3, $4, $5)`,
      ['superadmin@awiaderp.com', hashedPassword, 'super_admin', companyId, 'Super Admin']
    );

    console.log('Seed completed successfully');
    console.log('Super Admin credentials:');
    console.log('Email: superadmin@awiaderp.com');
    console.log('Password: admin123');

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();