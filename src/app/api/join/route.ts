import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const existing = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.email, result.data.email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You’re already on the list." },
        { status: 409 },
      );
    }

    await db.insert(subscribers).values({
      email: result.data.email,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "You’re in. Watch your inbox." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Join request failed", error);
    return NextResponse.json(
      { message: "We couldn’t save that just now. Try again." },
      { status: 500 },
    );
  }
}
