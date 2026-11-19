# Build context is the monorepo root: docker build -f apps/web/Dockerfile .
FROM node:24.22.3-bookworm-slim AS build
RUN npm install --global pnpm@12.21.0
WORKDIR /repo
# No git hooks inside the image.
ENV HUSKY=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web ./apps/web
RUN pnpm turbo run build --filter=web

# The Nitro output bundles its own dependencies, so the runtime image needs nothing else.
FROM node:24.22.3-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /repo/apps/web/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
