#!/bin/bash
# ============================================================
# Deployment Script for Node.js Accounting Application
# Modernized from legacy COBOL system
#
# Usage:
#   ./deploy.sh [command]
#
# Commands:
#   build       - Build the Docker image
#   test        - Run tests inside a container
#   start       - Start the application (build + run)
#   stop        - Stop the running application
#   restart     - Restart the application
#   logs        - View application logs
#   health      - Check application health
#   clean       - Remove containers and images
#   deploy-aws  - Deploy to AWS ECS (requires AWS CLI configured)
#   deploy-azure - Deploy to Azure App Service (requires Azure CLI)
#   full        - Full pipeline: lint, test, build, start
# ============================================================

set -euo pipefail

# Configuration
APP_NAME="node-accounting-app"
IMAGE_NAME="${APP_NAME}:latest"
CONTAINER_NAME="${APP_NAME}"
HEALTH_PORT="${APP_PORT:-3000}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        log_warn "Node.js not found locally. Tests will run inside Docker."
    fi
}

# Build the Docker image
build() {
    log_info "Building Docker image: ${IMAGE_NAME}..."
    docker build -t "${IMAGE_NAME}" -f "${PROJECT_ROOT}/deploy/Dockerfile" "${PROJECT_ROOT}"
    log_success "Image built successfully: ${IMAGE_NAME}"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    cd "${PROJECT_ROOT}/node-app"
    
    if command -v node &> /dev/null; then
        npm test
    else
        log_info "Running tests inside Docker container..."
        docker run --rm -v "${PROJECT_ROOT}/node-app:/app" -w /app node:18-alpine sh -c "npm ci && npm test"
    fi
    
    log_success "All tests passed!"
}

# Run linter
run_lint() {
    log_info "Running linter..."
    cd "${PROJECT_ROOT}/node-app"
    
    if command -v node &> /dev/null; then
        npm run lint
    else
        docker run --rm -v "${PROJECT_ROOT}/node-app:/app" -w /app node:18-alpine sh -c "npm ci && npm run lint"
    fi
    
    log_success "Lint check passed!"
}

# Start the application
start() {
    log_info "Starting application..."
    cd "${PROJECT_ROOT}/deploy"
    docker compose up -d --build
    log_success "Application started! Health check available at http://localhost:${HEALTH_PORT}/health"
}

# Stop the application
stop() {
    log_info "Stopping application..."
    cd "${PROJECT_ROOT}/deploy"
    docker compose down
    log_success "Application stopped."
}

# Restart the application
restart() {
    stop
    start
}

# View logs
logs() {
    cd "${PROJECT_ROOT}/deploy"
    docker compose logs -f
}

# Health check
health_check() {
    log_info "Checking application health..."
    
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${HEALTH_PORT}/health" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        log_success "Application is healthy!"
        curl -s "http://localhost:${HEALTH_PORT}/health" | python3 -m json.tool 2>/dev/null || \
            curl -s "http://localhost:${HEALTH_PORT}/health"
    else
        log_error "Application is not responding (HTTP ${response})"
        exit 1
    fi
}

# Clean up
clean() {
    log_info "Cleaning up..."
    cd "${PROJECT_ROOT}/deploy"
    docker compose down --rmi all --volumes 2>/dev/null || true
    docker rmi "${IMAGE_NAME}" 2>/dev/null || true
    log_success "Cleanup complete."
}

