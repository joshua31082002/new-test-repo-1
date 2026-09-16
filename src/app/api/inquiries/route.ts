import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { inquiries } from '@/db/schema';

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email.'),
  organization: z.string().trim().min(2, 'Please enter your organization.'),
  projectType: z.string().trim().min(2, 'Please choose a project type.'),
  context: z.string().trim().min(2, 'Please share a little about the timing or budget.'),
  message: z.string().trim().min(20, 'Please share a little more about the project.'),
});

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const parsed = inquirySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the highlighted fields and try again.', fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const [inquiry] = await db.insert(inquiries).values(parsed.data).returning({ id: inquiries.id });

    return NextResponse.json(
      { message: 'Your note is with us. We will be in touch shortly.', id: inquiry?.id },
      { status: 201 },
    );
  } catch (error) {
    console.error('Inquiry submission failed', error);
    return NextResponse.json(
      { error: 'We could not send your note right now. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
