# ── Stage 1: Install dependencies ──
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production

# ── Stage 2: Production image ──
FROM node:18-alpine
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/

USER appuser

CMD ["node", "src/main.js"]
