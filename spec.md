0) Product scope & success
In scope
Upload CSV from Chase and Venmo
Robust parsing & idempotent import (no duplicates)
Categorization via simple rules; manual overrides
Venmo fees as separate Expense > Fees transactions
Transfer detection (Venmo ↔ Chase) and exclusion from totals
Monthly Income / Expenses / Net tiles + breakdowns by category & account
One page (dashboard + transactions)
Success criteria
After uploading Chase + Venmo CSVs for a month:
Tiles reflect correct income/expense/net (transfers excluded)
Fees appear in Expense > Fees
Transfers are paired and marked isTransfer so they don’t affect totals
Table edits (category/transfer/notes) persist and update aggregates
“Uncategorized (N)” and “Review transfers (M)” badges match filtered table counts
1) Tech & hosting
Frontend/Backend: Next.js 14 (App Router, TypeScript)
DB/ORM: PostgreSQL (Render) + Prisma
Auth: Single admin passphrase (ADMIN_PASSWORD) → session cookie (JWT)
Styling/UI: Tailwind CSS + Headless UI/Radix primitives
CSV parsing: Server‑side stream parsing (fast‑csv or Papaparse in Node)
Timezone: default America/Los_Angeles, editable in Settings modal
No file blob storage (parse and discard); only per‑row results are stored
Environment variables
DATABASE_URL (Render Postgres)
ADMIN_PASSWORD (strong)
SESSION_SECRET (32+ random bytes)
APP_TIMEZONE (default America/Los_Angeles)
2) Data model (Prisma schema)
// prisma/schema.prisma
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

enum Provider { CHASE VENMO }
enum AccountType { CHECKING WALLET }
enum RuleMatchType { CONTAINS REGEX }
enum Direction { INFLOW OUTFLOW NONE }
enum CategoryKind { INCOME EXPENSE TRANSFER }
enum FileStatus { PENDING PROCESSED ERROR }

model Account {
  id           String        @id @default(uuid())
  provider     Provider
  type         AccountType
  displayName  String
  last4        String?
  currency     String        @default("USD")
  createdAt    DateTime      @default(now())
  transactions Transaction[]
  rules        CategoryRule[]
  @@unique([provider, type, displayName])
}

model Category {
  id        String       @id @default(uuid())
  name      String       @unique
  kind      CategoryKind
  parentId  String?
  createdAt DateTime     @default(now())
  rules     CategoryRule[]
  txs       Transaction[]
}

model ImportFile {
  id           String     @id @default(uuid())
  source       Provider
  filename     String
  sha256       String     @unique
  rowCount     Int        @default(0)
  imported     Int        @default(0)
  duplicates   Int        @default(0)
  status       FileStatus @default(PENDING)
  error        String?
  processedAt  DateTime?
  createdAt    DateTime   @default(now())
}

model Transaction {
  id               String     @id @default(uuid())
  source           Provider
  externalId       String?
  accountId        String
  account          Account    @relation(fields: [accountId], references: [id])
  postedAt         DateTime
  postedDate       DateTime
  descriptionRaw   String
  descriptionNorm  String
  amountCents      Int        // + inflow, - outflow
  currency         String     @default("USD")
  categoryId       String?
  category         Category?  @relation(fields: [categoryId], references: [id])
  isTransfer       Boolean    @default(false)
  transferGroupId  String?
  transferCandidate Boolean   @default(false) // for review queue
  importFileId     String?
  importFile       ImportFile? @relation(fields: [importFileId], references: [id])
  hashUnique       String     @unique
  notes            String?
  createdAt        DateTime   @default(now())

  @@index([accountId, postedDate])
  @@index([categoryId, postedDate])
  @@index([postedDate, amountCents])
  @@index([isTransfer])
  @@index([transferCandidate])
}

model CategoryRule {
  id          String        @id @default(uuid())
  accountId   String?
  account     Account?      @relation(fields: [accountId], references: [id])
  matchType   RuleMatchType @default(CONTAINS)
  pattern     String
  direction   Direction     @default(NONE)
  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])
  priority    Int           @default(100)
  enabled     Boolean       @default(true)
  createdAt   DateTime      @default(now())

  @@index([priority, enabled])
}

