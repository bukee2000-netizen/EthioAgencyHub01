# 🌍 Ethio Agency Hub

> **Modernizing Ethiopian foreign employment agencies through technology.**
> A full-stack SaaS platform built for Ethiopian labor recruitment agencies to manage employees, documents, travel, pilgrimages, and institutional partnerships — with a hybrid Telegram + Teledrive media storage strategy.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Site Map](#-structural-site-map)
- [Key Features](#-key-features-by-module)
- [Hybrid Storage System](#-hybrid-storage-system)
- [Development Roadmap](#-development-roadmap)
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
| Expensive video storage for international partners | Free global streaming via Telegram private channels |
| High document storage costs | Unlimited archiving via Teledrive (300 ETB/month) |
| No centralized agency operations view | Real-time KPI dashboard for 50+ agencies |
| Manual travel coordination | Automated departure preparation & ticket management |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR, routing, API routes |
| *Bundler** |  | 
| **Language** | TypeScript (strict) | Type safety |
| **Database** | MySQL + Prisma ORM | Employee/agency relational data |
| **Auth** | JWT + bcrypt | Secure session management |
| **Validation** | Zod | Schema validation |
| **Telegram** | `node-telegram-bot-api` | Interview video uploads & streaming |
| **Teledrive** | Local FS watch + Ethio Telecom Teledrive | Photo/document sync |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Testing** | Vitest + Playwright | Unit + E2E tests |
| **Deployment** | Docker + CI/CD | Containerized deployment |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│              Next.js App Router (SSR + Client Components)           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                          API LAYER                                  │
│                  Next.js API Routes (/app/api/*)                    │
│           Zod Validation │ JWT Middleware │ Role Guards             │
└──────┬───────────────────────┬──────────────────┬───────────────────┘
       │                       │                  │
┌──────▼──────┐    ┌───────────▼──────┐  ┌────────▼────────┐
│   MySQL DB  │    │  Teledrive Sync  │  │  Telegram Bot   │
│  (Prisma)   │    │  (Local FS Watch)│  │  Private Channel│
│             │    │  Photos/Passports│  │  Interview Videos│
│ Employees   │    │  300 ETB/month   │  │  Free streaming  │
│ Agencies    │    │  Unlimited       │  │  @EthioAgency   │
│ Documents   │    └──────────────────┘  │  Hub_Bot        │
│ Travel      │                          └─────────────────┘
│ Pilgrimages │
└─────────────┘
```

### Hybrid Storage Flow

```
Employee Registration
        │
        ├── Photos / Passports ──→ Local Folder ──→ Teledrive Desktop Sync ──→ Ethio Telecom Cloud
        │
        └── Interview Videos ──→ Telegram Bot ──→ Private Channel ──→ tg_video_id saved in MySQL
                                                                              │
                                                              International Partner views via
                                                              authorized Telegram stream
```

---

## 📁 Project Structure

```
ethio-agency-hub/
│
├── app/                              # Next.js App Router root
│   ├── (auth)/                       # Auth route group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── logout/
│   │   │   └── route.ts
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  # Protected route group (shared layout)
│   │   ├── layout.tsx                # Dashboard shell: sidebar, topbar
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Main KPI dashboard
│   │   │   ├── trends/page.tsx
│   │   │   ├── tasks/page.tsx
│   │   │   └── activities/page.tsx
│   │   │
│   │   ├── employee-management/
│   │   │   ├── page.tsx              # Employee overview
│   │   │   ├── registration/
│   │   │   │   ├── layout.tsx        # Wizard step layout
│   │   │   │   ├── personal/page.tsx
│   │   │   │   ├── skills/page.tsx
│   │   │   │   ├── documents/page.tsx
│   │   │   │   └── review/page.tsx
│   │   │   ├── cv-generator/
│   │   │   │   ├── templates/page.tsx
│   │   │   │   ├── preview/page.tsx
│   │   │   │   └── download-share/page.tsx
│   │   │   ├── cv-database/
│   │   │   │   ├── employee-profiles/page.tsx
│   │   │   │   ├── skill-matching/page.tsx
│   │   │   │   └── search/page.tsx
│   │   │   └── [id]/page.tsx         # Dynamic employee profile
│   │   │
│   │   ├── documents/
│   │   │   ├── page.tsx
│   │   │   ├── upload/page.tsx
│   │   │   ├── visa/page.tsx
│   │   │   ├── mols/page.tsx
│   │   │   ├── missing-report/page.tsx
│   │   │   ├── cross-match/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── travel/
│   │   │   ├── page.tsx
│   │   │   ├── schedule/page.tsx
│   │   │   ├── ticket/page.tsx
│   │   │   ├── today/page.tsx
│   │   │   ├── departure/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── hajj-umrah/
│   │   │   ├── page.tsx
│   │   │   ├── pilgrim-detail/page.tsx
│   │   │   ├── requirements/page.tsx
│   │   │   ├── documentation/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── institutions/
│   │   │   ├── page.tsx
│   │   │   ├── institution-detail/page.tsx
│   │   │   ├── partners/page.tsx
│   │   │   ├── collaboration/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── agents/
│   │   │   ├── page.tsx
│   │   │   ├── agent-detail/page.tsx
│   │   │   ├── performance/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── training/page.tsx
│   │   │   ├── support/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── administration/
│   │   │   ├── page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── roles-permissions/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── logs/page.tsx
│   │   │   └── audit/page.tsx
│   │   │
│   │   ├── reporting-analytics/
│   │   │   ├── page.tsx
│   │   │   ├── overview/page.tsx
│   │   │   ├── employee-reports/page.tsx
│   │   │   ├── document-reports/page.tsx
│   │   │   ├── financial-reports/page.tsx
│   │   │   └── export/page.tsx
│   │   │
│   │   └── user-settings/
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── security/page.tsx
│   │       └── notifications/page.tsx
│   │
│   └── api/                          # Next.js API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── register/route.ts
│       ├── employees/
│       │   ├── route.ts              # GET list, POST create
│       │   ├── [id]/route.ts         # GET, PUT, DELETE by ID
│       │   └── register/route.ts     # Multi-step registration handler
│       ├── documents/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── cross-match/route.ts
│       ├── travel/
│       │   └── [...slug]/route.ts
│       ├── hajj-umrah/
│       │   └── [...slug]/route.ts
│       ├── institutions/
│       │   └── [...slug]/route.ts
│       ├── agents/
│       │   └── [...slug]/route.ts
│       ├── telegram/
│       │   ├── webhook/route.ts      # Telegram bot webhook
│       │   └── stream/[fileId]/route.ts  # Proxy video stream
│       └── upload/
│           └── route.ts             # Teledrive sync upload handler
│
├── components/                       # Shared UI components
│   ├── ui/                           # Base design system (Button, Input, Modal…)
│   ├── layout/                       # Sidebar, Topbar, PageHeader
│   ├── dashboard/                    # KPI cards, charts, activity feed
│   ├── employee/                     # Employee cards, wizard steps
│   ├── documents/                    # Document viewer, upload zone
│   ├── travel/                       # Travel timeline, departure cards
│   ├── hajj-umrah/                   # Pilgrim registration components
│   ├── telegram/                     # Video player proxy, interview trigger
│   └── forms/                        # Reusable form primitives
│
├── lib/                              # Pure logic — no React
│   ├── auth/
│   │   ├── jwt.ts                    # Sign/verify JWT
│   │   ├── password.ts               # bcrypt helpers
│   │   └── middleware.ts             # Route protection
│   ├── db/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── queries/                  # Reusable DB query functions
│   ├── telegram/
│   │   ├── bot.ts                    # Bot instance + helpers
│   │   └── channel.ts               # Channel media management
│   ├── teledrive/
│   │   └── watcher.ts               # FS watcher for sync folder
│   ├── validations/                  # Zod schemas
│   │   ├── employee.schema.ts
│   │   ├── document.schema.ts
│   │   └── auth.schema.ts
│   └── utils/                        # General utilities
│       ├── format.ts
│       └── errors.ts
│
├── prisma/
│   ├── schema.prisma                 # DB models
│   └── migrations/                   # Migration history
│
├── public/                           # Static assets
│   └── icons/
│
├── styles/
│   └── globals.css                   # Tailwind base + CSS vars
│
├── types/                            # Global TypeScript types
│   ├── api.ts
│   ├── employee.ts
│   └── telegram.ts
│
├── config/
│   ├── site.ts                       # App metadata
│   └── permissions.ts                # Role/permission maps
│
├── tests/
│   ├── unit/                         # Vitest unit tests
│   ├── integration/                  # API integration tests
│   └── e2e/                          # Playwright end-to-end tests
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .env.example
├── .env.local                        # ← never commit
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 🗂️ Structural Site Map

```
Ethio Agency Hub
├── 🔐 Authentication
│   ├── /login
│   ├── /logout
│   └── /register                    (admin only)
│
├── 📊 Dashboard
│   ├── /dashboard                   (KPIs, today's departures, quick actions)
│   ├── /dashboard/trends
│   ├── /dashboard/tasks
│   └── /dashboard/activities
│
├── 👥 Employee Management
│   ├── /employee-management
│   ├── /employee-management/registration
│   │   ├── /personal
│   │   ├── /skills
│   │   ├── /documents               (Teledrive sync + Telegram interview trigger)
│   │   └── /review
│   ├── /employee-management/cv-generator
│   │   ├── /templates
│   │   ├── /preview
│   │   └── /download-share
│   ├── /employee-management/cv-database
│   │   ├── /employee-profiles
│   │   ├── /skill-matching
│   │   └── /search
│   └── /employee-management/[id]
│
├── 📄 Document Management
│   ├── /documents
│   ├── /documents/upload
│   ├── /documents/visa
│   ├── /documents/mols
│   ├── /documents/missing-report
│   ├── /documents/cross-match
│   └── /documents/[id]
│
├── ✈️ Travel Management
│   ├── /travel
│   ├── /travel/schedule
│   ├── /travel/ticket
│   ├── /travel/today
│   ├── /travel/departure
│   └── /travel/[id]
│
├── 🕋 Hajj & Umrah Management
│   ├── /hajj-umrah
│   ├── /hajj-umrah/pilgrim-detail
│   ├── /hajj-umrah/requirements
│   ├── /hajj-umrah/documentation
│   └── /hajj-umrah/[id]
│
├── 🏢 Institution Management
│   ├── /institutions
│   ├── /institutions/institution-detail
│   ├── /institutions/partners
│   ├── /institutions/collaboration
│   └── /institutions/[id]
│
├── 👤 Agent Management
│   ├── /agents
│   ├── /agents/agent-detail
│   ├── /agents/performance
│   ├── /agents/onboarding
│   ├── /agents/training
│   ├── /agents/support
│   └── /agents/[id]
│
├── ⚙️ Administration
│   ├── /administration
│   ├── /administration/users
│   ├── /administration/roles-permissions
│   ├── /administration/settings
│   ├── /administration/logs
│   └── /administration/audit
│
├── 📈 Reporting & Analytics
│   ├── /reporting-analytics
│   ├── /reporting-analytics/overview
│   ├── /reporting-analytics/employee-reports
│   ├── /reporting-analytics/document-reports
│   ├── /reporting-analytics/financial-reports
│   └── /reporting-analytics/export
│
└── 👤 User Settings
    ├── /user-settings
    ├── /user-settings/profile
    ├── /user-settings/security
    └── /user-settings/notifications
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
- **Hybrid upload**: photos/passports → Teledrive; interview videos → Telegram bot
- Professional CV generator with exportable templates
- Skill-matching engine for deployment opportunities
- Full employee lifecycle status tracking

### 📄 Document Management
- Secure file upload routed to Teledrive sync folder
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

## 🔗 Hybrid Storage System

This is the core architectural innovation that keeps operating costs low while enabling free global video streaming for international partners.

### Storage Routing Logic

| File Type | Destination | Cost | Why |
|---|---|---|---|
| Photos, Passports, PDFs | Local FS → Teledrive Desktop Sync | ~300 ETB/month (unlimited) | Fast local access, cheap cloud backup |
| Interview Videos | Telegram Bot → Private Channel | Free | Global CDN, no storage cost, streamable anywhere |

### Implementation

```javascript
// /app/api/employees/register/route.ts
import { bot } from '@/lib/telegram/bot';
import { db } from '@/lib/db/prisma';
import { uploadSchema } from '@/lib/validations/employee.schema';

export async function POST(req: Request) {
  const formData = await req.formData();
  const photo = formData.get('photo') as File;
  const video = formData.get('video') as File;
  const { name, agency_id } = uploadSchema.parse(Object.fromEntries(formData));

  // Photo goes to Teledrive-monitored folder
  const photoPath = await saveToTeledriveFolder(photo);

  // Video goes to Telegram for free global CDN streaming
  const tgRes = await bot.sendVideo(process.env.TG_CHANNEL_ID!, videoBuffer);
  const tg_video_id = tgRes.video.file_id;

  // Save both references to MySQL
  const employee = await db.employee.create({
    data: { name, agency_id, doc_path: photoPath, tg_video_id }
  });

  return Response.json({ success: true, employee });
}
```

### Telegram Resources
- **Channel**: [EthioAgencyHub](https://t.me/+nSnc_vQGfuQ3Y2Jk)
- **Bot**: `@EthioAgencyHub_Bot`

---

## 🚀 Development Roadmap

### Phase 1: Foundation — 🔄 Refactoring to Next.js
- [ ] Migrate to **Next.js 14 App Router** from previous framework
- [ ] Initialize **Vite** as the primary bundler for local development
- [ ] Configure **MySQL** connection pool (Prisma) for employee and agency data
- [ ] Set up `.env` for **Telegram Bot Token**, **TG Channel ID**, and **Teledrive Sync Path**
- [ ] Scaffold folder structure per this README

### Phase 2: Hybrid Storage Integration
- [x] **Telegram Integration**: Connect `@EthioAgencyHub_Bot` to handle employee short interview uploads
- [ ] **Teledrive Bridge**: Implement local file-system watcher to sync `UPLOAD_PATH` with Ethio Telecom Teledrive Desktop
- [ ] **Video Streaming**: Implement Telegram proxy endpoint (`/api/telegram/stream/[fileId]`) for authenticated international partner viewing

### Phase 3: Core Modules — 🔄 In Progress
- [ ] **Employee Registration**: Update document upload step to save photos to the Teledrive sync folder
- [ ] **Interview Module**: Create UI to trigger `@EthioAgencyHub_Bot` to record employee video introductions
- [ ] **Dashboard**: Real-time KPI dashboard supporting 50+ agencies (multi-tenant)
- [ ] **Document Management**: Full MOLS integration + cross-match verification
- [ ] **CV Generator**: PDF export with agency-branded templates

### Phase 4: Integration & Deployment — Planned
- [ ] **Teledrive Sync Optimization**: Ensure 300 ETB/month unlimited plan is fully utilized
- [ ] **Private Channel Security**: Lock Telegram media to authorized agency IDs only (JWT-gated proxy)
- [ ] **MOLS / Embassy Integration**: Live API connections to government systems
- [ ] **Hajj & Umrah Module**: Full pilgrim season management
- [ ] **Reporting & Analytics**: Full dashboard with export

### Phase 5: Future Enhancements
- [ ] AI-powered employee-to-opportunity matching
- [ ] Predictive analytics (deployment trends, document processing time)
- [ ] React Native mobile app with offline sync
- [ ] GraphQL API layer
- [ ] Blockchain document verification

---

## ⚡ Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+
- Ethio Telecom Teledrive Desktop (installed and signed in)
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ethioagencyhub/ethio-agency-hub.git
cd ethio-agency-hub

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# → Edit .env.local with your values (see below)

# 4. Set up the database
npx prisma migrate dev --name init
npx prisma generate

# 5. Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

```env
# .env.local

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Auth
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Database
DATABASE_URL=mysql://user:password@localhost:3306/ethio_agency_hub

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TG_CHANNEL_ID=-100xxxxxxxxxx        # Private channel numeric ID

# Teledrive / File Storage
UPLOAD_PATH=/path/to/teledrive/sync/folder   # Monitored by Teledrive Desktop
MAX_FILE_SIZE_MB=50
```

---

## 🗄️ Database Schema Overview

```prisma
// prisma/schema.prisma (abbreviated)

model Agency {
  id         String     @id @default(cuid())
  name       String
  employees  Employee[]
  agents     Agent[]
  users      User[]
  createdAt  DateTime   @default(now())
}

model Employee {
  id          String   @id @default(cuid())
  agency      Agency   @relation(fields: [agency_id], references: [id])
  agency_id   String
  name        String
  doc_path    String?  // Teledrive sync path
  tg_video_id String?  // Telegram file_id for interview video
  status      EmployeeStatus
  skills      Skill[]
  documents   Document[]
  travels     Travel[]
  createdAt   DateTime @default(now())
}

model Document {
  id          String   @id @default(cuid())
  employee    Employee @relation(fields: [employee_id], references: [id])
  employee_id String
  type        DocumentType  // PASSPORT | VISA | MOLS | MEDICAL | ...
  file_path   String
  status      DocumentStatus
  expiresAt   DateTime?
}

model Travel {
  id          String   @id @default(cuid())
  employee    Employee @relation(fields: [employee_id], references: [id])
  employee_id String
  destination String
  departureAt DateTime
  status      TravelStatus
  ticket      String?
}

model User {
  id        String   @id @default(cuid())
  agency    Agency   @relation(fields: [agency_id], references: [id])
  agency_id String
  email     String   @unique
  password  String   // bcrypt hashed
  role      Role     // SUPER_ADMIN | AGENCY_ADMIN | AGENT | VIEWER
}
```

---

## 🌐 API Design

All API routes live under `/app/api/`. They follow RESTful conventions and return JSON.

```
GET    /api/employees              → list employees (with pagination, filters)
POST   /api/employees/register     → multi-step registration
GET    /api/employees/[id]         → single employee
PUT    /api/employees/[id]         → update employee
DELETE /api/employees/[id]         → soft delete

POST   /api/upload                 → save file to Teledrive sync folder
POST   /api/telegram/webhook       → Telegram bot webhook receiver
GET    /api/telegram/stream/[id]   → JWT-gated Telegram video proxy

GET    /api/documents              → list documents
POST   /api/documents/cross-match  → trigger document verification

GET    /api/travel                 → travel records
GET    /api/travel/today           → today's departures

POST   /api/auth/login             → issue JWT
POST   /api/auth/logout            → invalidate session
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 120 }
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
- **JWT-based auth** with short-lived access tokens + refresh token rotation
- **RBAC**: `SUPER_ADMIN` → `AGENCY_ADMIN` → `AGENT` → `VIEWER`
- **bcrypt** password hashing (cost factor 12)
- Planned: MFA via TOTP

### Data Protection
- **Agency data isolation**: each agency only sees its own data (Prisma-level tenant filtering)
- **Zod validation** on all API inputs
- **CSRF protection** via SameSite cookies
- **Prisma ORM** prevents SQL injection
- **Secure headers** via Next.js middleware

### Telegram Channel Security
- All media in a private Telegram channel
- Backend proxy at `/api/telegram/stream/[fileId]` validates JWT before forwarding stream
- Agency ID checked before returning any media

---

## 🧪 Testing Strategy

```bash
# Unit tests (Vitest)
npm run test

# Integration tests
npm run test:integration

# End-to-end tests (Playwright)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Coverage Targets

| Layer | Target |
|---|---|
| Lib / utilities | 90%+ |
| API routes | 80%+ |
| UI components | 70%+ |
| E2E critical flows | 100% of happy paths |

---

## 🚢 Deployment & DevOps

```bash
# Build
npm run build

# Docker
docker-compose up --build

# Production
docker-compose up -d
```

### CI/CD Pipeline (GitHub Actions)

```
Push → Lint + Type Check → Unit Tests → Build → E2E Tests → Deploy
```

### Environment Targets

| Environment | Branch | Purpose |
|---|---|---|
| Development | `feature/*` | Local dev |
| Staging | `develop` | QA testing |
| Production | `main` | Live system |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the existing folder structure and naming conventions
4. Write tests for new API routes and utility functions
5. Ensure `npm run lint && npm run type-check` passes
6. Submit a pull request against `develop`

---

## 📞 Support & Contact

| Channel | Link |
|---|---|
| Email | support@ethioagencyhub.com |
| Documentation | https://docs.ethioagencyhub.com |
| Issue Tracker | https://github.com/ethioagencyhub/issues |
| Community | https://community.ethioagencyhub.com |
| Telegram | [@EthioAgencyHub](https://t.me/+nSnc_vQGfuQ3Y2Jk) |

---

**Ethio Agency Hub** — Modernizing Ethiopian foreign employment agencies through technology.

*Version: 2.0.0 | Last Updated: May 2025*
