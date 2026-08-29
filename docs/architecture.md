# Credit Card Issuer Demo Architecture

**Status:** Accepted for v1 demo implementation

## Context

This application demonstrates a simplified issuer core for internal presenters and investors. It must show application intake, deterministic mock underwriting, virtual card lifecycle, transaction simulation, refunds, and monthly statements while making no real network, KYC, bureau, payment, or money-movement calls. Every record must survive reload, and all money must be exact integer cents.

## Decision

Use a single Next.js 16.3 App Router application with TypeScript, REST-style `/api/v1` route handlers, Drizzle ORM, and a local SQLite database. Keep domain operations in server-side services and make each multi-row mutation an explicit database transaction. Use a no-sign-in Admin/Cardholder view switcher only for the internal demo; this must not be treated as production authorization.

## Component flow

```text
Admin/Cardholder UI -> Next.js route handlers -> Zod validation
                                      -> issuer domain services
                                      -> Drizzle transaction
                                      -> SQLite
```

## Data model

- `applications`: applicant fields, KYC result, decision status/reasons, approved limit.
- `card_accounts`: application link, tokenized display number, lifecycle status, limit cents, closing day.
- `transactions`: account link, optional authorization/refund parent, merchant metadata, signed cents, state, decline reason, timestamps.
- `statements`: account link, unique cycle dates, balance components, minimum due, generated timestamp.
- `statement_items`: statement/transaction links, deterministic order, running balance, display snapshot.

Relationships are normalized. Indexes cover account/status/date and statement account/cycle lookup. Lists are bounded with offset pagination and a server-side maximum page size.

## Accounting invariants

- Amounts are integers in cents at every boundary; formatting to currency happens only in the UI.
- Posted balance equals settled purchase cents minus settled refund/credit cents. Available credit equals limit minus posted balance minus open authorization holds.
- Authorization checks lifecycle status and available credit, then records a pending hold. Settlement only accepts an authorized transaction, posts it, and releases its hold. Declines are persisted for audit but do not change posted balance.
- Refunds accept only settled parents and cumulative refunds cannot exceed the parent amount.
- Lifecycle transitions are explicit; closed cards cannot reactivate.
- Statement generation includes settled/refund entries in the inclusive cycle, orders by timestamp then id, computes running balances, and enforces one statement per account/cycle.

## API contracts

Mutations use Zod schemas and return either a resource or `{ error: { code, message, fieldErrors? } }`.

- `POST/GET /api/v1/applications`
- `POST /api/v1/applications/:id/decision`
- `POST/GET /api/v1/accounts`, `GET /api/v1/accounts/:id`
- `POST /api/v1/accounts/:id/{activate,freeze,unfreeze,close,limit}`
- `GET /api/v1/accounts/:id/transactions`
- `POST /api/v1/transactions/authorize`
- `POST /api/v1/transactions/:id/{settle,refund}`
- `GET /api/v1/statements`, `GET /api/v1/accounts/:id/statements`
- `POST /api/v1/accounts/:id/statements/generate`
- `GET /api/v1/demo/summary`

## Key trade-offs

SQLite is self-contained and ideal for a deterministic single-instance demo; Postgres should replace the driver before multi-instance or production-like concurrent writes. Derived balances minimize drift and make reconciliation explicit, while a high-volume licensed issuer would require a stronger ledger/event-audit model. Offset pagination is simple for demo volumes; cursor pagination is the future path for large changing histories.

## Security and disclosure

The demo has no authentication by design and must remain internal. Inputs are validated at route boundaries, SQL uses Drizzle parameterization, no real PAN/CVV is accepted or stored, and UI copy states that all card values are fake/tokenized and transactions are simulations with no real money movement.
