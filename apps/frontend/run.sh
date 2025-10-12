#!/usr/bin/env bash

set -e

bun run db:migrate
bun ./apps/frontend/dist/index.js