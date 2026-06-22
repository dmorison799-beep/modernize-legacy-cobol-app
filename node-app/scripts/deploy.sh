#!/usr/bin/env bash
#
# deploy.sh - Deployment script for the Account Management System
#
# This script handles the full deployment lifecycle:
#   1. Environment validation
#   2. Dependency installation
#   3. Running tests
#   4. Building Docker image
#   5. Pushing to container registry
#   6. Deploying to target environment
#
# Usage:
#   ./scripts/deploy.sh [environment]
#
# Environments: development | staging | production
#
# Environment Variables (required for production):
#   DOCKER_REGISTRY  - Container registry URL (e.g., ghcr.io/org)
#   DEPLOY_TAG       - Image tag (defaults to git SHA)
#   NODE_ENV         - Runtime environment
#
set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────

APP_NAME="account-management-system"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENVIRONMENT="${1:-development}"
DEPLOY_TAG="${DEPLOY_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-local}"
IMAGE_NAME="${DOCKER_REGISTRY}/${APP_NAME}:${DEPLOY_TAG}"

# ─── Color output helpers ─────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ─── Step 1: Validate environment ────────────────────────────────────────────

validate_environment() {
  log_info "Validating environment: ${ENVIRONMENT}"

  case "$ENVIRONMENT" in
    development|staging|production) ;;
    *)
      log_error "Invalid environment: ${ENVIRONMENT}"
      log_error "Usage: $0 [development|staging|production]"
      exit 1
      ;;
  esac

  # Check Node.js
  if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js 18+."
    exit 1
  fi

  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js 18+ is required. Found: $(node -v)"
    exit 1
  fi
  log_ok "Node.js $(node -v) detected"

  # Check npm
  if ! command -v npm &> /dev/null; then
    log_error "npm is not installed."
    exit 1
  fi
  log_ok "npm $(npm -v) detected"

  # Check Docker (required for staging/production)
  if [[ "$ENVIRONMENT" != "development" ]]; then
    if ! command -v docker &> /dev/null; then
      log_error "Docker is required for ${ENVIRONMENT} deployment."
      exit 1
    fi
    log_ok "Docker $(docker --version | awk '{print $3}') detected"
  fi

  # Validate production-specific env vars
  if [[ "$ENVIRONMENT" == "production" ]]; then
    if [[ -z "${DOCKER_REGISTRY:-}" || "$DOCKER_REGISTRY" == "local" ]]; then
      log_error "DOCKER_REGISTRY must be set for production deployment."
      exit 1
    fi
  fi

  log_ok "Environment validation passed"
}

# ─── Step 2: Install dependencies ────────────────────────────────────────────

install_dependencies() {
  log_info "Installing dependencies..."
  cd "$PROJECT_DIR"

  if [[ "$ENVIRONMENT" == "production" ]]; then
    npm ci --only=production
  else
    npm ci
  fi

  log_ok "Dependencies installed"
}

# ─── Step 3: Run linter ──────────────────────────────────────────────────────

run_linter() {
  if [[ "$ENVIRONMENT" == "production" ]]; then
    log_info "Skipping lint in production (devDependencies not installed)"
    return 0
  fi

  log_info "Running ESLint..."
  cd "$PROJECT_DIR"
  npm run lint

  log_ok "Linting passed"
}

# ─── Step 4: Run tests ───────────────────────────────────────────────────────

run_tests() {
  if [[ "$ENVIRONMENT" == "production" ]]; then
    log_info "Skipping tests in production (devDependencies not installed)"
    return 0
  fi

  log_info "Running test suite..."
  cd "$PROJECT_DIR"
  npm test

  log_ok "All tests passed"
}

# ─── Step 5: Build Docker image ──────────────────────────────────────────────

build_docker_image() {
  if [[ "$ENVIRONMENT" == "development" ]]; then
    log_info "Skipping Docker build for development environment"
    return 0
  fi

  log_info "Building Docker image: ${IMAGE_NAME}"
  cd "$PROJECT_DIR"
  docker build -t "$IMAGE_NAME" .
  docker tag "$IMAGE_NAME" "${DOCKER_REGISTRY}/${APP_NAME}:latest"

  log_ok "Docker image built: ${IMAGE_NAME}"
}

# ─── Step 6: Push to container registry ───────────────────────────────────────

push_to_registry() {
  if [[ "$ENVIRONMENT" != "production" ]]; then
    log_info "Skipping registry push for ${ENVIRONMENT} environment"
    return 0
  fi

  log_info "Pushing image to registry: ${IMAGE_NAME}"
  docker push "$IMAGE_NAME"
  docker push "${DOCKER_REGISTRY}/${APP_NAME}:latest"

  log_ok "Image pushed to registry"
}

# ─── Step 7: Deploy to environment ───────────────────────────────────────────

deploy() {
  log_info "Deploying to ${ENVIRONMENT}..."

  case "$ENVIRONMENT" in
    development)
      log_info "Starting application locally..."
      cd "$PROJECT_DIR"
      echo ""
      log_ok "Development deployment complete"
      log_info "Run 'npm start' to launch the application"
      ;;
    staging)
      log_info "Deploying Docker container for staging..."
      docker stop "${APP_NAME}-staging" 2>/dev/null || true
      docker rm "${APP_NAME}-staging" 2>/dev/null || true
      docker run -d \
        --name "${APP_NAME}-staging" \
        --restart unless-stopped \
        -e NODE_ENV=staging \
        "$IMAGE_NAME"
      log_ok "Staging deployment complete"
      log_info "Container: ${APP_NAME}-staging"
      ;;
    production)
      log_info "Deploying to production..."
      log_warn "Production deployment requires manual approval."
      log_info "Image available at: ${IMAGE_NAME}"
      log_info "Steps to deploy:"
      log_info "  1. Verify staging tests passed"
      log_info "  2. Run: docker pull ${IMAGE_NAME}"
      log_info "  3. Update production container/service"
      log_info "  4. Verify health check endpoint"
      log_ok "Production deployment artifacts ready"
      ;;
  esac
}

# ─── Main ─────────────────────────────────────────────────────────────────────

main() {
  echo ""
  echo "============================================"
  echo "  Account Management System - Deployment"
  echo "  Environment: ${ENVIRONMENT}"
  echo "  Tag: ${DEPLOY_TAG}"
  echo "============================================"
  echo ""

  validate_environment
  install_dependencies
  run_linter
  run_tests
  build_docker_image
  push_to_registry
  deploy

  echo ""
  echo "============================================"
  log_ok "Deployment pipeline complete!"
  echo "============================================"
}

main "$@"
