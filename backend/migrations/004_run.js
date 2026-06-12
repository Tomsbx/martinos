require('dotenv').config({ path: `${__dirname}/../.env` });
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '004_payment_method.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migration 004 applied successfully');
  await pool.end();
}

run().catch(err => {
  console.error('Migration 004 failed:', err.message);
  process.exit(1);
});
