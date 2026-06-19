# Account Management System (Node.js)

A modernized Node.js implementation of the legacy COBOL accounting system. This application provides a command-line interface for managing account balances with credit and debit operations.

## Features

- **View Balance** - Display the current account balance
- **Credit Account** - Add funds to the account
- **Debit Account** - Withdraw funds (with insufficient funds protection)
- **Input Validation** - Prevents invalid or negative amounts

## Quick Start

```bash
# Install dependencies
npm install

# Run the application
npm start

# Run tests
npm test

# Run linter
npm run lint
```

## Project Structure

```
src/
├── main.js          # CLI entry point and menu loop
├── operations.js    # Business logic (credit, debit, view)
└── data.js          # Data persistence layer

tests/
├── unit/            # Unit tests for each module
└── integration/     # End-to-end workflow tests
```

## Testing

```bash
# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Deployment

### Development

```bash
npm start
```

### Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

### Full deployment pipeline

```bash
# Development (runs directly)
./scripts/deploy.sh development

# Staging (builds and runs Docker)
./scripts/deploy.sh staging

# Production (builds, pushes to registry, deploys)
DOCKER_REGISTRY=ghcr.io/your-org ./scripts/deploy.sh production
```

See [scripts/deploy.sh](scripts/deploy.sh) for the full deployment script with environment validation, testing, and container orchestration.

## COBOL Migration Reference

| Original COBOL | Node.js Equivalent | Purpose |
|---------------|-------------------|---------|
| `main.cob` | `src/main.js` | Menu UI and program flow |
| `operations.cob` | `src/operations.js` | Credit/debit business logic |
| `data.cob` | `src/data.js` | Balance storage |

## Requirements

- Node.js 18+
- npm 9+
- Docker (for containerized deployment)

## License

MIT
