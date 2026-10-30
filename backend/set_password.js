import { pool } from './src/config/db.js';
import bcrypt from 'bcryptjs';

async function setPassword() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashedPassword, 'admin@anantengineering.co.in']);
    console.log('Password updated successfully');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

setPassword();
