import { db, ensureSchema } from "@/db";
import { applications } from "@/db/schema";
import { applicationSchema } from "@/lib/validation";
import { randomUUID } from "node:crypto";

export async function GET() {
  ensureSchema();
  return Response.json(db.select().from(applications).limit(50).all());
}
export async function POST(request: Request) {
  ensureSchema();
  try {
    const input = applicationSchema.parse(await request.json());
    const approved =
      input.annualIncomeCents >= 3000000 && input.creditScore >= 680;
    const limitCents = approved
      ? input.creditScore >= 760
        ? 1000000
        : 500000
      : null;
    const now = new Date();
    const [row] = db
      .insert(applications)
      .values({
        ...input,
        id: randomUUID(),
        kycStatus: "passed",
        kycReason:
          "Demo KYC stub passed: required identity fields are present.",
        decisionStatus: approved ? "approved" : "declined",
        decisionReasons: JSON.stringify([
          approved
            ? "Income and credit score meet demo policy thresholds."
            : "Demo policy requires $30,000 annual income and a 680+ score.",
        ]),
        approvedLimitCents: limitCents,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .all();
    return Response.json(row, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: {
          code: "INVALID_APPLICATION",
          message:
            error instanceof Error ? error.message : "Invalid application",
        },
      },
      { status: 400 },
    );
  }
}
