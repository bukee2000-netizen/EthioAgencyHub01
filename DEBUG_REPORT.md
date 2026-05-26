# 🔧 Debug Report — Ethio Agency Hub

> **Date:** 2026-05-25
> **Method:** Static code analysis (runtime environment unavailable)

---

## ✅ Issues Fixed

### 1. Prisma Schema — Broken Indentation
**File:** `web-app/prisma/schema.prisma:438-439`  
**Problem:** `CrossMatchResult` model had `@@index` directives with invalid indentation (0 and 3 spaces instead of the standard 2 spaces). This would cause `prisma generate` to fail.  
**Fix:** Normalized indentation to 2 spaces for both index lines.

### 2. ESM `require()` in TypeScript File
**File:** `web-app/lib/payments/webhook.ts:78`  
**Problem:** Used `require('crypto')` inside a `.ts` file. Next.js with ESNext module resolution does not support `require()` in TypeScript files. Would cause a runtime crash when `verifyWebhookSignature()` is called.  
**Fix:** Replaced with `import crypto from 'node:crypto'` at the top of the file.

### 3. Env Var Name Mismatch — `MAX_FILE_SIZE`
**File:** `web-app/.env` / `web-app/lib/telegram/config.ts:12`  
**Problem:** `.env` defined `MAX_FILE_SIZE_MB=50` but code reads `process.env.MAX_FILE_SIZE` (without `_MB`). The Telegram config always fell back to 100MB default, ignoring the configured 50MB limit.  
**Fix:** Added `MAX_FILE_SIZE=52428800` (50MB in bytes) to `.env`.

### 4. Upload Path User Mismatch
**File:** `web-app/.env:7`  
**Problem:** `UPLOAD_PATH` pointed to `/Users/Administrator/Desktop/...` but the current system user is `HP 11`. All file operations (Teledrive watcher, document uploads) would fail or write to a non-existent directory.  
**Fix:** Updated to `C:/Users/HP 11/Desktop/EthioAgencyHub/uploads`.

---

## ⚠️ Issues Found — Not Fixed

### P1 — Blocking Runtime Errors

#### 5. Session Payload Missing Email Field
**Files:** `web-app/lib/auth/jwt.ts:4-9`, `web-app/components/layout/app-shell.tsx:66`  
**Problem:** `SessionPayload` type only contains `userId`, `agencyId`, `role`. The AppShell passes `session.userId` as the `email` prop to `UserMenu`, which displays it as "Email". Users will see their internal user ID (e.g., `clyx...`) where their email should be shown.  
**Impact:** UI shows incorrect data (user ID instead of email).  
**Suggested fix:** Either add `email` to `SessionPayload`, or fetch user details separately.

### P2 — Functional Gaps

#### 6. System Settings Not Persisted
**File:** `web-app/app/api/settings/system/route.ts`  
**Problem:** The settings endpoint writes to `process.env` (runtime mutable) which does not persist across server restarts or across modules. Settings are lost on every deployment/restart.  
**Impact:** Configuration changes are temporary.  
**Suggested fix:** Store settings in the database (new `SystemSetting` model).

#### 7. Reporting Export Returns Mock Data
**File:** `web-app/app/api/reporting/export/route.ts`  
**Problem:** The export endpoint always returns `source: 'mock'` — real CSV/PDF generation is not implemented.  
**Impact:** Users cannot download actual reports.

### P3 — Minor Issues

#### 8. Agent Model Too Sparse
**File:** `web-app/prisma/schema.prisma:227-240`  
**Problem:** Agent model only has `name`, `phone`, `active`. Missing: commission, territory, hierarchy, performance metrics. Agent performance endpoints in `app/api/agents/[...slug]/route.ts` likely compute from aggregated data rather than stored fields.

#### 9. Pilgrim Model Minimal
**File:** `web-app/prisma/schema.prisma:292-308`  
**Problem:** Pilgrim model missing package, group, accommodation, transport relationships. The Hajj/Umrah domain needs significant schema expansion.

#### 10. No Cascade Deletes
**Problem:** No `onDelete: Cascade` defined on any Prisma relation. Deleting an Agency with related records will fail with foreign key constraint errors.

---

## 📋 Quick Reference: All Issues by Severity

| # | Severity | Area | Description | Status |
|---|----------|------|-------------|--------|
| 1 | **Critical** | Prisma Schema | Broken `@@index` indentation in `CrossMatchResult` | ✅ Fixed |
| 2 | **Critical** | Payments | `require('crypto')` in ESM TypeScript file | ✅ Fixed |
| 3 | **Medium** | Env Config | `MAX_FILE_SIZE` env var name mismatch | ✅ Fixed |
| 4 | **Medium** | Env Config | Upload path pointed to wrong user directory | ✅ Fixed |
| 5 | **Medium** | UI Data | Session payload has no email — shown as user ID | ⚠️ Open |
| 6 | **Medium** | Settings | System settings not persisted (writes to process.env) | ⚠️ Open |
| 7 | **Medium** | API | Reporting export returns mock data only | ⚠️ Open |
| 8 | **Low** | Schema | Agent model too sparse | ⚠️ Open |
| 9 | **Low** | Schema | Pilgrim model minimal | ⚠️ Open |
| 10 | **Low** | Schema | No cascade deletes | ⚠️ Open |

---

## 📊 Code Health Summary

| Metric | Value |
|--------|-------|
| Critical bugs found | 2 (both fixed) |
| Medium bugs found | 3 (2 fixed, 1 open) |
| Low severity issues | 3 (all open) |
| Files modified | 3 (`schema.prisma`, `webhook.ts`, `.env`) |
| Issues remaining | 6 |
