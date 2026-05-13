# ─── Stage 1: Dependencies ────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ─── Stage 2: Runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove scripts directory from production image
RUN rm -rf scripts

USER appuser

EXPOSE 5002
ENV NODE_ENV=production

CMD ["node", "server.js"]
