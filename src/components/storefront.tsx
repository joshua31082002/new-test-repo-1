"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Leaf,
  Search,
  ShoppingBasket,
  Sparkles,
  X,
} from "lucide-react";

type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  badge: string | null;
  available: boolean;
};
type Category = { id: string; name: string; emoji: string; sortOrder: number };
type Props = { products: Product[]; categories: Category[] };
type CartItem = Product & { quantity: number; substitute?: string };

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function Storefront({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === "all" || product.categoryId === activeCategory;
        const search = query.toLowerCase();
        return (
          matchesCategory &&
          (!search ||
            `${product.name} ${product.description}`
              .toLowerCase()
              .includes(search))
        );
      }),
    [products, activeCategory, query],
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing)
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      return [...current, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to basket`);
    window.setTimeout(() => setToast(""), 2200);
  }
  function updateQuantity(id: string, delta: number) {
    setCart((current) =>
      current.flatMap((item) =>
        item.id !== id
          ? [item]
          : item.quantity + delta <= 0
            ? []
            : [{ ...item, quantity: item.quantity + delta }],
      ),
    );
  }

  return (
    <main>
      <header className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-ink text-xl text-lime">
            ✳
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">
            basket<span className="text-lime-dark">.</span>
          </span>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold sm:flex">
          <span>⌖</span> Delivering to{" "}
          <span className="text-muted">Green Park, 110016</span>
          <ChevronRight size={15} />
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white transition hover:bg-lime-dark"
        >
          <ShoppingBasket size={18} />{" "}
          <span className="hidden sm:inline">Basket</span>
          {count > 0 && (
            <b className="grid size-5 place-items-center rounded-full bg-lime text-xs text-ink">
              {count}
            </b>
          )}
        </button>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 pb-7 pt-4 sm:px-8 lg:px-12 lg:pt-10">
        <div className="relative overflow-hidden rounded-[30px] bg-ink px-7 py-10 text-white sm:px-12 sm:py-14">
          <div className="relative z-10 max-w-xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-lime">
              <Sparkles size={16} /> Your weekly shop, sorted
            </p>
            <h1 className="font-display text-4xl font-bold leading-[.98] tracking-[-.06em] sm:text-6xl">
              Good food.
              <br />
              <span className="text-lime">Zero fuss.</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/65">
              Fresh picks, pantry staples, and everything in between. At your
              door in 20–30 minutes.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("shop")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-7 flex min-h-12 items-center gap-2 rounded-full bg-lime px-5 font-bold text-ink transition hover:bg-white"
            >
              Shop the essentials <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute -right-8 -top-20 size-72 rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute -bottom-32 right-8 size-80 rounded-full border-[48px] border-white/5 sm:right-24" />
          <div className="absolute bottom-5 right-8 hidden text-[130px] leading-none sm:block">
            🥬
          </div>
        </div>
      </section>

      <section
        id="shop"
        className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12"
      >
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-lime-dark">
              Curated for your home
            </p>
            <h2 className="font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">
              Stock up, stay happy.
            </h2>
          </div>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-white px-4 text-muted sm:w-80">
            <Search size={19} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groceries..."
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </label>
        </div>
        <nav
          aria-label="Shop categories"
          className="mb-8 flex gap-2 overflow-x-auto pb-1"
        >
          {[{ id: "all", name: "All items", emoji: "✦" }, ...categories].map(
            (category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${activeCategory === category.id ? "bg-ink text-white" : "border border-line bg-white hover:border-lime-dark"}`}
              >
                {category.emoji} {category.name}
              </button>
            ),
          )}
        </nav>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-white py-20 text-center">
            <p className="text-4xl">🧺</p>
            <h3 className="mt-3 font-display text-xl font-bold">
              No groceries found
            </h3>
            <p className="mt-1 text-sm text-muted">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product, index) => (
              <article
                key={product.id}
                className="animate-rise group rounded-3xl border border-line bg-white p-2.5 shadow-[0_1px_0_rgba(0,0,0,.02)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 220px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold backdrop-blur">
                    {product.badge ?? (
                      <>
                        <Leaf size={11} className="text-lime-dark" /> Fresh
                        choice
                      </>
                    )}
                  </div>
                </div>
                <div className="px-1.5 pb-1 pt-3">
                  <h3 className="truncate font-bold">{product.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {product.unit} · {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="font-display font-bold">
                        {money(product.price)}
                      </span>
                      {product.originalPrice && (
                        <del className="ml-1 text-xs text-muted">
                          {money(product.originalPrice)}
                        </del>
                      )}
                    </div>
                    <button
                      aria-label={`Add ${product.name} to basket`}
                      onClick={() => addToCart(product)}
                      className="grid size-10 place-items-center rounded-xl bg-lime text-xl font-bold text-ink transition hover:bg-ink hover:text-lime"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-xl"
        >
          ✓ {toast}
        </div>
      )}
      {showCart && (
        <Cart
          cart={cart}
          subtotal={subtotal}
          onClose={() => setShowCart(false)}
          onUpdate={updateQuantity}
          onCheckout={() => {
            setShowCart(false);
            setToast("Checkout is ready — your basket is saved");
          }}
        />
      )}
    </main>
  );
}

function Cart({
  cart,
  subtotal,
  onClose,
  onUpdate,
  onCheckout,
}: {
  cart: CartItem[];
  subtotal: number;
  onClose: () => void;
  onUpdate: (id: string, delta: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close basket"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
      />
      <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-paper p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-lime-dark">
              Your basket
            </p>
            <h2 className="font-display text-3xl font-bold">
              {cart.length ? "Looking good." : "It is empty."}
            </h2>
          </div>
          <button
            aria-label="Close basket"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full bg-white transition hover:bg-lime"
          >
            <X size={20} />
          </button>
        </div>
        {cart.length ? (
          <>
            <div className="mt-8 flex-1 space-y-3 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-line bg-white p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.unit} · {money(item.price)}
                    </p>
                    <div className="mt-2 flex w-fit items-center gap-3 rounded-lg bg-paper">
                      <button
                        aria-label={`Remove one ${item.name}`}
                        onClick={() => onUpdate(item.id, -1)}
                        className="grid size-8 place-items-center font-bold"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button
                        aria-label={`Add one ${item.name}`}
                        onClick={() => onUpdate(item.id, 1)}
                        className="grid size-8 place-items-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="font-bold">
                    {money(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-line pt-5">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted">
                <span>Delivery</span>
                <span className="font-bold text-lime-dark">FREE</span>
              </div>
              <div className="mt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{money(subtotal)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-ink font-bold text-white transition hover:bg-lime-dark"
              >
                Continue to checkout <ArrowRight size={18} />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
                <Clock3 size={13} /> Arrives in 20–30 min · Pay on delivery
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="grid size-20 place-items-center rounded-full bg-lime text-4xl">
              🧺
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              Add a few essentials and we’ll get them moving your way.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
            >
              Start shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
