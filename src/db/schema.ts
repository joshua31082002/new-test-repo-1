import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  annualIncomeCents: integer("annual_income_cents").notNull(),
  kycStatus: text("kyc_status").notNull().default("not_run"),
  decision: text("decision").notNull().default("pending"),
  decisionReason: text("decision_reason").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("applications_decision_idx").on(table.decision)]);

export const accounts = sqliteTable("card_accounts", {
  id: text("id").primaryKey(),
  applicationId: text("application_id").notNull().unique(),
  cardholderName: text("cardholder_name").notNull(),
  tokenizedNumber: text("tokenized_number").notNull(),
  status: text("status").notNull().default("issued"),
  creditLimitCents: integer("credit_limit_cents").notNull().default(0),
  postedBalanceCents: integer("posted_balance_cents").notNull().default(0),
  authorizedHoldCents: integer("authorized_hold_cents").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  activatedAt: text("activated_at"),
  closedAt: text("closed_at"),
}, (table) => [index("accounts_status_idx").on(table.status)]);

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  merchantName: text("merchant_name").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  kind: text("kind").notNull().default("purchase"),
  status: text("status").notNull(),
  declineReason: text("decline_reason"),
  parentTransactionId: text("parent_transaction_id"),
  createdAt: text("created_at").notNull(),
  authorizedAt: text("authorized_at"),
  settledAt: text("settled_at"),
  refundedAt: text("refunded_at"),
}, (table) => [index("transactions_account_idx").on(table.accountId, table.createdAt)]);

export const statements = sqliteTable("statements", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  generatedAt: text("generated_at").notNull(),
  dueAt: text("due_at").notNull(),
  balanceCents: integer("balance_cents").notNull(),
  minimumDueCents: integer("minimum_due_cents").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [index("statements_account_idx").on(table.accountId, table.generatedAt)]);

export const statementItems = sqliteTable("statement_items", {
  id: text("id").primaryKey(),
  statementId: text("statement_id").notNull(),
  transactionId: text("transaction_id").notNull(),
  runningBalanceCents: integer("running_balance_cents").notNull(),
  amountCents: integer("amount_cents").notNull(),
  description: text("description").notNull(),
  postedAt: text("posted_at").notNull(),
});
