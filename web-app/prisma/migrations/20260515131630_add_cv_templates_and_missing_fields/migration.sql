-- AlterTable
ALTER TABLE "Employee" ADD COLUMN "kebele" TEXT;
ALTER TABLE "Employee" ADD COLUMN "medicalHistory" TEXT;
ALTER TABLE "Employee" ADD COLUMN "passportIssuingDate" DATETIME;
ALTER TABLE "Employee" ADD COLUMN "passportPlaceOfIssue" TEXT;
ALTER TABLE "Employee" ADD COLUMN "pdfDocuments" TEXT;
ALTER TABLE "Employee" ADD COLUMN "psychInterviewData" TEXT;
ALTER TABLE "Employee" ADD COLUMN "religion" TEXT;

-- AlterTable
ALTER TABLE "GeneratedCv" ADD COLUMN "layout" TEXT;
ALTER TABLE "GeneratedCv" ADD COLUMN "style" TEXT;

-- CreateTable
CREATE TABLE "CVTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "layout" TEXT NOT NULL DEFAULT 'bilingual',
    "style" TEXT NOT NULL DEFAULT 'standard',
    "logoUrl" TEXT,
    "companyName" TEXT,
    "companyAddress" TEXT,
    "companyPhone" TEXT,
    "companyEmail" TEXT,
    "companyWebsite" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#1e40af',
    "accentColor" TEXT NOT NULL DEFAULT '#059669',
    "fontSize" TEXT NOT NULL DEFAULT 'normal',
    "showPassportPhoto" BOOLEAN NOT NULL DEFAULT true,
    "showFullBodyPhoto" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "CVTemplate_agencyId_idx" ON "CVTemplate"("agencyId");
