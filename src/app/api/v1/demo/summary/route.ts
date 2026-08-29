import { desc } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db, ensureSchema } from "@/db";
import { applications, accounts, transactions, statements } from "@/db/schema";

function seedIfEmpty() {
  ensureSchema();
  if (db.select({ id: accounts.id }).from(accounts).get()) return;
  const now = new Date();
  const applicationId = randomUUID();
  const accountId = randomUUID();
  db.insert(applications)
    .values({
      id: applicationId,
      applicantName: "Maya Chen",
      email: "maya.chen@example.demo",
      phone: "415-555-0142",
      dateOfBirth: "1992-04-18",
      address: "88 Market Street, San Francisco, CA",
      annualIncomeCents: 12500000,
      employmentStatus: "Employed",
      creditScore: 742,
      kycStatus: "passed",
      kycReason: "Demo identity checks passed",
      decisionStatus: "approved",
      decisionReasons: JSON.stringify([
        "Income exceeds $60,000 threshold",
        "Credit score exceeds 680 threshold",
      ]),
      approvedLimitCents: 750000,
      createdAt: now,
      updatedAt: now,
    })
    .run();
  db.insert(accounts)
    .values({
      id: accountId,
      applicationId,
      cardholderName: "Maya Chen",
      tokenizedNumber: "•••• 4821",
      status: "active",
      limitCents: 750000,
      closingDay: 15,
      createdAt: now,
      updatedAt: now,
    })
    .run();
  db.insert(transactions)
    .values({
      id: randomUUID(),
      accountId,
      merchant: "Northstar Air",
      category: "Travel",
      description: "Demo purchase",
      amountCents: 28400,
      status: "settled",
      declineReason: null,
      authorizedAt: now,
      settledAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .run();
}

export function GET() {
  seedIfEmpty();
  const accountRows = db.select().from(accounts).all();
  const appRows = db.select().from(applications).all();
  const transactionRows = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(20)
    .all();
  const statementRows = db
    .select()
    .from(statements)
    .orderBy(desc(statements.createdAt))
    .limit(20)
    .all();
  const enriched = accountRows.map((account) => {
    const own = transactionRows.filter((item) => item.accountId === account.id);
    const balanceCents = own
      .filter((item) => item.status === "settled")
      .reduce((sum, item) => sum + item.amountCents, 0);
    const holdsCents = own
      .filter((item) => item.status === "authorized")
      .reduce((sum, item) => sum + item.amountCents, 0);
    return {
      ...account,
      applicant:
        appRows.find((item) => item.id === account.applicationId)
          ?.applicantName ?? account.cardholderName,
      balanceCents,
      availableCents: account.limitCents - balanceCents - holdsCents,
    };
  });
  return Response.json({
    accounts: enriched,
    applications: appRows,
    transactions: transactionRows,
    statements: statementRows,
  });
}
