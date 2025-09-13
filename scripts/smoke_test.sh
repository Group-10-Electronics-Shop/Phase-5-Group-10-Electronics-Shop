set -euo pipefail

BACKEND_URL="${BACKEND_URL:-}"
FRONTEND_URL="${FRONTEND_URL:-}"

if [ -z "$BACKEND_URL" ] || [ -z "$FRONTEND_URL" ]; then
  echo "ERROR: BACKEND_URL or FRONTEND_URL not set"
  exit 1
fi

# retry helper: tries up to `max` attempts, waiting `delay` seconds between attempts
retry() {
  local url="$1"
  local max=12
  local delay=5
  local i=0
  while [ "$i" -lt "$max" ]; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    echo "$(date --iso-8601=seconds) - $url -> $status"
    if [ "$status" = "200" ]; then
      return 0
    fi
    i=$((i+1))
    sleep "$delay"
  done
  return 1
}

echo "Checking BACKEND health at $BACKEND_URL/health ..."
if ! retry "$BACKEND_URL/health"; then
  echo "ERROR: Backend health check failed"
  exit 1
fi

echo "Checking FRONTEND root at $FRONTEND_URL ..."
if ! retry "$FRONTEND_URL"; then
  echo "ERROR: Frontend root check failed"
  exit 1
fi

echo "Smoke tests passed"