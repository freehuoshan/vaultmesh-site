#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const POSTS_DIR = path.join(ROOT, 'blog/_posts');
const OUT_DIR = path.join(ROOT, 'blog/posts');
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'blog/template.html'), 'utf8');
const SITE_URL = 'https://vaultmesh.codeblog.net';
const COVERS_DIR = path.join(ROOT, 'blog/posts/covers');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(COVERS_DIR, { recursive: true });

marked.setOptions({ headerIds: false, mangle: false });

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const toDate = (d) => {
  if (d instanceof Date) return d;
  // YAML may parse YYYY-MM-DD as a Date; otherwise treat as ISO string
  return new Date(`${String(d).slice(0, 10)}T00:00:00Z`);
};

const isoDate = (d) => toDate(d).toISOString().slice(0, 10);

const formatDate = (d) =>
  toDate(d).toLocaleDateString('en-US', {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric',
  });

const renderTags = (tags) =>
  tags.map((t) => ` <span class="tag">${escapeHtml(t)}</span>`).join('');

const TAG_ACCENTS = {
  breaches:           { bar: '#e05252', grad1: '#1f0a0a', grad2: '#3d1010' },
  phishing:           { bar: '#d97706', grad1: '#1a1000', grad2: '#3a2200' },
  '2fa':              { bar: '#059669', grad1: '#001a12', grad2: '#003326' },
  habits:             { bar: '#7c3aed', grad1: '#0e0a1f', grad2: '#1c1040' },
  myths:              { bar: '#0891b2', grad1: '#001519', grad2: '#002b33' },
  'password-managers':{ bar: '#4f46e5', grad1: '#0a0a1f', grad2: '#141438' },
  passwords:          { bar: '#2f78e6', grad1: '#0d2244', grad2: '#1b3f6d' },
  accounts:           { bar: '#2f78e6', grad1: '#0d2244', grad2: '#1b3f6d' },
};

function accentForTags(tags) {
  for (const t of (tags || [])) {
    if (TAG_ACCENTS[t]) return TAG_ACCENTS[t];
  }
  return TAG_ACCENTS.passwords;
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length > maxChars && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function generateCoverSVG(title, date, tags) {
  const dateStr = formatDate(date);
  const tagStr = (tags || []).slice(0, 3).join(' · ');
  const { bar, grad1, grad2 } = accentForTags(tags);
  const lines = wrapText(title, 28);
  const fontSize = lines.length >= 3 ? 50 : 60;
  const lineH = Math.round(fontSize * 1.3);
  const blockH = lines.length * lineH;
  const titleY = Math.round((630 - blockH) / 2) - 20;
  const titleSvg = lines
    .map((l, i) => `  <text x="80" y="${titleY + (i + 1) * lineH}" font-family="Georgia,'Times New Roman',serif" font-size="${fontSize}" fill="#f2f7ff">${escapeHtml(l)}</text>`)
    .join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${grad1}"/>
      <stop offset="100%" stop-color="${grad2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="56" y="56" width="4" height="518" fill="${bar}"/>
  <text x="80" y="100" font-family="'Courier New',Courier,monospace" font-size="13" letter-spacing="4" fill="${bar}" opacity="0.7">PASSWORD SENSE</text>
${titleSvg}
  <text x="80" y="580" font-family="'Courier New',Courier,monospace" font-size="13" fill="#ffffff" opacity="0.3" letter-spacing="1">${escapeHtml(dateStr)}${tagStr ? `  ·  ${escapeHtml(tagStr)}` : ''}</text>
  <text x="1144" y="580" font-family="'Courier New',Courier,monospace" font-size="13" fill="#ffffff" opacity="0.3" text-anchor="end" letter-spacing="1">VAULTMESH</text>
</svg>`;
}

const rfc822 = (d) => toDate(d).toUTCString();

const posts = fs.existsSync(POSTS_DIR)
  ? fs
      .readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
        const { data, content } = matter(raw);
        if (!data.slug) throw new Error(`Missing slug in ${f}`);
        if (!data.date) throw new Error(`Missing date in ${f}`);
        if (!data.title) throw new Error(`Missing title in ${f}`);
        return { ...data, body: marked.parse(content), file: f };
      })
      .sort((a, b) => isoDate(b.date).localeCompare(isoDate(a.date)))
  : [];

// ---- Per-post HTML ----
for (const p of posts) {
  const tags = Array.isArray(p.tags) ? p.tags : [];

  // Generate cover SVG (skip if AI-generated one already exists)
  const svgPath = path.join(COVERS_DIR, `${p.slug}.svg`);
  const pngPath = path.join(COVERS_DIR, `${p.slug}.png`);
  if (!fs.existsSync(svgPath)) {
    fs.writeFileSync(svgPath, generateCoverSVG(p.title, p.date, tags));
  }

  // Convert SVG → PNG via headless Chromium (Twitter/OG requires PNG)
  spawnSync('chromium-browser', [
    '--headless=new', '--disable-gpu',
    `--screenshot=${pngPath}`,
    '--window-size=1200,630',
    `file://${svgPath}`,
  ], { stdio: 'pipe' });

  const coverUrl = `${SITE_URL}/blog/posts/covers/${p.slug}.png`;
  const coverImg = `<img class="blog-cover-img" src="/blog/posts/covers/${escapeHtml(p.slug)}.svg" alt="" aria-hidden="true">`;
  const postUrl = `${SITE_URL}/blog/posts/${p.slug}.html`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(postUrl)}`;

  const html = TEMPLATE
    .replaceAll('{{title}}', escapeHtml(p.title))
    .replaceAll('{{date}}', formatDate(p.date))
    .replaceAll('{{excerpt}}', escapeHtml(p.excerpt || ''))
    .replaceAll('{{tags}}', renderTags(tags))
    .replaceAll('{{og_image}}', escapeHtml(coverUrl))
    .replaceAll('{{cover_img}}', coverImg)
    .replaceAll('{{tweet_url}}', tweetUrl)
    .replaceAll('{{content}}', p.body);
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.html`), html);
}

