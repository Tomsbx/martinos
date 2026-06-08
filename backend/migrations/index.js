require('dotenv').config({ path: `${__dirname}/../.env` });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const sql = fs.readFileSync(path.join(__dirname, '001_init.sql'), 'utf8');
  await client.query(sql);
  console.log('Migration applied successfully');
  await client.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
