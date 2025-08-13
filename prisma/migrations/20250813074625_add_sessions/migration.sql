-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "sessionId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "sessionId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."CategoryRule" ADD COLUMN     "sessionId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."ImportFile" ADD COLUMN     "sessionId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "sessionId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "public"."Session"("expiresAt");

-- DropIndex
DROP INDEX "public"."Account_provider_type_displayName_key";

-- DropIndex
DROP INDEX "public"."Category_name_key";

-- DropIndex
DROP INDEX "public"."ImportFile_sha256_key";

-- DropIndex
DROP INDEX "public"."Transaction_hashUnique_key";

-- CreateIndex
CREATE UNIQUE INDEX "Account_sessionId_provider_type_displayName_key" ON "public"."Account"("sessionId", "provider", "type", "displayName");

-- CreateIndex
CREATE INDEX "Account_sessionId_idx" ON "public"."Account"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_sessionId_name_key" ON "public"."Category"("sessionId", "name");

-- CreateIndex
CREATE INDEX "Category_sessionId_idx" ON "public"."Category"("sessionId");

-- CreateIndex
CREATE INDEX "CategoryRule_sessionId_idx" ON "public"."CategoryRule"("sessionId");

-- CreateIndex
CREATE INDEX "CategoryRule_sessionId_priority_enabled_idx" ON "public"."CategoryRule"("sessionId", "priority", "enabled");

-- CreateIndex
CREATE UNIQUE INDEX "ImportFile_sessionId_sha256_key" ON "public"."ImportFile"("sessionId", "sha256");

-- CreateIndex
CREATE INDEX "ImportFile_sessionId_idx" ON "public"."ImportFile"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_sessionId_hashUnique_key" ON "public"."Transaction"("sessionId", "hashUnique");

-- CreateIndex
CREATE INDEX "Transaction_sessionId_idx" ON "public"."Transaction"("sessionId");

-- CreateIndex
CREATE INDEX "Transaction_sessionId_accountId_postedDate_idx" ON "public"."Transaction"("sessionId", "accountId", "postedDate");

-- CreateIndex
CREATE INDEX "Transaction_sessionId_categoryId_postedDate_idx" ON "public"."Transaction"("sessionId", "categoryId", "postedDate");

-- CreateIndex
CREATE INDEX "Transaction_sessionId_postedDate_amountCents_idx" ON "public"."Transaction"("sessionId", "postedDate", "amountCents");

-- CreateIndex
CREATE INDEX "Transaction_sessionId_isTransfer_idx" ON "public"."Transaction"("sessionId", "isTransfer");

-- CreateIndex
CREATE INDEX "Transaction_sessionId_transferCandidate_idx" ON "public"."Transaction"("sessionId", "transferCandidate");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImportFile" ADD CONSTRAINT "ImportFile_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryRule" ADD CONSTRAINT "CategoryRule_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;