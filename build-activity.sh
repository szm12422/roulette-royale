#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
activity_application_id="${1:-}"
if [[ ! "$activity_application_id" =~ ^[0-9]{17,20}$ ]]; then
  echo "Usage: bash build-activity.sh APPLICATION_ID (17-20 digits)" >&2
  exit 1
fi
export VITE_DISCORD_CLIENT_ID="$activity_application_id"
npm ci
npm run build
