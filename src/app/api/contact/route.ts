import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { contactInquiries } from "@/db/schema";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please share your name.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  message: z.string().trim().min(10, "Please tell us a little more.").max(2000),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please check the highlighted fields." },
        { status: 400 },
      );
    }

    await db.insert(contactInquiries).values({
      ...result.data,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Your note is on its way." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact inquiry failed", error);
    return NextResponse.json(
      { error: "We couldn’t save your note. Please try again." },
      { status: 500 },
    );
  }
}
