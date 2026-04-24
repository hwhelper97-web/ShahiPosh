import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:%40Blackzerox22%40@db.entqwogxewbwpewxwbmy.supabase.co:5432/postgres';

async function inspect() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('--- CONNECTED TO SUPABASE ---');
    
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Existing tables in "public" schema:');
    console.log(res.rows.map(r => r.table_name).join(', '));
    
    const schemas = await client.query(`SELECT schema_name FROM information_schema.schemata`);
    console.log('\nAvailable schemas:');
    console.log(schemas.rows.map(r => r.schema_name).join(', '));
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

inspect();
