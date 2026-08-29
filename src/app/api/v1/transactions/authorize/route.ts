import { and, eq } from "drizzle-orm";
import { db, ensureSchema } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { transactionSchema } from "@/lib/validation";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
  ensureSchema();
  try {
    const input = transactionSchema.parse(await request.json());
    const account = db
      .select()
      .from(accounts)
      .where(eq(accounts.id, input.accountId))
      .get();
    if (!account)
      return Response.json(
        { error: { code: "ACCOUNT_NOT_FOUND", message: "Account not found" } },
        { status: 404 },
      );
    const posted = db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.accountId, account.id),
          eq(transactions.status, "settled"),
        ),
      )
      .all();
    const holds = db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.accountId, account.id),
          eq(transactions.status, "authorized"),
        ),
      )
      .all();
    const balance = posted.reduce((sum, item) => sum + item.amountCents, 0);
    const held = holds.reduce((sum, item) => sum + item.amountCents, 0);
    const declineReason =
      account.status !== "active"
        ? `Card is ${account.status}.`
        : account.limitCents - balance - held < input.amountCents
          ? "Insufficient available credit."
          : null;
    const now = new Date();
    const [transaction] = db
      .insert(transactions)
      .values({
        ...input,
        id: randomUUID(),
        status: declineReason ? "declined" : "authorized",
        declineReason,
        authorizedAt: declineReason ? null : now,
        settledAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .all();
    return Response.json(
      {
        transaction,
        availableCents:
          account.limitCents -
          balance -
          held -
          (declineReason ? 0 : input.amountCents),
      },
      { status: declineReason ? 422 : 201 },
    );
  } catch (error) {
    return Response.json(
      {
        error: {
          code: "INVALID_TRANSACTION",
          message:
            error instanceof Error ? error.message : "Invalid transaction",
        },
      },
      { status: 400 },
    );
  }
}
