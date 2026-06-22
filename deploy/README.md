# Deployment Guide

## Overview

This directory contains all deployment artifacts for the Node.js Accounting Application.

## Prerequisites

- Docker (20.10+)
- Docker Compose (v2+)
- Node.js 18+ (for local development)
- AWS CLI (optional, for AWS deployment)
- Azure CLI (optional, for Azure deployment)

## Quick Start

```bash
# Full pipeline: lint → test → build → deploy
./deploy.sh full

# Or step by step:
./deploy.sh build    # Build Docker image
./deploy.sh test     # Run tests
./deploy.sh start    # Start with Docker Compose
./deploy.sh health   # Verify health
```

## Available Commands

| Command | Description |
|---------|-------------|
| `build` | Build the Docker image |
| `test` | Run unit and integration tests |
| `lint` | Run ESLint checks |
| `start` | Start application via Docker Compose |
| `stop` | Stop the running application |
| `restart` | Restart the application |
| `logs` | View application logs (follow mode) |
| `health` | Check application health endpoint |
| `clean` | Remove containers and images |
| `deploy-aws` | Deploy to AWS ECS |
| `deploy-azure` | Deploy to Azure App Service |
| `full` | Run complete CI/CD pipeline |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

See `.env.example` for all available configuration options.

## Docker Deployment

### Local Docker

```bash
# Build and start
./deploy.sh start

# Health check
curl http://localhost:3000/health
```

### AWS ECS

```bash
# Configure AWS credentials first
aws configure

# Deploy
./deploy.sh deploy-aws
```

### Azure App Service

```bash
# Login to Azure first
az login

# Deploy
./deploy.sh deploy-azure
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Docker Container              │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  main.js    │  │ healthcheck.js  │  │
│  │  (CLI App)  │  │ (HTTP :3000)    │  │
│  └──────┬──────┘  └─────────────────┘  │
│         │                               │
│  ┌──────┴──────┐                        │
│  │operations.js│                        │
│  └──────┬──────┘                        │
│         │                               │
│  ┌──────┴──────┐                        │
│  │  data.js    │                        │
│  │ (In-memory) │                        │
│  └─────────────┘                        │
└─────────────────────────────────────────┘
```
