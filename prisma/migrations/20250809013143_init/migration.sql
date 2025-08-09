-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('CHASE', 'VENMO');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('CHECKING', 'WALLET');

-- CreateEnum
CREATE TYPE "public"."RuleMatchType" AS ENUM ('CONTAINS', 'REGEX');

-- CreateEnum
CREATE TYPE "public"."Direction" AS ENUM ('INFLOW', 'OUTFLOW', 'NONE');

-- CreateEnum
CREATE TYPE "public"."CategoryKind" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "public"."FileStatus" AS ENUM ('PENDING', 'PROCESSED', 'ERROR');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "provider" "public"."Provider" NOT NULL,
    "type" "public"."AccountType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "last4" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "public"."CategoryKind" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImportFile" (
    "id" TEXT NOT NULL,
    "source" "public"."Provider" NOT NULL,
    "filename" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "imported" INTEGER NOT NULL DEFAULT 0,
    "duplicates" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."FileStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "source" "public"."Provider" NOT NULL,
    "externalId" TEXT,
    "accountId" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "postedDate" TIMESTAMP(3) NOT NULL,
    "descriptionRaw" TEXT NOT NULL,
    "descriptionNorm" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "categoryId" TEXT,
    "isTransfer" BOOLEAN NOT NULL DEFAULT false,
    "transferGroupId" TEXT,
    "transferCandidate" BOOLEAN NOT NULL DEFAULT false,
    "importFileId" TEXT,
    "hashUnique" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CategoryRule" (
    "id" TEXT NOT NULL,
    "accountId" TEXT,
    "matchType" "public"."RuleMatchType" NOT NULL DEFAULT 'CONTAINS',
    "pattern" TEXT NOT NULL,
    "direction" "public"."Direction" NOT NULL DEFAULT 'NONE',
    "categoryId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_type_displayName_key" ON "public"."Account"("provider", "type", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ImportFile_sha256_key" ON "public"."ImportFile"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hashUnique_key" ON "public"."Transaction"("hashUnique");

-- CreateIndex
CREATE INDEX "Transaction_accountId_postedDate_idx" ON "public"."Transaction"("accountId", "postedDate");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_postedDate_idx" ON "public"."Transaction"("categoryId", "postedDate");

-- CreateIndex
CREATE INDEX "Transaction_postedDate_amountCents_idx" ON "public"."Transaction"("postedDate", "amountCents");

-- CreateIndex
CREATE INDEX "Transaction_isTransfer_idx" ON "public"."Transaction"("isTransfer");

-- CreateIndex
CREATE INDEX "Transaction_transferCandidate_idx" ON "public"."Transaction"("transferCandidate");

-- CreateIndex
CREATE INDEX "CategoryRule_priority_enabled_idx" ON "public"."CategoryRule"("priority", "enabled");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_importFileId_fkey" FOREIGN KEY ("importFileId") REFERENCES "public"."ImportFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryRule" ADD CONSTRAINT "CategoryRule_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryRule" ADD CONSTRAINT "CategoryRule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
