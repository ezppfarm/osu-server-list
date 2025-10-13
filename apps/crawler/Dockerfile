FROM oven/bun:latest

WORKDIR /src

COPY package.json .
COPY bun.lock .

COPY apps/crawler/package.json ./apps/crawler/
COPY apps/crawler/bun.lock ./apps/crawler/

COPY packages/db/package.json ./packages/db/
COPY packages/db/bun.lock ./packages/db/

COPY packages/handlers/package.json ./packages/handlers/

RUN bun install

COPY . .

RUN bun run package:db:rebuild

CMD ["bun", "run", "apps/crawler/src/index.ts"]