# 📊 Ethio Agency Hub — Project Tracking & Estimate

> **Last Updated:** 2026-05-12
> **Overall Completion:** ~72%

---

## Phase Breakdown

| Phase | Status | Completion |
|---|---|---|
| Foundation & Architecture | ✅ Complete | 100% |
| Core Backend API (CRUD + Auth) | ✅ Substantially Complete | 90% |
| Hybrid Storage (Telegram + Teledrive) | 🟡 Partially Complete | 70% |
| Frontend UI Components | 🟡 Partially Complete | 60% |
| Core Business Modules | 🟡 Partially Complete | 65% |
| Testing | 🟡 Partial | 45% |
| CI/CD & DevOps | 🟡 Partial | 50% |
| Documentation & Guides | ✅ Well Documented | 85% |

---

## ✅ Completed Tasks

### Foundation
- [x] Next.js 14 App Router + Vite + TypeScript strict
- [x] Prisma ORM + SQLite (dev) / MySQL (production)
- [x] All DB models: Agency, Employee, EmployeeDraft, Document, Travel, Agent, User, AuditLog, Institution, Pilgrim, RefreshToken, GeneratedCv, VisaApplication, MolsRecord, CrossMatchResult
- [x] Docker + docker-compose
- [x] Multi-tenant architecture with agency-level data isolation
- [x] Middleware route protection

### Auth & Security
- [x] JWT session tokens (15min) + refresh tokens (7d) with rotation
- [x] bcrypt password hashing (12 rounds)
- [x] CSRF protection (cookie + header)
- [x] RBAC: SUPER_ADMIN → AGENCY_ADMIN → AGENT → VIEWER
- [x] Login API with demo mode fallback
- [x] Logout API
- [x] Token refresh API
- [x] Registration API
- [x] Rate limiting on login

### Backend API Routes
- [x] Auth: login, logout, refresh, register
- [x] Employees: CRUD, search, stats, multi-step registration, drafts
- [x] Documents: CRUD, cross-match
- [x] Travel: CRUD, today departures, booking, stats
- [x] Hajj & Umrah: CRUD, pilgrim management
- [x] Institutions: CRUD
- [x] Agents: CRUD, employee selection with conflict detection
- [x] Reporting: overview, employee reports, document reports, financial reports, CSV export
- [x] Admin: users, audit logs, system settings
- [x] Upload: Teledrive + Telegram routing
- [x] Telegram: webhook, upload, interview, video streaming proxy
- [x] Billing: plans, payment initiation
- [x] CVs: CRUD
- [x] Integration bridge: MOLS approved, visa approved, cross-match pass/fail

### Hybrid Storage
- [x] Teledrive FS watcher with debouncing
- [x] Teledrive sync status manager
- [x] Telegram bot video upload with retry
- [x] JWT-gated video streaming proxy

### Frontend Components Built
- [x] Layout: app-shell, sidebar, user-menu, language-selector
- [x] Dashboard: overview, tabs, trends, tasks, activities
- [x] Auth: login form, register page, auth layout
- [x] Employee: management module, card, registration wizard, form fields, passport scanner, CV generator
- [x] Documents: management module, overview, upload, visa, MOLS, missing report, cross-match, visa timeline
- [x] Travel: management module
- [x] Hajj & Umrah: module, pilgrim register/detail, requirements, documentation, management
- [x] Institutions: module, detail, partners, collaboration
- [x] Agents: module
- [x] Reporting: module, dashboard, analytics, financial, export, employee reports, document reports
- [x] Settings: user settings, profile, security, notifications, language, system
- [x] Administration: module, users, roles-permissions, settings, logs, audit, billing, admin panel

### Configuration
- [x] Multi-language support (EN, AM, OM, AR)
- [x] Ethiopian regions/zones, job roles, 160+ countries, languages list
- [x] Subscription plans (3 tiers)
- [x] Role-based permissions matrix
- [x] Mock data for development

### Testing
- [x] Vitest configuration
- [x] 12 unit test files
- [x] Playwright E2E smoke test

### DevOps
- [x] Dockerfile
- [x] docker-compose.yml
- [x] GitHub Actions CI workflow
- [x] Vercel + Netlify configs

---

## 🟡 In Progress / Partially Complete

