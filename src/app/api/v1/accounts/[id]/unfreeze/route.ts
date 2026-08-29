import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts } from "@/db/schema";
export async function POST(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const account = db.select().from(accounts).where(eq(accounts.id, id)).get();
  if (!account)
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Account not found" } },
      { status: 404 },
    );
  if (account.status !== "frozen")
    return Response.json(
      {
        error: {
          code: "INVALID_STATE",
          message: "Only frozen cards can be unfrozen",
        },
      },
      { status: 409 },
    );
  const [updated] = db
    .update(accounts)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(accounts.id, id))
    .returning()
    .all();
  return Response.json({ account: updated });
}
