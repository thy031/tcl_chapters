#!/usr/bin/env bash
# Serve the course site on a local port (default 8080).
cd "$(dirname "$0")"
PORT="${PORT:-8080}"
echo "Tcl/Tk course: http://127.0.0.1:${PORT}/"
exec python3 -m http.server "$PORT" --bind 0.0.0.0
