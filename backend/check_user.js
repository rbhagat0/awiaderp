import { pool } from './src/config/db.js';

async function check() {
  try {
    const result = await pool.query(`SELECT id, email, role, company_id, password FROM users WHERE email = 'admin@anantengineering.co.in'`);
    console.log(result.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
