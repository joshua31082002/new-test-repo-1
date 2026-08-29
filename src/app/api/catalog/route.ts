import { NextResponse } from "next/server";
import { and, asc, eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().slice(0, 80);
  const category = searchParams.get("category")?.trim().slice(0, 40);
  const filters = [];
  if (query)
    filters.push(
      or(
        like(products.name, `%${query}%`),
        like(products.description, `%${query}%`),
      ),
    );
  if (category) filters.push(eq(products.categoryId, category));
  const items = await db
    .select()
    .from(products)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(products.name))
    .limit(100);
  const cats = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder));
  return NextResponse.json({ categories: cats, products: items });
}
