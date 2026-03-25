FROM oven/bun:1.3.9 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY apps/api/package.json ./apps/api/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/worker/package.json ./apps/worker/
COPY apps/pusher/package.json ./apps/pusher/
COPY apps/tests/package.json ./apps/tests/
COPY packages/store/package.json ./packages/store/
COPY packages/ui/package.json ./packages/ui/
COPY packages/redis-custom-client/package.json ./packages/redis-custom-client/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN cd packages/store && bun prisma generate

# ---- API ----
FROM base AS api
EXPOSE 3000
CMD ["bun", "run", "apps/api/index.ts"]

# ---- Worker ----
FROM base AS worker
CMD ["bun", "run", "apps/worker/index.ts"]

# ---- Pusher ----
FROM base AS pusher
CMD ["bun", "run", "apps/pusher/index.ts"]

# ---- Frontend build ----
FROM base AS frontend-build
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN cd apps/frontend && bun run build

FROM nginx:alpine AS frontend
COPY --from=frontend-build /app/apps/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
