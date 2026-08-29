export function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function minimumDueCents(balanceCents: number) {
  if (balanceCents <= 0) return 0;
  return Math.min(
    balanceCents,
    Math.max(2500, Math.ceil((balanceCents * 2) / 100)),
  );
}
