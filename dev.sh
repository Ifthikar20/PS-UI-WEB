#!/usr/bin/env bash
#
# PlayStudy dev runner — one command to boot the web app (and, if present,
# the Django backend) together.
#
#   ./dev.sh           # backend (if found) + web app
#   ./dev.sh web       # web app only
#   ./dev.sh backend   # backend only
#
# Config (override via env):
#   WEB_PORT       default 3000
#   BACKEND_PORT   default 8000
#   BACKEND_DIR    default ../ps-bk-dj
#
set -euo pipefail

WEB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_PORT="${WEB_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
BACKEND_DIR="${BACKEND_DIR:-$WEB_DIR/../ps-bk-dj}"
MODE="${1:-all}"

PIDS=()
cleanup() {
  echo ""
  echo "→ Shutting down…"
  for pid in "${PIDS[@]:-}"; do
    [ -n "${pid:-}" ] && kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# ---------------------------------------------------------------- web app ----
start_web() {
  echo "→ Web app: setting up in $WEB_DIR"
  cd "$WEB_DIR"
  [ -f .env.local ] || { cp .env.example .env.local; echo "  created .env.local"; }
  [ -d node_modules ] || { echo "  installing npm deps…"; npm install --no-fund --no-audit; }
  echo "→ Web app: http://localhost:$WEB_PORT"
  PORT="$WEB_PORT" npm run dev &
  PIDS+=("$!")
}

# ----------------------------------------------------------------- backend ----
start_backend() {
  if [ ! -f "$BACKEND_DIR/manage.py" ]; then
    echo "→ Backend: not found at $BACKEND_DIR — skipping."
    echo "  (set BACKEND_DIR=/path/to/ps-bk-dj to enable, or run it yourself)"
    return
  fi
  echo "→ Backend: setting up in $BACKEND_DIR"
  cd "$BACKEND_DIR"

  # Pin a compatible interpreter: some pinned deps (pydantic-core/PyO3) don't
  # build on Python 3.14 yet, so prefer 3.11–3.13. Override with PYTHON_BIN.
  if [ -z "${PYTHON_BIN:-}" ]; then
    for cand in python3.12 python3.11 python3.13 python3.10 python3; do
      if command -v "$cand" >/dev/null 2>&1; then PYTHON_BIN="$cand"; break; fi
    done
  fi
  echo "  using interpreter: $($PYTHON_BIN --version 2>&1)"

  # Use a local virtualenv so we don't touch the system Python.
  if [ ! -d .venv ]; then
    echo "  creating virtualenv…"
    "$PYTHON_BIN" -m venv .venv
  fi
  # shellcheck disable=SC1091
  source .venv/bin/activate
  echo "  installing python deps…"
  pip install -q -r requirements.txt
  # Default to SQLite locally (base.py otherwise points at Postgres).
  export DATABASE_URL="${DATABASE_URL:-sqlite:///$BACKEND_DIR/db.sqlite3}"
  echo "  applying migrations…"
  python manage.py migrate --noinput
  echo "  seeding demo login credentials…"
  python manage.py seed_demo || echo "  (seed_demo unavailable — skipping)"
  echo "→ Backend: http://localhost:$BACKEND_PORT"
  python manage.py runserver "0.0.0.0:$BACKEND_PORT" &
  PIDS+=("$!")
  deactivate 2>/dev/null || true
  cd "$WEB_DIR"
}

case "$MODE" in
  web)     start_web ;;
  backend) start_backend ;;
  all)     start_backend; start_web ;;
  *)
    echo "Usage: ./dev.sh [all|web|backend]" >&2
    exit 1
    ;;
esac

echo ""
echo "✓ Running. Press Ctrl+C to stop everything."
wait
