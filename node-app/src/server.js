'use strict';

const http = require('http');
const DataStore = require('./data');
const Operations = require('./operations');

/**
 * HTTP Server - Health check and REST API for containerized deployment.
 * This is a new component (no COBOL equivalent) added for cloud-native deployment.
 */

const PORT = process.env.HEALTH_PORT || process.env.PORT || 3000;
const INITIAL_BALANCE = parseFloat(process.env.INITIAL_BALANCE) || 1000.00;

const dataStore = new DataStore(INITIAL_BALANCE);
const operations = new Operations(dataStore);

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  try {
    if (path === '/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'healthy',
        service: 'node-accounting-app',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }));

    } else if (path === '/api/balance' && method === 'GET') {
      const result = operations.viewBalance();
      res.writeHead(200);
      res.end(JSON.stringify(result));

    } else if (path === '/api/credit' && method === 'POST') {
      const body = await parseBody(req);
      const result = operations.credit(body.amount);
      res.writeHead(result.success ? 200 : 400);
      res.end(JSON.stringify(result));

    } else if (path === '/api/debit' && method === 'POST') {
      const body = await parseBody(req);
      const result = operations.debit(body.amount);
      res.writeHead(result.success ? 200 : 400);
      res.end(JSON.stringify(result));

    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Accounting server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = server;
