# COBOL to Node.js Migration Guide

## Overview

This document describes the migration of the Account Management System from COBOL to Node.js, including architecture mapping, data type conversions, and design decisions.

## Architecture Mapping

| COBOL Component | Node.js Component | Purpose |
|----------------|-------------------|---------|
| `main.cob` (MainProgram) | `src/main.js` | CLI entry point, menu loop |
| `operations.cob` (Operations) | `src/operations.js` | Business logic |
| `data.cob` (DataProgram) | `src/data.js` | Data persistence |

## Module Communication

### COBOL: CALL/GOBACK Pattern
```cobol
CALL 'Operations' USING 'CREDIT'
CALL 'DataProgram' USING 'READ', FINAL-BALANCE
```

### Node.js: CommonJS Modules
```javascript
const operations = require('./operations');
const result = operations.credit(amount);
```

The COBOL `CALL` statement with `USING` clause maps to function calls on imported modules. The `GOBACK` statement maps to `return`.

## Data Type Conversions

| COBOL Type | Node.js Type | Notes |
|-----------|-------------|-------|
| `PIC 9(6)V99` | `Number` | Financial values with 2-decimal precision via `toFixed(2)` |
| `PIC X(6)` | `String` | Operation type identifiers |
| `PIC X(3)` | `Boolean` | Continue flag (`'YES'`/`'NO'` -> `true`/`false`) |
| `PIC 9` | `String` | User menu choice |

## Key Design Decisions

### 1. In-Memory Data Persistence
The COBOL application stores balance in `WORKING-STORAGE`, which persists only for the duration of the program. The Node.js version uses a module-level variable, providing identical behavior.

### 2. Financial Precision
COBOL's `PIC 9(6)V99` provides fixed-point decimal with exactly 2 decimal places. JavaScript's `Number` type is IEEE 754 double-precision floating point. We use `parseFloat(value.toFixed(2))` to maintain 2-decimal precision, which is sufficient for the value range used in this application.

### 3. Input Validation
The Node.js version adds input validation (NaN and negative number checks) that the COBOL version handles implicitly through its `PIC` data type definitions.

### 4. Error Handling
COBOL's insufficient funds check (`IF FINAL-BALANCE >= AMOUNT`) is preserved as-is. The Node.js version returns structured result objects with `success` and `message` fields instead of using DISPLAY statements directly.

### 5. Interactive I/O
COBOL's `DISPLAY`/`ACCEPT` pattern maps to Node.js `readline` with `console.log` for output and `rl.question` for input prompts.

## Control Flow Mapping

### COBOL Menu Loop
```cobol
PERFORM UNTIL CONTINUE-FLAG = 'NO'
    EVALUATE USER-CHOICE
        WHEN 1 CALL 'Operations' USING 'TOTAL '
        WHEN 2 CALL 'Operations' USING 'CREDIT'
        WHEN 3 CALL 'Operations' USING 'DEBIT '
        WHEN 4 MOVE 'NO' TO CONTINUE-FLAG
    END-EVALUATE
END-PERFORM
```

### Node.js Menu Loop
```javascript
while (running) {
    const choice = await prompt('Enter your choice (1-4): ');
    switch (choice) {
        case '1': await handleViewBalance(); break;
        case '2': await handleCredit(); break;
        case '3': await handleDebit(); break;
        case '4': running = false; break;
    }
}
```

## Testing Approach

The original `TESTPLAN.md` defines 7 test cases. All are implemented as automated Jest tests:

- **Unit tests** verify individual modules (data layer, operations) in isolation
- **Integration tests** verify end-to-end flows combining multiple modules

## Files Not Migrated

- `.devcontainer/` - Development environment configuration (retained for COBOL reference)
- `.vscode/` - Editor settings (retained)
- `images/` - Documentation images (retained)
