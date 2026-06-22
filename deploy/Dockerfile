# ============================================================
# Multi-stage Dockerfile for Node.js Accounting Application
# Modernized from legacy COBOL system
# ============================================================

# Stage 1: Build and test
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY node-app/package*.json ./
RUN npm ci --only=production

# Copy application source
COPY node-app/src/ ./src/

# Stage 2: Production image
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY node-app/package.json ./

# Add health check endpoint wrapper
COPY deploy/healthcheck.js ./healthcheck.js

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Expose health check port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "src/main.js"]
