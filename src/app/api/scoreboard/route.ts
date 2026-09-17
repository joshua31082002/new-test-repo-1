import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';

export const dynamic = 'force-dynamic';

const resultSchema = z.object({
  result: z.enum(['x', 'o', 'draw']),
});

async function getScoreboard() {
  const existing = await db
    .select({
      xWins: schema.scoreboard.xWins,
      oWins: schema.scoreboard.oWins,
      draws: schema.scoreboard.draws,
    })
    .from(schema.scoreboard)
    .where(eq(schema.scoreboard.id, 1))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  await db.insert(schema.scoreboard).values({ id: 1, updatedAt: new Date() });

  return { xWins: 0, oWins: 0, draws: 0 };
}

export async function GET() {
  try {
    return Response.json(await getScoreboard());
  } catch (error) {
    console.error('Failed to load scoreboard', error);
    return Response.json({ error: 'Unable to load scoreboard.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = resultSchema.safeParse(await request.json());

    if (!payload.success) {
      return Response.json({ error: 'Result must be x, o, or draw.' }, { status: 400 });
    }

    await db
      .insert(schema.scoreboard)
      .values({ id: 1, updatedAt: new Date() })
      .onConflictDoNothing();

    const current = await db
      .select({
        xWins: schema.scoreboard.xWins,
        oWins: schema.scoreboard.oWins,
        draws: schema.scoreboard.draws,
      })
      .from(schema.scoreboard)
      .where(eq(schema.scoreboard.id, 1))
      .limit(1);
    const score = current[0];

    if (!score) {
      return Response.json({ error: 'Unable to load scoreboard.' }, { status: 500 });
    }

    await db
      .update(schema.scoreboard)
      .set({
        xWins: payload.data.result === 'x' ? score.xWins + 1 : score.xWins,
        oWins: payload.data.result === 'o' ? score.oWins + 1 : score.oWins,
        draws: payload.data.result === 'draw' ? score.draws + 1 : score.draws,
        updatedAt: new Date(),
      })
      .where(eq(schema.scoreboard.id, 1));

    return Response.json(await getScoreboard(), { status: 201 });
  } catch (error) {
    console.error('Failed to record scoreboard result', error);
    return Response.json({ error: 'Unable to record result.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db
      .insert(schema.scoreboard)
      .values({ id: 1, updatedAt: new Date() })
      .onConflictDoNothing();
    await db
      .update(schema.scoreboard)
      .set({ xWins: 0, oWins: 0, draws: 0, updatedAt: new Date() })
      .where(eq(schema.scoreboard.id, 1));

    return Response.json(await getScoreboard());
  } catch (error) {
    console.error('Failed to reset scoreboard', error);
    return Response.json({ error: 'Unable to reset scoreboard.' }, { status: 500 });
  }
}
