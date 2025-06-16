# ---- base ----
  FROM node:20-slim AS base
  WORKDIR /usr/src/app

  # ---- dependencies ----
  FROM base AS deps
  COPY package.json pnpm-lock.yaml ./
  RUN corepack enable && pnpm install --frozen-lockfile --prod=false

  # ---- build ----
  FROM deps AS build
  COPY . .
  RUN pnpm run build

  # ---- release ----
  FROM node:20-slim AS release
  ENV NODE_ENV=production
  WORKDIR /usr/src/app
  COPY --from=build /usr/src/app/dist ./dist
  COPY --from=deps /usr/src/app/node_modules ./node_modules
  COPY package.json .
  CMD ["node", "dist/main.js"]
