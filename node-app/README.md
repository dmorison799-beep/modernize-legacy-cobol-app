# Node.js Account Management System

A modern Node.js port of the legacy COBOL accounting system. This interactive CLI application provides basic financial operations: view balance, credit, and debit.

## Architecture

| COBOL Source | Node.js Module | Responsibility |
|---|---|---|
| `data.cob` (DataProgram) | `src/data.js` (DataStore) | In-memory balance persistence |
| `operations.cob` (Operations) | `src/operations.js` (Operations) | Business logic — credit, debit, view |
| `main.cob` (MainProgram) | `src/main.js` (AccountApp) | Interactive CLI menu loop |

### Data Flow

```
User ─► AccountApp (main.js)
             │
             ├─ viewBalance() ──► Operations ──► DataStore.read()
             ├─ credit(amt)   ──► Operations ──► DataStore.read() / write()
             └─ debit(amt)    ──► Operations ──► DataStore.read() / write()
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** (optional, for containerised deployment)

## Quick Start

```bash
# Install dependencies
cd node-app
npm install

# Run the application
npm start
```

### Example Session

```
--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 1
Current balance: 1000.00
```

## Testing

Tests use [Jest](https://jestjs.io/) and cover all business-logic test cases from `TESTPLAN.md`.

```bash
# Run all tests with coverage
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### Test Case Mapping

| Test Case | Description | Test File |
|---|---|---|
| TC-1.1 | View balance displays 1000.00 | `tests/unit/operations.test.js` |
| TC-2.1 | Credit valid amount | `tests/unit/operations.test.js` |
| TC-2.2 | Credit zero — balance unchanged | `tests/unit/operations.test.js` |
| TC-3.1 | Debit valid amount | `tests/unit/operations.test.js` |
| TC-3.2 | Debit exceeding balance — rejected | `tests/unit/operations.test.js` |
| TC-3.3 | Debit zero — balance unchanged | `tests/unit/operations.test.js` |
| TC-4.1 | Exit terminates gracefully | `tests/integration/accounting.test.js` |

## Linting

```bash
npm run lint
```

## Deployment

A comprehensive deployment script is provided at `scripts/deploy.sh`.

```bash
# Deploy to development (local Docker container)
./scripts/deploy.sh development

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production (requires confirmation)
./scripts/deploy.sh production
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DOCKER_REGISTRY` | `localhost:5000` | Docker registry URL |
| `IMAGE_NAME` | `node-accounting-app` | Docker image name |
| `IMAGE_TAG` | git short SHA | Docker image tag |
| `SKIP_TESTS` | `false` | Skip test step (not recommended for production) |

### Docker

```bash
# Build image
docker build -t node-accounting-app .

# Run container
docker run -it node-accounting-app
```

## COBOL to Node.js Mapping Reference

See [MIGRATION.md](../MIGRATION.md) for a detailed mapping of every COBOL construct to its JavaScript equivalent.

## License

MIT — see [LICENSE](../LICENSE).
