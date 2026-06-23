#!/usr/bin/env bash
# ============================================================
# Deployment Script for Node.js Accounting Application
# Modernized from legacy COBOL accounting system
#
# Usage:
#   ./scripts/deploy.sh <environment> [command]
#
# Environments:
#   development   - Local dev with hot reload, verbose logging
#   staging       - Pre-production with Docker, mirrors prod
#   production    - Production-hardened Docker deployment
#
# Commands:
#   setup         - Install dependencies and prepare environment
#   test          - Run test suite for the environment
#   build         - Build Docker image (staging/production)
#   deploy        - Deploy the application
#   stop          - Stop running services
#   logs          - Tail application logs
#   health        - Check application health
#   rollback      - Rollback to previous version
#   clean         - Remove all containers, images, and artifacts
#   pipeline      - Run full CI/CD pipeline (lint -> test -> build -> deploy)
#
# Examples:
#   ./scripts/deploy.sh development setup
#   ./scripts/deploy.sh staging pipeline
#   ./scripts/deploy.sh production deploy
# ============================================================

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${PROJECT_ROOT}/.." && pwd)"

APP_NAME="node-accounting-app"
HEALTH_PORT="${APP_PORT:-3000}"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
LOG_DIR="${PROJECT_ROOT}/logs"

# ─── Colors ───────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_step()    { echo -e "\n${CYAN}[STEP]${NC}    $1"; }
log_info()    { echo -e "${BLUE}[INFO]${NC}    $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}    $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC}   $1"; }

# ─── Environment Configuration ────────────────────────────────
configure_environment() {
  local env="$1"

  case "$env" in
    development)
      export NODE_ENV="development"
      export LOG_LEVEL="debug"
      export INITIAL_BALANCE="${INITIAL_BALANCE:-1000.00}"
      IMAGE_TAG="${APP_NAME}:dev"
      CONTAINER_NAME="${APP_NAME}-dev"
      COMPOSE_FILE="${REPO_ROOT}/deploy/docker-compose.yml"
      ;;
    staging)
      export NODE_ENV="staging"
      export LOG_LEVEL="info"
      export INITIAL_BALANCE="${INITIAL_BALANCE:-1000.00}"
      IMAGE_TAG="${APP_NAME}:staging-${TIMESTAMP}"
      CONTAINER_NAME="${APP_NAME}-staging"
      COMPOSE_FILE="${REPO_ROOT}/deploy/docker-compose.yml"
      ;;
    production)
      export NODE_ENV="production"
      export LOG_LEVEL="warn"
      export INITIAL_BALANCE="${INITIAL_BALANCE:-1000.00}"
      IMAGE_TAG="${APP_NAME}:${TIMESTAMP}"
      IMAGE_TAG_LATEST="${APP_NAME}:latest"
      CONTAINER_NAME="${APP_NAME}"
      COMPOSE_FILE="${REPO_ROOT}/deploy/docker-compose.yml"
      ;;
    *)
      log_error "Unknown environment: ${env}"
      log_info "Valid environments: development, staging, production"
      exit 1
      ;;
  esac

  log_info "Environment: ${BOLD}${env}${NC}"
  log_info "NODE_ENV=${NODE_ENV}, LOG_LEVEL=${LOG_LEVEL}"
}

# ─── Prerequisite Checks ─────────────────────────────────────
check_prerequisites() {
  log_step "Checking prerequisites..."

  local missing=0

  if ! command -v node &>/dev/null; then
    log_error "Node.js is not installed."
    missing=1
  else
    log_info "Node.js $(node --version)"
  fi

  if ! command -v npm &>/dev/null; then
    log_error "npm is not installed."
    missing=1
  else
    log_info "npm $(npm --version)"
  fi

  if [ "$ENV" != "development" ]; then
    if ! command -v docker &>/dev/null; then
      log_warn "Docker not installed. Docker commands will be skipped."
    else
      log_info "Docker $(docker --version | awk '{print $3}' | tr -d ',')"
    fi
  fi

  if [ "$missing" -eq 1 ]; then
    log_error "Missing required prerequisites. Install them and retry."
    exit 1
  fi

  log_success "Prerequisites OK"
}

# ─── Setup ────────────────────────────────────────────────────
cmd_setup() {
  log_step "Setting up ${ENV} environment..."

  cd "${PROJECT_ROOT}"

  log_info "Installing dependencies..."
  if [ "$ENV" = "production" ]; then
    npm ci --only=production
  else
    npm ci
  fi

  mkdir -p "${LOG_DIR}"

  log_success "Setup complete for ${ENV}"
}

