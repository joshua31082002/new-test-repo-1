"use client";

import { useEffect, useState } from "react";

const money = (value: unknown) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value ?? 0) / 100);
const date = (value: unknown) => new Date(String(value)).toLocaleDateString("en-US", { month: "short", day: "numeric" });
type Row = Record<string, string | number | null>;
type Dashboard = { accounts: Row[]; transactions: Row[]; statements: Row[] };

export default function CardholderPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { fetch("/api/demo", { cache: "no-store" }).then((response) => response.json()).then((body) => setData(body.data)); }, []);
  async function toggle() { if (!data?.accounts[0]) return; const action = data.accounts[0].status === "frozen" ? "unfreeze" : "freeze"; const response = await fetch("/api/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, payload: { accountId: data.accounts[0].id } }) }); const body = await response.json(); setMessage(response.ok ? "Your card controls are updated." : body.error.message); if (response.ok) setData(body.data.dashboard); }
  if (!data) return <main><p className="muted">Loading cardholder view…</p></main>;
  const account = data.accounts[0];
  return <main><header className="topbar"><div className="brand"><span className="brand-mark">L</span><span>Ledgerline / cardholder</span></div><span className="demo-pill">Tokenized demo</span></header><div className="hero"><div><p className="eyebrow accent">Your card, clearly</p><h2>Good morning,<br /><em>{account.cardholder_name}</em>.</h2><p className="lede">A customer view of the same persisted account record. No real card or money is connected.</p></div></div>{message && <div className="toast" role="status">{message}</div>}<section className="grid-layout"><div className="panel account-card"><p className="eyebrow">Available to spend</p><div className="balance">{money(account.available_credit_cents)}</div><p className="card-number">{account.tokenized_number}</p><div className="status-row"><span>Card status</span><strong className="capitalize">{account.status}</strong></div><button className="button primary" onClick={toggle}>{account.status === "frozen" ? "Unfreeze card" : "Freeze card"}</button></div><div className="panel"><div className="panel-heading"><div><p className="eyebrow">Activity</p><h3>Recent transactions</h3></div></div><div className="list">{data.transactions.slice(0, 6).map((transaction) => <div className="list-row" key={String(transaction.id)}><div><div className="list-title">{String(transaction.merchant_name)}</div><div className="list-subtitle">{String(transaction.description)} · {date(transaction.created_at)}</div></div><strong>{money(transaction.amount_cents)}</strong></div>)}</div></div><div className="panel full"><div className="panel-heading"><div><p className="eyebrow">Billing history</p><h3>Statements</h3></div></div>{data.statements.length ? data.statements.map((statement) => <div className="list-row" key={String(statement.id)}><span>Period ending {date(statement.period_end)}</span><strong>{money(statement.balance_cents)}</strong></div>) : <p className="muted">Your first statement will appear here after the account activity is generated.</p>}</div></section></main>;
}
