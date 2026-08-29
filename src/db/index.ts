import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database(process.env.DATABASE_URL?.replace("file:", "") ?? "dev.db");
sqlite.pragma("foreign_keys = ON");
sqlite.exec(`
CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL, date_of_birth TEXT NOT NULL, annual_income_cents INTEGER NOT NULL, kyc_status TEXT NOT NULL DEFAULT 'not_run', decision TEXT NOT NULL DEFAULT 'pending', decision_reason TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS card_accounts (id TEXT PRIMARY KEY, application_id TEXT NOT NULL UNIQUE, cardholder_name TEXT NOT NULL, tokenized_number TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'issued', credit_limit_cents INTEGER NOT NULL DEFAULT 0, posted_balance_cents INTEGER NOT NULL DEFAULT 0, authorized_hold_cents INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, activated_at TEXT, closed_at TEXT);
CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, merchant_name TEXT NOT NULL, description TEXT NOT NULL, amount_cents INTEGER NOT NULL, kind TEXT NOT NULL DEFAULT 'purchase', status TEXT NOT NULL, decline_reason TEXT, parent_transaction_id TEXT, created_at TEXT NOT NULL, authorized_at TEXT, settled_at TEXT, refunded_at TEXT);
CREATE TABLE IF NOT EXISTS statements (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, period_start TEXT NOT NULL, period_end TEXT NOT NULL, generated_at TEXT NOT NULL, due_at TEXT NOT NULL, balance_cents INTEGER NOT NULL, minimum_due_cents INTEGER NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS statement_items (id TEXT PRIMARY KEY, statement_id TEXT NOT NULL, transaction_id TEXT NOT NULL, running_balance_cents INTEGER NOT NULL, amount_cents INTEGER NOT NULL, description TEXT NOT NULL, posted_at TEXT NOT NULL);
`);
export const db = drizzle(sqlite);
export { sqlite };