# ─── Lint ─────────────────────────────────────────────────────
cmd_lint() {
  log_step "Running ESLint..."
  cd "${PROJECT_ROOT}"
  npm run lint
  log_success "Lint passed"
}

# ─── Test ─────────────────────────────────────────────────────
cmd_test() {
  log_step "Running tests for ${ENV}..."
  cd "${PROJECT_ROOT}"

  case "$ENV" in
    development)
      npm test
      ;;
    staging)
      npm test -- --ci
      ;;
    production)
      log_info "Running tests in isolated container..."
      if command -v docker &>/dev/null; then
        docker run --rm \
          -v "${PROJECT_ROOT}:/app" \
          -w /app \
          node:18-alpine \
          sh -c "npm ci && npm test -- --ci"
      else
        npm test -- --ci
      fi
      ;;
  esac

  log_success "All tests passed (${ENV})"
}

# ─── Build ────────────────────────────────────────────────────
cmd_build() {
  log_step "Building Docker image: ${IMAGE_TAG}..."

  if ! command -v docker &>/dev/null; then
    log_error "Docker is required for build. Install Docker first."
    exit 1
  fi

  docker build \
    -t "${IMAGE_TAG}" \
    -f "${REPO_ROOT}/deploy/Dockerfile" \
    --build-arg NODE_ENV="${NODE_ENV}" \
    --label "environment=${ENV}" \
    --label "build-date=${TIMESTAMP}" \
    "${REPO_ROOT}"

  if [ "$ENV" = "production" ] && [ -n "${IMAGE_TAG_LATEST:-}" ]; then
    docker tag "${IMAGE_TAG}" "${IMAGE_TAG_LATEST}"
    log_info "Also tagged as ${IMAGE_TAG_LATEST}"
  fi

  log_success "Image built: ${IMAGE_TAG}"
  docker images "${APP_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

# ─── Deploy ───────────────────────────────────────────────────
cmd_deploy() {
  log_step "Deploying to ${ENV}..."

  case "$ENV" in
    development)
      deploy_development
      ;;
    staging)
      deploy_docker
      ;;
    production)
      deploy_docker
      ;;
  esac
}

deploy_development() {
  log_info "Starting application in development mode..."
  cd "${PROJECT_ROOT}"

  mkdir -p "${LOG_DIR}"

  log_info "Application will start in foreground."
  log_info "Press Ctrl+C to stop."
  echo ""
  node src/main.js
}

deploy_docker() {
  if ! command -v docker &>/dev/null; then
    log_error "Docker is required for ${ENV} deployment."
    exit 1
  fi

  log_info "Starting services with Docker Compose..."

  cd "${REPO_ROOT}/deploy"
  NODE_ENV="${NODE_ENV}" \
  INITIAL_BALANCE="${INITIAL_BALANCE}" \
  docker compose up -d --build

  log_success "Application deployed to ${ENV}"
  log_info "Health endpoint: http://localhost:${HEALTH_PORT}/health"

  sleep 3
  cmd_health || log_warn "Health check not yet responding. Retry in a few seconds."
}

# ─── Stop ─────────────────────────────────────────────────────
cmd_stop() {
  log_step "Stopping ${ENV} services..."

  if [ "$ENV" = "development" ]; then
    log_info "Development mode runs in foreground. Use Ctrl+C."
    return
  fi

  cd "${REPO_ROOT}/deploy"
  docker compose down
  log_success "Services stopped"
}

