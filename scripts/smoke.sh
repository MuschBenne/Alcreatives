#!/usr/bin/env bash
#
# Checks the deployed site rather than the source: every route answers, and
# carries the tags that decide how a link looks when someone shares it.
#
#   scripts/smoke.sh                          # production
#   scripts/smoke.sh http://localhost:3000    # a dev server
#
# Routes come from data/projects.ts, so adding a project extends the run.

set -uo pipefail
cd "$(dirname "$0")/.."

BASE="${1:-https://alcreatives.com}"
failures=0

# Asks the data rather than pattern-matching the file it lives in. The grep this
# replaces took every `slug:` in data/projects.ts, which since the category
# pages were added also matches the three categories — so it tested /work/
# automotive, which is not a route. Those passed against a site that answered
# unknown slugs with a 404 body under a 200 status, which is the very bug the
# category work fixed; once deployed they would have started failing.
routes() {
  printf '%s\n' / /work /about /contact /behind-the-scenes
  # The warning is about data/projects.ts being TypeScript in a package that
  # does not declare "type": "module". Node strips the types and carries on;
  # silenced because it printed four lines into the middle of the results.
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON -e '
    import("./data/projects.ts").then(({ projects, categories }) => {
      for (const project of projects) console.log(`/work/${project.slug}`);
      for (const category of categories) console.log(`/work/category/${category.slug}`);
    });
  '
}

check() {
  local path="$1" url="$BASE$1" body status
  body=$(curl -sS --max-time 60 -w '\n%{http_code}' "$url" 2>/dev/null)
  status="${body##*$'\n'}"
  body="${body%$'\n'*}"

  if [ "$status" != "200" ]; then
    printf '  FAIL %-32s HTTP %s\n' "$path" "$status"
    failures=$((failures + 1))
    return
  fi

  local missing=""
  grep -q 'rel="canonical"' <<<"$body" || missing="$missing canonical"
  grep -q 'property="og:image"' <<<"$body" || missing="$missing og:image"
  grep -q 'property="og:title"' <<<"$body" || missing="$missing og:title"

  if [ -n "$missing" ]; then
    printf '  FAIL %-32s missing:%s\n' "$path" "$missing"
    failures=$((failures + 1))
  else
    printf '  ok   %-32s\n' "$path"
  fi
}

echo "Smoke: $BASE"
while IFS= read -r route; do check "$route"; done < <(routes)

if [ "$failures" -gt 0 ]; then
  echo "  --- $failures route(s) failed"
  exit 1
fi
echo "  --- all routes passed"