# Deploy to AWS ECS
deploy_aws() {
    log_info "Deploying to AWS ECS..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        log_info "Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi

    local AWS_REGION="${AWS_REGION:-us-east-1}"
    local ECR_REPO="${ECR_REPO:-${APP_NAME}}"
    local ECS_CLUSTER="${ECS_CLUSTER:-${APP_NAME}-cluster}"
    local ECS_SERVICE="${ECS_SERVICE:-${APP_NAME}-service}"

    # Get AWS account ID
    local ACCOUNT_ID
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    local ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"

    log_info "Authenticating with ECR..."
    aws ecr get-login-password --region "${AWS_REGION}" | \
        docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    log_info "Creating ECR repository (if not exists)..."
    aws ecr describe-repositories --repository-names "${ECR_REPO}" --region "${AWS_REGION}" 2>/dev/null || \
        aws ecr create-repository --repository-name "${ECR_REPO}" --region "${AWS_REGION}"

    log_info "Tagging and pushing image..."
    docker tag "${IMAGE_NAME}" "${ECR_URI}:latest"
    docker push "${ECR_URI}:latest"

    log_info "Updating ECS service..."
    aws ecs update-service \
        --cluster "${ECS_CLUSTER}" \
        --service "${ECS_SERVICE}" \
        --force-new-deployment \
        --region "${AWS_REGION}"

    log_success "Deployed to AWS ECS! Service: ${ECS_SERVICE}"
}

# Deploy to Azure App Service
deploy_azure() {
    log_info "Deploying to Azure App Service..."
    
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        log_info "Install: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi

    local RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-${APP_NAME}-rg}"
    local APP_SERVICE_PLAN="${AZURE_APP_PLAN:-${APP_NAME}-plan}"
    local WEBAPP_NAME="${AZURE_WEBAPP_NAME:-${APP_NAME}}"
    local LOCATION="${AZURE_LOCATION:-eastus}"

    log_info "Creating resource group..."
    az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}" 2>/dev/null || true

    log_info "Creating App Service plan..."
    az appservice plan create \
        --name "${APP_SERVICE_PLAN}" \
        --resource-group "${RESOURCE_GROUP}" \
        --sku B1 \
        --is-linux 2>/dev/null || true

    log_info "Creating/updating web app..."
    az webapp create \
        --resource-group "${RESOURCE_GROUP}" \
        --plan "${APP_SERVICE_PLAN}" \
        --name "${WEBAPP_NAME}" \
        --runtime "NODE:18-lts" 2>/dev/null || \
    az webapp update \
        --resource-group "${RESOURCE_GROUP}" \
        --name "${WEBAPP_NAME}"

    log_info "Deploying code..."
    cd "${PROJECT_ROOT}/node-app"
    zip -r /tmp/deploy.zip . -x "node_modules/*" "coverage/*" "tests/*"
    az webapp deploy \
        --resource-group "${RESOURCE_GROUP}" \
        --name "${WEBAPP_NAME}" \
        --src-path /tmp/deploy.zip \
        --type zip

    log_success "Deployed to Azure! URL: https://${WEBAPP_NAME}.azurewebsites.net"
}

# Full deployment pipeline
full_pipeline() {
    log_info "Running full deployment pipeline..."
    echo ""
    check_prerequisites
    echo ""
    run_lint
    echo ""
    run_tests
    echo ""
    build
    echo ""
    start
    echo ""
    log_success "Full pipeline complete! Application is running."
    health_check
}

# Main command handler
main() {
    local command="${1:-help}"

    check_prerequisites

    case "$command" in
        build)      build ;;
        test)       run_tests ;;
        lint)       run_lint ;;
        start)      start ;;
        stop)       stop ;;
        restart)    restart ;;
        logs)       logs ;;
        health)     health_check ;;
        clean)      clean ;;
        deploy-aws) build && deploy_aws ;;
        deploy-azure) build && deploy_azure ;;
        full)       full_pipeline ;;
        help|*)
            echo ""
            echo "Node.js Accounting App - Deployment Script"
            echo "==========================================="
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  build        Build the Docker image"
            echo "  test         Run tests"
            echo "  lint         Run linter"
            echo "  start        Start the application (Docker Compose)"
            echo "  stop         Stop the application"
            echo "  restart      Restart the application"
            echo "  logs         View application logs"
            echo "  health       Check application health"
            echo "  clean        Remove containers and images"
            echo "  deploy-aws   Deploy to AWS ECS"
            echo "  deploy-azure Deploy to Azure App Service"
            echo "  full         Full pipeline: lint, test, build, start"
            echo ""
            ;;
    esac
}

main "$@"
