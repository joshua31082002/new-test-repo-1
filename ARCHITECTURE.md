# Demo issuer core architecture

**Status:** Approved for v1 implementation  
**Audience:** Internal demo and investor walkthroughs  
**Boundary:** This system simulates issuer-core behavior only. It does not process real payments, connect to card networks, perform real KYC or bureau checks, issue physical cards, store real PANs, or provide financial advice.

## Product shape

The application has two linked experiences:

- **Admin console:** drives applications, account lifecycle, simulated transactions, and statement generation.
- **Cardholder view:** presents the same persisted account state as a customer would see and allows freeze/unfreeze.

A seeded, plausible approved account makes the guided story immediately usable. New applications remain supported for exploration.

## Primary flow

```text
Application intake
  -> demo KYC status recorded
  -> rules decision (age >= 18 AND income >= $50,000)
  -> approved application
  -> virtual card issued
  -> activated + credit limit set
  -> authorize (reserve available credit)
  -> settle (post balance)
  -> refund (reduce balance)
  -> generate rolling statement
  -> admin and cardholder read the same records
```

Rejected paths are first-class: failed credit rules, invalid lifecycle transitions, frozen/closed cards, and insufficient available credit produce explicit declined outcomes and do not create misleading posted charges.

## Runtime and persistence

- Next.js App Router, current stable release verified at implementation time.
- TypeScript.
- Drizzle ORM with SQLite for the local, single-instance demo.
- Route handlers provide the server boundary. Domain operations live in a small service layer so balance and lifecycle invariants are not duplicated in UI code.
- SQLite transactions wrap every mutation that changes account totals plus its transaction record.
- Monetary values are integer cents (`INTEGER`), never JavaScript floating-point amounts.
- Timestamps are stored as ISO strings in UTC. Dates used for statement periods are stored explicitly so a generated statement is reproducible.

SQLite is appropriate here because the audience is internal, the expected load is low, and it provides relational integrity without another service. A production deployment would revisit the engine, connection model, authentication, audit requirements, and compliance controls before handling any real financial data.

## Data model

### `applications`

- `id` — text primary key
- `full_name`, `email`, `date_of_birth` — required applicant data
- `annual_income_cents` — integer cents
- `kyc_status` — `not_run | passed` (demo stub)
- `decision` — `pending | approved | declined`
- `decision_reason` — explainable rule result
- `created_at`, `updated_at`

### `card_accounts`

- `id` — text primary key
- `application_id` — unique foreign key
- `cardholder_name`
- `tokenized_number` — generated fake display number; never a real PAN
- `status` — `issued | active | frozen | closed`
- `credit_limit_cents`
- `posted_balance_cents`
- `authorized_hold_cents`
- `created_at`, `updated_at`

Derived available credit is `credit_limit_cents - posted_balance_cents - authorized_hold_cents` and is computed from persisted integer fields rather than cached in the browser.

### `transactions`

- `id` — text primary key
- `account_id` — foreign key
- `merchant_name`, `description`
- `amount_cents` — positive integer for charges/refunds represented by `kind`
- `kind` — `purchase | refund`
- `status` — `authorized | settled | declined | refunded`
- `decline_reason` — nullable machine-readable/human-readable reason
- `parent_transaction_id` — nullable link for a refund to its settled purchase
- `authorized_at`, `settled_at`, `refunded_at`, `created_at`

A declined attempt is persisted as an audit-friendly transaction with zero effect on posted balance and holds. A refund is a separate transaction linked to its original purchase; it cannot exceed the original settled amount.

### `statements`

- `id` — text primary key
- `account_id` — foreign key
- `period_start`, `period_end`
- `generated_at`, `due_at`
- `balance_cents`, `minimum_due_cents`
- `created_at`

### `statement_items`

- `id` — text primary key
- `statement_id` — foreign key
- `transaction_id` — foreign key
- `running_balance_cents`
- `amount_cents`
- `description`, `posted_at`

