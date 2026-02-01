Title: chore(audit): normalize admin layout; remove test endpoints; normalize API JSON errors

Changes included:

- Remove development/test endpoints under `src/app/api/test/*` (service-auth, db-check, headers, marcar-pago-pagado).
  Reason: These are debug/Retool helper endpoints that should not be exposed in production.

- Normalize admin layout:
  - Fixed duplicate default exports in `src/app/admin/layout.tsx` and consolidated the admin UI under `/admin`.
  - Converted group admin pages `src/app/(admin)/*` into minimal redirect wrappers to `/admin/*` to prevent navbar leakage.

- Normalize API contracts to JSON-only error responses across multiple routes:
  - `src/app/api/clientes/*`, `src/app/api/contratos/*`, `src/app/api/motos/*`, `src/app/api/mp/*`, `src/app/api/dashboard/route.ts`, `src/app/api/facturas/[id]/pdf/route.ts`, etc.
  - Reason: ensure consistent API contract for clients and Retool.

- Ensure single Prisma client usage (`src/lib/prisma.ts`) verified and unchanged.

- Add patches:
  - `patches/0001-proposed-deletions.md` — list of proposed deletions and rationale.
  - `patches/0001-delete-test-endpoints.sh` — script to remove test endpoints (already executed in this branch).
  - `patches/0002-prisma-schema-proposals.md` — proposals for schema enums and normalization (requires review and migration plan).

Notes and next steps:

- I did not change DB schema or run migrations. Any Prisma schema changes must be discussed and applied with migration plans.
- I recommend reviewing the removed test endpoints in `patches/0001-proposed-deletions.md` before merging.
- After merge, run locally:

```bash
npm install
npm run build
# run tests if available
```

- Deploy preview and verify:
  - `/login` shows public layout without admin navbar.
  - `/admin/*` pages are protected by middleware and render admin UI.
  - Retool: update Base URL to `https://alquiler-motos.vercel.app` after deploy and run `scripts/check_endpoints.sh`.

If you want, I can also follow up to:
- Apply `prisma/schema.prisma` enum changes as a separate PR with migration scripts.
- Consolidate role constants and enforce middleware for `/api/admin/*` and `/api/client/*`.
