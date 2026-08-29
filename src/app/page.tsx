import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import Storefront from "@/components/storefront";

export default async function Home() {
  const [catalog, groups] = await Promise.all([
    db.select().from(products).where(undefined).orderBy(asc(products.name)),
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
  ]);
  return <Storefront products={catalog} categories={groups} />;
}