// ---- Index page ----
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Sense — VaultMesh</title>
  <meta name="description" content="Plain-English notes on password safety and account security, from the team behind VaultMesh.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="alternate" type="application/rss+xml" title="VaultMesh Blog" href="/blog/feed.xml">
  <style>
    .blog-list { max-width: 880px; margin: 0 auto; padding: 56px 24px 80px; }
    .blog-list-header { margin-bottom: 48px; }
    .blog-list-header .section-label { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink3); margin-bottom: 12px; }
    .blog-list-header h1 { font-family: var(--serif); font-size: clamp(32px, 5vw, 48px); font-weight: 400; line-height: 1.1; margin: 0 0 16px; color: var(--ink); }
    .blog-list-header p { font-family: var(--sans); font-size: 17px; font-weight: 300; color: var(--ink2); margin: 0; max-width: 560px; line-height: 1.6; }
    .blog-card { display: block; padding: 28px 0; border-top: 1px solid var(--line); text-decoration: none; transition: background 0.15s; }
    .blog-card:hover { background: var(--bg2); margin: 0 -24px; padding-left: 24px; padding-right: 24px; }
    .blog-card-meta { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink3); margin-bottom: 8px; }
    .blog-card-title { font-family: var(--serif); font-size: 22px; font-weight: 400; color: var(--ink); margin: 0 0 8px; line-height: 1.3; }
    .blog-card-excerpt { font-family: var(--sans); font-size: 15px; font-weight: 300; color: var(--ink2); margin: 0; line-height: 1.6; }
    .blog-card-tag { display: inline-block; padding: 1px 7px; border: 1px solid var(--line); border-radius: 999px; margin-left: 6px; }
    .blog-card-cover { width: 100%; height: auto; display: block; border-radius: 6px; margin-bottom: 14px; }
    .blog-empty { padding: 80px 0; text-align: center; color: var(--ink3); font-family: var(--sans); }
    .blog-empty .blog-empty-hint { font-family: var(--mono); font-size: 12px; margin-top: 12px; }
    .blog-rss { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink3); margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--line); }
    .blog-rss a { color: var(--primary); text-decoration: none; }
  </style>
</head>
<body>

