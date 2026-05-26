-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "nationality" TEXT,
    "region" TEXT,
    "zone" TEXT,
    "woreda" TEXT,
    "contactPhone" TEXT,
    "alternatePhone" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "emergencyRelation" TEXT,
    "nationalId" TEXT,
    "laborId" TEXT,
    "passportNumber" TEXT,
    "passportExpiryDate" DATETIME,
    "fatherName" TEXT,
    "motherName" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankBranch" TEXT,
    "role" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "destination" TEXT,
    "languages" TEXT,
    "additionalSkills" TEXT,
    "psychologyScore" INTEGER,
    "psychologyAnswers" TEXT,
    "psychologyNotes" TEXT,
    "docPath" TEXT,
    "tgVideoId" TEXT,
    "passportSizePhotoPath" TEXT,
    "fullBodyPhotoPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "selectedByAgent" TEXT,
    "selectedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "personal" TEXT NOT NULL,
    "skills" TEXT,
    "documents" TEXT,
    "step" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmployeeDraft_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Travel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "ticket" TEXT,
    "airline" TEXT,
    "flightNumber" TEXT,
    "departureTime" TEXT,
    "arrivalTime" TEXT,
    "origin" TEXT,
    "terminal" TEXT,
    "class" TEXT,
    "ticketCost" REAL,
    "currency" TEXT,
    "paymentStatus" TEXT DEFAULT 'pending',
    "bookingReference" TEXT,
    "localAgentId" TEXT,
    "localAgentName" TEXT,
    "assignedStaffId" TEXT,
    "assignedStaffName" TEXT,
    "inCountryStaff" TEXT,
    "transitStatus" JSONB,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Travel_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Agent_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "contact" TEXT,
    "country" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pilgrim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passportNo" TEXT,
    "groupName" TEXT,
    "season" TEXT,
    "requirements" JSONB,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "departureDate" DATETIME,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GeneratedCv" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "pdfData" BLOB,
    "htmlContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'generated',
    "generatedBy" TEXT,
    "downloadedAt" DATETIME,
    "sharedWith" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GeneratedCv_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VisaApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "embassy" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'DOCUMENT_COLLECTION',
    "docPassport" TEXT NOT NULL DEFAULT 'pending',
    "docMedical" TEXT NOT NULL DEFAULT 'pending',
    "docPolice" TEXT NOT NULL DEFAULT 'pending',
    "docContract" TEXT NOT NULL DEFAULT 'pending',
    "docPhotos" TEXT NOT NULL DEFAULT 'pending',
    "docInsurance" TEXT NOT NULL DEFAULT 'pending',
    "docCertificate" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "molsUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "ticketNotified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VisaApplication_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MolsRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'CONTRACT_LINKED',
    "healthCert" BOOLEAN NOT NULL DEFAULT false,
    "insurance" BOOLEAN NOT NULL DEFAULT false,
    "coc" BOOLEAN NOT NULL DEFAULT false,
    "visaUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MolsRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrossMatchResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "allPass" BOOLEAN NOT NULL DEFAULT false,
    "nameMatch" BOOLEAN NOT NULL DEFAULT true,
    "passportMatch" BOOLEAN NOT NULL DEFAULT true,
    "visaCountryMatch" BOOLEAN NOT NULL DEFAULT true,
    "passportExpiryOk" BOOLEAN NOT NULL DEFAULT true,
    "visaExpiryOk" BOOLEAN NOT NULL DEFAULT true,
    "errors" TEXT,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CrossMatchResult_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentWebhook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "status" TEXT NOT NULL,
    "reference" TEXT,
    "metadata" JSONB,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Agency_deletedAt_idx" ON "Agency"("deletedAt");

-- CreateIndex
CREATE INDEX "Employee_agencyId_idx" ON "Employee"("agencyId");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "Employee_deletedAt_idx" ON "Employee"("deletedAt");

-- CreateIndex
CREATE INDEX "Employee_selectedByAgent_idx" ON "Employee"("selectedByAgent");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "EmployeeDraft_agencyId_idx" ON "EmployeeDraft"("agencyId");

-- CreateIndex
CREATE INDEX "EmployeeDraft_deletedAt_idx" ON "EmployeeDraft"("deletedAt");

-- CreateIndex
CREATE INDEX "EmployeeDraft_createdAt_idx" ON "EmployeeDraft"("createdAt");

-- CreateIndex
CREATE INDEX "Document_employeeId_idx" ON "Document"("employeeId");

-- CreateIndex
CREATE INDEX "Document_type_status_idx" ON "Document"("type", "status");

-- CreateIndex
CREATE INDEX "Document_deletedAt_idx" ON "Document"("deletedAt");

-- CreateIndex
CREATE INDEX "Travel_employeeId_idx" ON "Travel"("employeeId");

-- CreateIndex
CREATE INDEX "Travel_departureAt_status_idx" ON "Travel"("departureAt", "status");

-- CreateIndex
CREATE INDEX "Travel_deletedAt_idx" ON "Travel"("deletedAt");

-- CreateIndex
CREATE INDEX "Agent_agencyId_idx" ON "Agent"("agencyId");

-- CreateIndex
CREATE INDEX "Agent_deletedAt_idx" ON "Agent"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_agencyId_idx" ON "User"("agencyId");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_agencyId_createdAt_idx" ON "AuditLog"("agencyId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "AuditLog_deletedAt_idx" ON "AuditLog"("deletedAt");

-- CreateIndex
CREATE INDEX "Institution_agencyId_idx" ON "Institution"("agencyId");

-- CreateIndex
CREATE INDEX "Institution_deletedAt_idx" ON "Institution"("deletedAt");

-- CreateIndex
CREATE INDEX "Pilgrim_agencyId_idx" ON "Pilgrim"("agencyId");

-- CreateIndex
CREATE INDEX "Pilgrim_deletedAt_idx" ON "Pilgrim"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenId_key" ON "RefreshToken"("tokenId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_tokenId_idx" ON "RefreshToken"("tokenId");

-- CreateIndex
CREATE INDEX "GeneratedCv_employeeId_idx" ON "GeneratedCv"("employeeId");

-- CreateIndex
CREATE INDEX "GeneratedCv_createdAt_idx" ON "GeneratedCv"("createdAt");

-- CreateIndex
CREATE INDEX "VisaApplication_employeeId_idx" ON "VisaApplication"("employeeId");

-- CreateIndex
CREATE INDEX "VisaApplication_stage_idx" ON "VisaApplication"("stage");

-- CreateIndex
CREATE INDEX "MolsRecord_employeeId_idx" ON "MolsRecord"("employeeId");

-- CreateIndex
CREATE INDEX "MolsRecord_stage_idx" ON "MolsRecord"("stage");

-- CreateIndex
CREATE INDEX "CrossMatchResult_employeeId_idx" ON "CrossMatchResult"("employeeId");

-- CreateIndex
CREATE INDEX "CrossMatchResult_allPass_idx" ON "CrossMatchResult"("allPass");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentWebhook_transactionId_key" ON "PaymentWebhook"("transactionId");

-- CreateIndex
CREATE INDEX "PaymentWebhook_transactionId_idx" ON "PaymentWebhook"("transactionId");

-- CreateIndex
CREATE INDEX "PaymentWebhook_status_idx" ON "PaymentWebhook"("status");

-- CreateIndex
CREATE INDEX "PaymentWebhook_receivedAt_idx" ON "PaymentWebhook"("receivedAt");
