#!/usr/bin/env bash
# Simple endpoint checker for alquiler-motos
# Usage:
#   ALQUILER_URL="https://alquiler-motos.vercel.app" ./scripts/check_endpoints.sh

set -euo pipefail

BASE_URL=${ALQUILER_URL:-"https://alquiler-motos.vercel.app"}

check() {
  local path=$1
  url="$BASE_URL$path"
  echo "Checking $url ..."
  http_status=$(curl -s -o /tmp/resp.txt -w "%{http_code}" -H "Accept: application/json" "$url")
  content_type=$(file -b --mime-type /tmp/resp.txt || true)
  if [ "$http_status" -ge 200 ] && [ "$http_status" -lt 300 ]; then
    if [[ "$content_type" == "application/json" ]]; then
      echo "OK: $path -> $http_status, $content_type"
      return 0
    else
      echo "WARN: $path returned $content_type (HTTP $http_status)"
      echo "Response preview:"; sed -n '1,10p' /tmp/resp.txt
      return 2
    fi
  else
    echo "FAIL: $path -> HTTP $http_status"
    echo "Response preview:"; sed -n '1,10p' /tmp/resp.txt
    return 1
  fi
}

any_fail=0

paths=(
  "/api/motos"
  "/api/alertas"
  "/api/contratos"
  "/api/pagos"
)

for p in "${paths[@]}"; do
  if ! check "$p"; then
    any_fail=1
  fi
done

if [ "$any_fail" -ne 0 ]; then
  echo "Some endpoints failed or returned non-JSON." >&2
  exit 1
fi

echo "All endpoints returned JSON and 2xx HTTP status."
exit 0
