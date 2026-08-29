import {
  integer,
  sqliteTable,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
};

export const applications = sqliteTable(
  "applications",
  {
    id: text("id").primaryKey(),
    applicantName: text("applicant_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    dateOfBirth: text("date_of_birth").notNull(),
    address: text("address").notNull(),
    annualIncomeCents: integer("annual_income_cents").notNull(),
    employmentStatus: text("employment_status").notNull(),
    creditScore: integer("credit_score").notNull(),
    kycStatus: text("kyc_status").notNull(),
    kycReason: text("kyc_reason").notNull(),
    decisionStatus: text("decision_status").notNull(),
    decisionReasons: text("decision_reasons").notNull(),
    approvedLimitCents: integer("approved_limit_cents"),
    ...timestamps,
  },
  (t) => [index("applications_decision_idx").on(t.decisionStatus)],
);

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id")
      .notNull()
      .references(() => applications.id),
    cardholderName: text("cardholder_name").notNull(),
    tokenizedNumber: text("tokenized_number").notNull(),
    status: text("status").notNull(),
    limitCents: integer("limit_cents").notNull(),
    closingDay: integer("closing_day").notNull(),
    ...timestamps,
  },
  (t) => [index("accounts_status_idx").on(t.status)],
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id),
    parentTransactionId: text("parent_transaction_id"),
    merchant: text("merchant").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull(),
    amountCents: integer("amount_cents").notNull(),
    status: text("status").notNull(),
    declineReason: text("decline_reason"),
    authorizedAt: integer("authorized_at", { mode: "timestamp_ms" }),
    settledAt: integer("settled_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  (t) => [
    index("transactions_account_date_idx").on(t.accountId, t.createdAt),
    index("transactions_status_idx").on(t.status),
  ],
);

export const statements = sqliteTable(
  "statements",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id),
    cycleStart: text("cycle_start").notNull(),
    cycleEnd: text("cycle_end").notNull(),
    dueDate: text("due_date").notNull(),
    previousBalanceCents: integer("previous_balance_cents").notNull(),
    purchasesCents: integer("purchases_cents").notNull(),
    creditsCents: integer("credits_cents").notNull(),
    endingBalanceCents: integer("ending_balance_cents").notNull(),
    minimumDueCents: integer("minimum_due_cents").notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("statements_account_cycle_idx").on(
      t.accountId,
      t.cycleStart,
      t.cycleEnd,
    ),
  ],
);

export const statementItems = sqliteTable(
  "statement_items",
  {
    id: text("id").primaryKey(),
    statementId: text("statement_id")
      .notNull()
      .references(() => statements.id),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactions.id),
    sequence: integer("sequence").notNull(),
    runningBalanceCents: integer("running_balance_cents").notNull(),
    merchant: text("merchant").notNull(),
    amountCents: integer("amount_cents").notNull(),
    ...timestamps,
  },
  (t) => [index("statement_items_statement_idx").on(t.statementId, t.sequence)],
);
