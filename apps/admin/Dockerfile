FROM node:22-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --dir packages/tthree exec rollup -c
RUN pnpm -F admin build

EXPOSE 1111

CMD ["pnpm", "-F", "admin", "preview", "--host", "0.0.0.0", "--port", "1111"]
