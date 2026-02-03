const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
(async () => {
  try {
    await client.connect();
    const res = await client.query('SELECT now()');
    console.log('connected', res.rows);
  } catch (e) {
    console.error('connect error', e);
  } finally {
    await client.end();
  }
})();
