# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose (for containerized deployment)
- AWS CLI (for AWS ECS deployment)
- Azure CLI (for Azure App Service deployment)

## Local Development

### Install Dependencies

```bash
cd node-app
npm install
```

### Run the CLI Application

```bash
npm start
```

### Run the HTTP Server

```bash
npm run server
```

The server starts on port 3000 (configurable via `PORT` or `HEALTH_PORT` env var).

### Run Tests

```bash
npm test          # All tests with coverage
npm run test:unit # Unit tests only
npm run test:integration # Integration tests only
```

### Run Linter

```bash
npm run lint      # Check for issues
npm run lint:fix  # Auto-fix issues
```

## Docker Deployment

### Using the Deploy Script

The `deploy/deploy.sh` script provides a comprehensive deployment pipeline:

```bash
# Full pipeline: lint → test → build → start
./deploy/deploy.sh full

# Individual commands
./deploy/deploy.sh build    # Build Docker image
./deploy/deploy.sh start    # Start with Docker Compose
./deploy/deploy.sh stop     # Stop the application
./deploy/deploy.sh restart  # Restart the application
./deploy/deploy.sh logs     # View logs
./deploy/deploy.sh health   # Check health endpoint
./deploy/deploy.sh clean    # Remove containers/images
```

### Manual Docker Build

```bash
docker build -t node-accounting-app:latest -f deploy/Dockerfile .
docker run -p 3000:3000 node-accounting-app:latest
```

### Docker Compose

```bash
cd deploy
docker compose up -d
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `APP_PORT` | `3000` | Host port mapping |
| `HEALTH_PORT` | `3000` | Server listening port |
| `INITIAL_BALANCE` | `1000.00` | Starting account balance |

Copy `.env.example` to `.env` and customize:

```bash
cp deploy/.env.example deploy/.env
```

## AWS ECS Deployment

### Prerequisites

1. AWS CLI installed and configured (`aws configure`)
2. Docker installed locally
3. ECR repository created (or script will create one)
4. ECS cluster and service configured

### Deploy

```bash
# Set required environment variables
export AWS_REGION=us-east-1
export ECR_REPO=node-accounting-app
export ECS_CLUSTER=node-accounting-app-cluster
export ECS_SERVICE=node-accounting-app-service

# Deploy
./deploy/deploy.sh deploy-aws
```

### What the Script Does

1. Authenticates with AWS ECR
2. Creates ECR repository if it doesn't exist
3. Builds and tags the Docker image
4. Pushes image to ECR
5. Forces new deployment on ECS service

## Azure App Service Deployment

### Prerequisites

1. Azure CLI installed and authenticated (`az login`)
2. Active Azure subscription

### Deploy

```bash
# Set required environment variables (or use defaults)
export AZURE_RESOURCE_GROUP=node-accounting-app-rg
export AZURE_APP_PLAN=node-accounting-app-plan
export AZURE_WEBAPP_NAME=node-accounting-app
export AZURE_LOCATION=eastus

# Deploy
./deploy/deploy.sh deploy-azure
```

### What the Script Does

1. Creates resource group (if not exists)
2. Creates App Service plan (Linux, B1 tier)
3. Creates/updates web app with Node.js 18 runtime
4. Zips and deploys application code

## Health Monitoring

Once deployed, verify the application health:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "node-accounting-app",
  "version": "1.0.0",
  "uptime": 42.5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## CI/CD Pipeline Recommendations

1. **Build Stage**: `npm ci && npm run lint && npm test`
2. **Docker Stage**: `docker build -t app:$SHA .`
3. **Deploy Stage**: Push to registry, update service
4. **Verify Stage**: Health check on deployed endpoint

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change `APP_PORT` in `.env` |
| Docker build fails | Ensure `node-app/` directory exists with `package.json` |
| Tests fail | Run `npm install` first to install dev dependencies |
| Health check fails | Verify container is running: `docker ps` |
| AWS deploy fails | Check `aws sts get-caller-identity` works |
