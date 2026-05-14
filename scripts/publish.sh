#!/usr/bin/env bash
# Publish a reviewed draft.
# Usage: ./scripts/publish.sh <YYYY-MM-DD-slug>
# Example: ./scripts/publish.sh 2026-05-15-spake2-pairing

set -euo pipefail

slug="${1:?usage: publish.sh <YYYY-MM-DD-slug>}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="${ROOT}/blog/_drafts/${slug}.md"
dst="${ROOT}/blog/_posts/${slug}.md"

if [[ ! -f "$src" ]]; then
  echo "draft not found: $src" >&2
  exit 1
fi

cd "$ROOT"
git mv "$src" "$dst"
node scripts/build-blog.mjs
git add blog/_posts blog/posts blog/index.html blog/feed.xml blog/topics.json
git commit -m "blog: publish ${slug}"
git push

# Extract the slug-only portion (everything after YYYY-MM-DD-)
post_slug="${slug#????-??-??-}"
echo ""
echo "Published: https://vaultmesh.codeblog.net/blog/posts/${post_slug}.html"
