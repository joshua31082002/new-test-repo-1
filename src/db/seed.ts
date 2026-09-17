import 'dotenv/config';
import { db, schema } from './index';

async function main() {
  const existing = await db.select({ id: schema.scoreboard.id }).from(schema.scoreboard).limit(1);

  if (existing.length === 0) {
    await db.insert(schema.scoreboard).values({ id: 1, updatedAt: new Date() });
  }

  console.log('Scoreboard ready.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
