Proposed deletions (0001)

Objective: Remove clearly-identifiable test and Retool-specific debug endpoints that should not be present in production. These deletions are proposed for review only; do NOT run the accompanying script until you confirm.

Files proposed for deletion:

- src/app/api/test/service-auth/route.ts
  Reason: Retool-specific test endpoint that exposes environment variable matching logic (RETOOL_API_KEY). This is a security risk and a Retool hack; remove from production.

- src/app/api/test/db-check/route.ts
  Reason: Development-only DB health check that should be part of migration/tests, not an exposed API route.

- src/app/api/test/headers/route.ts
  Reason: Utility endpoint for debugging request headers. Not for production.

- src/app/api/test/marcar-pago-pagado/route.ts
  Reason: Development helper that mutates production data; dangerous in deployed environments.

Notes:
- I did not delete `src/app/api/public/*` endpoints because they are used by Retool as public read-only endpoints.
- I did not delete any scripts or seed files; those can remain for development unless you want to archive them.
- Once you review and confirm, run the provided script `patches/0001-delete-test-endpoints.sh` to remove the files and commit.

If you want, I can also prepare a PR with these deletions after you confirm.
