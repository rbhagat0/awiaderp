import { pool } from './src/config/db.js';

async function check() {
  try {
    const result = await pool.query(`SELECT id, name, contact_person, contact_email, contact_phone, address, gst_number, industry, currency, timezone, financial_year FROM companies`);
    console.table(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
