Prisma enums migration instructions (0003)

DO NOT RUN AUTOMATIC MIGRATIONS WITHOUT REVIEW.
This document describes a safe plan to migrate `User.role` and various `estado` string fields to enums.

High level plan

1) Review current distinct values
   - Connect to your DB and run queries to get distinct values for each field:

     -- Roles
     SELECT DISTINCT role FROM "User";

     -- Cliente.estado
     SELECT DISTINCT estado FROM "Cliente";

     -- Contrato.estado
     SELECT DISTINCT estado FROM "Contrato";

     -- Pago.estado
     SELECT DISTINCT estado FROM "Pago";

     -- Factura.afipEstado
     SELECT DISTINCT "afipEstado" FROM "Factura";

   - Confirm values map to the enum names in the proposal. If not, plan value mapping (e.g., 'paid' -> 'pagado').

2) Add schema changes (draft) — already placed in patches/0003-prisma-enums-proposal.patch. Do NOT apply yet.

3) Migration strategy (safe approach):

   Option A (preferred for production with minimal downtime):
   - Create new enum types in DB and new temporary columns, migrate values with SQL, then drop old columns and rename.

     Example (Postgres):

     BEGIN;
     -- create enum types
     CREATE TYPE "Role_enum" AS ENUM ('admin','operador','cliente');
     CREATE TYPE "PagoEstado_enum" AS ENUM ('pendiente','pagado','vencido');
     -- Repeat for other enums as needed

     -- add temporary column using enum type
     ALTER TABLE "User" ADD COLUMN "role_tmp" "Role_enum";

     -- populate mapping (example when DB role values already match)
     UPDATE "User" SET "role_tmp" = role::text::"Role_enum";

     -- If mapping required, do case-by-case updates, e.g.:
     -- UPDATE "User" SET "role_tmp" = 'cliente' WHERE role = 'customer';

     -- once all rows migrated, drop old column, rename new column
     ALTER TABLE "User" DROP COLUMN role;
     ALTER TABLE "User" RENAME COLUMN "role_tmp" TO role;

     COMMIT;

   - Repeat per table/column.

   Option B (schema-first via Prisma migrate):
   - Modify prisma/schema.prisma to include enums.
   - Run `prisma migrate dev --name add-enums` in a safe non-production environment and review the SQL migration.
   - If the generated SQL is not safe for production (it may attempt to ALTER COLUMN TYPE), revert and use Option A manual SQL migration.

4) Post-migration
   - Update application code to import and use `Role` enum types where helpful (TypeScript types) — code changes should already compile as strings but will now be typed via Prisma client.
   - Run tests, and perform smoke tests on staging.

5) Rollback plan
   - Keep backups before applying migrations: `pg_dump` full DB or at least schema+data for affected tables.
   - If anything fails, restore from backup and revert prisma schema changes.

Notes and caveats

- Changing `Factura.pagoId` uniqueness / optionality: current schema has `pagoId String @unique` and required. If some facturas don't have pagos, consider making `pagoId String?` optional and removing `@unique`. That requires data audit first.

- Decimal vs Int: consider if money fields should be `Decimal` to represent currency precisely.

- I can generate a concrete SQL migration script for your DB if you provide the actual distinct values mapping and confirm the target enum names.

If confirm, I will:
- create `patches/0003-prisma-enums-apply.patch` with the raw `schema.prisma` update (already generated), and a recommended SQL migration script `patches/0003-migration-sql.sql` tailored to your current DB values.
- Do NOT run migrations in this environment; I'll provide commands to run locally or in CI.
