const http = require('http');

const endpoints = [
  '/api/products',
  '/api/orders',
  '/api/settings',
];

const checkEndpoint = (path) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          data: data.substring(0, 100) + '...',
        });
      });
    });

    req.on('error', (error) => {
      resolve({ path, status: 'ERROR', error: error.message });
    });

    req.end();
  });
};

async function diagnose() {
  console.log('--- API Diagnosis ---');
  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint);
    console.log(`[${result.status}] ${result.path}`);
    if (result.error) console.log(`  Error: ${result.error}`);
  }
}

diagnose();
