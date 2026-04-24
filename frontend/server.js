const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Log file for debugging on shared hosting
const logFile = path.join(__dirname, 'server.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logFile, line);
  console.log(msg);
}

log("Starting server process...");
log(`Node version: ${process.version}`);

// Check Node.js version (Next.js 15 requires 18.17.0+)
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 18 || (major === 18 && minor < 17)) {
  log(`CRITICAL ERROR: Node.js version ${process.version} is not supported by Next.js 15. Please upgrade to Node 18.17.0 or higher in cPanel.`);
  process.exit(1);
}

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

log(`Environment: ${dev ? 'development' : 'production'}`);
log(`Port: ${port}`);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    log("Next.js app prepared successfully.");
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) {
        log(`Error starting server: ${err.message}`);
        throw err;
      }
      log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    log(`App preparation failed: ${err.stack}`);
    process.exit(1);
  });

