import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { carts, cartItems, products } from "@/db/schema";
import { getSessionId } from "@/lib/session";
import { z } from "zod";

const cartInput = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export async function POST(request: Request) {
  const parsed = cartInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  const sessionId = await getSessionId();
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, parsed.data.productId))
    .get();
  if (!product || !product.available)
    return NextResponse.json(
      { error: "Product unavailable." },
      { status: 409 },
    );
  let cart = await db
    .select()
    .from(carts)
    .where(eq(carts.sessionId, sessionId))
    .get();
  if (!cart) {
    const id = crypto.randomUUID();
    await db.insert(carts).values({ id, sessionId, updatedAt: new Date() });
    cart = await db.select().from(carts).where(eq(carts.id, id)).get();
  }
  if (!cart)
    return NextResponse.json(
      { error: "Could not create cart." },
      { status: 500 },
    );
  const existing = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id))
    .all();
  const item = existing.find((entry) => entry.productId === product.id);
  if (item)
    await db
      .update(cartItems)
      .set({ quantity: item.quantity + parsed.data.quantity })
      .where(eq(cartItems.id, item.id));
  else
    await db.insert(cartItems).values({
      id: crypto.randomUUID(),
      cartId: cart.id,
      productId: product.id,
      quantity: parsed.data.quantity,
    });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const sessionId = await getSessionId();
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.sessionId, sessionId))
    .get();
  if (!cart) return NextResponse.json({ items: [] });
  const items = await db
    .select({ item: cartItems, product: products })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));
  return NextResponse.json({ items });
}
