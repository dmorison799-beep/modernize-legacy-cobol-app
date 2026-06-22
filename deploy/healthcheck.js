'use strict';

/**
 * Simple health check server for containerized deployment.
 * Responds on port 3000 with application status.
 */
const http = require('http');

const PORT = process.env.HEALTH_PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'node-accounting-app',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

module.exports = server;
