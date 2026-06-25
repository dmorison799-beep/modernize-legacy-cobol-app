#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
  echo "Usage: $0 [development|staging|production]"
  echo ""
  echo "Deploy the Account Management System to the specified environment."
  echo ""
  echo "Environments:"
  echo "  development  - Local development deployment (default)"
  echo "  staging      - Staging environment deployment"
  echo "  production   - Production environment deployment"
  exit 1
}

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

ENVIRONMENT="${1:-development}"

case "$ENVIRONMENT" in
  development|staging|production)
    ;;
  -h|--help)
    usage
    ;;
  *)
    echo "Error: Invalid environment '$ENVIRONMENT'"
    usage
    ;;
esac

log "Starting deployment to '$ENVIRONMENT' environment..."
log "Application directory: $APP_DIR"

# Step 1: Validate Node.js is available
log "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js >= 18."
  exit 1
fi
NODE_VERSION=$(node --version)
log "Node.js version: $NODE_VERSION"

# Step 2: Install dependencies
log "Installing dependencies..."
cd "$APP_DIR"
npm ci --production=false 2>&1
log "Dependencies installed successfully."

# Step 3: Run linting
log "Running linter..."
npm run lint 2>&1
log "Linting passed."

# Step 4: Run tests
log "Running tests..."
npm test 2>&1
log "All tests passed."

# Step 5: Environment-specific configuration
log "Configuring for '$ENVIRONMENT' environment..."
export NODE_ENV="$ENVIRONMENT"

case "$ENVIRONMENT" in
  development)
    log "Development mode: Application will run with verbose logging."
    ;;
  staging)
    log "Staging mode: Application configured for pre-production validation."
    ;;
  production)
    log "Production mode: Application configured for production use."
    # In production, only install production dependencies
    npm ci --production 2>&1
    ;;
esac

# Step 6: Start the application
log "Deployment to '$ENVIRONMENT' complete."
log "Starting application..."
exec node "$APP_DIR/src/main.js"