model AppSetting {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}
3) CSV ingestion rules
3.1 Header normalization helpers (server)
normalizeHeader(s): lowercase, strip non‑alnum
pickHeader(row, candidates[]): returns first matching column value from candidates
3.2 Chase CSV
Headers (case/space tolerant):
Post Date (primary), accept Posting Date as synonym
Description
Amount
Date format: MM/DD/YYYY
Sign: positive = deposit (income), negative = withdrawal (expense)
Mapping
postedAt    = parseUsDate(pickHeader(row, ["Post Date","Posting Date"]), tz)
postedDate  = toDateOnly(postedAt, tz)
descRaw     = pickHeader(row, ["Description"])
amountCents = toCents(pickHeader(row, ["Amount"])) // sign preserved
source      = CHASE
account     = "Chase"
externalId  = null
3.3 Venmo CSV
Headers: Datetime, Type, From, To, Amount (total), Amount (fee), Note, ID
Sign from Amount (total): positive = into Venmo balance; negative = out
Fees: create separate expense row in Expense > Fees; ensure:
feeCents = -abs(toCents(Amount (fee))) (fees are always outflows)
Main amount: mainCents = totalCents - feeCents so main + fee = total
Mapping
postedAt    = parseDateTime(row["Datetime"], tz)
postedDate  = toDateOnly(postedAt, tz)
descRaw     = `${Type}: ${Note || ''} ${From ? 'From '+From : ''} ${To ? 'To '+To : ''}`.trim()
totalCents  = toCents(row["Amount (total)"])
feeCents    = -abs(toCents(row["Amount (fee)"] || "0"))
mainCents   = totalCents - feeCents
source      = VENMO
account     = "Venmo"
externalId  = row["ID"] || null

Create 1 Transaction for mainCents.
If feeCents != 0, create 1 Transaction for feeCents with category = Fees.
3.4 Idempotency
hashUnique = sha256(${source}|${accountId}|${YYYY-MM-DD(postedDate)}|${amountCents}|${normalizeDesc(descriptionRaw)}|${externalId ?? ""})
Insert with conflict‑ignore on hashUnique
3.5 Description normalization
Uppercase → remove digit runs / store numbers (#\d+) → strip tokens (POS, DEBIT, CREDIT, CO) → collapse spaces → trim
4) Business logic
4.1 Categorization
Apply enabled rules ordered by priority ASC
CONTAINS: substring on descriptionNorm
direction filter (INFLOW requires amountCents>0; OUTFLOW requires <0)
Optional accountId constraint
Defaults if nothing matches (and not a fee row):
inflow → Income: Misc
outflow → Expense: Misc
Fees: Venmo fee rows are set to Expense: Fees on import
4.2 Transfer detection (Venmo ↔ Chase)
Mark candidates first:
Venmo rows where Type or descriptionNorm contains TRANSFER
Chase rows where descriptionNorm contains VENMO or P2P or ONLINE TRANSFER
Set transferCandidate=true on these
Match rule (batched per month):
For each Venmo candidate v:
Compute target = abs(mainCents) where mainCents is the Venmo main amount (not including fee)
Find Chase tx c with abs(c.amountCents) == target and opposite sign within ±3 days
If exactly one match → set isTransfer=true and same transferGroupId on both; set transferCandidate=false
Else leave transferCandidate=true for review
Transfers are excluded from income/expense totals and can be filtered in the table
4.3 Monthly rollups (exclude isTransfer=true)
Tiles:
incomeCents = sum(amountCents WHERE amountCents>0 AND NOT isTransfer)
expenseCents = sum(abs(amountCents) WHERE amountCents<0 AND NOT isTransfer)
netCents = sum(amountCents WHERE NOT isTransfer)
By Category (expenses only):
Sum of abs(amountCents) grouped by Category.name where kind=EXPENSE and NOT isTransfer
By Account:
Per account: income and expenses as above
5) API contract (all JSON; protected by session cookie)
Auth
POST /api/auth/login → { password } → 200 { ok: true } (sets HTTP‑only cookie)
POST /api/auth/logout → clears cookie
Import
POST /api/import?source=CHASE|VENMO (multipart: file)
Computes file SHA‑256; creates ImportFile
Stream‑parses CSV, maps rows to transactions (+ fee rows for Venmo)
Upserts with hashUnique conflict‑ignore
Runs Categorization + Transfer detection for affected months
Response:
{
  "imported": 123,
  "duplicates": 45,
  "transferCandidates": 3
}
Page data (dashboard)
GET /api/page-data?month=YYYY-MM
{
  "tiles": { "incomeCents": 0, "expenseCents": 0, "netCents": 0 },
  "byCategory": [{ "category": "Groceries", "expensesCents": 12345 }],
  "byAccount": [{ "account": "Chase", "incomeCents": 10000, "expensesCents": 5000 }],
  "counters": { "uncategorized": 3, "reviewTransfers": 1 },
  "categories": [{ "id":"...", "name":"Groceries", "kind":"EXPENSE" }],
  "accounts": [{ "id":"...", "displayName":"Chase" }]
}
Transactions (table)
GET /api/transactions?month=YYYY-MM&accountId=...&categoryId=...&q=...&page=1&pageSize=100&includeTransfers=false&onlyCandidates=false
{
  "rows": [
    {
      "id": "uuid",
      "date": "2025-07-15",
      "account": "Venmo",
      "description": "PAYMENT: Dinner with friends",
      "amountCents": -4500,
      "categoryId": null,
      "categoryName": null,
      "isTransfer": false,
      "transferCandidate": false,
      "notes": ""
    }
  ],
  "page": 1, "pageSize": 100, "total": 237
}
PATCH /api/transactions/:id body: { categoryId?, isTransfer?, notes? } → returns updated row
Rules
GET /api/rules → list
POST /api/rules body: { pattern, direction, categoryId, priority, enabled, accountId? }
PATCH /api/rules/:id → same fields
DELETE /api/rules/:id
POST /api/rules/reapply body: { month: "YYYY-MM" } → reapplies to that month
6) One‑page UI/UX
Route: / (protected; unauth → /login)
Header