| Task | Assignee | Status | Priority |
|---|---|---|---|
| Travel detailed pages | Backend | Scaffold only | P1 |
| Hajj/Umrah detailed sub-routes | Backend | Scaffold only | P1 |
| Institution partner/collab endpoints | Backend | Scaffold only | P1 |
| Agent performance/contract/training endpoints | Backend | Scaffold only | P1 |
| WhatsApp notification wiring | Backend | Service ready, not wired | P1 |
| CV preview/download/share pages | Frontend | Component exists | P1 |
| CV Database skill matching | Frontend+Backend | Component exists, engine needed | P2 |
| Dashboard real-time data | Frontend | Mock data | P1 |
| Passport OCR (Tesseract) | Backend | Dep listed, not integrated | P2 |
| Payment webhook handlers | Backend | Skeleton only | P1 |
| Teledrive production hardening | Backend | Works, needs error recovery | P2 |
| Integration tests | Testing | Not started | P1 |
| Component tests | Testing | Not started | P2 |

---

## ❌ Not Started

| Task | Priority | Est. Effort |
|---|---|---|
| AI-powered employee matching | P3 | 3-5 days |
| Predictive analytics | P3 | 3-5 days |
| React Native mobile app | P3 | 2-3 weeks |
| GraphQL API layer | P3 | 2-3 days |
| Blockchain document verification | P3 | 3-5 days |
| MFA via TOTP | P2 | 1 day |
| Dark/light mode | P2 | 1 day |
| Toast/Snackbar notifications | P2 | 1 day |
| Loading/skeleton states | P2 | 1 day |
| PDF generation (jspdf) | P2 | 1-2 days |
| SSL/TLS setup | P1 | 0.5 day |
| Logging & monitoring (Grafana/etc) | P2 | 1-2 days |

---

## Remaining Work Plan (Priority Order)

### Sprint 1: Critical Completions (Backend)
1. Complete travel sub-routes (ticket booking, detailed travel records)
2. Complete agent sub-routes (performance metrics, contracts)
3. Wire WhatsApp notifications to registration/document/travel flows
4. Payment webhook handlers for Telebirr/CBE/Awash
5. Embassy/MOLS bridge integration
6. Passport OCR with tesseract.js
7. MOLS sync detailed tracking - All stages monitoring
8. Missing report workflow - Full CRUD with status tracking
9. Employee task/activity dashboard - Real-time status pipeline
10. MOLS record fields: employeeId, contractNumber, moDate, passportNumber, visaType, destination, status, healthCertVerified, insuranceVerified, cocVerified, visaUnlocked, syncDate, agencyId
11. Missing report fields: employeeId, reason, reportedTo, status, reportDate, resolvedDate, agencyId
12. Employee status pipeline: REGISTERED → DOCUMENT_REVIEW → MOLS_PENDING → INTERVIEW_UPLOADED → TRAVEL_READY → DEPLOYED → ARCHIVED
13. Document status: PENDING → VERIFIED → REJECTED → EXPIRED
14. Travel status: SCHEDULED → TICKETED → READY → DEPARTED → ARRIVED → CANCELLED
15. Visa stages: DOCUMENT_COLLECTION → PORTAL_REGISTRATION → SUBMITTED_TO_EMBASSY → VISA_APPROVED → REJECTED_CORRECTION
16. MOLS stages: CONTRACT_LINKED → MOFA_AUTHENTICATED → EMBASSY_LEGALIZATION → MOLS_SUBMITTED → APPROVED
17. Cross-match: nameMatch, passportMatch, visaCountryMatch, passportExpiryOk, visaExpiryOk
18. Agent tracking: selectedByAgent, selectedAt, agentPerformance, agentCommission
19. Psychology assessment: psychologyScore, psychologyAnswers, psychologyNotes
20. Dashboard KPIs: employee count by status, document pipeline, today's departures, MOLS pending, missing reports, active agents, revenue
7. MOLS sync detailed tracking - All stages monitoring
8. Missing report workflow - Full CRUD with status tracking
9. Employee task/activity dashboard - Real-time status pipeline
10. MOLS record fields: employeeId, contractNumber, moDate, passportNumber, visaType, destination, status, healthCertVerified, insuranceVerified, cocVerified, visaUnlocked, syncDate, agencyId
11. Missing report fields: employeeId, reason, reportedTo, status, reportDate, resolvedDate, agencyId
12. Employee status pipeline: REGISTERED → DOCUMENT_REVIEW → MOLS_PENDING → INTERVIEW_UPLOADED → TRAVEL_READY → DEPLOYED → ARCHIVED
13. Document status: PENDING → VERIFIED → REJECTED → EXPIRED
14. Travel status: SCHEDULED → TICKETED → READY → DEPARTED → ARRIVED → CANCELLED
15. Visa stages: DOCUMENT_COLLECTION → PORTAL_REGISTRATION → SUBMITTED_TO_EMBASSY → VISA_APPROVED → REJECTED_CORRECTION
16. MOLS stages: CONTRACT_LINKED → MOFA_AUTHENTICATED → EMBASSY_LEGALIZATION → MOLS_SUBMITTED → APPROVED
17. Cross-match: nameMatch, passportMatch, visaCountryMatch, passportExpiryOk, visaExpiryOk
18. Agent tracking: selectedByAgent, selectedAt, agentPerformance, agentCommission
19. Psychology assessment: psychologyScore, psychologyAnswers, psychologyNotes
20. Dashboard KPIs: employee count by status, document pipeline, today's departures, MOLS pending, missing reports, active agents, revenue

