# Node.js Accounting Application

A modern Node.js accounting system converted from a legacy COBOL application using Devin. This project demonstrates a structured approach to mainframe modernization while preserving all original business logic.

## Architecture

```
COBOL (Before)                    Node.js (After)
┌──────────────┐                 ┌──────────────────┐
│  main.cob    │  ──────────►    │  src/main.js     │  AccountApp class
│  (CLI menu)  │                 │  (readline CLI)  │
└──────┬───────┘                 └──────┬───────────┘
       │                                │
┌──────┴───────┐                 ┌──────┴───────────┐
│operations.cob│  ──────────►    │ src/operations.js│  Operations class
│ (biz logic)  │                 │ (credit/debit)   │
└──────┬───────┘                 └──────┬───────────┘
       │                                │
┌──────┴───────┐                 ┌──────┴───────────┐
│  data.cob    │  ──────────►    │  src/data.js     │  DataStore class
│ (storage)    │                 │ (in-memory)      │
└──────────────┘                 └──────────────────┘
```

## Quick Start

```bash
# Install dependencies
cd node-app
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
node-app/
├── src/
│   ├── main.js           # CLI application entry point (main.cob equivalent)
│   ├── operations.js     # Business logic layer (operations.cob equivalent)
│   └── data.js           # Data persistence layer (data.cob equivalent)
├── tests/
│   ├── unit/
│   │   ├── data.test.js        # DataStore unit tests
│   │   └── operations.test.js  # Operations unit tests (TC-1.1 through TC-3.3)
│   └── integration/
│       └── accounting.test.js  # End-to-end workflow tests (TC-4.1)
├── scripts/
│   ├── deploy.sh               # Multi-environment deployment script
│   └── generate_presentation.py # Migration process presentation generator
├── package.json
├── .eslintrc.json
└── README.md
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the accounting application |
| `npm test` | Run all tests with coverage |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix lint issues |

## Deployment

The deployment script supports three environments:

```bash
# Development - local Node.js
./scripts/deploy.sh development setup
./scripts/deploy.sh development deploy

# Staging - Docker-based, mirrors production
./scripts/deploy.sh staging pipeline

# Production - Docker with health checks
./scripts/deploy.sh production pipeline
```

See [`scripts/deploy.sh`](scripts/deploy.sh) for all available commands including `rollback`, `health`, `logs`, and `clean`.

## Test Coverage

All test cases from the original COBOL test plan (`TESTPLAN.md`) are implemented:

| Test Case | Description | Type |
|-----------|-------------|------|
| TC-1.1 | View current balance | Unit + Integration |
| TC-2.1 | Credit with valid amount | Unit + Integration |
| TC-2.2 | Credit with zero amount | Unit |
| TC-3.1 | Debit with valid amount | Unit + Integration |
| TC-3.2 | Debit exceeding balance | Unit + Integration |
| TC-3.3 | Debit with zero amount | Unit |
| TC-4.1 | Exit application | Integration |

## COBOL to Node.js Mapping

| COBOL Construct | Node.js Equivalent |
|----------------|-------------------|
| `PIC 9(6)V99` | `number` with `toFixed(2)` |
| `CALL 'Operations' USING 'CREDIT'` | `operations.credit(amount)` |
| `CALL 'DataProgram' USING 'READ'` | `dataStore.read()` |
| `PERFORM UNTIL CONTINUE-FLAG = 'NO'` | `while (this.continueFlag)` |
| `EVALUATE USER-CHOICE` | `switch (choice)` |
| `DISPLAY / ACCEPT` | `console.log / readline` |

See [`MIGRATION.md`](../MIGRATION.md) for the complete migration guide.
