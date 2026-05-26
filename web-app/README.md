# Ethio Agency Hub Web App

A Next.js 14 TypeScript implementation scaffolded from the root README.

## Included

- App Router dashboard shell
- Auth login screen
- Core module pages for employees, documents, travel, Hajj/Umrah, institutions, agents, administration, and analytics
- Mock KPI/activity/employee data
- API route stubs following the documented response shape
- Prisma schema for MySQL agency, user, employee, document, travel, and agent records
- JWT and bcrypt helper functions
- Zod validation schemas
- Teledrive upload and Telegram route scaffolds
- Prisma-backed employee and document APIs with mock fallback
- Cookie-based login/logout endpoint and protected dashboard middleware
- Telegram short interview upload to private channel via Bot API
- Telegram file proxy stream endpoint using saved `file_id`
- Tailwind CSS styling

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database setup

Create `.env.local` from `.env.example`, then set `DATABASE_URL`.

```bash
npm run db:generate
npm run db:migrate -- --name init
```

The Prisma schema is in `prisma/schema.prisma`.

## Telegram short video setup

Set these values in `.env.local` or your hosting provider:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TG_CHANNEL_ID=-100xxxxxxxxxx
TELEGRAM_SHORT_VIDEO_MAX_MB=50
```

The bot must be added to the private channel and granted permission to post videos.

Upload endpoint:

```http
POST /api/telegram/interview
Content-Type: multipart/form-data

video=<video file>
employeeId=<optional employee database id>
employeeName=<optional caption name>
```

Generic `/api/upload` also routes `video/*` files to Telegram and non-video files to Teledrive.

## Security note

The project is pinned to Next.js `14.2.35` to match the requested Next 14 App Router stack. `npm audit` still reports advisories that npm only resolves with a breaking upgrade to Next 16. Review that upgrade before production release.

## Next implementation steps

- Replace remaining mock dashboard data with tenant-filtered Prisma queries
- Add role-specific authorization checks beyond session presence
- Add authenticated authorization checks to Telegram stream access
- Connect Teledrive upload UI to employee document workflows
- Add Vitest and Playwright coverage
