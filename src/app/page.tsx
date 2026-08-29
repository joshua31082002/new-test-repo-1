"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/money";

type Account = {
  id: string;
  applicant: string;
  tokenizedNumber: string;
  status: string;
  limitCents: number;
  balanceCents: number;
  availableCents: number;
};
type Data = {
  applications: {
    id: string;
    applicantName: string;
    decisionStatus: string;
    decisionReasons: string;
  }[];
  accounts: Account[];
  transactions: {
    id: string;
    accountId: string;
    merchant: string;
    amountCents: number;
    status: string;
    createdAt: string;
  }[];
  statements: {
    id: string;
    accountId: string;
    endingBalanceCents: number;
    minimumDueCents: number;
    cycleEnd: string;
  }[];
};

const initial: Data = {
  applications: [],
  accounts: [],
  transactions: [],
  statements: [],
};
export default function Home() {
  const [view, setView] = useState<"admin" | "cardholder">("admin");
  const [data, setData] = useState<Data>(initial);
  const [selected, setSelected] = useState("");
  const [merchant, setMerchant] = useState("Northstar Coffee");
  const [amount, setAmount] = useState("4200");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/demo/summary", {
        cache: "no-store",
      });
      const next = (await response.json()) as Data;
      setData(next);
      if (!selected && next.accounts[0]) setSelected(next.accounts[0].id);
    } catch {
      setMessage("Could not load the demo ledger.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const account =
    data.accounts.find((item) => item.id === selected) ?? data.accounts[0];
  async function authorize() {
    if (!account) return;
    setMessage("");
    const response = await fetch("/api/v1/transactions/authorize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        accountId: account.id,
        merchant,
        category: "Everyday",
        description: "Presenter-triggered demo purchase",
        amountCents: Number(amount),
      }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? "Authorization approved and held."
        : (result.error?.message ?? "Authorization declined."),
    );
    await load();
  }
  if (loading)
    return (
      <main className="loading">
        <span className="pulse" /> Loading issuer ledger…
      </main>
    );
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">LUMEN / ISSUER CORE</p>
          <h1>Credit, made visible.</h1>
        </div>
        <div className="view-switcher" role="group" aria-label="Demo view">
          <button
            className={view === "admin" ? "active" : ""}
            onClick={() => setView("admin")}
          >
            Admin console
          </button>
          <button
            className={view === "cardholder" ? "active" : ""}
            onClick={() => setView("cardholder")}
          >
            Cardholder view
          </button>
        </div>
      </header>
      <div className="notice">
        <strong>Internal demonstration only.</strong> Fake/tokenized card
        values. Simulated transactions. No real money movement, card network,
        KYC, bureau, or financial advice.
      </div>
      {view === "admin" ? (
        <Admin
          data={data}
          account={account}
          selected={selected}
          setSelected={setSelected}
          merchant={merchant}
          setMerchant={setMerchant}
          amount={amount}
          setAmount={setAmount}
          authorize={authorize}
          message={message}
        />
      ) : (
        <Cardholder
          account={account}
          transactions={data.transactions}
          statements={data.statements}
        />
      )}
    </main>
  );
}
function Admin({
  data,
  account,
  selected,
  setSelected,
  merchant,
  setMerchant,
  amount,
  setAmount,
  authorize,
  message,
}: {
  data: Data;
  account?: Account;
  selected: string;
  setSelected: (id: string) => void;
  merchant: string;
  setMerchant: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  authorize: () => void;
  message: string;
}) {
  return (
    <>
      <section className="hero-row">
        <div>
          <p className="eyebrow">OPERATIONS / OVERVIEW</p>
          <h2>Issuer control room</h2>
          <p className="muted">
            A deterministic sandbox for the full card lifecycle.
          </p>
        </div>
        <div className="stat">
          <span>Active accounts</span>
          <strong>
            {data.accounts.filter((item) => item.status === "active").length}
          </strong>
        </div>
        <div className="stat">
          <span>Applications</span>
          <strong>{data.applications.length}</strong>
        </div>
      </section>
      <section className="grid">
        <article className="panel account-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">ACCOUNT PORTFOLIO</p>
              <h3>Demo accounts</h3>
            </div>
            <span className="tag">{data.accounts.length} records</span>
          </div>
          {data.accounts.length === 0 ? (
            <p className="muted">
              No accounts yet. Create one from an approved application.
            </p>
          ) : (
            data.accounts.map((item) => (
              <button
                className={`account-row ${item.id === selected ? "selected" : ""}`}
                key={item.id}
                onClick={() => setSelected(item.id)}
              >
                <span className="avatar">
                  {item.applicant
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="account-name">
                  <strong>{item.applicant}</strong>
                  <small>•••• {item.tokenizedNumber.slice(-4)}</small>
                </span>
                <span className={`status ${item.status}`}>{item.status}</span>
                <strong>{money(item.balanceCents)}</strong>
              </button>
            ))
          )}
        </article>
        <article className="panel action-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">DEMO CONTROL</p>
              <h3>Trigger authorization</h3>
            </div>
            <span className="tag accent">Manual</span>
          </div>
          {account ? (
            <>
              <p className="muted">
                Testing against {account.applicant} ·{" "}
                {money(account.availableCents)} available
              </p>
              <label>
                Merchant
                <input
                  value={merchant}
                  onChange={(event) => setMerchant(event.target.value)}
                />
              </label>
              <label>
                Amount in cents
                <input
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </label>
              <button className="primary" onClick={authorize}>
                Authorize purchase <span>→</span>
              </button>
              {message && <p className="feedback">{message}</p>}
            </>
          ) : (
            <p className="muted">Select an account to begin.</p>
          )}
        </article>
      </section>
      <section className="panel table-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">ACTIVITY STREAM</p>
            <h3>Latest transactions</h3>
          </div>
          <span className="tag">{data.transactions.length} events</span>
        </div>
        <div className="activity-list">
          {data.transactions.slice(0, 8).map((transaction) => (
            <div className="activity-row" key={transaction.id}>
              <span className={`dot ${transaction.status}`} />
              <span>
                <strong>{transaction.merchant}</strong>
                <small>
                  Account #{transaction.accountId} · {transaction.status}
                </small>
              </span>
              <strong>{money(transaction.amountCents)}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
function Cardholder({
  account,
  transactions,
  statements,
}: {
  account?: Account;
  transactions: Data["transactions"];
  statements: Data["statements"];
}) {
  if (!account)
    return (
      <section className="empty">
        <h2>No demo account yet</h2>
        <p>Return to the Admin console to create a cardholder scenario.</p>
      </section>
    );
  return (
    <>
      <section className="hero-row cardholder-hero">
        <div>
          <p className="eyebrow">CARDHOLDER / MY ACCOUNT</p>
          <h2>Good morning, {account.applicant.split(" ")[0]}.</h2>
          <p className="muted">Your sandbox account is {account.status}.</p>
        </div>
        <div className="virtual-card">
          <span>LUMEN</span>
          <strong>{account.tokenizedNumber}</strong>
          <small>VIRTUAL · DEMO ONLY</small>
        </div>
      </section>
      <section className="balance-grid">
        <div className="balance-card">
          <span>Current balance</span>
          <strong>{money(account.balanceCents)}</strong>
          <small>of {money(account.limitCents)} limit</small>
        </div>
        <div className="balance-card light">
          <span>Available to spend</span>
          <strong>{money(account.availableCents)}</strong>
          <small>Updates after authorization</small>
        </div>
      </section>
      <section className="grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">RECENT ACTIVITY</p>
              <h3>Transactions</h3>
            </div>
          </div>
          {transactions
            .filter((item) => item.accountId === account.id)
            .slice(0, 6)
            .map((item) => (
              <div className="activity-row" key={item.id}>
                <span className={`dot ${item.status}`} />
                <span>
                  <strong>{item.merchant}</strong>
                  <small>{item.status}</small>
                </span>
                <strong>{money(item.amountCents)}</strong>
              </div>
            ))}
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">STATEMENT HISTORY</p>
              <h3>Monthly statements</h3>
            </div>
          </div>
          {statements
            .filter((item) => item.accountId === account.id)
            .map((item) => (
              <div className="statement-row" key={item.id}>
                <span>
                  <strong>Cycle ending {item.cycleEnd}</strong>
                  <small>Minimum due {money(item.minimumDueCents)}</small>
                </span>
                <strong>{money(item.endingBalanceCents)}</strong>
              </div>
            ))}
          <p className="muted small">
            Statements are generated by the Admin console for this demo.
          </p>
        </article>
      </section>
    </>
  );
}
