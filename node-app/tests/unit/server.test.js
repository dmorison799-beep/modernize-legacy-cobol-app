'use strict';

const http = require('http');

let server;

beforeAll((done) => {
  // Set port to avoid conflicts
  process.env.HEALTH_PORT = '3999';
  server = require('../../src/server');
  server.on('listening', done);
});

afterAll((done) => {
  server.close(done);
});

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3999,
      path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

describe('HTTP Server (REST API for deployment)', () => {
  it('GET /health should return healthy status', async () => {
    const res = await request('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('node-accounting-app');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/balance should return current balance', async () => {
    const res = await request('/api/balance');
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(1000.00);
    expect(res.body.message).toContain('Current balance');
  });

  it('POST /api/credit should credit the account', async () => {
    const res = await request('/api/credit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { amount: 250.00 }
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.balance).toBe(1250.00);
  });

  it('POST /api/debit should debit the account', async () => {
    const res = await request('/api/debit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { amount: 100.00 }
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.balance).toBe(1150.00);
  });

  it('POST /api/debit should reject insufficient funds', async () => {
    const res = await request('/api/debit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { amount: 99999.00 }
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Insufficient funds');
  });

  it('GET /unknown should return 404', async () => {
    const res = await request('/unknown');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
