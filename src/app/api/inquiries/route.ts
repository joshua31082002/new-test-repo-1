import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(200),
  company: z.string().trim().max(120).optional(),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more about what you are working through.")
    .max(2000),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = inquirySchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields and try again.",
          fields: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await db.insert(inquiries).values({
      ...result.data,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inquiry submission failed", error);
    return NextResponse.json(
      { error: "We could not save your note. Please try again." },
      { status: 500 },
    );
  }
}
