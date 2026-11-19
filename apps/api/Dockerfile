# Build context is the monorepo root: docker build -f apps/api/Dockerfile .
FROM node:24.22.3-bookworm-slim AS base
RUN npm install --global pnpm@12.21.0
WORKDIR /repo
# No git hooks inside the image.
ENV HUSKY=0

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile
COPY apps/api ./apps/api
RUN pnpm turbo run build --filter=api
RUN pnpm --filter=api deploy --prod --legacy /prod/api

FROM node:24.22.3-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /prod/api/package.json ./package.json
COPY --from=build /prod/api/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
