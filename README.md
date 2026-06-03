# 🌍 Ethio Agency Hub

> **Modernizing Ethiopian foreign employment agencies through technology.**
> A full-stack SaaS platform built for Ethiopian labor recruitment agencies to manage employees, documents, travel, pilgrimages, and institutional partnerships — powered by Supabase Auth, Cloudflare R2, and Vercel.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Site Map](#-structural-site-map)
- [Key Features](#-key-features-by-module)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema Overview](#-database-schema-overview)
- [API Design](#-api-design)
- [Security](#-security--privacy)
- [Testing](#-testing-strategy)
- [Deployment](#-deployment--devops)
- [Contributing](#-contributing)

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
| No centralized agency operations view | Real-time KPI dashboard for 50+ agencies |
| Manual travel coordination | Automated departure preparation & ticket management |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR, routing, API routes |
| **Language** | TypeScript (strict) | Type safety |
| **Database** | MySQL + Prisma ORM | Employee/agency relational data |
| **Auth** | Supabase Auth SSR | Session management, row-level security |
| **File Storage** | Cloudflare R2 | S3-compatible document & media storage |
| **Rate Limiting** | Upstash Redis | API rate limiting (sliding window) |
| **Email** | Resend | Transactional emails |
| **Validation** | Zod | Schema validation |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Testing** | Vitest | Unit + integration tests |
| **Hosting** | Vercel (Cloudflare domain) | Edge-rendered deployment |
| **CI/CD** | GitHub Actions | Lint, test, deploy pipeline |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Browser     │────▶│  Vercel      │────▶│  Supabase    │
│  (Next.js)   │     │  Edge/Middle │     │  Auth SSR    │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                    ┌──────▼───────┐     ┌──────────────┐
                    │  Next.js API │────▶│  MySQL       │
                    │  Routes      │     │  (Prisma)    │
                    └──────┬───────┘     └──────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ R2       │ │ Upstash  │ │ Resend   │
       │ Storage  │ │ Redis    │ │ Email    │
       └──────────┘ └──────────┘ └──────────┘
```

---

📁 Project Structure

```
ethio-agency-hub/
│
├── .github/workflows/          # CI/CD pipelines
│
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, register, logout
│   ├── (dashboard)/            # Protected pages (50+ routes)
│   └── api/                    # REST API routes
│       ├── auth/               # Supabase Auth wrappers
│       ├── employees/          # Employee CRUD, registration, bulk import
│       ├── documents/          # Documents, visa, MOLS, cross-match
│       ├── travel/             # Travel management (catch-all [...slug])
│       ├── hajj-umrah/         # Pilgrim management (catch-all [...slug])
│       ├── institutions/       # Institution management (catch-all [...slug])
│       ├── agents/             # Agent management (catch-all [...slug])
│       ├── jobs/[jobId]        # Import progress polling
│       ├── r2/presign          # Presigned upload/download URL generation
│       └── inngest/            # Background job webhook endpoint
│
├── components/                 # Shared UI components
│   ├── ui/                     # Base design system (shadcn/ui)
│   ├── layout/                 # Sidebar, topbar, theme provider
│   ├── dashboard/              # KPI cards, charts, activity feed
│   ├── employees/              # Registration wizard, CV generator, profiles
│   ├── documents/              # Document viewer, upload, cross-match
│   ├── travel/                 # Travel timeline, departure cards
│   ├── hajj-umrah/             # Pilgrim registration components
│   └── agents/                 # Agent management components
│
├── lib/                        # Pure logic — no React
│   ├── supabase/               # client.ts, server.ts, admin.ts, middleware.ts
│   ├── db/                     # prisma.ts, queries/
│   ├── r2/                     # client.ts, presign.ts (S3 presigned URLs)
│   ├── redis/                  # client.ts, rate-limit.ts (Upstash)
│   ├── jobs/                   # client.ts, dispatch.ts (Supabase jobs table)
│   ├── email/                  # resend.ts (Resend client)
│   ├── auth/                   # Route protection + role guards
│   ├── validations/            # Zod schemas (employee, document, auth)
│   └── utils/                  # format.ts, errors.ts (AppError hierarchy)
│
├── prisma/                     # schema.prisma + migrations
├── supabase/migrations/        # RLS policies, SQL extensions
├── tests/                      # unit/, integration/
├── inngest/                    # Background job functions
├── config/                     # site.ts, permissions.ts
├── types/                      # api.ts, employee.ts, media.ts
│
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## 🗂️ Structural Site Map

```
Ethio Agency Hub
├── 🔐 Authentication
│   ├── /login
│   ├── /logout
│   └── /register                    (admin only)
│
├── 📊 Dashboard
│   ├── /dashboard
│   ├── /dashboard/trends
│   ├── /dashboard/tasks
│   └── /dashboard/activities
│
├── 👥 Employee Management
│   ├── /employee-management
│   ├── /employee-management/registration
│   │   ├── /personal ├── /skills ├── /documents └── /review
│   ├── /employee-management/cv-generator
│   │   ├── /templates ├── /preview └── /download-share
│   ├── /employee-management/cv-database
│   │   ├── /employee-profiles ├── /skill-matching └── /search
│   └── /employee-management/[id]
│
├── 📄 Document Management
│   ├── /documents ├── /upload ├── /visa ├── /mols
│   ├── /missing-report ├── /cross-match └── /[id]
│
├── ✈️ Travel Management
│   ├── /travel ├── /schedule ├── /ticket
│   ├── /today ├── /departure └── /[id]
│
├── 🕋 Hajj & Umrah
│   ├── /hajj-umrah ├── /pilgrim-detail ├── /requirements
│   ├── /documentation └── /[id]
│
├── 🏢 Institutions
│   ├── /institutions ├── /institution-detail ├── /partners
│   ├── /collaboration └── /[id]
│
├── 👤 Agents
│   ├── /agents ├── /agent-detail ├── /performance
│   ├── /onboarding ├── /training ├── /support └── /[id]
│
├── ⚙️ Administration
│   ├── /administration ├── /users ├── /roles-permissions
│   ├── /settings ├── /logs └── /audit
│
├── 📈 Reporting & Analytics
│   ├── /reporting-analytics ├── /overview
│   ├── /employee-reports ├── /document-reports
│   ├── /financial-reports └── /export
│
└── 👤 User Settings
    ├── /user-settings ├── /profile ├── /security └── /notifications
```

---

## 🎯 Key Features by Module

### 📊 Dashboard
- Real-time KPIs: employee count, document pipeline status, today's departures
- Quick-action shortcuts for most common workflows
- System activity feed
- Performance metrics per agency (multi-tenant view)

### 👥 Employee Management
- Multi-step registration wizard (personal → skills → documents → review)
- Professional CV generator with exportable templates
- Skill-matching engine for deployment opportunities
- Full employee lifecycle status tracking

### 📄 Document Management
- Secure file upload to Cloudflare R2 with presigned URLs
- Visa application tracking
- MOLS (Ministry of Labor & Social Affairs) system integration
- Employee missing-person reports to MOLS
- Cross-match document verification

### ✈️ Travel Management
- Pre-departure checklist and preparation workflow
- Flight ticket booking and tracking
- Real-time travel status updates
- Today's departures at-a-glance view

### 🕋 Hajj & Umrah Management
- Specialized pilgrim registration and group coordination
- Requirements compliance monitoring
- Religious travel document management
- Group/season-based pilgrimage tracking

### 🏢 Institution Management
- Partner institution database
- Collaboration and communication tools
- Secure document exchange with external organizations

### 👤 Agent Management
- Performance metrics and commission tracking
- Onboarding and training program management
- Agent support tools and resources

### ⚙️ Administration
- Multi-agency user management
- Role-based access control (RBAC)
- System configuration and audit trail
- Full activity logging

### 📈 Reporting & Analytics
- Agency-level and platform-level analytics dashboards
- Employee registration, deployment, and document processing reports
- Financial and commission reports
- Flexible data export (CSV, PDF)

---

## ⚡ Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+ (or remote instance)
- Supabase project (free tier)
- Cloudflare R2 bucket (free tier)
- Upstash Redis (free tier)
- Resend account (free tier)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ethioagencyhub-art/EthioAgencyHub.git
cd EthioAgencyHub

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Copy environment template
cp .env.example .env.local
# → Edit .env.local with your values (see below)

# 5. Run database migrations
npx prisma migrate dev

# 6. Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database (MySQL)
DATABASE_URL=mysql://user:password@localhost:3306/ethio_agency_hub

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2 (S3-compatible)
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=ethio-agency-hub
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Upstash Redis
REDIS_URL=https://your-region.upstash.io
REDIS_TOKEN=your-redis-token

# Resend (Email)
RESEND_API_KEY=re_xxxxx
```

---

## 🗄️ Database Schema Overview

```prisma
model Agency {
  id        String     @id @default(cuid())
  name      String
  users     User[]
  employees Employee[]
  agents    Agent[]
  createdAt DateTime   @default(now())
}

model Employee {
  id              String   @id @default(cuid())
  agency          Agency   @relation(fields: [agencyId], references: [id])
  agencyId        String
  firstName       String?
  lastName        String?
  email           String?
  passportNumber  String?
  contactPhone    String?
  photoUrl        String?  // R2 presigned URL reference
  status          EmployeeStatus
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model User {
  id           String   @id @default(cuid())
  agency       Agency   @relation(fields: [agencyId], references: [id])
  agencyId     String
  email        String   @unique
  role         Role
  createdAt    DateTime @default(now())
}

model Agent {
  id         String  @id @default(cuid())
  agency     Agency  @relation(fields: [agencyId], references: [id])
  agencyId   String
  name       String
  country    String
  status     String  @default("active")
}
```

---

## 🌐 API Design

All API routes live under `/app/api/`. They follow RESTful conventions and return JSON.

```
GET    /api/employees                  → list employees (paginated, filtered)
POST   /api/employees                  → create employee
GET    /api/employees/[id]             → single employee
PUT    /api/employees/[id]             → update employee
DELETE /api/employees/[id]             → soft delete

POST   /api/r2/presign                 → generate presigned upload URL (Bearer auth)
GET    /api/r2/presign?key=...         → generate presigned download URL

POST   /api/auth/login                 → Supabase Auth login
POST   /api/auth/logout                → Supabase Auth logout
POST   /api/auth/register              → admin-driven registration

GET    /api/travel/[...slug]           → travel CRUD (catch-all)
GET    /api/hajj-umrah/[...slug]       → pilgrim CRUD (catch-all)
GET    /api/institutions/[...slug]     → institution CRUD (catch-all)
GET    /api/agents/[...slug]           → agent CRUD (catch-all)
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 120, "source": "database" }
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": [ ... ]
  }
}
```

---

## 🔐 Security & Privacy

### Authentication & Authorization
- **Supabase Auth SSR** with `@supabase/ssr` middleware (cookie-based session)
- **RBAC**: `SUPER_ADMIN` → `AGENCY_ADMIN` → `AGENT` → `VIEWER`
- **Row-Level Security** via Supabase policies (planned)
- MFA via TOTP (available)

### Data Protection
- **Agency data isolation**: each agency only sees its own data (Prisma-level tenant filtering)
- **Zod validation** on all API inputs
- **CSRF protection** via Supabase SSR cookie pattern
- **Prisma ORM** prevents SQL injection
- **Secure headers** via Next.js middleware

---

## 🧪 Testing Strategy

```bash
# All tests (Vitest)
npm run test

# Integration tests only
npm run test:integration

# Single test file
npx vitest run tests/components/sidebar.test.tsx

# Coverage
npx vitest run --coverage
```

### Current Status

| Suite | Tests | Status |
|---|---|---|
| Unit tests (15 files) | 96 | ✅ All passing |
| Integration tests (4 files) | 84 | ✅ 45 passing, 39 skipped* |
| Component tests (17 files) | 72 | ✅ All passing |

*\*Skipped integration tests require a MySQL `DATABASE_URL`. Run with `DATABASE_URL=mysql://...` to enable.*

---

## 🚢 Deployment & DevOps

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables (from `.env.example`) in the Vercel dashboard under **Settings → Environment Variables**.

### CI/CD Pipeline (GitHub Actions)

```
Push → Lint + Type Check → Unit Tests → Build → Deploy to Vercel
```

### Environment Targets

| Environment | Branch | Host |
|---|---|---|
| Preview | `feature/*` | `*.vercel.app` (auto) |
| Production | `main` | Custom domain (Cloudflare) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow existing folder structure and naming conventions
4. Write tests for new API routes and utility functions
5. Ensure `npm run build` passes (compilation + type-check)
6. Submit a pull request against `main`

---

**Ethio Agency Hub** — Modernizing Ethiopian foreign employment agencies through technology.

*Version: 3.0.0 | Last Updated: June 2026*
