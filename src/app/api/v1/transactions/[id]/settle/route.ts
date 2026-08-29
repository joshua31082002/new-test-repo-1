import { eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions } from "@/db/schema";

export async function POST(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const transaction = db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id))
    .get();
  if (!transaction)
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Transaction not found" } },
      { status: 404 },
    );
  if (transaction.status !== "authorized")
    return Response.json(
      {
        error: {
          code: "INVALID_STATE",
          message: "Only authorized transactions can settle",
        },
      },
      { status: 409 },
    );
  const [updated] = db
    .update(transactions)
    .set({ status: "settled", settledAt: new Date(), updatedAt: new Date() })
    .where(eq(transactions.id, id))
    .returning()
    .all();
  return Response.json({ transaction: updated });
}
