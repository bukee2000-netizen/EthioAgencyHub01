# EthioAgencyHub — Deployment Guide

Comprehensive guide for deploying the Ethiopian labor export agency management platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Application Build](#application-build)
5. [Docker Deployment](#docker-deployment)
6. [Manual Deployment (Non-Docker)](#manual-deployment-non-docker)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup & Restore](#backup--restore)
10. [Security Considerations](#security-considerations)

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | >= 20.x (LTS recommended) | Tested with 20.x and 22.x |
| **npm** | >= 10.x | Ships with Node.js 20+ |
| **MySQL** | >= 8.0 | Production database; not required for dev (SQLite) |
| **Docker** | >= 24.x | Required for containerized deployment |
| **Docker Compose** | >= 2.20.x | Ships with Docker Desktop |
| **Git** | >= 2.40.x | For version control and CI |

Verify prerequisites:

```bash
node --version   # v20.x or v22.x
npm --version    # >= 10
mysql --version  # 8.0+
docker --version # 24+
docker compose version  # 2.20+
```

---

## Environment Variables

The application uses different `.env` files depending on the target environment.

### File Reference

| File | Purpose |
|---|---|
| `.env.example` | Reference for all available Telegram/WhatsApp variables (dev) |
| `.env.production.example` | Production-ready template with all required vars |
| `.env.docker` | Docker-specific overrides (Compose) |

### Required Variables (Production)

Create a `.env` file from `.env.production.example`:

```bash
cp .env.production.example .env
# then edit .env with your secrets
```

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Set to `production` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public-facing URL (e.g. `https://hub.example.com`) |
| `DATABASE_URL` | Yes | MySQL connection string: `mysql://user:pass@host:3306/ethio_agency_hub` |
| `JWT_SECRET` | Yes | Random 32+ char string (`openssl rand -base64 32`) |
| `TELEGRAM_BOT_TOKEN` | No | Telegram bot token from BotFather (document uploads) |
| `TG_CHANNEL_ID` | No | Telegram channel ID (starts with `-100`) |
| `UPLOAD_PATH` | No | File upload directory (default: `/app/uploads`) |
| `MAX_FILE_SIZE_MB` | No | Max upload file size in MB (default: `50`) |
| `MAX_FILE_SIZE` | No | Max upload file size in bytes (default: `52428800`) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms (default: `900000`) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window (default: `100`) |
| `LOG_LEVEL` | No | Log level: `debug`, `info`, `warn`, `error` |

### Docker-Specific Variables

Set these in an `.env` file in the project root (used by `docker-compose.yml`):

| Variable | Description |
|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root password |
| `MYSQL_PASSWORD` | MySQL application user password |
| `APP_PORT` | Host port mapping for the app (default: `3000`) |
| `SEED_DB` | Set to `true` to seed demo data on first run |

---

## Database Setup

### Development (SQLite)

No additional setup required — Prisma uses `prisma/dev.db` (SQLite) automatically:

```bash
# Generate Prisma client
npm run db:generate

# Apply migrations
npx prisma migrate dev

# (Optional) Seed demo data
npx tsx prisma/seed.ts
```

### Production (MySQL)

#### 1. Create the database

```sql
CREATE DATABASE ethio_agency_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'agency_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON ethio_agency_hub.* TO 'agency_user'@'%';
FLUSH PRIVILEGES;
```

#### 2. Update Prisma provider

Edit `prisma/schema.prisma` to switch from SQLite to MySQL:

```diff
 datasource db {
-  provider = "sqlite"
-  url      = "file:./dev.db"
+  provider = "mysql"
+  url      = env("DATABASE_URL")
 }
```

> **Note:** In Docker deployments, the `docker-entrypoint.sh` script performs this switch automatically.

#### 3. Apply migrations

```bash
DATABASE_URL="mysql://agency_user:strong_password@localhost:3306/ethio_agency_hub" \
  npx prisma migrate deploy
```

#### 4. Generate client

```bash
npx prisma generate
```

---

## Application Build

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# TypeScript check
npm run type-check

# Lint
npm run lint

# Run tests
npm test

# Build Next.js
npm run build
```

The build output goes to `.next/`. The production server is started with `npm start`.

---

## Docker Deployment

### Production `docker-compose.yml`

Create `docker-compose.yml` in the project root:

```yaml
version: "3.9"

services:
  mysql:
    image: mysql:8.0
    container_name: ethio-mysql
    restart: unless-stopped
    volumes:
      - mysql_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ethio_agency_hub
      MYSQL_USER: agency_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 5
      start_period: 30s

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ethio-agency-hub
    restart: unless-stopped
    ports:
      - "${APP_PORT:-3000}:3000"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_APP_URL: ${APP_URL:-http://localhost:3000}
      DATABASE_URL: mysql://agency_user:${MYSQL_PASSWORD}@mysql:3306/ethio_agency_hub
      JWT_SECRET: ${JWT_SECRET}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN:-}
      TG_CHANNEL_ID: ${TG_CHANNEL_ID:-}
      UPLOAD_PATH: /app/uploads
      MAX_FILE_SIZE_MB: "50"
      MAX_FILE_SIZE: "52428800"
      RATE_LIMIT_WINDOW_MS: "900000"
      RATE_LIMIT_MAX_REQUESTS: "100"
      LOG_LEVEL: info
      SEED_DB: ${SEED_DB:-false}
    volumes:
      - app_uploads:/app/uploads

volumes:
  mysql_data:
  app_uploads:
```

### Deployment Steps

```bash
# 1. Prepare environment
cp .env.docker .env
# Edit .env with your secrets

# 2. Build and start
docker compose up -d --build

# 3. Check logs
docker compose logs -f app

# 4. Verify health
curl http://localhost:3000/api/health
```

### Updating

```bash
git pull
docker compose up -d --build
# Database migrations run automatically on startup via docker-entrypoint.sh
```

---

## Manual Deployment (Non-Docker)

Deploy directly on a VM or bare-metal server.

### 1. Install System Dependencies

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y \
  curl gnupg build-essential mysql-server nginx certbot python3-certbot-nginx

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Clone & Build

```bash
git clone https://github.com/your-org/ethio-agency-hub.git
cd ethio-agency-hub/web-app

cp .env.production.example .env
# Edit .env with your production values

npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

### 3. Configure Process Manager (PM2)

```bash
npm install -g pm2

# ecosystem.config.cjs
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'ethio-agency-hub',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '.',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 2,
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 4. Configure Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name hub.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hub.example.com;

    ssl_certificate /etc/letsencrypt/live/hub.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hub.example.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        alias /path/to/app/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /path/to/app/uploads;
        expires 30d;
    }
}
```

### 5. SSL with Let's Encrypt

```bash
sudo certbot --nginx -d hub.example.com
```

---

## CI/CD Pipeline

### GitHub Actions

See `.github/workflows/ci.yml` for the CI workflow configuration.

The CI pipeline runs on every push and pull request to `main`:

| Stage | Description |
|---|---|
| **Install** | `npm ci` with caching |
| **Prisma Generate** | Generates Prisma client for type safety |
| **Type Check** | `tsc --noEmit` |
| **Lint** | `next lint` |
| **Unit Tests** | `vitest run` |
| **Integration Tests** | `vitest run` (all tests) |

Tests use SQLite (`file:./test.db`) — no MySQL service required in CI.

### Deployment Pipeline (Manual Trigger)

For production deployments, a CD workflow can be added to:

1. Build the Docker image
2. Push to a container registry (Docker Hub, GHCR, ECR)
3. SSH into the server and deploy with `docker compose up -d`

---

## Monitoring & Logging

### Application Logging

The app outputs structured logs to stdout. Configure `LOG_LEVEL` in `.env`:

| Level | When to use |
|---|---|
| `debug` | Development / troubleshooting |
| `info` | Production (default) |
| `warn` | When you want minimal noise |
| `error` | Critical alerts only |

### Docker Logging

```bash
# Tail logs
docker compose logs -f --tail=100

# Docker logging driver (json-file by default)
docker compose logs --tail=500 app
```

### External Monitoring (Recommended)

| Tool | Purpose |
|---|---|
| **Uptime Kuma** | Free self-hosted uptime monitoring |
| **Better Stack / Sentry** | Error tracking and performance monitoring |
| **Prometheus + Grafana** | Metrics aggregation and dashboards |
| **Loki + Promtail** | Log aggregation (alternative to ELK) |

Add environment variable `NEXT_PUBLIC_SENTRY_DSN` if using Sentry for error tracking.

### Health Check Endpoint

The app exposes `/api/health` — configure your monitoring tool to ping this endpoint every 30-60 seconds.

---

## Backup & Restore

### Database Backup (MySQL)

```bash
# Backup
docker exec ethio-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} \
  ethio_agency_hub > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
cat backup_file.sql | docker exec -i ethio-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ethio_agency_hub
```

### Uploaded Files Backup

```bash
# Docker volumes
docker run --rm -v app_uploads:/data -v $(pwd):/backup alpine \
  tar czf /backup/uploads_$(date +%Y%m%d).tar.gz -C /data .
```

### Automated Backup Script

Create a cron job:

```bash
0 3 * * * /path/to/backup.sh
```

Example `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR=/var/backups/ethio-agency-hub
mkdir -p $BACKUP_DIR

DATE=$(date +%Y%m%d_%H%M%S)

# MySQL dump
docker exec ethio-mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD \
  ethio_agency_hub | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Uploads
docker run --rm -v app_uploads:/data -v $BACKUP_DIR:/backup alpine \
  tar czf /backup/uploads_$DATE.tar.gz -C /data .

# Retention: keep 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

---

## Security Considerations

### Secrets Management

- Never commit `.env` files to version control (`.env`, `.env.local`, `.env.*.local` are in `.gitignore`)
- Use a secrets manager (HashiCorp Vault, AWS Secrets Manager, Doppler) in production
- Rotate `JWT_SECRET` and database passwords regularly
- Use `openssl rand -base64 32` to generate strong secrets

### Database Security

- Use a dedicated MySQL user (not root) with least-privilege grants
- Enable MySQL SSL/TLS for connections over untrusted networks
- Restrict MySQL port access (use Docker internal network or firewall rules)
- Run `mysql_secure_installation` to remove default users and test databases

### Application Security

- **Rate Limiting:** Enabled by default (100 requests per 15-minute window, configurable via `RATE_LIMIT_*` vars)
- **Authentication:** JWT-based with optional TOTP two-factor authentication
- **Password Hashing:** bcrypt with cost factor 12
- **Session Management:** Short-lived JWT access tokens + refresh tokens
- **File Uploads:** Restricted to `/app/uploads` with maximum size limits
- **HTTP Headers:** Next.js provides Helmet-like security headers by default

### Network Security

- Run the application behind a reverse proxy (Nginx) with SSL termination
- Use Docker's internal network for inter-service communication (no exposed MySQL port)
- Enable a firewall (UFW / iptables): allow only ports 80, 443, and SSH
- Regularly update base images: `docker compose pull` and rebuild

### Compliance Considerations

- **Ethiopian Data Protection:** Encrypt personal data at rest and in transit
- **Audit Logging:** All sensitive operations are logged to the `AuditLog` table
- **Access Control:** Role-based access (SUPER_ADMIN, AGENCY_ADMIN, AGENT, VIEWER)
- **Data Retention:** Soft-deletes enabled on most entities (`deletedAt` field)

### Regular Maintenance

```bash
# Update dependencies
npm audit
npm update

# Update Docker base images
docker compose pull
docker compose up -d --build

# Review audit logs
SELECT * FROM AuditLog WHERE createdAt > NOW() - INTERVAL 7 DAY;
```

### Emergency Recovery

If the application becomes unresponsive:

1. Check logs: `docker compose logs --tail=200 app`
2. Restart services: `docker compose restart`
3. Rollback to previous image: `docker compose up -d <previous-tag>`
4. Database rollback: `npx prisma migrate down` (if migration caused the issue)

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # TypeScript check
npm run lint             # Lint code
npm test                 # Run tests
npm run test:coverage    # Tests with coverage
npm run test:e2e         # Playwright e2e

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Dev migration
npx prisma migrate deploy  # Prod migration
npx prisma studio        # Prisma GUI

# Docker
docker compose up -d     # Start all services
docker compose down      # Stop all services
docker compose logs -f   # Follow logs
docker compose build     # Rebuild images without starting
```

### Directory Structure (Deployment-Relevant)

```
web-app/
├── .github/workflows/ci.yml   # CI pipeline
├── Dockerfile                  # Multi-stage build
├── docker-entrypoint.sh        # Entrypoint (switches Prisma provider)
├── docker-compose.yml          # (Create per instructions)
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── .next/                      # Build output (generated)
├── public/                     # Static assets
├── uploads/                    # File uploads (runtime)
└── tests/                      # Test suite
    ├── unit/                   # Unit tests
    ├── integration/            # Integration tests
    └── e2e/                    # Playwright end-to-end tests
```