### Sprint 2: Frontend Completion
1. Travel management pages (schedule, tickets, departure, arrival)
2. CV Generator (templates, preview, download/share)
3. CV Database (profiles, skill matching, search)
4. Agent detail pages (performance, contracts, onboarding)
5. Institution collaboration & document exchange
6. Dashboard real-time data binding
7. Toast notifications, loading states, error boundaries

### Sprint 3: Quality & Polish
1. Integration tests for all API routes
2. Component tests for key UI modules
3. E2E tests for critical user flows
4. CI/CD pipeline hardening
5. Production deployment setup
6. PDF export for reports

---

## API Routes Map

```
api/
├── auth/
│   ├── login/route.ts          ✅
│   ├── logout/route.ts         ✅
│   ├── register/route.ts       ✅
│   └── refresh/route.ts        ✅
├── employees/
│   ├── route.ts                ✅
│   ├── [id]/route.ts           ✅
│   ├── register/route.ts       ✅
│   ├── drafts/route.ts         ✅
│   ├── drafts/[id]/route.ts    ❌
│   ├── search/route.ts         ✅
│   └── stats/route.ts          ✅
├── documents/
│   ├── route.ts                ✅
│   ├── [id]/route.ts           ✅
│   └── cross-match/route.ts    ✅
├── travel/
│   ├── route.ts                ✅
│   ├── [id]/route.ts           ✅
│   ├── [...slug]/route.ts      🟡 scaffold
│   ├── today/route.ts          ✅ (mock)
│   ├── stats/route.ts          ✅
│   ├── booking/route.ts        🟡 needs completion
│   └── schedule/route.ts       ❌
├── hajj-umrah/
│   ├── route.ts                ✅
│   ├── [id]/route.ts           ✅
│   └── [...slug]/route.ts      🟡 scaffold
├── institutions/
│   ├── route.ts                ✅
│   ├── [id]/route.ts           ✅
│   └── [...slug]/route.ts      🟡 scaffold
├── agents/
│   ├── route.ts                ✅
│   ├── [id]/route.ts           ❌
│   ├── me/route.ts             ✅
│   └── select-employee/route.ts ✅
├── telegram/
│   ├── webhook/route.ts        ✅
│   ├── upload/route.ts         ✅
│   ├── stream/[fileId]/route.ts ✅
│   └── interview/route.ts      ✅
├── upload/
│   └── route.ts                ✅
├── reporting/
│   ├── overview/route.ts       ✅
│   ├── employee-reports/route.ts ✅
│   ├── document-reports/route.ts ✅
│   ├── financial-reports/route.ts ✅
│   └── export/route.ts         ✅
├── administration/
│   └── users/route.ts          ✅
├── settings/
│   └── system/route.ts         ✅
├── billing/
│   ├── plans/route.ts          ✅
│   └── payment/route.ts        🟡
├── audit/
│   └── route.ts                ✅
├── mols/
│   └── route.ts                ✅
├── visa/
│   └── route.ts                ✅
├── integration/
│   └── bridge/route.ts         ✅
├── cvs/
│   └── route.ts                ✅
├── docs/
│   └── route.ts                ✅ (OpenAPI spec)
└── whatsapp/
    └── send/route.ts           ❌
```