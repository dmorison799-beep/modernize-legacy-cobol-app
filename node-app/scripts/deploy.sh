#!/usr/bin/env bash
#
# deploy.sh — Build, test, and deploy the Node.js Account Management System.
#
# Usage:
#   ./scripts/deploy.sh [development|staging|production]
#
# Environment variables (optional overrides):
#   DOCKER_REGISTRY   — Docker registry URL  (default: localhost:5000)
#   IMAGE_NAME        — Docker image name    (default: node-accounting-app)
#   IMAGE_TAG         — Docker image tag     (default: git short SHA)
#   SKIP_TESTS        — Set to "true" to skip test step (not recommended for production)

set -euo pipefail

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

ENVIRONMENT="${1:-development}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-localhost:5000}"
IMAGE_NAME="${IMAGE_NAME:-node-accounting-app}"
IMAGE_TAG="${IMAGE_TAG:-$(git -C "${PROJECT_DIR}" rev-parse --short HEAD 2>/dev/null || echo 'latest')}"
SKIP_TESTS="${SKIP_TESTS:-false}"

FULL_IMAGE="${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
LATEST_IMAGE="${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"

# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()   { echo -e "${BLUE}[deploy]${NC} $*"; }
ok()    { echo -e "${GREEN}[  ok  ]${NC} $*"; }
warn()  { echo -e "${YELLOW}[ warn ]${NC} $*"; }
fail()  { echo -e "${RED}[ FAIL ]${NC} $*"; exit 1; }

# ──────────────────────────────────────────────
# Step 0 — Validate environment argument
# ──────────────────────────────────────────────
log "Starting deployment for environment: ${ENVIRONMENT}"

case "${ENVIRONMENT}" in
  development|staging|production) ;;
  *)
    fail "Invalid environment '${ENVIRONMENT}'. Use: development | staging | production"
    ;;
esac

# ──────────────────────────────────────────────
# Step 1 — Install dependencies
# ──────────────────────────────────────────────
log "Installing dependencies..."
cd "${PROJECT_DIR}"
npm ci --production=false
ok "Dependencies installed."

# ──────────────────────────────────────────────
# Step 2 — Lint
# ──────────────────────────────────────────────
log "Running linter..."
npm run lint
ok "Lint passed."

# ──────────────────────────────────────────────
# Step 3 — Tests
# ──────────────────────────────────────────────
if [ "${SKIP_TESTS}" = "true" ]; then
  warn "Skipping tests (SKIP_TESTS=true). Not recommended for production."
else
  log "Running test suite..."
  npm test
  ok "All tests passed."
fi

# ──────────────────────────────────────────────
# Step 4 — Build Docker image
# ──────────────────────────────────────────────
# Map ENVIRONMENT to a standard NODE_ENV value (only 'development' and
# 'production' are recognized by Node.js libraries like Express).
if [ "${ENVIRONMENT}" = "development" ]; then
  NODE_ENV_VALUE="development"
else
  NODE_ENV_VALUE="production"
fi

log "Building Docker image: ${FULL_IMAGE}"
docker build \
  --build-arg NODE_ENV="${NODE_ENV_VALUE}" \
  --tag "${FULL_IMAGE}" \
  --tag "${LATEST_IMAGE}" \
  "${PROJECT_DIR}"
ok "Docker image built: ${FULL_IMAGE}"

# ──────────────────────────────────────────────
# Step 5 — Push Docker image
# ──────────────────────────────────────────────
if [ "${ENVIRONMENT}" = "development" ]; then
  log "Development mode — skipping image push."
else
  log "Pushing Docker image to ${DOCKER_REGISTRY}..."
  docker push "${FULL_IMAGE}"
  docker push "${LATEST_IMAGE}"
  ok "Image pushed."
fi

# ──────────────────────────────────────────────
# Step 6 — Deploy
# ──────────────────────────────────────────────
deploy_development() {
  log "Running container locally for development..."
  docker rm -f node-accounting-dev 2>/dev/null || true
  docker run -d \
    --name node-accounting-dev \
    --restart unless-stopped \
    -e NODE_ENV=development \
    "${FULL_IMAGE}"
  ok "Development container started: node-accounting-dev"
}

deploy_staging() {
  log "Deploying to staging..."
  # Replace with your staging deployment command (e.g., kubectl, docker-compose, AWS ECS)
  # Example: kubectl set image deployment/accounting accounting="${FULL_IMAGE}" -n staging
  log "  Image: ${FULL_IMAGE}"
  log "  Target: staging namespace"
  warn "Staging deploy placeholder — configure your orchestrator command here."
  ok "Staging deployment initiated."
}

deploy_production() {
  log "Deploying to production..."
  log "  Image: ${FULL_IMAGE}"
  log "  Target: production namespace"
  echo ""
  echo -e "${YELLOW}╔════════════════════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║  PRODUCTION DEPLOYMENT — REVIEW BEFORE CONFIRMING ║${NC}"
  echo -e "${YELLOW}╠════════════════════════════════════════════════════╣${NC}"
  echo -e "${YELLOW}║  Image : ${FULL_IMAGE}${NC}"
  echo -e "${YELLOW}║  Env   : production${NC}"
  echo -e "${YELLOW}╚════════════════════════════════════════════════════╝${NC}"
  echo ""
  read -rp "Type 'yes' to confirm production deployment: " CONFIRM
  if [ "${CONFIRM}" != "yes" ]; then
    fail "Production deployment aborted by user."
  fi
  # Replace with your production deployment command
  # Example: kubectl set image deployment/accounting accounting="${FULL_IMAGE}" -n production
  warn "Production deploy placeholder — configure your orchestrator command here."
  ok "Production deployment initiated."
}

case "${ENVIRONMENT}" in
  development) deploy_development ;;
  staging)     deploy_staging ;;
  production)  deploy_production ;;
esac

# ──────────────────────────────────────────────
# Step 7 — Health check (development only)
# ──────────────────────────────────────────────
if [ "${ENVIRONMENT}" = "development" ]; then
  log "Running health check..."
  sleep 2
  if docker ps --filter "name=node-accounting-dev" --filter "status=running" -q | grep -q .; then
    ok "Container is running."
  else
    warn "Container may not be running. Check: docker logs node-accounting-dev"
  fi
fi

# ──────────────────────────────────────────────
# Summary
# ──────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deployment complete!${NC}"
echo -e "${GREEN}  Environment : ${ENVIRONMENT}${NC}"
echo -e "${GREEN}  Image       : ${FULL_IMAGE}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Useful commands:"
echo "  docker logs node-accounting-dev          # View logs"
echo "  docker exec -it node-accounting-dev sh   # Shell into container"
echo "  docker stop node-accounting-dev           # Stop container"
echo ""
echo "Rollback:"
echo "  docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:<previous-tag>"
echo "  docker rm -f node-accounting-dev"
echo "  docker run -d --name node-accounting-dev ${DOCKER_REGISTRY}/${IMAGE_NAME}:<previous-tag>"
