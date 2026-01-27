# Backend Architecture Refactored

## User + Cliente Model

**User** represents authenticated users (OAuth or credentials):
- `id`, `email`, `name`, `image`, `provider`, `password?`, `phone?`, `phoneVerifiedAt?`, `role` (admin | operador | cliente)
- Linked 1:1 with `Cliente`

**Cliente** is auto-created on first login for role "cliente":
- `id`, `userId`, `nombre`, `dni?`, `telefono?`, `email?`
- Cannot be created manually from admin tools (POST disabled)

## Authentication

Auth.js (NextAuth v5) with providers:
- Google
- Apple
- Facebook
- Credentials (email/password)

On first login:
- OAuth users upserted with role `cliente`
- `Cliente` record auto-created via `signIn` event

## Phone Verification

After login, if `phoneVerifiedAt` is null:
- POST `/api/verificar-telefono` → sends OTP (demo: returns code)
- POST `/api/verificar-telefono/confirmar` → validates code, updates `phoneVerifiedAt`

## Role-Based Access

Middleware protects all `/api/*` routes. `requireRole()` returns `{ error, role, userId }`.

**Roles:**
- `admin`: full access
- `operador`: limited (no delete)
- `cliente`: read-only own data

**API behavior by role:**
- `cliente` sees only their own `Cliente`, `Contratos`, `Pagos`, `Facturas`, `Alertas`
- `admin` and `operador` see all

## Removed Manual Cliente Creation

`POST /api/clientes` returns 405.
`PUT /api/clientes/:id` and `DELETE /api/clientes/:id` return 405.

## Environment Variables

Add OAuth provider credentials:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
```

## Migration

Run:
```bash
npx prisma migrate dev --name add_user_model
npx prisma generate
```

## Notes

- Old `Usuario` model removed; replaced with `User`
- Existing seed scripts must be updated to use `User` model
- For production phone verification, integrate a WhatsApp API (Twilio, etc.)

