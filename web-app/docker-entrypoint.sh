#!/bin/sh
set -e

echo "=== Ethio Agency Hub — Docker Entrypoint ==="

# Switch Prisma provider from sqlite to mysql for production
echo "[1/4] Switching Prisma provider to mysql..."
sed -i 's/provider = "sqlite"/provider = "mysql"/' prisma/schema.prisma
sed -i 's|url *= *".*"|url      = env("DATABASE_URL")|' prisma/schema.prisma

# Generate Prisma client
echo "[2/4] Generating Prisma client..."
npx prisma generate

# Push schema to database (creates tables if they don't exist)
echo "[3/4] Syncing database schema..."
npx prisma db push --accept-data-loss

# Seed database if EMPTY (optional, controlled by SEED_DB env)
if [ "$SEED_DB" = "true" ]; then
  echo "[3b/4] Seeding database..."
  npx tsx prisma/seed.ts
fi

# Start the Next.js application
echo "[4/4] Starting Next.js server..."
exec npm start