Month picker (YYYY‑MM) → syncs to URL query and state
Buttons: Upload, Rules, Settings, and Logout
Dashboard section
Tiles: Income | Expenses | Net (formatted via Intl.NumberFormat)
By Category table (expenses only; positive numbers)
By Account table (income & expenses per account)
Badges with deep link filters:
Uncategorized (N) → opens table filtered to categoryId=null
Review transfers (M) → opens table with onlyCandidates=true
Transactions section
Filters: Month (bound to header), Account, Category, Search, toggles for includeTransfers / onlyCandidates
Table columns: Date, Account, Description, Amount, Category (dropdown), Transfer (checkbox), Notes
Inline save (debounced PATCH) + toast
Pagination or virtualization (>5k rows)
Modals
Upload: radio Chase / Venmo, drag‑and‑drop .csv, result summary
Rules: list + CRUD, fields: pattern (contains), direction (any/inflow/outflow), category, priority, enabled, (optional) account
Settings: Timezone select, Category manager (CRUD: name, kind; defaults preseeded)
7) Queries (SQL; exclude isTransfer=true)
Tiles
SELECT
  SUM(CASE WHEN amountCents > 0 AND NOT "isTransfer" THEN amountCents ELSE 0 END) AS incomeCents,
  SUM(CASE WHEN amountCents < 0 AND NOT "isTransfer" THEN -amountCents ELSE 0 END) AS expenseCents,
  SUM(CASE WHEN NOT "isTransfer" THEN amountCents ELSE 0 END) AS netCents
FROM "Transaction"
WHERE date_trunc('month', "postedAt") = date_trunc('month', $1::date);
By Category (expenses)
SELECT c.name AS category,
       SUM(ABS(t."amountCents")) AS expensesCents
FROM "Transaction" t
JOIN "Category" c ON c.id = t."categoryId"
WHERE c.kind = 'EXPENSE'
  AND NOT t."isTransfer"
  AND date_trunc('month', t."postedAt") = date_trunc('month', $1::date)
GROUP BY c.name
ORDER BY expensesCents DESC;
By Account
SELECT a."displayName" AS account,
       SUM(CASE WHEN t."amountCents" > 0 AND NOT t."isTransfer" THEN t."amountCents" ELSE 0 END) AS incomeCents,
       SUM(CASE WHEN t."amountCents" < 0 AND NOT t."isTransfer" THEN -t."amountCents" ELSE 0 END) AS expensesCents
FROM "Transaction" t
JOIN "Account" a ON a.id = t."accountId"
WHERE date_trunc('month', t."postedAt") = date_trunc('month', $1::date)
GROUP BY a."displayName"
ORDER BY a."displayName";
Counters
-- Uncategorized
SELECT COUNT(*) FROM "Transaction"
WHERE "categoryId" IS NULL AND NOT "isTransfer"
  AND date_trunc('month', "postedAt") = date_trunc('month', $1::date);

-- Review transfers
SELECT COUNT(*) FROM "Transaction"
WHERE "transferCandidate" = true AND "isTransfer" = false
  AND date_trunc('month', "postedAt") = date_trunc('month', $1::date);
