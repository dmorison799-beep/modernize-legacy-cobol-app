# COBOL to Node.js Migration Process

This document describes the step-by-step process used to convert the legacy COBOL accounting system to a modern Node.js application.

## Migration Overview

```
Phase 1          Phase 2          Phase 3          Phase 4          Phase 5
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Analyze  │───►│ Test Plan│───►│ Convert  │───►│ Validate │───►│ Deploy   │
│ COBOL    │    │ & Map    │    │ to JS    │    │ & Test   │    │ & Ship   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## Phase 1: Analyze the COBOL Application

### 1.1 Inventory COBOL Source Files

| File | Program ID | Purpose | Lines |
|------|-----------|---------|-------|
| `main.cob` | MainProgram | CLI menu loop, user I/O | 36 |
| `operations.cob` | Operations | Business logic (credit, debit, view) | 40 |
| `data.cob` | DataProgram | In-memory balance storage | 23 |

### 1.2 Map Data Structures

| COBOL Declaration | Meaning | JS Equivalent |
|------------------|---------|--------------|
| `PIC 9(6)V99` | 6-digit integer + 2 decimal | `number` (IEEE 754 float) |
| `PIC X(6)` | 6-char string | `string` |
| `PIC 9 VALUE 0` | Single digit, default 0 | `string` (from readline) |
| `PIC X(3) VALUE 'YES'` | 3-char flag | `boolean` |

### 1.3 Identify Call Graph

```
MainProgram
  └─► Operations ('TOTAL', 'CREDIT', 'DEBIT')
        └─► DataProgram ('READ', 'WRITE')
```

**Key insight:** COBOL `CALL` with `USING` maps directly to JavaScript method calls with dependency injection.

---

## Phase 2: Create Test Plan Before Conversion

Before writing any Node.js code, we documented every business rule as a testable case. This ensures no logic is lost during conversion.

### Test Cases Derived from COBOL Logic

| ID | Rule | COBOL Source Line | Assertion |
|----|------|-------------------|-----------|
| TC-1.1 | View balance | `operations.cob:17-18` | Returns stored balance |
| TC-2.1 | Credit valid amount | `operations.cob:23-26` | Balance increases by amount |
| TC-2.2 | Credit zero | `operations.cob:23-26` | Balance unchanged |
| TC-3.1 | Debit valid amount | `operations.cob:31-35` | Balance decreases by amount |
| TC-3.2 | Debit > balance | `operations.cob:32,37` | "Insufficient funds", balance unchanged |
| TC-3.3 | Debit zero | `operations.cob:31-35` | Balance unchanged |
| TC-4.1 | Exit | `main.cob:30` | Sets CONTINUE-FLAG = 'NO', exits cleanly |

---

## Phase 3: Convert COBOL to Node.js

### 3.1 Data Layer (`data.cob` → `src/data.js`)

**COBOL pattern:** Subprogram with READ/WRITE operations on `STORAGE-BALANCE`.

```cobol
IF OPERATION-TYPE = 'READ'
    MOVE STORAGE-BALANCE TO BALANCE
ELSE IF OPERATION-TYPE = 'WRITE'
    MOVE BALANCE TO STORAGE-BALANCE
