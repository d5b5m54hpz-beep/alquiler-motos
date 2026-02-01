Proposed deletion: remove src/app/(admin) group

Rationale:
- The `(admin)` group contained redirect wrappers and a legacy layout that caused the admin navbar to leak into public routes.
- The canonical admin UI now lives under `src/app/admin/` with a dedicated `layout.tsx` and login.
- Keeping `(admin)` duplicates adds maintenance burden and confusion. Redirects were already migrated; deleting these files cleans the tree.

Files removed in this batch:
- src/app/(admin)/layout.tsx
- src/app/(admin)/page.tsx
- src/app/(admin)/alertas/page.tsx
- src/app/(admin)/clientes/page.tsx
- src/app/(admin)/contratos/page.tsx
- src/app/(admin)/dashboard/page.tsx
- src/app/(admin)/dashboard/charts/page.tsx
- src/app/(admin)/dashboard/charts/mes/page.tsx
- src/app/(admin)/facturas/page.tsx
- src/app/(admin)/motos/page.tsx
- src/app/(admin)/pagos/page.tsx
- src/app/(admin)/usuarios/page.tsx

If you need these files preserved, they are available in the branch `chore/audit-cleanup` history before merging; we can also archive them instead of deleting. Once merged, the files will be removed from main.