8) Utilities (server; implementation notes)
// header normalization
export const normalizeHeader = (s:string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
export function pickHeader(row: Record<string,string>, candidates: string[]) {
  const map = new Map<string,string>();
  for (const k of Object.keys(row)) map.set(normalizeHeader(k), k);
  for (const c of candidates) {
    const k = map.get(normalizeHeader(c)); if (k) return row[k];
  }
  return undefined;
}

// parsing
export function toCents(s: string | undefined): number {
  if (!s) return 0;
  const n = Number(String(s).replace(/,/g, ""));
  return Math.round(n * 100);
}

export function normalizeDesc(s: string): string {
  return s
    .toUpperCase()
    .replace(/[#\d]+/g, " ")
    .replace(/\b(POS| DEBIT| CREDIT| CO)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
9) Seed data
Accounts
Chase (provider=CHASE, type=CHECKING)
Venmo (provider=VENMO, type=WALLET)
Categories
INCOME: Salary, Refunds, Misc
EXPENSE: Rent, Utilities, Groceries, Dining, Transport, Travel,
Entertainment, Health, Shopping, Fees, Taxes, Misc
TRANSFER: Transfer (not assigned automatically; isTransfer flag used instead)
Rules (examples)
Contains SAFEWAY + OUTFLOW → Groceries
Contains UBER + OUTFLOW → Transport
Contains PAYROLL + INFLOW → Salary
AppSetting
("timezone","America/Los_Angeles")
10) Implementation to‑do (for codegen)
Foundation
 Scaffold Next.js 14 (TS) + Tailwind; App Router; ESLint/Prettier
 Auth middleware: protect / and /api/* except /api/auth/*
 /login page + POST /api/auth/login, POST /api/auth/logout
Database
 Add Prisma with schema above; migrations
 Seed accounts, categories, rules, timezone
Single‑page UI (/)
 Header: MonthPicker, Upload button, Rules button, Settings button
 Dashboard: Tiles, ByCategory table, ByAccount table, badges
 Transactions: filters, table, inline edits, pagination/virtualization
 Modals: Upload (csv), Rules (CRUD + reapply), Settings (timezone + category CRUD)
API
 POST /api/import?source=... (CSV multipart)
 GET /api/page-data?month=YYYY-MM
 GET /api/transactions?...
 PATCH /api/transactions/:id
 GET/POST/PATCH/DELETE /api/rules, POST /api/rules/reapply
 GET /api/categories (for dropdown)
Server logic
 CSV stream parsing; tolerant headers via pickHeader
 Chase mapper uses ["Post Date","Posting Date"], Description, Amount
 Venmo mapper with fee splitting (main + fee = total)
 Description normalization + idempotency hash; conflict‑ignore
 Categorization engine (rules → defaults)
 Transfer detection (candidates + unique matching within ±3 days)
 Aggregates for page‑data; counters
Deploy (Render)
 Provision Postgres; set env; npx prisma migrate deploy
 Build: npm ci && npm run build; Start: npm run start
11) Test plan (minimum)
Unit
Header matching
Post Date (primary) and Posting Date (synonym) both parse correctly
Case/spacing variants (post date, POST‑DATE) work
Chase amounts: +3000.00 and -120.55 parsed with correct signs
Venmo fee split
total -100.00, fee -0.25 → main -99.75 + fee -0.25
fee row categorized as Fees
Idempotency: duplicate imports ignored via hashUnique
Categorization: rules apply per priority, direction respected
Transfer detection
Venmo cashout: total -100.00, fee -0.25 → main -99.75 matches Chase +99.75 within 3 days
Ambiguous matches → transferCandidate=true, isTransfer=false
Integration
Upload Chase only → tiles reflect sums
Upload Venmo with fee → fee row appears; totals correct
Upload both + transfers → paired, excluded from totals
“Uncategorized (N)”/“Review transfers (M)” badge counts match filtered table
Inline edits persist and aggregates update
Sample CSVs
Chase (Post Date)
Post Date,Description,Amount
07/01/2025,ACME PAYROLL,3000.00
07/02/2025,SAFEWAY #123,-120.55
Chase (Posting Date)
Posting Date,Description,Amount
07/03/2025,UBER TRIP,-18.23
Venmo
Datetime,Type,From,To,Amount (total),Amount (fee),Note,ID
07/05/2025 10:22:00,Payment,,Alice,-45.00,0.00,Dinner,TXN1
07/06/2025 08:15:00,Transfer,,Bank,-100.00,-0.25,Cashout,TXN2
12) Deployment (Render)
Create Render Postgres → copy DATABASE_URL
Create Web Service (Node 18+)
Build: npm ci && npm run build
Start: npm run start
Env vars: DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, APP_TIMEZONE
Migrations: run npx prisma migrate deploy on startup (Render build command or start hook)
Enforce HTTPS; set SameSite=Lax, HttpOnly cookies
13) Non‑functional
Security: single‑user passphrase; HTTPS; HTTP‑only session cookie
Privacy: store only parsed rows; no raw file blobs; no account numbers
Performance: stream CSV; batch inserts; indexes provided; pagination/virtualization for table
Observability: basic request logging and error reporting
Notes for Codex: Generate the project with the schema above, build the single page / with the three modals, implement the API endpoints exactly as specified, and wire the CSV mappers with header normalization. Prioritize correctness of fee splitting and transfer pairing.
