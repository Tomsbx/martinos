require('dotenv').config({ path: `${__dirname}/../.env` });
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '003_new_categories2.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migration 003 applied successfully');
  await pool.end();
}

run().catch(err => {
  console.error('Migration 003 failed:', err.message);
  process.exit(1);
});