# ─── Logs ─────────────────────────────────────────────────────
cmd_logs() {
  log_step "Tailing logs for ${ENV}..."

  if [ "$ENV" = "development" ]; then
    if [ -d "${LOG_DIR}" ]; then
      tail -f "${LOG_DIR}"/*.log 2>/dev/null || log_info "No log files found."
    fi
    return
  fi

  cd "${REPO_ROOT}/deploy"
  docker compose logs -f
}

# ─── Health Check ─────────────────────────────────────────────
cmd_health() {
  log_step "Checking application health..."

  local url="http://localhost:${HEALTH_PORT}/health"
  local response
  response=$(curl -s -o /dev/null -w "%{http_code}" "${url}" 2>/dev/null || echo "000")

  if [ "$response" = "200" ]; then
    log_success "Application is healthy (HTTP 200)"
    curl -s "${url}" | python3 -m json.tool 2>/dev/null || curl -s "${url}"
    return 0
  else
    log_error "Application is not responding (HTTP ${response})"
    return 1
  fi
}

# ─── Rollback ─────────────────────────────────────────────────
cmd_rollback() {
  log_step "Rolling back ${ENV}..."

  if [ "$ENV" = "development" ]; then
    log_warn "Rollback is not applicable for development."
    return
  fi

  local previous_image
  previous_image=$(docker images "${APP_NAME}" --format "{{.Repository}}:{{.Tag}}" | sed -n '2p')

  if [ -z "$previous_image" ]; then
    log_error "No previous image found for rollback."
    exit 1
  fi

  log_info "Rolling back to: ${previous_image}"

  cd "${REPO_ROOT}/deploy"
  docker compose down

  docker tag "${previous_image}" "${APP_NAME}:latest"
  docker compose up -d

  log_success "Rolled back to ${previous_image}"
}

# ─── Clean ────────────────────────────────────────────────────
cmd_clean() {
  log_step "Cleaning up ${ENV} artifacts..."

  if command -v docker &>/dev/null; then
    cd "${REPO_ROOT}/deploy"
    docker compose down --rmi all --volumes 2>/dev/null || true
    docker images "${APP_NAME}" -q | xargs -r docker rmi -f 2>/dev/null || true
    log_info "Docker artifacts removed"
  fi

  rm -rf "${PROJECT_ROOT}/coverage"
  rm -rf "${LOG_DIR}"
  log_info "Local artifacts removed"

  log_success "Cleanup complete"
}

# ─── Full Pipeline ────────────────────────────────────────────
cmd_pipeline() {
  log_step "Running full CI/CD pipeline for ${ENV}..."
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Pipeline: ${BOLD}${ENV}${NC}"
  echo "  Stages:  setup -> lint -> test -> build -> deploy"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  cmd_setup
  echo ""
  cmd_lint
  echo ""
  cmd_test
  echo ""

  if [ "$ENV" != "development" ]; then
    cmd_build
    echo ""
  fi

  cmd_deploy
  echo ""

  if [ "$ENV" != "development" ]; then
    cmd_health || true
  fi

  echo ""
  log_success "Pipeline complete for ${ENV}!"
}

# ─── Usage ────────────────────────────────────────────────────
usage() {
  echo ""
  echo -e "${BOLD}Node.js Accounting App - Deployment Script${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo -e "Usage: ${CYAN}$0 <environment> [command]${NC}"
  echo ""
  echo "Environments:"
  echo "  development    Local development mode"
  echo "  staging        Pre-production (Docker)"
  echo "  production     Production deployment (Docker)"
  echo ""
  echo "Commands:"
  echo "  setup          Install dependencies"
  echo "  lint           Run ESLint"
  echo "  test           Run test suite"
  echo "  build          Build Docker image"
  echo "  deploy         Deploy the application"
  echo "  stop           Stop running services"
  echo "  logs           Tail application logs"
  echo "  health         Check application health"
  echo "  rollback       Rollback to previous version"
  echo "  clean          Remove artifacts"
  echo "  pipeline       Full CI/CD: setup -> lint -> test -> build -> deploy"
  echo ""
  echo "Examples:"
  echo "  $0 development setup     # Install deps for local dev"
  echo "  $0 development deploy    # Run app locally"
  echo "  $0 staging pipeline      # Full staging pipeline"
  echo "  $0 production pipeline   # Full production pipeline"
  echo "  $0 production rollback   # Rollback production"
  echo ""
}

# ─── Main ─────────────────────────────────────────────────────
main() {
  local env="${1:-}"
  local command="${2:-help}"

  if [ -z "$env" ] || [ "$env" = "help" ] || [ "$env" = "--help" ]; then
    usage
    exit 0
  fi

  ENV="$env"
  configure_environment "$ENV"
  check_prerequisites

  case "$command" in
    setup)    cmd_setup ;;
    lint)     cmd_lint ;;
    test)     cmd_test ;;
    build)    cmd_build ;;
    deploy)   cmd_deploy ;;
    stop)     cmd_stop ;;
    logs)     cmd_logs ;;
    health)   cmd_health ;;
    rollback) cmd_rollback ;;
    clean)    cmd_clean ;;
    pipeline) cmd_pipeline ;;
    help|--help)
      usage
      ;;
    *)
      log_error "Unknown command: ${command}"
      usage
      exit 1
      ;;
  esac
}

main "$@"
