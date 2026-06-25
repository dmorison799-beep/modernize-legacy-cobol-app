# Account Management System - Node.js

A Node.js conversion of the legacy COBOL Account Management System. This application provides a terminal-based interface for managing account balances with credit and debit operations.

## Prerequisites

- Node.js >= 18
- npm >= 9
- Python 3 with `python-pptx` (for presentation generation only)

## Quick Start

```bash
cd node-app

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
node-app/
├── src/
│   ├── main.js            # CLI entry point (readline-based menu)
│   ├── operations.js      # Business logic (credit, debit, getBalance)
│   └── data.js            # Data persistence layer (read/write balance)
├── tests/
│   ├── data.test.js       # Unit tests for data module
│   ├── operations.test.js # Unit tests for operations module
│   └── integration.test.js# Integration tests (end-to-end flows)
├── scripts/
│   ├── deploy.sh          # Deployment script
│   └── generate_presentation.py  # Migration PowerPoint generator
├── docs/
│   ├── MIGRATION.md       # COBOL-to-Node.js migration guide
│   └── API.md             # Module API reference
├── package.json
├── .eslintrc.json
└── README.md
```

## Usage

Start the application and follow the interactive menu:

```
--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4):
```

- **Option 1**: Display the current account balance
- **Option 2**: Add funds to the account
- **Option 3**: Withdraw funds (with insufficient funds protection)
- **Option 4**: Exit the application

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

The test suite covers all 7 test cases from `TESTPLAN.md`:

| Test Case | Description |
|-----------|-------------|
| TC-1.1 | View current balance |
| TC-2.1 | Credit with valid amount |
| TC-2.2 | Credit with zero amount |
| TC-3.1 | Debit with valid amount |
| TC-3.2 | Debit exceeding balance (insufficient funds) |
| TC-3.3 | Debit with zero amount |
| TC-4.1 | Exit application |

## Deployment

```bash
# Deploy to development (default)
./scripts/deploy.sh

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

The deployment script validates the environment, installs dependencies, runs lint and tests, then starts the application.

## Generating the Migration Presentation

```bash
pip install python-pptx
python3 scripts/generate_presentation.py
```

This generates `COBOL_to_NodeJS_Migration.pptx` with an 8-slide overview of the migration including speaker notes.

## License

MIT
