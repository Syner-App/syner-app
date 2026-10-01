# Development image: src/ and public/ are bind-mounted by syner/docker-compose.yml
# (hot-reload with `next dev`). node_modules stays in the image so native deps are
# built for Linux.
FROM node:24-bookworm-slim

RUN npm i -g pnpm@11.1.3

WORKDIR /app

# pnpm-workspace.yaml carries allowBuilds for the native build scripts
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3001

CMD ["pnpm", "dev"]
