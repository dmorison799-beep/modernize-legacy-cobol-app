# Account Management System — Node.js

Node.js modernization of the legacy COBOL accounting system. This application preserves the original modular architecture and business logic while bringing it into a modern runtime and toolchain.

## Architecture

The COBOL program's three-file structure maps directly to Node.js modules:

| COBOL Source | Node.js Module | Responsibility |
|---|---|---|
| `main.cob` | `src/main.js` | CLI menu loop and user interaction |
| `operations.cob` | `src/operations.js` | Credit, debit, and view balance logic |
| `data.cob` | `src/data.js` | In-memory balance read/write storage |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed design decisions.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Docker (optional, for containerized deployment)

## Quick Start

```bash
cd node-app
npm install
npm start
```

## Testing

```bash
# Run all tests with coverage
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

Tests are organized into:
- `tests/unit/` — Module-level tests for data and operations
- `tests/integration/` — End-to-end workflow tests

All test cases from [TESTPLAN.md](../TESTPLAN.md) are covered (TC-1.1 through TC-4.1).

## Linting

```bash
npm run lint
npm run lint:fix   # Auto-fix issues
```

## Deployment

### Development
```bash
npm start
```

### Staging (Docker)
```bash
./scripts/deploy.sh staging
```

### Production
```bash
DOCKER_REGISTRY=ghcr.io/your-org ./scripts/deploy.sh production
```

See [scripts/deploy.sh](scripts/deploy.sh) for the full deployment pipeline:
1. Environment validation
2. Dependency installation
3. Linting
4. Testing with coverage
5. Docker image build
6. Registry push (production only)
7. Deployment

## Docker

```bash
# Build
docker build -t account-management-system .

# Run
docker run -it account-management-system
```

## Project Structure

```
node-app/
├── src/
│   ├── main.js              # Entry point — CLI menu
│   ├── operations.js        # Business logic
│   └── data.js              # Data persistence layer
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── scripts/
│   ├── deploy.sh            # Deployment automation
│   └── generate_presentation.py  # PPTX generator
├── docs/
│   ├── ARCHITECTURE.md      # Architecture documentation
│   └── COBOL_to_NodeJS_Migration.pptx  # Migration presentation
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI/CD
├── Dockerfile               # Multi-stage container build
├── .eslintrc.js             # Linting configuration
└── package.json             # Project manifest
```

## License

MIT — see [LICENSE](../LICENSE).
