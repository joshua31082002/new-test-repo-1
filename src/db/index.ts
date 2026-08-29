import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_PATH ?? "./issuer.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
export { sqlite };

export function ensureSchema() {
  sqlite.exec(`CREATE TABLE IF NOT EXISTS applications (id text primary key, applicant_name text not null, email text not null, phone text not null, date_of_birth text not null, address text not null, annual_income_cents integer not null, employment_status text not null, credit_score integer not null, kyc_status text not null, kyc_reason text not null, decision_status text not null, decision_reasons text not null, approved_limit_cents integer, created_at integer not null, updated_at integer not null);
  CREATE TABLE IF NOT EXISTS accounts (id text primary key, application_id text not null references applications(id), cardholder_name text not null, tokenized_number text not null, status text not null, limit_cents integer not null, closing_day integer not null, created_at integer not null, updated_at integer not null);
  CREATE TABLE IF NOT EXISTS transactions (id text primary key, account_id text not null references accounts(id), parent_transaction_id text, merchant text not null, category text not null, description text not null, amount_cents integer not null, status text not null, decline_reason text, authorized_at integer, settled_at integer, created_at integer not null, updated_at integer not null);
  CREATE TABLE IF NOT EXISTS statements (id text primary key, account_id text not null references accounts(id), cycle_start text not null, cycle_end text not null, due_date text not null, previous_balance_cents integer not null, purchases_cents integer not null, credits_cents integer not null, ending_balance_cents integer not null, minimum_due_cents integer not null, created_at integer not null, updated_at integer not null, unique(account_id, cycle_start, cycle_end));
  CREATE TABLE IF NOT EXISTS statement_items (id text primary key, statement_id text not null references statements(id), transaction_id text not null references transactions(id), sequence integer not null, running_balance_cents integer not null, merchant text not null, amount_cents integer not null, created_at integer not null, updated_at integer not null);`);
}

ensureSchema();
