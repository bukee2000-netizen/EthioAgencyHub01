# 🌍 Ethio Agency Hub

> **Modernizing Ethiopian foreign employment agencies through technology.**
> A full-stack SaaS platform built for Ethiopian labor recruitment agencies to manage employees, documents, travel, pilgrimages, and institutional partnerships — powered by Supabase Auth, Cloudflare R2, and Vercel.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing-strategy)
- [Deployment](#-deployment--devops)

---

## 🎯 Project Overview

**Ethio Agency Hub** is a multi-tenant SaaS platform designed exclusively for **Ethiopian foreign employment agencies**. It digitizes the full employee lifecycle — from initial registration and CV generation, through document processing, MOLS/Embassy integration, travel coordination, and Hajj/Umrah pilgrimage management.

### Core Problems It Solves

| Problem | Solution |
|---|---|
| Paper-based employee records | Digital registration with structured CV generation |
| Untracked document processing | MOLS integration + cross-match verification |
| Expensive video/document storage | Cloudflare R2 (S3-compatible, pay-as-you-go) |
| Complex auth & session management | Supabase Auth SSR with RBAC |
| No centralized agency operations view | Real-time KPI dashboard |
| Manual travel coordination | Automated departure preparation & ticket management |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR, routing, API routes |
| **Language** | TypeScript (strict) | Type safety |
| **Database** | MySQL + Prisma ORM | Relational data |
| **Auth** | Supabase Auth SSR | Session management, RLS |
| **File Storage** | Cloudflare R2 | S3-compatible document & media storage |
| **Rate Limiting** | Upstash Redis | Sliding-window rate limiter |
| **Email** | Resend | Transactional emails |
| **Validation** | Zod | Schema validation |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Testing** | Vitest | Unit + integration tests |
| **Hosting** | Vercel | Edge-rendered deployment |

---

📁 Project Structure

```
app/                          # Next.js App Router
├── (auth)/                   # Login, register
├── (dashboard)/              # 50+ protected pages
└── api/                      # REST API routes
    ├── auth/                 # Supabase Auth wrappers
    ├── employees/            # CRUD, registration, bulk import
    ├── documents/            # Documents, visa, MOLS, cross-match
    ├── travel/[...slug]      # Travel management
    ├── hajj-umrah/[...slug]  # Pilgrim management
    ├── institutions/[...slug]# Institution management
    ├── agents/[...slug]      # Agent management
    ├── r2/presign            # Presigned R2 upload/download URLs
    └── jobs/[jobId]          # Async job polling

lib/                          # Pure logic
├── supabase/                 # client, server, admin, middleware
├── db/                       # Prisma singleton, queries
├── r2/                       # S3 client, presigned URL helpers
├── redis/                    # Upstash client, rate limiter
├── email/                    # Resend client
├── jobs/                     # Supabase jobs table client
├── validations/              # Zod schemas
└── utils/                    # Formatters, AppError hierarchy

tests/                        # Vitest
├── unit/                     # 96 tests
├── integration/              # 45 passing, 39 skipped (need MySQL)
└── components/               # 72 tests (React Testing Library)
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+ (or remote)
- Supabase project (free tier)
- Cloudflare R2 bucket (free tier)

### Installation

```bash
# Clone
git clone https://github.com/ethioagencyhub-art/EthioAgencyHub.git
cd EthioAgencyHub/web-app

# Install
npm install
npx prisma generate
cp .env.example .env.local   # Edit with your values

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

Open `http://localhost:3000`.

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=mysql://user:password@localhost:3306/ethio_agency_hub

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=ethio-agency-hub

# Upstash Redis
REDIS_URL=https://your-region.upstash.io
REDIS_TOKEN=your-redis-token

# Resend
RESEND_API_KEY=re_xxxxx
```

---

## 🧪 Testing

```bash
npm run test              # All tests
npx vitest run tests/integration/    # Integration only
npx vitest run --reporter=verbose    # Verbose output
```

| Suite | Tests | Status |
|---|---|---|
| Unit (15 files) | 96 | ✅ All passing |
| Integration (4 files) | 84 | 45 passing, 39 skipped* |
| Components (17 files) | 72 | ✅ All passing |

*\*Skipped = needs MySQL `DATABASE_URL`. Set env var to enable.*

---

## 🚢 Deployment

### Vercel

```bash
npm i -g vercel
vercel --prod
```

Set all env vars in **Vercel Dashboard → Settings → Environment Variables**.

### CI/CD (GitHub Actions)

```
Push → Lint + TypeCheck → Tests → Build → Deploy to Vercel
```

---

**Ethio Agency Hub** — Modernizing Ethiopian foreign employment agencies through technology.

*Version: 3.0.0 | Last Updated: June 2026*
