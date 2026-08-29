import { eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { randomUUID } from "node:crypto";

export async function POST(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const parent = db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id))
    .get();
  if (!parent)
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Transaction not found" } },
      { status: 404 },
    );
  if (parent.status !== "settled")
    return Response.json(
      {
        error: {
          code: "INVALID_STATE",
          message: "Only settled transactions can refund",
        },
      },
      { status: 409 },
    );
  const refunds = db
    .select()
    .from(transactions)
    .where(eq(transactions.parentTransactionId, id))
    .all();
  const refunded = refunds.reduce(
    (sum, item) => sum + Math.abs(item.amountCents),
    0,
  );
  if (refunded >= parent.amountCents)
    return Response.json(
      {
        error: {
          code: "ALREADY_REFUNDED",
          message: "Transaction is already fully refunded",
        },
      },
      { status: 409 },
    );
  const now = new Date();
  const [refund] = db
    .insert(transactions)
    .values({
      id: randomUUID(),
      accountId: parent.accountId,
      parentTransactionId: id,
      merchant: parent.merchant,
      category: parent.category,
      description: "Refund · demo",
      amountCents: -parent.amountCents,
      status: "settled",
      declineReason: null,
      authorizedAt: null,
      settledAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .all();
  return Response.json({ transaction: refund }, { status: 201 });
}
