import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:wrong@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function test() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect to Supabase...');
    await client.connect();
    console.log('✅ SUCCESS: Connected to Supabase!');
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ FAILURE:', err.message);
  } finally {
    await client.end();
  }
}

test();