Statement generation selects settled purchase and refund activity after the account's previous statement end and through the generation instant. It snapshots item details and running balances, avoiding a statement changing when later transaction records change. Minimum due is `min(balance, max(2500, floor(balance * 5 / 100)))`, with zero balance producing zero due.

Indexes support account transaction history, account statements by generation time, and statement items by statement ID. List responses are bounded with a small page size and explicit ordering.

## Domain invariants

1. Only an approved application can create an account.
2. An account has at most one card account.
3. Issue creates an `issued` account; activation moves `issued -> active`.
4. `active -> frozen -> active` is allowed; `closed` is terminal.
5. Limit changes accept positive integer cents and cannot make the account overdrawn.
6. Authorization is allowed only for `active` accounts and only when amount is at most available credit.
7. Settlement is allowed only for an authorized transaction and moves its hold into posted balance exactly once.
8. Refund is allowed only once for a settled purchase and cannot exceed its amount.
9. A statement includes only settled/refunded activity in its captured period and snapshots its own item rows.

## API surface

All mutation routes use a consistent JSON error shape: `{ error: { code, message } }`. Request bodies and route parameters are validated with Zod. Mutations that can be retried accept an idempotency key; the demo stores it with the operation where needed.

- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/:id`
- `POST /api/applications/:id/issue`
- `GET /api/accounts`
- `GET /api/accounts/:id`
- `POST /api/accounts/:id/activate`
- `POST /api/accounts/:id/limit`
- `POST /api/accounts/:id/freeze`
- `POST /api/accounts/:id/unfreeze`
- `POST /api/accounts/:id/close`
- `GET /api/accounts/:id/transactions`
- `POST /api/accounts/:id/transactions/authorize`
- `POST /api/transactions/:id/settle`
- `POST /api/transactions/:id/refund`
- `GET /api/accounts/:id/statements`
- `POST /api/accounts/:id/statements/generate`

The UI uses these real routes; no browser-only or in-memory source of truth is used.

## UI structure and visual direction

**Persona:** investor/executive at a desk, following a guided story. The interface should feel credible, calm, and legible at a glance, with enough density to communicate a real issuer core without looking like a back-office spreadsheet.

**Mood:** assured, editorial, and quietly premium. Use warm paper-toned neutrals for the canvas, deep ink for primary text, and a restrained teal accent for trusted actions. Use amber and red only for meaningful risk/status signals. Avoid gradients, fake payment-brand marks, and decorative dashboard clutter.

**Typography:** a distinctive display face for page titles paired with a highly legible sans for controls and data. Establish a compact type scale, clear numeric emphasis, and tabular figures for balances.

**Layout:** a persistent top-level context bar, a strong account summary, then a two-column narrative: lifecycle/action rail beside transaction and statement evidence. Cardholder view keeps balance and freeze control above recent activity. Use an 8px spacing rhythm, modest 12–16px radii, and low-elevation surfaces. All values are design tokens in the stylesheet.

**Interaction:** one primary next action per panel; mutations show disabled/loading state, inline success confirmation, and recoverable errors. The demo banner is persistent and explicit: fake/tokenized numbers, no real money movement.

## Reliability and security posture for the demo

- No secrets or real card data in source control.
- Validate all form inputs server-side; client validation is supplemental.
- Use parameterized Drizzle queries and strict enum validation.
- Keep server-side account mutation logic centralized and transactional.
- Add secure baseline headers and avoid rendering sensitive-looking values beyond tokenized demo numbers.
- Authentication, role-based access, audit retention, reconciliation, dispute handling, rate limiting, monitoring, and PCI controls are required before any production or real-money use.

## Alternatives and revisit points

- **SQLite vs Postgres:** SQLite wins for a self-contained investor demo. Move to Postgres when multiple application instances, concurrent operators, backups, or production availability matter.
- **Route handlers vs separate API service:** route handlers minimize deployment and keep the demo easy to run. Split the domain service behind a separately deployed API when external clients or independent scaling appear.
- **Snapshot statements vs recomputation:** snapshots make historical statements stable and explainable. A production ledger would add immutable journal entries, payment allocation, reversals, and reconciliation rather than treating account totals as the complete source of truth.
