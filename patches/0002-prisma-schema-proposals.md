Prisma schema normalization proposals (0002)

Goal: Propose minimal, safe changes to make domain models explicit and consistent. Do NOT apply migrations automatically; review and plan migration steps before applying.

Proposed changes summary:

1) Add `Role` enum and use it on `User.role`:

  enum Role {
    admin
    operador
    cliente
  }

  model User {
    // ...
    role Role @default(cliente)
  }

Rationale: Enums enforce valid role values across the codebase and enable clearer checks in TypeScript/Prisma.

2) Convert `estado` fields to enums where applicable:

- `Cliente.estado` -> enum ClienteEstado { pendiente, aprobado, rechazado }
- `Contrato.estado` -> enum ContratoEstado { activo, finalizado, cancelado, pendiente }
- `Pago.estado` -> enum PagoEstado { pendiente, pagado, vencido }
- `Factura.afipEstado` -> enum AfipEstado { pendiente, emitida, rechazado }

Rationale: Standardize allowed states and avoid magic strings.

3) Consider `monto` types:

- Currently `Pago.monto` and `Factura.monto` are `Int`. If you need cents/decimals, consider `Decimal` (requires `@db.Decimal` or prisma's Decimal support).

4) Relations & required fields:

- `Factura.pagoId` is `String @unique` and required. Confirm that every factura must reference a pago; if not, make it optional.
- `Cliente.email` is unique and stored twice (in `User.email` and `Cliente.email`). Consider removing `Cliente.email` duplication and derive via relation with `User` when needed, or keep for denormalized read performance but ensure consistency.

5) Indexes & performance:

- Add indexes on frequent query fields like `Contrato.clienteId`, `Pago.estado`, `Factura.emitidaAt` (if missing). Prisma creates FK indexes automatically for relation fields.

Migration notes:
- Converting string fields to enums requires creating a migration and mapping existing values.
- Converting `monto` Int -> Decimal also requires migration and data transformation.

Next steps I can take if you want me to proceed:
- Generate a patch that updates `prisma/schema.prisma` with the Role and estado enums (no migrations applied here).
- Search codebase for usages of role strings and prepare a quick find/replace plan to use enum values.

Confirm if you want me to create a patch for `schema.prisma` (I will not run migrations in this environment).