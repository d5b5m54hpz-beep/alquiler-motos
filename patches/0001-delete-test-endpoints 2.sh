#!/usr/bin/env bash
set -euo pipefail

# This script deletes the proposed test endpoints. Review before running.

echo "About to git rm proposed test endpoints..."

git rm -v src/app/api/test/service-auth/route.ts
git rm -v src/app/api/test/db-check/route.ts
git rm -v src/app/api/test/headers/route.ts
git rm -v src/app/api/test/marcar-pago-pagado/route.ts

echo "Files removed from index. Commit with:"

echo "  git commit -m \"chore(audit): remove test/debug endpoints (service-auth, db-check, headers, marcar-pago-pagado)\""

echo "Then push branch and open PR as usual."
