#!/usr/bin/env bash
# Print how many Durable Object namespaces your account has, and list the ones
# whose name contains FILTER (default: my-app).
#
# Requires: curl, jq, and these environment variables:
#   CLOUDFLARE_API_TOKEN   API token with Workers Scripts read access
#   CLOUDFLARE_ACCOUNT_ID  Your account ID
#
# Usage: ./count-namespaces.sh [FILTER]
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN}"
: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}"
FILTER="${1:-my-app}"

curl -sf -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
	"https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/durable_objects/namespaces?per_page=1000" |
	jq --arg f "$FILTER" '{
		total: .result_info.total_count,
		matching: [.result[] | select(.name | contains($f)) | .name]
	}'
