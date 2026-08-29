import { randomUUID } from "node:crypto";
import { db, ensureSchema } from "./index";
import { applications, accounts, transactions } from "./schema";

ensureSchema();
const now = new Date();
const applicationId = randomUUID();
const accountId = randomUUID();
const transactionId = randomUUID();
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
    id: transactionId,
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
console.log(`Seeded demo account ${accountId}`);
