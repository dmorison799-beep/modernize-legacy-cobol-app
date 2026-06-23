# Node.js Accounting Application

Modern Node.js implementation of the legacy COBOL accounting system. Provides account management through both an interactive CLI and a REST API.

## Quick Start

```bash
cd node-app
npm install
npm start         # Interactive CLI
npm run server    # HTTP API on port 3000
```

## Features

- View account balance
- Credit account with validated amounts
- Debit account with insufficient funds protection
- REST API with health check endpoint
- Docker-ready with multi-stage build

## Project Structure

```
node-app/
├── src/
│   ├── data.js        # DataStore - persistence layer
│   ├── operations.js  # Business logic (credit/debit/view)
│   ├── main.js        # CLI application
│   └── server.js      # HTTP REST API
├── tests/
│   ├── unit/          # Unit tests for each module
│   └── integration/   # End-to-end CLI tests
├── package.json
└── .eslintrc.json
```

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/api/balance` | GET | View current balance |
| `/api/credit` | POST | Credit account (`{ "amount": 100 }`) |
| `/api/debit` | POST | Debit account (`{ "amount": 50 }`) |

## Testing

```bash
npm test              # All tests + coverage report
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests only
```

## Deployment

See [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) for full deployment instructions including Docker, AWS ECS, and Azure App Service.
