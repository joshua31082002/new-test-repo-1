# Credit Card Issuer Demo Implementation Plan

1. Scaffold the Next.js 16.3 TypeScript App Router app and configure a 0.0.0.0 preview on port 4173 with `*.staging.revolte.io` as an allowed development origin.
2. Add Drizzle, SQLite, Zod, and test tooling. Define normalized issuer tables, indexes, migrations, database bootstrap, seed data, and integer-cent helpers.
3. Implement application intake, deterministic KYC stub, transparent income/score decisioning, and validated application routes.
4. Implement account/card lifecycle services and routes with explicit transition checks and persisted tokenized card values.
5. Implement authorization, settlement, decline, and refund services/routes. Use database transactions and exact cents for holds, posted balance, available credit, and refund bounds.
6. Implement monthly statement generation keyed by account closing day, deterministic item ordering, running balances, minimum due, due date, unique cycle constraint, and statement routes.
7. Build the shared shell, Admin dashboard, application/account/transaction/statement surfaces, and Cardholder account view. Use the approved warm-neutral/navy/cyan visual language, realistic seeded content, responsive layouts, and complete UI states.
8. Add route/domain tests for happy and rejection paths, run formatting/type-check/lint/build/tests, perform preview verification, and re-open touched UI against the fidelity checklist.

## Verification matrix

- Application: valid creation and invalid-field rejection; decision reason persistence.
- Lifecycle: issue/activate/limit/freeze/unfreeze/close plus invalid transitions.
- Transactions: authorization, insufficient-limit/frozen declines, settlement, over-refund rejection, balance reconciliation.
- Statements: cycle selection, itemization, running balance, minimum due, due date, duplicate-cycle protection.
- Persistence: write through API, reload/refetch, and confirm records remain in SQLite.
- UI: Admin/Cardholder switcher, disclosures, loading/empty/error/success/disabled/focus/responsive states.
- Build hygiene: formatter, type-check, lint, tests, `npm run build`, preview route checks, and dependency audit.
