# Architecture Document

## System Overview

The Node.js Accounting Application is a modernized version of a legacy COBOL accounting system. It provides account management functionality including balance viewing, credits, and debits through both a CLI interface and a REST API.

## Component Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Entry Points                        │
├──────────────────────┬──────────────────────────────┤
│   main.js (CLI)      │      server.js (HTTP API)    │
│   Interactive Menu   │      REST Endpoints          │
└──────────┬───────────┴──────────────┬───────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────────┐
│              operations.js                           │
│         Business Logic Layer                         │
│  ┌───────────┐ ┌───────────┐ ┌────────────────┐   │
│  │viewBalance│ │  credit   │ │     debit      │   │
│  └───────────┘ └───────────┘ └────────────────┘   │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  data.js                             │
│            Data Persistence Layer                    │
│        ┌──────────┐  ┌──────────┐                  │
│        │  read()  │  │ write()  │                  │
│        └──────────┘  └──────────┘                  │
│              In-Memory Balance Store                 │
└─────────────────────────────────────────────────────┘
```

## Module Mapping (COBOL → Node.js)

| COBOL Module | Node.js Module | Responsibility |
|---|---|---|
| `main.cob` (MainProgram) | `src/main.js` (AccountApp) | UI/menu loop |
| `operations.cob` (Operations) | `src/operations.js` (Operations) | Business logic |
| `data.cob` (DataProgram) | `src/data.js` (DataStore) | Data persistence |
| — (new) | `src/server.js` | HTTP REST API |

## Data Flow

### CLI Mode (main.js)

```
User Input → readline → AccountApp.run()
  → switch(choice)
    → Operations.viewBalance() / credit() / debit()
      → DataStore.read() / write()
  → Output to stdout
```

### API Mode (server.js)

```
HTTP Request → server.js route handler
  → Operations.viewBalance() / credit() / debit()
    → DataStore.read() / write()
  → JSON Response
```

## REST API Endpoints

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | `/health` | Health check | — | `{ status, service, version, uptime, timestamp }` |
| GET | `/api/balance` | View balance | — | `{ balance, message }` |
| POST | `/api/credit` | Credit account | `{ amount }` | `{ success, balance, message }` |
| POST | `/api/debit` | Debit account | `{ amount }` | `{ success, balance, message }` |

## Design Decisions

1. **Class-based architecture**: Maps naturally to COBOL program modules; enables dependency injection for testing.
2. **In-memory DataStore**: Preserves COBOL behavior (volatile storage); easily replaceable with a database.
3. **Dual entry points**: CLI for interactive use, HTTP server for containerized deployment.
4. **Zero external runtime dependencies**: Uses only Node.js built-in modules (readline, http, stream).
5. **Separation of concerns**: Data, operations, and UI layers are independent and testable in isolation.

## Testing Architecture

```
tests/
├── unit/
│   ├── data.test.js        → DataStore tests
│   ├── operations.test.js  → Business logic tests (maps to TESTPLAN.md)
│   └── server.test.js      → HTTP API tests
└── integration/
    └── app.test.js         → End-to-end CLI flow tests
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Docker Container            │
│  ┌───────────────────────────┐     │
│  │  Node.js 18 Alpine        │     │
│  │  ┌─────────────────────┐  │     │
│  │  │   server.js          │  │     │
│  │  │   (port 3000)        │  │     │
│  │  └─────────────────────┘  │     │
│  └───────────────────────────┘     │
│         ↕ Health Check              │
│    /health → 200 OK                 │
└─────────────────────────────────────┘
         ↕ Port Mapping
    Host:3000 → Container:3000
```

## Future Enhancements

- Replace in-memory DataStore with PostgreSQL/MongoDB
- Add authentication/authorization middleware
- Add transaction history and audit logging
- Implement multi-account support
- Add WebSocket support for real-time balance updates
