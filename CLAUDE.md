# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VaultMesh is a private password manager. This repo is its **static marketing/documentation site**, hosted on GitHub Pages at `vaultmesh.codeblog.net`. There is no build system, no framework, and no dependencies — just plain HTML and CSS.

## Development

Open any `.html` file in a browser directly, or serve locally with any static file server:

```sh
python3 -m http.server 8080
```

No compilation, bundling, or installation step is needed.

## Architecture

Three HTML pages share a single stylesheet (`css/style.css`):

- **index.html** — Product landing page: feature highlights, sync explainer, and download buttons
- **relay.html** — Self-hosting guide for the encrypted sync relay server (config tables, systemd examples, health check endpoints)
- **privacy.html** — Privacy policy

All pages use the same `<nav class="site-nav">` header and `<footer class="site-footer">` footer markup, so changes to navigation or footer must be applied to each HTML file individually.

## Downloads Directory

`downloads/` contains the actual release artifacts served directly from the site:

- `downloads/desktop/` — macOS (.dmg), Linux (.deb, .AppImage), Windows (.exe) installers
- `downloads/extensions/` — Chrome (.zip) and Firefox (.xpi) browser extensions
- `downloads/relay/` — Relay server binaries for Linux, macOS, Windows
- `downloads/checksums.txt` — SHA checksums for all artifacts

When publishing a new release, add the new binaries and update `checksums.txt`. Download button hrefs in `index.html` point directly into this directory.

## Blog Module

Unlike the rest of the site, the blog has a minimal local build step. Markdown source in `blog/_posts/` is compiled to HTML by `scripts/build-blog.mjs` (uses `gray-matter` + `marked`). Generated files (`blog/index.html`, `blog/posts/*.html`, `blog/feed.xml`) are committed to the repo so GitHub Pages can serve them statically — there is no CI build.

Workflow:

- Drafts go to `blog/_drafts/` (ignored by the builder). An agent following `prompts/generate-post.md` picks the next queued topic from `blog/topics.json`, writes a draft, and marks the topic `drafted`.
- A human reviews / edits the draft locally.
- `scripts/publish.sh <YYYY-MM-DD-slug>` performs `git mv _drafts → _posts`, rebuilds, commits, and pushes. GitHub Pages serves the new post.

`blog/STYLE.md` is the writing contract — voice, structure, hard rules, crypto facts that must not be contradicted. Read it before editing or generating any post. `blog/template.html` is the per-post HTML wrapper; it loads `/css/style.css` and duplicates the main site's nav/footer to keep visual parity.

Run `node scripts/build-blog.mjs` after any change to `_posts/`, `template.html`, or the build script itself.
