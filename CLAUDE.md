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
