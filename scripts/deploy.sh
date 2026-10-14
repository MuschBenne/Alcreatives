#!/usr/bin/env bash
#
# Build, prove the media origin landed, drop the media, deploy, purge.
#
# Why this is a script and not a chain of && in package.json: wrangler needs
# CLOUDFLARE_API_TOKEN in the environment. A terminal running a deploy by hand
# is not always interactive, and an agent's shell never is, so wrangler cannot
# fall back to a browser login — it exits with "In a non-interactive
# environment, it's necessary to set a CLOUDFLARE_API_TOKEN".
#
# It used to find one by accident: the token lived in .env.local, and Next loads
# that file into process.env during the build. Moving it to .env.tooling — so
# the OpenNext adapter would stop baking it into the deployed Worker — took it
# away from wrangler at the same time, and the next deploy failed at the upload
# step with the build already done.
#
# Sourcing it here gives wrangler the credential without putting it back in a
# file the adapter reads: extractProjectEnvVars reads .env, .env.{mode} and
# .env.local from disk, never the environment, so nothing lands in the bundle.
# scripts/check-media-origin.mjs greps the built output rather than the
# environment for the same reason: only the build proves what was inlined.

set -euo pipefail
cd "$(dirname "$0")/.."

# So the binaries resolve when this is run directly and not through npm.
export PATH="$PWD/node_modules/.bin:$PATH"

if [ ! -f .env.tooling ]; then
  echo "scripts/deploy.sh: .env.tooling is missing." >&2
  echo "It holds CLOUDFLARE_API_TOKEN, which wrangler needs to upload." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env.tooling
set +a

opennextjs-cloudflare build
node scripts/check-media-origin.mjs

# R2 serves /media, and unlike Workers static assets it answers Range requests,
# so video streams instead of downloading whole. Dropping the folder is also
# what keeps the upload under the size limit.
rm -rf .open-next/assets/media

opennextjs-cloudflare deploy
node scripts/purge-cache.mjs
