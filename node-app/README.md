# Node.js Accounting Application

A modern Node.js implementation of the legacy COBOL accounting system, providing identical business logic with improved maintainability, testability, and deployment options.

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

## Architecture

```
src/
├── main.js          # CLI interface - menu loop and user interaction
├── operations.js    # Business logic - credit, debit, view balance
└── data.js          # Data layer - in-memory balance storage
```

### Module Responsibilities

| Module | COBOL Equivalent | Responsibility |
|--------|-----------------|---------------|
| `main.js` | `main.cob` | User interface, menu display, input handling |
| `operations.js` | `operations.cob` | Business logic: credit, debit, view balance |
| `data.js` | `data.cob` | Data persistence (in-memory store) |

## Usage

The application presents an interactive CLI menu:

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

### Operations

- **View Balance**: Displays the current account balance
- **Credit Account**: Adds a specified amount to the balance
- **Debit Account**: Subtracts a specified amount (with insufficient funds protection)
- **Exit**: Terminates the application gracefully

## API Reference

### DataStore

```javascript
const DataStore = require('./src/data');
const store = new DataStore(1000.00); // Initial balance

store.read();         // Returns current balance
store.write(1500.00); // Updates balance
```

### Operations

```javascript
const Operations = require('./src/operations');
const ops = new Operations(store);

ops.viewBalance();   // { balance: 1000, message: "Current balance: 1000.00" }
ops.credit(200);     // { balance: 1200, message: "Amount credited. New balance: 1200.00" }
ops.debit(50);       // { success: true, balance: 1150, message: "Amount debited..." }
ops.debit(9999);     // { success: false, balance: 1150, message: "Insufficient funds..." }
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

### Test Coverage

Tests are organized by the TESTPLAN.md specification:

| Test Case | Description | Type |
|-----------|-------------|------|
| TC-1.1 | View current balance | Unit |
| TC-2.1 | Credit with valid amount | Unit |
| TC-2.2 | Credit with zero amount | Unit |
| TC-3.1 | Debit with valid amount | Unit |
| TC-3.2 | Debit exceeding balance | Unit |
| TC-3.3 | Debit with zero amount | Unit |
| TC-4.1 | Exit application | Integration |

## Development

```bash
# Install dev dependencies
npm install

# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

## Deployment

See the [`deploy/`](../deploy/) directory for Docker and cloud deployment instructions.

## License

MIT
