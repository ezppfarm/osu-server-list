FROM oven/bun:latest

WORKDIR /src

COPY package.json .
COPY bun.lock .

COPY apps/frontend/package.json ./apps/frontend/
COPY apps/frontend/bun.lock ./apps/frontend/

COPY packages/db/package.json ./packages/db/
COPY packages/db/bun.lock ./packages/db/

RUN bun install

COPY . .

RUN bun run package:db:rebuild
RUN bun run build

RUN chmod +x ./apps/frontend/run.sh
CMD ["./apps/frontend/run.sh"]