```

**Node.js equivalent:** Class with `read()` and `write()` methods.

```javascript
class DataStore {
  constructor(initialBalance = 1000.00) {
    this.balance = initialBalance;
  }
  read()              { return this.balance; }
  write(newBalance)   { this.balance = newBalance; }
}
```

**Decisions:**
- Eliminated string-based operation dispatch (`'READ'`/`'WRITE'`) in favor of named methods
- Constructor parameter replaces `VALUE 1000.00` compile-time initialization
- `reset()` method added for testing convenience

### 3.2 Business Logic (`operations.cob` → `src/operations.js`)

**COBOL pattern:** Single entry point dispatching on `PASSED-OPERATION`.

```cobol
CALL 'DataProgram' USING 'READ', FINAL-BALANCE
ADD AMOUNT TO FINAL-BALANCE
CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
```

**Node.js equivalent:** Separate methods with structured return values.

```javascript
credit(amount) {
  const currentBalance = this.dataStore.read();
  const newBalance = currentBalance + parsedAmount;
  this.dataStore.write(newBalance);
  return { success: true, balance: newBalance, message: '...' };
}
```

**Decisions:**
- Dependency injection (`constructor(dataStore)`) replaces `CALL 'DataProgram'`
- Each operation returns a result object instead of using `DISPLAY` directly
- Input validation added (COBOL relied on `PIC 9(6)V99` type constraints)
- Separation of concerns: operations don't do I/O directly

### 3.3 Main Program (`main.cob` → `src/main.js`)

**COBOL pattern:** `PERFORM UNTIL` loop with `EVALUATE` dispatch.

**Node.js equivalent:** `async` menu loop with `readline` and `switch`.

**Decisions:**
- `readline` interface for CLI I/O (Node.js standard)
- `async/await` for non-blocking I/O
- Configurable via constructor options (initial balance, streams)
- Testable: accepts custom input/output streams for integration testing

---

## Phase 4: Validate with Tests

### 4.1 Unit Tests

Using Jest, every test case from Phase 2 is implemented:

```bash
npm test -- tests/unit/
```

- `tests/unit/data.test.js` — DataStore read/write/reset
- `tests/unit/operations.test.js` — All TC-1.x through TC-3.x cases

### 4.2 Integration Tests

End-to-end tests simulate user interaction through streams:

```bash
npm test -- tests/integration/
```

- `tests/integration/accounting.test.js` — Full menu workflows, exit behavior

### 4.3 Coverage

```bash
npm test  # Runs with --coverage by default
```

Target: 100% of business logic lines covered.

---

## Phase 5: Deploy

### 5.1 Environment-Specific Deployment

```bash
# Development: direct Node.js execution
./scripts/deploy.sh development deploy

# Staging: Docker container, mirrors production
./scripts/deploy.sh staging pipeline

# Production: Docker with health checks, rollback support
./scripts/deploy.sh production pipeline
```

### 5.2 Docker Architecture

```
┌─────────────────────────────────────────┐
│           Docker Container              │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  main.js    │  │ healthcheck.js  │  │
│  │  (CLI App)  │  │ (HTTP :3000)    │  │
│  └──────┬──────┘  └─────────────────┘  │
│  ┌──────┴──────┐                        │
│  │operations.js│                        │
│  └──────┬──────┘                        │
│  ┌──────┴──────┐                        │
│  │  data.js    │                        │
│  └─────────────┘                        │
└─────────────────────────────────────────┘
```

### 5.3 CI/CD Pipeline

The deployment script provides a full pipeline:

```
setup → lint → test → build → deploy → health check
```

Each stage gates the next — failures stop the pipeline immediately.

---

## Key Modernization Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Class-based architecture | Maps naturally to COBOL program modules |
| Dependency injection | Enables unit testing without I/O |
| In-memory DataStore | Preserves COBOL behavior; swappable for DB later |
| Structured return values | Separates business logic from presentation |
| Jest for testing | Industry standard; built-in coverage reporting |
| ESLint for quality | Catches errors early; enforces style consistency |
| Docker for deployment | Portable, reproducible, cloud-agnostic |
| Multi-environment deploy script | Supports dev/staging/prod workflows |

---

## Future Enhancements

1. **Database persistence** — Replace in-memory DataStore with PostgreSQL/MongoDB
2. **REST API** — Add Express.js layer for web/mobile access
3. **Authentication** — User accounts with JWT tokens
4. **Transaction history** — Audit log with timestamps
5. **Multi-currency** — Support multiple account currencies
6. **CI/CD pipeline** — GitHub Actions for automated testing and deployment
