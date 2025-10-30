FROM oven/bun:latest

WORKDIR /src

RUN apt update && apt install -y git

COPY package.json .
COPY bun.lock .

COPY apps/frontend/package.json ./apps/frontend/
COPY apps/frontend/bun.lock ./apps/frontend/

COPY packages/db/package.json ./packages/db/
COPY packages/db/bun.lock ./packages/db/

COPY packages/handlers/package.json ./packages/handlers/

COPY packages/hooks/package.json ./packages/hooks/

COPY packages/oauth/package.json ./packages/oauth/

RUN bun install

COPY . .

RUN bun run packages:rebuild
RUN bun run build

RUN chmod +x ./apps/frontend/run.sh
CMD ["./apps/frontend/run.sh"]