<nav class="site-nav">
  <a class="nav-brand" href="/index.html">
    <img src="/img/vaultmesh-app-icon.png" alt="" class="nav-brand-icon-img" aria-hidden="true">
    <span class="nav-brand-name">VaultMesh</span>
  </a>
  <ul class="nav-links">
    <li><a href="/index.html#features">Features</a></li>
    <li><a href="/index.html#how-it-works">How It Works</a></li>
    <li><a href="/index.html#download">Download</a></li>
    <li><a href="/relay.html">Relay Guide</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li><a href="/index.html#download" class="nav-cta">Get VaultMesh</a></li>
  </ul>
</nav>

<main class="blog-list">
  <header class="blog-list-header">
    <div class="section-label">Password Sense</div>
    <h1>Notes on password sense</h1>
    <p>Plain-English notes on password safety, account security, and the small habits that actually keep your accounts safe online. Published by the team behind VaultMesh.</p>
  </header>

  ${posts.length === 0
    ? `<div class="blog-empty">No posts yet.<div class="blog-empty-hint">Drop a Markdown file in <code>blog/_posts/</code> and run <code>node scripts/build-blog.mjs</code>.</div></div>`
    : posts
        .map(
          (p) => `<a class="blog-card" href="/blog/posts/${escapeHtml(p.slug)}.html">
    <img class="blog-card-cover" src="/blog/posts/covers/${escapeHtml(p.slug)}.svg" alt="" aria-hidden="true">
    <div class="blog-card-meta">${formatDate(p.date)}${(p.tags || []).map((t) => `<span class="blog-card-tag">${escapeHtml(t)}</span>`).join('')}</div>
    <h2 class="blog-card-title">${escapeHtml(p.title)}</h2>
    <p class="blog-card-excerpt">${escapeHtml(p.excerpt || '')}</p>
  </a>`,
        )
        .join('\n  ')}

  <div class="blog-rss"><a href="/blog/feed.xml">RSS feed →</a></div>
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <div class="footer-brand-name">VaultMesh</div>
      <div class="footer-brand-desc">Private password manager for desktop and mobile with local-first storage and end-to-end encryption.</div>
      <div class="crypto-chips">
        <span class="chip">Argon2id</span>
        <span class="chip">XChaCha20</span>
        <span class="chip">X25519</span>
        <span class="chip">Ed25519</span>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Product</div>
      <ul class="footer-links">
        <li><a href="/index.html#features">Features</a></li>
        <li><a href="/index.html#how-it-works">How It Works</a></li>
        <li><a href="/index.html#download">Download</a></li>
        <li><a href="/relay.html">Relay Guide</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Resources</div>
      <ul class="footer-links">
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/downloads/checksums.txt">Checksums</a></li>
        <li><a href="/downloads/desktop/">Desktop Packages</a></li>
        <li><a href="/downloads/relay/">Relay Packages</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Legal</div>
      <ul class="footer-links">
        <li><a href="/privacy.html">Privacy Policy</a></li>
        <li><a href="mailto:free.huoshan@gmail.com">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">&copy; 2026 VaultMesh. All rights reserved.</span>
    <span class="footer-copy"><a href="mailto:free.huoshan@gmail.com" style="color:inherit;text-decoration:none;">free.huoshan@gmail.com</a></span>
  </div>
</footer>

</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'blog/index.html'), indexHtml);

// ---- RSS feed ----
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Password Sense — VaultMesh</title>
  <link>${SITE_URL}/blog/</link>
  <description>Plain-English notes on password safety and account security, from the team behind VaultMesh.</description>
  <language>en</language>
  <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
  ${posts
    .map(
      (p) => `<item>
    <title>${escapeHtml(p.title)}</title>
    <link>${SITE_URL}/blog/posts/${escapeHtml(p.slug)}.html</link>
    <guid isPermaLink="true">${SITE_URL}/blog/posts/${escapeHtml(p.slug)}.html</guid>
    <pubDate>${rfc822(p.date)}</pubDate>
    <description>${escapeHtml(p.excerpt || '')}</description>
  </item>`,
    )
    .join('\n  ')}
</channel>
</rss>
`;
fs.writeFileSync(path.join(ROOT, 'blog/feed.xml'), rss);

console.log(`Built ${posts.length} post(s) → blog/posts/, blog/posts/covers/, blog/index.html, blog/feed.xml`);
