# COBOL to Node.js Migration Guide

## Overview

This document details how the legacy COBOL accounting system was converted to a modern Node.js application, mapping each COBOL construct to its JavaScript equivalent.

## Architecture Mapping

| COBOL Component | Node.js Equivalent | Purpose |
|----------------|-------------------|---------|
| `main.cob` (MainProgram) | `src/main.js` (AccountApp class) | User interface and menu loop |
| `operations.cob` (Operations) | `src/operations.js` (Operations class) | Business logic (credit, debit, view) |
| `data.cob` (DataProgram) | `src/data.js` (DataStore class) | Data persistence layer |

## Detailed Code Mapping

### 1. Data Types

| COBOL | Node.js | Notes |
|-------|---------|-------|
| `PIC 9(6)V99` | `number` | JavaScript uses 64-bit floating-point; `toFixed(2)` for display |
| `PIC X(6)` | `string` | String operations handled natively |
| `PIC 9` | `string` (parsed to `number`) | User input is always a string initially |
| `PIC X(3) VALUE 'YES'` | `let continueFlag = true` | Boolean flag replaces string comparison |

### 2. Program Structure

#### COBOL: IDENTIFICATION/DATA/PROCEDURE DIVISIONS
```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. Operations.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 AMOUNT PIC 9(6)V99.

PROCEDURE DIVISION.
```

#### Node.js: Class with constructor and methods
```javascript
class Operations {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }
  // methods replace PROCEDURE DIVISION paragraphs
}
```

### 3. Subprogram Calls

#### COBOL: CALL statement
```cobol
CALL 'DataProgram' USING 'READ', FINAL-BALANCE
CALL 'Operations' USING 'CREDIT'
```

#### Node.js: Method calls on injected dependencies
```javascript
const balance = this.dataStore.read();
operations.credit(amount);
```

### 4. Control Flow

#### COBOL: PERFORM UNTIL / EVALUATE
```cobol
PERFORM UNTIL CONTINUE-FLAG = 'NO'
    EVALUATE USER-CHOICE
        WHEN 1
            CALL 'Operations' USING 'TOTAL '
        WHEN OTHER
            DISPLAY "Invalid choice"
    END-EVALUATE
END-PERFORM
```

#### Node.js: while loop / switch statement
```javascript
while (continueFlag) {
  switch (choice) {
    case '1':
      operations.viewBalance();
      break;
    default:
      console.log('Invalid choice');
  }
}
```

### 5. I/O Operations

#### COBOL: DISPLAY / ACCEPT
```cobol
DISPLAY "Enter credit amount: "
ACCEPT AMOUNT
```

#### Node.js: readline interface
```javascript
const amount = await this.ask(rl, 'Enter credit amount: ');
```

### 6. Conditional Logic

#### COBOL: IF/ELSE
```cobol
IF FINAL-BALANCE >= AMOUNT
    SUBTRACT AMOUNT FROM FINAL-BALANCE
ELSE
    DISPLAY "Insufficient funds for this debit."
END-IF
```

#### Node.js: if/else with early return
```javascript
if (currentBalance >= amount) {
  const newBalance = currentBalance - amount;
  this.dataStore.write(newBalance);
  return { success: true, balance: newBalance, message: '...' };
} else {
  return { success: false, balance: currentBalance, message: 'Insufficient funds...' };
}
```

### 7. Data Persistence Pattern

#### COBOL: Read-Modify-Write via subprogram calls
```cobol
CALL 'DataProgram' USING 'READ', FINAL-BALANCE
ADD AMOUNT TO FINAL-BALANCE
CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
```

#### Node.js: Direct method calls on DataStore
```javascript
const currentBalance = this.dataStore.read();
const newBalance = currentBalance + amount;
this.dataStore.write(newBalance);
```

## Key Modernization Decisions

| Decision | Rationale |
|----------|-----------|
| Class-based architecture | Maps naturally to COBOL program modules; enables dependency injection for testing |
| In-memory DataStore | Preserves COBOL behavior; easily replaceable with database in future |
| Async readline for I/O | Node.js standard for CLI apps; non-blocking |
| Jest for testing | Industry standard; built-in coverage; maps 1:1 to TESTPLAN.md |
| Docker for deployment | Portable, reproducible, cloud-agnostic |
| ESLint for code quality | Catches errors early; enforces consistency |

## Migration Verification

All test cases from `TESTPLAN.md` are implemented in the Jest test suite:

| Test Case | COBOL Behavior | Node.js Test File |
|-----------|---------------|-------------------|
| TC-1.1 | View balance displays 1000.00 | `tests/unit/operations.test.js` |
| TC-2.1 | Credit adds to balance | `tests/unit/operations.test.js` |
| TC-2.2 | Zero credit leaves balance unchanged | `tests/unit/operations.test.js` |
| TC-3.1 | Valid debit subtracts from balance | `tests/unit/operations.test.js` |
| TC-3.2 | Overdraft prevented with message | `tests/unit/operations.test.js` |
| TC-3.3 | Zero debit leaves balance unchanged | `tests/unit/operations.test.js` |
| TC-4.1 | Exit terminates gracefully | `tests/integration/accounting.test.js` |

## Future Enhancements

1. **Database persistence** - Replace in-memory DataStore with PostgreSQL/MongoDB
2. **REST API** - Add Express.js layer for web access
3. **Authentication** - Add user accounts and JWT tokens
4. **Transaction history** - Log all operations with timestamps
5. **Multi-currency** - Support multiple account currencies
