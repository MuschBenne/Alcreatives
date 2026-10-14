#!/usr/bin/env bash
#
# rclone against the R2 account, with nothing written to disk.
#
#   scripts/r2.sh lsd r2:
#   scripts/r2.sh copy public/media r2:alvin-media/v1/media --progress
#
# The S3 keys are derived from CLOUDFLARE_API_TOKEN in .env.tooling on every run:
# the access key id is the token's id, the secret is the SHA-256 of its value.
# https://developers.cloudflare.com/r2/api/tokens/#get-s3-api-credentials-from-an-api-token

set -euo pipefail
cd "$(dirname "$0")/.."

# .env.tooling, deliberately not .env.local. The OpenNext adapter merges .env,
# .env.{mode} and .env.local into the Worker bundle it deploys, so a token kept
# in .env.local ships to production inside the script — and this one is not a
# Worker secret, so nothing shadows it there. .env.tooling still matches the
# .env* rule in .gitignore, but neither the adapter nor Next reads it.
if [ ! -f .env.tooling ]; then
  echo "scripts/r2.sh: .env.tooling is missing." >&2
  echo "It holds CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID." >&2
  exit 1
fi

# Sourced rather than grep | xargs, which split on whitespace and mangled any
# value containing a space.
set -a
# shellcheck disable=SC1091
. ./.env.tooling
set +a

# Which verify endpoint applies depends on how the token was created: an
# account-owned token answers under /accounts/<id>/tokens/verify, a token made
# under My Profile answers under /user/tokens/verify, and the wrong one returns
# 401. This only knew the account one, so rotating the token broke every upload
# with a curl 401 followed by a Python traceback about empty input.
verify_token_id() {
  local url id
  for url in \
    "https://api.cloudflare.com/client/v4/user/tokens/verify" \
    "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/tokens/verify"
  do
    id=$(
      curl -fsS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" "$url" 2>/dev/null |
        python3 -c 'import sys, json; print(json.load(sys.stdin)["result"]["id"])' 2>/dev/null
    ) || continue
    if [ -n "$id" ]; then
      printf %s "$id"
      return 0
    fi
  done
  return 1
}

if ! token_id=$(verify_token_id); then
  echo "scripts/r2.sh: CLOUDFLARE_API_TOKEN was not accepted." >&2
  echo "Neither /user/tokens/verify nor /accounts/<id>/tokens/verify took it." >&2
  echo "Check the value in .env.tooling, and that the token has R2 Object Read & Write." >&2
  exit 1
fi

export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$token_id"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=$(printf %s "$CLOUDFLARE_API_TOKEN" | shasum -a 256 | cut -d' ' -f1)
export RCLONE_CONFIG_R2_ENDPOINT="https://$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_ACL=private
# The bucket is created with wrangler; never let an upload create one by typo.
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true
# Everything is configured above, so there is no config file to look for.
export RCLONE_CONFIG=/dev/null

exec rclone "$@"
