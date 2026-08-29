import { sqlite } from "@/db";
import { id } from "@/lib/ids";
import { centsFromDollars } from "@/lib/money";

const now = () => new Date().toISOString();

function seed() {
  const exists = sqlite.prepare("SELECT id FROM applications LIMIT 1").get() as { id: string } | undefined;
  if (exists) return;
  const created = now();
  const applicationId = "app_demo_001";
  const accountId = "acct_demo_001";
  sqlite.prepare(`INSERT INTO applications (id,full_name,email,date_of_birth,annual_income_cents,kyc_status,decision,decision_reason,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(applicationId, "Maya Chen", "maya.chen@example.demo", "1991-04-18", 12800000, "passed", "approved", "Approved: applicant is 18+ and annual income is at least $50,000.", created, created);
  sqlite.prepare(`INSERT INTO card_accounts (id,application_id,cardholder_name,tokenized_number,status,credit_limit_cents,posted_balance_cents,authorized_hold_cents,created_at,updated_at,activated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(accountId, applicationId, "Maya Chen", "4242 •••• •••• 7812", "active", 500000, 8420, 12900, created, created, created);
  sqlite.prepare(`INSERT INTO transactions (id,account_id,merchant_name,description,amount_cents,kind,status,created_at,settled_at) VALUES (?,?,?,?,?,?,?,?,?)`).run("txn_demo_001", accountId, "Harbor & Pine", "Workspace supplies", 8420, "purchase", "settled", created, created);
  sqlite.prepare(`INSERT INTO transactions (id,account_id,merchant_name,description,amount_cents,kind,status,created_at,authorized_at) VALUES (?,?,?,?,?,?,?,?,?)`).run("txn_demo_002", accountId, "Northstar Air", "Travel authorization", 12900, "purchase", "authorized", created, created);
}

export function getDashboard() {
  seed();
  const applications = sqlite.prepare("SELECT * FROM applications ORDER BY created_at DESC LIMIT 50").all();
  const accounts = sqlite.prepare("SELECT * FROM card_accounts ORDER BY created_at DESC LIMIT 50").all() as Array<Record<string, unknown>>;
  const transactions = sqlite.prepare("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100").all();
  const statements = sqlite.prepare("SELECT * FROM statements ORDER BY generated_at DESC LIMIT 50").all();
  return { applications, accounts: accounts.map((account) => ({ ...account, available_credit_cents: Number(account.credit_limit_cents) - Number(account.posted_balance_cents) - Number(account.authorized_hold_cents) })), transactions, statements };
}

export function performAction(action: string, payload: Record<string, string>) {
  seed();
  const created = now();
  if (action === "apply") {
    const annualIncomeCents = centsFromDollars(payload.annualIncome);
    const birth = new Date(payload.dateOfBirth);
    const age = Math.floor((Date.now() - birth.getTime()) / 31557600000);
    const approved = age >= 18 && annualIncomeCents >= 5000000;
    const reason = approved ? "Approved: applicant is 18+ and annual income is at least $50,000." : `Declined: ${age < 18 ? "applicant must be at least 18" : "annual income must be at least $50,000"}.`;
    const applicationId = id("app");
    sqlite.prepare("INSERT INTO applications (id,full_name,email,date_of_birth,annual_income_cents,kyc_status,decision,decision_reason,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)").run(applicationId, payload.fullName, payload.email, payload.dateOfBirth, annualIncomeCents, "passed", approved ? "approved" : "declined", reason, created, created);
    if (approved) sqlite.prepare("INSERT INTO card_accounts (id,application_id,cardholder_name,tokenized_number,status,credit_limit_cents,posted_balance_cents,authorized_hold_cents,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)").run(id("acct"), applicationId, payload.fullName, `4242 •••• •••• ${Math.floor(1000 + Math.random() * 8999)}`, "issued", 0, 0, 0, created, created);
    return { applicationId, approved, reason };
  }
  const account = sqlite.prepare("SELECT * FROM card_accounts WHERE id=?").get(payload.accountId) as Record<string, unknown> | undefined;
  if (!account) throw new Error("Account not found.");
  if (["activate", "freeze", "unfreeze", "close", "limit"].includes(action)) {
    const next = action === "activate" ? "active" : action === "freeze" ? "frozen" : action === "unfreeze" ? "active" : action === "close" ? "closed" : String(account.status);
    if (action === "limit") {
      const limit = centsFromDollars(payload.amount);
      if (limit <= Number(account.posted_balance_cents) + Number(account.authorized_hold_cents)) throw new Error("Limit must cover current balance and holds.");
      sqlite.prepare("UPDATE card_accounts SET credit_limit_cents=?,updated_at=? WHERE id=?").run(limit, created, payload.accountId);
    } else sqlite.prepare("UPDATE card_accounts SET status=?,updated_at=?,activated_at=COALESCE(activated_at,?) WHERE id=?").run(next, created, action === "activate" ? created : null, payload.accountId);
    return { ok: true };
  }
  if (action === "authorize") {
    const amount = centsFromDollars(payload.amount);
    const available = Number(account.credit_limit_cents) - Number(account.posted_balance_cents) - Number(account.authorized_hold_cents);
    const allowed = account.status === "active" && amount <= available;
    const transactionId = id("txn");
    sqlite.prepare("INSERT INTO transactions (id,account_id,merchant_name,description,amount_cents,kind,status,decline_reason,created_at,authorized_at) VALUES (?,?,?,?,?,?,?,?,?,?)").run(transactionId, payload.accountId, payload.merchant || "Demo merchant", payload.description || "Simulated purchase", amount, "purchase", allowed ? "authorized" : "declined", allowed ? null : account.status !== "active" ? "Card is not active." : "Insufficient available credit.", created, allowed ? created : null);
    if (allowed) sqlite.prepare("UPDATE card_accounts SET authorized_hold_cents=authorized_hold_cents+?,updated_at=? WHERE id=?").run(amount, created, payload.accountId);
    return { allowed, transactionId };
  }
  const transaction = sqlite.prepare("SELECT * FROM transactions WHERE id=?").get(payload.transactionId) as Record<string, unknown> | undefined;
  if (!transaction) throw new Error("Transaction not found.");
  if (action === "settle") {
    if (transaction.status !== "authorized") throw new Error("Only authorized transactions can settle.");
    sqlite.transaction(() => { sqlite.prepare("UPDATE transactions SET status='settled',settled_at=? WHERE id=?").run(created, payload.transactionId); sqlite.prepare("UPDATE card_accounts SET authorized_hold_cents=authorized_hold_cents-?,posted_balance_cents=posted_balance_cents+?,updated_at=? WHERE id=?").run(transaction.amount_cents, transaction.amount_cents, created, transaction.account_id); })();
  } else if (action === "refund") {
    if (transaction.status !== "settled") throw new Error("Only settled transactions can be refunded.");
    sqlite.transaction(() => { sqlite.prepare("UPDATE transactions SET status='refunded',refunded_at=? WHERE id=?").run(created, payload.transactionId); sqlite.prepare("UPDATE card_accounts SET posted_balance_cents=posted_balance_cents-?,updated_at=? WHERE id=?").run(transaction.amount_cents, created, transaction.account_id); })();
  } else if (action === "statement") {
    const previous = sqlite.prepare("SELECT period_end FROM statements WHERE account_id=? ORDER BY generated_at DESC LIMIT 1").get(transaction.account_id) as { period_end: string } | undefined;
    const start = previous?.period_end ?? String(account.created_at);
    const items = sqlite.prepare("SELECT * FROM transactions WHERE account_id=? AND status IN ('settled','refunded') AND created_at>? AND created_at<=? ORDER BY created_at ASC").all(transaction.account_id, start, created) as Array<Record<string, unknown>>;
    let balance = 0;
    const statementId = id("stmt");
    for (const item of items) balance += item.status === "refunded" ? -Number(item.amount_cents) : Number(item.amount_cents);
    const minimum = balance === 0 ? 0 : Math.min(balance, Math.max(2500, Math.floor(balance * 5 / 100)));
    sqlite.transaction(() => { sqlite.prepare("INSERT INTO statements (id,account_id,period_start,period_end,generated_at,due_at,balance_cents,minimum_due_cents,created_at) VALUES (?,?,?,?,?,?,?,?,?)").run(statementId, transaction.account_id, start, created, created, new Date(Date.now() + 21 * 86400000).toISOString(), balance, minimum, created); let running = 0; for (const item of items) { running += item.status === "refunded" ? -Number(item.amount_cents) : Number(item.amount_cents); sqlite.prepare("INSERT INTO statement_items (id,statement_id,transaction_id,running_balance_cents,amount_cents,description,posted_at) VALUES (?,?,?,?,?,?,?)").run(id("item"), statementId, item.id, running, item.amount_cents, `${item.merchant_name} · ${item.description}`, item.created_at); } })();
    return { statementId };
  }
  return { ok: true };
}
