# Multi-stage build for the Account Management System
# Stage 1: Install dependencies
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2: Production image
FROM node:18-alpine AS production

LABEL maintainer="Account Management System Team"
LABEL description="Node.js modernization of legacy COBOL accounting system"

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY src/ ./src/
COPY package.json ./

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

# Health check (for container orchestration)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Application entrypoint
CMD ["node", "src/main.js"]
